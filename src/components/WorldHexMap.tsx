import React, { useState, useMemo } from 'react';
import {
  AdventureWorld,
  AdventureStage,
  AdventureSaveState,
  StageSaveData,
  WorldHexProgressState
} from '../types/adventure';
import { HexWorldMap, HexTileData, HexTileType } from '../types/hexMap';
import { HEX_WORLD_MAPS, QUICK_SKIRMISH_PUZZLES } from '../data/hexWorldData';
import { soundSystem } from '../utils/chessAudio';
import { HexMapThreeCanvas } from './HexMapThreeCanvas';
import {
  Key,
  Lock,
  Unlock,
  Shield,
  Swords,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Package,
  Flame,
  Info,
  Footprints,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Trophy,
  Zap,
  MapPin,
  RefreshCw,
  Compass,
  Radio,
  Eye,
  Crosshair,
  Layers,
  Sparkle,
  Cpu,
  Globe,
  Trees,
  Skull
} from 'lucide-react';

interface WorldHexMapProps {
  world: AdventureWorld;
  saveState: AdventureSaveState;
  onSelectStage: (stage: AdventureStage) => void;
  onStartStage: (stage: AdventureStage) => void;
  onPrevWorld: () => void;
  onNextWorld: () => void;
  hasPrevWorld: boolean;
  hasNextWorld: boolean;
  totalWorldsCount: number;
  onUpdateSaveState?: (updater: (prev: AdventureSaveState) => AdventureSaveState) => void;
}

// Math constants for Pointy-topped Concentric Hexagons
const ORIGIN_X = 360;
const ORIGIN_Y = 340;
const HEX_RADIUS = 34; // Radius of each pointy-topped hexagon (distance from center to vertices)

// Calculate SVG Center (x, y) for an axial (q, r) hexagon
function getHexCenter(q: number, r: number): { x: number; y: number } {
  const x = ORIGIN_X + HEX_RADIUS * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = ORIGIN_Y + HEX_RADIUS * 1.5 * r;
  return { x, y };
}

// Calculate SVG Polygon points for pointy-topped hexagon
function getHexPolygonPoints(cx: number, cy: number, r: number = HEX_RADIUS - 1.5): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angleRad = (Math.PI / 180) * (60 * i + 30);
    const x = cx + r * Math.cos(angleRad);
    const y = cy + r * Math.sin(angleRad);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

// Axial distance helper: distance === 1 means adjacent in the circular hex grid
function getAxialDistance(a: { q: number; r: number }, b: { q: number; r: number }): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs((a.q + a.r) - (b.q + b.r))) / 2;
}

