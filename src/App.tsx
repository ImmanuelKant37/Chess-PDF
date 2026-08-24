import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  BookOpen,
  FileDown,
  Heart,
  RotateCcw,
  Dice5,
  Filter,
  CheckCircle2,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Puzzle, TacticalTheme, MateDepth } from './types';
import { COMPREHENSIVE_PUZZLES } from './data/puzzleDatabase';
import { TACTICAL_THEMES } from './data/puzzles';
import { Header, AppTab } from './components/Header';
import { PuzzlePlayer } from './components/PuzzlePlayer';
import { TrainingMode } from './components/TrainingMode';
import { PuzzleLibrary } from './components/PuzzleLibrary';
import { PDFExportModal } from './components/PDFExportModal';
import { SoloSelfPlayTraining } from './components/SoloSelfPlayTraining';
import { VsAIMode } from './components/VsAIMode';
import { TournamentMode } from './components/TournamentMode';
import { AdventureMode } from './components/AdventureMode';
import { ShopView } from './components/ShopView';
import { FloatingFullscreenButton } from './components/FloatingFullscreenButton';
import { SettingsModal } from './components/SettingsModal';
import { AdventureSaveState, HeroState } from './types/adventure';
import { DEFAULT_ADVENTURE_SAVE } from './data/adventureData';

