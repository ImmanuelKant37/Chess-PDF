import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { HexTileData, HexWorldMap } from '../types/hexMap';
import { AdventureWorld, AdventureStage, AdventureSaveState, WorldHexProgressState } from '../types/adventure';
import { soundSystem } from '../utils/chessAudio';
import {
  Compass,
  Sparkles,
  RotateCcw,
  Target,
  Crown,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface HexMapThreeCanvasProps {
  world: AdventureWorld;
  hexMap: HexWorldMap;
  saveState: AdventureSaveState;
  worldHexProgress: WorldHexProgressState;
  selectedHexId: string;
  onSelectHex: (tile: HexTileData) => void;
  onMoveToHex: (tile: HexTileData) => void;
  onStartStage: (stage: AdventureStage) => void;
}

// Math constants for 3D Axial Hex Grid
const HEX_SPACING_R = 3.2; // 3D distance unit per hexagon step
const HEX_RADIUS = 1.82;   // 3D Hexagon outer radius (top/bottom)
const HEX_HEIGHT = 0.55;   // Base 3D tile thickness

// Axial (q, r) to 3D World (X, Z) conversion for pointy-topped hexes
function axialTo3DWorld(q: number, r: number): { x: number; z: number } {
  const x = HEX_SPACING_R * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const z = HEX_SPACING_R * (1.5 * r);
  return { x, z };
}

// Axial distance helper: distance === 1 means adjacent in the circular hex grid
function getAxialDistance(a: { q: number; r: number }, b: { q: number; r: number }): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs((a.q + a.r) - (b.q + b.r))) / 2;
}

// Helper to determine theme colors for 3D materials and lights
interface Theme3DConfig {
  bgColor: number;
  fogColor: number;
  fogDensity: number;
  ambientLightColor: number;
  ambientLightIntensity: number;
  dirLightColor: number;
  dirLightIntensity: number;
  groundGridColor: number;
  groundCenterColor: number;
  particleColor1: number;
  particleColor2: number;
  particleCount: number;
  particleSpeed: number;
  heroAuraColor: number;
  bossCoreColor: number;
  bossCoreUnlockedColor: number;
  tileEdgeColor: number;
}

function getTheme3DConfig(themeStyle: string): Theme3DConfig {
  switch (themeStyle) {
    case 'war':
      return {
        bgColor: 0x0c120e,
        fogColor: 0x111a14,
        fogDensity: 0.015,
        ambientLightColor: 0x3d5244,
        ambientLightIntensity: 1.2,
        dirLightColor: 0xc4e5cc,
        dirLightIntensity: 2.2,
        groundGridColor: 0x193322,
        groundCenterColor: 0x10b981,
        particleColor1: 0x10b981,
        particleColor2: 0x34d399,
        particleCount: 220,
        particleSpeed: 0.8,
        heroAuraColor: 0x10b981,
        bossCoreColor: 0xef4444,
        bossCoreUnlockedColor: 0xf59e0b,
        tileEdgeColor: 0x10b981
      };
    case 'space':
      return {
        bgColor: 0x050414,
        fogColor: 0x090724,
        fogDensity: 0.012,
        ambientLightColor: 0x2e2968,
        ambientLightIntensity: 1.1,
        dirLightColor: 0xa5f3fc,
        dirLightIntensity: 2.4,
        groundGridColor: 0x1e1b4b,
        groundCenterColor: 0x06b6d4,
        particleColor1: 0x06b6d4,
        particleColor2: 0xc084fc,
        particleCount: 350,
        particleSpeed: 1.2,
        heroAuraColor: 0x38bdf8,
        bossCoreColor: 0xa855f7,
        bossCoreUnlockedColor: 0x38bdf8,
        tileEdgeColor: 0x06b6d4
      };
    case 'zombie':
      return {
        bgColor: 0x0a0f07,
        fogColor: 0x11190c,
        fogDensity: 0.018,
        ambientLightColor: 0x3b4a26,
        ambientLightIntensity: 1.1,
        dirLightColor: 0xecfccb,
        dirLightIntensity: 1.9,
        groundGridColor: 0x223011,
        groundCenterColor: 0x84cc16,
        particleColor1: 0x84cc16,
        particleColor2: 0xa3e635,
        particleCount: 260,
        particleSpeed: 0.6,
        heroAuraColor: 0xa3e635,
        bossCoreColor: 0x84cc16,
        bossCoreUnlockedColor: 0xfacc15,
        tileEdgeColor: 0x84cc16
      };
    case 'cyberpunk':
      return {
        bgColor: 0x080414,
        fogColor: 0x120826,
        fogDensity: 0.014,
        ambientLightColor: 0x581c87,
        ambientLightIntensity: 1.3,
        dirLightColor: 0xfbcfe8,
        dirLightIntensity: 2.5,
        groundGridColor: 0x3b0764,
        groundCenterColor: 0xd946ef,
        particleColor1: 0xd946ef,
        particleColor2: 0x06b6d4,
        particleCount: 300,
        particleSpeed: 1.4,
        heroAuraColor: 0x06b6d4,
        bossCoreColor: 0xd946ef,
        bossCoreUnlockedColor: 0x22d3ee,
        tileEdgeColor: 0xd946ef
      };
    case 'animals':
      return {
        bgColor: 0x06140e,
        fogColor: 0x0b2117,
        fogDensity: 0.015,
        ambientLightColor: 0x134e3a,
        ambientLightIntensity: 1.3,
        dirLightColor: 0xd1fae5,
        dirLightIntensity: 2.2,
        groundGridColor: 0x064e3b,
        groundCenterColor: 0xf59e0b,
        particleColor1: 0x10b981,
        particleColor2: 0xfbbf24,
        particleCount: 250,
        particleSpeed: 0.7,
        heroAuraColor: 0xf59e0b,
        bossCoreColor: 0x10b981,
        bossCoreUnlockedColor: 0xf59e0b,
        tileEdgeColor: 0x10b981
      };
    default: // Medieval / classic
      return {
        bgColor: 0x0b0d14,
        fogColor: 0x141824,
        fogDensity: 0.014,
        ambientLightColor: 0x47392b,
        ambientLightIntensity: 1.2,
        dirLightColor: 0xfef3c7,
        dirLightIntensity: 2.3,
        groundGridColor: 0x382717,
        groundCenterColor: 0xf59e0b,
        particleColor1: 0xf59e0b,
        particleColor2: 0xfde68a,
        particleCount: 220,
        particleSpeed: 0.9,
        heroAuraColor: 0x38bdf8,
        bossCoreColor: 0xef4444,
        bossCoreUnlockedColor: 0xf59e0b,
        tileEdgeColor: 0xd97706
      };
  }
}

