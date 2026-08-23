import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Medal,
  Swords,
  Crown,
  Play,
  RotateCcw,
  Flag,
  Handshake,
  Clock,
  CheckCircle2,
  ChevronRight,
  Shield,
  Award,
  Sparkles,
  Users,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  TournamentState,
  TournamentParticipant,
  TournamentMatch,
  TournamentFormat,
  TournamentTrophy,
  GameTimeControl,
  GameEndReason
} from '../types';
import { BOT_PROFILES, TIME_CONTROLS, getBotById } from '../data/botProfiles';
import { ChessBoard } from './ChessBoard';
import { computeBotMove, simulateBotVsBotMatch, getCapturedPieces } from '../utils/chessBotEngine';
import { soundSystem } from '../utils/chessAudio';
import { formatSanForDisplay } from '../utils/notation';

interface TournamentModeProps {
  notationFormat?: 'spanish' | 'international' | 'figurine';
  boardTheme?: 'wood' | 'green' | 'blue' | 'classic';
}

interface TournamentPreset {
  id: string;
  title: string;
  format: TournamentFormat;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Élite';
  description: string;
  avgElo: number;
  trophyIcon: string;
  botIds: string[];
}

const TOURNAMENT_PRESETS: TournamentPreset[] = [
  {
    id: 'cup-novice',
    title: 'Copa Escolar de Novatos',
    format: 'knockout',
    difficulty: 'Principiante',
    description: 'Torneo eliminatorio ideal para dar tus primeros pasos y ganar tu primer trofeo.',
    avgElo: 850,
    trophyIcon: '🥉',
    botIds: ['bot-toby', 'bot-lucas', 'bot-clara', 'bot-sofia', 'bot-toby', 'bot-lucas', 'bot-clara']
  },
  {
    id: 'cup-masters',
    title: 'Copa Abierta de Maestros del Club',
    format: 'knockout',
    difficulty: 'Intermedio',
    description: 'Enfrenta a fuertes jugadores de club en rondas de eliminación directa.',
    avgElo: 1550,
    trophyIcon: '🥈',
    botIds: ['bot-clara', 'bot-sofia', 'bot-mateo', 'bot-kenji', 'bot-dimitri', 'bot-lucas', 'bot-valeria']
  },
  {
    id: 'cup-fide',
    title: 'Gran Copa Internacional FIDE',
    format: 'knockout',
    difficulty: 'Avanzado',
    description: 'Torneo de alta exigencia contra Maestros FIDE y Candidatos a Gran Maestro.',
    avgElo: 2150,
    trophyIcon: '🥇',
    botIds: ['bot-kenji', 'bot-dimitri', 'bot-valeria', 'bot-carlos', 'bot-mateo', 'bot-sofia', 'bot-kasparov']
  },
  {
    id: 'league-legends',
    title: 'Liga de Leyendas del Tablero',
    format: 'round-robin',
    difficulty: 'Élite',
    description: 'Liga todos contra todos de 5 rondas contra los campeones mundiales e IA suprema.',
    avgElo: 2550,
    trophyIcon: '👑',
    botIds: ['bot-valeria', 'bot-carlos', 'bot-karpov', 'bot-kasparov', 'bot-stockfish']
  }
];