const ADVENTURE_STORAGE_KEY = 'ajedrez_tactico_adventure_save_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<AppTab>('adventure');

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Adventure Save & Gold State
  const [adventureSave, setAdventureSave] = useState<AdventureSaveState>(() => {
    try {
      const saved = localStorage.getItem(ADVENTURE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ADVENTURE_SAVE;
  });

  // Keep adventureSave synced
  const handleUpdateHeroState = (updatedHero: HeroState) => {
    setAdventureSave((prev) => {
      const next = {
        ...prev,
        hero: updatedHero
      };
      try {
        localStorage.setItem(ADVENTURE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Puzzles and active index
  const [puzzles, setPuzzles] = useState<Puzzle[]>(COMPREHENSIVE_PUZZLES);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);

  // Generator filter settings
  const [generatorMate, setGeneratorMate] = useState<MateDepth | 'any'>('any');
  const [generatorTheme, setGeneratorTheme] = useState<TacticalTheme | 'any'>('any');

  // Persistence: Favorites & Solved history
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_favorites');
      return saved ? JSON.parse(saved) : ['m2-01', 'm3-01'];
    } catch {
      return ['m2-01', 'm3-01'];
    }
  });

  const [solvedHistory, setSolvedHistory] = useState<Record<string, { solved: boolean; lastAttempt: string }>>(() => {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_streak');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Settings
  const [notationFormat, setNotationFormat] = useState<'spanish' | 'international' | 'figurine'>(() => {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_notation');
      return (saved as 'spanish' | 'international' | 'figurine') || 'spanish';
    } catch {
      return 'spanish';
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_dark');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // PDF Export Modal State
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);
  const [puzzlesToExport, setPuzzlesToExport] = useState<Puzzle[]>([]);
  const [exportTitle, setExportTitle] = useState<string>('Ajedrez Táctico - Cuaderno de Jaque Mate');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ajedrez_tactico_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ajedrez_tactico_history', JSON.stringify(solvedHistory));
  }, [solvedHistory]);

  useEffect(() => {
    localStorage.setItem('ajedrez_tactico_streak', String(currentStreak));
  }, [currentStreak]);

  useEffect(() => {
    localStorage.setItem('ajedrez_tactico_notation', notationFormat);
  }, [notationFormat]);

  useEffect(() => {
    localStorage.setItem('ajedrez_tactico_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle favorite
  const handleToggleFavorite = (puzzleId: string) => {
    setFavorites(prev =>
      prev.includes(puzzleId) ? prev.filter(id => id !== puzzleId) : [...prev, puzzleId]
    );
  };

  // Puzzle solved callback
  const handlePuzzleSolved = (puzzleId: string, timeSpentSeconds: number, hintsUsed: number) => {
    setSolvedHistory(prev => ({
      ...prev,
      [puzzleId]: { solved: true, lastAttempt: new Date().toISOString() }
    }));
    setCurrentStreak(prev => prev + 1);
  };

  // Random puzzle generator with custom target filters
  const handleGenerateWithFilter = (targetMate: MateDepth | 'any', targetTheme: TacticalTheme | 'any') => {
    let pool = COMPREHENSIVE_PUZZLES;
    if (targetMate !== 'any') {
      pool = pool.filter(p => p.mateIn === targetMate);
    }
    if (targetTheme !== 'any') {
      pool = pool.filter(p => p.theme === targetTheme);
    }
    if (pool.length === 0) {
      pool = targetMate !== 'any' ? COMPREHENSIVE_PUZZLES.filter(p => p.mateIn === targetMate) : COMPREHENSIVE_PUZZLES;
    }
    if (pool.length === 0) pool = COMPREHENSIVE_PUZZLES;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    const indexInMain = COMPREHENSIVE_PUZZLES.findIndex(p => p.id === chosen.id);
    if (indexInMain !== -1) {
      setCurrentPuzzleIndex(indexInMain);
    }
  };

  const handleGenerateNew = () => {
    handleGenerateWithFilter(generatorMate, generatorTheme);
  };

  const handleSelectMateFilter = (mate: MateDepth | 'any') => {
    setGeneratorMate(mate);
    handleGenerateWithFilter(mate, generatorTheme);
  };

  const handleSelectThemeFilter = (theme: TacticalTheme | 'any') => {
    setGeneratorTheme(theme);
    handleGenerateWithFilter(generatorMate, theme);
  };

  const handleSelectSpecificPuzzle = (puzzle: Puzzle) => {
    const idx = COMPREHENSIVE_PUZZLES.findIndex(p => p.id === puzzle.id);
    if (idx !== -1) {
      setCurrentPuzzleIndex(idx);
      setActiveTab('player');
    }
  };

  // Open PDF modal with custom puzzles
  const handleOpenPDFWithPuzzles = (customPuzzles?: Puzzle[], title?: string) => {
    setPuzzlesToExport(customPuzzles || COMPREHENSIVE_PUZZLES);
    if (title) setExportTitle(title);
    setIsPDFModalOpen(true);
  };

  const currentPuzzle = COMPREHENSIVE_PUZZLES[currentPuzzleIndex] || COMPREHENSIVE_PUZZLES[0];
  const totalSolvedCount = Object.values(solvedHistory).filter(
    (h): h is { solved: boolean; lastAttempt: string } => Boolean(h && typeof h === 'object' && 'solved' in h && h.solved)
  ).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100/70 text-slate-900'}`}>
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPDF={() => handleOpenPDFWithPuzzles(COMPREHENSIVE_PUZZLES, 'Cuaderno de Táctica de Ajedrez')}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        goldCount={adventureSave.hero.gold}
        stats={{
          solvedCount: totalSolvedCount,
          streak: currentStreak,
          favoritesCount: favorites.length
        }}
        notationFormat={notationFormat}
        setNotationFormat={setNotationFormat}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onGenerateRandom={handleGenerateNew}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-4 flex flex-col gap-3 sm:gap-4">
        {/* TAB -1: MODO AVENTURA RPG */}
        {activeTab === 'adventure' && (
          <AdventureMode
            boardTheme="classic"
            notationFormat={notationFormat}
          />
        )}

        {/* TAB: BAZAR / TIENDA DE TABLEROS, SKINS Y MASCOTAS */}
        {activeTab === 'shop' && (
          <ShopView
            hero={adventureSave.hero}
            onUpdateHero={handleUpdateHeroState}
            onOpenAdventure={() => setActiveTab('adventure')}
          />
        )}

        {/* TAB 0: MODO VS IA CON NIVELES */}
        {activeTab === 'vs-ai' && (
          <VsAIMode
            boardTheme="classic"
            notationFormat={notationFormat}
          />
        )}

        {/* TAB 1: MODO TORNEO VS BOTS */}
        {activeTab === 'tournament' && (
          <TournamentMode
            boardTheme="classic"
            notationFormat={notationFormat}
          />
        )}

        {/* TAB 2: AUTO-JUEGO CON IA & TUTOR DE ENTRENAMIENTO */}
        {activeTab === 'selfplay' && (
          <SoloSelfPlayTraining
            boardTheme="classic"
            notationFormat={notationFormat}
          />
        )}

        {/* TAB 1: GENERADOR & TABLERO INTERACTIVO */}
        {activeTab === 'player' && (
          <div className="flex flex-col gap-6">
            {/* Quick Generator Bento Toolbar */}
            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Filter className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Generador:
                  </span>
                </div>

                {/* Mate selection */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  {(['any', 2, 3, 4] as const).map(option => (
                    <button
                      key={option}
                      id={`generator-mate-btn-${option}`}
                      onClick={() => handleSelectMateFilter(option)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                        generatorMate === option
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {option === 'any' ? 'Todos los Mates' : `Mate en ${option}`}
                    </button>
                  ))}
                </div>

                {/* Theme selector */}
                <select
                  id="generator-theme-select"
                  value={generatorTheme}
                  onChange={e => handleSelectThemeFilter(e.target.value as TacticalTheme | 'any')}
                  className="px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="any">Cualquier Patrón Táctico</option>
                  {Object.values(TACTICAL_THEMES).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <button
                  id="generate-puzzle-btn"
                  onClick={handleGenerateNew}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-400/30 transition duration-150"
                >
                  <Dice5 className="w-4 h-4" />
                  Generar Nuevo Ejercicio
                </button>
              </div>
            </div>

            {/* Main Interactive Board Player */}
            <PuzzlePlayer
              puzzle={currentPuzzle}
              onNextPuzzle={() => {
                const nextIdx = (currentPuzzleIndex + 1) % COMPREHENSIVE_PUZZLES.length;
                setCurrentPuzzleIndex(nextIdx);
              }}
              onPrevPuzzle={() => {
                const prevIdx = (currentPuzzleIndex - 1 + COMPREHENSIVE_PUZZLES.length) % COMPREHENSIVE_PUZZLES.length;
                setCurrentPuzzleIndex(prevIdx);
              }}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(currentPuzzle.id)}
              onPuzzleSolved={handlePuzzleSolved}
              notationFormat={notationFormat}
            />
          </div>
        )}

        {/* TAB 2: MODO DE ENTRENAMIENTO PERSONALIZADO */}
        {activeTab === 'training' && (
          <TrainingMode
            onExportPDF={(puzzlesList, title) => handleOpenPDFWithPuzzles(puzzlesList, title)}
            notationFormat={notationFormat}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* TAB 3: BIBLIOTECA DE EJERCICIOS Y FAVORITOS */}
        {activeTab === 'library' && (
          <PuzzleLibrary
            onSelectPuzzle={handleSelectSpecificPuzzle}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            solvedHistory={solvedHistory}
            onOpenPDFModal={selectedPuzzles => handleOpenPDFWithPuzzles(selectedPuzzles, 'Colección de Ejercicios Tácticos')}
            notationFormat={notationFormat}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-medium text-center sm:text-left">
            Ajedrez Táctico • Generador de Jaque Mate en 2, 3 y 4 jugadas con soluciones en notación algebraica estándar (SAN).
          </p>
          <div className="flex items-center gap-4 font-bold">
            <span className="text-emerald-600 dark:text-emerald-400">{totalSolvedCount} Resueltos</span>
            <span>•</span>
            <span className="text-rose-500">{favorites.length} Favoritos</span>
            <span>•</span>
            <button
              onClick={() => handleOpenPDFWithPuzzles(COMPREHENSIVE_PUZZLES.filter(p => favorites.includes(p.id)), 'Mis Ejercicios Favoritos')}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              Exportar Favoritos a PDF
            </button>
          </div>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <PDFExportModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        puzzles={puzzlesToExport}
        defaultTitle={exportTitle}
      />

      {/* Settings & Optimization Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        notationFormat={notationFormat}
        setNotationFormat={setNotationFormat}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Global Floating Fullscreen Button */}
      <FloatingFullscreenButton />
    </div>
  );
}
