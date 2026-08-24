import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPieceIcon } from './ChessPieces';
import { BoardThemeId, PieceSkinId } from '../types/adventure';

export interface ChessBoardProps {
  chess: Chess;
  orientation?: 'w' | 'b';
  onMove?: (from: string, to: string) => void;
  lastMove?: { from: string; to: string } | null;
  hintSquare?: string | null;
  highlightMove?: { from: string; to: string; color?: 'white' | 'black' } | null;
  stockfishBestMove?: { from: string; to: string } | null;
  showStockfishArrow?: boolean;
  interactive?: boolean;
  boardTheme?: BoardThemeId | string;
  pieceSkin?: PieceSkinId | string;
  showCoordinates?: boolean;
  size?: 'sm' | 'md' | 'lg';
  wallpaper?: string;
  showFrameDecorations?: boolean;
}

interface ThemeConfig {
  name: string;
  lightTile: string;
  darkTile: string;
  lightText: string;
  darkText: string;
  outerFrame: string;
  innerBorder: string;
  cornerAccent: string;
  badgeLabel: string;
  badgeColor: string;
  highlightMoveColor: string;
  tileTexturePattern?: string;
  defaultPieceSkin: PieceSkinId;
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
  pieceSkin,
  showCoordinates = true,
  wallpaper,
  showFrameDecorations = true
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

