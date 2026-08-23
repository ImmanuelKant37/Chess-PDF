import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Layers,
  Eye,
  Play,
  RotateCw,
  Gauge,
  Activity,
  CheckCircle2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  BrainCircuit,
  Loader2,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ShieldAlert,
  Flame,
  Sliders,
  Settings
} from 'lucide-react';
import {
  getStockfishEngine,
  OPTIMIZATION_PRESETS
} from '../utils/stockfishEngine';
import {
  StockfishLine,
  StockfishState,
  MoveAIExplanation,
  StockfishOptimizationSettings,
  StockfishOptimizationMode
} from '../types';
import { convertSanToSpanish, convertSanToFigurine } from '../utils/notation';

interface StockfishAnalysisPanelProps {
  fen: string;
  turn: 'w' | 'b';
  notationFormat?: 'spanish' | 'international' | 'figurine';
  onPlayMove?: (from: string, to: string, promotion?: string) => void;
  onPreviewLine?: (line: StockfishLine | null) => void;
  selectedPreviewLine?: StockfishLine | null;
  showArrow: boolean;
  setShowArrow: (show: boolean) => void;
  history?: string[];
  onOpenSettings?: () => void;
}

export const StockfishAnalysisPanel: React.FC<StockfishAnalysisPanelProps> = ({
  fen,
  turn,
  notationFormat = 'spanish',
  onPlayMove,
  onPreviewLine,
  selectedPreviewLine,
  showArrow,
  setShowArrow,
  history = [],
  onOpenSettings,
}) => {
  const [engineState, setEngineState] = useState<StockfishState>(() => getStockfishEngine()['state']);
  const [engineSettings, setEngineSettings] = useState<StockfishOptimizationSettings>(() =>
    getStockfishEngine().getSettings()
  );
  const [isPermanentActive, setIsPermanentActive] = useState<boolean>(true);
  const [multiPV, setMultiPV] = useState<number>(() => getStockfishEngine().getSettings().multiPV || 1);

  // State for AI move explanations: key is line multipv index
  const [explanations, setExplanations] = useState<Record<number, MoveAIExplanation>>({});
  const [loadingLines, setLoadingLines] = useState<Record<number, boolean>>({});
  const [expandedLines, setExpandedLines] = useState<Record<number, boolean>>({});
  const [speakingLine, setSpeakingLine] = useState<number | null>(null);

  // Clear explanations when FEN changes significantly
  useEffect(() => {
    setExplanations({});
    setExpandedLines({});
    if (speakingLine !== null) {
      window.speechSynthesis?.cancel();
      setSpeakingLine(null);
    }
  }, [fen]);

  // Subscribe to Stockfish engine updates & settings
  useEffect(() => {
    const engine = getStockfishEngine();
    const unsubscribe = engine.subscribe((state) => {
      setEngineState(state);
    });
    const unsubscribeSettings = engine.subscribeSettings((settings) => {
      setEngineSettings(settings);
      setMultiPV(settings.multiPV);
    });

    return () => {
      unsubscribe();
      unsubscribeSettings();
    };
  }, []);

  // Control engine analysis based on FEN and active toggle
  useEffect(() => {
    const engine = getStockfishEngine();
    if (isPermanentActive && fen) {
      engine.startAnalysis(fen, { multiPV });
    } else {
      engine.stopAnalysis();
    }
  }, [fen, isPermanentActive, multiPV]);

  const handleToggleActive = () => {
    const nextState = !isPermanentActive;
    setIsPermanentActive(nextState);
    const engine = getStockfishEngine();
    if (nextState) {
      engine.startAnalysis(fen, { multiPV });
    } else {
      engine.stopAnalysis();
    }
  };

  const handleMultiPVChange = (newCount: number) => {
    setMultiPV(newCount);
    const engine = getStockfishEngine();
    engine.setMultiPV(newCount);
  };

  const handleQuickModeChange = (mode: StockfishOptimizationMode) => {
    const engine = getStockfishEngine();
    if (mode !== 'custom') {
      const preset = OPTIMIZATION_PRESETS[mode];
      engine.saveSettings(preset);
    }
  };

  // Fetch AI explanation for a specific Stockfish line
  const handleExplainWithAI = async (line: StockfishLine) => {
    const lineId = line.multipv;

    // Toggle if already loaded
    if (explanations[lineId]) {
      setExpandedLines((prev) => ({ ...prev, [lineId]: !prev[lineId] }));
      return;
    }

    setLoadingLines((prev) => ({ ...prev, [lineId]: true }));
    setExpandedLines((prev) => ({ ...prev, [lineId]: true }));

    try {
      const res = await fetch('/api/chess/explain-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen,
          moveSan: line.bestMove.san,
          moveUci: line.bestMove.uci,
          scoreFormatted: line.scoreFormatted,
          pvSan: line.pvSan,
          turn,
          rank: line.multipv,
          history,
        }),
      });

      if (!res.ok) throw new Error('Error al conectar con la IA');
      const data: MoveAIExplanation = await res.json();
      setExplanations((prev) => ({ ...prev, [lineId]: data }));
    } catch (err) {
      console.error('Error fetching AI explanation:', err);
      setExplanations((prev) => ({
        ...prev,
        [lineId]: {
          moveSan: line.bestMove.san,
          evaluation: line.scoreFormatted,
          summary: `La jugada ${line.bestMove.san} es calculada por Stockfish como la opción más precisa.`,
          strategicPurpose: `Esta jugada mejora la coordinación, asegura casillas clave y mantiene la presión en el tablero.`,
          tacticalThemes: ['Cálculo de variantes', 'Actividad de piezas'],
          opponentResponses: `El oponente debe responder con exactitud para mantener el equilibrio.`,
          keyAdvice: `Observa siempre las debilidades generadas en la estructura rival tras cada jugada.`,
          aiPowered: false,
        },
      }));
    } finally {
      setLoadingLines((prev) => ({ ...prev, [lineId]: false }));
    }
  };

  // Text-to-speech for AI explanation
  const handleSpeak = (text: string, lineId: number) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingLine === lineId) {
      window.speechSynthesis.cancel();
      setSpeakingLine(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingLine(null);
    utterance.onerror = () => setSpeakingLine(null);

    setSpeakingLine(lineId);
    window.speechSynthesis.speak(utterance);
  };

  // Convert SAN move according to notation format preference
  const formatSan = (san: string) => {
    if (notationFormat === 'spanish') {
      return convertSanToSpanish(san);
    } else if (notationFormat === 'figurine') {
      return convertSanToFigurine(san, turn === 'w');
    }
    return san;
  };

  // Format big numbers (e.g. 1,450,000 -> 1.45M)
  const formatNodes = (nodes: number) => {
    if (nodes >= 1000000) return `${(nodes / 1000000).toFixed(1)}M`;
    if (nodes >= 1000) return `${(nodes / 1000).toFixed(0)}k`;
    return `${nodes}`;
  };

  const formatNps = (nps: number) => {
    if (nps >= 1000000) return `${(nps / 1000000).toFixed(2)}M nps`;
    if (nps >= 1000) return `${(nps / 1000).toFixed(0)}k nps`;
    return `${nps} nps`;
  };

  // Calculate win probability / eval bar height (percentage of white advantage)
  const calculateWhitePercentage = () => {
    if (engineState.isMate) {
      return (engineState.mateTurns ?? 0) > 0 && engineState.evaluationScore > 0 ? 99 : 1;
    }
    // Sigmoid curve from centipawns
    const cp = engineState.evaluationScore * 100;
    const winProb = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
    return Math.max(2, Math.min(98, Math.round(winProb)));
  };

  const whitePercent = calculateWhitePercentage();

  return (
    <div
      id="stockfish-analysis-panel"
      className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-lg p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Header: Title, Live Engine Status & Master Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border transition-colors ${
            isPermanentActive
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
          }`}>
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                Stockfish Engine
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  UCI Live
                </span>
              </h3>
              {isPermanentActive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Análisis permanente de la mejor jugada en tiempo real
            </p>
          </div>
        </div>

        {/* Master Toggle and Arrow switch */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Optimization Mode Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => handleQuickModeChange('ultra_fast')}
              className={`px-2 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition ${
                engineSettings.mode === 'ultra_fast'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Modo Turbo: Respuesta instantánea para pistas (<250ms)"
            >
              <Zap className="w-3 h-3" />
              <span>Turbo</span>
            </button>

            <button
              onClick={() => handleQuickModeChange('balanced')}
              className={`px-2 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition ${
                engineSettings.mode === 'balanced'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Modo Equilibrado: Óptimo balance entre velocidad y profundidad"
            >
              <Gauge className="w-3 h-3" />
              <span>Equilibrado</span>
            </button>

            <button
              onClick={() => handleQuickModeChange('master')}
              className={`px-2 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition ${
                engineSettings.mode === 'master'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Modo Gran Maestro: Máxima profundidad y variantes"
            >
              <Cpu className="w-3 h-3" />
              <span>Maestro</span>
            </button>
          </div>

          {/* Open Settings Modal Button */}
          {onOpenSettings && (
            <button
              id="btn-stockfish-panel-open-settings"
              onClick={onOpenSettings}
              title="Ajustar parámetros de Stockfish"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Arrow Toggle */}
          <button
            id="btn-toggle-stockfish-arrow"
            onClick={() => setShowArrow(!showArrow)}
            title={showArrow ? 'Ocultar flecha en tablero' : 'Mostrar flecha en tablero'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
              showArrow
                ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flecha</span>
          </button>

          {/* Engine Power Toggle */}
          <button
            id="btn-toggle-permanent-stockfish"
            onClick={handleToggleActive}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-all ${
              isPermanentActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 ring-2 ring-emerald-400/20'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPermanentActive ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Analizando</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Iniciar Motor</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Engine Metrics & Evaluation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
        {/* Metric 1: Numerical Evaluation */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
            engineState.evaluationScore > 0.5
              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : engineState.evaluationScore < -0.5
              ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {engineState.isMate ? '#' : <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              Evaluación
            </span>
            <div className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 leading-none mt-0.5 truncate">
              {isPermanentActive ? engineState.evaluationFormatted : 'Pausa'}
            </div>
          </div>
        </div>

        {/* Metric 2: Depth */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              Profundidad
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-none mt-0.5 truncate">
              {engineState.depth > 0 ? `${engineState.depth}/${engineState.seldepth || engineState.depth}` : '0'}
            </div>
          </div>
        </div>

        {/* Metric 3: Speed / NPS */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              Velocidad
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-none mt-0.5 truncate">
              {engineState.nps > 0 ? formatNps(engineState.nps) : '0 nps'}
            </div>
          </div>
        </div>

        {/* Metric 4: Nodes calculated */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              Nodos
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-none mt-0.5 truncate">
              {formatNodes(engineState.nodes)}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Advantage Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 px-0.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white inline-block border border-slate-400"></span>
            Blancas: {whitePercent}%
          </span>
          <span className="text-xs font-black text-slate-800 dark:text-slate-100">
            {engineState.evaluationFormatted}
          </span>
          <span className="flex items-center gap-1">
            Negras: {100 - whitePercent}%
            <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-900 inline-block border border-slate-600"></span>
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-300 dark:border-slate-700 shadow-inner">
          <div
            className="bg-white transition-all duration-300 ease-out"
            style={{ width: `${whitePercent}%` }}
            title={`Ventaja Blancas: ${whitePercent}%`}
          />
          <div
            className="bg-slate-800 transition-all duration-300 ease-out"
            style={{ width: `${100 - whitePercent}%` }}
            title={`Ventaja Negras: ${100 - whitePercent}%`}
          />
        </div>
      </div>

      {/* MultiPV Selector & Lines List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Mejores Jugadas Candidatas (MultiPV)
          </span>

          {/* MultiPV selector pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                id={`btn-multipv-${count}`}
                onClick={() => handleMultiPVChange(count)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                  multiPV === count
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {count} {count === 1 ? 'Línea' : 'Líneas'}
              </button>
            ))}
          </div>
        </div>

        {/* Lines Rendering */}
        <div className="space-y-2.5">
          {engineState.lines.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 dark:text-slate-500">
              {isPermanentActive
                ? 'Stockfish calculando variantes principales...'
                : 'Motor pausado. Haz clic en "Iniciar Motor" para activar el análisis.'}
            </div>
          ) : (
            engineState.lines.map((line, index) => {
              const isFirst = index === 0;
              const isSelected = selectedPreviewLine?.multipv === line.multipv;
              const isExplaining = loadingLines[line.multipv];
              const explanation = explanations[line.multipv];
              const isExpanded = expandedLines[line.multipv];
              const isSpeaking = speakingLine === line.multipv;

              return (
                <div
                  key={line.multipv}
                  id={`stockfish-line-${line.multipv}`}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                    isFirst
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 shadow-xs'
                      : 'bg-slate-50/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300'
                  } ${isSelected ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Rank badge */}
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                        isFirst
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        #{line.multipv} {isFirst ? 'Mejor Jugada' : ''}
                      </span>

                      {/* Best Move in SAN */}
                      <span className="text-sm font-black text-slate-900 dark:text-slate-50 font-mono">
                        {formatSan(line.bestMove.san)}
                      </span>

                      {/* Score Badge */}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        line.scoreValue > 50
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                          : line.scoreValue < -50
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {line.scoreFormatted}
                      </span>
                    </div>

                    {/* Action buttons: Explain with AI, Play & Preview */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* EXPLAIN WITH AI BUTTON */}
                      <button
                        id={`btn-explain-stockfish-move-${line.multipv}`}
                        onClick={() => handleExplainWithAI(line)}
                        disabled={isExplaining}
                        title="Explicar con Inteligencia Artificial por qué el motor elige esta jugada"
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                          isExpanded && explanation
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                        }`}
                      >
                        {isExplaining ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                            <span>Analizando...</span>
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="w-3.5 h-3.5" />
                            <span>Explicar con IA</span>
                            {explanation && (
                              isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </>
                        )}
                      </button>

                      {onPreviewLine && (
                        <button
                          id={`btn-preview-stockfish-line-${line.multipv}`}
                          onClick={() => onPreviewLine(isSelected ? null : line)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isSelected ? 'Ocultar' : 'Ver'}</span>
                        </button>
                      )}

                      {onPlayMove && (
                        <button
                          id={`btn-play-stockfish-move-${line.multipv}`}
                          onClick={() =>
                            onPlayMove(
                              line.bestMove.from,
                              line.bestMove.to,
                              line.bestMove.promotion
                            )
                          }
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Jugar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Principal Variation Sequence */}
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto whitespace-nowrap scrollbar-none mb-1">
                    {line.pvSan.length > 0 ? (
                      line.pvSan.map((m, idx) => (
                        <span key={idx} className="mr-1.5 inline-block">
                          <span className="text-slate-400 mr-0.5">
                            {idx === 0 ? '' : `${idx + 1}.`}
                          </span>
                          <span className={idx === 0 ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}>
                            {formatSan(m)}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span>Calculando secuencia...</span>
                    )}
                  </div>

                  {/* AI DIDACTIC EXPLANATION ACCORDION CARD */}
                  {isExpanded && explanation && (
                    <div
                      id={`ai-explanation-box-${line.multipv}`}
                      className="mt-2.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-50/60 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      {/* Header with Title, AI tag, Audio speaker and Collapse */}
                      <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/50 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="p-1 rounded-lg bg-indigo-600 text-white">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                            Explicación del Gran Maestro (IA)
                            {explanation.aiPowered && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                                Gemini 3.7 GM
                              </span>
                            )}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleSpeak(
                                `${explanation.summary}. ${explanation.strategicPurpose}. ${explanation.keyAdvice || ''}`,
                                line.multipv
                              )
                            }
                            className={`p-1.5 rounded-lg border transition ${
                              isSpeaking
                                ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                                : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50'
                            }`}
                            title={isSpeaking ? 'Detener voz' : 'Escuchar explicación en voz alta'}
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() =>
                              setExpandedLines((prev) => ({ ...prev, [line.multipv]: false }))
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Ocultar explicación"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Summary Headline */}
                      <div className="p-2.5 rounded-lg bg-indigo-100/60 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-bold text-indigo-950 dark:text-indigo-100">
                        {explanation.summary}
                      </div>

                      {/* Tactical and Strategic Purpose */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Propósito Estratégico & Lógica del Motor:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {explanation.strategicPurpose}
                        </p>
                      </div>

                      {/* Tactical Themes Badges */}
                      {explanation.tacticalThemes && explanation.tacticalThemes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {explanation.tacticalThemes.map((theme, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100/80 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 flex items-center gap-1"
                            >
                              <Flame className="w-2.5 h-2.5 text-blue-500" />
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Opponent Responses & Consequences */}
                      {explanation.opponentResponses && (
                        <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100">Respuesta Rival: </span>
                            {explanation.opponentResponses}
                          </div>
                        </div>
                      )}

                      {/* Master Tip / Golden Advice */}
                      {explanation.keyAdvice && (
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Regla de Oro: </span>
                            {explanation.keyAdvice}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

