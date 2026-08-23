export type StageType = 
  | 'boss_duel'       // Partida completa o desde posición ventajosa contra un jefe temático
  | 'puzzle_trial'     // Reto táctico específico (encontrar el golpe ganador o mate)
  | 'handicap_duel'    // Batalla asimétrica (el jefe tiene ventajas o piezas extra)
  | 'survival_mate'    // Sobrevivir o ejecutar mate en número exacto de jugadas bajo presión

export interface BossTrait {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
}

export interface AdventureRelic {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  effectType: 'hint_boost' | 'time_boost' | 'xp_boost' | 'gold_boost' | 'defense_aura' | 'tactical_sight';
  effectValue: number;
}

export interface AdventureSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  requiredLevel: number;
  tier: 1 | 2 | 3;
}

export interface ConsumableItem {
  id: 'oracle_potion' | 'time_warp' | 'shield_rune';
  name: string;
  description: string;
  icon: string;
  price: number;
  count: number;
}

export interface AdventureStage {
  id: string;
  worldId: string;
  stageNumber: number;
  title: string;
  type: StageType;
  storyIntro: string;
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  bossElo: number;
  bossMaxHp: number;
  bossStyle: string;
  bossTrait?: BossTrait;
  initialFen: string; // Standard or custom FEN position
  playerColor: 'w' | 'b';
  timeControlSeconds: number; // 0 for unlimited, or 60, 180, 300, 600
  mateIn?: number;
  solutionSan?: string[]; // For puzzle stages
  solutionExplanation?: string;
  starObjectives: [string, string, string]; // e.g. ["Completar nivel", "Sin usar más de 1 pista", "Victoria en menos de 30 jugadas"]
  rewardXp: number;
  rewardGold: number;
  rewardRelic?: AdventureRelic;
  dialogue: {
    intro: string;
    onPlayerGoodMove: string;
    onBossAttack: string;
    onPlayerCheck: string;
    onBossCheck: string;
    onDefeat: string;
    onVictory: string;
  };
}

export interface AdventureWorld {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  borderAccent: string;
  icon: string;
  requiredStarsToUnlock: number;
  bossName: string;
  stages: AdventureStage[];
}

export type HeroClass = 
  | 'knight'   // Caballero Táctico (Especialista en ataques dobles y piezas menores)
  | 'mage'     // Hechicera Posicional (Especialista en diagonales y control de casillas)
  | 'paladin'  // Paladín Real (Especialista en seguridad de rey y defensa inquebrantable)
  | 'assassin';// Asesina de Sombras (Especialista en sacrificios y mates relámpago)

export interface HeroState {
  name: string;
  heroClass: HeroClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  skillPoints: number;
  unlockedSkills: string[];
  equippedRelics: string[];
  relicsInventory: string[];
  consumables: Record<string, number>;
  totalWins: number;
  totalPuzzlesSolved: number;
  bossesDefeated: number;
}

export interface StageSaveData {
  stars: number; // 0 to 3
  completed: boolean;
  highScore: number;
  bestTimeSeconds: number;
  completedAt: string;
}

export interface AdventureSaveState {
  hero: HeroState;
  completedStages: Record<string, StageSaveData>;
  currentWorldId: string;
  selectedStageId: string | null;
  lastPlayedDate: string;
}
