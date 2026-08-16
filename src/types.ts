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
