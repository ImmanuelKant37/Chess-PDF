import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import {
  BrainCircuit,
  Sparkles,
  RotateCcw,
  Undo2,
  Redo2,
  ArrowRightLeft,
  Swords,
  Volume2,
  VolumeX,
  Play,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BookOpen,
  MessageSquare,
  Send,
  Loader2,
  ChevronRight,
  ShieldAlert,
  Lightbulb,
  Copy,
  Check,
  Compass,
  Zap,
  HelpCircle,
  SlidersHorizontal,
  X,
  PanelRight
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { StockfishAnalysisPanel } from './StockfishAnalysisPanel';
import { getStockfishEngine } from '../utils/stockfishEngine';
import { PositionAnalysis, MoveSuggestion, PresetPosition, StockfishLine, StockfishState } from '../types';
import { PRESET_POSITIONS } from '../data/presetPositions';
import { convertSanToSpanish, convertSanToFigurine } from '../utils/notation';
import { playChessSound } from '../utils/chessAudio';

interface SoloSelfPlayTrainingProps {
  boardTheme: 'wood' | 'green' | 'blue' | 'classic';
  notationFormat: 'spanish' | 'international' | 'figurine';
}

export const SoloSelfPlayTraining: React.FC<SoloSelfPlayTrainingProps> = ({
  boardTheme,
  notationFormat,
}) => {
  // Game instance state
  const [chess, setChess] = useState<Chess>(new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [historyFens, setHistoryFens] = useState<string[]>([chess.fen()]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [orientation, setOrientation] = useState<'w' | 'b'>('w');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  
  // AI analysis and suggestions state
  const [analysis, setAnalysis] = useState<PositionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState<{ from: string; to: string; color: 'white' | 'black' } | null>(null);
  const [selectedSideTab, setSelectedSideTab] = useState<'both' | 'white' | 'black'>('both');
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(true);

  // Stockfish Permanent Analysis state
  const [selectedStockfishLine, setSelectedStockfishLine] = useState<StockfishLine | null>(null);
  const [showStockfishArrow, setShowStockfishArrow] = useState<boolean>(true);
  const [trainingModeView, setTrainingModeView] = useState<'all' | 'stockfish' | 'gm_coach'>('all');
  const [stockfishEngineState, setStockfishEngineState] = useState<StockfishState | null>(null);

  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [mobileDrawerTab, setMobileDrawerTab] = useState<'stockfish' | 'gm_coach' | 'chat' | 'presets'>('stockfish');

  // Audio / Speech narration
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Interactive AI Coach Chat
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [isAskingCoach, setIsAskingCoach] = useState<boolean>(false);

  // Position presets & custom FEN modal
  const [selectedPresetId, setSelectedPresetId] = useState<string>('initial');
  const [customFenInput, setCustomFenInput] = useState<string>('');
  const [showFenModal, setShowFenModal] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Request counter to avoid race conditions
  const analyzeReqIdRef = useRef<number>(0);

  // Fetch analysis from server
  const fetchAnalysis = useCallback(async (currentFen: string, history: string[], turn: 'w' | 'b', move: any = null) => {
    const reqId = ++analyzeReqIdRef.current;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/chess/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: currentFen,
          history,
          currentTurn: turn,
          lastMove: move,
        }),
      });

      if (!res.ok) throw new Error('Network error during analysis');
      const data = await res.json();

      if (reqId === analyzeReqIdRef.current) {
        setAnalysis(data);
      }
    } catch (err) {
      console.warn('Failed to fetch AI analysis, using fallback:', err);
    } finally {
      if (reqId === analyzeReqIdRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, []);

  // Run analysis when position changes
  useEffect(() => {
    if (autoAnalyze) {
      fetchAnalysis(fen, moveHistory, chess.turn(), lastMove);
    }
  }, [fen, autoAnalyze, fetchAnalysis]);

  // Subscribe to Stockfish engine state for live evaluation metrics on mobile bar
  useEffect(() => {
    const engine = getStockfishEngine();
    const unsubscribe = engine.subscribe((state) => {
      setStockfishEngineState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Handle player making a move on the board
  const handleMove = (from: string, to: string, customPromotion?: string) => {
    try {
      const clone = new Chess(chess.fen());
      
      // Auto Queen promotion if pawn reaches end rank (or use custom promotion)
      let promotion: any = customPromotion;
      const piece = clone.get(from as Square);
      if (piece && piece.type === 'p' && !promotion) {
        const destRank = to[1];
        if ((piece.color === 'w' && destRank === '8') || (piece.color === 'b' && destRank === '1')) {
          promotion = 'q';
        }
      }

      const moveRes = clone.move({
        from: from as Square,
        to: to as Square,
        promotion,
      });

      if (!moveRes) return;

      // Play audio effect
      playChessSound(moveRes.san, moveRes.captured !== undefined, clone.inCheck());

      const nextFen = clone.fen();
      const nextHistory = [...moveHistory.slice(0, currentStep), moveRes.san];
      const nextFens = [...historyFens.slice(0, currentStep + 1), nextFen];

      setChess(clone);
      setFen(nextFen);
      setMoveHistory(nextHistory);
      setHistoryFens(nextFens);
      setCurrentStep(nextHistory.length);
      setLastMove({ from, to });
      setHighlightedSuggestion(null);
      setCoachAnswer(null);
    } catch (e) {
      console.error('Invalid move attempted:', e);
    }
  };

  // Play a suggested move directly
  const handleApplySuggestion = (sug: MoveSuggestion, color: 'w' | 'b') => {
    // If it's not the turn of this color, let's inform or allow playing if turn matches
    if (chess.turn() !== color) {
      // It's the other side's turn, so we simulate this move by temporarily allowing it or informing
      alert(`Actualmente es el turno de las ${chess.turn() === 'w' ? 'Blancas' : 'Negras'}. Primero realiza la jugada del bando activo o cambia la posición.`);
      return;
    }

    try {
      const clone = new Chess(chess.fen());
      let moveRes;
      if (sug.from && sug.to) {
        moveRes = clone.move({ from: sug.from as Square, to: sug.to as Square, promotion: 'q' });
      } else {
        moveRes = clone.move(sug.san);
      }

      if (moveRes) {
        playChessSound(moveRes.san, moveRes.captured !== undefined, clone.inCheck());
        const nextFen = clone.fen();
        const nextHistory = [...moveHistory.slice(0, currentStep), moveRes.san];
        const nextFens = [...historyFens.slice(0, currentStep + 1), nextFen];

        setChess(clone);
        setFen(nextFen);
        setMoveHistory(nextHistory);
        setHistoryFens(nextFens);
        setCurrentStep(nextHistory.length);
        setLastMove({ from: moveRes.from, to: moveRes.to });
        setHighlightedSuggestion(null);
      }
    } catch (err) {
      console.error('Failed to apply suggestion:', err);
    }
  };

  // Navigate history
  const handleJumpToStep = (step: number) => {
    if (step < 0 || step >= historyFens.length) return;
    const targetFen = historyFens[step];
    const targetChess = new Chess(targetFen);
    setChess(targetChess);
    setFen(targetFen);
    setCurrentStep(step);
    setHighlightedSuggestion(null);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      handleJumpToStep(currentStep - 1);
    }
  };

  const handleRedo = () => {
    if (currentStep < historyFens.length - 1) {
      handleJumpToStep(currentStep + 1);
    }
  };

  const handleResetGame = () => {
    const newChess = new Chess();
    setChess(newChess);
    setFen(newChess.fen());
    setMoveHistory([]);
    setHistoryFens([newChess.fen()]);
    setCurrentStep(0);
    setLastMove(null);
    setHighlightedSuggestion(null);
    setCoachAnswer(null);
  };

  // Load a preset position
  const handleSelectPreset = (preset: PresetPosition) => {
    setSelectedPresetId(preset.id);
    try {
      const newChess = new Chess(preset.fen);
      setChess(newChess);
      setFen(preset.fen);
      setMoveHistory([]);
      setHistoryFens([preset.fen]);
      setCurrentStep(0);
      setLastMove(null);
      setHighlightedSuggestion(null);
      setCoachAnswer(null);
      setOrientation(preset.turn);
    } catch (e) {
      console.error('Invalid preset FEN:', e);
    }
  };

  const handleLoadCustomFen = () => {
    if (!customFenInput.trim()) return;
    try {
      const newChess = new Chess(customFenInput.trim());
      setChess(newChess);
      setFen(newChess.fen());
      setMoveHistory([]);
      setHistoryFens([newChess.fen()]);
      setCurrentStep(0);
      setLastMove(null);
      setHighlightedSuggestion(null);
      setCoachAnswer(null);
      setShowFenModal(false);
      setCustomFenInput('');
    } catch {
      alert('La notación FEN ingresada no es válida. Revisa la posición.');
    }
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedNotification('FEN copiado al portapapeles');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleCopyPgn = () => {
    const pgn = chess.pgn() || moveHistory.join(' ');
    navigator.clipboard.writeText(pgn);
    setCopiedNotification('Historial PGN copiado');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // Text-to-speech for AI explanation
  const handleSpeakExplanation = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Ask coach question
  const handleAskCoach = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsAskingCoach(true);
    setCoachAnswer(null);
    try {
      const res = await fetch('/api/chess/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          fen,
          history: moveHistory,
          currentTurn: chess.turn(),
        }),
      });
      const data = await res.json();
      setCoachAnswer(data.answer || 'No se pudo obtener respuesta del entrenador.');
    } catch (err) {
      setCoachAnswer('Error al comunicarse con el Gran Maestro de IA. Intenta de nuevo.');
    } finally {
      setIsAskingCoach(false);
    }
  };

  const turn = chess.turn();
  const isCheck = chess.inCheck();
  const isCheckmate = chess.isCheckmate();
  const isDraw = chess.isDraw();

  // Evaluation bar calculation (-10 to +10 range clamped for visual bar)
  const evalScore = analysis?.evaluation ?? 0;
  const evalScoreClamped = Math.max(-10, Math.min(10, evalScore));
  const whitePercent = Math.max(10, Math.min(90, 50 + (evalScoreClamped / 10) * 40));

  // Render Stockfish Engine section
  const renderStockfishSection = () => (
    <StockfishAnalysisPanel
      fen={fen}
      turn={turn}
      notationFormat={notationFormat}
      onPlayMove={(from, to, promotion) => handleMove(from, to, promotion)}
      onPreviewLine={(line) => setSelectedStockfishLine(line)}
      selectedPreviewLine={selectedStockfishLine}
      showArrow={showStockfishArrow}
      setShowArrow={setShowStockfishArrow}
      history={moveHistory}
    />
  );

  // Render Grandmaster AI Coach and suggestions section
  const renderCoachSuggestionsSection = () => (
    <div className="space-y-4">
      {/* AI Status & Side Filter Tabs */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isAnalyzing ? 'bg-amber-500/20 text-amber-500 animate-spin' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
            {isAnalyzing ? <Loader2 className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              Sugerencias Tácticas de la IA
              {analysis?.aiPowered && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Gemini 3.7 GM
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAnalyzing ? 'Calculando planes óptimos y justificaciones...' : 'Actualizadas en tiempo real para ambos bandos'}
            </p>
          </div>
        </div>

        {/* Filter Toggle: Ambos | Blancas | Negras */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
          <button
            id="filter-both-sides-btn"
            onClick={() => setSelectedSideTab('both')}
            className={`px-3 py-1 rounded-xl transition ${
              selectedSideTab === 'both'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Ambos Bandos
          </button>
          <button
            id="filter-white-side-btn"
            onClick={() => setSelectedSideTab('white')}
            className={`px-3 py-1 rounded-xl transition ${
              selectedSideTab === 'white'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            ♔ Blancas
          </button>
          <button
            id="filter-black-side-btn"
            onClick={() => setSelectedSideTab('black')}
            className={`px-3 py-1 rounded-xl transition ${
              selectedSideTab === 'black'
                ? 'bg-slate-900 text-white font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            ♚ Negras
          </button>
        </div>
      </div>

      {/* Grandmaster General Assessment Card */}
      {analysis?.generalAssessment && (
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-50/80 to-blue-50/60 dark:from-slate-900/90 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950 dark:text-indigo-300">
                Dictamen Estratégico del Entrenador
              </h4>
            </div>

            <button
              onClick={() => handleSpeakExplanation(analysis.generalAssessment)}
              className="p-1.5 rounded-xl text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
              title="Escuchar explicación con voz"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {analysis.generalAssessment}
          </p>

          {analysis.tacticalAlerts && analysis.tacticalAlerts.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {analysis.tacticalAlerts.map((alert, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {alert}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DUAL MOVE SUGGESTIONS CONTAINER */}
      <div className="space-y-4">
        {/* WHITE SUGGESTIONS (♔ BLANCAS) */}
        {(selectedSideTab === 'both' || selectedSideTab === 'white') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-300" />
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Sugerencias de Jugada para Blancas (♔)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {analysis?.whiteSuggestions?.length || 0} ideas candidatas
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {analysis?.whiteSuggestions?.map((sug, idx) => {
                const isTurnActive = turn === 'w';
                const isHighlighted = highlightedSuggestion?.from === sug.from && highlightedSuggestion?.to === sug.to;

                return (
                  <div
                    key={idx}
                    id={`white-suggestion-card-${idx}`}
                    className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 space-y-2.5 ${
                      isHighlighted
                        ? 'border-cyan-500 ring-2 ring-cyan-400/50 bg-cyan-50/20 dark:bg-cyan-950/30'
                        : 'border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400/70 shadow-xs'
                    }`}
                  >
                    {/* Header: Move SAN + Concept badge + Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-mono border border-amber-300/40">
                          {idx + 1}. {notationFormat === 'spanish' ? convertSanToSpanish(sug.san) : sug.san}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                          {sug.title}
                        </span>
                        {sug.tacticalConcept && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            {sug.tacticalConcept}
                          </span>
                        )}
                      </div>

                      {/* Preview / Apply Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {sug.from && sug.to && (
                          <button
                            onClick={() => {
                              if (isHighlighted) {
                                setHighlightedSuggestion(null);
                              } else {
                                setHighlightedSuggestion({ from: sug.from!, to: sug.to!, color: 'white' });
                              }
                            }}
                            className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition flex items-center gap-1 ${
                              isHighlighted
                                ? 'bg-cyan-600 text-white border-cyan-600'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                            title="Ver casilla origen y destino en el tablero"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handleApplySuggestion(sug, 'w');
                            setMobileDrawerOpen(false);
                          }}
                          disabled={!isTurnActive}
                          className={`px-3 py-1 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1 ${
                            isTurnActive
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                          title={isTurnActive ? 'Ejecutar esta jugada en el tablero' : 'Solo jugable en el turno de las blancas'}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Jugar</span>
                        </button>
                      </div>
                    </div>

                    {/* Didactic explanation */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sug.explanation}
                    </p>

                    {/* Threat or strategic outcome preview */}
                    {sug.threatDescription && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900/60">
                        <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>Amenaza/Efecto: {sug.threatDescription}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BLACK SUGGESTIONS (♚ NEGRAS) */}
        {(selectedSideTab === 'both' || selectedSideTab === 'black') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-900 ring-2 ring-slate-700 dark:ring-slate-300" />
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Sugerencias de Jugada para Negras (♚)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {analysis?.blackSuggestions?.length || 0} ideas candidatas
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {analysis?.blackSuggestions?.map((sug, idx) => {
                const isTurnActive = turn === 'b';
                const isHighlighted = highlightedSuggestion?.from === sug.from && highlightedSuggestion?.to === sug.to;

                return (
                  <div
                    key={idx}
                    id={`black-suggestion-card-${idx}`}
                    className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 space-y-2.5 ${
                      isHighlighted
                        ? 'border-purple-500 ring-2 ring-purple-400/50 bg-purple-50/20 dark:bg-purple-950/30'
                        : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-400 shadow-xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-900 text-slate-100 font-mono border border-slate-700">
                          {idx + 1}. {notationFormat === 'spanish' ? convertSanToSpanish(sug.san) : sug.san}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                          {sug.title}
                        </span>
                        {sug.tacticalConcept && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                            {sug.tacticalConcept}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {sug.from && sug.to && (
                          <button
                            onClick={() => {
                              if (isHighlighted) {
                                setHighlightedSuggestion(null);
                              } else {
                                setHighlightedSuggestion({ from: sug.from!, to: sug.to!, color: 'black' });
                              }
                            }}
                            className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition flex items-center gap-1 ${
                              isHighlighted
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                            title="Ver casilla origen y destino en el tablero"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handleApplySuggestion(sug, 'b');
                            setMobileDrawerOpen(false);
                          }}
                          disabled={!isTurnActive}
                          className={`px-3 py-1 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1 ${
                            isTurnActive
                              ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                          title={isTurnActive ? 'Ejecutar esta jugada en el tablero' : 'Solo jugable en el turno de las negras'}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Jugar</span>
                        </button>
                      </div>
                    </div>

                    {/* Didactic explanation */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sug.explanation}
                    </p>

                    {/* Threat description */}
                    {sug.threatDescription && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900/60">
                        <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>Amenaza/Efecto: {sug.threatDescription}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render Coach Interactive Q&A chat section
  const renderCoachChatSection = () => (
    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue-600" />
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
          Pregúntale al Gran Maestro sobre esta Posición
        </h4>
      </div>

      {/* Quick Question Chips */}
      <div className="flex flex-wrap gap-1.5">
        {[
          '¿Cuál es el mejor plan general?',
          '¿Qué debilidad tiene mi rival?',
          '¿Hay alguna pieza colgada o desprotegida?',
          '¿Cómo debo preparar el ataque al rey?'
        ].map((chip, i) => (
          <button
            key={i}
            onClick={() => {
              setCoachQuestion(chip);
              handleAskCoach(chip);
            }}
            className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Custom Question Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAskCoach(coachQuestion);
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          id="coach-question-input"
          value={coachQuestion}
          onChange={(e) => setCoachQuestion(e.target.value)}
          placeholder="Escribe tu pregunta sobre la posición actual..."
          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        />
        <button
          type="submit"
          disabled={isAskingCoach || !coachQuestion.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
        >
          {isAskingCoach ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Preguntar</span>
        </button>
      </form>

      {/* Coach Answer Bubble */}
      {coachAnswer && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium space-y-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-black text-xs">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Respuesta del Entrenador:
            </span>
            <button
              onClick={() => handleSpeakExplanation(coachAnswer)}
              className="p-1 text-slate-400 hover:text-blue-600 transition"
              title="Escuchar respuesta"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="whitespace-pre-line">{coachAnswer}</p>
        </div>
      )}
    </div>
  );

  // Render Preset positions catalog section
  const renderPresetsSection = () => (
    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Catálogo de Posiciones y Aperturas
          </h4>
        </div>
        <button
          onClick={() => setShowFenModal(true)}
          className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center gap-1"
        >
          <Compass className="w-3 h-3" /> Cargar FEN
        </button>
      </div>

      <div className="space-y-3">
        {(['Aperturas', 'Medio Juego', 'Finales'] as const).map((category) => (
          <div key={category} className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              {category}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_POSITIONS.filter(p => p.category === category).map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      handleSelectPreset(preset);
                      setMobileDrawerOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs truncate">{preset.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full pb-20 lg:pb-2 space-y-3 sm:space-y-4">
      {/* Top Bar / Mode Header */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900/95 border border-indigo-500/30 text-white shadow-md flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <span className="p-1.5 sm:p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
            <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                Auto-Juego con Tutor IA
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 fill-current" />
                Sugerencias Duales
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-300">
              Juega libremente. La IA y Stockfish analizan en tiempo real las mejores ideas para blancas y negras con justificación didáctica.
            </p>
          </div>
        </div>

        {/* Preset Selector & FEN Button */}
        <div className="flex items-center gap-2">
          <select
            id="preset-position-select"
            value={selectedPresetId}
            onChange={(e) => {
              const preset = PRESET_POSITIONS.find(p => p.id === e.target.value);
              if (preset) handleSelectPreset(preset);
            }}
            className="px-3 py-1.5 text-xs font-bold bg-slate-800/90 border border-slate-700 text-white rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <optgroup label="Aperturas Famosas">
              {PRESET_POSITIONS.filter(p => p.category === 'Aperturas').map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </optgroup>
            <optgroup label="Medio Juego y Táctica">
              {PRESET_POSITIONS.filter(p => p.category === 'Medio Juego').map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </optgroup>
            <optgroup label="Finales Prácticos">
              {PRESET_POSITIONS.filter(p => p.category === 'Finales').map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </optgroup>
          </select>

          <button
            id="custom-fen-btn"
            onClick={() => setShowFenModal(true)}
            className="px-3 py-1.5 text-xs font-bold bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-xl border border-indigo-400/40 transition shadow-xs flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cargar FEN</span>
            <span className="sm:hidden">FEN</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Board Column (Left) + AI Coach Analysis & Suggestions Column (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: Chess Board & Game Controls (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-3">
          
          {/* Board Container Card */}
          <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col items-center">
            
            {/* Top Board Status Header */}
            <div className="w-full flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ring-2 ${
                    turn === 'w' ? 'bg-amber-100 ring-slate-400' : 'bg-slate-900 ring-amber-400'
                  }`}
                />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {turn === 'w' ? 'Turno: BLANCAS ♔' : 'Turno: NEGRAS ♚'}
                </span>
                {isCheck && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
                    ¡JAQUE!
                  </span>
                )}
                {isCheckmate && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white">
                    ¡JAQUE MATE!
                  </span>
                )}
                {isDraw && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-500 text-white">
                    TABLAS
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  id="flip-board-btn"
                  onClick={() => setOrientation(prev => prev === 'w' ? 'b' : 'w')}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Girar tablero"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
                <button
                  id="undo-move-btn"
                  onClick={handleUndo}
                  disabled={currentStep === 0}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Deshacer jugada"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  id="redo-move-btn"
                  onClick={handleRedo}
                  disabled={currentStep >= historyFens.length - 1}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Rehacer jugada"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
                <button
                  id="reset-game-btn"
                  onClick={handleResetGame}
                  className="p-1.5 sm:p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Reiniciar tablero inicial"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive ChessBoard with custom move suggestion preview & Stockfish Arrow */}
            <div className="w-full flex justify-center">
              <ChessBoard
                chess={chess}
                orientation={orientation}
                onMove={handleMove}
                lastMove={lastMove}
                highlightMove={highlightedSuggestion}
                stockfishBestMove={
                  selectedStockfishLine
                    ? { from: selectedStockfishLine.bestMove.from, to: selectedStockfishLine.bestMove.to }
                    : null
                }
                showStockfishArrow={showStockfishArrow}
                boardTheme={boardTheme}
                interactive={true}
                showCoordinates={true}
              />
            </div>

            {/* Visual Advantage / Evaluation Bar */}
            <div className="w-full mt-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  ⚪ Blancas ({analysis?.evaluation !== undefined && analysis.evaluation > 0 ? `+${analysis.evaluation}` : ''})
                </span>
                <span className="text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                  {analysis?.evaluationText || 'Evaluando...'}
                </span>
                <span className="flex items-center gap-1">
                  Negras ⚫ ({analysis?.evaluation !== undefined && analysis.evaluation < 0 ? analysis.evaluation : ''})
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-300 dark:border-slate-700">
                <div
                  className="bg-white transition-all duration-500 ease-out"
                  style={{ width: `${whitePercent}%` }}
                />
                <div
                  className="bg-slate-900 transition-all duration-500 ease-out"
                  style={{ width: `${100 - whitePercent}%` }}
                />
              </div>
            </div>

            {/* Move History Strip */}
            <div className="w-full mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider shrink-0">
                Historial ({moveHistory.length}):
              </span>
              <div className="flex-1 overflow-x-auto flex items-center gap-1.5 py-1 px-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-mono scrollbar-none">
                {moveHistory.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">Haz una jugada para comenzar...</span>
                ) : (
                  moveHistory.map((m, idx) => {
                    const isWhite = idx % 2 === 0;
                    const moveNum = Math.floor(idx / 2) + 1;
                    const isCurrent = idx === currentStep - 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleJumpToStep(idx + 1)}
                        className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isWhite ? `${moveNum}. ` : ''}
                        {notationFormat === 'spanish' ? convertSanToSpanish(m) : m}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Copy PGN / FEN tools */}
            <div className="w-full flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyFen}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> FEN
                </button>
                <button
                  onClick={handleCopyPgn}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> PGN
                </button>
              </div>

              {copiedNotification && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {copiedNotification}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Move Suggestions & Grandmaster Explanations (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-3.5">
          
          {/* Top Engine / Coach Mode Selection Tabs */}
          <div className="flex items-center justify-between p-1.5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                id="tab-view-all"
                onClick={() => setTrainingModeView('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  trainingModeView === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vista Completa</span>
              </button>

              <button
                id="tab-view-stockfish"
                onClick={() => setTrainingModeView('stockfish')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  trainingModeView === 'stockfish'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Stockfish UCI</span>
              </button>

              <button
                id="tab-view-gm-coach"
                onClick={() => setTrainingModeView('gm_coach')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  trainingModeView === 'gm_coach'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Tutor IA & Chat</span>
              </button>
            </div>
          </div>

          {/* STOCKFISH ENGINE PERMANENT ANALYSIS PANEL */}
          {(trainingModeView === 'all' || trainingModeView === 'stockfish') && renderStockfishSection()}

          {/* GRANDMASTER AI COACH & MOVE SUGGESTIONS SECTION */}
          {(trainingModeView === 'all' || trainingModeView === 'gm_coach') && (
            <>
              {renderCoachSuggestionsSection()}
              {renderCoachChatSection()}
            </>
          )}

        </div>
      </div>

      {/* Mobile Floating Action Bar (visible only on < lg screens) */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 z-40">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1.5 max-w-md mx-auto">
          {/* Stockfish button with live eval badge */}
          <button
            id="mobile-fab-stockfish"
            onClick={() => {
              setMobileDrawerTab('stockfish');
              setMobileDrawerOpen(true);
            }}
            className="flex-1 py-2 px-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 text-xs font-black shadow-sm active:scale-95 transition min-w-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="truncate">SF: {stockfishEngineState?.evaluationFormatted || '+0.0'}</span>
          </button>

          {/* GM Coach suggestions button */}
          <button
            id="mobile-fab-coach"
            onClick={() => {
              setMobileDrawerTab('gm_coach');
              setMobileDrawerOpen(true);
            }}
            className="flex-1 py-2 px-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 transition min-w-0"
          >
            <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Tutor IA</span>
          </button>

          {/* Quick flip board */}
          <button
            id="mobile-fab-flip"
            onClick={() => setOrientation(prev => prev === 'w' ? 'b' : 'w')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0 active:scale-95"
            title="Girar tablero"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Quick undo move */}
          <button
            id="mobile-fab-undo"
            onClick={handleUndo}
            disabled={currentStep === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition shrink-0 active:scale-95"
            title="Deshacer jugada"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Menu / Presets & options */}
          <button
            id="mobile-fab-menu"
            onClick={() => {
              setMobileDrawerTab('presets');
              setMobileDrawerOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0 active:scale-95"
            title="Aperturas y opciones"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer (Side sheet) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-over sheet panel */}
          <div className="fixed inset-y-0 right-0 max-w-full sm:max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-50 border-l border-slate-200 dark:border-slate-800">
            
            {/* Sheet Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/90">
              <div className="flex items-center gap-2">
                <PanelRight className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Panel de Análisis y Tutoría
                </span>
              </div>
              <button
                id="close-mobile-drawer-btn"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 active:scale-95 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs in Drawer */}
            <div className="flex items-center p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
              <button
                onClick={() => setMobileDrawerTab('stockfish')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                  mobileDrawerTab === 'stockfish'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Stockfish UCI
              </button>

              <button
                onClick={() => setMobileDrawerTab('gm_coach')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                  mobileDrawerTab === 'gm_coach'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" /> Tutor IA
              </button>

              <button
                onClick={() => setMobileDrawerTab('chat')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                  mobileDrawerTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Preguntas
              </button>

              <button
                onClick={() => setMobileDrawerTab('presets')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                  mobileDrawerTab === 'presets'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Posiciones
              </button>
            </div>

            {/* Scrollable Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mobileDrawerTab === 'stockfish' && renderStockfishSection()}
              {mobileDrawerTab === 'gm_coach' && renderCoachSuggestionsSection()}
              {mobileDrawerTab === 'chat' && renderCoachChatSection()}
              {mobileDrawerTab === 'presets' && renderPresetsSection()}
            </div>
          </div>
        </div>
      )}

      {/* Modal for loading Custom FEN */}
      {showFenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                Cargar Posición Personalizada (FEN)
              </h3>
              <button
                onClick={() => setShowFenModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pega una cadena de notación FEN estándar (Forsyth–Edwards Notation) para analizarla y entrenar sobre ella.
            </p>

            <textarea
              id="custom-fen-textarea"
              rows={3}
              value={customFenInput}
              onChange={(e) => setCustomFenInput(e.target.value)}
              placeholder="Ejemplo: r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
              className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFenModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                id="apply-custom-fen-btn"
                onClick={handleLoadCustomFen}
                className="px-5 py-2 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition"
              >
                Cargar Posición
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