  // Comprehensive theme configurations for tiles, borders, coordinates, and pieces
  const themes: Record<string, ThemeConfig> = {
    classic: {
      name: 'Torneo Staunton',
      lightTile: 'bg-[#F0D9B5]',
      darkTile: 'bg-[#B58863]',
      lightText: 'text-[#B58863]',
      darkText: 'text-[#F0D9B5]',
      outerFrame: 'bg-gradient-to-b from-[#3D2817] via-[#2A1B0E] to-[#1C120A] border-[#8B5A2B] shadow-[0_12px_36px_rgba(0,0,0,0.6)]',
      innerBorder: 'border-[#5C3A21]',
      cornerAccent: 'bg-[#D4AF37]',
      badgeLabel: 'STAUNTON',
      badgeColor: 'text-[#D4AF37] border-[#8B5A2B]',
      highlightMoveColor: 'amber',
      defaultPieceSkin: 'classic'
    },
    wood: {
      name: 'Roble Artesanal',
      lightTile: 'bg-[#EBD3A8]',
      darkTile: 'bg-[#9A6233]',
      lightText: 'text-[#9A6233]',
      darkText: 'text-[#EBD3A8]',
      outerFrame: 'bg-gradient-to-b from-[#4A2E18] via-[#38200E] to-[#251408] border-[#784620] shadow-[0_12px_36px_rgba(40,20,5,0.7)]',
      innerBorder: 'border-[#613614]',
      cornerAccent: 'bg-[#C68A4C]',
      badgeLabel: 'ROBLE NOBLE',
      badgeColor: 'text-[#EBD3A8] border-[#784620]',
      highlightMoveColor: 'amber',
      defaultPieceSkin: 'classic'
    },
    green: {
      name: 'Club Competición',
      lightTile: 'bg-[#EEEED2]',
      darkTile: 'bg-[#769656]',
      lightText: 'text-[#769656]',
      darkText: 'text-[#EEEED2]',
      outerFrame: 'bg-gradient-to-b from-[#1F2937] via-[#111827] to-[#0B0F19] border-[#4B5563] shadow-2xl',
      innerBorder: 'border-[#374151]',
      cornerAccent: 'bg-[#10B981]',
      badgeLabel: 'FIDE MASTER',
      badgeColor: 'text-[#A7F3D0] border-[#059669]',
      highlightMoveColor: 'emerald',
      defaultPieceSkin: 'classic'
    },
    blue: {
      name: 'Cobalto Moderno',
      lightTile: 'bg-[#E2E8F0]',
      darkTile: 'bg-[#475569]',
      lightText: 'text-[#475569]',
      darkText: 'text-[#E2E8F0]',
      outerFrame: 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] border-[#334155] shadow-2xl',
      innerBorder: 'border-[#1E293B]',
      cornerAccent: 'bg-[#38BDF8]',
      badgeLabel: 'MODERN BLUE',
      badgeColor: 'text-[#BAE6FD] border-[#0284C7]',
      highlightMoveColor: 'cyan',
      defaultPieceSkin: 'classic'
    },
    medieval: {
      name: 'Bastión Medieval',
      lightTile: 'bg-[#E4D5C1]',
      darkTile: 'bg-[#6F4E37]',
      lightText: 'text-[#6F4E37]',
      darkText: 'text-[#E4D5C1]',
      outerFrame: 'bg-gradient-to-b from-[#2D2118] via-[#1F1610] to-[#120D09] border-[#8C6D53] shadow-[0_16px_40px_rgba(20,10,5,0.85)] ring-1 ring-[#D97706]/40',
      innerBorder: 'border-[#533927]',
      cornerAccent: 'bg-[#F59E0B]',
      badgeLabel: 'FEUDAL REAL',
      badgeColor: 'text-[#FDE68A] border-[#D97706]/60 bg-[#451A03]/60',
      highlightMoveColor: 'amber',
      tileTexturePattern: 'pattern-stone',
      defaultPieceSkin: 'medieval'
    },
    war: {
      name: 'Trinchera & Blindaje',
      lightTile: 'bg-[#A7AE90]',
      darkTile: 'bg-[#434D37]',
      lightText: 'text-[#2D3425]',
      darkText: 'text-[#DCE3CA]',
      outerFrame: 'bg-gradient-to-b from-[#283022] via-[#1C2218] to-[#10140E] border-[#4D5B41] shadow-[0_16px_40px_rgba(10,20,10,0.85)] ring-1 ring-[#10B981]/40',
      innerBorder: 'border-[#38432F]',
      cornerAccent: 'bg-[#10B981]',
      badgeLabel: 'TACTICAL OPS',
      badgeColor: 'text-[#A7F3D0] border-[#059669]/60 bg-[#064E3B]/60',
      highlightMoveColor: 'emerald',
      tileTexturePattern: 'pattern-camo',
      defaultPieceSkin: 'war'
    },
    space: {
      name: 'Galaxia Cósmica',
      lightTile: 'bg-[#818CF8]',
      darkTile: 'bg-[#1E1B4B]',
      lightText: 'text-[#1E1B4B]',
      darkText: 'text-[#C7D2FE]',
      outerFrame: 'bg-gradient-to-b from-[#1E1B4B] via-[#0F0D2E] to-[#050414] border-[#4338CA] shadow-[0_16px_40px_rgba(30,27,75,0.9)] ring-1 ring-[#06B6D4]/50',
      innerBorder: 'border-[#312E81]',
      cornerAccent: 'bg-[#06B6D4]',
      badgeLabel: 'QUANTUM CORE',
      badgeColor: 'text-[#A5F3FC] border-[#06B6D4]/60 bg-[#083344]/60',
      highlightMoveColor: 'cyan',
      tileTexturePattern: 'pattern-stars',
      defaultPieceSkin: 'space'
    },
    zombie: {
      name: 'Yermo Tóxico',
      lightTile: 'bg-[#84CC16]',
      darkTile: 'bg-[#365314]',
      lightText: 'text-[#14532D]',
      darkText: 'text-[#BEF264]',
      outerFrame: 'bg-gradient-to-b from-[#1C1917] via-[#141210] to-[#0C0A09] border-[#4D7C0F] shadow-[0_16px_40px_rgba(20,40,10,0.9)] ring-1 ring-[#84CC16]/50',
      innerBorder: 'border-[#27272A]',
      cornerAccent: 'bg-[#84CC16]',
      badgeLabel: 'BIOHAZARD',
      badgeColor: 'text-[#D9F99D] border-[#84CC16]/60 bg-[#1A2E05]/70',
      highlightMoveColor: 'lime',
      tileTexturePattern: 'pattern-bio',
      defaultPieceSkin: 'zombie'
    },
    cyberpunk: {
      name: 'Neo-Tokyo 2099',
      lightTile: 'bg-[#06B6D4]',
      darkTile: 'bg-[#831843]',
      lightText: 'text-[#083344]',
      darkText: 'text-[#67E8F9]',
      outerFrame: 'bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#030712] border-[#06B6D4] shadow-[0_16px_45px_rgba(6,182,212,0.35)] ring-1 ring-[#D946EF]/70',
      innerBorder: 'border-[#1E1B4B]',
      cornerAccent: 'bg-[#D946EF]',
      badgeLabel: 'CYBER MATRIX',
      badgeColor: 'text-[#F5D0FE] border-[#D946EF]/70 bg-[#701A75]/60',
      highlightMoveColor: 'fuchsia',
      tileTexturePattern: 'pattern-matrix',
      defaultPieceSkin: 'cyberpunk'
    },
    animals: {
      name: 'Selva Sagrada',
      lightTile: 'bg-[#86EFAC]',
      darkTile: 'bg-[#14532D]',
      lightText: 'text-[#14532D]',
      darkText: 'text-[#BBF7D0]',
      outerFrame: 'bg-gradient-to-b from-[#143D22] via-[#0C2916] to-[#06180C] border-[#10B981] shadow-[0_16px_40px_rgba(6,78,59,0.85)] ring-1 ring-[#10B981]/50',
      innerBorder: 'border-[#064E3B]',
      cornerAccent: 'bg-[#F59E0B]',
      badgeLabel: 'REINO ANCESTRAL',
      badgeColor: 'text-[#A7F3D0] border-[#10B981]/60 bg-[#064E3B]/60',
      highlightMoveColor: 'emerald',
      tileTexturePattern: 'pattern-nature',
      defaultPieceSkin: 'animals'
    },
    gold: {
      name: 'Emperador 24K',
      lightTile: 'bg-[#FDE047]',
      darkTile: 'bg-[#78350F]',
      lightText: 'text-[#713F12]',
      darkText: 'text-[#FEF08A]',
      outerFrame: 'bg-gradient-to-b from-[#451A03] via-[#2E1002] to-[#1C0A01] border-[#F59E0B] shadow-[0_16px_45px_rgba(245,158,11,0.35)] ring-2 ring-[#FCD34D]/60',
      innerBorder: 'border-[#78350F]',
      cornerAccent: 'bg-[#EF4444]',
      badgeLabel: '24K ROYAL GOLD',
      badgeColor: 'text-[#FEF08A] border-[#F59E0B] bg-[#78350F]/70',
      highlightMoveColor: 'amber',
      tileTexturePattern: 'pattern-gold',
      defaultPieceSkin: 'gold'
    }
  };

