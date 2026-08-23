export type MateDepth = 2 | 3 | 4;

export type TacticalTheme = 
  | 'ataque-doble' // Double attack / Fork
  | 'clavada-tactica' // Pin
  | 'ataque-descubierto' // Discovered attack
  | 'jaque-descubierto' // Discovered check
  | 'desviacion' // Deflection
  | 'eliminacion-del-defensor' // Removing the defender
  | 'atraccion' // Attraction
  | 'rayos-x' // X-Ray attack
  | 'sobrecarga' // Overloading
  | 'combinaciones-tacticas' // Tactical combinations
  | 'mate-del-pasillo' // Back rank
  | 'mate-de-la-coz' // Smothered mate
  | 'sacrificio-de-dama' // Queen sacrifice
  | 'mate-de-anastasia' // Anastasia's mate
  | 'mate-arabe' // Arabian mate
  | 'mate-de-boden' // Boden's mate
  | 'mate-de-damiano' // Damiano's mate
  | 'mate-del-molino' // Windmill
  | 'mate-de-morphy' // Morphy's mate
  | 'patron-clasico'; // Classic patterns

export interface TacticalThemeInfo {
  id: TacticalTheme;
  name: string;
  description: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  color: string;
}

export interface Puzzle {
  id: string;
  title: string;
  fen: string; // Starting FEN
  turn: 'w' | 'b';
  mateIn: MateDepth;
  theme: TacticalTheme;
  difficulty: 'Fácil' | 'Medio' | 'Intermedio' | 'Desafiante';
  rating: number; // e.g. 800 - 1500 for beginner/intermediate
  description: string;
  solutionSan: string[]; // Sequential SAN moves [Move1, Response1, Move2, ...] ending in Mate (#)
  solutionExplanation: string[]; // Didactic explanation for each pair of moves
  source?: string; // e.g. "Partida de Paul Morphy (1858)" or "Composición clásica"
  hints: [string, string, string]; // 1: Idea general, 2: Pieza clave, 3: Primera jugada
}

export interface MoveStep {
  san: string;
  from: string;
  to: string;
  piece: string;
  fenAfter: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isCapture: boolean;
}

export interface TrainingSessionConfig {
  mateInOptions: MateDepth[]; // e.g. [2] or [2, 3] or [2, 3, 4]
  selectedThemes: TacticalTheme[];
  difficultyFilter: ('Fácil' | 'Medio' | 'Desafiante')[];
  puzzleCount: number; // 5, 10, 15, 20, or endless
  timeLimitPerPuzzle: number; // 0 for Zen mode, or 30, 60, 120, 180 seconds
  showTimer: boolean;
  allowHints: boolean;
}

export interface TrainingResult {
  puzzleId: string;
  solved: boolean;
  timeSpentSeconds: number;
  hintsUsed: number;
  attempts: number;
  date: string;
}

export interface UserStatistics {
  puzzlesSolved: number;
  totalAttempts: number;
  bestStreak: number;
  currentStreak: number;
  favorites: string[]; // Puzzle IDs
  history: Record<string, { solved: boolean; lastAttempt: string; attempts: number }>;
  themeMastery: Record<TacticalTheme, { solved: number; total: number }>;
}

export interface MoveSuggestion {
  san: string;
  from?: string;
  to?: string;
  score: number;
  title: string;
  tacticalConcept: string;
  justification: string;
}

export interface PositionAnalysis {
  evaluation: number;
  evaluationText: string;
  gameStage: 'Apertura' | 'Medio juego' | 'Final';
  turn: 'w' | 'b';
  inCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  whiteSuggestions: MoveSuggestion[];
  blackSuggestions: MoveSuggestion[];
  generalAssessment: string;
  tacticalAlerts: string[];
  keyTakeaway?: string;
  aiPowered?: boolean;
}

export interface StockfishLine {
  id: number;
  multipv: number;
  depth: number;
  scoreType: 'cp' | 'mate';
  scoreValue: number; // in centipawns or turns to mate
  scoreFormatted: string; // e.g. "+1.42", "-0.85", "M3", "-M2"
  pvUci: string[]; // ['e2e4', 'e7e5', 'g1f3']
  pvSan: string[]; // ['e4', 'e5', 'Cf3']
  bestMove: {
    uci: string;
    from: string;
    to: string;
    san: string;
    promotion?: string;
  };
}

export interface StockfishState {
  ready: boolean;
  active: boolean;
  depth: number;
  seldepth: number;
  nodes: number;
  nps: number;
  time: number;
  bestMove: {
    uci: string;
    from: string;
    to: string;
    san: string;
    promotion?: string;
  } | null;
  evaluationFormatted: string;
  evaluationScore: number; // white perspective: positive = white advantage
  isMate: boolean;
  mateTurns: number | null;
  lines: StockfishLine[];
  error: string | null;
}

export type StockfishOptimizationMode = 'ultra_fast' | 'balanced' | 'master' | 'custom';

