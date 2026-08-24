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
  Swords,
  Compass,
  Map,
  Sliders,
  ShoppingBag,
  Coins,
  Crown,
  ChevronDown,
  Users,
  Cpu
} from 'lucide-react';

export type AppTab = 
  | 'adventure' 
  | 'tournament' 
  | 'vs-ai' 
  | 'selfplay' 
  | 'shop' 
  | 'player' 
  | 'training' 
  | 'library';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenPDF: () => void;
  onOpenSettings: () => void;
  goldCount?: number;
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
  onOpenSettings,
  goldCount = 150,
  stats,
  notationFormat,
  setNotationFormat,
  darkMode,
  setDarkMode,
  onGenerateRandom
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [isVsDropdownOpen, setIsVsDropdownOpen] = useState(false);
  const [isTutorDropdownOpen, setIsTutorDropdownOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Ajedrez Táctico IA - Aventura, Torneos & Entrenador',
      text: 'Entrena ajedrez con IA, recorre mundos temáticos en el Modo Aventura, compite en torneos y compra skins y mascotas consejeras.',
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

  const isVsActive = activeTab === 'vs-ai';
  const isTutorActive = ['selfplay', 'player', 'training', 'library'].includes(activeTab);

  return (
    <header className="w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 sticky top-0 z-40 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8">
        {/* Top bar with Logo, Main Selectors, and Action Tools */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img
              src="/icon.svg"
              alt="Ajedrez Táctico Icono"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl shadow-md shadow-indigo-500/20 border border-indigo-400/30 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <h1 className="text-xs sm:text-base font-black tracking-tight text-slate-900 dark:text-white truncate">
                  Ajedrez Táctico
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  IA & Aventura
                </span>
              </div>
              <p className="hidden xl:block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Mundos temáticos • Torneos • Vs Bot & Local • Mascotas Consejeras
              </p>
            </div>
          </div>

          {/* DESKTOP & TABLET NAVIGATION SELECTORS (Ordered: Aventura, Torneo, Vs, Tutor, Tienda, Ajustes) */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl gap-0.5">
            {/* 1. AVENTURA */}
            <button
              id="nav-tab-adventure"
              onClick={() => setActiveTab('adventure')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'adventure'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-rose-500" />
              <span>Aventura</span>
            </button>

            {/* 2. TORNEO */}
            <button
              id="nav-tab-tournament"
              onClick={() => setActiveTab('tournament')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'tournament'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Torneos</span>
            </button>

            {/* 3. VS (BOT / LOCAL) */}
            <div className="relative">
              <button
                id="nav-tab-vs"
                onClick={() => setActiveTab('vs-ai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  isVsActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Swords className="w-3.5 h-3.5 text-indigo-500" />
                <span>Vs (Bot / 2P)</span>
              </button>
            </div>

            {/* 4. TUTOR / AUTO-JUEGO / MATES */}
            <div className="relative">
              <button
                id="nav-tab-tutor"
                onClick={() => setActiveTab('selfplay')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  isTutorActive
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Tutor & Táctica</span>
              </button>
            </div>

            {/* 5. TIENDA */}
            <button
              id="nav-tab-shop"
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'shop'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tienda</span>
            </button>
          </nav>

          {/* Action Buttons: Gold Pill, Ajustes, Share, DarkMode */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Gold Wallet Pill */}
            <button
              onClick={() => setActiveTab('shop')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black transition cursor-pointer"
              title="Monedas ganadas en Aventura (Ir a Tienda)"
            >
              <Coins className="w-3.5 h-3.5 fill-current" />
              <span>{goldCount.toLocaleString()}</span>
            </button>

            {/* Ajustes Button */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition cursor-pointer"
              title="Ajustes & Optimización de Stockfish"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">Ajustes</span>
            </button>

            {/* Quick PDF button */}
            <button
              id="header-quick-pdf-btn"
              onClick={onOpenPDF}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition cursor-pointer"
              title="Exportar Cuaderno PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>PDF</span>
            </button>

            {/* Dark Mode toggle */}
            <button
              id="header-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Share app button */}
            <button
              id="header-share-btn"
              onClick={handleShare}
              className="p-1.5 sm:p-2 text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl transition cursor-pointer"
              title="Compartir aplicación"
            >
              {copiedShare ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION BAR: Always visible on mobile screens */}
        <div className="md:hidden py-1.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {/* 1. Aventura */}
          <button
            onClick={() => setActiveTab('adventure')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'adventure'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Aventura</span>
          </button>

          {/* 2. Torneo */}
          <button
            onClick={() => setActiveTab('tournament')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'tournament'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Torneo</span>
          </button>

          {/* 3. Vs */}
          <button
            onClick={() => setActiveTab('vs-ai')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition cursor-pointer whitespace-nowrap ${
              isVsActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Vs Bot</span>
          </button>

          {/* 4. Tutor */}
          <button
            onClick={() => setActiveTab('selfplay')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition cursor-pointer whitespace-nowrap ${
              isTutorActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tutor</span>
          </button>

          {/* 5. Tienda */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'shop'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Tienda</span>
          </button>

          {/* 6. Ajustes */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Ajustes"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          </button>
        </div>

        {/* Secondary Subtabs when Tutor is active (SelfPlay / Mate Generator / Training / Library) */}
        {isTutorActive && (
          <div className="py-1 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('selfplay')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTab === 'selfplay'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Tutor Didáctico & Auto-Juego</span>
            </button>

            <button
              onClick={() => setActiveTab('player')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTab === 'player'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Generador de Jaque Mate</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTab === 'training'
                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>Entrenamiento Táctico</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                activeTab === 'library'
                  ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Biblioteca de Puzzles</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
