import React from 'react';
import {
  Sparkles,
  Trophy,
  Target,
  BookOpen,
  FileDown,
  Heart,
  Flame,
  Sun,
  Moon,
  Zap,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'player' | 'training' | 'library';
  setActiveTab: (tab: 'player' | 'training' | 'library') => void;
  onOpenPDF: () => void;
  stats: {
    solvedCount: number;
    streak: number;
    favoritesCount: number;
  };
  notationFormat: 'spanish' | 'international' | 'figurine';
  setNotationFormat: (format: 'spanish' | 'international' | 'figurine') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onGenerateRandom: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPDF,
  stats,
  notationFormat,
  setNotationFormat,
  darkMode,
  setDarkMode,
  onGenerateRandom
}) => {
  return (
    <header className="w-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 font-serif text-2xl font-black">
              ♔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Ajedrez Táctico
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Mate en 2·3·4
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
                Generador y entrenador táctico de jaque mate
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Bento Pill Style */}
          <nav className="flex items-center p-1.5 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
            <button
              id="nav-tab-player"
              onClick={() => setActiveTab('player')}
              className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                activeTab === 'player'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Generador / Tablero</span>
              <span className="md:hidden">Tablero</span>
            </button>

            <button
              id="nav-tab-training"
              onClick={() => setActiveTab('training')}
              className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                activeTab === 'training'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Entrenamiento</span>
              <span className="md:hidden">Entrenar</span>
            </button>

            <button
              id="nav-tab-library"
              onClick={() => setActiveTab('library')}
              className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">Biblioteca</span>
              <span className="md:hidden">Puzzles</span>
            </button>
          </nav>

          {/* Right Action Tools & Bento Chips */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Stats Pill */}
            {stats.streak > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Racha: {stats.streak}</span>
              </div>
            )}

            {/* Quick PDF button */}
            <button
              id="header-quick-pdf-btn"
              onClick={onOpenPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition shadow-xs"
              title="Exportar a PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">Cuaderno PDF</span>
            </button>

            {/* Notation selector */}
            <select
              value={notationFormat}
              onChange={e => setNotationFormat(e.target.value as 'spanish' | 'international' | 'figurine')}
              className="hidden xl:block px-3 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold focus:outline-none cursor-pointer"
              title="Notación de piezas"
            >
              <option value="spanish">Notación SAN Español (D, T, A, C, R)</option>
              <option value="international">Notación SAN Internacional (Q, R, B, N, K)</option>
              <option value="figurine">Notación Figuras (♛, ♜, ♝, ♞)</option>
            </select>

            {/* Dark Mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