export const TournamentMode: React.FC<TournamentModeProps> = ({
  notationFormat = 'spanish',
  boardTheme = 'classic'
}) => {
  // Persistence for user trophies
  const [trophies, setTrophies] = useState<TournamentTrophy[]>(() => {
    try {
      const saved = localStorage.getItem('ajedrez_tactico_trophies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ajedrez_tactico_trophies', JSON.stringify(trophies));
  }, [trophies]);

  // Tournament flow state
  const [selectedPreset, setSelectedPreset] = useState<TournamentPreset>(TOURNAMENT_PRESETS[1]);
  const [selectedTimeControl, setSelectedTimeControl] = useState<GameTimeControl>(TIME_CONTROLS[3]); // 5 min
  const [tournament, setTournament] = useState<TournamentState | null>(null);

  // Active match state when user is playing a tournament game
  const [activeMatch, setActiveMatch] = useState<TournamentMatch | null>(null);
  const [chess, setChess] = useState<Chess>(new Chess());
  const [moveHistory, setMoveHistory] = useState<{ san: string; from: string; to: string; fen: string }[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);
  const [userColorInMatch, setUserColorInMatch] = useState<'w' | 'b'>('w');
  const timerRef = useRef<number | null>(null);

  // End match popup
  const [matchResultPopup, setMatchResultPopup] = useState<{
    winner: 'user' | 'bot' | 'draw';
    title: string;
    description: string;
  } | null>(null);

  // Initialize a Tournament
  const handleStartTournament = (preset: TournamentPreset) => {
    const userParticipant: TournamentParticipant = {
      id: 'player-user',
      name: 'Tú (Jugador)',
      avatar: '👑',
      isUser: true,
      elo: 1500,
      countryFlag: '🇪🇸',
      playStyle: 'Flexible',
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      buchholz: 0,
      eliminated: false
    };

    if (preset.format === 'knockout') {
      // 8 participants: 1 user + 7 bots
      const botParticipants: TournamentParticipant[] = preset.botIds.slice(0, 7).map((botId, idx) => {
        const bot = getBotById(botId);
        return {
          id: `bot-p-${idx}-${bot.id}`,
          name: bot.name,
          avatar: bot.avatar,
          isUser: false,
          elo: bot.elo,
          title: bot.title,
          countryFlag: bot.countryFlag,
          playStyle: bot.playStyle,
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          buchholz: 0,
          eliminated: false,
          botProfileId: bot.id
        };
      });

      const allParticipants = [userParticipant, ...botParticipants];

      // Round 1 (Quarterfinals - 4 matches)
      const qfMatches: TournamentMatch[] = [
        {
          id: 'm-qf-1',
          round: 1,
          matchIndex: 0,
          stageName: 'Cuartos de final 1',
          playerWhiteId: allParticipants[0].id, // User
          playerBlackId: allParticipants[1].id,
          winnerId: null,
          status: 'scheduled'
        },
        {
          id: 'm-qf-2',
          round: 1,
          matchIndex: 1,
          stageName: 'Cuartos de final 2',
          playerWhiteId: allParticipants[2].id,
          playerBlackId: allParticipants[3].id,
          winnerId: null,
          status: 'scheduled'
        },
        {
          id: 'm-qf-3',
          round: 1,
          matchIndex: 2,
          stageName: 'Cuartos de final 3',
          playerWhiteId: allParticipants[4].id,
          playerBlackId: allParticipants[5].id,
          winnerId: null,
          status: 'scheduled'
        },
        {
          id: 'm-qf-4',
          round: 1,
          matchIndex: 3,
          stageName: 'Cuartos de final 4',
          playerWhiteId: allParticipants[6].id,
          playerBlackId: allParticipants[7].id,
          winnerId: null,
          status: 'scheduled'
        }
      ];

      setTournament({
        id: `tourney-${Date.now()}`,
        title: preset.title,
        format: 'knockout',
        roundsTotal: 3,
        currentRound: 1,
        status: 'in_progress',
        timeControl: selectedTimeControl,
        participants: allParticipants,
        matches: qfMatches,
        userPlayerId: 'player-user',
        dateStarted: new Date().toISOString()
      });
    } else {
      // Round Robin (6 players - 5 rounds)
      const botParticipants: TournamentParticipant[] = preset.botIds.slice(0, 5).map((botId, idx) => {
        const bot = getBotById(botId);
        return {
          id: `bot-rr-${idx}-${bot.id}`,
          name: bot.name,
          avatar: bot.avatar,
          isUser: false,
          elo: bot.elo,
          title: bot.title,
          countryFlag: bot.countryFlag,
          playStyle: bot.playStyle,
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          buchholz: 0,
          botProfileId: bot.id
        };
      });

      const allParticipants = [userParticipant, ...botParticipants];
      const matches: TournamentMatch[] = [];

      // Generate round robin pairings for 6 players (5 rounds)
      const n = allParticipants.length;
      let matchCount = 0;
      for (let r = 1; r < n; r++) {
        for (let i = 0; i < n / 2; i++) {
          const p1 = (r + i) % (n - 1);
          let p2 = (n - 1 - i + r) % (n - 1);
          if (i === 0) p2 = n - 1;

          matches.push({
            id: `m-rr-${r}-${i}`,
            round: r,
            matchIndex: matchCount++,
            stageName: `Ronda ${r}`,
            playerWhiteId: allParticipants[p1].id,
            playerBlackId: allParticipants[p2].id,
            winnerId: null,
            status: r === 1 ? 'scheduled' : 'scheduled'
          });
        }
      }

      setTournament({
        id: `tourney-rr-${Date.now()}`,
        title: preset.title,
        format: 'round-robin',
        roundsTotal: 5,
        currentRound: 1,
        status: 'in_progress',
        timeControl: selectedTimeControl,
        participants: allParticipants,
        matches,
        userPlayerId: 'player-user',
        dateStarted: new Date().toISOString()
      });
    }
  };

  // Launch the match for the user
  const handleLaunchMatch = (match: TournamentMatch) => {
    if (!tournament) return;

    const newChess = new Chess();
    setChess(newChess);
    setMoveHistory([]);
    setLastMove(null);
    setMatchResultPopup(null);
    setIsBotThinking(false);

    const isUserWhite = match.playerWhiteId === tournament.userPlayerId;
    setUserColorInMatch(isUserWhite ? 'w' : 'b');

    const base = tournament.timeControl.baseSeconds || 300;
    setWhiteTime(base);
    setBlackTime(base);
    setActiveMatch(match);

    // If user is Black, Bot moves first as White
    if (!isUserWhite) {
      const whiteP = tournament.participants.find(p => p.id === match.playerWhiteId);
      const whiteBot = whiteP && whiteP.botProfileId ? getBotById(whiteP.botProfileId) : BOT_PROFILES[0];

      setIsBotThinking(true);
      setTimeout(async () => {
        try {
          const botMove = await computeBotMove(newChess.fen(), whiteBot, 0);
          newChess.move({ from: botMove.from, to: botMove.to, promotion: botMove.promotion as any });
          setChess(new Chess(newChess.fen()));
          setLastMove({ from: botMove.from, to: botMove.to });
          setMoveHistory([{
            san: botMove.san,
            from: botMove.from,
            to: botMove.to,
            fen: newChess.fen()
          }]);
          soundSystem.playMove();
        } catch (e) {
          console.error(e);
        } finally {
          setIsBotThinking(false);
        }
      }, whiteBot.thinkingTimeMs || 500);
    }
  };

  // Clock effect in tournament match
  useEffect(() => {
    if (!activeMatch || matchResultPopup || tournament?.timeControl.id === 'unlimited') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      const turn = chess.turn();
      if (turn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            handleCompleteMatch(userColorInMatch === 'w' ? 'bot' : 'user', 'time_out');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            handleCompleteMatch(userColorInMatch === 'b' ? 'bot' : 'user', 'time_out');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMatch, matchResultPopup, chess, tournament, userColorInMatch]);

  // Complete User Match & advance tournament
  const handleCompleteMatch = (winner: 'user' | 'bot' | 'draw', reason: GameEndReason) => {
    if (!tournament || !activeMatch) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const opponentId = activeMatch.playerWhiteId === tournament.userPlayerId
      ? activeMatch.playerBlackId
      : activeMatch.playerWhiteId;
    const opponent = tournament.participants.find(p => p.id === opponentId);

    let winnerId: string | null = null;
    let score = '½ - ½';

    if (winner === 'user') {
      winnerId = tournament.userPlayerId;
      score = userColorInMatch === 'w' ? '1 - 0' : '0 - 1';
      soundSystem.playVictory();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else if (winner === 'bot') {
      winnerId = opponentId;
      score = userColorInMatch === 'w' ? '0 - 1' : '1 - 0';
      soundSystem.playDefeat();
    } else {
      winnerId = 'draw';
      score = '½ - ½';
      soundSystem.playDraw();
    }

    setMatchResultPopup({
      winner,
      title: winner === 'user' ? '¡Victoria en la Ronda!' : winner === 'bot' ? 'Derrota en la Ronda' : 'Tablas en la Ronda',
      description: winner === 'user'
        ? `Has vencido a ${opponent?.name || 'tu rival'} (${score}).`
        : winner === 'bot'
        ? `${opponent?.name || 'Tu rival'} ha ganado el duelo (${score}).`
        : `Empate acordado (${score}).`
    });

    // Update matches and simulate remaining bot-vs-bot matches for current round
    advanceTournamentRound(activeMatch.id, winnerId, score);
  };

  // Advance tournament simulation for other bot matches
  const advanceTournamentRound = (userMatchId: string, userMatchWinnerId: string | null, scoreFormatted: string) => {
    if (!tournament) return;

    const updatedMatches = tournament.matches.map(m => {
      if (m.id === userMatchId) {
        return {
          ...m,
          winnerId: userMatchWinnerId,
          scoreFormatted,
          status: 'completed' as const
        };
      }
      // If it's another match in the same round, simulate it
      if (m.round === tournament.currentRound && m.status !== 'completed') {
        const whiteP = tournament.participants.find(p => p.id === m.playerWhiteId);
        const blackP = tournament.participants.find(p => p.id === m.playerBlackId);

        if (whiteP && blackP) {
          const whiteBot = whiteP.botProfileId ? getBotById(whiteP.botProfileId) : BOT_PROFILES[0];
          const blackBot = blackP.botProfileId ? getBotById(blackP.botProfileId) : BOT_PROFILES[0];
          const sim = simulateBotVsBotMatch(whiteBot, blackBot);

          const simWinnerId = sim.winner === 'w' ? whiteP.id : sim.winner === 'b' ? blackP.id : 'draw';
          return {
            ...m,
            winnerId: simWinnerId,
            scoreFormatted: sim.scoreFormatted,
            status: 'completed' as const,
            endReason: sim.reason
          };
        }
      }
      return m;
    });

    // Update participant scores
    const updatedParticipants = tournament.participants.map(p => {
      let points = 0;
      let wins = 0;
      let draws = 0;
      let losses = 0;

      updatedMatches.forEach(m => {
        if (m.status !== 'completed') return;
        if (m.playerWhiteId === p.id || m.playerBlackId === p.id) {
          if (m.winnerId === p.id) {
            points += 1;
            wins += 1;
          } else if (m.winnerId === 'draw') {
            points += 0.5;
            draws += 0.5;
          } else if (m.winnerId !== null) {
            losses += 1;
          }
        }
      });

      return {
        ...p,
        points,
        wins,
        draws,
        losses
      };
    });

    // Determine next round in Knockout or Round-Robin
    if (tournament.format === 'knockout') {
      if (tournament.currentRound === 1) {
        // Quarterfinals finished -> Create Semifinals (Round 2)
        const qf1Winner = updatedMatches.find(m => m.id === 'm-qf-1')?.winnerId;
        const qf2Winner = updatedMatches.find(m => m.id === 'm-qf-2')?.winnerId;
        const qf3Winner = updatedMatches.find(m => m.id === 'm-qf-3')?.winnerId;
        const qf4Winner = updatedMatches.find(m => m.id === 'm-qf-4')?.winnerId;

        const semiMatches: TournamentMatch[] = [
          {
            id: 'm-sf-1',
            round: 2,
            matchIndex: 0,
            stageName: 'Semifinal 1',
            playerWhiteId: qf1Winner || tournament.participants[0].id,
            playerBlackId: qf2Winner || tournament.participants[2].id,
            winnerId: null,
            status: 'scheduled'
          },
          {
            id: 'm-sf-2',
            round: 2,
            matchIndex: 1,
            stageName: 'Semifinal 2',
            playerWhiteId: qf3Winner || tournament.participants[4].id,
            playerBlackId: qf4Winner || tournament.participants[6].id,
            winnerId: null,
            status: 'scheduled'
          }
        ];

        setTournament({
          ...tournament,
          currentRound: 2,
          participants: updatedParticipants,
          matches: [...updatedMatches, ...semiMatches]
        });
      } else if (tournament.currentRound === 2) {
        // Semifinals finished -> Create Final (Round 3) & 3rd Place Match
        const sf1Winner = updatedMatches.find(m => m.id === 'm-sf-1')?.winnerId;
        const sf2Winner = updatedMatches.find(m => m.id === 'm-sf-2')?.winnerId;

        const finalMatch: TournamentMatch = {
          id: 'm-final-1',
          round: 3,
          matchIndex: 0,
          stageName: 'Gran Final',
          playerWhiteId: sf1Winner || tournament.participants[0].id,
          playerBlackId: sf2Winner || tournament.participants[4].id,
          winnerId: null,
          status: 'scheduled'
        };

        setTournament({
          ...tournament,
          currentRound: 3,
          participants: updatedParticipants,
          matches: [...updatedMatches, finalMatch]
        });
      } else if (tournament.currentRound === 3) {
        // Final finished! Complete Tournament
        const finalWinner = updatedMatches.find(m => m.id === 'm-final-1')?.winnerId;
        const isUserChampion = finalWinner === tournament.userPlayerId;

        if (isUserChampion) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
        }

        // Save trophy
        const newTrophy: TournamentTrophy = {
          id: `trophy-${Date.now()}`,
          tournamentTitle: tournament.title,
          format: tournament.format,
          placement: isUserChampion ? 1 : 2,
          date: new Date().toLocaleDateString('es-ES'),
          userEloChange: isUserChampion ? +35 : +10,
          points: isUserChampion ? 3 : 2,
          matchesPlayed: 3
        };
        setTrophies(prev => [newTrophy, ...prev]);

        setTournament({
          ...tournament,
          status: 'finished',
          winnerId: finalWinner || undefined,
          participants: updatedParticipants,
          matches: updatedMatches,
          dateFinished: new Date().toISOString()
        });
      }
    } else {
      // Round-Robin progression
      if (tournament.currentRound < tournament.roundsTotal) {
        setTournament({
          ...tournament,
          currentRound: tournament.currentRound + 1,
          participants: updatedParticipants,
          matches: updatedMatches
        });
      } else {
        // All rounds complete
        const sorted = [...updatedParticipants].sort((a, b) => b.points - a.points || b.wins - a.wins);
        const champion = sorted[0];
        const userPlacement = sorted.findIndex(p => p.id === tournament.userPlayerId) + 1;

        if (userPlacement === 1) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
        }

        const newTrophy: TournamentTrophy = {
          id: `trophy-${Date.now()}`,
          tournamentTitle: tournament.title,
          format: tournament.format,
          placement: (userPlacement <= 3 ? userPlacement : 'participant') as any,
          date: new Date().toLocaleDateString('es-ES'),
          userEloChange: userPlacement === 1 ? +45 : userPlacement === 2 ? +25 : userPlacement === 3 ? +10 : -5,
          points: sorted.find(p => p.id === tournament.userPlayerId)?.points || 0,
          matchesPlayed: tournament.roundsTotal
        };
        setTrophies(prev => [newTrophy, ...prev]);

        setTournament({
          ...tournament,
          status: 'finished',
          winnerId: champion.id,
          participants: updatedParticipants,
          matches: updatedMatches,
          dateFinished: new Date().toISOString()
        });
      }
    }
  };

  // User Move in Tournament Match
  const handleUserMove = async (from: string, to: string) => {
    if (!activeMatch || matchResultPopup || isBotThinking) return;
    if (chess.turn() !== userColorInMatch) return;

    try {
      const moveRes = chess.move({ from, to, promotion: 'q' });
      if (!moveRes) return;

      const newFen = chess.fen();
      const updatedChess = new Chess(newFen);
      setChess(updatedChess);
      setLastMove({ from, to });

      const newHistory = [
        ...moveHistory,
        { san: moveRes.san, from, to, fen: newFen }
      ];
      setMoveHistory(newHistory);

      if (updatedChess.inCheck()) soundSystem.playCheck();
      else if (moveRes.captured) soundSystem.playCapture();
      else soundSystem.playMove();

      // Check game over
      if (updatedChess.isGameOver()) {
        if (updatedChess.isCheckmate()) handleCompleteMatch('user', 'checkmate');
        else handleCompleteMatch('draw', 'stalemate');
        return;
      }

      // Opponent response
      const opponentId = activeMatch.playerWhiteId === tournament?.userPlayerId
        ? activeMatch.playerBlackId
        : activeMatch.playerWhiteId;
      const opponent = tournament?.participants.find(p => p.id === opponentId);
      const botProfile = opponent?.botProfileId ? getBotById(opponent.botProfileId) : BOT_PROFILES[0];

      setIsBotThinking(true);
      setTimeout(async () => {
        try {
          const botResult = await computeBotMove(newFen, botProfile, newHistory.length);
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
            setMoveHistory([
              ...newHistory,
              { san: botMoveRes.san, from: botResult.from, to: botResult.to, fen: botFen }
            ]);

            if (postBotChess.inCheck()) soundSystem.playCheck();
            else if (botMoveRes.captured) soundSystem.playCapture();
            else soundSystem.playMove();

            if (postBotChess.isGameOver()) {
              if (postBotChess.isCheckmate()) handleCompleteMatch('bot', 'checkmate');
              else handleCompleteMatch('draw', 'stalemate');
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsBotThinking(false);
        }
      }, botProfile.thinkingTimeMs || 600);

    } catch (e) {
      console.warn(e);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Find next playable match for user in current round
  const currentUserMatch = tournament?.matches.find(
    m => m.round === tournament.currentRound &&
    (m.playerWhiteId === tournament.userPlayerId || m.playerBlackId === tournament.userPlayerId) &&
    m.status !== 'completed'
  );

  const isUserEliminatedInKnockout = tournament?.format === 'knockout' &&
    tournament.matches.some(
      m => (m.playerWhiteId === tournament.userPlayerId || m.playerBlackId === tournament.userPlayerId) &&
      m.status === 'completed' &&
      m.winnerId !== tournament.userPlayerId &&
      m.winnerId !== null
    );

  const captured = getCapturedPieces(chess);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ========================================================================= */}
      {/* 1. TOURNAMENT SELECTOR (WHEN NO TOURNAMENT IS ACTIVE)                     */}
      {/* ========================================================================= */}
      {!tournament ? (
        <div className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/20 text-2xl font-bold">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Modo Torneo vs Bots
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Copas & Cuadros
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Compite por la gloria en cuadros eliminatorios y ligas todos contra todos contra bots graduados.
                </p>
              </div>
            </div>

            {/* Quick Stats on Won Trophies */}
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-2xl border border-amber-200 dark:border-amber-800">
              <div className="text-2xl">🏆</div>
              <div className="text-left">
                <span className="text-xs font-black text-amber-950 dark:text-amber-300">
                  {trophies.filter(t => t.placement === 1).length} Campeonatos Ganados
                </span>
                <p className="text-[10px] text-amber-800/80 dark:text-amber-400">
                  {trophies.length} Torneos disputados
                </p>
              </div>
            </div>
          </div>

          {/* Tournament Presets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOURNAMENT_PRESETS.map(preset => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-50/80 to-indigo-50/40 dark:from-amber-950/30 dark:to-indigo-950/20 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-3xl shadow-sm border border-slate-200/60 dark:border-slate-700">
                        {preset.trophyIcon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {preset.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold">{preset.difficulty}</span>
                          <span>•</span>
                          <span>~{preset.avgElo} Elo Medio</span>
                          <span>•</span>
                          <span className="capitalize">{preset.format === 'knockout' ? 'Eliminatoria (8)' : 'Liga (6)'}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>

                  {/* Competitors preview */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center -space-x-1.5 overflow-hidden">
                      <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-900 shadow-xs">
                        👑
                      </span>
                      {preset.botIds.slice(0, 5).map((botId, i) => {
                        const bot = getBotById(botId);
                        return (
                          <span
                            key={i}
                            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs border-2 border-white dark:border-slate-900 shadow-xs"
                            title={`${bot.name} (${bot.elo})`}
                          >
                            {bot.avatar}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPreset(preset);
                        handleStartTournament(preset);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Inscribirse y Jugar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trophy Cabinet (Historic Championships) */}
          {trophies.length > 0 && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Vitrina de Trofeos & Historial de Torneos
                </h3>
                <span className="text-xs text-slate-400 font-bold">{trophies.length} Registros</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {trophies.slice(0, 6).map(tr => (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3"
                  >
                    <div className="text-2xl">
                      {tr.placement === 1 ? '🥇' : tr.placement === 2 ? '🥈' : tr.placement === 3 ? '🥉' : '🎖️'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {tr.tournamentTitle}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {tr.placement === 1 ? 'Campeón' : `${tr.placement}º Lugar`} • {tr.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeMatch ? (
        /* ========================================================================= */
        /* 2. IN-MATCH ARENA (PLAYING CURRENT TOURNAMENT ROUND)                       */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Main Board */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Top Bar: Tournament Context & Opponent */}
            <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const oppId = activeMatch.playerWhiteId === tournament.userPlayerId
                    ? activeMatch.playerBlackId
                    : activeMatch.playerWhiteId;
                  const oppP = tournament.participants.find(p => p.id === oppId);
                  const oppBot = oppP?.botProfileId ? getBotById(oppP.botProfileId) : BOT_PROFILES[0];
                  return (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-200 dark:border-slate-700">
                        {oppBot.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            {oppBot.name}
                          </span>
                          <span className="text-xs">{oppBot.countryFlag}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            {oppBot.elo} Elo
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {activeMatch.stageName} • {tournament.title}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Bot Clock */}
              <div className={`px-4 py-2 rounded-xl font-mono text-base sm:text-lg font-black tracking-wider border ${
                chess.turn() !== userColorInMatch && !matchResultPopup
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}>
                {tournament.timeControl.id === 'unlimited' ? '∞' : formatTime(userColorInMatch === 'w' ? blackTime : whiteTime)}
              </div>
            </div>

            {/* Board */}
            <div className="bg-white dark:bg-slate-900 p-2 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col items-center">
              <ChessBoard
                chess={chess}
                orientation={userColorInMatch}
                onMove={handleUserMove}
                lastMove={lastMove}
                interactive={!matchResultPopup && !isBotThinking && chess.turn() === userColorInMatch}
                boardTheme={boardTheme}
                showCoordinates={true}
                size="lg"
              />
            </div>

            {/* Bottom Bar: User Clock & Profile */}
            <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-lg font-black shadow-md shadow-amber-500/20">
                  👑
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Tú ({userColorInMatch === 'w' ? 'Blancas' : 'Negras'})
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <span>Partida Decisiva del Torneo</span>
                  </div>
                </div>
              </div>

              {/* User Clock */}
              <div className={`px-4 py-2 rounded-xl font-mono text-base sm:text-lg font-black tracking-wider border ${
                chess.turn() === userColorInMatch && !matchResultPopup
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}>
                {tournament.timeControl.id === 'unlimited' ? '∞' : formatTime(userColorInMatch === 'w' ? whiteTime : blackTime)}
              </div>
            </div>
          </div>

          {/* Match Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Match Info Card */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {activeMatch.stageName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Ronda {tournament.currentRound} de {tournament.roundsTotal}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ¡Una victoria te clasificará a la siguiente fase del torneo! Mantén la calma y calcula cada detalle.
              </p>

              {/* In-Match Actions */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleCompleteMatch('draw', 'agreed_draw')}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Handshake className="w-3.5 h-3.5 text-emerald-500" />
                  Pactar Tablas
                </button>
                <button
                  onClick={() => handleCompleteMatch('bot', 'resignation')}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-rose-500" />
                  Rendirse
                </button>
              </div>
            </div>

            {/* Move History */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Historial de Jugadas ({moveHistory.length})
              </span>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1 font-mono text-xs">
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
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. TOURNAMENT DASHBOARD (BRACKET & STANDINGS TABLE)                       */
        /* ========================================================================= */
        <div className="flex flex-col gap-6">
          {/* Tournament Overview Card */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-500/20 font-bold">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {tournament.title}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {tournament.status === 'finished' ? 'Finalizado' : `Ronda ${tournament.currentRound} de ${tournament.roundsTotal}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {tournament.format === 'knockout' ? 'Cuadro de eliminación directa' : 'Liga regular todos contra todos'}
                </p>
              </div>
            </div>

            {/* Actions / CTA */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              {currentUserMatch && tournament.status !== 'finished' ? (
                <button
                  id="play-tournament-round-btn"
                  onClick={() => handleLaunchMatch(currentUserMatch)}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white text-xs font-black rounded-2xl shadow-lg shadow-amber-500/25 border border-amber-400/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Jugar Mi Partido ({currentUserMatch.stageName})
                </button>
              ) : isUserEliminatedInKnockout && tournament.status !== 'finished' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-500 font-bold">Has sido eliminado del cuadro</span>
                  <button
                    onClick={() => setTournament(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Nuevo Torneo
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setTournament(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Volver al Menú de Copas
                </button>
              )}
            </div>
          </div>

          {/* KNOCKOUT BRACKET VIEW */}
          {tournament.format === 'knockout' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-6 overflow-x-auto">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-500" />
                Cuadro Eliminatorio del Campeonato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
                {/* Round 1: Cuartos */}
                <div className="flex flex-col gap-4">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider text-center py-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                    Cuartos de Final
                  </div>
                  {tournament.matches.filter(m => m.round === 1).map((m, idx) => {
                    const whiteP = tournament.participants.find(p => p.id === m.playerWhiteId);
                    const blackP = tournament.participants.find(p => p.id === m.playerBlackId);
                    const isUserMatch = whiteP?.isUser || blackP?.isUser;
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isUserMatch
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400/80 shadow-md ring-1 ring-amber-500/20'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400">Duelo {idx + 1}</span>
                          <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold">
                            {m.scoreFormatted || 'Pendiente'}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-2">
                          <div className={`flex items-center justify-between text-xs ${m.winnerId === whiteP?.id ? 'font-black text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex items-center gap-1.5">
                              <span>{whiteP?.avatar}</span>
                              <span>{whiteP?.name}</span>
                            </div>
                            {m.winnerId === whiteP?.id && <span>✓</span>}
                          </div>
                          <div className={`flex items-center justify-between text-xs ${m.winnerId === blackP?.id ? 'font-black text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex items-center gap-1.5">
                              <span>{blackP?.avatar}</span>
                              <span>{blackP?.name}</span>
                            </div>
                            {m.winnerId === blackP?.id && <span>✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Round 2: Semifinales */}
                <div className="flex flex-col gap-4 justify-around">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider text-center py-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                    Semifinales
                  </div>
                  {tournament.matches.filter(m => m.round === 2).map((m, idx) => {
                    const whiteP = tournament.participants.find(p => p.id === m.playerWhiteId);
                    const blackP = tournament.participants.find(p => p.id === m.playerBlackId);
                    const isUserMatch = whiteP?.isUser || blackP?.isUser;
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isUserMatch
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400/80 shadow-md ring-1 ring-amber-500/20'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400">Semi {idx + 1}</span>
                          <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold">
                            {m.scoreFormatted || 'Pendiente'}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-2">
                          <div className={`flex items-center justify-between text-xs ${m.winnerId === whiteP?.id ? 'font-black text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex items-center gap-1.5">
                              <span>{whiteP?.avatar}</span>
                              <span>{whiteP?.name}</span>
                            </div>
                            {m.winnerId === whiteP?.id && <span>✓</span>}
                          </div>
                          <div className={`flex items-center justify-between text-xs ${m.winnerId === blackP?.id ? 'font-black text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex items-center gap-1.5">
                              <span>{blackP?.avatar}</span>
                              <span>{blackP?.name}</span>
                            </div>
                            {m.winnerId === blackP?.id && <span>✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {tournament.matches.filter(m => m.round === 2).length === 0 && (
                    <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400 italic">
                      Por definir tras los cuartos de final
                    </div>
                  )}
                </div>

                {/* Round 3: Gran Final */}
                <div className="flex flex-col gap-4 justify-center">
                  <div className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider text-center py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-300/40 rounded-xl">
                    👑 Gran Final
                  </div>
                  {tournament.matches.filter(m => m.round === 3).map((m) => {
                    const whiteP = tournament.participants.find(p => p.id === m.playerWhiteId);
                    const blackP = tournament.participants.find(p => p.id === m.playerBlackId);
                    const isUserMatch = whiteP?.isUser || blackP?.isUser;
                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-3xl border-2 transition-all ${
                          isUserMatch
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xl'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-amber-200 dark:border-amber-800">
                          <span className="text-amber-700 dark:text-amber-400 font-black">Por la Copa</span>
                          <span className="font-mono text-base font-black text-amber-600">
                            {m.scoreFormatted || 'En juego'}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 mt-3">
                          <div className={`flex items-center justify-between text-sm ${m.winnerId === whiteP?.id ? 'font-black text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{whiteP?.avatar}</span>
                              <span>{whiteP?.name}</span>
                            </div>
                            {m.winnerId === whiteP?.id && <span>🏆 CAMPEÓN</span>}
                          </div>
                          <div className={`flex items-center justify-between text-sm ${m.winnerId === blackP?.id ? 'font-black text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{blackP?.avatar}</span>
                              <span>{blackP?.name}</span>
                            </div>
                            {m.winnerId === blackP?.id && <span>🏆 CAMPEÓN</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {tournament.matches.filter(m => m.round === 3).length === 0 && (
                    <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400 italic">
                      Por definir tras las semifinales
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ROUND-ROBIN LEADERBOARD VIEW */}
          {tournament.format === 'round-robin' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Tabla de Posiciones de la Liga
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-black uppercase text-[10px]">
                      <th className="py-2.5 px-3">Pos</th>
                      <th className="py-2.5 px-3">Jugador / Bot</th>
                      <th className="py-2.5 px-3">Elo</th>
                      <th className="py-2.5 px-3 text-center">V</th>
                      <th className="py-2.5 px-3 text-center">E</th>
                      <th className="py-2.5 px-3 text-center">D</th>
                      <th className="py-2.5 px-3 text-right">Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...tournament.participants]
                      .sort((a, b) => b.points - a.points || b.wins - a.wins)
                      .map((p, idx) => (
                        <tr
                          key={p.id}
                          className={`border-b border-slate-100 dark:border-slate-800/60 transition ${
                            p.isUser
                              ? 'bg-amber-50/70 dark:bg-amber-950/30 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold">
                            {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{p.avatar}</span>
                              <span className="font-black text-slate-900 dark:text-white">{p.name}</span>
                              {p.isUser && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-white">TÚ</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono">{p.elo}</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{p.wins}</td>
                          <td className="py-3 px-3 text-center font-mono text-slate-500">{p.draws}</td>
                          <td className="py-3 px-3 text-center font-mono text-rose-500">{p.losses}</td>
                          <td className="py-3 px-3 text-right font-mono font-black text-base text-amber-600 dark:text-amber-400">
                            {p.points}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MATCH RESULT POPUP */}
      {matchResultPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95">
            <div className="text-4xl">
              {matchResultPopup.winner === 'user' ? '🏆' : matchResultPopup.winner === 'bot' ? '💀' : '🤝'}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {matchResultPopup.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {matchResultPopup.description}
              </p>
            </div>
            <button
              onClick={() => {
                setMatchResultPopup(null);
                setActiveMatch(null);
              }}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer"
            >
              Continuar al Cuadro del Torneo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