  const currentThemeKey = (boardTheme in themes) ? boardTheme : 'classic';
  const themeConfig = themes[currentThemeKey] || themes.classic;

  // Decide piece skin: explicit prop > theme default > 'classic'
  const effectivePieceSkin: PieceSkinId = (pieceSkin as PieceSkinId) || themeConfig.defaultPieceSkin || 'classic';

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
    <div className="relative w-full aspect-square select-none touch-manipulation mx-auto flex items-center justify-center">
      {/* Background Scenic Wallpaper if provided */}
      {wallpaper && (
        <div className="absolute -inset-4 sm:-inset-6 rounded-3xl overflow-hidden pointer-events-none -z-10 shadow-2xl opacity-40 blur-xs">
          <img
            src={wallpaper}
            alt="Scenic Wallpaper"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>
      )}

      {/* Themed Outer Frame & Border Wrapper */}
      <div 
        className={`w-full h-full p-2 sm:p-3.5 md:p-4 rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-all duration-300 ${themeConfig.outerFrame} relative flex flex-col justify-between`}
      >
        {/* Top Themed Header Trim with Badges & Corner Rivets */}
        {showFrameDecorations && (
          <div className="flex items-center justify-between px-1.5 pb-1 sm:pb-2 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            {/* Top Left Corner Stud */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${themeConfig.cornerAccent} shadow-sm inline-block`} />
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black border ${themeConfig.badgeColor}`}>
                {themeConfig.badgeLabel}
              </span>
            </div>

            {/* Top Right Piece Skin Tag */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] opacity-75 font-semibold text-slate-300">
                Skin: <strong className="text-white capitalize">{effectivePieceSkin}</strong>
              </span>
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${themeConfig.cornerAccent} shadow-sm inline-block`} />
            </div>
          </div>
        )}

        {/* The 64-Square Chess Grid with Inner Bevel */}
        <div className={`relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden border sm:border-2 ${themeConfig.innerBorder} shadow-inner bg-slate-950`}>
          {/* Subtle SVG Tile Pattern Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 mix-blend-overlay z-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tile-grid-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tile-grid-mesh)" />
          </svg>

          <div 
            id="chess-board-grid"
            className="grid grid-cols-8 aspect-square w-full h-full relative touch-manipulation z-10"
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
                      relative aspect-square flex items-center justify-center cursor-pointer transition-all duration-150 select-none
                      ${isLight ? themeConfig.lightTile : themeConfig.darkTile}
                      ${isLastMoveFrom || isLastMoveTo ? 'bg-amber-300/60 ring-inset ring-2 ring-amber-400' : ''}
                      ${isHighlightFrom ? (highlightColor === 'violet' ? 'bg-purple-400/60 ring-inset ring-4 ring-purple-500 z-15' : 'bg-cyan-400/60 ring-inset ring-4 ring-cyan-500 z-15') : ''}
                      ${isHighlightTo ? (highlightColor === 'violet' ? 'bg-purple-300/70 ring-inset ring-4 ring-purple-600 animate-pulse z-15' : 'bg-cyan-300/70 ring-inset ring-4 ring-cyan-600 animate-pulse z-15') : ''}
                      ${isStockfishFrom ? 'bg-emerald-400/50 ring-inset ring-2 ring-emerald-500 z-15' : ''}
                      ${isStockfishTo ? 'bg-emerald-300/60 ring-inset ring-4 ring-emerald-600 animate-pulse z-15' : ''}
                      ${isSelected ? 'bg-amber-400/80 ring-4 ring-inset ring-amber-500 z-20 scale-[1.02]' : ''}
                      ${isHint ? 'bg-emerald-400/70 animate-pulse ring-4 ring-emerald-500 z-20' : ''}
                      ${isKingInCheck ? 'bg-rose-500/85 ring-4 ring-rose-600 animate-bounce z-20' : ''}
                    `}
                  >
                    {/* Rank Coordinate (1-8 on left-most column) */}
                    {showCoordinates && fileIdx === 0 && (
                      <span className={`absolute top-0.5 left-1 text-[8px] sm:text-[10px] md:text-xs font-black select-none leading-none pointer-events-none ${isLight ? themeConfig.lightText : themeConfig.darkText} opacity-80 drop-shadow-xs`}>
                        {rank}
                      </span>
                    )}

                    {/* File Coordinate (a-h on bottom-most row) */}
                    {showCoordinates && rankIdx === 7 && (
                      <span className={`absolute bottom-0.5 right-1 text-[8px] sm:text-[10px] md:text-xs font-black select-none leading-none pointer-events-none ${isLight ? themeConfig.lightText : themeConfig.darkText} opacity-80 drop-shadow-xs`}>
                        {file}
                      </span>
                    )}

                    {/* Stockfish best move ping */}
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
                          <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-slate-900/60 dark:bg-white/70 rounded-full shadow-md backdrop-blur-xs ring-2 ring-black/20" />
                        )}
                      </div>
                    )}

                    {/* Themed Piece Vector Icon */}
                    {piece && (
                      <div
                        draggable={interactive && piece.color === turn}
                        onDragStart={(e) => handleDragStart(e, squareName)}
                        className={`w-[88%] h-[88%] flex items-center justify-center transition-transform duration-150 pointer-events-none ${
                          isSelected ? 'scale-115 drop-shadow-2xl z-30' : 'drop-shadow-md'
                        } ${
                          interactive && piece.color === turn ? 'cursor-grab active:cursor-grabbing hover:scale-105' : 'cursor-default'
                        }`}
                      >
                        <ChessPieceIcon
                          type={piece.type}
                          color={piece.color}
                          skin={effectivePieceSkin}
                          className="w-full h-full pointer-events-none"
                        />
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
                    <polygon points="0 0, 6 3, 0 6" fill="#10b981" opacity="0.95" />
                  </marker>
                </defs>
                <line
                  x1={`${arrowCoords.from.x}%`}
                  y1={`${arrowCoords.from.y}%`}
                  x2={`${arrowCoords.to.x}%`}
                  y2={`${arrowCoords.to.y}%`}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.9"
                  markerEnd="url(#stockfish-arrowhead)"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Bottom Themed Footer Trim */}
        {showFrameDecorations && (
          <div className="flex items-center justify-between px-1.5 pt-1 sm:pt-2 text-[9px] sm:text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${themeConfig.cornerAccent}`} />
              <span>{orientation === 'w' ? 'Blancas abajo (♔)' : 'Negras abajo (♚)'}</span>
            </span>
            <span className="italic opacity-80">{themeConfig.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
