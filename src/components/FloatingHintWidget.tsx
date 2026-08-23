import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Zap,
  Target,
  Copy,
  Check
} from 'lucide-react';
import { Puzzle } from '../types';
import { TACTICAL_THEMES } from '../data/puzzles';
import { chessAudio } from '../utils/chessAudio';
import { convertSanToSpanish, convertSanToFigurine } from '../utils/notation';

interface FloatingHintWidgetProps {
  puzzle: Puzzle;
  currentHintLevel?: number;
  onHintLevelChange?: (level: number) => void;
  notationFormat?: 'spanish' | 'international' | 'figurine';
  className?: string;
}

export const FloatingHintWidget: React.FC<FloatingHintWidgetProps> = ({
  puzzle,
  currentHintLevel = 0,
  onHintLevelChange,
  notationFormat = 'spanish',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => Math.max(1, currentHintLevel));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sync with prop when puzzle changes
  useEffect(() => {
    setUnlockedLevel(Math.max(1, currentHintLevel));
  }, [puzzle.id, currentHintLevel]);

  // Keyboard shortcut: Press 'H' or 'p' to toggle hint widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'h' || e.key === 'H' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatSan = (san: string) => {
    if (notationFormat === 'spanish') return convertSanToSpanish(san);
    if (notationFormat === 'figurine') return convertSanToFigurine(san, puzzle.turn === 'w');
    return san;
  };

  const handleUnlockNext = () => {
    if (unlockedLevel < 3) {
      const next = unlockedLevel + 1;
      setUnlockedLevel(next);
      chessAudio.playSelect();
      if (onHintLevelChange) {
        onHintLevelChange(next);
      }
    }
  };

  const handleCopyMove = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    chessAudio.playSelect();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const themeInfo = TACTICAL_THEMES[puzzle.theme] || {
    id: puzzle.theme,
    name: puzzle.theme,
    description: 'Patrón táctico clásico',
    difficulty: 'Principiante',
    color: 'amber'
  };

  const hintsList = puzzle.hints && puzzle.hints.length > 0 ? puzzle.hints : [
    'Observa las piezas sobrecargadas o desprotegidas del oponente.',
    'Busca un jaque forzado que reduzca las casillas de escape del rey.',
    `La jugada clave inicial comienza con ${puzzle.solutionSan[0] || 'la combinación'}.`
  ];

  return (
    <div className={`fixed bottom-5 left-5 z-40 ${className}`}>
      {/* Expanded Floating Card */}
      {isOpen ? (
        <div className="w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/40 dark:border-amber-500/30 shadow-2xl shadow-amber-500/10 dark:shadow-slate-950/80 p-4 sm:p-5 flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs">
                <Lightbulb className="w-4 h-4 fill-amber-500/30" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  Pistas Tácticas
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold border border-amber-500/20">
                    Mate en {puzzle.mateIn}
                  </span>
                </h4>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {themeInfo.name}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                chessAudio.playSelect();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Minimizar pistas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progressive Hint Levels List */}
          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
            {/* Level 1: Concept & Pattern */}
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Nivel 1: Patrón & Motivo
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Desbloqueado
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                {hintsList[0]}
              </p>
            </div>

            {/* Level 2: Piece & Direction */}
            <div className={`p-3 rounded-2xl border transition-all ${
              unlockedLevel >= 2
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
                : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Nivel 2: Pieza Clave & Coordinación
                </span>
                {unlockedLevel >= 2 ? (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Desbloqueado
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">
                    Bloqueado
                  </span>
                )}
              </div>
              {unlockedLevel >= 2 ? (
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                  {hintsList[1]}
                </p>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">
                  Revela la pieza atacante y el punto vulnerable.
                </p>
              )}
            </div>

            {/* Level 3: Concrete First Move */}
            <div className={`p-3 rounded-2xl border transition-all ${
              unlockedLevel >= 3
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
                : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Nivel 3: Jugada Inicial Concreta
                </span>
                {unlockedLevel >= 3 ? (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Desbloqueado
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">
                    Bloqueado
                  </span>
                )}
              </div>
              {unlockedLevel >= 3 ? (
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-amber-200/40 dark:border-amber-900/30">
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-bold font-mono">
                    {hintsList[2] || `Juega 1. ${formatSan(puzzle.solutionSan[0])}`}
                  </p>
                  <button
                    onClick={() => handleCopyMove(formatSan(puzzle.solutionSan[0]), 3)}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-amber-100 dark:hover:bg-amber-900/40 transition"
                    title="Copiar jugada SAN"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">
                  Muestra la primera jugada exacta en notación SAN.
                </p>
              )}
            </div>
          </div>

          {/* Unlock Next Hint Button */}
          {unlockedLevel < 3 && (
            <button
              onClick={handleUnlockNext}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-98 text-white text-xs font-black rounded-2xl shadow-md shadow-amber-500/20 border border-amber-400/30 transition"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Desbloquear Nivel {unlockedLevel + 1}
            </button>
          )}

          {/* Quick didactic tip footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Pistas Rápidas (&lt;250ms)</span>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {unlockedLevel}/3 Reveladas
            </span>
          </div>
        </div>
      ) : (
        /* Minimized Floating Launcher Button */
        <button
          id="floating-training-hint-widget-btn"
          onClick={() => {
            chessAudio.playSelect();
            setIsOpen(true);
          }}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/30 border border-amber-300/40 active:scale-95 transition-all duration-200"
          title="Ver pistas tácticas (Atajo: H)"
        >
          <div className="relative">
            <Lightbulb className="w-5 h-5 fill-amber-200 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none text-white drop-shadow-xs">
              Ver Pista
            </span>
            <span className="text-[10px] font-bold text-amber-100/90 leading-tight">
              {unlockedLevel > 0 ? `Nivel ${unlockedLevel}/3` : 'Disponible'}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
