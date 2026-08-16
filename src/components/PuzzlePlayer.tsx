import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Lightbulb,
  Eye,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  FastForward,
  Rewind
} from 'lucide-react';
import { Puzzle, TacticalTheme } from '../types';
import { ChessBoard } from './ChessBoard';
import { chessAudio } from '../utils/chessAudio';
import { convertSanToSpanish, convertSanToFigurine } from '../utils/notation';
import { TACTICAL_THEMES } from '../data/puzzles';

interface PuzzlePlayerProps {
  puzzle: Puzzle;
  onNextPuzzle?: () => void;
  onPrevPuzzle?: () => void;
  onToggleFavorite?: (puzzleId: string) => void;
  isFavorite?: boolean;
  onPuzzleSolved?: (puzzleId: string, timeSpentSeconds: number, hintsUsed: number) => void;
  notationFormat?: 'spanish' | 'international' | 'figurine';
}

export const PuzzlePlayer: React.FC<PuzzlePlayerProps> = ({
  puzzle,
  onNextPuzzle,
  onPrevPuzzle,
  onToggleFavorite,
  isFavorite = false,
  onPuzzleSolved,
  notationFormat = 'spanish'
}) => {
  const [chessInstance, setChessInstance] = useState<Chess>(() => new Chess(puzzle.fen));
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'solved' | 'revealed'>('playing');
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or reset when puzzle changes
  useEffect(() => {
    const newChess = new Chess(puzzle.fen);
    setChessInstance(newChess);
    setCurrentStepIndex(0);
    setMoveHistory([]);
    setStatus('playing');
    setHintLevel(0);
    setLastMove(null);
    setHintSquare(null);
    setTimeSpent(0);
    setAnalysisStep(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [puzzle.id, puzzle.fen]);

  // Format SAN according to selected notation
  const formatSan = (san: string, color: 'w' | 'b' = 'w') => {
    if (notationFormat === 'spanish') return convertSanToSpanish(san);
    if (notationFormat === 'figurine') return convertSanToFigurine(san, color === 'w');
    return san;
  };

  const handleUserMove = (from: string, to: string) => {
    if (status === 'solved' || status === 'revealed') return;

    try {
      // Create a temporary clone to validate legality
      const tempChess = new Chess(chessInstance.fen());
      const move = tempChess.move({ from, to, promotion: 'q' });

      if (!move) {
        chessAudio.playWrong();
        setStatus('wrong');
        return;
      }

      // Check if this move matches the expected solution at this step
      const expectedSan = puzzle.solutionSan[currentStepIndex];
      const isExpected = move.san === expectedSan;

      if (isExpected) {
        // Execute move on active board
        chessInstance.move({ from, to, promotion: 'q' });
        setChessInstance(new Chess(chessInstance.fen()));
        setLastMove({ from, to });
        setMoveHistory(prev => [...prev, move.san]);
        setHintSquare(null);

        if (move.captured) {
          chessAudio.playCapture();
        } else {
          chessAudio.playMove();
        }

        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);

        // Check if puzzle is fully completed
        if (nextStepIndex >= puzzle.solutionSan.length) {
          // Solved!
          setStatus('solved');
          chessAudio.playMate();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          if (timerRef.current) clearInterval(timerRef.current);
          if (onPuzzleSolved) {
            onPuzzleSolved(puzzle.id, timeSpent, hintLevel);
          }
        } else {
          // Play opponent's automatic response
          setStatus('playing');
          const opponentSan = puzzle.solutionSan[nextStepIndex];

          setTimeout(() => {
            try {
              const oppMove = chessInstance.move(opponentSan);
              if (oppMove) {
                setChessInstance(new Chess(chessInstance.fen()));
                setLastMove({ from: oppMove.from, to: oppMove.to });
                setMoveHistory(prev => [...prev, oppMove.san]);
                setCurrentStepIndex(nextStepIndex + 1);

                if (oppMove.captured) {
                  chessAudio.playCapture();
                } else if (chessInstance.inCheck()) {
                  chessAudio.playCheck();
                } else {
                  chessAudio.playMove();
                }
              }
            } catch (e) {
              console.error('Opponent move error', e);
            }
          }, 450);
        }
      } else {
        // Incorrect move
        chessAudio.playWrong();
        setStatus('wrong');
      }
    } catch {
      chessAudio.playWrong();
      setStatus('wrong');
    }
  };

  const handleReset = () => {
    const newChess = new Chess(puzzle.fen);
    setChessInstance(newChess);
    setCurrentStepIndex(0);
    setMoveHistory([]);
    setStatus('playing');
    setLastMove(null);
    setHintSquare(null);
  };

  const handleHint = () => {
    if (hintLevel < 3) {
      const nextLevel = hintLevel + 1;
      setHintLevel(nextLevel);

      if (nextLevel === 2) {
        // Highlight destination or start square of next expected move
        try {
          const expectedSan = puzzle.solutionSan[currentStepIndex];
          const tempChess = new Chess(chessInstance.fen());
          const move = tempChess.move(expectedSan);
          if (move) {
            setHintSquare(move.from);
          }
        } catch {
          // fallback
        }
      }
    }
  };

  const handleRevealSolution = () => {
    setStatus('revealed');
    // Load full solution sequence into board
    const fullChess = new Chess(puzzle.fen);
    puzzle.solutionSan.forEach(san => {
      try {
        fullChess.move(san);
      } catch {
        // ignore
      }
    });
    setChessInstance(fullChess);
    setMoveHistory(puzzle.solutionSan);
    setAnalysisStep(puzzle.solutionSan.length);
  };

  const themeInfo = TACTICAL_THEMES[puzzle.theme] || {
    id: puzzle.theme,
    name: puzzle.theme,
    description: 'Patrón táctico clásico',
    difficulty: 'Principiante',
    color: 'emerald'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto w-full">
      {/* LEFT / HERO BENTO CARD: Chessboard & Controls (col-span-7) */}
      <div className="lg:col-span-7 flex flex-col items-center bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none">
        {/* Top Status & Turn Bar */}
        <div className="w-full flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-4 h-4 rounded-full border-2 shadow-xs transition-colors ${
                puzzle.turn === 'w'
                  ? 'bg-white border-slate-400 ring-2 ring-slate-200 dark:ring-slate-700'
                  : 'bg-slate-950 border-slate-600 ring-2 ring-slate-800'
              }`}
            />
            <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {puzzle.turn === 'w' ? 'Juegan Blancas' : 'Juegan Negras'}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold border border-blue-500/20">
              Mate en {puzzle.mateIn}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>

            <button
              id="sound-toggle-btn"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                chessAudio.setMuted(nextMuted);
              }}
              title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            <button
              id="favorite-puzzle-btn"
              onClick={() => onToggleFavorite && onToggleFavorite(puzzle.id)}
              className={`p-2 rounded-xl border transition ${
                isFavorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                  : 'text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200/60 dark:border-slate-700/60'
              }`}
              title={isFavorite ? 'Guardado en favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Interactive Vector Chessboard */}
        <div className="w-full flex justify-center py-1">
          <ChessBoard
            chess={chessInstance}
            orientation={puzzle.turn}
            onMove={handleUserMove}
            lastMove={lastMove}
            hintSquare={hintSquare}
            interactive={status === 'playing' || status === 'wrong'}
            boardTheme="classic"
          />
        </div>

        {/* Board Controls Dock */}
        <div className="flex items-center justify-between w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 px-1">
          <div className="flex items-center gap-2">
            <button
              id="reset-board-btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>

            <button
              id="hint-btn"
              onClick={handleHint}
              disabled={hintLevel >= 3 || status === 'solved' || status === 'revealed'}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition shadow-xs ${
                hintLevel >= 3
                  ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400 shadow-amber-500/20'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Pista ({hintLevel}/3)
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onPrevPuzzle && (
              <button
                id="prev-puzzle-btn"
                onClick={onPrevPuzzle}
                className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition"
                title="Ejercicio anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {onNextPuzzle && (
              <button
                id="next-puzzle-btn"
                onClick={onNextPuzzle}
                className="flex items-center gap-1 px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 border border-blue-400/30 transition"
              >
                Siguiente
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT BENTO STACK: Mission details, Live Alerts, SAN Timeline & Didactic Analysis (col-span-5) */}
      <div className="lg:col-span-5 flex flex-col gap-4 w-full">
        {/* CARD 1: Tactical Mission Header Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {themeInfo.name}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                {puzzle.title}
              </h2>
            </div>

            <span className={`text-[11px] px-3 py-1 rounded-xl font-bold border ${
              puzzle.difficulty === 'Fácil'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                : puzzle.difficulty === 'Medio'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
            }`}>
              {puzzle.difficulty}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {puzzle.description}
          </p>

          {puzzle.source && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic flex items-center gap-1 pt-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              {puzzle.source}
            </p>
          )}
        </div>

        {/* CARD 2: Live Feedback Alert (Solved or Incorrect) */}
        {status === 'solved' && (
          <div className="p-4 rounded-3xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-200">
                ¡Jaque Mate! ¡Excelente resolución!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 font-medium">
                Has ejecutado la combinación forzada en {timeSpent}s utilizando {hintLevel} pista(s).
              </p>
            </div>
          </div>
        )}

        {status === 'wrong' && (
          <div className="p-4 rounded-3xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>Esa jugada no conduce al mate forzado.</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-black text-rose-600 dark:text-rose-400 hover:underline ml-2"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* CARD 3: Progressive Hints Tile */}
        {hintLevel > 0 && (
          <div className="p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col gap-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pista Nivel {hintLevel}:
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed font-medium">
              {puzzle.hints[hintLevel - 1]}
            </p>
          </div>
        )}

        {/* CARD 4: Standard Algebraic Notation (SAN) Timeline Bento Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
              Secuencia en Notación Algebraica (SAN):
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {moveHistory.length} / {puzzle.solutionSan.length} jugadas
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center min-h-[44px] p-2.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            {puzzle.solutionSan.map((expectedSan, idx) => {
              const isPlayed = idx < moveHistory.length;
              const isCurrent = idx === moveHistory.length && status === 'playing';
              const isWhiteTurn = idx % 2 === 0;
              const moveNum = Math.floor(idx / 2) + 1;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-xl transition-all ${
                    isPlayed
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : isCurrent
                      ? 'border border-dashed border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10 animate-pulse font-bold'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isWhiteTurn && <span className="opacity-70 text-[10px]">{moveNum}.</span>}
                  <span>
                    {isPlayed || status === 'revealed' || status === 'solved'
                      ? formatSan(expectedSan, isWhiteTurn ? 'w' : 'b')
                      : '...'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reveal Solution Button */}
          {status !== 'solved' && status !== 'revealed' && (
            <button
              id="reveal-solution-btn"
              onClick={handleRevealSolution}
              className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition"
            >
              <Eye className="w-3.5 h-3.5" />
              Ver solución y análisis pedagógico
            </button>
          )}
        </div>

        {/* CARD 5: Pedagogical Solution Explanations Bento Card */}
        {(status === 'solved' || status === 'revealed') && puzzle.solutionExplanation && (
          <div className="p-5 rounded-3xl bg-slate-900 dark:bg-slate-950 text-slate-100 border border-slate-800 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Explicación Didáctica del Motivo Táctico
            </h4>
            <div className="flex flex-col gap-2.5">
              {puzzle.solutionExplanation.map((explanation, index) => (
                <div key={index} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-emerald-500 font-medium">
                  {explanation}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
