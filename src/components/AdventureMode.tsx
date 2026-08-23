import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import {
  Map,
  Compass,
  Shield,
  Swords,
  Sparkles,
  Star,
  Coins,
  Zap,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Lock,
  RotateCcw,
  HelpCircle,
  Award,
  Heart,
  FlaskConical,
  ShoppingBag,
  Check,
  X,
  Crown,
  Clock,
  ArrowLeft,
  Play,
  Eye,
  Info,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { ChessPieceIcon } from './ChessPieces';
import {
  AdventureWorld,
  AdventureStage,
  AdventureRelic,
  AdventureSkill,
  HeroState,
  AdventureSaveState,
  StageSaveData,
  HeroClass
} from '../types/adventure';
import { BotProfile } from '../types';
import {
  ADVENTURE_WORLDS,
  ADVENTURE_RELICS,
  ADVENTURE_SKILLS,
  DEFAULT_HERO_STATE,
  DEFAULT_ADVENTURE_SAVE
} from '../data/adventureData';
import { soundSystem } from '../utils/chessAudio';
import { computeBotMove } from '../utils/chessBotEngine';
import { formatSanForDisplay } from '../utils/notation';

interface AdventureModeProps {
  boardTheme?: 'classic' | 'wood' | 'green' | 'blue';
  notationFormat?: 'spanish' | 'international' | 'figurine';
}

const STORAGE_KEY = 'ajedrez_tactico_adventure_save_v1';

export const AdventureMode: React.FC<AdventureModeProps> = ({
  boardTheme = 'classic',
  notationFormat = 'spanish'
}) => {
  // ----------------------------------------------------
  // Persistent Save State
  // ----------------------------------------------------
  const [saveState, setSaveState] = useState<AdventureSaveState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ADVENTURE_SAVE;
  });

  // Save to localStorage whenever saveState updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch {
      // Ignore
    }
  }, [saveState]);

  // ----------------------------------------------------
  // Navigation & Sub-views in Adventure Mode
  // ----------------------------------------------------
  // 'world_map' | 'battle' | 'hero_sanctum' | 'shop'
  const [activeView, setActiveView] = useState<'world_map' | 'battle' | 'hero_sanctum' | 'shop'>('world_map');
  const [selectedWorldIndex, setSelectedWorldIndex] = useState<number>(0);
  const [inspectStage, setInspectStage] = useState<AdventureStage | null>(null);

  // ----------------------------------------------------
  // Active Battle State
  // ----------------------------------------------------
  const [activeStage, setActiveStage] = useState<AdventureStage | null>(null);
  const [chess, setChess] = useState<Chess>(() => new Chess());
  const [fenHistory, setFenHistory] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [highlightMove, setHighlightMove] = useState<{ from: string; to: string; color?: 'white' | 'black' } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [stockfishHint, setStockfishHint] = useState<{ from: string; to: string } | null>(null);

  // Battle Progress & RPG Metrics
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [bossHp, setBossHp] = useState<number>(100);
  const [bossDialogue, setBossDialogue] = useState<string>('');
  const [bossIsThinking, setBossIsThinking] = useState<boolean>(false);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [gameStatus, setGameStatus] = useState<'playing' | 'victory' | 'defeat' | 'draw'>('playing');
  const [gameResultDetails, setGameResultDetails] = useState<{
    starsEarned: number;
    xpEarned: number;
    goldEarned: number;
    relicEarned: AdventureRelic | null;
    isNewClear: boolean;
    levelUp: boolean;
  } | null>(null);

  // Puzzle Trial Specific State
  const [puzzleMoveIndex, setPuzzleMoveIndex] = useState<number>(0);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // Timers
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // UI notifications / Level up modal
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------
  // Calculate total stars
  // ----------------------------------------------------
  const totalStars = useMemo(() => {
    return Object.values(saveState.completedStages || {}).reduce((acc: number, stage: StageSaveData) => acc + (stage?.stars || 0), 0);
  }, [saveState.completedStages]);

  const currentWorld = ADVENTURE_WORLDS[selectedWorldIndex] || ADVENTURE_WORLDS[0];

  // Check if world is unlocked
  const isWorldUnlocked = (world: AdventureWorld) => {
    return totalStars >= world.requiredStarsToUnlock;
  };

  // Check if stage is unlocked (previous stage in same world completed or first stage)
  const isStageUnlocked = (stage: AdventureStage) => {
    const world = ADVENTURE_WORLDS.find(w => w.id === stage.worldId);
    if (!world || !isWorldUnlocked(world)) {
      return false;
    }
    if (stage.stageNumber === 1) return true;
    
    // Check previous stage
    const prevStage = world.stages.find(s => s.stageNumber === stage.stageNumber - 1);
    if (!prevStage) return false;
    return !!saveState.completedStages[prevStage.id]?.completed;
  };

  // ----------------------------------------------------
  // Start / Launch a Stage Battle
  // ----------------------------------------------------
  const handleStartStage = (stage: AdventureStage) => {
    const newChess = new Chess(stage.initialFen);
    setChess(newChess);
    setFenHistory([stage.initialFen]);
    setMoveHistory([]);
    setLastMove(null);
    setHighlightMove(null);
    setHintSquare(null);
    setStockfishHint(null);
    setActiveStage(stage);
    setInspectStage(null);

    setPlayerHp(100);
    setBossHp(stage.bossMaxHp);
    setBossDialogue(stage.dialogue.intro);
    setBossIsThinking(false);
    setGameStatus('playing');
    setGameResultDetails(null);
    setPuzzleMoveIndex(0);
    setHintsUsedCount(0);
    setTurn(newChess.turn());

    // Time control setup (+ Chronos relic bonus if equipped)
    let baseTime = stage.timeControlSeconds;
    if (baseTime > 0) {
      if (saveState.hero.equippedRelics.includes('reloj_de_kronos')) {
        baseTime += 60;
      }
      setTimeRemaining(baseTime);
      setTimerActive(true);
    } else {
      setTimeRemaining(0);
      setTimerActive(false);
    }

    setActiveView('battle');
    soundSystem.playSelect();

    // If initial turn is black and player is white (or vice versa), let boss move
    if (newChess.turn() !== stage.playerColor) {
      triggerBossMove(newChess, stage);
    }
  };

  // ----------------------------------------------------
  // Timer Countdown in Battle
  // ----------------------------------------------------
  useEffect(() => {
    if (!timerActive || activeView !== 'battle' || gameStatus !== 'playing' || timeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, activeView, gameStatus, timeRemaining]);

  const handleTimeOut = () => {
    setGameStatus('defeat');
    soundSystem.playDefeat();
    setBossDialogue('¡Se te ha agotado el tiempo! El tablero no espera a los indecisos.');
  };

  // ----------------------------------------------------
  // Trigger Boss AI Move
  // ----------------------------------------------------
  const triggerBossMove = async (currentChess: Chess, stage: AdventureStage) => {
    setBossIsThinking(true);
    const delay = Math.floor(Math.random() * 400) + 400; // 400 - 800 ms

    setTimeout(async () => {
      try {
        if (currentChess.isGameOver()) {
          setBossIsThinking(false);
          checkBattleResolution(currentChess, stage);
          return;
        }

        let bestFrom = '';
        let bestTo = '';
        let bestPromo: string | undefined = undefined;

        // If puzzle stage, follow solution
        if (stage.type === 'puzzle_trial' && stage.solutionSan && stage.solutionSan.length > puzzleMoveIndex) {
          const expectedSan = stage.solutionSan[puzzleMoveIndex];
          const moves = currentChess.moves({ verbose: true });
          const matchingMove = moves.find(m => m.san === expectedSan || m.san.replace('+', '').replace('#', '') === expectedSan.replace('+', '').replace('#', ''));
          if (matchingMove) {
            bestFrom = matchingMove.from;
            bestTo = matchingMove.to;
            bestPromo = matchingMove.promotion;
          }
        }

        // Fallback to bot engine computeBotMove
        if (!bestFrom) {
          const bossBotProfile: BotProfile = {
            id: stage.bossName.toLowerCase().replace(/\s+/g, '_'),
            name: stage.bossName,
            title: stage.bossTitle,
            avatar: stage.bossAvatar,
            elo: stage.bossElo,
            category: stage.bossElo < 1100 ? 'Principiante' : stage.bossElo < 1500 ? 'Intermedio' : stage.bossElo < 1900 ? 'Avanzado' : 'Maestros',
            country: 'Reino del Tablero',
            countryFlag: '⚔️',
            playStyle: 'Táctico',
            description: stage.bossTitle,
            depth: stage.bossElo < 1200 ? 2 : stage.bossElo < 1800 ? 3 : 4,
            blunderChance: stage.bossElo < 1000 ? 0.35 : stage.bossElo < 1500 ? 0.15 : 0.04,
            tacticalAwareness: stage.bossElo / 2500,
            thinkingTimeMs: 400,
            dialogue: {
              start: stage.dialogue.intro,
              goodMove: stage.dialogue.onBossAttack,
              badMove: 'Un descuido...',
              check: stage.dialogue.onBossCheck,
              winning: stage.dialogue.onBossAttack,
              losing: stage.dialogue.onPlayerCheck,
              win: stage.dialogue.onVictory,
              loss: stage.dialogue.onDefeat,
              draw: 'Tablas bien jugadas.'
            }
          };

          try {
            const botResult = await computeBotMove(currentChess.fen(), bossBotProfile, moveHistory.length);
            if (botResult) {
              bestFrom = botResult.from;
              bestTo = botResult.to;
              bestPromo = botResult.promotion;
            }
          } catch {
            const legal = currentChess.moves({ verbose: true });
            if (legal.length > 0) {
              const m = legal[Math.floor(Math.random() * legal.length)];
              bestFrom = m.from;
              bestTo = m.to;
              bestPromo = m.promotion;
            }
          }
        }

        if (bestFrom && bestTo) {
          const from = bestFrom as Square;
          const to = bestTo as Square;

          const moveResult = currentChess.move({ from, to, promotion: bestPromo || 'q' });
          if (moveResult) {
            const isCapture = moveResult.captured !== undefined;
            const isCheck = currentChess.inCheck();

            soundSystem.playMove();
            if (isCapture) soundSystem.playCapture();
            if (isCheck) soundSystem.playCheck();

            setChess(new Chess(currentChess.fen()));
            setFenHistory(prev => [...prev, currentChess.fen()]);
            setMoveHistory(prev => [...prev, moveResult.san]);
            setLastMove({ from, to });
            setHighlightMove({ from, to, color: 'black' });
            setTurn(currentChess.turn());

            // Boss Dialogue reaction
            if (isCheck) {
              setBossDialogue(stage.dialogue.onBossCheck);
            } else if (isCapture) {
              setBossDialogue(stage.dialogue.onBossAttack);
              // Reduce player HP
              setPlayerHp(prev => Math.max(10, prev - 15));
            }

            // In puzzle trial, advance puzzle index
            if (stage.type === 'puzzle_trial') {
              setPuzzleMoveIndex(prev => prev + 1);
            }
          }
        }
      } catch (err) {
        console.error('Boss move error:', err);
      } finally {
        setBossIsThinking(false);
        checkBattleResolution(currentChess, stage);
      }
    }, delay);
  };

  // ----------------------------------------------------
  // Handle Player Move
  // ----------------------------------------------------
  const handlePlayerMove = (from: string, to: string) => {
    if (gameStatus !== 'playing' || bossIsThinking || !activeStage) return;

    // Check if it's player's turn
    if (chess.turn() !== activeStage.playerColor) return;

    try {
      // Validate move in chess.js
      const tempChess = new Chess(chess.fen());
      const move = tempChess.move({
        from: from as Square,
        to: to as Square,
        promotion: 'q'
      });

      if (!move) {
        soundSystem.playWrong();
        return;
      }

      // Check puzzle stage requirements
      if (activeStage.type === 'puzzle_trial' && activeStage.solutionSan && activeStage.solutionSan.length > 0) {
        const expectedSan = activeStage.solutionSan[puzzleMoveIndex];
        const isExpected = (
          move.san === expectedSan ||
          move.san.replace('+', '').replace('#', '') === expectedSan.replace('+', '').replace('#', '') ||
          move.san.replace('x', '') === expectedSan.replace('x', '')
        );

        if (!isExpected) {
          soundSystem.playWrong();
          setPlayerHp(prev => Math.max(10, prev - 20));
          setBossDialogue('¡Esa jugada no es la solución táctica correcta! Intenta de nuevo.');
          return;
        }
      }

      // Execute player move
      const isCapture = move.captured !== undefined;
      const isCheck = tempChess.inCheck();

      soundSystem.playMove();
      if (isCapture) soundSystem.playCapture();
      if (isCheck) soundSystem.playCheck();

      setChess(tempChess);
      setFenHistory(prev => [...prev, tempChess.fen()]);
      setMoveHistory(prev => [...prev, move.san]);
      setLastMove({ from, to });
      setHighlightMove({ from, to, color: 'white' });
      setHintSquare(null);
      setStockfishHint(null);
      setTurn(tempChess.turn());

      // Damage boss HP on good moves
      let dmg = 15;
      if (isCapture) dmg += 20;
      if (isCheck) dmg += 25;
      if (saveState.hero.unlockedSkills.includes('golpe_critico_tactico')) {
        dmg = Math.floor(dmg * 1.5);
      }
      setBossHp(prev => Math.max(0, prev - dmg));

      // Player dialogue reaction
      if (isCheck) {
        setBossDialogue(activeStage.dialogue.onPlayerCheck);
      } else {
        setBossDialogue(activeStage.dialogue.onPlayerGoodMove);
      }

      // Progress puzzle trial index
      const newPuzzleIndex = puzzleMoveIndex + 1;
      setPuzzleMoveIndex(newPuzzleIndex);

      // Check if game is over or puzzle complete
      if (tempChess.isGameOver()) {
        checkBattleResolution(tempChess, activeStage);
      } else if (activeStage.type === 'puzzle_trial' && activeStage.solutionSan && newPuzzleIndex >= activeStage.solutionSan.length) {
        // Puzzle solved completely
        handleStageVictory(activeStage);
      } else {
        // Trigger boss reply
        triggerBossMove(tempChess, activeStage);
      }
    } catch {
      soundSystem.playWrong();
    }
  };

  // ----------------------------------------------------
  // Check Battle Resolution
  // ----------------------------------------------------
  const checkBattleResolution = (currentChess: Chess, stage: AdventureStage) => {
    if (currentChess.isCheckmate()) {
      const winner = currentChess.turn() === 'w' ? 'b' : 'w';
      if (winner === stage.playerColor) {
        handleStageVictory(stage);
      } else {
        handleStageDefeat(stage);
      }
    } else if (currentChess.isDraw() || currentChess.isStalemate()) {
      setGameStatus('draw');
      soundSystem.playDraw();
      setBossDialogue('Tablas. La posición ha quedado igualada.');
    }
  };

  // ----------------------------------------------------
  // Handle Stage Victory
  // ----------------------------------------------------
  const handleStageVictory = (stage: AdventureStage) => {
    setGameStatus('victory');
    soundSystem.playVictory();
    setBossHp(0);
    setBossDialogue(stage.dialogue.onDefeat);

    // Calculate stars (1-3)
    let stars = 1;
    if (hintsUsedCount <= 1) stars++;
    if (moveHistory.length <= 40 || timeRemaining > 30) stars++;
    stars = Math.min(3, Math.max(1, stars));

    // Calculate XP and Gold with relic/skill bonuses
    let xp = stage.rewardXp;
    let gold = stage.rewardGold;

    if (saveState.hero.equippedRelics.includes('botas_de_caballeria')) {
      xp = Math.floor(xp * 1.25);
    }
    if (saveState.hero.equippedRelics.includes('caliz_de_la_dama')) {
      gold = Math.floor(gold * 1.5);
    }
    if (saveState.hero.unlockedSkills.includes('bendicion_de_victoria')) {
      xp = Math.floor(xp * 1.5);
      gold = Math.floor(gold * 1.5);
    }

    // Check relic reward
    const existingRelic = stage.rewardRelic;
    const isFirstClear = !saveState.completedStages[stage.id]?.completed;
    let newRelicAwarded: AdventureRelic | null = null;

    if (existingRelic && isFirstClear && !saveState.hero.relicsInventory.includes(existingRelic.id)) {
      newRelicAwarded = existingRelic;
    }

    // Hero Level Up computation
    let currentXp = saveState.hero.xp + xp;
    let currentLevel = saveState.hero.level;
    let nextLevelXp = saveState.hero.xpToNextLevel;
    let skillPointsGained = 0;
    let leveledUp = false;

    while (currentXp >= nextLevelXp && currentLevel < 50) {
      currentXp -= nextLevelXp;
      currentLevel += 1;
      nextLevelXp = Math.floor(nextLevelXp * 1.35);
      skillPointsGained += 1;
      leveledUp = true;
    }

    // Update Save State
    const updatedStageSave: StageSaveData = {
      stars: Math.max(stars, saveState.completedStages[stage.id]?.stars || 0),
      completed: true,
      highScore: (saveState.completedStages[stage.id]?.highScore || 0) + xp,
      bestTimeSeconds: stage.timeControlSeconds > 0 ? stage.timeControlSeconds - timeRemaining : 60,
      completedAt: new Date().toISOString()
    };

    const newRelicsInventory = newRelicAwarded 
      ? [...saveState.hero.relicsInventory, newRelicAwarded.id]
      : saveState.hero.relicsInventory;

    setSaveState(prev => ({
      ...prev,
      completedStages: {
        ...prev.completedStages,
        [stage.id]: updatedStageSave
      },
      hero: {
        ...prev.hero,
        level: currentLevel,
        xp: currentXp,
        xpToNextLevel: nextLevelXp,
        gold: prev.hero.gold + gold,
        skillPoints: prev.hero.skillPoints + skillPointsGained,
        relicsInventory: newRelicsInventory,
        totalWins: prev.hero.totalWins + 1,
        totalPuzzlesSolved: stage.type === 'puzzle_trial' ? prev.hero.totalPuzzlesSolved + 1 : prev.hero.totalPuzzlesSolved,
        bossesDefeated: stage.stageNumber === 5 ? prev.hero.bossesDefeated + 1 : prev.hero.bossesDefeated
      },
      lastPlayedDate: new Date().toISOString()
    }));

    setGameResultDetails({
      starsEarned: stars,
      xpEarned: xp,
      goldEarned: gold,
      relicEarned: newRelicAwarded,
      isNewClear: isFirstClear,
      levelUp: leveledUp
    });
  };

  // ----------------------------------------------------
  // Handle Stage Defeat
  // ----------------------------------------------------
  const handleStageDefeat = (stage: AdventureStage) => {
    setGameStatus('defeat');
    soundSystem.playDefeat();
    setBossDialogue(stage.dialogue.onVictory);
  };

  // ----------------------------------------------------
  // Consumables & Power-ups
  // ----------------------------------------------------
  const handleUseOraclePotion = () => {
    if (saveState.hero.consumables.oracle_potion <= 0 || gameStatus !== 'playing') return;

    // Deduct potion
    setSaveState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        consumables: {
          ...prev.hero.consumables,
          oracle_potion: Math.max(0, prev.hero.consumables.oracle_potion - 1)
        }
      }
    }));

    // Generate best didactic move
    const moves = chess.moves({ verbose: true });
    if (moves.length > 0) {
      // Find capture, check or highest priority move
      const captureOrCheck = moves.find(m => m.captured || m.san.includes('+') || m.san.includes('#'));
      const chosen = captureOrCheck || moves[0];
      setStockfishHint({ from: chosen.from, to: chosen.to });
      setHintSquare(chosen.from);
      soundSystem.playSelect();
      showToast(`🔮 Visión de Oráculo: Juega ${formatSanForDisplay(chosen.san, notationFormat)} (${chosen.from} → ${chosen.to})`);
    }
  };

  const handleUseTimeWarp = () => {
    if (saveState.hero.consumables.time_warp <= 0 || gameStatus !== 'playing') return;

    setSaveState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        consumables: {
          ...prev.hero.consumables,
          time_warp: Math.max(0, prev.hero.consumables.time_warp - 1)
        }
      }
    }));

    setTimeRemaining(prev => prev + 45);
    soundSystem.playSelect();
    showToast('⏳ ¡Reloj de Kronos activado! +45 segundos añadidos.');
  };

  const handleUndoMove = () => {
    if (fenHistory.length <= 1 || gameStatus !== 'playing') return;

    // In adventure mode, undo goes back 2 half-moves (1 full turn)
    const newHistory = [...fenHistory];
    newHistory.pop(); // remove current
    if (newHistory.length > 1 && activeStage?.type !== 'puzzle_trial') {
      newHistory.pop(); // remove boss move
    }

    const lastFen = newHistory[newHistory.length - 1];
    const newChess = new Chess(lastFen);
    setChess(newChess);
    setFenHistory(newHistory);
    setMoveHistory(prev => prev.slice(0, Math.max(0, prev.length - 2)));
    setLastMove(null);
    setHighlightMove(null);
    setHintSquare(null);
    setStockfishHint(null);
    setTurn(newChess.turn());
    soundSystem.playSelect();
    showToast('⏪ Jugada retrocedida con éxito.');
  };

  const handleAskHint = () => {
    setHintsUsedCount(prev => prev + 1);
    const moves = chess.moves({ verbose: true });
    if (moves.length > 0) {
      const chosen = moves[0];
      setHintSquare(chosen.from);
      soundSystem.playSelect();
      showToast(`💡 Pista del Maestro: Enfócate en mover la pieza de la casilla ${chosen.from.toUpperCase()}`);
    }
  };

  // ----------------------------------------------------
  // Shop & Talent Tree Actions
  // ----------------------------------------------------
  const handleBuyConsumable = (itemId: 'oracle_potion' | 'time_warp' | 'shield_rune', cost: number) => {
    if (saveState.hero.gold < cost) {
      soundSystem.playWrong();
      showToast('❌ Oro insuficiente para comprar este artículo.');
      return;
    }

    setSaveState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        gold: prev.hero.gold - cost,
        consumables: {
          ...prev.hero.consumables,
          [itemId]: (prev.hero.consumables[itemId] || 0) + 1
        }
      }
    }));

    soundSystem.playVictory();
    showToast('✅ ¡Artículo adquirido con éxito!');
  };

  const handleUnlockSkill = (skill: AdventureSkill) => {
    if (saveState.hero.skillPoints < skill.cost) {
      soundSystem.playWrong();
      showToast('❌ Puntos de habilidad insuficientes.');
      return;
    }
    if (saveState.hero.level < skill.requiredLevel) {
      soundSystem.playWrong();
      showToast(`❌ Requiere nivel de héroe ${skill.requiredLevel}.`);
      return;
    }
    if (saveState.hero.unlockedSkills.includes(skill.id)) {
      return;
    }

    setSaveState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        skillPoints: prev.hero.skillPoints - skill.cost,
        unlockedSkills: [...prev.hero.unlockedSkills, skill.id]
      }
    }));

    soundSystem.playVictory();
    showToast(`✨ ¡Habilidad desbloqueada: ${skill.name}!`);
  };

  const handleToggleEquipRelic = (relicId: string) => {
    const isEquipped = saveState.hero.equippedRelics.includes(relicId);
    let newEquipped: string[];

    if (isEquipped) {
      newEquipped = saveState.hero.equippedRelics.filter(id => id !== relicId);
    } else {
      if (saveState.hero.equippedRelics.length >= 3) {
        showToast('⚠️ Solo puedes equipar hasta 3 reliquias activas a la vez.');
        return;
      }
      newEquipped = [...saveState.hero.equippedRelics, relicId];
    }

    setSaveState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        equippedRelics: newEquipped
      }
    }));

    soundSystem.playSelect();
  };

  const handleChangeHeroClass = (cls: HeroClass) => {
    setSaveState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        heroClass: cls
      }
    }));
    soundSystem.playSelect();
    showToast('🛡️ Clase de héroe actualizada.');
  };

  // Class descriptions
  const CLASS_INFO: Record<HeroClass, { name: string; icon: string; desc: string; bonus: string }> = {
    knight: {
      name: 'Caballero Táctico',
      icon: '🐎',
      desc: 'Maestro de los saltos impredecibles y bifurcaciones de caballo.',
      bonus: '+15% XP en todas las victorias'
    },
    mage: {
      name: 'Hechicera Posicional',
      icon: '🔮',
      desc: 'Domina las grandes diagonales y el control sutil de casillas.',
      bonus: '+1 Pista didáctica gratuita por batalla'
    },
    paladin: {
      name: 'Paladín Real',
      icon: '🛡️',
      desc: 'Especialista en la seguridad del monarca y la solidez de peones.',
      bonus: '+20 Puntos de guardia/salud adicionales'
    },
    assassin: {
      name: 'Asesina de Sombras',
      icon: '⚔️',
      desc: 'Ejecuta sacrificios mortales y ataques rápidos a la yugular.',
      bonus: '+25% Oro en jaques mate rápidos'
    }
  };

  // ----------------------------------------------------
  // Render: Stage Briefing Modal
  // ----------------------------------------------------
  const renderInspectStageModal = () => {
    if (!inspectStage) return null;
    const isUnlocked = isStageUnlocked(inspectStage);
    const stageSave = saveState.completedStages[inspectStage.id];
    const currentStars = stageSave?.stars || 0;

    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="relative p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-white flex items-center justify-between border-b border-indigo-500/20">
            <div className="flex items-center gap-3">
              <img
                src={inspectStage.bossAvatar}
                alt={inspectStage.bossName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                    Nivel {inspectStage.stageNumber}
                  </span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Elo {inspectStage.bossElo}
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight">{inspectStage.title}</h3>
                <p className="text-xs text-indigo-200/80 font-medium">{inspectStage.bossName} • {inspectStage.bossTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setInspectStage(null)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {/* Story Lore */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>"{inspectStage.storyIntro}"</span>
            </div>

            {/* Boss Trait */}
            {inspectStage.bossTrait && (
              <div className={`p-3 rounded-2xl border flex items-center gap-3 ${inspectStage.bossTrait.badgeColor}`}>
                <span className="text-2xl">{inspectStage.bossTrait.icon}</span>
                <div>
                  <h4 className="text-xs font-bold">{inspectStage.bossTrait.name}</h4>
                  <p className="text-[11px] opacity-90">{inspectStage.bossTrait.description}</p>
                </div>
              </div>
            )}

            {/* Star Objectives */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Objetivos de Estrellas ({currentStars}/3 ⭐)
              </h4>
              <div className="flex flex-col gap-1.5">
                {inspectStage.starObjectives.map((obj, i) => {
                  const isMet = currentStars > i;
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                        isMet
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 shrink-0 ${isMet ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      <span>{obj}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40">
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" /> +{inspectStage.rewardXp} XP
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Coins className="w-4 h-4" /> +{inspectStage.rewardGold} Oro
                </span>
              </div>
              {inspectStage.rewardRelic && (
                <span className="text-[11px] font-extrabold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>{inspectStage.rewardRelic.icon}</span> Reliquia: {inspectStage.rewardRelic.name}
                </span>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => setInspectStage(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              disabled={!isUnlocked}
              onClick={() => handleStartStage(inspectStage)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isUnlocked
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 active:scale-[0.98]'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Swords className="w-4 h-4" />
                  <span>¡Iniciar Batalla!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Nivel Bloqueado</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Render: Victory / Defeat Modal
  // ----------------------------------------------------
  const renderBattleEndModal = () => {
    if (gameStatus !== 'victory' && gameStatus !== 'defeat') return null;

    const isVictory = gameStatus === 'victory';

    return (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className={`p-6 text-center text-white ${
            isVictory
              ? 'bg-gradient-to-b from-amber-600 to-indigo-900'
              : 'bg-gradient-to-b from-rose-700 to-slate-950'
          }`}>
            <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              {isVictory ? '🏆' : '💀'}
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              {isVictory ? '¡VICTORIA ÉPICA!' : 'DERROTA'}
            </h3>
            <p className="text-xs text-white/80 font-medium mt-1">
              {isVictory ? activeStage?.title : 'El jefe ha resistido tu asalto'}
            </p>

            {/* Stars rating */}
            {isVictory && gameResultDetails && (
              <div className="flex items-center justify-center gap-2 mt-3">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-8 h-8 ${
                      s <= gameResultDetails.starsEarned
                        ? 'text-amber-300 fill-amber-300 drop-shadow-md animate-bounce'
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Loot & XP Overview */}
          <div className="p-5 flex flex-col gap-3">
            {isVictory && gameResultDetails && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">XP Ganada</span>
                      <p className="text-base font-black text-purple-900 dark:text-purple-200">+{gameResultDetails.xpEarned}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2.5">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Oro Obtenido</span>
                      <p className="text-base font-black text-amber-900 dark:text-amber-200">+{gameResultDetails.goldEarned}</p>
                    </div>
                  </div>
                </div>

                {gameResultDetails.levelUp && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 flex items-center gap-3">
                    <Crown className="w-6 h-6 text-amber-500 animate-spin" />
                    <div>
                      <h4 className="text-xs font-black text-amber-600 dark:text-amber-400">¡SUBISTE DE NIVEL!</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">Ahora eres Nivel {saveState.hero.level}. ¡Has ganado +1 Punto de Habilidad!</p>
                    </div>
                  </div>
                )}

                {gameResultDetails.relicEarned && (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                    <span className="text-3xl">{gameResultDetails.relicEarned.icon}</span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">¡Nueva Reliquia Desbloqueada!</span>
                      <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">{gameResultDetails.relicEarned.name}</h4>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">{gameResultDetails.relicEarned.description}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {!isVictory && (
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                No te rindas. Revisa las casillas vulnerables, aprovecha tus pistas didácticas y vuelve a intentar el asedio.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveView('world_map');
                setGameStatus('playing');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Mapa del Mundo</span>
            </button>
            <button
              onClick={() => {
                if (activeStage) {
                  handleStartStage(activeStage);
                }
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Main Return
  // ----------------------------------------------------
  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stage Briefing & End Modals */}
      {renderInspectStageModal()}
      {renderBattleEndModal()}

      {/* Top RPG Hero Status Bar */}
      <div className="w-full p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Hero Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl shadow-md shadow-indigo-500/20 border border-indigo-400/40">
            {CLASS_INFO[saveState.hero.heroClass].icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {saveState.hero.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Nivel {saveState.hero.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {CLASS_INFO[saveState.hero.heroClass].name}
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="hidden md:flex flex-col gap-1 w-44 lg:w-56">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Experiencia (XP)</span>
            <span>{saveState.hero.xp} / {saveState.hero.xpToNextLevel}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (saveState.hero.xp / saveState.hero.xpToNextLevel) * 100)}%` }}
            />
          </div>
        </div>

        {/* Hero Gold & Total Stars */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{saveState.hero.gold}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 flex items-center gap-1.5 text-xs font-black text-indigo-700 dark:text-indigo-400">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{totalStars} / 90 ⭐</span>
          </div>

          {/* Sub-view switcher buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveView('world_map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'world_map'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mapa</span>
            </button>
            <button
              onClick={() => setActiveView('hero_sanctum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'hero_sanctum'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Santuario</span>
            </button>
            <button
              onClick={() => setActiveView('shop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'shop'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bazar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* VIEW 1: WORLD MAP & STAGES NAVIGATION */}
      {/* ==================================================== */}
      {activeView === 'world_map' && (
        <div className="flex flex-col gap-4">
          {/* Worlds Horizontal Carousel / Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ADVENTURE_WORLDS.map((world, idx) => {
              const unlocked = isWorldUnlocked(world);
              const isSelected = selectedWorldIndex === idx;
              const worldStars = world.stages.reduce((acc, st) => acc + (saveState.completedStages[st.id]?.stars || 0), 0);

              return (
                <button
                  key={world.id}
                  onClick={() => {
                    setSelectedWorldIndex(idx);
                    soundSystem.playSelect();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{world.icon}</span>
                    {unlocked ? (
                      <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500" /> {worldStars}/15
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> {world.requiredStarsToUnlock} ⭐
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    Mundo {world.number}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {world.name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Current World Showcase Banner */}
          <div className={`w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-r ${currentWorld.bgGradient} text-white border ${currentWorld.borderAccent} shadow-lg relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{currentWorld.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
                    Mundo {currentWorld.number} de 6
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{currentWorld.name}</h3>
                <p className="text-xs text-white/80 font-medium mt-0.5">{currentWorld.subtitle}</p>
                <p className="text-xs text-white/70 max-w-xl mt-2 leading-relaxed">{currentWorld.description}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-300">Jefe Supremo</span>
                  <p className="text-xs font-black truncate">{currentWorld.bossName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* World Stages Interactive Path / Node Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {currentWorld.stages.map((stage) => {
              const unlocked = isStageUnlocked(stage);
              const stageSave = saveState.completedStages[stage.id];
              const stars = stageSave?.stars || 0;
              const isBoss = stage.stageNumber === 5;

              return (
                <div
                  key={stage.id}
                  onClick={() => {
                    if (unlocked) {
                      setInspectStage(stage);
                      soundSystem.playSelect();
                    } else {
                      soundSystem.playWrong();
                      showToast(`🔒 Completa los niveles anteriores para desbloquear.`);
                    }
                  }}
                  className={`p-4 rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    unlocked
                      ? isBoss
                        ? 'bg-gradient-to-b from-amber-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:to-indigo-950/40 border-amber-500/40 hover:border-amber-500 shadow-md hover:scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:scale-[1.02]'
                      : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-200/40 dark:border-slate-800/40 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {/* Top Node Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isBoss
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {isBoss ? '👑 Jefe Final' : `Nivel ${stage.stageNumber}`}
                    </span>

                    {unlocked ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Boss Portrait & Name */}
                  <div className="flex items-center gap-3 my-2">
                    <img
                      src={stage.bossAvatar}
                      alt={stage.bossName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {stage.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {stage.bossName}
                      </p>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        Elo {stage.bossElo}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400">
                      {stage.type === 'puzzle_trial' ? '🧩 Prueba Táctica' : '⚔️ Duelo de Ajedrez'}
                    </span>
                    <button className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <span>Jugar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: LIVE BATTLE ARENA */}
      {/* ==================================================== */}
      {activeView === 'battle' && activeStage && (
        <div className="flex flex-col gap-4">
          {/* Top Battle Banner: Player vs Boss HP & Dialogue */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col gap-3">
            {/* Header with Back button and stage name */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <button
                onClick={() => {
                  setActiveView('world_map');
                  setGameStatus('playing');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Mapa</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeStage.title}
                </span>
                {timeRemaining > 0 && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                    timeRemaining < 30 ? 'bg-rose-500/20 text-rose-300 animate-pulse border border-rose-500/40' : 'bg-slate-800 text-amber-300'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>

            {/* Duel Health Bars & Faces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Player Side */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl border-2 border-indigo-400 shrink-0">
                  {CLASS_INFO[saveState.hero.heroClass].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-white">{saveState.hero.name} (Tú)</span>
                    <span className="text-emerald-400">{playerHp} HP</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${playerHp}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Boss Side */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-rose-400">{bossHp} HP</span>
                    <span className="text-white">{activeStage.bossName} ({activeStage.bossElo} Elo)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${(bossHp / activeStage.bossMaxHp) * 100}%` }}
                    />
                  </div>
                </div>
                <img
                  src={activeStage.bossAvatar}
                  alt={activeStage.bossName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Boss Dialogue Speech Bubble */}
            {bossDialogue && (
              <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs text-amber-200 flex items-start gap-2.5 italic">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>"{bossDialogue}"</span>
              </div>
            )}
          </div>

          {/* Main Board & Action Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chess Board Area */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center p-3 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="w-full max-w-[480px] sm:max-w-[540px] aspect-square">
                <ChessBoard
                  chess={chess}
                  orientation={activeStage.playerColor}
                  onMove={handlePlayerMove}
                  lastMove={lastMove}
                  highlightMove={highlightMove}
                  hintSquare={hintSquare}
                  stockfishBestMove={stockfishHint}
                  boardTheme={boardTheme}
                  interactive={gameStatus === 'playing' && !bossIsThinking}
                />
              </div>
            </div>

            {/* Battle Action & Tactical Deck */}
            <div className="lg:col-span-4 flex flex-col gap-3.5">
              {/* Turn & Status Pill */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-500">Turno de Juego</span>
                  {bossIsThinking ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 animate-pulse flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> {activeStage.bossName} pensando...
                    </span>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      chess.turn() === activeStage.playerColor
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      {chess.turn() === activeStage.playerColor ? 'Tu Turno' : 'Turno del Rival'}
                    </span>
                  )}
                </div>

                {/* Move History Strip */}
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 max-h-28 overflow-y-auto text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Registro de Jugadas</span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {moveHistory.length === 0 ? (
                      <span className="text-slate-400 text-[11px]">Esperando jugada inicial...</span>
                    ) : (
                      moveHistory.map((m, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                          {formatSanForDisplay(m, notationFormat)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Consumable Powers Deck */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-purple-500" /> Pociones y Poderes de Aventura
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={saveState.hero.consumables.oracle_potion <= 0 || gameStatus !== 'playing'}
                    onClick={handleUseOraclePotion}
                    className="p-2.5 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-left transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                      <span>🔮 Oráculo</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800 text-[10px]">
                        x{saveState.hero.consumables.oracle_potion || 0}
                      </span>
                    </div>
                    <p className="text-[10px] text-purple-600/80 dark:text-purple-400/80 mt-0.5">Mejor jugada</p>
                  </button>

                  <button
                    disabled={saveState.hero.consumables.time_warp <= 0 || gameStatus !== 'playing'}
                    onClick={handleUseTimeWarp}
                    className="p-2.5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-left transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                      <span>⏳ Krónos</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px]">
                        x{saveState.hero.consumables.time_warp || 0}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">+45 segundos</p>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={handleAskHint}
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>Pedir Pista</span>
                  </button>
                  <button
                    onClick={handleUndoMove}
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <span>Deshacer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 3: HERO SANCTUM & TALENT TREE */}
      {/* ==================================================== */}
      {activeView === 'hero_sanctum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Hero Class Selector & Stats */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" /> Clases del Héroe
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {(['knight', 'mage', 'paladin', 'assassin'] as HeroClass[]).map((cls) => {
                  const info = CLASS_INFO[cls];
                  const isSelected = saveState.hero.heroClass === cls;

                  return (
                    <div
                      key={cls}
                      onClick={() => handleChangeHeroClass(cls)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{info.name}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{info.desc}</p>
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{info.bonus}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Equipped Relics Deck */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Reliquias Equipadas ({saveState.hero.equippedRelics.length}/3)</span>
                <Award className="w-4 h-4 text-purple-500" />
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {ADVENTURE_RELICS.map((relic) => {
                  const isOwned = saveState.hero.relicsInventory.includes(relic.id);
                  const isEquipped = saveState.hero.equippedRelics.includes(relic.id);

                  return (
                    <div
                      key={relic.id}
                      onClick={() => isOwned && handleToggleEquipRelic(relic.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isOwned
                          ? isEquipped
                            ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 text-slate-900 dark:text-white cursor-pointer'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400'
                          : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200/40 dark:border-slate-800/40 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{relic.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black">{relic.name}</h4>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300">
                              {relic.rarity}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{relic.description}</p>
                        </div>
                      </div>
                      {isOwned && (
                        <span className={`px-2 py-1 rounded-xl text-[10px] font-black ${
                          isEquipped ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                        }`}>
                          {isEquipped ? 'Equipada' : 'Equipar'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Skill Tree (Árbol de Talentos) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Árbol de Habilidades del Tablero</h3>
                  <p className="text-xs text-slate-500">Desbloquea poderes permanentes para tus batallas de aventura</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-black text-purple-700 dark:text-purple-300">
                  ✨ {saveState.hero.skillPoints} Puntos disponibles
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADVENTURE_SKILLS.map((skill) => {
                  const isUnlocked = saveState.hero.unlockedSkills.includes(skill.id);
                  const canAfford = saveState.hero.skillPoints >= skill.cost && saveState.hero.level >= skill.requiredLevel;

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        isUnlocked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/40'
                          : canAfford
                            ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{skill.icon}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            Nivel {skill.requiredLevel}+
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{skill.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{skill.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          Coste: {skill.cost} Pts
                        </span>
                        {isUnlocked ? (
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                            <Check className="w-4 h-4" /> Desbloqueada
                          </span>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => handleUnlockSkill(skill)}
                            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Aprender
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 4: POTION SHOP & BAZAAR */}
      {/* ==================================================== */}
      {activeView === 'shop' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏺</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Bazar del Gran Maestro</h3>
              </div>
              <p className="text-xs text-slate-500">Canjea el oro obtenido en tus victorias por consumibles y reliquias didácticas</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-sm font-black text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>{saveState.hero.gold} Oro</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Oracle Potion */}
            <div className="p-5 rounded-3xl border border-purple-200 dark:border-purple-800/60 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 flex flex-col justify-between gap-4">
              <div>
                <span className="text-4xl block mb-2">🔮</span>
                <h4 className="text-sm font-black text-purple-950 dark:text-purple-200">Poción de Oráculo</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Revela la mejor jugada didáctica del Gran Maestro en plena batalla.
                </p>
                <div className="mt-2 text-xs font-bold text-purple-600">
                  En inventario: x{saveState.hero.consumables.oracle_potion || 0}
                </div>
              </div>
              <button
                onClick={() => handleBuyConsumable('oracle_potion', 80)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-300" />
                <span>Comprar por 80 Oro</span>
              </button>
            </div>

            {/* Kronos Time Warp */}
            <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-800/60 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 flex flex-col justify-between gap-4">
              <div>
                <span className="text-4xl block mb-2">⏳</span>
                <h4 className="text-sm font-black text-amber-950 dark:text-amber-200">Reloj de Arena de Krónos</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Añade +45 segundos al reloj de juego en partidas con límite de tiempo.
                </p>
                <div className="mt-2 text-xs font-bold text-amber-600">
                  En inventario: x{saveState.hero.consumables.time_warp || 0}
                </div>
              </div>
              <button
                onClick={() => handleBuyConsumable('time_warp', 60)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-200" />
                <span>Comprar por 60 Oro</span>
              </button>
            </div>

            {/* Shield Rune */}
            <div className="p-5 rounded-3xl border border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 flex flex-col justify-between gap-4">
              <div>
                <span className="text-4xl block mb-2">🛡️</span>
                <h4 className="text-sm font-black text-indigo-950 dark:text-indigo-200">Runa de Salvaguarda Real</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Otorga protección pasiva contra pérdidas de salud en jugadas imprecisas.
                </p>
                <div className="mt-2 text-xs font-bold text-indigo-600">
                  En inventario: x{saveState.hero.consumables.shield_rune || 0}
                </div>
              </div>
              <button
                onClick={() => handleBuyConsumable('shield_rune', 100)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-300" />
                <span>Comprar por 100 Oro</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
