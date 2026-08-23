import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Bot,
  RotateCcw,
  Flag,
  Handshake,
  Lightbulb,
  Trophy,
  Volume2,
  VolumeX,
  Swords,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Sliders,
  Award,
  Zap
} from 'lucide-react';
import { BotProfile, GameTimeControl, TimeControlId, GameEndReason } from '../types';
import { BOT_PROFILES, TIME_CONTROLS, getBotById } from '../data/botProfiles';
import { ChessBoard } from './ChessBoard';
import { computeBotMove, getCapturedPieces } from '../utils/chessBotEngine';
import { ChessPieceIcon } from './ChessPieces';
import { soundSystem } from '../utils/chessAudio';
import { formatSanForDisplay } from '../utils/notation';

interface VsAIModeProps {
  notationFormat?: 'spanish' | 'international' | 'figurine';
  boardTheme?: 'wood' | 'green' | 'blue' | 'classic';
  initialBotId?: string;
  onAnalyzePosition?: (fen: string) => void;
}

export const VsAIMode: React.FC<VsAIModeProps> = ({
  notationFormat = 'spanish',
  boardTheme = 'classic',
  initialBotId,
  onAnalyzePosition
}) => {
  // Game Setup State
  const [inGame, setInGame] = useState<boolean>(false);
  const [selectedBot, setSelectedBot] = useState<BotProfile>(() => {
    return initialBotId ? getBotById(initialBotId) : BOT_PROFILES[2]; // Clara (1200) default
  });
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | 'random'>('w');
  const [actualUserColor, setActualUserColor] = useState<'w' | 'b'>('w');
  const [selectedTimeControl, setSelectedTimeControl] = useState<GameTimeControl>(TIME_CONTROLS[3]); // 5m default
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Custom Bot Slider settings
  const [isCustomBot, setIsCustomBot] = useState<boolean>(false);
  const [customElo, setCustomElo] = useState<number>(1500);

  // Active Game State
  const [chess, setChess] = useState<Chess>(new Chess());
  const [moveHistory, setMoveHistory] = useState<{ san: string; from: string; to: string; fen: string }[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [botSpeech, setBotSpeech] = useState<string>('');
  const [showEvaluation, setShowEvaluation] = useState<boolean>(true);
  const [hintMove, setHintMove] = useState<{ from: string; to: string } | null>(null);
  const [hintExplanation, setHintExplanation] = useState<string | null>(null);

  // Clocks
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);
  const timerRef = useRef<number | null>(null);

  // Game Over
  const [gameOverResult, setGameOverResult] = useState<{
    winner: 'user' | 'bot' | 'draw';
    reason: GameEndReason;
    title: string;
    description: string;
  } | null>(null);

  // Sound Mute
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Bot categories for filtering
  const categories = ['Todos', 'Principiante', 'Intermedio', 'Avanzado', 'Maestros', 'Leyendas'];

  const filteredBots = categoryFilter === 'Todos'
    ? BOT_PROFILES
    : BOT_PROFILES.filter(b => b.category === categoryFilter);

  // Trigger Sound
  const playSfx = useCallback((type: 'move' | 'capture' | 'check' | 'victory' | 'defeat' | 'draw') => {
    if (isMuted) return;
    if (type === 'move') soundSystem.playMove();
    else if (type === 'capture') soundSystem.playCapture();
    else if (type === 'check') soundSystem.playCheck();
    else if (type === 'victory') soundSystem.playVictory();
    else if (type === 'defeat') soundSystem.playDefeat();
    else if (type === 'draw') soundSystem.playDraw();
  }, [isMuted]);

  // Handle Game End
  const handleEndGame = useCallback((
    winner: 'user' | 'bot' | 'draw',
    reason: GameEndReason,
    customTitle?: string,
    customDesc?: string
  ) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let title = customTitle || '';
    let description = customDesc || '';

    if (!title) {
      if (winner === 'user') {
        title = '¡Victoria Magistral!';
        description = reason === 'checkmate'
          ? `¡Has ganado la partida por Jaque Mate contra ${selectedBot.name}!`
          : `Has derrotado a ${selectedBot.name} (${selectedBot.elo} Elo).`;
        setBotSpeech(selectedBot.dialogue.loss);
        playSfx('victory');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else if (winner === 'bot') {
        title = 'Derrota';
        description = reason === 'checkmate'
          ? `${selectedBot.name} te ha dado Jaque Mate.`
          : `${selectedBot.name} ha ganado la partida.`;
        setBotSpeech(selectedBot.dialogue.win);
        playSfx('defeat');
      } else {
        title = 'Tablas / Empate';
        description = 'La partida ha concluido en empate pacífico.';
        setBotSpeech(selectedBot.dialogue.draw);
        playSfx('draw');
      }
    }

    setGameOverResult({ winner, reason, title, description });
  }, [selectedBot, playSfx]);

  // Start a new game vs bot
  const startNewGame = useCallback(() => {
    const newChess = new Chess();
    setChess(newChess);
    setMoveHistory([]);
    setLastMove(null);
    setGameOverResult(null);
    setHintMove(null);
    setHintExplanation(null);
    setIsBotThinking(false);

    // Determine user color
    let assignedColor: 'w' | 'b' = 'w';
    if (playerColor === 'random') {
      assignedColor = Math.random() > 0.5 ? 'w' : 'b';
    } else {
      assignedColor = playerColor;
    }
    setActualUserColor(assignedColor);

    // Set clocks
    const base = selectedTimeControl.baseSeconds;
    setWhiteTime(base);
    setBlackTime(base);

    // Bot initial speech
    setBotSpeech(selectedBot.dialogue.start);
    setInGame(true);

    // If user is black, bot starts as White!
    if (assignedColor === 'b') {
      setIsBotThinking(true);
      setTimeout(async () => {
        try {
          const botMove = await computeBotMove(newChess.fen(), selectedBot, 0);
          newChess.move({ from: botMove.from, to: botMove.to, promotion: botMove.promotion as any });
          setChess(new Chess(newChess.fen()));
          setLastMove({ from: botMove.from, to: botMove.to });
          setMoveHistory([{
            san: botMove.san,
            from: botMove.from,
            to: botMove.to,
            fen: newChess.fen()
          }]);
          playSfx('move');
        } catch (e) {
          console.error('Error starting bot move:', e);
        } finally {
          setIsBotThinking(false);
        }
      }, selectedBot.thinkingTimeMs || 600);
    }
  }, [playerColor, selectedTimeControl, selectedBot, playSfx]);

  // Clock tick timer effect
  useEffect(() => {
    if (!inGame || gameOverResult || selectedTimeControl.id === 'unlimited') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      const turn = chess.turn();
      if (turn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            handleEndGame(actualUserColor === 'w' ? 'bot' : 'user', 'time_out', 'Tiempo Agotado', 'Las Blancas se han quedado sin tiempo.');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            handleEndGame(actualUserColor === 'b' ? 'bot' : 'user', 'time_out', 'Tiempo Agotado', 'Las Negras se han quedado sin tiempo.');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inGame, gameOverResult, chess, selectedTimeControl, actualUserColor, handleEndGame]);

  // Execute User Move
  const handleUserMove = async (from: string, to: string) => {
    if (!inGame || gameOverResult || isBotThinking) return;
    if (chess.turn() !== actualUserColor) return;

    try {
      const moveRes = chess.move({ from, to, promotion: 'q' });
      if (!moveRes) return;

      const newFen = chess.fen();
      const updatedChess = new Chess(newFen);
      setChess(updatedChess);
      setLastMove({ from, to });
      setHintMove(null);
      setHintExplanation(null);

      // Add time increment if any
      if (selectedTimeControl.incrementSeconds > 0) {
        if (actualUserColor === 'w') setWhiteTime(t => t + selectedTimeControl.incrementSeconds);
        else setBlackTime(t => t + selectedTimeControl.incrementSeconds);
      }

      const newHistory = [
        ...moveHistory,
        { san: moveRes.san, from, to, fen: newFen }
      ];
      setMoveHistory(newHistory);

      // Play move or capture/check sound
      if (updatedChess.inCheck()) playSfx('check');
      else if (moveRes.captured) playSfx('capture');
      else playSfx('move');

      // Check for Game Over after user move
      if (updatedChess.isGameOver()) {
        if (updatedChess.isCheckmate()) {
          handleEndGame('user', 'checkmate');
        } else if (updatedChess.isDraw() || updatedChess.isStalemate() || updatedChess.isThreefoldRepetition() || updatedChess.isInsufficientMaterial()) {
          handleEndGame('draw', 'stalemate');
        }
        return;
      }

      // Reactive Bot Speech on good player move or check
      if (updatedChess.inCheck()) {
        setBotSpeech(selectedBot.dialogue.check);
      } else if (moveRes.captured === 'q' || moveRes.captured === 'r') {
        setBotSpeech(selectedBot.dialogue.badMove);
      }

      // Trigger Bot Response
      setIsBotThinking(true);
      const delay = Math.max(350, selectedBot.thinkingTimeMs + (Math.random() * 300 - 150));

      setTimeout(async () => {
        try {
          const botResult = await computeBotMove(newFen, selectedBot, newHistory.length);
          const botMoveRes = updatedChess.move({
            from: botResult.from,
            to: botResult.to,
            promotion: (botResult.promotion as any) || 'q'
          });

          if (botMoveRes) {
            const botFen = updatedChess.fen();
            const postBotChess = new Chess(botFen);
            setChess(postBotChess);
            setLastMove({ from: botResult.from, to: botResult.to });

            // Increment bot clock
            if (selectedTimeControl.incrementSeconds > 0) {
              if (actualUserColor === 'w') setBlackTime(t => t + selectedTimeControl.incrementSeconds);
              else setWhiteTime(t => t + selectedTimeControl.incrementSeconds);
            }

            setMoveHistory([
              ...newHistory,
              { san: botMoveRes.san, from: botResult.from, to: botResult.to, fen: botFen }
            ]);

            // Sounds
            if (postBotChess.inCheck()) {
              playSfx('check');
              setBotSpeech(selectedBot.dialogue.check);
            } else if (botMoveRes.captured) {
              playSfx('capture');
              if (botMoveRes.captured === 'q' || botMoveRes.captured === 'r') {
                setBotSpeech(selectedBot.dialogue.goodMove);
              }
            } else {
              playSfx('move');
            }

            // Check game over after bot move
            if (postBotChess.isGameOver()) {
              if (postBotChess.isCheckmate()) {
                handleEndGame('bot', 'checkmate');
              } else if (postBotChess.isDraw() || postBotChess.isStalemate() || postBotChess.isThreefoldRepetition() || postBotChess.isInsufficientMaterial()) {
                handleEndGame('draw', 'stalemate');
              }
            }
          }
        } catch (err) {
          console.error('Bot calculation failed:', err);
        } finally {
          setIsBotThinking(false);
        }
      }, delay);

    } catch (e) {
      console.warn('Illegal move attempted:', e);
    }
  };

  // Tutor Hint
  const handleAskTutorHint = async () => {
    if (!inGame || gameOverResult || isBotThinking || chess.turn() !== actualUserColor) return;

    try {
      // Find top move with strong depth
      const topMove = await computeBotMove(chess.fen(), {
        ...selectedBot,
        depth: 10,
        blunderChance: 0,
        tacticalAwareness: 1
      }, moveHistory.length);

      if (topMove) {
        setHintMove({ from: topMove.from, to: topMove.to });
        setHintExplanation(`El Tutor sugiere jugar ${formatSanForDisplay(topMove.san, notationFormat)} (de ${topMove.from} a ${topMove.to}) para optimizar la posición.`);
      }
    } catch {
      setHintExplanation('No se pudo generar la pista en esta posición.');
    }
  };

  // Takeback / Undo
  const handleTakeback = () => {
    if (!inGame || gameOverResult || moveHistory.length === 0 || isBotThinking) return;

    // Undo 2 half-moves (Bot move + User move)
    const newHistory = [...moveHistory];
    if (newHistory.length >= 2) {
      newHistory.pop();
      newHistory.pop();
      const lastState = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
      const targetFen = lastState ? lastState.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      
      setChess(new Chess(targetFen));
      setMoveHistory(newHistory);
      setLastMove(lastState ? { from: lastState.from, to: lastState.to } : null);
      setHintMove(null);
      setHintExplanation(null);
      playSfx('move');
    } else if (newHistory.length === 1 && actualUserColor === 'w') {
      newHistory.pop();
      setChess(new Chess());
      setMoveHistory([]);
      setLastMove(null);
    }
  };

  // Offer Draw
  const handleOfferDraw = () => {
    if (!inGame || gameOverResult) return;
    // Bots below 1500 accept draw if game length > 25 moves or material is equal
    const pieces = getCapturedPieces(chess);
    const materialDiff = Math.abs(pieces.materialDifference);
    if (moveHistory.length >= 20 && materialDiff <= 1) {
      handleEndGame('draw', 'agreed_draw', 'Tablas Aceptadas', `${selectedBot.name} ha aceptado tu oferta de tablas.`);
    } else {
      setBotSpeech('Aún hay mucha lucha en la posición. ¡Prefiero seguir jugando!');
    }
  };

  // Resign
  const handleResign = () => {
    if (!inGame || gameOverResult) return;
    handleEndGame('bot', 'resignation', 'Abandono', `Te has rendido. Victoria para ${selectedBot.name}.`);
  };

  // Format Clock Time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const captured = getCapturedPieces(chess);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ========================================================================= */}
      {/* 1. LOBBY SCREEN (BOT SELECTION & CONFIGURATION)                          */}
      {/* ========================================================================= */}
      {!inGame ? (
        <div className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 text-2xl font-bold">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Jugar contra la IA
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    12 Rivales & Elo
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Elige un oponente según tu nivel, desde principiantes entusiastas hasta Grandes Maestros.
                </p>
              </div>
            </div>

            {/* Quick Play CTA */}
            <button
              id="start-vs-ai-btn"
              onClick={startNewGame}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Comenzar Partida vs {selectedBot.name} ({selectedBot.elo} Elo)
            </button>
          </div>

          {/* Game Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1 & 2: Bot Roster Selection */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Bot Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredBots.map(bot => {
                  const isSelected = selectedBot.id === bot.id && !isCustomBot;
                  return (
                    <div
                      key={bot.id}
                      onClick={() => {
                        setSelectedBot(bot);
                        setIsCustomBot(false);
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner border border-slate-200/60 dark:border-slate-700">
                            {bot.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                {bot.name}
                              </h3>
                              <span className="text-xs">{bot.countryFlag}</span>
                              {bot.title && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  {bot.title}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                              <span className="text-indigo-600 dark:text-indigo-400">{bot.elo} Elo</span>
                              <span>•</span>
                              <span>{bot.playStyle}</span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {bot.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium italic">
                        <span>"{bot.dialogue.start.substring(0, 32)}..."</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Game Setup Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Configuración de Partida
                </h3>

                {/* 1. Player Color Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Juegas con:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPlayerColor('w')}
                      className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                        playerColor === 'w'
                          ? 'bg-slate-100 dark:bg-slate-800 border-indigo-600 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-lg">♔</span>
                      <span>Blancas</span>
                    </button>
                    <button
                      onClick={() => setPlayerColor('random')}
                      className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                        playerColor === 'random'
                          ? 'bg-slate-100 dark:bg-slate-800 border-indigo-600 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-lg">☯</span>
                      <span>Aleatorio</span>
                    </button>
                    <button
                      onClick={() => setPlayerColor('b')}
                      className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                        playerColor === 'b'
                          ? 'bg-slate-100 dark:bg-slate-800 border-indigo-600 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-lg">♚</span>
                      <span>Negras</span>
                    </button>
                  </div>
                </div>

                {/* 2. Time Control Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Ritmo de Juego:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_CONTROLS.map(tc => (
                      <button
                        key={tc.id}
                        onClick={() => setSelectedTimeControl(tc)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-left flex flex-col cursor-pointer ${
                          selectedTimeControl.id === tc.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                            : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span>{tc.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{tc.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Bot Summary Card */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm border border-indigo-200 dark:border-indigo-800">
                    {selectedBot.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Rival: {selectedBot.name} ({selectedBot.elo} Elo)
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Estilo {selectedBot.playStyle} • Profundidad {selectedBot.depth}
                    </p>
                  </div>
                </div>

                {/* Play Button */}
                <button
                  id="start-match-btn"
                  onClick={startNewGame}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  ¡Comenzar Partida!
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. IN-GAME ACTIVE MATCH SCREEN                                            */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* LEFT: Interactive Chess Board with Clocks */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Top Bar: Opponent Profile & Clock */}
            <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-200 dark:border-slate-700">
                    {selectedBot.avatar}
                  </div>
                  {isBotThinking && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {selectedBot.name}
                    </span>
                    <span className="text-xs">{selectedBot.countryFlag}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {selectedBot.elo} Elo
                    </span>
                  </div>

                  {/* Captured pieces by opponent */}
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 font-mono">
                    <span className="text-[10px] text-slate-400 mr-1">Capturadas:</span>
                    {(actualUserColor === 'w' ? captured.capturedBlack : captured.capturedWhite).map((p, idx) => (
                      <span key={idx} className="font-serif font-bold text-slate-700 dark:text-slate-300">
                        {p === 'p' ? '♟' : p === 'n' ? '♞' : p === 'b' ? '♝' : p === 'r' ? '♜' : '♛'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bot Clock */}
              <div className={`px-4 py-2 rounded-xl font-mono text-base sm:text-lg font-black tracking-wider border ${
                chess.turn() !== actualUserColor && inGame && !gameOverResult
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}>
                {selectedTimeControl.id === 'unlimited' ? '∞' : formatTime(actualUserColor === 'w' ? blackTime : whiteTime)}
              </div>
            </div>

            {/* Interactive ChessBoard Container */}
            <div className="bg-white dark:bg-slate-900 p-2 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col items-center">
              <ChessBoard
                chess={chess}
                orientation={actualUserColor}
                onMove={handleUserMove}
                lastMove={lastMove}
                highlightMove={hintMove ? { ...hintMove, color: 'white' } : null}
                interactive={inGame && !gameOverResult && !isBotThinking && chess.turn() === actualUserColor}
                boardTheme={boardTheme}
                showCoordinates={true}
                size="lg"
              />
            </div>

            {/* Bottom Bar: User Profile & Clock */}
            <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-blue-500/20">
                  Tú
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      Jugador ({actualUserColor === 'w' ? 'Blancas' : 'Negras'})
                    </span>
                  </div>
                  {/* Captured pieces by user */}
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 font-mono">
                    <span className="text-[10px] text-slate-400 mr-1">Capturadas:</span>
                    {(actualUserColor === 'w' ? captured.capturedWhite : captured.capturedBlack).map((p, idx) => (
                      <span key={idx} className="font-serif font-bold text-slate-700 dark:text-slate-300">
                        {p === 'p' ? '♟' : p === 'n' ? '♞' : p === 'b' ? '♝' : p === 'r' ? '♜' : '♛'}
                      </span>
                    ))}
                    {captured.materialDifference !== 0 && (
                      <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {actualUserColor === 'w' && captured.materialDifference > 0 ? `+${captured.materialDifference}` : ''}
                        {actualUserColor === 'b' && captured.materialDifference < 0 ? `+${Math.abs(captured.materialDifference)}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Clock */}
              <div className={`px-4 py-2 rounded-xl font-mono text-base sm:text-lg font-black tracking-wider border ${
                chess.turn() === actualUserColor && inGame && !gameOverResult
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}>
                {selectedTimeControl.id === 'unlimited' ? '∞' : formatTime(actualUserColor === 'w' ? whiteTime : blackTime)}
              </div>
            </div>
          </div>

          {/* RIGHT: Game Controls, Move History & Bot Dialogue */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Bot Chat / Dialogue Bubble */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-950/40 dark:to-purple-950/20 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-sm flex items-start gap-3">
              <div className="text-2xl mt-0.5 flex-shrink-0">{selectedBot.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-950 dark:text-indigo-300">
                    {selectedBot.name}
                  </span>
                  {isBotThinking && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                      Pensando jugada...
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed italic">
                  "{botSpeech || selectedBot.dialogue.start}"
                </p>
              </div>
            </div>

            {/* Hint Box (if active) */}
            {hintExplanation && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">{hintExplanation}</p>
              </div>
            )}

            {/* Action Buttons Toolbar */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-4 gap-1.5">
              <button
                id="vs-ai-hint-btn"
                onClick={handleAskTutorHint}
                disabled={isBotThinking || Boolean(gameOverResult) || chess.turn() !== actualUserColor}
                className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/50 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 flex flex-col items-center justify-center gap-1 transition text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                title="Pedir pista al Tutor GM"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Pista</span>
              </button>

              <button
                id="vs-ai-undo-btn"
                onClick={handleTakeback}
                disabled={moveHistory.length === 0 || isBotThinking || Boolean(gameOverResult)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center gap-1 transition text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                title="Deshacer última jugada"
              >
                <RotateCcw className="w-4 h-4 text-blue-500" />
                <span>Deshacer</span>
              </button>

              <button
                id="vs-ai-draw-btn"
                onClick={handleOfferDraw}
                disabled={isBotThinking || Boolean(gameOverResult)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center gap-1 transition text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                title="Ofrecer tablas al bot"
              >
                <Handshake className="w-4 h-4 text-emerald-500" />
                <span>Tablas</span>
              </button>

              <button
                id="vs-ai-resign-btn"
                onClick={handleResign}
                disabled={isBotThinking || Boolean(gameOverResult)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 flex flex-col items-center justify-center gap-1 transition text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                title="Rendirse"
              >
                <Flag className="w-4 h-4 text-rose-500" />
                <span>Rendirse</span>
              </button>
            </div>

            {/* Move History Table */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Historial ({moveHistory.length} jugadas)
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Turno {Math.floor(moveHistory.length / 2) + 1}
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-1 font-mono text-xs">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, moveNum) => {
                  const whiteMove = moveHistory[moveNum * 2];
                  const blackMove = moveHistory[moveNum * 2 + 1];
                  return (
                    <div
                      key={moveNum}
                      className="grid grid-cols-12 py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition items-center"
                    >
                      <span className="col-span-2 text-slate-400 text-[11px] font-bold">
                        {moveNum + 1}.
                      </span>
                      <span className="col-span-5 font-bold text-slate-800 dark:text-slate-200">
                        {whiteMove ? formatSanForDisplay(whiteMove.san, notationFormat) : ''}
                      </span>
                      <span className="col-span-5 text-slate-600 dark:text-slate-400">
                        {blackMove ? formatSanForDisplay(blackMove.san, notationFormat) : ''}
                      </span>
                    </div>
                  );
                })}
                {moveHistory.length === 0 && (
                  <p className="text-center py-6 text-xs text-slate-400 italic">
                    La partida aún no ha comenzado.
                  </p>
                )}
              </div>
            </div>

            {/* Return to Lobby / New Game Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setInGame(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Elegir Otro Bot
              </button>
              <button
                onClick={startNewGame}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                Reiniciar Partida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GAME OVER MODAL                                                        */}
      {/* ========================================================================= */}
      {gameOverResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg ${
              gameOverResult.winner === 'user'
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                : gameOverResult.winner === 'bot'
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
            }`}>
              {gameOverResult.winner === 'user' ? '🏆' : gameOverResult.winner === 'bot' ? '💀' : '🤝'}
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {gameOverResult.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {gameOverResult.description}
              </p>
            </div>

            {/* Match Stats */}
            <div className="w-full grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Rival</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBot.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Jugadas</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{moveHistory.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Elo Rival</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedBot.elo}</span>
              </div>
            </div>

            {/* Bot Quote */}
            <div className="w-full p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900 text-xs italic text-indigo-950 dark:text-indigo-200">
              "{botSpeech}"
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2 mt-2">
              <button
                id="modal-rematch-btn"
                onClick={startNewGame}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
              >
                Jugar Revancha
              </button>
              <button
                id="modal-lobby-btn"
                onClick={() => {
                  setGameOverResult(null);
                  setInGame(false);
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cambiar Oponente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
