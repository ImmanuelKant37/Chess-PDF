import React, { useState, useEffect } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { ChessPieceIcon } from './ChessPieces';

interface ChessBoardProps {
  chess: Chess;
  orientation?: 'w' | 'b';
  onMove?: (from: string, to: string) => void;
  lastMove?: { from: string; to: string } | null;
  hintSquare?: string | null;
  highlightMove?: { from: string; to: string; color?: 'white' | 'black' } | null;
  stockfishBestMove?: { from: string; to: string } | null;
  showStockfishArrow?: boolean;
  interactive?: boolean;
  boardTheme?: 'wood' | 'green' | 'blue' | 'classic';
  showCoordinates?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  orientation = 'w',
  onMove,
  lastMove,
  hintSquare,
  highlightMove,
  stockfishBestMove,
  showStockfishArrow = true,
  interactive = true,
  boardTheme = 'classic',
  showCoordinates = true,
  size = 'md'
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  // Synchronize and clear selection on external state changes
  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
    setDraggedSquare(null);
  }, [chess, orientation, interactive]);

  const board = chess.board();
  const isCheck = chess.inCheck();
  const turn = chess.turn();

  // Find king position if in check
  let checkKingSquare: string | null = null;
  if (isCheck) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          const file = String.fromCharCode('a'.charCodeAt(0) + c);
          const rank = 8 - r;
          checkKingSquare = `${file}${rank}`;
        }
      }
    }
  }

  // Theme square styles
  const themes = {
    classic: {
      light: 'bg-[#F0D9B5] text-[#B58863]',
      dark: 'bg-[#B58863] text-[#F0D9B5]',
      border: 'border-[#8B6543]'
    },
    green: {
      light: 'bg-[#EEEED2] text-[#769656]',
      dark: 'bg-[#769656] text-[#EEEED2]',
      border: 'border-[#5A7441]'
    },
    blue: {
      light: 'bg-[#E2E8F0] text-[#475569]',
      dark: 'bg-[#64748B] text-[#E2E8F0]',
      border: 'border-[#334155]'
    },
    wood: {
      light: 'bg-[#EBD3A8] text-[#9A6233]',
      dark: 'bg-[#9A6233] text-[#EBD3A8]',
      border: 'border-[#6D4321]'
    }
  };

  const themeConfig = themes[boardTheme] || themes.classic;

  const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = orientation === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  const getSquareLegalMoves = (sq: Square) => {
    try {
      const moves = chess.moves({ square: sq, verbose: true });
      return moves.map(m => m.to);
    } catch {
      return [];
    }
  };

  const handleSquareClick = (sq: Square) => {
    if (!interactive || !onMove) return;

    // 1. If clicking the already selected piece -> deselect
    if (selectedSquare === sq) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // 2. If clicking a legal target square -> execute move!
    if (selectedSquare && possibleMoves.includes(sq)) {
      onMove(selectedSquare, sq);
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // 3. If clicking a piece of current player's turn -> select it & show legal destinations
    const piece = chess.get(sq);
    if (piece && piece.color === turn) {
      setSelectedSquare(sq);
      const moves = getSquareLegalMoves(sq);
      setPossibleMoves(moves);
    } else {
      // 4. Clicked an irrelevant empty square or un-attacked enemy piece -> clear selection
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, sq: Square) => {
    if (!interactive || !onMove) return;
    const piece = chess.get(sq);
    if (piece && piece.color === turn) {
      setDraggedSquare(sq);
      setSelectedSquare(sq);
      setPossibleMoves(getSquareLegalMoves(sq));
      e.dataTransfer.setData('text/plain', sq);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSq: Square) => {
    e.preventDefault();
    if (!interactive || !onMove || !draggedSquare) return;

    if (possibleMoves.includes(targetSq)) {
      onMove(draggedSquare, targetSq);
    }
    setDraggedSquare(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const getSquareCoordinates = (sq: string) => {
    if (!sq || sq.length < 2) return null;
    const file = sq[0];
    const rank = parseInt(sq[1], 10);
    const colIdx = orientation === 'w' ? file.charCodeAt(0) - 'a'.charCodeAt(0) : 'h'.charCodeAt(0) - file.charCodeAt(0);
    const rowIdx = orientation === 'w' ? 8 - rank : rank - 1;
    const x = (colIdx + 0.5) * 12.5;
    const y = (rowIdx + 0.5) * 12.5;
    return { x, y };
  };

  const arrowCoords = stockfishBestMove && showStockfishArrow
    ? {
        from: getSquareCoordinates(stockfishBestMove.from),
        to: getSquareCoordinates(stockfishBestMove.to),
      }
    : null;

  return (
    <div className="relative w-full max-w-[520px] aspect-square select-none shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-slate-700/80 bg-slate-800 touch-manipulation mx-auto flex items-center justify-center">
      <div 
        id="chess-board-grid"
        className="grid grid-cols-8 aspect-square w-full h-full relative touch-manipulation"
      >
        {ranks.map((rank, rankIdx) => {
          return files.map((file, fileIdx) => {
            const squareName = `${file}${rank}` as Square;
            const isLight = (rankIdx + fileIdx) % 2 === 0;
            const piece = chess.get(squareName);

            const isSelected = selectedSquare === squareName;
            const isTarget = possibleMoves.includes(squareName);
            const isLastMoveFrom = lastMove?.from === squareName;
            const isLastMoveTo = lastMove?.to === squareName;
            const isHint = hintSquare === squareName;
            const isKingInCheck = checkKingSquare === squareName;
            const isHighlightFrom = highlightMove?.from === squareName;
            const isHighlightTo = highlightMove?.to === squareName;
            const highlightColor = highlightMove?.color === 'black' ? 'violet' : 'cyan';

            const isStockfishFrom = stockfishBestMove?.from === squareName;
            const isStockfishTo = stockfishBestMove?.to === squareName;

            return (
              <div
                key={squareName}
                id={`square-${squareName}`}
                onClick={() => handleSquareClick(squareName)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, squareName)}
                className={`
                  relative aspect-square flex items-center justify-center cursor-pointer transition-colors duration-150
                  ${isLight ? themeConfig.light : themeConfig.dark}
                  ${isLastMoveFrom || isLastMoveTo ? 'bg-amber-300/60 ring-inset ring-2 ring-amber-400' : ''}
                  ${isHighlightFrom ? (highlightColor === 'violet' ? 'bg-purple-400/60 ring-inset ring-4 ring-purple-500 z-10' : 'bg-cyan-400/60 ring-inset ring-4 ring-cyan-500 z-10') : ''}
                  ${isHighlightTo ? (highlightColor === 'violet' ? 'bg-purple-300/70 ring-inset ring-4 ring-purple-600 animate-pulse z-10' : 'bg-cyan-300/70 ring-inset ring-4 ring-cyan-600 animate-pulse z-10') : ''}
                  ${isStockfishFrom ? 'bg-emerald-400/50 ring-inset ring-2 ring-emerald-500 z-10' : ''}
                  ${isStockfishTo ? 'bg-emerald-300/60 ring-inset ring-4 ring-emerald-600 animate-pulse z-10' : ''}
                  ${isSelected ? 'bg-amber-400/80 ring-4 ring-inset ring-amber-500 z-10' : ''}
                  ${isHint ? 'bg-emerald-400/70 animate-pulse ring-4 ring-emerald-500 z-10' : ''}
                  ${isKingInCheck ? 'bg-rose-500/80 ring-4 ring-rose-600 animate-bounce' : ''}
                `}
              >
                {/* Coordinates */}
                {showCoordinates && fileIdx === 0 && (
                  <span className="absolute top-0.5 left-0.5 sm:left-1 text-[8px] sm:text-[10px] md:text-xs font-bold opacity-75 pointer-events-none select-none leading-none">
                    {rank}
                  </span>
                )}
                {showCoordinates && rankIdx === 7 && (
                  <span className="absolute bottom-0.5 right-0.5 sm:right-1 text-[8px] sm:text-[10px] md:text-xs font-bold opacity-75 pointer-events-none select-none leading-none">
                    {file}
                  </span>
                )}

                {/* Stockfish best move target badge */}
                {isStockfishTo && (
                  <div className="absolute top-1 right-1 pointer-events-none z-30">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                )}

                {/* Legal destination indicator */}
                {isTarget && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {piece ? (
                      <div className="w-full h-full border-4 border-amber-500/90 rounded-full animate-pulse ring-2 ring-amber-400/50" />
                    ) : (
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-slate-900/50 dark:bg-white/60 rounded-full shadow-md" />
                    )}
                  </div>
                )}

                {/* Piece Icon */}
                {piece && (
                  <div
                    draggable={interactive && piece.color === turn}
                    onDragStart={(e) => handleDragStart(e, squareName)}
                    className={`w-[86%] h-[86%] flex items-center justify-center transition-all pointer-events-none ${
                      isSelected ? 'scale-110 drop-shadow-lg z-30' : ''
                    } ${
                      interactive && piece.color === turn ? 'cursor-grab active:cursor-grabbing hover:scale-105' : 'cursor-default'
                    }`}
                  >
                    <ChessPieceIcon type={piece.type} color={piece.color} className="w-full h-full pointer-events-none" />
                  </div>
                )}
              </div>
            );
          });
        })}

        {/* Stockfish Arrow Overlay */}
        {arrowCoords && arrowCoords.from && arrowCoords.to && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-25 overflow-visible" viewBox="0 0 100 100">
            <defs>
              <marker
                id="stockfish-arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="4.5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#10b981" opacity="0.9" />
              </marker>
            </defs>
            <line
              x1={`${arrowCoords.from.x}%`}
              y1={`${arrowCoords.from.y}%`}
              x2={`${arrowCoords.to.x}%`}
              y2={`${arrowCoords.to.y}%`}
              stroke="#10b981"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.85"
              markerEnd="url(#stockfish-arrowhead)"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