export const WorldHexMap: React.FC<WorldHexMapProps> = ({
  world,
  saveState,
  onSelectStage,
  onStartStage,
  onPrevWorld,
  onNextWorld,
  hasPrevWorld,
  hasNextWorld,
  totalWorldsCount,
  onUpdateSaveState
}) => {
  // Retrieve the hex map definition for this world
  const hexMap: HexWorldMap = useMemo(() => {
    return (
      HEX_WORLD_MAPS[world.id] || {
        worldId: world.id,
        worldNumber: world.worldNumber,
        worldName: world.name,
        themeStyle: world.themeStyle,
        cols: 9,
        rows: 9,
        requiredKeysForBoss: 3,
        startHexId: 'start',
        bossHexId: 'boss',
        tiles: []
      }
    );
  }, [world.id, world.worldNumber, world.name, world.themeStyle]);

  // Current progress state for this world's hex map
  const worldHexProgress: WorldHexProgressState = useMemo(() => {
    const saved = saveState.worldHexProgress?.[world.id] || saveState.hexProgress?.[world.id];
    if (saved) {
      return {
        currentHexId: saved.currentHexId || hexMap.startHexId,
        visitedHexIds: saved.visitedHexIds || [hexMap.startHexId],
        collectedKeyHexIds: saved.collectedKeyHexIds || [],
        collectedKeys: saved.collectedKeys ?? saved.collectedKeyHexIds?.length ?? 0,
        collectedTreasureHexIds: saved.collectedTreasureHexIds || saved.claimedTreasureIds || [],
        claimedTreasureIds: saved.claimedTreasureIds || saved.collectedTreasureHexIds || [],
        clearedSkirmishHexIds: saved.clearedSkirmishHexIds || saved.clearedBattleHexIds || [],
        clearedBattleHexIds: saved.clearedBattleHexIds || saved.clearedSkirmishHexIds || []
      };
    }

    // Default initial progress: start at spawn tile
    return {
      currentHexId: hexMap.startHexId,
      visitedHexIds: [hexMap.startHexId],
      collectedKeyHexIds: [],
      collectedKeys: 0,
      collectedTreasureHexIds: [],
      claimedTreasureIds: [],
      clearedSkirmishHexIds: [],
      clearedBattleHexIds: []
    };
  }, [saveState.worldHexProgress, saveState.hexProgress, world.id, hexMap.startHexId]);

  // Selected tile for inspection panel
  const [selectedHexId, setSelectedHexId] = useState<string>(
    worldHexProgress.currentHexId || hexMap.startHexId
  );

  // Quick skirmish mini-puzzle modal state
  const [skirmishTile, setSkirmishTile] = useState<HexTileData | null>(null);
  const [skirmishPuzzleIdx, setSkirmishPuzzleIdx] = useState(0);
  const [skirmishSolved, setSkirmishSolved] = useState(false);
  const [skirmishSelectedMove, setSkirmishSelectedMove] = useState<string | null>(null);

  // Helper map for fast tile lookup by id
  const tilesById = useMemo(() => {
    const map = new Map<string, HexTileData>();
    hexMap.tiles.forEach((t) => map.set(t.id, t));
    return map;
  }, [hexMap.tiles]);

  // Active hero tile
  const currentTile = tilesById.get(worldHexProgress.currentHexId) || hexMap.tiles[0];
  const selectedTile = tilesById.get(selectedHexId) || currentTile;

  // Calculate reachable adjacent tiles from current hero position
  const reachableTileIds = useMemo(() => {
    if (!currentTile) return new Set<string>();
    const reachable = new Set<string>();

    hexMap.tiles.forEach((t) => {
      if (t.id === currentTile.id) return;
      const dist = getAxialDistance(
        { q: currentTile.q ?? currentTile.col, r: currentTile.r ?? currentTile.row },
        { q: t.q ?? t.col, r: t.r ?? t.row }
      );
      if (dist === 1) {
        reachable.add(t.id);
      }
    });

    return reachable;
  }, [currentTile, hexMap.tiles]);

  // Discovered tiles: visited tiles + all directly adjacent tiles
  const discoveredTileIds = useMemo(() => {
    const discovered = new Set<string>(worldHexProgress.visitedHexIds);

    // Also discover start and boss by default so player sees the central objective
    discovered.add(hexMap.startHexId);
    discovered.add(hexMap.bossHexId);

    worldHexProgress.visitedHexIds.forEach((vId) => {
      const vTile = tilesById.get(vId);
      if (!vTile) return;
      hexMap.tiles.forEach((t) => {
        const dist = getAxialDistance(
          { q: vTile.q ?? vTile.col, r: vTile.r ?? vTile.row },
          { q: t.q ?? t.col, r: t.r ?? t.row }
        );
        if (dist <= 1) {
          discovered.add(t.id);
        }
      });
    });

    return discovered;
  }, [worldHexProgress.visitedHexIds, hexMap.startHexId, hexMap.bossHexId, hexMap.tiles, tilesById]);

  // Total keys collected in this world
  const keysCollectedCount = worldHexProgress.collectedKeyHexIds?.length ?? worldHexProgress.collectedKeys ?? 0;
  const requiredKeys = hexMap.requiredKeysForBoss;
  const hasAllKeys = keysCollectedCount >= requiredKeys;

  // Boss Stage completion
  const isBossDefeated = useMemo(() => {
    const bossTile = tilesById.get(hexMap.bossHexId);
    if (!bossTile || !bossTile.stageId) return false;
    const stageData: StageSaveData | undefined =
      saveState.completedStages?.[bossTile.stageId] || saveState.stages?.[bossTile.stageId];
    return stageData?.completed || false;
  }, [tilesById, hexMap.bossHexId, saveState.completedStages, saveState.stages]);

  // Handle clicking on a hex
  const handleHexClick = (tile: HexTileData) => {
    setSelectedHexId(tile.id);
    soundSystem.play('select');
  };

  // Move Hero to a reachable non-blocking tile
  const handleMoveToTile = (tile: HexTileData) => {
    if (!onUpdateSaveState) return;
    if (tile.type === 'blocking') {
      soundSystem.play('blunder');
      return;
    }

    // If it's a boss gate and not enough keys, prevent entry
    if (tile.type === 'boss_gate' && !hasAllKeys) {
      soundSystem.play('blunder');
      return;
    }

    soundSystem.play('move');

    onUpdateSaveState((prev) => {
      const curWorldProgress =
        prev.worldHexProgress?.[world.id] ||
        prev.hexProgress?.[world.id] || {
          currentHexId: hexMap.startHexId,
          visitedHexIds: [hexMap.startHexId],
          collectedKeyHexIds: [],
          collectedKeys: 0,
          collectedTreasureHexIds: [],
          claimedTreasureIds: [],
          clearedSkirmishHexIds: [],
          clearedBattleHexIds: []
        };

      const newVisited = Array.from(
        new Set([...(curWorldProgress.visitedHexIds || []), tile.id])
      );

      // Auto-collect keys upon stepping on a key shrine
      let newKeys = [...(curWorldProgress.collectedKeyHexIds || [])];
      if (tile.type === 'key_shrine' && !newKeys.includes(tile.id)) {
        newKeys.push(tile.id);
        soundSystem.play('gameWon');
      }

      // Auto-claim treasures upon stepping
      let newTreasures = [
        ...(curWorldProgress.collectedTreasureHexIds || curWorldProgress.claimedTreasureIds || [])
      ];
      let updatedGold = prev.hero?.gold ?? prev.gold ?? 0;
      let updatedConsumables = { ...(prev.hero?.consumables ?? prev.consumables ?? {}) };

      if (tile.type === 'treasure' && !newTreasures.includes(tile.id)) {
        newTreasures.push(tile.id);
        if (tile.rewardGold) updatedGold += tile.rewardGold;
        if (tile.rewardConsumable) {
          updatedConsumables[tile.rewardConsumable] =
            (updatedConsumables[tile.rewardConsumable] || 0) + 1;
        }
        soundSystem.play('gameWon');
      }

      const updatedProgress: WorldHexProgressState = {
        ...curWorldProgress,
        currentHexId: tile.id,
        visitedHexIds: newVisited,
        collectedKeyHexIds: newKeys,
        collectedKeys: newKeys.length,
        collectedTreasureHexIds: newTreasures,
        claimedTreasureIds: newTreasures
      };

      return {
        ...prev,
        hero: {
          ...prev.hero,
          gold: updatedGold,
          consumables: updatedConsumables
        },
        gold: updatedGold,
        consumables: updatedConsumables,
        worldHexProgress: {
          ...prev.worldHexProgress,
          [world.id]: updatedProgress
        },
        hexProgress: {
          ...prev.hexProgress,
          [world.id]: updatedProgress
        }
      };
    });
  };

  // Launch Stage Battle
  const handleLaunchStage = (stage: AdventureStage) => {
    soundSystem.play('gameStart');
    onStartStage(stage);
  };

  // Open Quick Skirmish Mini-Puzzle
  const handleOpenSkirmish = (tile: HexTileData) => {
    setSkirmishTile(tile);
    setSkirmishPuzzleIdx(Math.floor(Math.random() * QUICK_SKIRMISH_PUZZLES.length));
    setSkirmishSolved(false);
    setSkirmishSelectedMove(null);
  };

  const handleSolveSkirmish = (move: string) => {
    const puzzle = QUICK_SKIRMISH_PUZZLES[skirmishPuzzleIdx];
    setSkirmishSelectedMove(move);
    if (puzzle.solutionSan.includes(move)) {
      setSkirmishSolved(true);
      soundSystem.play('gameWon');

      if (onUpdateSaveState && skirmishTile) {
        onUpdateSaveState((prev) => {
          const curProg = prev.hexProgress?.[world.id] || {
            currentHexId: hexMap.startHexId,
            visitedHexIds: [hexMap.startHexId],
            collectedKeyHexIds: [],
            collectedTreasureHexIds: [],
            clearedSkirmishHexIds: []
          };
          return {
            ...prev,
            hexProgress: {
              ...prev.hexProgress,
              [world.id]: {
                ...curProg,
                clearedSkirmishHexIds: Array.from(
                  new Set([...curProg.clearedSkirmishHexIds, skirmishTile.id])
                )
              }
            }
          };
        });
      }
    } else {
      soundSystem.play('blunder');
    }
  };

  // Connections / Pathways between adjacent discovered tiles
  const renderedConnections = useMemo(() => {
    const lines: {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isTraversed: number; // 0 = not traversed, 1 = discovered, 2 = hero adjacent
    }[] = [];

    const visitedSet = new Set(worldHexProgress.visitedHexIds);

    for (let i = 0; i < hexMap.tiles.length; i++) {
      const t1 = hexMap.tiles[i];
      if (!discoveredTileIds.has(t1.id)) continue;
      const c1 = getHexCenter(t1.q ?? t1.col, t1.r ?? t1.row);

      for (let j = i + 1; j < hexMap.tiles.length; j++) {
        const t2 = hexMap.tiles[j];
        if (!discoveredTileIds.has(t2.id)) continue;

        const dist = getAxialDistance(
          { q: t1.q ?? t1.col, r: t1.r ?? t1.row },
          { q: t2.q ?? t2.col, r: t2.r ?? t2.row }
        );

        if (dist === 1) {
          const c2 = getHexCenter(t2.q ?? t2.col, t2.r ?? t2.row);
          const bothVisited = visitedSet.has(t1.id) && visitedSet.has(t2.id);
          const touchesHero =
            (t1.id === currentTile?.id && visitedSet.has(t2.id)) ||
            (t2.id === currentTile?.id && visitedSet.has(t1.id));

          lines.push({
            id: `conn-${t1.id}-${t2.id}`,
            x1: c1.x,
            y1: c1.y,
            x2: c2.x,
            y2: c2.y,
            isTraversed: touchesHero ? 2 : bothVisited ? 1 : 0
          });
        }
      }
    }

    return lines;
  }, [hexMap.tiles, discoveredTileIds, worldHexProgress.visitedHexIds, currentTile]);

  // View mode: scenic illustrated view vs high-contrast tactical view
  const [viewMode, setViewMode] = useState<'scenic' | 'tactical'>('scenic');
  // Dimension mode: 3D Three.js Interactive WebGL Map vs 2D Tactical Grid
  const [mapDimensionMode, setMapDimensionMode] = useState<'3d' | '2d'>('3d');

  // World Theme Aesthetics Config
  const themeConfig = useMemo(() => {
    switch (world.themeStyle) {
      case 'war':
        return {
          bgGradient: 'from-slate-950 via-stone-900 to-neutral-950',
          boardBorder: 'border-emerald-700/60 shadow-[0_0_35px_rgba(16,185,129,0.2)]',
          radarColor: '#10b981',
          compassColor: 'text-emerald-400',
          accentBadge: 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300',
          ringStroke: 'stroke-emerald-500/30',
          ringDash: '4,4',
          crosshairStroke: 'stroke-emerald-500/40',
          themeLabel: 'RADAR TÁCTICO MILITAR',
          themeIcon: Radio,
          patternId: 'pattern-war-camo',
          auraColor: '#10b981',
          compassLabels: ['000° NORTE', '090° ESTE (FLANCO)', '180° SUR (HQ BASE)', '270° OESTE (FLANCO)']
        };
      case 'space':
        return {
          bgGradient: 'from-slate-950 via-indigo-950/90 to-purple-950',
          boardBorder: 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.25)]',
          radarColor: '#06b6d4',
          compassColor: 'text-cyan-400',
          accentBadge: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300',
          ringStroke: 'stroke-cyan-400/30',
          ringDash: '6,3',
          crosshairStroke: 'stroke-cyan-400/40',
          themeLabel: 'ÓRBITAS GRAVITACIONALES',
          themeIcon: Compass,
          patternId: 'pattern-space-nebula',
          auraColor: '#06b6d4',
          compassLabels: ['000° ZENIT ESTELAR', '090° ECLÍPTICA', '180° NÓDULO DE SALTO', '270° PERIGEO']
        };
      case 'zombie':
        return {
          bgGradient: 'from-neutral-950 via-stone-900 to-zinc-950',
          boardBorder: 'border-lime-700/60 shadow-[0_0_35px_rgba(132,204,22,0.2)]',
          radarColor: '#84cc16',
          compassColor: 'text-lime-400',
          accentBadge: 'bg-stone-900/90 border-lime-600/60 text-lime-400',
          ringStroke: 'stroke-lime-500/30',
          ringDash: '3,3',
          crosshairStroke: 'stroke-lime-500/35',
          themeLabel: 'PERÍMETRO DE BIOSEGURIDAD',
          themeIcon: Crosshair,
          patternId: 'pattern-zombie-toxic',
          auraColor: '#84cc16',
          compassLabels: ['000° ZONA CERO', '090° CUARENTENA E.', '180° REFUGIO SEGURO', '270° CUARENTENA O.']
        };
      case 'cyberpunk':
        return {
          bgGradient: 'from-slate-950 via-purple-950/80 to-pink-950/80',
          boardBorder: 'border-fuchsia-500/60 shadow-[0_0_45px_rgba(217,70,239,0.3)]',
          radarColor: '#d946ef',
          compassColor: 'text-fuchsia-400',
          accentBadge: 'bg-fuchsia-950/80 border-fuchsia-500/60 text-fuchsia-300',
          ringStroke: 'stroke-fuchsia-400/35',
          ringDash: '8,4',
          crosshairStroke: 'stroke-cyan-400/45',
          themeLabel: 'MATRIZ CIBERNÉTICA RADIAL',
          themeIcon: Eye,
          patternId: 'pattern-cyber-matrix',
          auraColor: '#d946ef',
          compassLabels: ['000° BUS MAESTRO', '090° SUB-RED ALFA', '180° PUERTO JACK-IN', '270° FIREWALL OESTE']
        };
      case 'animals':
        return {
          bgGradient: 'from-stone-950 via-emerald-950/80 to-teal-950',
          boardBorder: 'border-amber-600/60 shadow-[0_0_35px_rgba(217,119,6,0.25)]',
          radarColor: '#f59e0b',
          compassColor: 'text-amber-400',
          accentBadge: 'bg-emerald-950/90 border-amber-500/60 text-amber-300',
          ringStroke: 'stroke-amber-400/35',
          ringDash: '5,5',
          crosshairStroke: 'stroke-amber-500/35',
          themeLabel: 'MANDALA DRUÍDICO SAGRADO',
          themeIcon: Compass,
          patternId: 'pattern-animals-roots',
          auraColor: '#f59e0b',
          compassLabels: ['000° SOL ZENITAL', '090° BOSQUE DEL ESTE', '180° SANTUARIO RAIZ', '270° RÍO ANCESTRAL']
        };
      default: // medieval
        return {
          bgGradient: 'from-slate-950 via-slate-900 to-amber-950/40',
          boardBorder: 'border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)]',
          radarColor: '#f59e0b',
          compassColor: 'text-amber-400',
          accentBadge: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
          ringStroke: 'stroke-amber-400/30',
          ringDash: '6,4',
          crosshairStroke: 'stroke-amber-400/40',
          themeLabel: 'CÍRCULO REAL DEL FEUDO',
          themeIcon: Crown,
          patternId: 'pattern-medieval-stone',
          auraColor: '#f59e0b',
          compassLabels: ['000° SEPTENTRIO (NORTE)', '090° ORIENS (ESTE)', '180° MERIDIES (ACCESO)', '270° OCCIDENS (OESTE)']
        };
    }
  }, [world.themeStyle]);

  // Total stages cleared in this world
  const clearedStagesCount = useMemo(() => {
    return world.stages.filter(
      (s) =>
        saveState.completedStages?.[s.id]?.completed ||
        saveState.stages?.[s.id]?.completed
    ).length;
  }, [world.stages, saveState.completedStages, saveState.stages]);

  return (
    <div
      id="world-hex-map-container"
      className="w-full flex flex-col gap-4 text-slate-100 max-w-7xl mx-auto"
    >
      {/* Top World Header Bar with Navigation and Keys Counter */}
      <div
        id="hex-map-top-bar"
        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl"
      >
        {/* World Selector Arrows */}
        <div className="flex items-center gap-3">
          <button
            id="hex-prev-world-btn"
            onClick={onPrevWorld}
            disabled={!hasPrevWorld}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
              hasPrevWorld
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
                : 'bg-slate-900/50 text-slate-600 border-slate-800/80 cursor-not-allowed'
            }`}
            title="Mundo Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Mundo {world.worldNumber} de {totalWorldsCount}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {themeConfig.themeLabel}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {world.name}
            </h2>
          </div>

          <button
            id="hex-next-world-btn"
            onClick={onNextWorld}
            disabled={!hasNextWorld}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
              hasNextWorld
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
                : 'bg-slate-900/50 text-slate-600 border-slate-800/80 cursor-not-allowed'
            }`}
            title="Mundo Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tactical Status Badges: Keys, Stages Cleared & Boss Status */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Keys Collector HUD */}
          <div
            id="hex-keys-hud-badge"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-sm transition-all ${
              hasAllKeys
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-slate-800/90 border-slate-700 text-slate-300'
            }`}
          >
            <Key className={`w-4 h-4 ${hasAllKeys ? 'text-amber-300' : 'text-amber-400'}`} />
            <span>
              Llaves Místicas: {keysCollectedCount} / {requiredKeys}
            </span>
            {hasAllKeys ? (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                ¡LISTO!
              </span>
            ) : (
              <span className="text-xs text-amber-400/80 font-normal">
                (Faltan {requiredKeys - keysCollectedCount})
              </span>
            )}
          </div>

          {/* Stages Cleared Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-sm font-semibold">
            <Swords className="w-4 h-4 text-rose-400" />
            <span>
              Duelos: {clearedStagesCount}/{world.stages.length}
            </span>
          </div>

          {/* Boss Portal Status */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
              isBossDefeated
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                : hasAllKeys
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            {isBossDefeated ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Jefe Derrotado</span>
              </>
            ) : hasAllKeys ? (
              <>
                <Unlock className="w-4 h-4 text-amber-400" />
                <span>Puerta Central Abierta</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Puerta Sellada</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Hex Map Layout: 3D Three.js / 2D SVG Canvas & Tactical Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Hex Map Display (3D Three.js or 2D SVG) */}
        <div className="lg:col-span-8 w-full flex flex-col gap-3">
          {/* Top Engine & Mode Toggle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 px-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping`} style={{ backgroundColor: themeConfig.radarColor }} />
              <span style={{ color: themeConfig.radarColor }}>{themeConfig.themeLabel}</span>
            </div>

            {/* 3D vs 2D Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
              <button
                id="toggle-3d-map-btn"
                onClick={() => {
                  setMapDimensionMode('3d');
                  soundSystem.play('select');
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  mapDimensionMode === '3d'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Three.js</span>
              </button>

              <button
                id="toggle-2d-map-btn"
                onClick={() => {
                  setMapDimensionMode('2d');
                  soundSystem.play('select');
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  mapDimensionMode === '2d'
                    ? 'bg-sky-600 text-white font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>2D Clásico</span>
              </button>
            </div>
          </div>

          {/* Render 3D Canvas or 2D SVG */}
          {mapDimensionMode === '3d' ? (
            <HexMapThreeCanvas
              world={world}
              hexMap={hexMap}
              saveState={saveState}
              worldHexProgress={worldHexProgress}
              selectedHexId={selectedHexId}
              onSelectHex={(tile) => handleHexClick(tile)}
              onMoveToHex={(tile) => handleMoveToTile(tile)}
              onStartStage={(stage) => handleLaunchStage(stage)}
            />
          ) : (
            <div
              id="hex-canvas-wrapper"
              className={`w-full relative rounded-3xl overflow-hidden bg-gradient-to-b ${themeConfig.bgGradient} border ${themeConfig.boardBorder} p-3 sm:p-5 flex flex-col items-center justify-center min-h-[560px]`}
            >
              {/* Subtle Circular Radial Backdrop & Mode Toggle */}
              <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950/80 to-black" />

              {/* Top Canvas Controls: View Mode Selector & Theme Indicator */}
              <div className="w-full flex items-center justify-between z-20 mb-2 px-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <span className={`w-2 h-2 rounded-full animate-ping`} style={{ backgroundColor: themeConfig.radarColor }} />
                  <span style={{ color: themeConfig.radarColor }}>{themeConfig.themeLabel}</span>
                </div>

                {/* View Mode Toggle: Escénico vs Radar */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-xs font-semibold">
                  <button
                    onClick={() => setViewMode('scenic')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                      viewMode === 'scenic'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Modo Escénico</span>
                  </button>
                  <button
                    onClick={() => setViewMode('tactical')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                      viewMode === 'tactical'
                        ? 'bg-sky-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Radar Táctico</span>
                  </button>
                </div>
              </div>

              {/* Interactive SVG Hexagonal Board */}
              <svg
                id="circular-hex-world-svg"
                viewBox="0 0 720 680"
                className="w-full h-auto max-w-[680px] drop-shadow-2xl select-none relative z-10"
                style={{ touchAction: 'manipulation' }}
              >
            <defs>
              {/* Radial Gradients for Themed Circular Rings */}
              <radialGradient id="centralAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={themeConfig.auraColor} stopOpacity="0.3" />
                <stop offset="70%" stopColor={themeConfig.auraColor} stopOpacity="0.08" />
                <stop offset="100%" stopColor={themeConfig.auraColor} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="bossGateActiveAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heroGlowAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>

              {/* --- GENRE SPECIFIC SVG TEXTURE PATTERNS --- */}
              {/* 1. Medieval Stone Masonry */}
              <pattern id="pattern-medieval-stone" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill="#1e293b" />
                <path d="M0,6 L24,6 M0,18 L24,18 M12,0 L12,6 M6,6 L6,18 M18,6 L18,18 M12,18 L12,24" stroke="#475569" strokeWidth="0.8" opacity="0.4" />
                <circle cx="12" cy="12" r="1.5" fill="#f59e0b" opacity="0.3" />
              </pattern>

              {/* 2. War Camouflage Hex Grid */}
              <pattern id="pattern-war-camo" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#141c18" />
                <path d="M0,10 L20,10 M10,0 L10,20 M0,0 L20,20 M20,0 L0,20" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
                <circle cx="10" cy="10" r="2" fill="#10b981" opacity="0.2" />
              </pattern>

              {/* 3. Space Starlight Grid */}
              <pattern id="pattern-space-nebula" width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill="#090a1a" />
                <circle cx="5" cy="5" r="1" fill="#38bdf8" opacity="0.8" />
                <circle cx="22" cy="18" r="0.8" fill="#c084fc" opacity="0.7" />
                <circle cx="15" cy="28" r="1.2" fill="#ffffff" opacity="0.9" />
                <path d="M5,5 L22,18" stroke="#06b6d4" strokeWidth="0.4" strokeDasharray="2,3" opacity="0.35" />
              </pattern>

              {/* 4. Zombie Biohazard Honeycomb */}
              <pattern id="pattern-zombie-toxic" width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="#171912" />
                <path d="M9,0 L18,5 L18,15 L9,20 L0,15 L0,5 Z" fill="none" stroke="#65a30d" strokeWidth="0.7" opacity="0.35" />
                <circle cx="9" cy="10" r="1.5" fill="#84cc16" opacity="0.4" />
              </pattern>

              {/* 5. Cyberpunk Circuit Traces */}
              <pattern id="pattern-cyber-matrix" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill="#130a1e" />
                <path d="M0,12 L8,12 L14,6 L24,6 M12,0 L12,8 L18,14 L18,24" stroke="#d946ef" strokeWidth="0.8" opacity="0.4" />
                <rect x="7" y="11" width="2" height="2" fill="#06b6d4" />
                <rect x="17" y="13" width="2" height="2" fill="#e879f9" />
              </pattern>

              {/* 6. Animals Druidic Roots & Leaves */}
              <pattern id="pattern-animals-roots" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill="#0c1a14" />
                <path d="M0,24 Q12,12 24,0 M0,0 Q12,12 24,24" stroke="#059669" strokeWidth="0.8" opacity="0.35" />
                <circle cx="12" cy="12" r="2" fill="#f59e0b" opacity="0.35" />
              </pattern>

              {/* Linear Gradients for Hexagon Tile Faces */}
              <linearGradient id="tileGrad-start" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              <linearGradient id="tileGrad-path" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>

              <linearGradient id="tileGrad-key_shrine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <linearGradient id="tileGrad-treasure" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              <linearGradient id="tileGrad-battle_reward" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>

              <linearGradient id="tileGrad-battle_no_reward" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              <linearGradient id="tileGrad-boss_gate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>

              <linearGradient id="tileGrad-boss_gate_unlocked" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>

              <linearGradient id="tileGrad-rest_camp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>

              <linearGradient id="tileGrad-blocking" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#171717" />
              </linearGradient>
            </defs>

            {/* --- GENRE SPECIFIC SCENIC BACKDROP LAYER --- */}
            {viewMode === 'scenic' && (
              <g id="genre-scenic-backdrop" opacity="0.35">
                {world.themeStyle === 'medieval' && (
                  <g id="medieval-scenic-elements">
                    {/* Distant Castle Towers & Battlements */}
                    <path d="M180,180 L200,140 L220,180 L230,170 L240,180 L260,130 L280,180 Z" fill="#475569" />
                    <path d="M440,180 L460,130 L480,180 L500,150 L520,180 Z" fill="#475569" />
                    <circle cx="210" cy="135" r="3" fill="#f59e0b" className="animate-pulse" />
                    <circle cx="470" cy="125" r="3" fill="#f59e0b" className="animate-pulse" />
                    {/* Heraldic Shield Vectors */}
                    <path d="M360,60 L375,70 L375,90 Q360,105 360,110 Q360,105 345,90 L345,70 Z" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>
                )}

                {world.themeStyle === 'war' && (
                  <g id="war-scenic-elements">
                    {/* Trench Silhouettes & Radar Sweep */}
                    <path d="M120,240 L160,230 L220,250 L280,235 L340,245" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
                    <path d="M400,245 L460,235 L520,250 L580,230 L620,240" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
                    {/* Crosshair Target Rings */}
                    <circle cx="360" cy="340" r="310" fill="none" stroke="#10b981" strokeWidth="0.8" strokeDasharray="8,8" />
                    <line x1="360" y1="20" x2="360" y2="660" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4,6" />
                    <line x1="20" y1="340" x2="700" y2="340" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4,6" />
                  </g>
                )}

                {world.themeStyle === 'space' && (
                  <g id="space-scenic-elements">
                    {/* Celestial Galaxy Spiral & Orbit Arcs */}
                    <ellipse cx="360" cy="340" rx="320" ry="160" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6,4" transform="rotate(-25 360 340)" />
                    <ellipse cx="360" cy="340" rx="260" ry="110" fill="none" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="4,4" transform="rotate(35 360 340)" />
                    {/* Distant Planets */}
                    <circle cx="160" cy="140" r="16" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1" />
                    <ellipse cx="160" cy="140" rx="24" ry="6" fill="none" stroke="#38bdf8" strokeWidth="0.8" transform="rotate(-20 160 140)" />
                    <circle cx="580" cy="520" r="22" fill="#3b0764" stroke="#e879f9" strokeWidth="1" />
                  </g>
                )}

                {world.themeStyle === 'zombie' && (
                  <g id="zombie-scenic-elements">
                    {/* Ruined City Silhouettes & Bio-Smoke */}
                    <path d="M140,220 L160,180 L180,180 L190,220 L240,160 L260,160 L280,220 Z" fill="#292524" />
                    <path d="M460,220 L480,150 L510,150 L530,220 L560,180 L580,220 Z" fill="#292524" />
                    <circle cx="210" cy="140" r="15" fill="#84cc16" opacity="0.15" />
                    <circle cx="520" cy="130" r="20" fill="#84cc16" opacity="0.15" />
                    {/* Biohazard Symbol Watermark */}
                    <circle cx="360" cy="340" r="18" fill="none" stroke="#84cc16" strokeWidth="1.5" />
                  </g>
                )}

                {world.themeStyle === 'cyberpunk' && (
                  <g id="cyberpunk-scenic-elements">
                    {/* Neon Grid Floor & Tower Outlines */}
                    <path d="M140,240 L140,140 L190,140 L190,240 M530,240 L530,130 L580,130 L580,240" stroke="#d946ef" strokeWidth="1" fill="none" />
                    {/* Matrix Hex Wireframes */}
                    <line x1="40" y1="580" x2="680" y2="580" stroke="#06b6d4" strokeWidth="0.8" />
                    <line x1="80" y1="620" x2="640" y2="620" stroke="#06b6d4" strokeWidth="0.8" />
                    <line x1="120" y1="650" x2="600" y2="650" stroke="#06b6d4" strokeWidth="0.8" />
                  </g>
                )}

                {world.themeStyle === 'animals' && (
                  <g id="animals-scenic-elements">
                    {/* Giant Jungle Trees & Druidic Mandala Leaves */}
                    <path d="M160,260 Q130,180 180,120 Q220,180 200,260 Z" fill="#065f46" opacity="0.6" />
                    <path d="M540,260 Q510,170 560,110 Q600,170 580,260 Z" fill="#065f46" opacity="0.6" />
                    <circle cx="180" cy="120" r="4" fill="#fbbf24" className="animate-ping" />
                    <circle cx="560" cy="110" r="4" fill="#fbbf24" className="animate-ping" />
                  </g>
                )}
              </g>
            )}

            {/* --- CONCENTRIC BACKGROUND RINGS & THEMATIC RADIAL MARKERS --- */}
            <g id="bg-concentric-circles" opacity="0.6">
              {/* Radial Center Ambient Glow */}
              <circle cx={ORIGIN_X} cy={ORIGIN_Y} r={280} fill="url(#centralAura)" />

              {/* Ring Radii: R1=59, R2=118, R3=177, R4=236 */}
              <circle
                cx={ORIGIN_X}
                cy={ORIGIN_Y}
                r={59}
                fill="none"
                className={themeConfig.ringStroke}
                strokeWidth="1.2"
                strokeDasharray={themeConfig.ringDash}
              />
              <circle
                cx={ORIGIN_X}
                cy={ORIGIN_Y}
                r={118}
                fill="none"
                className={themeConfig.ringStroke}
                strokeWidth="1.2"
                strokeDasharray={themeConfig.ringDash}
              />
              <circle
                cx={ORIGIN_X}
                cy={ORIGIN_Y}
                r={177}
                fill="none"
                className={themeConfig.ringStroke}
                strokeWidth="1.5"
                strokeDasharray={themeConfig.ringDash}
              />
              <circle
                cx={ORIGIN_X}
                cy={ORIGIN_Y}
                r={236}
                fill="none"
                className={themeConfig.ringStroke}
                strokeWidth="1.8"
                strokeDasharray="8,4"
              />
              <circle
                cx={ORIGIN_X}
                cy={ORIGIN_Y}
                r={275}
                fill="none"
                className={themeConfig.ringStroke}
                strokeWidth="0.8"
                opacity="0.4"
              />

              {/* Radial Compass Rays (Every 60 degrees) */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x2 = ORIGIN_X + 270 * Math.cos(rad);
                const y2 = ORIGIN_Y + 270 * Math.sin(rad);
                return (
                  <line
                    key={`ray-${deg}`}
                    x1={ORIGIN_X}
                    y1={ORIGIN_Y}
                    x2={x2}
                    y2={y2}
                    className={themeConfig.crosshairStroke}
                    strokeWidth="0.8"
                    strokeDasharray="4,6"
                  />
                );
              })}

              {/* Thematic Radial Degree / Coordinates Text */}
              <text
                x={ORIGIN_X}
                y={ORIGIN_Y - 285}
                textAnchor="middle"
                fill={themeConfig.radarColor}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="2"
                opacity="0.8"
              >
                {themeConfig.compassLabels[0]}
              </text>
              <text
                x={ORIGIN_X + 295}
                y={ORIGIN_Y + 4}
                textAnchor="start"
                fill={themeConfig.radarColor}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="2"
                opacity="0.8"
              >
                {themeConfig.compassLabels[1]}
              </text>
              <text
                x={ORIGIN_X}
                y={ORIGIN_Y + 298}
                textAnchor="middle"
                fill={themeConfig.radarColor}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="2"
                opacity="0.8"
              >
                {themeConfig.compassLabels[2]}
              </text>
              <text
                x={ORIGIN_X - 295}
                y={ORIGIN_Y + 4}
                textAnchor="end"
                fill={themeConfig.radarColor}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="2"
                opacity="0.8"
              >
                {themeConfig.compassLabels[3]}
              </text>
            </g>

            {/* --- PATHWAY CONNECTOR LINES BETWEEN ADJACENT TILES --- */}
            <g id="hex-pathways-layer">
              {renderedConnections.map((conn) => {
                const isAdjacentToHero = conn.isTraversed === 2;
                const isBothVisited = conn.isTraversed === 1;

                return (
                  <line
                    key={conn.id}
                    x1={conn.x1}
                    y1={conn.y1}
                    x2={conn.x2}
                    y2={conn.y2}
                    stroke={
                      isAdjacentToHero
                        ? '#38bdf8'
                        : isBothVisited
                        ? '#e2e8f0'
                        : '#475569'
                    }
                    strokeWidth={isAdjacentToHero ? 3.5 : isBothVisited ? 2.5 : 1.2}
                    strokeDasharray={isBothVisited || isAdjacentToHero ? undefined : '3,3'}
                    strokeOpacity={isAdjacentToHero ? 0.9 : isBothVisited ? 0.6 : 0.25}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* --- HEXAGON TILES RENDERING --- */}
            <g id="hex-tiles-layer">
              {hexMap.tiles.map((tile) => {
                const q = tile.q ?? tile.col;
                const r = tile.r ?? tile.row;
                const { x: cx, y: cy } = getHexCenter(q, r);
                const isDiscovered = discoveredTileIds.has(tile.id);
                const isVisited = worldHexProgress.visitedHexIds.includes(tile.id);
                const isHeroCurrent = currentTile?.id === tile.id;
                const isSelected = selectedTile?.id === tile.id;
                const isReachable = reachableTileIds.has(tile.id) && tile.type !== 'blocking';
                const isKeyCollected = (worldHexProgress.collectedKeyHexIds || []).includes(tile.id);
                const isTreasureClaimed = (worldHexProgress.collectedTreasureHexIds || worldHexProgress.claimedTreasureIds || []).includes(tile.id);
                const isSkirmishCleared = (worldHexProgress.clearedSkirmishHexIds || worldHexProgress.clearedBattleHexIds || []).includes(tile.id);
                const isStageComplete = tile.stageId
                  ? (saveState.completedStages?.[tile.stageId]?.completed || saveState.stages?.[tile.stageId]?.completed || false)
                  : false;

                // Base Polygon Points
                const polyPoints = getHexPolygonPoints(cx, cy, HEX_RADIUS - 1.5);
                const innerPolyPoints = getHexPolygonPoints(cx, cy, HEX_RADIUS - 5.5);

                // Tile Stroke & Fill Configuration
                let fillGradient = `url(#tileGrad-${tile.type})`;
                let strokeColor = '#334155';
                let strokeWidth = 1.5;

                if (tile.type === 'boss_gate') {
                  fillGradient = hasAllKeys
                    ? 'url(#tileGrad-boss_gate_unlocked)'
                    : 'url(#tileGrad-boss_gate)';
                  strokeColor = hasAllKeys ? '#fbbf24' : '#c084fc';
                  strokeWidth = 2.5;
                } else if (tile.type === 'start') {
                  strokeColor = '#34d399';
                  strokeWidth = 2;
                } else if (tile.type === 'key_shrine') {
                  strokeColor = isKeyCollected ? '#64748b' : '#fbbf24';
                  strokeWidth = isKeyCollected ? 1.5 : 2.5;
                } else if (tile.type === 'treasure') {
                  strokeColor = isTreasureClaimed ? '#64748b' : '#facc15';
                  strokeWidth = 2;
                } else if (tile.type === 'battle_reward') {
                  strokeColor = isStageComplete ? '#10b981' : '#f87171';
                  strokeWidth = isStageComplete ? 2 : 2.5;
                }

                if (isSelected) {
                  strokeColor = '#ffffff';
                  strokeWidth = 3.5;
                } else if (isReachable && !isHeroCurrent) {
                  strokeColor = '#38bdf8';
                  strokeWidth = 2.5;
                }

                return (
                  <g
                    key={tile.id}
                    id={`hex-tile-${tile.id}`}
                    onClick={() => handleHexClick(tile)}
                    className="cursor-pointer transition-all duration-200 hover:brightness-125"
                    opacity={isDiscovered ? 1 : 0.3}
                  >
                    {/* Pulsing Aura under Hero or Active Boss */}
                    {isHeroCurrent && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={HEX_RADIUS + 10}
                        fill="url(#heroGlowAura)"
                        className="animate-pulse"
                      />
                    )}

                    {tile.type === 'boss_gate' && hasAllKeys && !isStageComplete && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={HEX_RADIUS + 14}
                        fill="url(#bossGateActiveAura)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer Hexagon Face */}
                    <polygon
                      points={polyPoints}
                      fill={fillGradient}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className={`transition-all duration-200 ${
                        isReachable && !isHeroCurrent ? 'animate-pulse' : ''
                      }`}
                    />

                    {/* Subtle Inner Pattern Fill on discovered tiles */}
                    {isDiscovered && (
                      <polygon
                        points={polyPoints}
                        fill={`url(#${themeConfig.patternId})`}
                        opacity="0.18"
                        pointerEvents="none"
                      />
                    )}

                    {/* Subtle Inner Bevel / Inset Hexagon */}
                    <polygon
                      points={innerPolyPoints}
                      fill="none"
                      stroke={isVisited ? '#ffffff' : '#94a3b8'}
                      strokeWidth={0.7}
                      strokeOpacity={isVisited ? 0.35 : 0.15}
                    />

                    {/* Fog of War question mark if not fully discovered */}
                    {!isDiscovered ? (
                      <text
                        x={cx}
                        y={cy + 5}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        ?
                      </text>
                    ) : (
                      <>
                        {/* Tile Specific Icons / Emblems */}
                        {tile.type === 'boss_gate' && (
                          <g>
                            <text
                              x={cx}
                              y={cy + (hasAllKeys ? 5 : 4)}
                              textAnchor="middle"
                              fontSize="18"
                            >
                              {hasAllKeys ? '👑' : '🔒'}
                            </text>
                            {isStageComplete && (
                              <text
                                x={cx + 12}
                                y={cy - 12}
                                textAnchor="middle"
                                fontSize="12"
                              >
                                ⭐
                              </text>
                            )}
                          </g>
                        )}

                        {tile.type === 'start' && (
                          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="16">
                            🚩
                          </text>
                        )}

                        {tile.type === 'key_shrine' && (
                          <g>
                            <text
                              x={cx}
                              y={cy + 5}
                              textAnchor="middle"
                              fontSize="16"
                              className={!isKeyCollected ? 'animate-bounce' : ''}
                            >
                              {isKeyCollected ? '✨' : '🗝️'}
                            </text>
                          </g>
                        )}

                        {tile.type === 'treasure' && (
                          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="16">
                            {isTreasureClaimed ? '📦' : '🎁'}
                          </text>
                        )}

                        {tile.type === 'battle_reward' && (
                          <g>
                            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="15">
                              ⚔️
                            </text>
                            {isStageComplete && (
                              <text
                                x={cx + 11}
                                y={cy - 11}
                                textAnchor="middle"
                                fontSize="11"
                              >
                                ⭐
                              </text>
                            )}
                          </g>
                        )}

                        {tile.type === 'battle_no_reward' && (
                          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14">
                            {isSkirmishCleared ? '✔️' : '🗡️'}
                          </text>
                        )}

                        {tile.type === 'rest_camp' && (
                          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="15">
                            {tile.icon || '⛺'}
                          </text>
                        )}

                        {tile.type === 'blocking' && (
                          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14">
                            {tile.icon || '⛰️'}
                          </text>
                        )}

                        {tile.type === 'path' && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isVisited ? 4 : 2.5}
                            fill={isVisited ? '#38bdf8' : '#94a3b8'}
                            opacity={isVisited ? 0.9 : 0.5}
                          />
                        )}

                        {/* Hero Pawn Avatar Indicator on Current Hex */}
                        {isHeroCurrent && (
                          <g id="hero-token-pawn">
                            <circle
                              cx={cx}
                              cy={cy - 1}
                              r={16}
                              fill="#0284c7"
                              stroke="#ffffff"
                              strokeWidth={2}
                              className="animate-pulse"
                            />
                            <text
                              x={cx}
                              y={cy + 4}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="13"
                              fontWeight="black"
                            >
                              ♟️
                            </text>
                          </g>
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Quick Legend at bottom of canvas */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>♟️</span>
              <span className="font-medium text-slate-300">Posición Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🗝️</span>
              <span className="text-amber-400 font-medium">Llave Mística</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>⚔️</span>
              <span className="text-rose-400 font-medium">Duelo Táctico</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🎁</span>
              <span className="text-yellow-400 font-medium">Cofre de Oro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>👑</span>
              <span className="text-purple-300 font-medium">Sagrario del Jefe</span>
            </div>
          </div>
        </div>
        )}
      </div>

        {/* Tactical Inspector & Stage Action Sidebar */}
        <div
          id="hex-inspector-panel"
          className="lg:col-span-4 flex flex-col gap-4 p-5 rounded-3xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Inspector de Casilla
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              Anillo {selectedTile.ring ?? (selectedTile.q === 0 && selectedTile.r === 0 ? 0 : 3)}
            </span>
          </div>

          {/* Selected Tile Thematic Visual Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col gap-3 relative overflow-hidden">
            {/* Background Texture Tint */}
            <div className="absolute inset-0 opacity-10 bg-repeat pointer-events-none" style={{ backgroundImage: `radial-gradient(${themeConfig.radarColor} 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                  {selectedTile.icon || (selectedTile.type === 'boss_gate' ? '👑' : selectedTile.type === 'key_shrine' ? '🗝️' : selectedTile.type === 'battle_reward' ? '⚔️' : selectedTile.type === 'treasure' ? '🎁' : '📍')}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    {selectedTile.type === 'boss_gate'
                      ? 'Puerta del Jefe Supremo'
                      : selectedTile.type === 'key_shrine'
                      ? 'Altar de Llave Mística'
                      : selectedTile.type === 'battle_reward'
                      ? 'Duelo de Fase Táctica'
                      : selectedTile.type === 'battle_no_reward'
                      ? 'Escaramuza de Entrenamiento'
                      : selectedTile.type === 'treasure'
                      ? 'Cofre de Recompensas'
                      : selectedTile.type === 'start'
                      ? 'Punto de Despliegue'
                      : selectedTile.type === 'blocking'
                      ? 'Obstáculo Infranqueable'
                      : selectedTile.type === 'rest_camp'
                      ? 'Zona de Descanso'
                      : 'Sendero Transitable'}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedTile.name}
                  </h4>
                </div>
              </div>

              {/* Status Pill */}
              {selectedTile.id === currentTile?.id ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-sky-950 border border-sky-500 text-sky-300 font-bold shrink-0">
                  Aquí
                </span>
              ) : worldHexProgress.visitedHexIds.includes(selectedTile.id) ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                  Explorado
                </span>
              ) : reachableTileIds.has(selectedTile.id) ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold animate-pulse shrink-0">
                  Al Alcance
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-500 shrink-0">
                  Distante
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed relative z-10">
              {selectedTile.description}
            </p>

            {/* Blocking Alert */}
            {selectedTile.type === 'blocking' && (
              <div className="mt-1 p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 flex items-center gap-2 text-xs text-rose-300 relative z-10">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  <strong>Bloqueo:</strong> {selectedTile.blockingReason || 'Terreno impenetrable.'}
                </span>
              </div>
            )}
          </div>

          {/* Stage Details (if battle) */}
          {selectedTile.stage && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Duelo Táctico
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  ELO {selectedTile.stage.bossElo}
                </span>
              </div>

              <div>
                <h5 className="text-sm font-bold text-white">
                  Oponente: {selectedTile.stage.bossName}
                </h5>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedTile.stage.bossTitle} • {selectedTile.stage.difficulty}
                </p>
              </div>

              {/* Stage Rewards */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                  +{selectedTile.stage.rewardGold} Oro
                </span>
                <span className="px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 font-semibold">
                  +{selectedTile.stage.rewardXp} XP
                </span>
                {(saveState.completedStages?.[selectedTile.stage.id]?.completed ||
                  saveState.stages?.[selectedTile.stage.id]?.completed) && (
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Superado
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons: Move / Launch Battle / Collect */}
          <div className="flex flex-col gap-2.5 mt-auto pt-2">
            {/* If tile is adjacent and not hero's current tile, allow Move */}
            {reachableTileIds.has(selectedTile.id) &&
              selectedTile.id !== currentTile?.id &&
              selectedTile.type !== 'blocking' && (
                <button
                  id="hex-move-btn"
                  onClick={() => handleMoveToTile(selectedTile)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Footprints className="w-4 h-4" />
                  Moverse a este Hexágono
                </button>
              )}

            {/* Launch Battle Stage */}
            {selectedTile.stage && (
              <button
                id="hex-start-stage-btn"
                onClick={() => handleLaunchStage(selectedTile.stage!)}
                disabled={
                  selectedTile.type === 'boss_gate' && !hasAllKeys && !isBossDefeated
                }
                className={`w-full py-3 px-4 rounded-xl font-black text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 active:scale-98 ${
                  selectedTile.type === 'boss_gate' && !hasAllKeys
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <Swords className="w-4 h-4" />
                {selectedTile.type === 'boss_gate' && !hasAllKeys
                  ? `Requiere ${requiredKeys} Llaves Místicas (${keysCollectedCount}/${requiredKeys})`
                  : saveState.completedStages?.[selectedTile.stage.id]?.completed ||
                    saveState.stages?.[selectedTile.stage.id]?.completed
                  ? 'Rejugar Duelo'
                  : 'Desafiar en Tablero'}
              </button>
            )}

            {/* Launch Skirmish Mini-Puzzle */}
            {selectedTile.type === 'battle_no_reward' && (
              <button
                id="hex-skirmish-btn"
                onClick={() => handleOpenSkirmish(selectedTile)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                {(worldHexProgress.clearedSkirmishHexIds || []).includes(selectedTile.id)
                  ? 'Reentrenar Escaramuza Rápida'
                  : 'Resolver Escaramuza Táctica'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skirmish Mini-Puzzle Modal */}
      {skirmishTile && (
        <div
          id="skirmish-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold">
                  Escaramuza: {QUICK_SKIRMISH_PUZZLES[skirmishPuzzleIdx].title}
                </h3>
              </div>
              <button
                onClick={() => setSkirmishTile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300">
              {QUICK_SKIRMISH_PUZZLES[skirmishPuzzleIdx].hint}
            </p>

            {/* Move options */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold uppercase text-slate-400">
                Elige la mejor jugada para el bando en juego:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {['dxe4', 'Qe2', 'Nxd4', 'Bg5', 'Re1', 'Nf3'].map((move) => (
                  <button
                    key={move}
                    onClick={() => handleSolveSkirmish(move)}
                    disabled={skirmishSolved}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-mono font-bold transition ${
                      skirmishSelectedMove === move
                        ? QUICK_SKIRMISH_PUZZLES[skirmishPuzzleIdx].solutionSan.includes(move)
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    {move}
                  </button>
                ))}
              </div>
            </div>

            {skirmishSolved && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-sm font-semibold flex items-center justify-between">
                <span>¡Excelente jugada! Escaramuza completada.</span>
                <button
                  onClick={() => setSkirmishTile(null)}
                  className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