export interface StockfishOptimizationSettings {
  mode: StockfishOptimizationMode;
  maxDepth: number; // 6 to 25
  moveTimeMs: number; // 0 for unlimited, or 100 to 5000 ms
  multiPV: number; // 1 to 4
  hashMb: number; // 16, 32, 64, 128
  threads: number; // 1, 2, 4
  fastHintAnalysis: boolean; // prioritize instant response for hint calculations
  autoAnalyzeStockfish: boolean; // automatically start continuous analysis
  evaluationThrottleMs: number; // UI update throttling in ms (50, 100, 200)
}

export interface PresetPosition {
  id: string;
  title: string;
  category: 'Aperturas' | 'Medio Juego' | 'Finales' | 'Ataques';
  fen: string;
  description: string;
  turn: 'w' | 'b';
}

export interface MoveAIExplanation {
  moveSan: string;
  evaluation?: string;
  summary: string;
  strategicPurpose: string;
  tacticalThemes?: string[];
  opponentResponses?: string;
  keyAdvice?: string;
  aiPowered?: boolean;
}

export interface PDFExportOptions {
  title: string;
  studentName: string;
  includeSolutions: boolean;
  solutionsOnSeparatePage: boolean;
  includeExplanations: boolean;
  includeStudentNotesBox: boolean;
  diagramsPerRow: 1 | 2;
  puzzles: Puzzle[];
  notationFormat: 'spanish' | 'international' | 'figurine'; // C, A, T, D, R vs N, B, R, Q, K vs ♞, ♝, ♜, ♛, ♚
}

export type BotDifficulty =
  | 'novice' // 600-800
  | 'beginner' // 900-1100
  | 'casual' // 1200-1350
  | 'intermediate' // 1450-1650
  | 'advanced' // 1750-1950
  | 'master' // 2100-2300
  | 'grandmaster' // 2500-2800+
  | 'custom';

export interface BotProfile {
  id: string;
  name: string;
  avatar: string;
  elo: number;
  title?: string;
  category: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Maestros' | 'Leyendas';
  country: string;
  countryFlag: string;
  playStyle: 'Agresivo' | 'Posicional' | 'Táctico' | 'Sólido' | 'Equilibrado' | 'Impredecible';
  description: string;
  dialogue: {
    start: string;
    goodMove: string;
    badMove: string;
    check: string;
    winning: string;
    losing: string;
    win: string;
    loss: string;
    draw: string;
  };
  depth: number;
  blunderChance: number; // 0 to 1
  tacticalAwareness: number; // 0 to 1
  thinkingTimeMs: number;
}

export type TimeControlId = 'unlimited' | '1m' | '3m' | '5m' | '10m' | '15m+10';

export interface GameTimeControl {
  id: TimeControlId;
  name: string;
  baseSeconds: number; // 0 for unlimited
  incrementSeconds: number;
  category: 'Bala' | 'Blitz' | 'Rápido' | 'Clásico' | 'Zen';
}

export type GameEndReason =
  | 'checkmate'
  | 'stalemate'
  | 'insufficient_material'
  | 'threefold_repetition'
  | 'fifty_moves'
  | 'time_out'
  | 'resignation'
  | 'agreed_draw';

export interface GameVsAIResult {
  winner: 'user' | 'bot' | 'draw';
  reason: GameEndReason;
  movesCount: number;
  userColor: 'w' | 'b';
  botId: string;
  botElo: number;
  timeSpentSeconds: number;
  date: string;
}

export type TournamentFormat = 'knockout' | 'round-robin' | 'arena';

export interface TournamentParticipant {
  id: string;
  name: string;
  avatar: string;
  isUser: boolean;
  elo: number;
  title?: string;
  countryFlag: string;
  playStyle: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  buchholz: number;
  eliminated?: boolean;
  botProfileId?: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  matchIndex: number;
  stageName: string; // 'Cuartos de final', 'Semifinales', 'Gran Final', 'Ronda 1', etc.
  playerWhiteId: string;
  playerBlackId: string;
  winnerId: string | null; // null if pending, 'draw' if draw, or participant ID
  scoreFormatted?: string; // "1 - 0", "0 - 1", "½ - ½"
  status: 'scheduled' | 'playing' | 'completed';
  movesHistorySan?: string[];
  endReason?: string;
}

export interface TournamentState {
  id: string;
  title: string;
  format: TournamentFormat;
  roundsTotal: number;
  currentRound: number;
  status: 'setup' | 'in_progress' | 'round_completed' | 'finished';
  timeControl: GameTimeControl;
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  userPlayerId: string;
  winnerId?: string;
  dateStarted: string;
  dateFinished?: string;
}

export interface TournamentTrophy {
  id: string;
  tournamentTitle: string;
  format: TournamentFormat;
  placement: 1 | 2 | 3 | 'participant';
  date: string;
  userEloChange: number;
  points: number;
  matchesPlayed: number;
}

