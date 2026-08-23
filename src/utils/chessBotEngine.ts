import { Chess, Square } from 'chess.js';
import { BotProfile } from '../types';
import { getStockfishEngine } from './stockfishEngine';

// Standard piece values
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Common opening book lines for natural variety in early game
const OPENING_BOOK: Record<string, string[]> = {
  // Start position
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': [
    'e2e4', 'd2d4', 'c2c4', 'g1f3', 'e2e4', 'd2d4', 'g1f3'
  ],
  // 1. e4
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': [
    'e7e5', 'c7c5', 'e7e6', 'c7c6', 'g8f6', 'd7d6'
  ],
  // 1. d4
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': [
    'd7d5', 'g8f6', 'e7e6', 'c7c5', 'g7g6'
  ],
  // 1. e4 e5
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2': [
    'g1f3', 'f1c4', 'b1c3', 'f2f4', 'd2d4'
  ],
  // 1. e4 e5 2. Nf3
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2': [
    'b8c6', 'g8f6', 'd7d6'
  ],
  // 1. e4 c5 (Sicilian)
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2': [
    'g1f3', 'b1c3', 'c2c3', 'd2d4'
  ],
  // 1. d4 d5
  'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2': [
    'c2c4', 'g1f3', 'b1c3', 'c1f4'
  ],
  // 1. d4 Nf6
  'rnbqkbnr/pppppp1p/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2': [
    'c2c4', 'g1f3', 'c1g5', 'b1c3'
  ]
};

// Positional evaluation tables for piece squares
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const KING_MID_PST = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
   20,  20,   0,   0,   0,   0,  20,  20,
   20,  30,  10,   0,   0,  10,  30,  20
];

function evaluatePosition(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw() || chess.isStalemate()) {
    return 0;
  }

  let totalScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      let pstVal = 0;
      const squareIndex = piece.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;

      if (piece.type === 'p') pstVal = PAWN_PST[squareIndex] || 0;
      else if (piece.type === 'n') pstVal = KNIGHT_PST[squareIndex] || 0;
      else if (piece.type === 'b') pstVal = BISHOP_PST[squareIndex] || 0;
      else if (piece.type === 'k') pstVal = KING_MID_PST[squareIndex] || 0;

      const pieceTotal = baseVal + pstVal;
      if (piece.color === 'w') {
        totalScore += pieceTotal;
      } else {
        totalScore -= pieceTotal;
      }
    }
  }

  return totalScore;
}

// Alpha-Beta Minimax for fast tactical evaluation
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluatePosition(chess);
  }

  const moves = chess.moves({ verbose: true });
  // Move ordering: captures first
  moves.sort((a, b) => {
    const valA = a.captured ? PIECE_VALUES[a.captured] : 0;
    const valB = b.captured ? PIECE_VALUES[b.captured] : 0;
    return valB - valA;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalVal = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalVal = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export interface BotMoveResult {
  from: string;
  to: string;
  san: string;
  promotion?: string;
  isBlunder?: boolean;
  isOpeningBook?: boolean;
  score?: number;
}

/**
 * Main engine method to compute a move for a given bot profile
 */
export async function computeBotMove(
  fen: string,
  bot: BotProfile,
  moveCount: number = 0
): Promise<BotMoveResult> {
  const chess = new Chess(fen);
  const legalMoves = chess.moves({ verbose: true });

  if (legalMoves.length === 0) {
    throw new Error('No legal moves available');
  }

  // 1. Check Opening Book for early moves (first 3-4 moves)
  if (moveCount < 6 && OPENING_BOOK[fen]) {
    const bookOptions = OPENING_BOOK[fen];
    // Pick random book move
    const uci = bookOptions[Math.floor(Math.random() * bookOptions.length)];
    const from = uci.substring(0, 2);
    const to = uci.substring(2, 4);
    const promo = uci.length > 4 ? uci.substring(4, 5) : undefined;

    const matched = legalMoves.find(m => m.from === from && m.to === to);
    if (matched) {
      return {
        from: matched.from,
        to: matched.to,
        san: matched.san,
        promotion: promo,
        isOpeningBook: true
      };
    }
  }

  // 2. High-level Bots (Elo 2000+) use Stockfish worker if available
  if (bot.elo >= 2100) {
    try {
      const stockfishResult = await queryStockfishBestMove(fen, Math.min(bot.depth, 16));
      if (stockfishResult) {
        return stockfishResult;
      }
    } catch {
      // Fall through to heuristic minimax
    }
  }

  // 3. Check for intentional blunder simulation for lower-elo bots
  const shouldBlunder = Math.random() < bot.blunderChance;
  if (shouldBlunder && legalMoves.length > 1) {
    // Pick a random legal move or sub-optimal move
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return {
      from: randomMove.from,
      to: randomMove.to,
      san: randomMove.san,
      promotion: randomMove.promotion,
      isBlunder: true
    };
  }

  // 4. Minimax evaluation for intermediate and novice bots
  const isWhite = chess.turn() === 'w';
  const effectiveDepth = Math.max(1, Math.min(bot.depth, 4)); // Client depth capped for 60fps response

  let bestMove = legalMoves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  // Evaluate candidate moves
  const scoredMoves: { move: typeof legalMoves[0]; score: number }[] = [];

  for (const move of legalMoves) {
    chess.move(move);
    const score = minimax(chess, effectiveDepth - 1, -Infinity, Infinity, !isWhite);
    chess.undo();

    scoredMoves.push({ move, score });

    if (isWhite) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  // If bot has lower tactical awareness, maybe choose top 2 or 3 instead of absolute best
  if (bot.tacticalAwareness < 0.8 && scoredMoves.length > 1) {
    scoredMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);
    const topCandidates = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
    const chosen = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    bestMove = chosen.move;
    bestScore = chosen.score;
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    san: bestMove.san,
    promotion: bestMove.promotion,
    score: bestScore
  };
}

/**
 * Query Stockfish worker with promise timeout
 */
function queryStockfishBestMove(fen: string, depth: number): Promise<BotMoveResult | null> {
  return new Promise((resolve) => {
    try {
      const engine = getStockfishEngine();
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          unsubscribe();
          resolve(null);
        }
      }, 2500);

      const unsubscribe = engine.subscribe((state) => {
        if (resolved) return;
        if (state.bestMove && (state.depth >= depth || !state.active)) {
          resolved = true;
          clearTimeout(timeout);
          unsubscribe();
          resolve({
            from: state.bestMove.from,
            to: state.bestMove.to,
            san: state.bestMove.san,
            promotion: state.bestMove.promotion
          });
        }
      });

      engine.startAnalysis(fen, { depth, multiPV: 1 });
    } catch {
      resolve(null);
    }
  });
}

