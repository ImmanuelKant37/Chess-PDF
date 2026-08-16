import React, { useState, useEffect } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { ChessPieceIcon } from './ChessPieces';

interface ChessBoardProps {
  chess: Chess;
  orientation?: 'w' | 'b';
  onMove?: (from: string, to: string) => void;
  lastMove?: { from: string; to: string } | null;
  hintSquare?: string | null;
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

  return (
    <div className="relative inline-block select-none shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-700/80 bg-slate-800">
      <div 
        id="chess-board-grid"
        className="grid grid-cols-8 aspect-square w-full max-w-[540px] sm:w-[460px] md:w-[500px] lg:w-[530px]"
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
                  ${isSelected ? 'bg-amber-400/80 ring-4 ring-inset ring-amber-500 z-10' : ''}
                  ${isHint ? 'bg-emerald-400/70 animate-pulse ring-4 ring-emerald-500 z-10' : ''}
                  ${isKingInCheck ? 'bg-rose-500/80 ring-4 ring-rose-600 animate-bounce' : ''}
                `}
              >
                {/* Coordinates */}
                {showCoordinates && fileIdx === 0 && (
                  <span className="absolute top-0.5 left-1 text-[10px] sm:text-xs font-bold opacity-75 pointer-events-none select-none">
                    {rank}
                  </span>
                )}
                {showCoordinates && rankIdx === 7 && (
                  <span className="absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold opacity-75 pointer-events-none select-none">
                    {file}
                  </span>
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
      </div>
    </div>
  );
};