export const HexMapThreeCanvas: React.FC<HexMapThreeCanvasProps> = ({
  world,
  hexMap,
  saveState,
  worldHexProgress,
  selectedHexId,
  onSelectHex,
  onMoveToHex,
  onStartStage
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Three.js State Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Mesh registries for fast lookup and raycasting
  const hexMeshesMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const interactiveHitMeshesRef = useRef<THREE.Mesh[]>([]);
  const heroGroupRef = useRef<THREE.Group | null>(null);
  const bossPortalGroupRef = useRef<THREE.Group | null>(null);
  const rotatingPropsRef = useRef<THREE.Object3D[]>([]);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const pathLinesGroupRef = useRef<THREE.Group | null>(null);

  // Camera Target interpolation
  const cameraTargetRef = useRef<{
    pos: THREE.Vector3;
    lookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
  }>({
    pos: new THREE.Vector3(0, 24, 28),
    lookAt: new THREE.Vector3(0, 0, 0),
    currentLookAt: new THREE.Vector3(0, 0, 0)
  });

  // Mouse / Touch Interaction State
  const [hoveredHexId, setHoveredHexId] = useState<string | null>(null);
  const hoveredHexIdRef = useRef<string | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 36,
    theta: 0,
    phi: Math.PI / 4
  });

  // UI Preset View state
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'topdown' | 'cinematic'>('isometric');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Memoized lists of reachable and discovered tiles
  const currentTile = useMemo(() => {
    return hexMap.tiles.find((t) => t.id === worldHexProgress.currentHexId) || hexMap.tiles[0];
  }, [hexMap.tiles, worldHexProgress.currentHexId]);

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

  const discoveredTileIds = useMemo(() => {
    const discovered = new Set<string>(worldHexProgress.visitedHexIds);
    discovered.add(hexMap.startHexId);
    discovered.add(hexMap.bossHexId);

    worldHexProgress.visitedHexIds.forEach((vId) => {
      const vTile = hexMap.tiles.find((t) => t.id === vId);
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
  }, [worldHexProgress.visitedHexIds, hexMap.startHexId, hexMap.bossHexId, hexMap.tiles]);

  const keysCollectedCount = worldHexProgress.collectedKeyHexIds?.length ?? worldHexProgress.collectedKeys ?? 0;
  const hasAllKeys = keysCollectedCount >= hexMap.requiredKeysForBoss;

  // Set Camera Preset Handler
  const handleSetCameraPreset = (preset: 'isometric' | 'topdown' | 'cinematic') => {
    setCameraPreset(preset);
    soundSystem.play('select');

    if (preset === 'topdown') {
      cameraSphericalRef.current = { radius: 34, theta: 0, phi: 0.05 };
    } else if (preset === 'cinematic') {
      cameraSphericalRef.current = { radius: 26, theta: -Math.PI / 4, phi: Math.PI / 2.8 };
    } else {
      // isometric
      cameraSphericalRef.current = { radius: 36, theta: 0, phi: Math.PI / 4.2 };
    }
  };

  // Focus Camera on Hero
  const handleFocusHero = () => {
    if (!currentTile) return;
    const { x, z } = axialTo3DWorld(currentTile.q ?? currentTile.col, currentTile.r ?? currentTile.row);
    cameraTargetRef.current.lookAt.set(x, 0.5, z);
    soundSystem.play('select');
  };

  // Focus Camera on Boss Sanctum
  const handleFocusBoss = () => {
    const bossTile = hexMap.tiles.find((t) => t.id === hexMap.bossHexId);
    if (!bossTile) return;
    const { x, z } = axialTo3DWorld(bossTile.q ?? bossTile.col, bossTile.r ?? bossTile.row);
    cameraTargetRef.current.lookAt.set(x, 0.5, z);
    soundSystem.play('select');
  };

  // Reset Camera View
  const handleResetCamera = () => {
    cameraTargetRef.current.lookAt.set(0, 0, 0);
    handleSetCameraPreset('isometric');
  };

  // ============================================================================
  // THREE.JS INITIALIZATION & SCENE SETUP
  // ============================================================================
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const themeConfig = getTheme3DConfig(world.themeStyle);

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(themeConfig.bgColor);
    scene.fog = new THREE.FogExp2(themeConfig.fogColor, themeConfig.fogDensity);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 300);
    camera.position.set(0, 24, 28);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(
      themeConfig.ambientLightColor,
      themeConfig.ambientLightIntensity
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      themeConfig.dirLightColor,
      themeConfig.dirLightIntensity
    );
    dirLight.position.set(20, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-25, 15, -20);
    scene.add(rimLight);

    // 5. Scenic 3D Sky Dome / Panoramic Backdrop
    const skyGeo = new THREE.SphereGeometry(120, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      color: themeConfig.bgColor,
      side: THREE.BackSide
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // If mapBanner URL exists, load dynamic texture for atmospheric backdrop
    if (world.mapBanner) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        world.mapBanner,
        (bannerTex) => {
          bannerTex.wrapS = THREE.RepeatWrapping;
          bannerTex.wrapT = THREE.ClampToEdgeWrapping;
          bannerTex.repeat.set(2, 1);

          const backdropGeo = new THREE.CylinderGeometry(80, 80, 50, 32, 1, true, 0, Math.PI * 2);
          const backdropMat = new THREE.MeshBasicMaterial({
            map: bannerTex,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.28,
            fog: false
          });
          const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
          backdropMesh.position.y = 12;
          scene.add(backdropMesh);
        },
        undefined,
        () => {
          // fallback gracefully on CORS/network errors
        }
      );
    }

    // 6. Ground Base Plane with Themed Concentric Rings
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    // Dark Base Ground Disk
    const groundDiskGeo = new THREE.CylinderGeometry(28, 29, 0.4, 48);
    const groundDiskMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      roughness: 0.85,
      metalness: 0.2
    });
    const groundDisk = new THREE.Mesh(groundDiskGeo, groundDiskMat);
    groundDisk.position.y = -0.3;
    groundDisk.receiveShadow = true;
    groundGroup.add(groundDisk);

    // Themed Concentric Ring Markers
    const ringRadii = [8, 14, 20, 26];
    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r - 0.08, r + 0.08, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: themeConfig.groundGridColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45 - idx * 0.08
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = -0.05;
      groundGroup.add(ringMesh);
    });

    // 7. Thematic 3D Atmospheric Particle System
    const particleCount = themeConfig.particleCount;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 26;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 12;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleScales[i] = 0.5 + Math.random() * 1.5;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02 * themeConfig.particleSpeed,
        y: (0.015 + Math.random() * 0.035) * themeConfig.particleSpeed,
        z: (Math.random() - 0.5) * 0.02 * themeConfig.particleSpeed
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: themeConfig.particleColor1,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesMeshRef.current = particles;

    // 8. Hexagonal Tiles Construction
    hexMeshesMapRef.current.clear();
    interactiveHitMeshesRef.current = [];
    rotatingPropsRef.current = [];

    const hexGroup = new THREE.Group();
    scene.add(hexGroup);

    // Shared Pointy-topped Hexagon Geometry (Cylinder with 6 sides rotated by 30 deg)
    const baseHexGeo = new THREE.CylinderGeometry(HEX_RADIUS, HEX_RADIUS * 1.02, HEX_HEIGHT, 6);
    baseHexGeo.rotateY(Math.PI / 6); // align pointy-topped

    const edgesGeo = new THREE.EdgesGeometry(baseHexGeo);

    // Build each tile in 3D
    hexMap.tiles.forEach((tile) => {
      const { x, z } = axialTo3DWorld(tile.q ?? tile.col, tile.r ?? tile.row);
      const isDiscovered = discoveredTileIds.has(tile.id);
      const isVisited = worldHexProgress.visitedHexIds.includes(tile.id);
      const isReachable = reachableTileIds.has(tile.id);
      const isSelected = selectedHexId === tile.id;
      const isCurrent = currentTile?.id === tile.id;
      const isBoss = tile.type === 'boss_gate';

      const tileGroup = new THREE.Group();
      tileGroup.position.set(x, 0, z);
      tileGroup.userData = { tileId: tile.id, tileData: tile };

      // Calculate Elevation height
      let tileElevation = 0;
      if (isBoss) tileElevation = 0.5;
      else if (tile.type === 'blocking') tileElevation = 0.8;
      else if (tile.type === 'key_shrine' || tile.type === 'treasure') tileElevation = 0.25;
      else if (isVisited || isCurrent) tileElevation = 0.1;

      tileGroup.position.y = tileElevation;

      // Decide Material colors based on tile type and genre
      let mainColor = 0x334155; // default slate
      let emissiveColor = 0x000000;
      let emissiveIntensity = 0;
      let metalness = 0.3;
      let roughness = 0.6;

      switch (tile.type) {
        case 'start':
          mainColor = 0x059669;
          emissiveColor = 0x10b981;
          emissiveIntensity = 0.35;
          break;
        case 'key_shrine': {
          const keyAlreadyClaimed = worldHexProgress.collectedKeyHexIds?.includes(tile.id);
          mainColor = keyAlreadyClaimed ? 0x78350f : 0xd97706;
          emissiveColor = keyAlreadyClaimed ? 0x451a03 : 0xf59e0b;
          emissiveIntensity = keyAlreadyClaimed ? 0.2 : 0.6;
          metalness = 0.7;
          roughness = 0.3;
          break;
        }
        case 'treasure': {
          const treasureClaimed = (worldHexProgress.collectedTreasureHexIds || []).includes(tile.id);
          mainColor = treasureClaimed ? 0x475569 : 0xeab308;
          emissiveColor = treasureClaimed ? 0x000000 : 0xfacc15;
          emissiveIntensity = treasureClaimed ? 0 : 0.5;
          metalness = 0.6;
          roughness = 0.35;
          break;
        }
        case 'battle_reward':
          mainColor = 0x991b1b;
          emissiveColor = 0xef4444;
          emissiveIntensity = 0.45;
          break;
        case 'battle_no_reward':
          mainColor = 0x475569;
          emissiveColor = 0x64748b;
          emissiveIntensity = 0.2;
          break;
        case 'rest_camp':
          mainColor = 0x0891b2;
          emissiveColor = 0x06b6d4;
          emissiveIntensity = 0.5;
          break;
        case 'blocking':
          mainColor = 0x1c1917;
          roughness = 0.95;
          break;
        case 'boss_gate': {
          if (hasAllKeys) {
            mainColor = 0xb45309;
            emissiveColor = 0xf59e0b;
            emissiveIntensity = 0.75;
          } else {
            mainColor = 0x581c87;
            emissiveColor = 0xa855f7;
            emissiveIntensity = 0.45;
          }
          metalness = 0.8;
          roughness = 0.25;
          break;
        }
        default:
          mainColor = isVisited ? 0x1e293b : 0x334155;
          break;
      }

      // Fog of war dampening if undiscovered
      if (!isDiscovered) {
        mainColor = 0x0f172a;
        emissiveColor = 0x000000;
        emissiveIntensity = 0;
        roughness = 0.9;
        tileGroup.position.y -= 0.15;
      }

      const hexMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        emissive: emissiveColor,
        emissiveIntensity,
        metalness,
        roughness
      });

      const hexMesh = new THREE.Mesh(baseHexGeo, hexMat);
      hexMesh.castShadow = isDiscovered;
      hexMesh.receiveShadow = true;
      hexMesh.userData = { tileId: tile.id, tileData: tile };
      tileGroup.add(hexMesh);
      interactiveHitMeshesRef.current.push(hexMesh);

      // Beveled Edge Wireframe Line
      let edgeLineColor = themeConfig.tileEdgeColor;
      if (isSelected) edgeLineColor = 0x38bdf8;
      else if (isReachable) edgeLineColor = 0xfacc15;
      else if (!isDiscovered) edgeLineColor = 0x1e293b;

      const edgeLineMat = new THREE.LineBasicMaterial({
        color: edgeLineColor,
        linewidth: isSelected || isReachable ? 2 : 1,
        transparent: true,
        opacity: isSelected ? 1 : isDiscovered ? 0.7 : 0.2
      });
      const edgeLine = new THREE.LineSegments(edgesGeo, edgeLineMat);
      edgeLine.position.y = 0.01;
      tileGroup.add(edgeLine);

      // 3D Props on Special Tiles
      if (isDiscovered) {
        // A. Key Shrine 3D Prop
        if (tile.type === 'key_shrine') {
          const keyClaimed = worldHexProgress.collectedKeyHexIds?.includes(tile.id);
          const keyGroup = new THREE.Group();
          keyGroup.position.y = HEX_HEIGHT / 2 + 0.8;

          // Glowing Key Core Prism
          const keyCoreGeo = new THREE.OctahedronGeometry(0.55, 0);
          const keyCoreMat = new THREE.MeshStandardMaterial({
            color: keyClaimed ? 0x92400e : 0xfde047,
            emissive: keyClaimed ? 0x78350f : 0xf59e0b,
            emissiveIntensity: keyClaimed ? 0.2 : 0.9,
            metalness: 0.9,
            roughness: 0.1
          });
          const keyCore = new THREE.Mesh(keyCoreGeo, keyCoreMat);
          keyGroup.add(keyCore);

          // Golden Rune Ring around key
          if (!keyClaimed) {
            const runeRingGeo = new THREE.TorusGeometry(0.85, 0.05, 8, 24);
            const runeRingMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
            const runeRing = new THREE.Mesh(runeRingGeo, runeRingMat);
            runeRing.rotation.x = Math.PI / 3;
            keyGroup.add(runeRing);
          }

          tileGroup.add(keyGroup);
          rotatingPropsRef.current.push(keyGroup);
        }

        // B. Treasure 3D Chest / Diamond
        if (tile.type === 'treasure') {
          const treasureClaimed = (worldHexProgress.collectedTreasureHexIds || []).includes(tile.id);
          const chestGroup = new THREE.Group();
          chestGroup.position.y = HEX_HEIGHT / 2 + 0.45;

          const boxGeo = new THREE.BoxGeometry(0.7, 0.5, 0.5);
          const boxMat = new THREE.MeshStandardMaterial({
            color: treasureClaimed ? 0x475569 : 0xf59e0b,
            emissive: treasureClaimed ? 0x000000 : 0xd97706,
            emissiveIntensity: treasureClaimed ? 0 : 0.5,
            metalness: 0.7,
            roughness: 0.3
          });
          const chestMesh = new THREE.Mesh(boxGeo, boxMat);
          chestGroup.add(chestMesh);

          tileGroup.add(chestGroup);
          if (!treasureClaimed) rotatingPropsRef.current.push(chestGroup);
        }

        // C. Battle / Duelo Marker
        if (tile.type === 'battle_reward' || tile.type === 'battle_no_reward') {
          const battleMarkerGroup = new THREE.Group();
          battleMarkerGroup.position.y = HEX_HEIGHT / 2 + 0.5;

          const swordGeo = new THREE.ConeGeometry(0.2, 0.9, 4);
          const swordMat = new THREE.MeshStandardMaterial({
            color: tile.type === 'battle_reward' ? 0xef4444 : 0x94a3b8,
            emissive: tile.type === 'battle_reward' ? 0xb91c1c : 0x475569,
            emissiveIntensity: 0.4,
            metalness: 0.8
          });

          const blade1 = new THREE.Mesh(swordGeo, swordMat);
          blade1.rotation.z = Math.PI / 4;
          const blade2 = new THREE.Mesh(swordGeo, swordMat);
          blade2.rotation.z = -Math.PI / 4;

          battleMarkerGroup.add(blade1);
          battleMarkerGroup.add(blade2);
          tileGroup.add(battleMarkerGroup);
          rotatingPropsRef.current.push(battleMarkerGroup);
        }

        // D. Boss Gate Sanctum Portal
        if (tile.type === 'boss_gate') {
          const portalGroup = new THREE.Group();
          portalGroup.position.y = HEX_HEIGHT / 2 + 1.2;

          // Outer Arch Pillars
          const pillarGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.2, 8);
          const pillarMat = new THREE.MeshStandardMaterial({
            color: 0x1e1b4b,
            metalness: 0.9,
            roughness: 0.2
          });
          const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
          pillarL.position.set(-1.1, 0, 0);
          const pillarR = new THREE.Mesh(pillarGeo, pillarMat);
          pillarR.position.set(1.1, 0, 0);
          portalGroup.add(pillarL);
          portalGroup.add(pillarR);

          // Central Pulsing Energy Core
          const portalCoreGeo = new THREE.SphereGeometry(0.85, 24, 24);
          const portalCoreMat = new THREE.MeshStandardMaterial({
            color: hasAllKeys ? 0xf59e0b : 0xa855f7,
            emissive: hasAllKeys ? 0xfbbf24 : 0x7e22ce,
            emissiveIntensity: hasAllKeys ? 1.0 : 0.6,
            roughness: 0.1,
            metalness: 0.4
          });
          const portalCore = new THREE.Mesh(portalCoreGeo, portalCoreMat);
          portalGroup.add(portalCore);

          // Orbiting Dark Rune Torus
          const archGeo = new THREE.TorusGeometry(1.25, 0.08, 12, 36);
          const archMat = new THREE.MeshStandardMaterial({
            color: hasAllKeys ? 0xfdba74 : 0xc084fc,
            emissive: hasAllKeys ? 0xf59e0b : 0x9333ea,
            emissiveIntensity: 0.5
          });
          const archMesh = new THREE.Mesh(archGeo, archMat);
          portalGroup.add(archMesh);

          tileGroup.add(portalGroup);
          bossPortalGroupRef.current = portalGroup;
          rotatingPropsRef.current.push(portalGroup);
        }

        // E. Blocking Obstacle Pillars / Rocks
        if (tile.type === 'blocking') {
          const rockGroup = new THREE.Group();
          rockGroup.position.y = HEX_HEIGHT / 2 + 0.6;
          const rockGeo = new THREE.DodecahedronGeometry(0.7, 0);
          const rockMat = new THREE.MeshStandardMaterial({
            color: 0x27272a,
            roughness: 0.9
          });
          const rock1 = new THREE.Mesh(rockGeo, rockMat);
          rock1.scale.set(1, 1.6, 1);
          rockGroup.add(rock1);
          tileGroup.add(rockGroup);
        }

        // F. Rest Camp Fountain
        if (tile.type === 'rest_camp') {
          const campGroup = new THREE.Group();
          campGroup.position.y = HEX_HEIGHT / 2 + 0.4;
          const fountainGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.4, 12);
          const fountainMat = new THREE.MeshStandardMaterial({
            color: 0x0891b2,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.5,
            metalness: 0.5
          });
          const fountain = new THREE.Mesh(fountainGeo, fountainMat);
          campGroup.add(fountain);
          tileGroup.add(campGroup);
        }
      }

      hexGroup.add(tileGroup);
      hexMeshesMapRef.current.set(tile.id, tileGroup);
    });

    // 9. 3D Pathways / Energy Conduits between visited/discovered hexes
    const pathGroup = new THREE.Group();
    scene.add(pathGroup);
    pathLinesGroupRef.current = pathGroup;

    const visitedSet = new Set(worldHexProgress.visitedHexIds);
    for (let i = 0; i < hexMap.tiles.length; i++) {
      const t1 = hexMap.tiles[i];
      if (!discoveredTileIds.has(t1.id)) continue;
      const c1 = axialTo3DWorld(t1.q ?? t1.col, t1.r ?? t1.row);

      for (let j = i + 1; j < hexMap.tiles.length; j++) {
        const t2 = hexMap.tiles[j];
        if (!discoveredTileIds.has(t2.id)) continue;

        const dist = getAxialDistance(
          { q: t1.q ?? t1.col, r: t1.r ?? t1.row },
          { q: t2.q ?? t2.col, r: t2.r ?? t2.row }
        );

        if (dist === 1) {
          const c2 = axialTo3DWorld(t2.q ?? t2.col, t2.r ?? t2.row);
          const bothVisited = visitedSet.has(t1.id) && visitedSet.has(t2.id);

          const points = [
            new THREE.Vector3(c1.x, 0.05, c1.z),
            new THREE.Vector3(c2.x, 0.05, c2.z)
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({
            color: bothVisited ? themeConfig.heroAuraColor : 0x334155,
            linewidth: bothVisited ? 3 : 1,
            transparent: true,
            opacity: bothVisited ? 0.85 : 0.35
          });
          const pathLine = new THREE.Line(lineGeo, lineMat);
          pathGroup.add(pathLine);
        }
      }
    }

    // 10. 3D Hero Figurine (Chess Piece Token)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);
    heroGroupRef.current = heroGroup;

    if (currentTile) {
      const { x, z } = axialTo3DWorld(currentTile.q ?? currentTile.col, currentTile.r ?? currentTile.row);
      heroGroup.position.set(x, HEX_HEIGHT / 2 + 0.8, z);
    }

    // Hero Figurine Construction (Knight / King Archetype in 3D)
    const heroBaseGeo = new THREE.CylinderGeometry(0.65, 0.8, 0.3, 16);
    const heroBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2
    });
    const heroBase = new THREE.Mesh(heroBaseGeo, heroBaseMat);
    heroGroup.add(heroBase);

    const heroBodyGeo = new THREE.ConeGeometry(0.5, 1.2, 16);
    const heroBodyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.15
    });
    const heroBody = new THREE.Mesh(heroBodyGeo, heroBodyMat);
    heroBody.position.y = 0.7;
    heroGroup.add(heroBody);

    const heroCrownGeo = new THREE.OctahedronGeometry(0.35, 0);
    const heroCrownMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.7,
      metalness: 0.95,
      roughness: 0.1
    });
    const heroCrown = new THREE.Mesh(heroCrownGeo, heroCrownMat);
    heroCrown.position.y = 1.5;
    heroGroup.add(heroCrown);

    // Hero Glowing Point Light
    const heroPointLight = new THREE.PointLight(themeConfig.heroAuraColor, 2.5, 9);
    heroPointLight.position.y = 1.2;
    heroGroup.add(heroPointLight);

    // Hero Rotating Energy Halo Ring
    const heroHaloGeo = new THREE.RingGeometry(0.9, 1.05, 32);
    const heroHaloMat = new THREE.MeshBasicMaterial({
      color: themeConfig.heroAuraColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const heroHalo = new THREE.Mesh(heroHaloGeo, heroHaloMat);
    heroHalo.rotation.x = -Math.PI / 2;
    heroHalo.position.y = -0.2;
    heroGroup.add(heroHalo);

    // ============================================================================
    // ANIMATION & RENDER LOOP
    // ============================================================================
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 1. Hero floating bobbing animation
      if (heroGroupRef.current && currentTile) {
        const { x, z } = axialTo3DWorld(currentTile.q ?? currentTile.col, currentTile.r ?? currentTile.row);
        const targetX = x;
        const targetZ = z;
        heroGroupRef.current.position.x += (targetX - heroGroupRef.current.position.x) * 0.1;
        heroGroupRef.current.position.z += (targetZ - heroGroupRef.current.position.z) * 0.1;
        heroGroupRef.current.position.y = HEX_HEIGHT / 2 + 0.8 + Math.sin(elapsedTime * 3) * 0.15;
        heroGroupRef.current.rotation.y = elapsedTime * 0.8;
      }

      // 2. Rotating props (Key shrines, treasures, boss core)
      rotatingPropsRef.current.forEach((obj, idx) => {
        obj.rotation.y = elapsedTime * (0.8 + (idx % 3) * 0.2);
      });

      // 3. Particle drift
      if (particlesMeshRef.current) {
        const positions = particlesMeshRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleVelocities[i].y;
          positions[i * 3] += particleVelocities[i].x;
          positions[i * 3 + 2] += particleVelocities[i].z;

          // Recycle particles that drift too high
          if (positions[i * 3 + 1] > 14) {
            positions[i * 3 + 1] = 0.5;
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 24;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
          }
        }
        particlesMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // 4. Smooth Camera Orbit & LookAt Interpolation
      const sp = cameraSphericalRef.current;
      const targetLookAt = cameraTargetRef.current.lookAt;
      const currentLookAt = cameraTargetRef.current.currentLookAt;

      currentLookAt.lerp(targetLookAt, 0.08);

      const cx = currentLookAt.x + sp.radius * Math.sin(sp.phi) * Math.sin(sp.theta);
      const cy = currentLookAt.y + sp.radius * Math.cos(sp.phi);
      const cz = currentLookAt.z + sp.radius * Math.sin(sp.phi) * Math.cos(sp.theta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer for responsive canvas sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup on unmount or world change
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [
    world.id,
    world.themeStyle,
    world.mapBanner,
    hexMap,
    discoveredTileIds,
    worldHexProgress.visitedHexIds,
    worldHexProgress.collectedKeyHexIds,
    worldHexProgress.collectedTreasureHexIds,
    selectedHexId,
    reachableTileIds,
    hasAllKeys,
    currentTile
  ]);

  // ============================================================================
  // RAYCASTING & INTERACTIVE MOUSE / TOUCH EVENTS
  // ============================================================================
  const performRaycast = (clientX: number, clientY: number): HexTileData | null => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(interactiveHitMeshesRef.current, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData?.tileData) {
        return hit.userData.tileData as HexTileData;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);

    // Drag Orbit Camera
    if (e.buttons === 1) {
      if (dx > 4 || dy > 4) {
        isDraggingRef.current = true;
      }
      const deltaX = e.movementX || 0;
      const deltaY = e.movementY || 0;

      cameraSphericalRef.current.theta -= deltaX * 0.008;
      cameraSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2.1, cameraSphericalRef.current.phi - deltaY * 0.008)
      );
      return;
    }

    // Pan with Right Click (button === 2)
    if (e.buttons === 2) {
      isDraggingRef.current = true;
      const deltaX = e.movementX || 0;
      const deltaY = e.movementY || 0;
      const panSpeed = 0.04;
      cameraTargetRef.current.lookAt.x -= deltaX * panSpeed;
      cameraTargetRef.current.lookAt.z -= deltaY * panSpeed;
      return;
    }

    // Hover Raycasting
    const tile = performRaycast(e.clientX, e.clientY);
    if (tile && tile.id !== hoveredHexIdRef.current) {
      hoveredHexIdRef.current = tile.id;
      setHoveredHexId(tile.id);
    } else if (!tile && hoveredHexIdRef.current) {
      hoveredHexIdRef.current = null;
      setHoveredHexId(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // If not dragging, treat as click / select
    if (!isDraggingRef.current) {
      const tile = performRaycast(e.clientX, e.clientY);
      if (tile) {
        onSelectHex(tile);
        soundSystem.play('select');
      }
    }
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.03;
    cameraSphericalRef.current.radius = Math.max(
      14,
      Math.min(55, cameraSphericalRef.current.radius + zoomDelta)
    );
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -6 : 6;
    cameraSphericalRef.current.radius = Math.max(
      14,
      Math.min(55, cameraSphericalRef.current.radius + delta)
    );
    soundSystem.play('select');
  };

  const selectedTileData = hexMap.tiles.find((t) => t.id === selectedHexId) || currentTile;
  const hoveredTileData = hexMap.tiles.find((t) => t.id === hoveredHexId);

  return (
    <div
      ref={containerRef}
      id="three-hex-map-canvas-container"
      className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl select-none touch-none border border-slate-700/80 bg-slate-950"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id="three-hex-map-webgl-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top 3D Camera Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Current World Title & 3D Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>3D THREE.JS MOTOR GRÁFICO</span>
          </div>
        </div>

        {/* Right: Camera Presets & Zoom Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-200 pointer-events-auto shadow-xl">
          <button
            onClick={() => handleSetCameraPreset('isometric')}
            className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
              cameraPreset === 'isometric'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista Isométrica 3D"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Isométrica</span>
          </button>

          <button
            onClick={() => handleSetCameraPreset('topdown')}
            className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
              cameraPreset === 'topdown'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista Cenital Táctica"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cenital</span>
          </button>

          <button
            onClick={() => handleSetCameraPreset('cinematic')}
            className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
              cameraPreset === 'cinematic'
                ? 'bg-fuchsia-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Ángulo Rasante Cinemático"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cinemática</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          {/* Focus Hero */}
          <button
            onClick={handleFocusHero}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-sky-400 transition"
            title="Centrar Cámara en Héroe"
          >
            <Target className="w-4 h-4" />
          </button>

          {/* Focus Boss */}
          <button
            onClick={handleFocusBoss}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-rose-400 transition"
            title="Centrar en Sanctum del Jefe"
          >
            <Crown className="w-4 h-4" />
          </button>

          {/* Zoom In/Out */}
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition"
            title="Acercar Cámara"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition"
            title="Alejar Cámara"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 transition"
            title="Resetear Vista de Cámara"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating 3D Hover Tooltip */}
      {hoveredTileData && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/90 text-white shadow-2xl max-w-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-base">{hoveredTileData.icon || '⬡'}</span>
            <div>
              <h4 className="text-xs font-black text-amber-300">{hoveredTileData.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{hoveredTileData.description}</p>
            </div>
          </div>
          {reachableTileIds.has(hoveredTileData.id) && hoveredTileData.id !== currentTile?.id && (
            <span className="mt-1 block text-[10px] text-emerald-400 font-bold">
              ✦ Haz clic para moverte aquí
            </span>
          )}
        </div>
      )}

      {/* 3D Navigation Guide Footer Note */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none text-[10px] text-slate-400 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-2">
        <span>Arrastra para rotar • Clic para seleccionar • Rueda para zoom</span>
      </div>
    </div>
  );
};
