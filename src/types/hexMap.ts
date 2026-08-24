import { AdventureStage, AdventureRelic, WorldThemeStyle } from './adventure';

export type HexTileType =
  | 'start'              // Spawn / Entrada del mapa
  | 'battle_reward'      // Batalla o prueba táctica con recompensas (Oro, XP, Estrellas, Reliquias)
  | 'battle_no_reward'   // Escaramuza rápida / combate sin recompensa mayor
  | 'key_shrine'         // Altar o cofre con Llave Mística para el Jefe
  | 'treasure'           // Alijo de tesoro / monedas / consumibles
  | 'rest_camp'          // Campamento de descanso / Manantial de sabiduría táctica
  | 'path'               // Sendero o terreno transitable neutral
  | 'blocking'           // Terreno bloqueante / obstáculo infranqueable (Montañas, abismos, etc.)
  | 'boss_gate';         // Fortaleza del Jefe Final (requiere N llaves)

export interface HexCoord {
  col: number;
  row: number;
  q?: number;
  r?: number;
}

export interface HexTileData {
  id: string;
  col: number; // mapped to axial q
  row: number; // mapped to axial r
  q: number;   // axial coordinate q
  r: number;   // axial coordinate r
  ring?: number; // 0 = core, 1 = inner, 2 = mid, 3 = outer, 4 = satellite
  type: HexTileType;
  label?: string;
  icon?: string;
  name: string;
  description: string;
  stageId?: string; // Links to an AdventureStage if it is a battle/boss
  stage?: AdventureStage;
  rewardGold?: number;
  rewardXp?: number;
  rewardConsumable?: 'oracle_potion' | 'time_warp' | 'shield_rune';
  rewardRelic?: AdventureRelic;
  blockingReason?: string;
  ambientFeature?: string; // Visual detail: 'trees' | 'castle' | 'rocks' | 'trench' | 'radar' | 'crystals' | 'neon' | 'water' | 'crater'
}

export interface HexWorldMap {
  worldId: string;
  worldNumber: number;
  worldName: string;
  themeStyle: WorldThemeStyle;
  cols: number;
  rows: number;
  requiredKeysForBoss: number; // 3, 4, 5, or 6 keys required to challenge the boss
  startHexId: string;
  bossHexId: string;
  tiles: HexTileData[];
}

export interface WorldHexProgress {
  visitedHexIds: string[];
  claimedTreasureIds: string[];
  collectedKeys: number;
  clearedBattleHexIds: string[];
}
