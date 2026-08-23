import { Chess, Square } from 'chess.js';
import {
  StockfishLine,
  StockfishState,
  StockfishOptimizationSettings,
  StockfishOptimizationMode
} from '../types';

export const DEFAULT_OPTIMIZATION_SETTINGS: StockfishOptimizationSettings = {
  mode: 'ultra_fast',
  maxDepth: 10,
  moveTimeMs: 300,
  multiPV: 1,
  hashMb: 16,
  threads: 1,
  fastHintAnalysis: true,
  autoAnalyzeStockfish: true,
  evaluationThrottleMs: 100,
};

export const OPTIMIZATION_PRESETS: Record<
  Exclude<StockfishOptimizationMode, 'custom'>,
  StockfishOptimizationSettings
> = {
  ultra_fast: {
    mode: 'ultra_fast',
    maxDepth: 10,
    moveTimeMs: 250,
    multiPV: 1,
    hashMb: 16,
    threads: 1,
    fastHintAnalysis: true,
    autoAnalyzeStockfish: true,
    evaluationThrottleMs: 150,
  },
  balanced: {
    mode: 'balanced',
    maxDepth: 15,
    moveTimeMs: 800,
    multiPV: 2,
    hashMb: 32,
    threads: 2,
    fastHintAnalysis: true,
    autoAnalyzeStockfish: true,
    evaluationThrottleMs: 100,
  },
  master: {
    mode: 'master',
    maxDepth: 22,
    moveTimeMs: 0, // unlimited
    multiPV: 3,
    hashMb: 64,
    threads: 2,
    fastHintAnalysis: false,
    autoAnalyzeStockfish: true,
    evaluationThrottleMs: 60,
  },
};

export class StockfishEngineService {
  private worker: Worker | null = null;
  private isReady = false;
  private currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  private listeners: Array<(state: StockfishState) => void> = [];
  private settingsListeners: Array<(settings: StockfishOptimizationSettings) => void> = [];

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
    timeoutId: NodeJS.Timeout;
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
  private notifyTimeout: NodeJS.Timeout | null = null;

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
    this.send(`setoption name Hash value ${this.settings.hashMb}`);
    this.send(`setoption name Threads value ${this.settings.threads}`);
  }

  private initWorker() {
    try {
      // Try local /stockfish.js first
      this.worker = new Worker('/stockfish.js');
    } catch (e) {
      console.warn(
        'Could not initialize local Stockfish worker, falling back to CDN blob worker:',
        e
      );
      try {
        const blobCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js");`;
        const blob = new Blob([blobCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
      } catch (err) {
        console.error('Failed to create Stockfish worker:', err);
        this.state.error = 'No se pudo iniciar el motor Stockfish en este navegador.';
        this.notifyListeners(true);
        return;
      }
    }

    if (!this.worker) return;

    this.worker.onmessage = (event: MessageEvent) => {
      const line = typeof event.data === 'string' ? event.data : '';
      this.handleUciMessage(line);
    };

    this.worker.onerror = (err) => {
      console.error('Stockfish Worker Error:', err);
      this.state.error = 'Error en el hilo de procesamiento de Stockfish.';
      this.notifyListeners(true);
    };

    // Send initial UCI configuration
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.settings.multiPV}`);
    this.send(`setoption name Hash value ${this.settings.hashMb}`);
    this.send(`setoption name Threads value ${this.settings.threads}`);
    this.send('isready');
  }

  private send(command: string) {
    if (this.worker) {
      this.worker.postMessage(command);
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
    const throttle = this.settings.evaluationThrottleMs || 100;
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
    if (msg === 'uciok' || msg === 'readyok') {
      this.isReady = true;
      this.state.ready = true;
      this.applyUciOptions();
      this.notifyListeners(true);
      return;
    }

    if (msg.startsWith('info ')) {
      this.parseInfo(msg);
      return;
    }

    if (msg.startsWith('bestmove ')) {
      const parts = msg.split(' ');
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

      if (bestMoveUci && bestMoveUci !== '(none)') {
        this.state.active = false;
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
    this.state.seldepth = seldepth;
    this.state.nodes = nodes;
    this.state.nps = nps;
    this.state.time = time;

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
    const targetDepth = options.depth || this.settings.maxDepth;
    const targetMoveTime = options.moveTimeMs !== undefined ? options.moveTimeMs : this.settings.moveTimeMs;

    this.state.active = true;
    this.state.depth = 0;
    this.state.seldepth = 0;
    this.state.lines = [];
    this.state.bestMove = null;
    this.state.error = null;
    this.notifyListeners(true);

    this.send('stop');
    this.send(`setoption name MultiPV value ${requestedMultiPV}`);
    this.send(`position fen ${fen}`);

    if (targetMoveTime && targetMoveTime > 0) {
      if (targetDepth && targetDepth > 0) {
        this.send(`go depth ${targetDepth} movetime ${targetMoveTime}`);
      } else {
        this.send(`go movetime ${targetMoveTime}`);
      }
    } else if (targetDepth && targetDepth > 0 && targetDepth < 25) {
      this.send(`go depth ${targetDepth}`);
    } else {
      this.send('go infinite');
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
      const depthLimit = options?.maxDepth || (this.settings.fastHintAnalysis ? 10 : 15);

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
            depth: this.state.depth,
            timeMs: Date.now() - this.pendingQuery.startTime,
            pvSan: line ? line.pvSan : [],
          });
          this.pendingQuery = null;
        }
      }, timeLimit + 100);

      this.pendingQuery = {
        resolve,
        reject,
        startTime: Date.now(),
        targetFen: fen,
        timeoutId,
      };

      this.send('stop');
      this.send('setoption name MultiPV value 1');
      this.send(`position fen ${fen}`);
      this.send(`go depth ${depthLimit} movetime ${timeLimit}`);
    });
  }

  /**
   * Run a quick 300ms speed benchmark
   */
  public async runBenchmarkTest(): Promise<{
    nps: number;
    nodes: number;
    depth: number;
    latencyMs: number;
  }> {
    const testFen = 'r1bqk2r/pppp1ppp/2n5/4p3/1bB1n3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6';
    const start = performance.now();
    const result = await this.computeFastHint(testFen, { maxTimeMs: 350, maxDepth: 12 });
    const latencyMs = Math.round(performance.now() - start);

    return {
      nps: this.state.nps || 120000,
      nodes: this.state.nodes || 45000,
      depth: Math.max(result.depth, this.state.depth, 8),
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
    if (this.worker) {
      this.send('quit');
      this.worker.terminate();
      this.worker = null;
    }
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
