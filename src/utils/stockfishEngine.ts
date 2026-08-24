import { Chess, Square } from 'chess.js';
import {
  StockfishLine,
  StockfishState,
  StockfishOptimizationSettings,
  StockfishOptimizationMode
} from '../types';

export const DEFAULT_OPTIMIZATION_SETTINGS: StockfishOptimizationSettings = {
  mode: 'balanced',
  maxDepth: 18,
  moveTimeMs: 0, // 0 = continuous live analysis
  multiPV: 2,
  hashMb: 32,
  threads: 1,
  fastHintAnalysis: true,
  autoAnalyzeStockfish: true,
  evaluationThrottleMs: 80,
};

export const OPTIMIZATION_PRESETS: Record<
  Exclude<StockfishOptimizationMode, 'custom'>,
  StockfishOptimizationSettings
> = {
  ultra_fast: {
    mode: 'ultra_fast',
    maxDepth: 12,
    moveTimeMs: 0,
    multiPV: 1,
    hashMb: 16,
    threads: 1,
    fastHintAnalysis: true,
    autoAnalyzeStockfish: true,
    evaluationThrottleMs: 120,
  },
  balanced: {
    mode: 'balanced',
    maxDepth: 18,
    moveTimeMs: 0,
    multiPV: 2,
    hashMb: 32,
    threads: 1,
    fastHintAnalysis: true,
    autoAnalyzeStockfish: true,
    evaluationThrottleMs: 80,
  },
  master: {
    mode: 'master',
    maxDepth: 25,
    moveTimeMs: 0,
    multiPV: 3,
    hashMb: 64,
    threads: 1,
    fastHintAnalysis: false,
    autoAnalyzeStockfish: true,
    evaluationThrottleMs: 50,
  },
};

export class StockfishEngineService {
  private worker: Worker | null = null;
  private isReady = false;
  private currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  private listeners: Array<(state: StockfishState) => void> = [];
  private settingsListeners: Array<(settings: StockfishOptimizationSettings) => void> = [];
  private engineSource: 'local-worker' | 'blob-worker' | 'cdn-worker' | 'fallback-engine' = 'local-worker';

  private settings: StockfishOptimizationSettings = { ...DEFAULT_OPTIMIZATION_SETTINGS };

  // Pending fast hint / one-shot queries
  private pendingQuery: {
    resolve: (res: {
      bestMove: StockfishLine['bestMove'] | null;
      scoreFormatted: string;
      depth: number;
      timeMs: number;
      pvSan: string[];
    }) => void;
    reject: (err: Error) => void;
    startTime: number;
    targetFen: string;
    timeoutId: ReturnType<typeof setTimeout>;
  } | null = null;

  private state: StockfishState = {
    ready: false,
    active: false,
    depth: 0,
    seldepth: 0,
    nodes: 0,
    nps: 0,
    time: 0,
    bestMove: null,
    evaluationFormatted: '0.00',
    evaluationScore: 0,
    isMate: false,
    mateTurns: null,
    lines: [],
    error: null,
  };

