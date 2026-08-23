import { Chess, Square } from 'chess.js';
import { StockfishLine, StockfishState } from '../types';

export interface StockfishOptions {
  multiPV?: number; // 1 to 5 (default: 3)
  threads?: number;
  hash?: number;
}

export class StockfishEngineService {
  private worker: Worker | null = null;
  private isReady = false;
  private isAnalyzing = false;
  private currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  private currentMultiPV = 3;
  private listeners: Array<(state: StockfishState) => void> = [];

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

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      // Try local /stockfish.js first
      this.worker = new Worker('/stockfish.js');
    } catch (e) {
      console.warn('Could not initialize local Stockfish worker, falling back to CDN blob worker:', e);
      try {
        const blobCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js");`;
        const blob = new Blob([blobCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
      } catch (err) {
        console.error('Failed to create Stockfish worker:', err);
        this.state.error = 'No se pudo iniciar el motor Stockfish en este navegador.';
        this.notifyListeners();
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
      this.notifyListeners();
    };

    // Send initial configuration
    this.send('uci');
    this.send(`setoption name MultiPV value ${this.currentMultiPV}`);
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

  private notifyListeners() {
    const copy = { ...this.state, lines: [...this.state.lines] };
    this.listeners.forEach((listener) => listener(copy));
  }

  private handleUciMessage(msg: string) {
    if (msg === 'uciok') {
      this.isReady = true;
      this.state.ready = true;
      this.notifyListeners();
      return;
    }

    if (msg === 'readyok') {
      this.isReady = true;
      this.state.ready = true;
      this.notifyListeners();
      return;
    }

    if (msg.startsWith('info ')) {
      this.parseInfo(msg);
      return;
    }

    if (msg.startsWith('bestmove ')) {
      const parts = msg.split(' ');
      const bestMoveUci = parts[1];
      if (bestMoveUci && bestMoveUci !== '(none)') {
        this.state.active = false;
        this.notifyListeners();
      }
    }
  }

  private parseInfo(msg: string) {
    // Check if this info contains pv or depth
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

    // Check side to move from current FEN
    const isBlackTurn = this.currentFen.split(' ')[1] === 'b';

    if (mateMatch) {
      scoreType = 'mate';
      isMate = true;
      const rawMate = parseInt(mateMatch[1], 10);
      // Adjust sign for absolute White/Black perspective
      const normalizedMate = isBlackTurn ? -rawMate : rawMate;
      mateTurns = Math.abs(rawMate);
      scoreValue = rawMate;
      scoreFormatted = normalizedMate > 0 ? `#+${mateTurns}` : `#-${mateTurns}`;
    } else if (cpMatch) {
      scoreType = 'cp';
      const rawCp = parseInt(cpMatch[1], 10);
      // In standard UCI, cp score is from the perspective of the side to move
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
        // Convert UCI to SAN sequence
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

          // Update lines array
          const existingIdx = this.state.lines.findIndex((l) => l.multipv === multipv);
          if (existingIdx >= 0) {
            this.state.lines[existingIdx] = lineObj;
          } else {
            this.state.lines.push(lineObj);
          }

          // Sort lines by multipv
          this.state.lines.sort((a, b) => a.multipv - b.multipv);

          // If this is MultiPV #1, update primary state evaluation and primary best move
          if (multipv === 1) {
            this.state.bestMove = bestMoveObj;
            this.state.evaluationFormatted = scoreFormatted;
            this.state.evaluationScore = scoreType === 'cp' ? (isBlackTurn ? -scoreValue : scoreValue) / 100 : (isBlackTurn ? -scoreValue : scoreValue) > 0 ? 100 : -100;
            this.state.isMate = isMate;
            this.state.mateTurns = mateTurns;
          }
        }
      }
    }

    this.notifyListeners();
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

        const moveRes = simChess.move({ from, to, promotion: promotion as any });
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
      // Fallback
    }

    return { pvSan, bestMoveObj };
  }

  /**
   * Start continuous or fixed-depth analysis on a specific position FEN
   */
  public startAnalysis(fen: string, options: { multiPV?: number; infinite?: boolean; depth?: number } = {}) {
    this.currentFen = fen;
    const requestedMultiPV = options.multiPV || this.currentMultiPV || 3;

    // Reset current active lines
    this.state.active = true;
    this.state.depth = 0;
    this.state.seldepth = 0;
    this.state.lines = [];
    this.state.bestMove = null;
    this.state.error = null;
    this.notifyListeners();

    // Stop previous search
    this.send('stop');

    // Update MultiPV if changed
    if (requestedMultiPV !== this.currentMultiPV) {
      this.currentMultiPV = requestedMultiPV;
      this.send(`setoption name MultiPV value ${requestedMultiPV}`);
    }

    // Set position and run
    this.send(`position fen ${fen}`);
    
    if (options.depth) {
      this.send(`go depth ${options.depth}`);
    } else {
      // Permanent continuous infinite calculation
      this.send('go infinite');
    }
  }

  /**
   * Stop analysis
   */
  public stopAnalysis() {
    this.send('stop');
    this.state.active = false;
    this.notifyListeners();
  }

  /**
   * Set MultiPV count (1 to 5)
   */
  public setMultiPV(count: number) {
    if (count < 1 || count > 5) return;
    this.currentMultiPV = count;
    this.send(`setoption name MultiPV value ${count}`);
    if (this.state.active) {
      this.startAnalysis(this.currentFen, { multiPV: count });
    }
  }

  public destroy() {
    if (this.worker) {
      this.send('quit');
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Global Singleton for sharing across tabs/components
let globalEngine: StockfishEngineService | null = null;

export function getStockfishEngine(): StockfishEngineService {
  if (!globalEngine) {
    globalEngine = new StockfishEngineService();
  }
  return globalEngine;
}