/**
 * Fast bot-vs-bot match simulator for tournament rounds
 */
export function simulateBotVsBotMatch(
  whiteBot: BotProfile,
  blackBot: BotProfile
): {
  winner: 'w' | 'b' | 'draw';
  scoreFormatted: string;
  movesCount: number;
  reason: string;
} {
  // Elo based probability formula (Logistic curve)
  const eloDiff = whiteBot.elo - blackBot.elo;
  const whiteAdvantageElo = 35; // White has slight first move advantage
  const adjustedDiff = eloDiff + whiteAdvantageElo;

  // Expected score for White (0 to 1)
  const expectedWhite = 1 / (1 + Math.pow(10, -adjustedDiff / 400));
  
  // Draw probability is higher between equal high rated players
  const avgElo = (whiteBot.elo + blackBot.elo) / 2;
  const drawProb = Math.min(0.45, 0.15 + (avgElo / 3000) * 0.25 - (Math.abs(adjustedDiff) / 800));
  
  const roll = Math.random();

  const movesCount = Math.floor(28 + Math.random() * 32);

  if (roll < drawProb) {
    return {
      winner: 'draw',
      scoreFormatted: '½ - ½',
      movesCount,
      reason: 'Tablas por repetición o material insuficiente'
    };
  }

  // Adjust remaining probability between White win and Black win
  const remainingProb = 1 - drawProb;
  const whiteWinProb = (expectedWhite - drawProb / 2) / remainingProb;

  if (Math.random() < whiteWinProb) {
    return {
      winner: 'w',
      scoreFormatted: '1 - 0',
      movesCount,
      reason: 'Victoria de Blancas por Jaque Mate'
    };
  } else {
    return {
      winner: 'b',
      scoreFormatted: '0 - 1',
      movesCount,
      reason: 'Victoria de Negras por Jaque Mate'
    };
  }
}

/**
 * Helper to calculate captured pieces and material balance
 */
export function getCapturedPieces(chess: Chess): {
  capturedWhite: string[]; // Pieces captured by White (Black pieces)
  capturedBlack: string[]; // Pieces captured by Black (White pieces)
  materialDifference: number; // positive = White advantage
} {
  const initialPieces: Record<string, number> = {
    p: 8, n: 2, b: 2, r: 2, q: 1
  };

  const currentPiecesWhite: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const currentPiecesBlack: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.type === 'k') continue;
      if (p.color === 'w') {
        currentPiecesWhite[p.type] = (currentPiecesWhite[p.type] || 0) + 1;
      } else {
        currentPiecesBlack[p.type] = (currentPiecesBlack[p.type] || 0) + 1;
      }
    }
  }

  const capturedWhite: string[] = []; // Black pieces taken
  const capturedBlack: string[] = []; // White pieces taken

  let whitePoints = 0;
  let blackPoints = 0;

  for (const type of ['p', 'n', 'b', 'r', 'q']) {
    const missingBlack = (initialPieces[type] || 0) - (currentPiecesBlack[type] || 0);
    const missingWhite = (initialPieces[type] || 0) - (currentPiecesWhite[type] || 0);

    for (let i = 0; i < missingBlack; i++) capturedWhite.push(type);
    for (let i = 0; i < missingWhite; i++) capturedBlack.push(type);

    const val = type === 'p' ? 1 : type === 'n' || type === 'b' ? 3 : type === 'r' ? 5 : 9;
    whitePoints += (currentPiecesWhite[type] || 0) * val;
    blackPoints += (currentPiecesBlack[type] || 0) * val;
  }

  return {
    capturedWhite,
    capturedBlack,
    materialDifference: whitePoints - blackPoints
  };
}
