import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Play,
  RotateCcw,
  Clock,
  Flame,
  Target,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  FileDown,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { Puzzle, TacticalTheme, TrainingSessionConfig, TrainingResult, MateDepth } from '../types';
import { TACTICAL_THEMES } from '../data/puzzles';
import { COMPREHENSIVE_PUZZLES } from '../data/puzzleDatabase';
import { PuzzlePlayer } from './PuzzlePlayer';

interface TrainingModeProps {
  onExportPDF: (puzzlesToExport: Puzzle[], sessionTitle?: string) => void;
  notationFormat: 'spanish' | 'international' | 'figurine';
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const TrainingMode: React.FC<TrainingModeProps> = ({
  onExportPDF,
  notationFormat,
  favorites,
  onToggleFavorite
}) => {
  // Session Configuration State
  const [isConfiguring, setIsConfiguring] = useState<boolean>(true);
  const [selectedMates, setSelectedMates] = useState<MateDepth[]>([2, 3]);
  const [selectedThemes, setSelectedThemes] = useState<TacticalTheme[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<('Fácil' | 'Medio' | 'Desafiante')[]>(['Fácil', 'Medio']);
  const [puzzleCount, setPuzzleCount] = useState<number>(5);
  const [timeLimit, setTimeLimit] = useState<number>(60); // seconds (0 = Zen)
  const [allowHints, setAllowHints] = useState<boolean>(true);

  // Active Workout Session State
  const [sessionPuzzles, setSessionPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionResults, setSessionResults] = useState<TrainingResult[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(timeLimit);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Training Session
  const handleStartSession = () => {
    // Filter available puzzles based on config
    let filtered = COMPREHENSIVE_PUZZLES.filter(p => {
      if (selectedMates.length > 0 && !selectedMates.includes(p.mateIn)) return false;
      if (selectedThemes.length > 0 && !selectedThemes.includes(p.theme)) return false;
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(p.difficulty)) return false;
      return true;
    });

    if (filtered.length === 0) {
      filtered = COMPREHENSIVE_PUZZLES;
    }

    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(puzzleCount, shuffled.length));

    setSessionPuzzles(chosen);
    setCurrentIndex(0);
    setSessionResults([]);
    setIsSessionFinished(false);
    setIsConfiguring(false);
    setStreak(0);
    setMaxStreak(0);
    setSecondsRemaining(timeLimit);
  };

  // Timer effect during active workout
  useEffect(() => {
    if (!isConfiguring && !isSessionFinished && timeLimit > 0) {
      setSecondsRemaining(timeLimit);

      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Time expired on current puzzle
            handlePuzzleResult(false, timeLimit, 0);
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      };
    }
  }, [currentIndex, isConfiguring, isSessionFinished, timeLimit]);

  const handlePuzzleResult = (solved: boolean, timeSpent: number, hintsUsed: number) => {
    const currentPuzzle = sessionPuzzles[currentIndex];
    if (!currentPuzzle) return;

    // Update streak
    if (solved) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
    } else {
      setStreak(0);
    }

    const result: TrainingResult = {
      puzzleId: currentPuzzle.id,
      solved,
      timeSpentSeconds: timeSpent,
      hintsUsed,
      attempts: 1,
      date: new Date().toISOString()
    };

    const nextResults = [...sessionResults, result];
    setSessionResults(nextResults);

