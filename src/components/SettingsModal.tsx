import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Sliders,
  Cpu,
  Gauge,
  Layers,
  Sparkles,
  RotateCcw,
  Check,
  Flame,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Palette,
  Clock,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import {
  StockfishOptimizationSettings,
  StockfishOptimizationMode
} from '../types';
import {
  getStockfishEngine,
  OPTIMIZATION_PRESETS,
  DEFAULT_OPTIMIZATION_SETTINGS
} from '../utils/stockfishEngine';
import { chessAudio } from '../utils/chessAudio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notationFormat: 'spanish' | 'international' | 'figurine';
  setNotationFormat: (format: 'spanish' | 'international' | 'figurine') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  boardTheme?: 'wood' | 'green' | 'blue' | 'classic';
  setBoardTheme?: (theme: 'wood' | 'green' | 'blue' | 'classic') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notationFormat,
  setNotationFormat,
  darkMode,
  setDarkMode,
  boardTheme = 'wood',
  setBoardTheme
}) => {
  const [activeTab, setActiveTab] = useState<'engine' | 'display' | 'audio'>('engine');
  const [settings, setSettings] = useState<StockfishOptimizationSettings>(() =>
    getStockfishEngine().getSettings()
  );
  const [isMuted, setIsMuted] = useState<boolean>(() => chessAudio.getMuted());
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Benchmark state
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    nps: number;
    nodes: number;
    depth: number;
    latencyMs: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getStockfishEngine().getSettings());
      setIsMuted(chessAudio.getMuted());
      setBenchmarkResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModeSelect = (mode: StockfishOptimizationMode) => {
    chessAudio.playSelect();
    if (mode === 'custom') {
      setSettings((prev) => ({ ...prev, mode: 'custom' }));
    } else {
      const preset = OPTIMIZATION_PRESETS[mode];
      const updated = { ...preset };
      setSettings(updated);
      getStockfishEngine().saveSettings(updated);
      showSavedFeedback();
    }
  };

  const handleCustomParamChange = <K extends keyof StockfishOptimizationSettings>(
    key: K,
    val: StockfishOptimizationSettings[K]
  ) => {
    setSettings((prev) => {
      const updated: StockfishOptimizationSettings = {
        ...prev,
        mode: 'custom',
        [key]: val,
      };
      getStockfishEngine().saveSettings(updated);
      return updated;
    });
    showSavedFeedback();
  };

  const showSavedFeedback = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleResetDefaults = () => {
    chessAudio.playSelect();
    const defaults = { ...DEFAULT_OPTIMIZATION_SETTINGS };
    setSettings(defaults);
    getStockfishEngine().saveSettings(defaults);
    showSavedFeedback();
  };

  const handleToggleMute = () => {
    const nextMuted = chessAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      chessAudio.playSelect();
    }
  };

  const runSpeedBenchmark = async () => {
    setIsBenchmarking(true);
    chessAudio.playSelect();
    try {
      const result = await getStockfishEngine().runBenchmarkTest();
      setBenchmarkResult(result);
    } catch (err) {
      console.warn('Benchmark error:', err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="settings-modal-card"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Ajustes & Rendimiento
                {savedToast && (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3 h-3" /> Guardado
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optimiza la velocidad de Stockfish, carga de pistas y preferencias del tablero
              </p>
            </div>
          </div>

          <button
            id="settings-modal-close-btn"
            onClick={() => {
              chessAudio.playSelect();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Cerrar ajustes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20">
          <button
            id="tab-settings-engine"
            onClick={() => {
              chessAudio.playSelect();
              setActiveTab('engine');
            }}
            className={`pb-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'engine'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Motor Stockfish & Pistas</span>
          </button>

          <button
            id="tab-settings-display"
            onClick={() => {
              chessAudio.playSelect();
              setActiveTab('display');
            }}
            className={`pb-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'display'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4 text-blue-500" />
            <span>Tablero & Notación</span>
          </button>

          <button
            id="tab-settings-audio"
            onClick={() => {
              chessAudio.playSelect();
              setActiveTab('audio');
            }}
            className={`pb-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'audio'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <span>Sonido</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: STOCKFISH ENGINE & HINT OPTIMIZATION */}
          {activeTab === 'engine' && (
            <div className="space-y-6">
              {/* Presets Selection Cards */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                  Modo de Optimización Predeterminado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Ultra Fast */}
                  <button
                    id="btn-opt-ultra-fast"
                    onClick={() => handleModeSelect('ultra_fast')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                      settings.mode === 'ultra_fast'
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 dark:text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Ultra Rápido</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        ⚡ Turbo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Pistas instantáneas en &lt; 250ms. Búsqueda ligera de 10 plies y 1 variante.
                    </p>
                  </button>

                  {/* Option 2: Balanced */}
                  <button
                    id="btn-opt-balanced"
                    onClick={() => handleModeSelect('balanced')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                      settings.mode === 'balanced'
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500/80 ring-2 ring-indigo-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 dark:text-white">
                        <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Equilibrado</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                        Óptimo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Profundidad 15 plies con 2 variantes. Excelente balance táctico y velocidad.
                    </p>
                  </button>

                  {/* Option 3: Master Precision */}
                  <button
                    id="btn-opt-master"
                    onClick={() => handleModeSelect('master')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                      settings.mode === 'master'
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/80 ring-2 ring-emerald-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 dark:text-white">
                        <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Gran Maestro</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        Exacto
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Profundidad 22+ plies, 3 variantes y cálculo sin límite para análisis profundo.
                    </p>
                  </button>
                </div>
              </div>

              {/* Parameter Sliders / Fine Tuning Section */}
              <div className="bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Parámetros Avanzados del Motor
                  </h4>
                  {settings.mode === 'custom' && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Personalizado
                    </span>
                  )}
                </div>

                {/* Slider 1: Max Depth */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      Límite de Profundidad (Depth):
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-black">
                      {settings.maxDepth} plies {settings.maxDepth <= 10 ? '(Rápido)' : settings.maxDepth <= 16 ? '(Equilibrado)' : '(Profundo)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="24"
                    step="1"
                    value={settings.maxDepth}
                    onChange={(e) => handleCustomParamChange('maxDepth', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>6 plies (Instantáneo)</span>
                    <span>15 plies</span>
                    <span>24 plies (Máx Precisión)</span>
                  </div>
                </div>

                {/* Slider 2: Max Calculation Time (MoveTime) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Tiempo Límite de Búsqueda (MoveTime):
                    </span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-black">
                      {settings.moveTimeMs === 0 ? 'Sin límite (Infinito)' : `${settings.moveTimeMs} ms`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="100"
                    value={settings.moveTimeMs === 0 ? 3000 : settings.moveTimeMs}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      handleCustomParamChange('moveTimeMs', val === 3000 ? 0 : val);
                    }}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>100 ms (Relámpago)</span>
                    <span>1000 ms</span>
                    <span>Infinito</span>
                  </div>
                </div>

                {/* MultiPV Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Variantes Múltiples (MultiPV)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Menos variantes = cálculo mucho más veloz
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        id={`btn-settings-multipv-${count}`}
                        onClick={() => handleCustomParamChange('multiPV', count)}
                        className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                          settings.multiPV === count
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {count} {count === 1 ? 'Línea' : 'Líneas'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hash Size & Threads Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  {/* Hash Memory */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                      Memoria Hash (UCI)
                    </label>
                    <select
                      value={settings.hashMb}
                      onChange={(e) => handleCustomParamChange('hashMb', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="16">16 MB (Ligero / Móvil)</option>
                      <option value="32">32 MB (Estándar)</option>
                      <option value="64">64 MB (Recomendado)</option>
                      <option value="128">128 MB (Alto Rendimiento)</option>
                    </select>
                  </div>

                  {/* Worker Threads */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                      Hilos de CPU (Threads)
                    </label>
                    <select
                      value={settings.threads}
                      onChange={(e) => handleCustomParamChange('threads', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="1">1 Hilo (Ahorro de batería)</option>
                      <option value="2">2 Hilos (Recomendado)</option>
                      <option value="4">4 Hilos (Máxima potencia)</option>
                    </select>
                  </div>
                </div>

                {/* Priority Fast Hint Calculation Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Prioridad de Carga Rápida en Pistas
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Calcula pistas con prioridad de baja latencia (&lt; 300ms)
                    </span>
                  </div>
                  <button
                    id="btn-toggle-fast-hint-analysis"
                    onClick={() =>
                      handleCustomParamChange('fastHintAnalysis', !settings.fastHintAnalysis)
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                      settings.fastHintAnalysis
                        ? 'bg-amber-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        settings.fastHintAnalysis ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Speed Benchmark Tool */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <h4 className="text-xs sm:text-sm font-black">
                      Prueba de Velocidad de Stockfish
                    </h4>
                  </div>
                  <button
                    id="btn-run-speed-benchmark"
                    onClick={runSpeedBenchmark}
                    disabled={isBenchmarking}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                  >
                    {isBenchmarking ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        <span>Calculando...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Medir Rendimiento</span>
                      </>
                    )}
                  </button>
                </div>

                {benchmarkResult ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-900/60 animate-in fade-in">
                    <div className="bg-white/10 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-300 uppercase font-bold block">Velocidad</span>
                      <span className="text-sm font-black text-amber-300 font-mono">
                        {(benchmarkResult.nps / 1000).toFixed(0)}k NPS
                      </span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-300 uppercase font-bold block">Latencia</span>
                      <span className="text-sm font-black text-emerald-300 font-mono">
                        {benchmarkResult.latencyMs} ms
                      </span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-300 uppercase font-bold block">Profundidad</span>
                      <span className="text-sm font-black text-sky-300 font-mono">
                        {benchmarkResult.depth} plies
                      </span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-300 uppercase font-bold block">Diagnóstico</span>
                      <span className="text-xs font-black text-emerald-400">
                        {benchmarkResult.latencyMs < 400 ? '⚡ Ultra Veloz' : 'Óptimo'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-300">
                    Ejecuta un micro-análisis en tiempo real para verificar los nodos por segundo y la latencia de respuesta de tu dispositivo.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DISPLAY & NOTATION */}
          {activeTab === 'display' && (
            <div className="space-y-5">
              {/* Notation Format */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  Formato de Notación de Piezas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      chessAudio.playSelect();
                      setNotationFormat('spanish');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                      notationFormat === 'spanish'
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Español</span>
                    <span className="text-[11px] text-slate-500 font-mono">D, T, A, C, R</span>
                  </button>

                  <button
                    onClick={() => {
                      chessAudio.playSelect();
                      setNotationFormat('international');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                      notationFormat === 'international'
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Internacional (FIDE)</span>
                    <span className="text-[11px] text-slate-500 font-mono">Q, R, B, N, K</span>
                  </button>

                  <button
                    onClick={() => {
                      chessAudio.playSelect();
                      setNotationFormat('figurine');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                      notationFormat === 'figurine'
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Figuras Gráficas</span>
                    <span className="text-[11px] text-slate-500 font-mono">♛, ♜, ♝, ♞</span>
                  </button>
                </div>
              </div>

              {/* Theme Mode */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  Tema Visual
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      chessAudio.playSelect();
                      setDarkMode(false);
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition ${
                      !darkMode
                        ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-900 dark:text-white">Modo Claro</div>
                      <div className="text-[11px] text-slate-400">Fondos iluminados y alto contraste</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      chessAudio.playSelect();
                      setDarkMode(true);
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition ${
                      darkMode
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-900 dark:text-white">Modo Oscuro</div>
                      <div className="text-[11px] text-slate-400">Descanso visual para sesiones largas</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isMuted ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      Efectos de Sonido
                    </h4>
                    <p className="text-xs text-slate-400">
                      Sonidos de movimiento de piezas, capturas, jaques y victorias
                    </p>
                  </div>
                </div>

                <button
                  id="btn-toggle-sound-settings"
                  onClick={handleToggleMute}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                    !isMuted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isMuted ? 'Silenciado' : 'Activado'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Recomendados</span>
          </button>

          <button
            id="btn-save-close-settings"
            onClick={() => {
              chessAudio.playSelect();
              onClose();
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition"
          >
            Guardar y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
