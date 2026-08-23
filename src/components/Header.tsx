import React, { useState } from 'react';
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
  RotateCcw,
  Share2,
  Check,
  Bot,
  Swords
} from 'lucide-react';

export type AppTab = 'vs-ai' | 'tournament' | 'selfplay' | 'player' | 'training' | 'library';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
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
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Ajedrez Táctico IA - Entrenador & Jaque Mate',
      text: 'Entrena ajedrez con IA, juega contra bots de todos los niveles, compite en torneos y resuelve mates en 2, 3 y 4 jugadas.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <header className="w-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/icon.svg"
              alt="Ajedrez Táctico Icono"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl shadow-md shadow-indigo-500/20 border border-indigo-400/30 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                  Ajedrez Táctico
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  IA & Torneos
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Vs IA por niveles • Torneos eliminatorios • Tutor y Análisis Stockfish
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Bento Pill Style */}
          <nav className="flex items-center p-1 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-x-auto max-w-[50vw] sm:max-w-none scrollbar-none">
            {/* VS IA TAB */}
            <button
              id="nav-tab-vs-ai"
              onClick={() => setActiveTab('vs-ai')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'vs-ai'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-500" />
              <span>Vs IA</span>
            </button>

            {/* TORNEO TAB */}
            <button
              id="nav-tab-tournament"
              onClick={() => setActiveTab('tournament')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'tournament'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Torneos</span>
            </button>

            {/* AUTO JUEGO TAB */}
            <button
              id="nav-tab-selfplay"
              onClick={() => setActiveTab('selfplay')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'selfplay'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden lg:inline">Tutor & Auto-Juego</span>
              <span className="lg:hidden">Tutor</span>
            </button>

            {/* GENERADOR MATE TAB */}
            <button
              id="nav-tab-player"
              onClick={() => setActiveTab('player')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'player'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden lg:inline">Generador Mate</span>
              <span className="lg:hidden">Mates</span>
            </button>

            {/* ENTRENAMIENTO TAB */}
            <button
              id="nav-tab-training"
              onClick={() => setActiveTab('training')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'training'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden lg:inline">Entrenamiento</span>
              <span className="lg:hidden">Táctica</span>
            </button>

            {/* BIBLIOTECA TAB */}
            <button
              id="nav-tab-library"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>Biblioteca</span>
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

            {/* Share app button */}
            <button
              id="header-share-btn"
              onClick={handleShare}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition shadow-xs border ${
                copiedShare
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
              }`}
              title="Compartir aplicación"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Compartir</span>
                </>
              )}
            </button>

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