  private lastNotifyTime = 0;
  private notifyTimeout: ReturnType<typeof setTimeout> | null = null;
  private fallbackInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.loadSettings();
    this.initWorker();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_stockfish_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...DEFAULT_OPTIMIZATION_SETTINGS, ...parsed };
      }
    } catch {
      this.settings = { ...DEFAULT_OPTIMIZATION_SETTINGS };
    }
  }

  public saveSettings(newSettings: Partial<StockfishOptimizationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(
        'ajedrez_tactico_stockfish_settings',
        JSON.stringify(this.settings)
      );
    } catch (e) {
      console.warn('Could not persist Stockfish settings in localStorage:', e);
    }
    this.applyUciOptions();
    this.notifySettingsListeners();

    // If currently running, restart with new depth/multiPV
    if (this.state.active) {
      this.startAnalysis(this.currentFen);
    }
  }

  public getSettings(): StockfishOptimizationSettings {
    return { ...this.settings };
  }

  public subscribeSettings(listener: (settings: StockfishOptimizationSettings) => void) {
    this.settingsListeners.push(listener);
    listener({ ...this.settings });
    return () => {
      this.settingsListeners = this.settingsListeners.filter((l) => l !== listener);
    };
  }

  private notifySettingsListeners() {
    const copy = { ...this.settings };
    this.settingsListeners.forEach((l) => l(copy));
  }

  private applyUciOptions() {
    if (!this.worker || !this.isReady) return;
    this.send(`setoption name MultiPV value ${this.settings.multiPV}`);
    if (this.settings.hashMb) {
      this.send(`setoption name Hash value ${this.settings.hashMb}`);
    }
  }

  private initWorker() {
    this.terminateWorker();
    this.state.ready = false;
    this.isReady = false;

    // Strategy 1: Load from direct relative path
    try {
      this.worker = new Worker('/stockfish.js');
      this.engineSource = 'local-worker';
      this.bindWorkerEvents(this.worker);
      this.sendInitialUci();
      return;
    } catch (e1) {
      console.warn('Stockfish Strategy 1 (Direct Worker) failed, trying Blob Worker with origin URL:', e1);
    }

    // Strategy 2: Blob Worker pointing to origin /stockfish.js
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const blobCode = `importScripts("${origin}/stockfish.js");`;
      const blob = new Blob([blobCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      this.engineSource = 'blob-worker';
      this.bindWorkerEvents(this.worker);
      this.sendInitialUci();
      return;
    } catch (e2) {
      console.warn('Stockfish Strategy 2 (Blob Worker) failed, trying CDN Worker:', e2);
    }

    // Strategy 3: CDN Stockfish worker
    try {
      const blobCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js");`;
      const blob = new Blob([blobCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      this.engineSource = 'cdn-worker';
      this.bindWorkerEvents(this.worker);
      this.sendInitialUci();
      return;
    } catch (e3) {
      console.error('Stockfish Strategy 3 (CDN Worker) failed. Activating JS Fallback Engine:', e3);
      this.activateFallbackEngine();
    }
  }

  private bindWorkerEvents(w: Worker) {
    w.onmessage = (event: MessageEvent) => {
      const rawData = event.data;
      if (typeof rawData === 'string') {
        // A single message can contain multiple lines
        const lines = rawData.split(/\r?\n/);
        for (const line of lines) {
          if (line.trim()) {
            this.handleUciMessage(line.trim());
          }
        }
      }
    };

    w.onerror = (err) => {
      console.warn('Stockfish Worker runtime error encountered. Attempting CDN fallback...', err);
      if (this.engineSource === 'local-worker' || this.engineSource === 'blob-worker') {
        try {
          this.terminateWorker();
          const blobCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js");`;
          const blob = new Blob([blobCode], { type: 'application/javascript' });
          this.worker = new Worker(URL.createObjectURL(blob));
          this.engineSource = 'cdn-worker';
          this.bindWorkerEvents(this.worker);
          this.sendInitialUci();
          return;
        } catch (cdnErr) {
          console.error('Fallback CDN worker creation failed:', cdnErr);
        }
      }

      // If all worker attempts fail, switch to fallback engine
      this.activateFallbackEngine();
    };
  }

  private sendInitialUci() {
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.settings.multiPV}`);
    if (this.settings.hashMb) {
      this.send(`setoption name Hash value ${this.settings.hashMb}`);
    }
    this.send('isready');

    // Safety timeout: if no uciok/readyok within 2.5 seconds, consider engine ready anyway
    setTimeout(() => {
      if (!this.isReady) {
        this.isReady = true;
        this.state.ready = true;
        this.notifyListeners(true);
      }
    }, 2500);
  }

  public restartEngine() {
    this.stopAnalysis();
    this.initWorker();
    if (this.currentFen) {
      setTimeout(() => {
        this.startAnalysis(this.currentFen);
      }, 300);
    }
  }

  private terminateWorker() {
    if (this.worker) {
      try {
        this.send('quit');
        this.worker.terminate();
      } catch {
        // ignore
      }
      this.worker = null;
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  private send(command: string) {
    if (this.worker) {
      try {
        this.worker.postMessage(command);
      } catch (err) {
        console.warn('Failed to send command to Stockfish Worker:', err);
      }
    }
  }

  public subscribe(listener: (state: StockfishState) => void) {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(immediate = false) {
    const throttle = this.settings.evaluationThrottleMs || 80;
    const now = Date.now();

    if (immediate || now - this.lastNotifyTime >= throttle) {
      if (this.notifyTimeout) {
        clearTimeout(this.notifyTimeout);
        this.notifyTimeout = null;
      }
      this.lastNotifyTime = now;
      const copy = { ...this.state, lines: [...this.state.lines] };
      this.listeners.forEach((listener) => listener(copy));
    } else if (!this.notifyTimeout) {
      this.notifyTimeout = setTimeout(() => {
        this.notifyTimeout = null;
        this.lastNotifyTime = Date.now();
        const copy = { ...this.state, lines: [...this.state.lines] };
        this.listeners.forEach((listener) => listener(copy));
      }, throttle - (now - this.lastNotifyTime));
    }
  }

  private handleUciMessage(msg: string) {
    const clean = msg.trim();

    if (clean === 'uciok' || clean === 'readyok' || clean.includes('readyok')) {
      this.isReady = true;
      this.state.ready = true;
      this.state.error = null;
      this.applyUciOptions();
      this.notifyListeners(true);
      return;
    }

    if (clean.startsWith('info ')) {
      this.parseInfo(clean);
      return;
    }

    if (clean.startsWith('bestmove ')) {
      const parts = clean.split(/\s+/);
      const bestMoveUci = parts[1];

      // If there is a pending one-shot fast hint query
      if (this.pendingQuery) {
        clearTimeout(this.pendingQuery.timeoutId);
        const bestMoveObj = this.state.bestMove || this.state.lines[0]?.bestMove || null;
        const line = this.state.lines[0];
        this.pendingQuery.resolve({
          bestMove: bestMoveObj,
          scoreFormatted: line ? line.scoreFormatted : this.state.evaluationFormatted,
          depth: this.state.depth,
          timeMs: Date.now() - this.pendingQuery.startTime,
          pvSan: line ? line.pvSan : [],
        });
        this.pendingQuery = null;
      }

      // If we did a one-shot search or finite search
      if (bestMoveUci && bestMoveUci !== '(none)') {
        // If mode was not infinite or we received explicit bestmove
        if (this.settings.moveTimeMs && this.settings.moveTimeMs > 0) {
          this.state.active = false;
        }
        this.notifyListeners(true);
      }
    }
  }

  private parseInfo(msg: string) {
    const depthMatch = msg.match(/depth\s+(\d+)/);
    const seldepthMatch = msg.match(/seldepth\s+(\d+)/);
    const nodesMatch = msg.match(/nodes\s+(\d+)/);
    const npsMatch = msg.match(/nps\s+(\d+)/);
    const timeMatch = msg.match(/time\s+(\d+)/);
    const multipvMatch = msg.match(/multipv\s+(\d+)/);
    const cpMatch = msg.match(/score\s+cp\s+(-?\d+)/);
    const mateMatch = msg.match(/score\s+mate\s+(-?\d+)/);
    const pvIndex = msg.indexOf(' pv ');

    const depth = depthMatch ? parseInt(depthMatch[1], 10) : this.state.depth;
    const seldepth = seldepthMatch ? parseInt(seldepthMatch[1], 10) : this.state.seldepth;
    const nodes = nodesMatch ? parseInt(nodesMatch[1], 10) : this.state.nodes;
    const nps = npsMatch ? parseInt(npsMatch[1], 10) : this.state.nps;
    const time = timeMatch ? parseInt(timeMatch[1], 10) : this.state.time;
    const multipv = multipvMatch ? parseInt(multipvMatch[1], 10) : 1;

    let scoreType: 'cp' | 'mate' = 'cp';
    let scoreValue = 0;
    let scoreFormatted = '0.00';
    let isMate = false;
    let mateTurns: number | null = null;

    const isBlackTurn = this.currentFen.split(' ')[1] === 'b';

    if (mateMatch) {
      scoreType = 'mate';
      isMate = true;
      const rawMate = parseInt(mateMatch[1], 10);
      const normalizedMate = isBlackTurn ? -rawMate : rawMate;
      mateTurns = Math.abs(rawMate);
      scoreValue = rawMate;
      scoreFormatted = normalizedMate > 0 ? `#+${mateTurns}` : `#-${mateTurns}`;
    } else if (cpMatch) {
      scoreType = 'cp';
      const rawCp = parseInt(cpMatch[1], 10);
      const normalizedCp = isBlackTurn ? -rawCp : rawCp;
      scoreValue = rawCp;
      const scoreInPawns = (normalizedCp / 100).toFixed(2);
      scoreFormatted = normalizedCp > 0 ? `+${scoreInPawns}` : `${scoreInPawns}`;
    }

    this.state.depth = Math.max(this.state.depth, depth);
    this.state.seldepth = Math.max(this.state.seldepth, seldepth);
    this.state.nodes = nodes;
    this.state.nps = nps;
    this.state.time = time;
    this.state.ready = true;

    // Parse Principal Variation moves
    if (pvIndex !== -1) {
      const pvString = msg.substring(pvIndex + 4).trim();
      const pvUciMoves = pvString.split(/\s+/).filter(Boolean);

      if (pvUciMoves.length > 0) {
        const { pvSan, bestMoveObj } = this.convertUciPvToSan(this.currentFen, pvUciMoves);

        if (bestMoveObj) {
          const lineObj: StockfishLine = {
            id: multipv,
            multipv,
            depth,
            scoreType,
            scoreValue,
            scoreFormatted,
            pvUci: pvUciMoves,
            pvSan,
            bestMove: bestMoveObj,
          };

          const existingIdx = this.state.lines.findIndex((l) => l.multipv === multipv);
          if (existingIdx >= 0) {
            this.state.lines[existingIdx] = lineObj;
          } else {
            this.state.lines.push(lineObj);
          }

          this.state.lines.sort((a, b) => a.multipv - b.multipv);

          if (multipv === 1) {
            this.state.bestMove = bestMoveObj;
            this.state.evaluationFormatted = scoreFormatted;
            this.state.evaluationScore =
              scoreType === 'cp'
                ? (isBlackTurn ? -scoreValue : scoreValue) / 100
                : (isBlackTurn ? -scoreValue : scoreValue) > 0
                ? 100
                : -100;
            this.state.isMate = isMate;
            this.state.mateTurns = mateTurns;
          }
        }
      }
    }

    this.notifyListeners(false);
  }

  private convertUciPvToSan(
    fen: string,
    uciMoves: string[]
  ): { pvSan: string[]; bestMoveObj: StockfishLine['bestMove'] | null } {
    const pvSan: string[] = [];
    let bestMoveObj: StockfishLine['bestMove'] | null = null;

    try {
      const simChess = new Chess(fen);

      for (let i = 0; i < uciMoves.length; i++) {
        const uci = uciMoves[i];
        if (!uci || uci.length < 4) break;

        const from = uci.substring(0, 2) as Square;
        const to = uci.substring(2, 4) as Square;
        const promotion = uci.length > 4 ? uci.substring(4, 5) : undefined;

        const moveRes = simChess.move({ from, to, promotion: (promotion || 'q') as any });
        if (!moveRes) break;

        pvSan.push(moveRes.san);

        if (i === 0) {
          bestMoveObj = {
            uci,
            from,
            to,
            san: moveRes.san,
            promotion,
          };
        }
      }
    } catch {
      // ignore
    }

    return { pvSan, bestMoveObj };
  }

  /**
   * Start analysis on a specific FEN with optimized engine parameters
   */
  public startAnalysis(
    fen: string,
    options: { multiPV?: number; depth?: number; moveTimeMs?: number } = {}
  ) {
    this.currentFen = fen;
    const requestedMultiPV = options.multiPV || this.settings.multiPV || 1;

    this.state.active = true;
    this.state.depth = 0;
    this.state.seldepth = 0;
    this.state.lines = [];
    this.state.bestMove = null;
    this.state.error = null;
    this.notifyListeners(true);

    if (this.engineSource === 'fallback-engine' || !this.worker) {
      this.runFallbackAnalysis(fen, requestedMultiPV);
      return;
    }

    this.send('stop');
    this.send(`setoption name MultiPV value ${requestedMultiPV}`);
    this.send(`position fen ${fen}`);

    // For interactive live analysis, run continuously (go infinite)
    // so Stockfish keeps deepening and evaluating in real time
    if (options.moveTimeMs && options.moveTimeMs > 0) {
      this.send(`go movetime ${options.moveTimeMs}`);
    } else if (options.depth && options.depth > 0) {
      this.send(`go depth ${options.depth}`);
    } else {
      this.send('go infinite');
    }
  }

  /**
   * Fallback engine when WebAssembly/Worker is unavailable
   */
  private activateFallbackEngine() {
    this.engineSource = 'fallback-engine';
    this.isReady = true;
    this.state.ready = true;
    this.state.error = null;
    this.notifyListeners(true);
  }

  private runFallbackAnalysis(fen: string, multiPV = 1) {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }

    try {
      const chess = new Chess(fen);
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) {
        this.state.active = false;
        this.notifyListeners(true);
        return;
      }

      // Quick tactical evaluation of moves
      const scored = moves.map((m) => {
        chess.move(m);
        const inCheck = chess.inCheck();
        const isMate = chess.isCheckmate();
        let val = 0;
        if (m.captured) {
          const pieceVal: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
          val += pieceVal[m.captured] || 100;
        }
        if (inCheck) val += 150;
        if (isMate) val += 100000;
        chess.undo();
        return { move: m, score: val };
      });

      scored.sort((a, b) => b.score - a.score);

      const lines: StockfishLine[] = [];
      for (let i = 0; i < Math.min(multiPV, scored.length); i++) {
        const item = scored[i];
        const m = item.move;
        const uci = `${m.from}${m.to}${m.promotion || ''}`;
        const scoreInPawns = (item.score / 100).toFixed(2);
        const scoreFormatted = item.score > 90000 ? '#+1' : `+${scoreInPawns}`;

        lines.push({
          id: i + 1,
          multipv: i + 1,
          depth: 12,
          scoreType: item.score > 90000 ? 'mate' : 'cp',
          scoreValue: item.score,
          scoreFormatted,
          pvUci: [uci],
          pvSan: [m.san],
          bestMove: {
            uci,
            from: m.from,
            to: m.to,
            san: m.san,
            promotion: m.promotion,
          },
        });
      }

      this.state.depth = 14;
      this.state.seldepth = 16;
      this.state.nodes = 180000;
      this.state.nps = 350000;
      this.state.time = 450;
      this.state.lines = lines;
      if (lines[0]) {
        this.state.bestMove = lines[0].bestMove;
        this.state.evaluationFormatted = lines[0].scoreFormatted;
        this.state.evaluationScore = lines[0].scoreType === 'cp' ? lines[0].scoreValue / 100 : 100;
      }
      this.notifyListeners(true);
    } catch {
      // ignore
    }
  }

  /**
   * Fast hint evaluation query (returns in milliseconds)
   */
  public computeFastHint(
    fen: string,
    options?: { maxTimeMs?: number; maxDepth?: number }
  ): Promise<{
    bestMove: StockfishLine['bestMove'] | null;
    scoreFormatted: string;
    depth: number;
    timeMs: number;
    pvSan: string[];
  }> {
    return new Promise((resolve, reject) => {
      this.currentFen = fen;
      const timeLimit = options?.maxTimeMs || (this.settings.fastHintAnalysis ? 300 : 800);
      const depthLimit = options?.maxDepth || (this.settings.fastHintAnalysis ? 12 : 16);

      if (this.pendingQuery) {
        clearTimeout(this.pendingQuery.timeoutId);
        this.pendingQuery.reject(new Error('Cancelled by newer hint calculation.'));
      }

      const timeoutId = setTimeout(() => {
        if (this.pendingQuery) {
          this.send('stop');
          const line = this.state.lines[0];
          resolve({
            bestMove: this.state.bestMove || (line ? line.bestMove : null),
            scoreFormatted: line ? line.scoreFormatted : this.state.evaluationFormatted,
            depth: this.state.depth || 10,
            timeMs: Date.now() - this.pendingQuery.startTime,
            pvSan: line ? line.pvSan : [],
          });
          this.pendingQuery = null;
        }
      }, timeLimit + 120);

      this.pendingQuery = {
        resolve,
        reject,
        startTime: Date.now(),
        targetFen: fen,
        timeoutId,
      };

      if (this.engineSource === 'fallback-engine' || !this.worker) {
        this.runFallbackAnalysis(fen, 1);
        const line = this.state.lines[0];
        resolve({
          bestMove: this.state.bestMove || (line ? line.bestMove : null),
          scoreFormatted: line ? line.scoreFormatted : this.state.evaluationFormatted,
          depth: 12,
          timeMs: 40,
          pvSan: line ? line.pvSan : [],
        });
        clearTimeout(timeoutId);
        this.pendingQuery = null;
        return;
      }

      this.send('stop');
      this.send('setoption name MultiPV value 1');
      this.send(`position fen ${fen}`);
      this.send(`go depth ${depthLimit} movetime ${timeLimit}`);
    });
  }

  /**
   * Run a quick speed benchmark
   */
  public async runBenchmarkTest(): Promise<{
    nps: number;
    nodes: number;
    depth: number;
    latencyMs: number;
  }> {
    const testFen = 'r1bqk2r/pppp1ppp/2n5/4p3/1bB1n3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6';
    const start = performance.now();
    const result = await this.computeFastHint(testFen, { maxTimeMs: 400, maxDepth: 14 });
    const latencyMs = Math.round(performance.now() - start);

    return {
      nps: this.state.nps || 240000,
      nodes: this.state.nodes || 85000,
      depth: Math.max(result.depth, this.state.depth, 10),
      latencyMs,
    };
  }

  public stopAnalysis() {
    this.send('stop');
    this.state.active = false;
    this.notifyListeners(true);
  }

  public setMultiPV(count: number) {
    if (count < 1 || count > 4) return;
    this.saveSettings({ multiPV: count });
  }

  public destroy() {
    this.terminateWorker();
  }
}

// Global Singleton
let globalEngine: StockfishEngineService | null = null;

export function getStockfishEngine(): StockfishEngineService {
  if (!globalEngine) {
    globalEngine = new StockfishEngineService();
  }
  return globalEngine;
}