    // Next puzzle or finish
    if (currentIndex + 1 < sessionPuzzles.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionFinished(true);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }
  };

  const handleRetryMistakes = () => {
    const failedIds = sessionResults.filter(r => !r.solved).map(r => r.puzzleId);
    const failedPuzzles = sessionPuzzles.filter(p => failedIds.includes(p.id));

    if (failedPuzzles.length > 0) {
      setSessionPuzzles(failedPuzzles);
      setCurrentIndex(0);
      setSessionResults([]);
      setIsSessionFinished(false);
      setStreak(0);
    }
  };

  // 1. CONFIGURATION VIEW
  if (isConfiguring) {
    return (
      <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-xs">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Entrenamiento Táctico Personalizado
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Configura tu sesión intensiva para dominar patrones específicos de jaque mate
            </p>
          </div>
        </div>

        {/* Bento Grid Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {/* Bento Card 1: Mate Depth Selection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Profundidad del Jaque Mate:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([2, 3, 4] as MateDepth[]).map(mate => {
                const isSelected = selectedMates.includes(mate);
                return (
                  <button
                    key={mate}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedMates.length > 1) {
                          setSelectedMates(selectedMates.filter(m => m !== mate));
                        }
                      } else {
                        setSelectedMates([...selectedMates, mate]);
                      }
                    }}
                    className={`py-3 px-2 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>Mate en {mate}</span>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-blue-100' : 'opacity-70'}`}>
                      {mate === 2 ? 'Directo' : mate === 3 ? 'Combinación' : 'Profundo'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bento Card 2: Time Limit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Ritmo de Tiempo por Ejercicio:
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { label: 'Zen', value: 0 },
                { label: '30s Blitz', value: 30 },
                { label: '60s Estándar', value: 60 },
                { label: '120s Lento', value: 120 }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTimeLimit(opt.value)}
                  className={`py-3 px-1.5 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
                    timeLimit === opt.value
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bento Card 3: Puzzle Count */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              3. Cantidad de Ejercicios:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 15].map(count => (
                <button
                  key={count}
                  onClick={() => setPuzzleCount(count)}
                  className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    puzzleCount === count
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {count} Mates
                </button>
              ))}
            </div>
          </div>

          {/* Bento Card 4: Difficulty */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              4. Nivel de Dificultad:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Fácil', 'Medio', 'Desafiante'] as const).map(diff => {
                const isSelected = selectedDifficulties.includes(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedDifficulties.length > 1) {
                          setSelectedDifficulties(selectedDifficulties.filter(d => d !== diff));
                        }
                      } else {
                        setSelectedDifficulties([...selectedDifficulties, diff]);
                      }
                    }}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bento Card 5: Tactical Themes Filter */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              5. Patrones Tácticos ({selectedThemes.length === 0 ? 'Todos incluidos' : `${selectedThemes.length} activos`}):
            </label>
            {selectedThemes.length > 0 && (
              <button
                onClick={() => setSelectedThemes([])}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Restablecer todos
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.values(TACTICAL_THEMES).map(theme => {
              const isSelected = selectedThemes.includes(theme.id);
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedThemes(selectedThemes.filter(t => t !== theme.id));
                    } else {
                      setSelectedThemes([...selectedThemes, theme.id]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {theme.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            id="start-workout-session-btn"
            onClick={handleStartSession}
            className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/25 border border-blue-400/30 transition duration-150"
          >
            <Play className="w-4 h-4 fill-current" />
            Iniciar Sesión de Entrenamiento
          </button>
        </div>
      </div>
    );
  }

  // 2. RECAP / FINISHED VIEW
  if (isSessionFinished) {
    const totalPuzzles = sessionPuzzles.length;
    const solvedCount = sessionResults.filter(r => r.solved).length;
    const failedCount = totalPuzzles - solvedCount;
    const accuracy = totalPuzzles > 0 ? Math.round((solvedCount / totalPuzzles) * 100) : 0;
    const totalTimeSeconds = sessionResults.reduce((acc, r) => acc + r.timeSpentSeconds, 0);

    return (
      <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-200/40 dark:shadow-none text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-500/20 shadow-xs">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ¡Entrenamiento Completado!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Resumen táctico de tu rendimiento y precisión
        </p>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-3 gap-3.5 my-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{accuracy}%</span>
            <span className="block text-xs font-bold text-slate-500 mt-1">Precisión</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{solvedCount}/{totalPuzzles}</span>
            <span className="block text-xs font-bold text-slate-500 mt-1">Aciertos</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-2xl sm:text-3xl font-black text-amber-500">{maxStreak} 🔥</span>
            <span className="block text-xs font-bold text-slate-500 mt-1">Mejor Racha</span>
          </div>
        </div>

        {/* Results List Bento */}
        <div className="text-left mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Desglose por Ejercicio:
          </h4>
          <div className="flex flex-col gap-2.5">
            {sessionPuzzles.map((puzzle, i) => {
              const res = sessionResults[i];
              const isSolved = res?.solved;
              return (
                <div
                  key={puzzle.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      #{i + 1} {puzzle.title}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Mate en {puzzle.mateIn}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    {res ? `${res.timeSpentSeconds}s` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsConfiguring(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition"
          >
            <RotateCcw className="w-4 h-4" />
            Nueva Configuración
          </button>

          {failedCount > 0 && (
            <button
              onClick={handleRetryMistakes}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-2xl transition"
            >
              <Target className="w-4 h-4" />
              Reintentar {failedCount} Fallos
            </button>
          )}

          <button
            onClick={() => onExportPDF(sessionPuzzles, 'Sesión de Entrenamiento Personalizado')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md shadow-blue-500/20 border border-blue-400/30 transition"
          >
            <FileDown className="w-4 h-4" />
            Exportar Cuaderno PDF
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE WORKOUT VIEW
  const currentPuzzle = sessionPuzzles[currentIndex];
  if (!currentPuzzle) return null;

  return (
    <div className="flex flex-col items-center w-full gap-5">
      {/* Top Session Progress Bar Bento */}
      <div className="max-w-4xl w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <span className="text-xs font-black text-slate-600 dark:text-slate-300">
            Ejercicio {currentIndex + 1} de {sessionPuzzles.length}
          </span>
          <div className="w-32 sm:w-52 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / sessionPuzzles.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Streak & Timer indicators */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4 fill-current" />
            <span>Racha: {streak}</span>
          </div>

          {timeLimit > 0 && (
            <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl border ${
              secondsRemaining <= 10
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-200'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{secondsRemaining}s</span>
            </div>
          )}

          <button
            onClick={() => setIsConfiguring(true)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline ml-1"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Main Interactive Player for active workout */}
      <PuzzlePlayer
        key={currentPuzzle.id}
        puzzle={currentPuzzle}
        onPuzzleSolved={(id, time, hints) => handlePuzzleResult(true, time, hints)}
        onNextPuzzle={() => {
          if (currentIndex + 1 < sessionPuzzles.length) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setIsSessionFinished(true);
          }
        }}
        onPrevPuzzle={currentIndex > 0 ? () => setCurrentIndex(prev => prev - 1) : undefined}
        onToggleFavorite={onToggleFavorite}
        isFavorite={favorites.includes(currentPuzzle.id)}
        notationFormat={notationFormat}
      />
    </div>
  );
};
