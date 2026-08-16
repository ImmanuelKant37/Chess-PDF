import React, { useState } from 'react';
import {
  Search,
  Filter,
  Heart,
  Play,
  FileDown,
  CheckSquare,
  Square,
  Sparkles,
  BookOpen,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Puzzle, TacticalTheme } from '../types';
import { TACTICAL_THEMES } from '../data/puzzles';
import { COMPREHENSIVE_PUZZLES } from '../data/puzzleDatabase';
import { convertSanToSpanish } from '../utils/notation';

interface PuzzleLibraryProps {
  onSelectPuzzle: (puzzle: Puzzle) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  solvedHistory: Record<string, { solved: boolean; lastAttempt: string }>;
  onOpenPDFModal: (selectedPuzzles: Puzzle[]) => void;
  notationFormat: 'spanish' | 'international' | 'figurine';
}

export const PuzzleLibrary: React.FC<PuzzleLibraryProps> = ({
  onSelectPuzzle,
  favorites,
  onToggleFavorite,
  solvedHistory,
  onOpenPDFModal,
  notationFormat
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMate, setSelectedMate] = useState<number | 'all'>('all');
  const [selectedTheme, setSelectedTheme] = useState<TacticalTheme | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [selectedForExport, setSelectedForExport] = useState<string[]>([]);

  // Filtered puzzles
  const filteredPuzzles = COMPREHENSIVE_PUZZLES.filter(p => {
    if (selectedMate !== 'all' && p.mateIn !== selectedMate) return false;
    if (selectedTheme !== 'all' && p.theme !== selectedTheme) return false;
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
    if (onlyFavorites && !favorites.includes(p.id)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTheme = p.theme.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTheme) return false;
    }
    return true;
  });

  const handleSelectAllForExport = () => {
    if (selectedForExport.length === filteredPuzzles.length) {
      setSelectedForExport([]);
    } else {
      setSelectedForExport(filteredPuzzles.map(p => p.id));
    }
  };

  const toggleSelectForExport = (id: string) => {
    if (selectedForExport.includes(id)) {
      setSelectedForExport(selectedForExport.filter(item => item !== id));
    } else {
      setSelectedForExport([...selectedForExport, id]);
    }
  };

  const handleExportSelected = () => {
    const puzzlesToExport = filteredPuzzles.filter(p =>
      selectedForExport.length > 0 ? selectedForExport.includes(p.id) : true
    );
    onOpenPDFModal(puzzlesToExport);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto gap-6">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Biblioteca de Ejercicios Tácticos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Explora {COMPREHENSIVE_PUZZLES.length} problemas de jaque mate en 2, 3 y 4 jugadas ordenados por tema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="export-pdf-header-btn"
            onClick={handleExportSelected}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-black rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-400/30 transition"
          >
            <FileDown className="w-4 h-4" />
            Exportar Cuaderno PDF ({selectedForExport.length > 0 ? selectedForExport.length : filteredPuzzles.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar - Bento Card */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
        {/* Quick Mate Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Filtro de Mate:
          </span>
          {(['all', 2, 3, 4] as const).map(option => (
            <button
              key={option}
              id={`library-mate-filter-${option}`}
              onClick={() => setSelectedMate(option === 'all' ? 'all' : Number(option))}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                selectedMate === option
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {option === 'all' ? 'Todos los Mates' : `Mate en ${option}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="library-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por motivo, pieza o título..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Theme Filter */}
          <select
            id="library-theme-select"
            value={selectedTheme}
            onChange={e => setSelectedTheme(e.target.value as TacticalTheme | 'all')}
            className="px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Todos los Temas Tácticos</option>
            {Object.values(TACTICAL_THEMES).map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            id="library-difficulty-select"
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Toda Dificultad</option>
            <option value="Fácil">Fácil</option>
            <option value="Medio">Medio</option>
            <option value="Desafiante">Desafiante</option>
          </select>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              id="library-only-favorites-btn"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                onlyFavorites
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
              Favoritos ({favorites.length})
            </button>

            <button
              id="library-select-all-btn"
              onClick={handleSelectAllForExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition"
            >
              {selectedForExport.length === filteredPuzzles.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              {selectedForExport.length === filteredPuzzles.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
            </button>
          </div>

          <span className="text-xs text-slate-400 font-bold">
            Mostrando {filteredPuzzles.length} de {COMPREHENSIVE_PUZZLES.length} ejercicios
          </span>
        </div>
      </div>

      {/* Puzzles Bento Grid */}
      {filteredPuzzles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-500">
            No se encontraron ejercicios con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPuzzles.map((puzzle, index) => {
            const isFav = favorites.includes(puzzle.id);
            const isSelectedExport = selectedForExport.includes(puzzle.id);
            const isSolved = solvedHistory[puzzle.id]?.solved;
            const themeInfo = TACTICAL_THEMES[puzzle.theme];

            return (
              <div
                key={puzzle.id}
                id={`puzzle-card-${puzzle.id}`}
                onClick={() => onSelectPuzzle(puzzle)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg hover:border-blue-400/60 dark:hover:border-blue-500/60 transition-all duration-200 flex flex-col justify-between gap-4 group cursor-pointer"
              >
                <div>
                  {/* Top badges & favorite */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectForExport(puzzle.id);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition"
                        title="Seleccionar para PDF"
                      >
                        {isSelectedExport ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        Mate en {puzzle.mateIn}
                      </span>

                      {isSolved && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resuelto
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(puzzle.id);
                      }}
                      className={`p-2 rounded-xl transition ${
                        isFav
                          ? 'text-rose-500 bg-rose-500/10 border border-rose-500/20'
                          : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-3 group-hover:text-blue-600 transition tracking-tight">
                    {puzzle.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {puzzle.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {themeInfo?.name || puzzle.theme}
                    </span>
                    <span>•</span>
                    <span>{puzzle.difficulty}</span>
                    <span>•</span>
                    <span>{puzzle.turn === 'w' ? '⚪ Blancas' : '⚫ Negras'}</span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {convertSanToSpanish(puzzle.solutionSan[0])} ...
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPuzzle(puzzle);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-blue-600 group-hover:bg-blue-500 active:scale-95 rounded-xl shadow-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Resolver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
