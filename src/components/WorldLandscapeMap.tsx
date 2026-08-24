import React, { useState } from 'react';
import {
  AdventureWorld,
  AdventureStage,
  HeroState,
  AdventureSaveState,
  StageSaveData
} from '../types/adventure';
import {
  Star,
  Lock,
  Crown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Compass,
  MapPin,
  Flame,
  Swords,
  Shield,
  Eye,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { CLASS_INFO } from '../data/adventureData';
import { soundSystem } from '../utils/chessAudio';

interface WorldLandscapeMapProps {
  world: AdventureWorld;
  saveState: AdventureSaveState;
  onSelectStage: (stage: AdventureStage) => void;
  onStartStage: (stage: AdventureStage) => void;
  onPrevWorld?: () => void;
  onNextWorld?: () => void;
  hasPrevWorld?: boolean;
  hasNextWorld?: boolean;
  totalWorldsCount?: number;
}

// Stage layout coordinates on the 1000x560 landscape canvas
const STAGE_COORDS = [
  { x: 140, y: 380, name: 'Zona 1' },
  { x: 320, y: 230, name: 'Zona 2' },
  { x: 500, y: 370, name: 'Zona 3' },
  { x: 690, y: 210, name: 'Zona 4' },
  { x: 880, y: 330, name: 'Jefe Final' }
];

export const WorldLandscapeMap: React.FC<WorldLandscapeMapProps> = ({
  world,
  saveState,
  onSelectStage,
  onStartStage,
  onPrevWorld,
  onNextWorld,
  hasPrevWorld = true,
  hasNextWorld = true,
  totalWorldsCount = 6
}) => {
  const [hoveredStage, setHoveredStage] = useState<AdventureStage | null>(null);
  const [activeTooltipPos, setActiveTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Helper: check if a stage is unlocked
  const isStageUnlocked = (stage: AdventureStage): boolean => {
    if (stage.stageNumber === 1) {
      if (world.number === 1) return true;
      const totalStars = Object.values(saveState.completedStages as Record<string, StageSaveData>).reduce(
        (acc: number, s: StageSaveData) => acc + (s?.stars || 0),
        0
      );
      return totalStars >= world.requiredStarsToUnlock;
    }
    const prevStage = world.stages.find(s => s.stageNumber === stage.stageNumber - 1);
    if (!prevStage) return false;
    return !!saveState.completedStages[prevStage.id]?.completed;
  };

  // Find the player's current progression stage (first unlocked but incomplete, or highest stage)
  const currentHeroStage = (() => {
    const uncompleted = world.stages.find(
      s => isStageUnlocked(s) && !saveState.completedStages[s.id]?.completed
    );
    if (uncompleted) return uncompleted;
    // If all completed or none unlocked, pick stage 1 or last
    return world.stages[world.stages.length - 1] || world.stages[0];
  })();

  const currentHeroIndex = world.stages.findIndex(s => s.id === currentHeroStage?.id);
  const heroPos = currentHeroIndex >= 0 ? STAGE_COORDS[currentHeroIndex] : STAGE_COORDS[0];

  // Total stars in current world
  const worldCompletedStagesCount = world.stages.filter(
    s => saveState.completedStages[s.id]?.completed
  ).length;
  const worldStarsCount = world.stages.reduce(
    (acc, s) => acc + (saveState.completedStages[s.id]?.stars || 0),
    0
  );

  // Road SVG Path through the 5 coordinates
  const roadPathD = `M ${STAGE_COORDS[0].x} ${STAGE_COORDS[0].y} C 210 390, 240 220, ${STAGE_COORDS[1].x} ${STAGE_COORDS[1].y} C 380 240, 420 380, ${STAGE_COORDS[2].x} ${STAGE_COORDS[2].y} C 580 360, 620 200, ${STAGE_COORDS[3].x} ${STAGE_COORDS[3].y} C 770 220, 800 340, ${STAGE_COORDS[4].x} ${STAGE_COORDS[4].y}`;

  // =========================================================================
  // WORLD-SPECIFIC SVG LANDSCAPE LAYERS
  // =========================================================================

  const renderWorldSpecificLandscape = () => {
    switch (world.themeStyle) {
      // -----------------------------------------------------------------------
      // 1. REINO MEDIEVAL: Lush green island, stone bridges, windmills, pine trees, castle
      // -----------------------------------------------------------------------
      case 'medieval':
        return (
          <g id="medieval-landscape">
            <defs>
              {/* Ocean / River Gradient */}
              <linearGradient id="med-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="50%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>
              {/* Grassland Island Gradient */}
              <linearGradient id="med-grass" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="40%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              {/* Sand Shoreline Gradient */}
              <linearGradient id="med-sand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              {/* Stone Mountain Gradient */}
              <linearGradient id="med-rock" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Ocean Base */}
            <rect width="1000" height="560" fill="url(#med-ocean)" />

            {/* Animated Ocean Waves / Ripples */}
            <g opacity="0.3" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M 60 120 Q 90 110, 120 120 T 180 120" />
              <path d="M 240 500 Q 270 490, 300 500 T 360 500" />
              <path d="M 620 520 Q 650 510, 680 520 T 740 520" />
              <path d="M 850 100 Q 880 90, 910 100 T 970 100" />
              <path d="M 450 70 Q 480 60, 510 70 T 570 70" />
            </g>

            {/* Main Medieval Island - Sandy Coastline Layer */}
            <path
              d="M 60 380 C 40 260, 140 140, 320 130 C 420 120, 500 160, 600 120 C 740 70, 930 140, 960 320 C 980 440, 860 520, 700 510 C 580 500, 520 460, 440 500 C 260 560, 80 500, 60 380 Z"
              fill="url(#med-sand)"
              opacity="0.9"
            />

            {/* Main Medieval Island - Grassland Top Surface */}
            <path
              d="M 75 375 C 55 270, 150 155, 320 145 C 415 135, 495 175, 595 135 C 730 85, 915 150, 945 315 C 965 425, 845 505, 690 495 C 575 485, 515 445, 435 485 C 265 540, 95 485, 75 375 Z"
              fill="url(#med-grass)"
              filter="drop-shadow(0px 8px 12px rgba(0,0,0,0.3))"
            />

            {/* Internal River Cutting through Island */}
            <path
              d="M 390 140 Q 430 260, 400 370 T 440 490"
              stroke="#0284C7"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 390 140 Q 430 260, 400 370 T 440 490"
              stroke="#7DD3FC"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />

            {/* Wooden Bridge crossing river at y=290 */}
            <rect x="390" y="278" width="36" height="24" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <line x1="390" y1="284" x2="426" y2="284" stroke="#9A3412" strokeWidth="2" />
            <line x1="390" y1="296" x2="426" y2="296" stroke="#9A3412" strokeWidth="2" />

            {/* Mountain Range Backdrop (top-right of island) */}
            <polygon points="760,160 810,70 860,160" fill="url(#med-rock)" stroke="#334155" strokeWidth="2" />
            <polygon points="800,90 810,70 820,90 815,100" fill="#FFFFFF" opacity="0.9" />
            <polygon points="820,170 870,90 920,170" fill="url(#med-rock)" stroke="#334155" strokeWidth="2" />
            <polygon points="860,110 870,90 880,110 875,120" fill="#FFFFFF" opacity="0.9" />

            {/* Pine Forest Clusters */}
            <g fill="#166534" stroke="#14532D" strokeWidth="1.5">
              {/* Cluster 1 - near zone 1 */}
              <circle cx="90" cy="310" r="14" />
              <circle cx="110" cy="290" r="16" />
              <circle cx="130" cy="315" r="13" />
              <circle cx="100" cy="335" r="12" />

              {/* Cluster 2 - central forest */}
              <circle cx="480" cy="190" r="16" />
              <circle cx="510" cy="180" r="18" />
              <circle cx="535" cy="205" r="15" />
              <circle cx="465" cy="215" r="13" />

              {/* Cluster 3 - eastern forest */}
              <circle cx="750" cy="420" r="18" />
              <circle cx="780" cy="440" r="20" />
              <circle cx="810" cy="415" r="16" />
              <circle cx="740" cy="450" r="14" />
            </g>

            {/* Village Houses & Windmills near Stage 1 */}
            <g>
              {/* House 1 */}
              <rect x="90" y="420" width="26" height="20" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
              <polygon points="85,420 103,405 121,420" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              {/* House 2 */}
              <rect x="180" y="440" width="24" height="18" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
              <polygon points="176,440 192,426 208,440" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
              {/* Windmill */}
              <polygon points="160,330 170,290 180,330" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
              <circle cx="170" cy="290" r="4" fill="#78350F" />
              <line x1="150" y1="270" x2="190" y2="310" stroke="#78350F" strokeWidth="2" />
              <line x1="190" y1="270" x2="150" y2="310" stroke="#78350F" strokeWidth="2" />
            </g>

            {/* Watchtower Outpost at Stage 2 */}
            <rect x="306" y="160" width="28" height="42" rx="3" fill="#64748B" stroke="#334155" strokeWidth="2" />
            <polygon points="300,160 320,140 340,160" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="315" y="172" width="10" height="14" rx="1" fill="#FEF08A" stroke="#A16207" strokeWidth="1.5" />
            {/* Red Flag on tower */}
            <line x1="320" y1="140" x2="320" y2="120" stroke="#0F172A" strokeWidth="2" />
            <polygon points="320,120 338,126 320,132" fill="#EF4444" />

            {/* Walled Fortress / Jousting Tents at Stage 4 */}
            <rect x="660" y="140" width="60" height="34" rx="4" fill="#475569" stroke="#1E293B" strokeWidth="2" />
            <rect x="670" y="132" width="10" height="10" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="700" y="132" width="10" height="10" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
            {/* Colorful Jousting Tent */}
            <polygon points="730,190 745,160 760,190" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <polygon points="740,190 745,160 750,190" fill="#FDE047" />

            {/* Grand Royal Castle on Stage 5 (Boss Citadel) */}
            <g transform="translate(840, 240)">
              {/* Castle Outer Walls */}
              <rect x="0" y="20" width="80" height="50" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="3" />
              {/* Left Tower */}
              <rect x="-10" y="0" width="24" height="70" rx="3" fill="#475569" stroke="#0F172A" strokeWidth="2.5" />
              <polygon points="-14,0 2,-20 18,0" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              {/* Right Tower */}
              <rect x="66" y="0" width="24" height="70" rx="3" fill="#475569" stroke="#0F172A" strokeWidth="2.5" />
              <polygon points="62,0 78,-20 94,0" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              {/* Central Keep */}
              <rect x="22" y="-15" width="36" height="85" rx="3" fill="#64748B" stroke="#0F172A" strokeWidth="3" />
              <polygon points="16,-15 40,-42 64,-15" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
              {/* Royal Golden Crown Banner */}
              <line x1="40" y1="-42" x2="40" y2="-62" stroke="#0F172A" strokeWidth="2.5" />
              <polygon points="40,-62 65,-54 40,-46" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              {/* Castle Gate */}
              <path d="M 28 70 C 28 45, 52 45, 52 70 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            </g>
          </g>
        );

      // -----------------------------------------------------------------------
      // 2. GUERRA TÁCTICA: Desert trenches, tank tracks, bunkers, barbed wire, radar
      // -----------------------------------------------------------------------
      case 'war':
        return (
          <g id="war-landscape">
            <defs>
              <linearGradient id="war-water" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E382A" />
                <stop offset="100%" stopColor="#1A2218" />
              </linearGradient>
              <linearGradient id="war-dirt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78716C" />
                <stop offset="50%" stopColor="#57534E" />
                <stop offset="100%" stopColor="#44403C" />
              </linearGradient>
              <linearGradient id="war-sand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A8A29E" />
                <stop offset="100%" stopColor="#78716C" />
              </linearGradient>
            </defs>

            {/* Murky Base Waters */}
            <rect width="1000" height="560" fill="url(#war-water)" />

            {/* Militarized Island Mass */}
            <path
              d="M 70 360 C 40 220, 160 120, 340 110 C 480 100, 560 160, 680 110 C 820 60, 950 160, 960 340 C 970 480, 840 530, 680 510 C 520 490, 480 440, 380 490 C 200 560, 90 480, 70 360 Z"
              fill="url(#war-sand)"
            />
            <path
              d="M 85 355 C 60 230, 170 135, 340 125 C 470 115, 550 170, 670 125 C 800 75, 930 170, 940 335 C 950 460, 825 515, 670 495 C 515 475, 475 425, 375 475 C 210 540, 105 465, 85 355 Z"
              fill="url(#war-dirt)"
              filter="drop-shadow(0px 8px 12px rgba(0,0,0,0.5))"
            />

            {/* Frontline Trench Zig-Zags */}
            <path
              d="M 220 180 L 250 210 L 230 240 L 260 270 L 240 300 L 270 330"
              stroke="#1C1917"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 540 180 L 570 210 L 550 240 L 580 270 L 560 300 L 590 330"
              stroke="#1C1917"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Sandbags alongside trenches */}
            <rect x="205" y="170" width="16" height="8" rx="2" fill="#D6D3D1" stroke="#44403C" />
            <rect x="205" y="180" width="16" height="8" rx="2" fill="#D6D3D1" stroke="#44403C" />
            <rect x="235" y="295" width="16" height="8" rx="2" fill="#D6D3D1" stroke="#44403C" />
            <rect x="525" y="170" width="16" height="8" rx="2" fill="#D6D3D1" stroke="#44403C" />
            <rect x="555" y="295" width="16" height="8" rx="2" fill="#D6D3D1" stroke="#44403C" />

            {/* Bomb / Mortar Impact Craters */}
            <circle cx="180" cy="220" r="22" fill="#1C1917" stroke="#44403C" strokeWidth="4" />
            <circle cx="440" cy="180" r="26" fill="#1C1917" stroke="#44403C" strokeWidth="5" />
            <circle cx="620" cy="420" r="30" fill="#1C1917" stroke="#44403C" strokeWidth="5" />
            <circle cx="780" cy="160" r="20" fill="#1C1917" stroke="#44403C" strokeWidth="4" />

            {/* Tank Obstacles (Dragon's Teeth & Barbed Wire) */}
            <g fill="#A8A29E" stroke="#292524" strokeWidth="2">
              <polygon points="120,440 128,420 136,440" />
              <polygon points="138,440 146,420 154,440" />
              <polygon points="156,440 164,420 172,440" />
              <polygon points="460,440 468,420 476,440" />
              <polygon points="478,440 486,420 494,440" />
            </g>

            {/* Military Radar Tower at Stage 2 */}
            <line x1="320" y1="160" x2="320" y2="190" stroke="#0C0A09" strokeWidth="4" />
            <path d="M 305 155 A 20 20 0 0 1 335 155" fill="none" stroke="#22C55E" strokeWidth="4" />
            <circle cx="320" cy="145" r="4" fill="#EF4444" className="animate-ping" />

            {/* Heavy Artillery Flak Cannon at Stage 4 */}
            <g transform="translate(680, 140)">
              <circle cx="15" cy="25" r="16" fill="#292524" stroke="#0C0A09" strokeWidth="3" />
              <rect x="12" y="-10" width="6" height="35" fill="#44403C" stroke="#0C0A09" strokeWidth="2" transform="rotate(-35, 15, 25)" />
              <rect x="2" y="-15" width="6" height="35" fill="#44403C" stroke="#0C0A09" strokeWidth="2" transform="rotate(-25, 15, 25)" />
            </g>

            {/* Blitzkrieg Fortress / Command Bunker at Stage 5 (Boss) */}
            <g transform="translate(830, 240)">
              {/* Armored Blast Concrete Bunker */}
              <polygon points="0,50 30,10 90,10 120,50 110,80 10,80" fill="#292524" stroke="#0C0A09" strokeWidth="4" />
              <polygon points="25,45 40,20 80,20 95,45" fill="#44403C" stroke="#1C1917" strokeWidth="2" />
              {/* Heavy Helipad */}
              <circle cx="60" cy="55" r="22" fill="#1C1917" stroke="#EAB308" strokeWidth="3" strokeDasharray="6 3" />
              <text x="60" y="62" fill="#EAB308" fontSize="20" fontWeight="900" textAnchor="middle">H</text>
              {/* Radio Communication Mast */}
              <line x1="90" y1="10" x2="90" y2="-30" stroke="#78716C" strokeWidth="3" />
              <polygon points="84,-30 90,-40 96,-30" fill="#EF4444" />
            </g>
          </g>
        );

      // -----------------------------------------------------------------------
      // 3. ODISEA ESPACIAL: Cosmic Nebula, floating asteroid platforms, hyper-lanes
      // -----------------------------------------------------------------------
      case 'space':
        return (
          <g id="space-landscape">
            <defs>
              <linearGradient id="space-void" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B0F19" />
                <stop offset="40%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="nebula-glow" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#C084FC" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="asteroid-surf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338CA" />
                <stop offset="50%" stopColor="#312E81" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>

            {/* Deep Space Canvas */}
            <rect width="1000" height="560" fill="url(#space-void)" />

            {/* Nebula Clouds */}
            <ellipse cx="300" cy="200" rx="250" ry="140" fill="url(#nebula-glow)" filter="blur(30px)" />
            <ellipse cx="700" cy="350" rx="280" ry="160" fill="url(#nebula-glow)" filter="blur(35px)" />

            {/* Twinkling Stars */}
            <g fill="#FFFFFF">
              <circle cx="80" cy="90" r="1.5" opacity="0.8" />
              <circle cx="150" cy="170" r="2" opacity="0.9" />
              <circle cx="280" cy="80" r="2.5" opacity="0.7" />
              <circle cx="450" cy="110" r="1.5" opacity="0.8" />
              <circle cx="620" cy="70" r="3" opacity="0.9" />
              <circle cx="790" cy="100" r="2" opacity="0.6" />
              <circle cx="920" cy="80" r="1.5" opacity="0.8" />
              <circle cx="90" cy="490" r="2" opacity="0.7" />
              <circle cx="260" cy="510" r="1.5" opacity="0.9" />
              <circle cx="510" cy="520" r="2.5" opacity="0.8" />
              <circle cx="820" cy="480" r="2" opacity="0.7" />
              <circle cx="950" cy="450" r="3" opacity="0.9" />
            </g>

            {/* Floating Asteroid Island 1 (Stage 1 Area) */}
            <ellipse cx="140" cy="380" rx="90" ry="60" fill="url(#asteroid-surf)" stroke="#6366F1" strokeWidth="2.5" />
            <ellipse cx="120" cy="365" rx="20" ry="12" fill="#1E1B4B" stroke="#4338CA" />
            <ellipse cx="160" cy="395" rx="16" ry="10" fill="#1E1B4B" stroke="#4338CA" />

            {/* Floating Asteroid Island 2 (Stage 2 Area) */}
            <ellipse cx="320" cy="230" rx="85" ry="55" fill="url(#asteroid-surf)" stroke="#6366F1" strokeWidth="2.5" />
            <ellipse cx="300" cy="220" rx="18" ry="10" fill="#1E1B4B" stroke="#4338CA" />

            {/* Floating Asteroid Island 3 (Stage 3 Area) */}
            <ellipse cx="500" cy="370" rx="100" ry="65" fill="url(#asteroid-surf)" stroke="#6366F1" strokeWidth="2.5" />
            <ellipse cx="520" cy="360" rx="24" ry="14" fill="#1E1B4B" stroke="#4338CA" />
            <ellipse cx="475" cy="385" rx="16" ry="10" fill="#1E1B4B" stroke="#4338CA" />

            {/* Floating Asteroid Island 4 (Stage 4 Area) */}
            <ellipse cx="690" cy="210" rx="95" ry="60" fill="url(#asteroid-surf)" stroke="#6366F1" strokeWidth="2.5" />
            <ellipse cx="670" cy="200" rx="20" ry="12" fill="#1E1B4B" stroke="#4338CA" />

            {/* Grand Mega Station Asteroid (Stage 5 Boss Area) */}
            <ellipse cx="880" cy="330" rx="115" ry="75" fill="url(#asteroid-surf)" stroke="#A855F7" strokeWidth="3" />

            {/* Sci-Fi Station Structures & Domes */}
            {/* Bio-Dome on Island 1 */}
            <path d="M 125 350 A 25 25 0 0 1 175 350 Z" fill="#06B6D4" fillOpacity="0.4" stroke="#22D3EE" strokeWidth="2" />
            {/* Satellite Array on Island 2 */}
            <line x1="330" y1="210" x2="330" y2="175" stroke="#E2E8F0" strokeWidth="3" />
            <ellipse cx="330" cy="175" rx="14" ry="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" transform="rotate(-30 330 175)" />
            {/* Solar Panels on Island 3 */}
            <rect x="475" y="320" width="30" height="12" rx="1" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1.5" />
            <rect x="515" y="320" width="30" height="12" rx="1" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1.5" />

            {/* Dreadnought Station at Island 4 */}
            <polygon points="660,180 720,165 710,195 670,200" fill="#334155" stroke="#38BDF8" strokeWidth="2" />

            {/* Supernova Omega Space Citadel on Island 5 (Boss) */}
            <g transform="translate(840, 270)">
              {/* Outer Pulsing Rings */}
              <ellipse cx="40" cy="40" rx="48" ry="18" fill="none" stroke="#C084FC" strokeWidth="3" strokeDasharray="8 4" className="animate-spin" />
              {/* Central Core Sphere */}
              <circle cx="40" cy="40" r="28" fill="#581C87" stroke="#E879F9" strokeWidth="3" />
              <circle cx="40" cy="40" r="16" fill="#A855F7" stroke="#F0ABFC" strokeWidth="2" />
              <circle cx="40" cy="40" r="6" fill="#FFFFFF" />
              {/* Spire Antennas */}
              <line x1="40" y1="12" x2="40" y2="-20" stroke="#E879F9" strokeWidth="3" />
              <circle cx="40" cy="-20" r="4" fill="#F43F5E" />
            </g>
          </g>
        );

      // -----------------------------------------------------------------------
      // 4. APOCALIPSIS ZOMBI: Toxic swamp archipelago, cracked highway, barricades, hazard dome
      // -----------------------------------------------------------------------
      case 'zombie':
        return (
          <g id="zombie-landscape">
            <defs>
              <linearGradient id="zom-swamp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14532D" />
                <stop offset="50%" stopColor="#0F381E" />
                <stop offset="100%" stopColor="#052E16" />
              </linearGradient>
              <linearGradient id="zom-ground" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4D7C0F" />
                <stop offset="50%" stopColor="#365314" />
                <stop offset="100%" stopColor="#1A2E05" />
              </linearGradient>
              <linearGradient id="zom-toxic" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#84CC16" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Toxic Sludge Swamp Base */}
            <rect width="1000" height="560" fill="url(#zom-swamp)" />

            {/* Glowing Toxic Fog */}
            <ellipse cx="280" cy="240" rx="200" ry="120" fill="url(#zom-toxic)" filter="blur(25px)" />
            <ellipse cx="720" cy="380" rx="220" ry="130" fill="url(#zom-toxic)" filter="blur(25px)" />

            {/* Decayed Landmass Archipelago */}
            <path
              d="M 60 380 C 40 250, 140 140, 310 130 C 440 120, 520 170, 620 120 C 760 70, 930 150, 950 330 C 970 470, 850 520, 690 500 C 560 480, 500 440, 410 490 C 240 560, 80 490, 60 380 Z"
              fill="#1A2E05"
            />
            <path
              d="M 75 375 C 55 260, 150 150, 310 140 C 430 130, 510 180, 610 130 C 745 85, 915 160, 935 325 C 955 450, 835 505, 680 485 C 550 465, 495 425, 405 475 C 245 540, 95 475, 75 375 Z"
              fill="url(#zom-ground)"
              filter="drop-shadow(0px 8px 12px rgba(0,0,0,0.5))"
            />

            {/* Radioactive Toxic Spill Puddles */}
            <ellipse cx="220" cy="310" rx="35" ry="18" fill="#84CC16" opacity="0.85" stroke="#4D7C0F" strokeWidth="3" />
            <ellipse cx="440" cy="220" rx="40" ry="20" fill="#84CC16" opacity="0.85" stroke="#4D7C0F" strokeWidth="3" />
            <ellipse cx="630" cy="430" rx="45" ry="22" fill="#84CC16" opacity="0.85" stroke="#4D7C0F" strokeWidth="3" />

            {/* Barricaded Broken Concrete Walls & Yellow Tape */}
            <line x1="280" y1="210" x2="310" y2="250" stroke="#EAB308" strokeWidth="5" strokeDasharray="8 4" />
            <line x1="640" y1="190" x2="670" y2="230" stroke="#EAB308" strokeWidth="5" strokeDasharray="8 4" />

            {/* Biohazard Hazard Signs */}
            <g transform="translate(180, 390)">
              <polygon points="12,0 24,20 0,20" fill="#EAB308" stroke="#713F12" strokeWidth="1.5" />
              <text x="12" y="17" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">☣</text>
            </g>
            <g transform="translate(560, 310)">
              <polygon points="12,0 24,20 0,20" fill="#EAB308" stroke="#713F12" strokeWidth="1.5" />
              <text x="12" y="17" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">☣</text>
            </g>

            {/* Abandoned Ruined Hospital at Stage 3 */}
            <g transform="translate(470, 320)">
              <rect x="0" y="0" width="50" height="35" rx="3" fill="#334155" stroke="#0F172A" strokeWidth="2" />
              {/* Red Cross Sign */}
              <rect x="20" y="8" width="10" height="18" fill="#EF4444" />
              <rect x="16" y="12" width="18" height="10" fill="#EF4444" />
              {/* Broken boarded windows */}
              <line x1="5" y1="8" x2="12" y2="15" stroke="#78350F" strokeWidth="2" />
              <line x1="35" y1="8" x2="42" y2="15" stroke="#78350F" strokeWidth="2" />
            </g>

            {/* Patient Zero Quarantine Laboratory at Stage 5 (Boss) */}
            <g transform="translate(830, 250)">
              {/* Armored Bio-Containment Dome */}
              <path d="M 10 70 A 45 45 0 0 1 90 70 Z" fill="#14532D" stroke="#84CC16" strokeWidth="4" />
              {/* Inner Glowing Core */}
              <path d="M 25 70 A 30 30 0 0 1 75 70 Z" fill="#84CC16" opacity="0.6" />
              {/* Hazard Chimneys releasing green steam */}
              <rect x="18" y="10" width="10" height="25" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="23" cy="5" r="6" fill="#84CC16" opacity="0.6" className="animate-pulse" />
              <rect x="72" y="10" width="10" height="25" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="77" cy="5" r="6" fill="#84CC16" opacity="0.6" className="animate-pulse" />
            </g>
          </g>
        );

      // -----------------------------------------------------------------------
      // 5. METRÓPOLIS CYBERPUNK: High-tech grid island, neon circuit highways, skyscrapers
      // -----------------------------------------------------------------------
      case 'cyberpunk':
        return (
          <g id="cyber-landscape">
            <defs>
              <linearGradient id="cyber-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#080B14" />
                <stop offset="50%" stopColor="#111827" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
              <linearGradient id="cyber-plate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="neon-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="neon-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>

            {/* Dark Matrix Abyss */}
            <rect width="1000" height="560" fill="url(#cyber-bg)" />

            {/* Glowing Cyber Grid Floor */}
            <g stroke="#1E3A8A" strokeWidth="1" opacity="0.4">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`gx-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="560" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`gy-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
              ))}
            </g>

            {/* Floating High-Tech Megalopolis Island Base */}
            <polygon
              points="90,370 140,170 340,120 540,170 690,110 930,160 960,360 880,500 680,480 480,520 220,530"
              fill="url(#cyber-plate)"
              stroke="#06B6D4"
              strokeWidth="3"
              filter="drop-shadow(0px 0px 20px rgba(6,182,212,0.4))"
            />

            {/* Fiber Optic Circuit Traces */}
            <path
              d="M 120 240 L 220 240 L 260 280 L 360 280 L 400 240 L 520 240 L 560 300 L 700 300"
              stroke="#EC4899"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10 5"
              opacity="0.8"
            />
            <path
              d="M 200 440 L 300 440 L 340 400 L 480 400 L 520 460 L 680 460 L 720 380 L 840 380"
              stroke="#06B6D4"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 6"
              opacity="0.8"
            />

            {/* Futuristic Skyscrapers & Hologram Billboards */}
            {/* Tower 1 */}
            <rect x="180" y="160" width="30" height="70" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
            <rect x="185" y="170" width="20" height="8" fill="#06B6D4" opacity="0.7" />
            <rect x="185" y="185" width="20" height="8" fill="#EC4899" opacity="0.7" />
            {/* Tower 2 */}
            <rect x="420" y="150" width="36" height="90" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
            <line x1="438" y1="150" x2="438" y2="120" stroke="#06B6D4" strokeWidth="3" />
            <circle cx="438" cy="120" r="4" fill="#06B6D4" />
            {/* Hologram Sign */}
            <rect x="425" y="165" width="26" height="14" fill="#3B82F6" opacity="0.8" />
            <text x="438" y="176" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">AI 9</text>

            {/* Tower 3 */}
            <rect x="620" y="130" width="40" height="100" fill="#0F172A" stroke="#EC4899" strokeWidth="2" />
            <line x1="640" y1="130" x2="640" y2="100" stroke="#EC4899" strokeWidth="3" />
            <circle cx="640" cy="100" r="4" fill="#EC4899" />

            {/* Nexus-9 Quantum Spire at Stage 5 (Boss) */}
            <g transform="translate(820, 210)">
              {/* Spire Base */}
              <polygon points="20,120 40,30 80,30 100,120" fill="#0F172A" stroke="#06B6D4" strokeWidth="3" />
              {/* Vertical Laser Core */}
              <rect x="52" y="-30" width="16" height="150" fill="#06B6D4" stroke="#67E8F9" strokeWidth="2" opacity="0.9" />
              {/* Holographic Quantum Crown */}
              <ellipse cx="60" cy="-30" rx="30" ry="12" fill="none" stroke="#EC4899" strokeWidth="3" strokeDasharray="6 3" className="animate-spin" />
              <circle cx="60" cy="-30" r="8" fill="#FFFFFF" />
            </g>
          </g>
        );

      // -----------------------------------------------------------------------
      // 6. REINO ANIMAL SALVAJE: Turquoise tropical paradise, jungle islands, waterfalls, dragon peak
      // -----------------------------------------------------------------------
      case 'animals':
      default:
        return (
          <g id="animals-landscape">
            <defs>
              <linearGradient id="ani-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="50%" stopColor="#0F766E" />
                <stop offset="100%" stopColor="#115E59" />
              </linearGradient>
              <linearGradient id="ani-jungle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="ani-sand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>

            {/* Pristine Turquoise Ocean */}
            <rect width="1000" height="560" fill="url(#ani-ocean)" />

            {/* Shallow Coral Reef Halos */}
            <path
              d="M 50 380 C 30 250, 130 130, 310 120 C 420 110, 500 150, 600 110 C 740 60, 930 130, 960 310 C 980 450, 860 530, 700 520 C 570 510, 510 470, 430 510 C 250 570, 70 510, 50 380 Z"
              fill="#2DD4BF"
              opacity="0.35"
            />

            {/* Tropical Beach Shoreline */}
            <path
              d="M 65 380 C 45 260, 140 140, 320 130 C 425 120, 505 160, 605 120 C 740 75, 920 140, 950 315 C 970 440, 850 515, 695 505 C 570 495, 510 455, 430 495 C 260 550, 85 495, 65 380 Z"
              fill="url(#ani-sand)"
            />

            {/* Dense Jungle Top Surface */}
            <path
              d="M 80 375 C 60 270, 155 155, 320 145 C 420 135, 500 175, 600 135 C 730 90, 905 155, 935 315 C 955 425, 835 495, 685 485 C 565 475, 505 435, 425 475 C 265 530, 100 475, 80 375 Z"
              fill="url(#ani-jungle)"
              filter="drop-shadow(0px 8px 12px rgba(0,0,0,0.3))"
            />

            {/* Roaring Jungle River with Waterfall */}
            <path
              d="M 520 135 Q 480 260, 530 360 T 490 485"
              stroke="#0D9488"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 520 135 Q 480 260, 530 360 T 490 485"
              stroke="#99F6E4"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Dense Palm Trees & Jungle Foliage */}
            <g fill="#14532D" stroke="#052E16" strokeWidth="2">
              <circle cx="100" cy="320" r="18" fill="#15803D" />
              <circle cx="125" cy="300" r="22" fill="#16A34A" />
              <circle cx="150" cy="330" r="16" fill="#15803D" />

              <circle cx="360" cy="190" r="20" fill="#16A34A" />
              <circle cx="390" cy="180" r="24" fill="#15803D" />

              <circle cx="630" cy="230" r="22" fill="#16A34A" />
              <circle cx="660" cy="250" r="18" fill="#15803D" />

              <circle cx="750" cy="430" r="24" fill="#16A34A" />
              <circle cx="780" cy="450" r="26" fill="#15803D" />
              <circle cx="810" cy="425" r="20" fill="#16A34A" />
            </g>

            {/* Tribal Totem Poles at Stage 2 */}
            <rect x="310" y="160" width="16" height="38" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <circle cx="318" cy="170" r="5" fill="#EF4444" />
            <circle cx="318" cy="185" r="5" fill="#EAB308" />

            {/* Dragon Mountain Peak & Sanctuary Shrine on Stage 5 (Boss) */}
            <polygon points="800,320 860,180 920,320" fill="#475569" stroke="#1E293B" strokeWidth="3" />
            <polygon points="845,215 860,180 875,215 860,225" fill="#F8FAFC" />
            {/* Dragon Altar Flame Shrine */}
            <rect x="850" y="270" width="20" height="24" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <polygon points="845,270 860,250 875,270" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="860" cy="265" r="4" fill="#FBBF24" className="animate-ping" />
          </g>
        );
    }
  };

  // Road stroke color matching world
  const getRoadColors = () => {
    switch (world.themeStyle) {
      case 'medieval':
        return {
          base: '#78350F',
          inner: '#FDE047',
          active: '#CA8A04'
        };
      case 'war':
        return {
          base: '#1C1917',
          inner: '#A8A29E',
          active: '#EAB308'
        };
      case 'space':
        return {
          base: '#312E81',
          inner: '#06B6D4',
          active: '#A855F7'
        };
      case 'zombie':
        return {
          base: '#14532D',
          inner: '#84CC16',
          active: '#FACC15'
        };
      case 'cyberpunk':
        return {
          base: '#083344',
          inner: '#06B6D4',
          active: '#EC4899'
        };
      case 'animals':
      default:
        return {
          base: '#78350F',
          inner: '#FEF08A',
          active: '#F59E0B'
        };
    }
  };

  const roadColors = getRoadColors();

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top World Header Bar with World Switcher Arrows */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-xl shadow-md">
            {world.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Mundo {world.number}: {world.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {world.themeStyle}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {world.subtitle} • {worldCompletedStagesCount}/5 Zonas superadas ({worldStarsCount}/15 ⭐)
            </p>
          </div>
        </div>

        {/* World Prev/Next Navigation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevWorld}
            disabled={!hasPrevWorld}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              hasPrevWorld
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
            }`}
            title="Mundo Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span className="text-xs font-black px-2 text-slate-600 dark:text-slate-400">
            {world.number} / {totalWorldsCount}
          </span>

          <button
            onClick={onNextWorld}
            disabled={!hasNextWorld}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              hasNextWorld
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
            }`}
            title="Siguiente Mundo"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE TOP-DOWN OVERWORLD LANDSCAPE CANVAS */}
      {/* ========================================================================= */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-300 dark:border-slate-800 shadow-2xl bg-slate-950 aspect-[16/9] max-h-[560px]">
        {/* SVG Overworld Map */}
        <svg
          viewBox="0 0 1000 560"
          className="w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* 1. Base Landscape, Islands, Grass, Cities, Terrain according to World Style */}
          {renderWorldSpecificLandscape()}

          {/* 2. Top-Down Winding Pathway / Highway Connecting Stages */}
          {/* Road shadow base */}
          <path
            d={roadPathD}
            fill="none"
            stroke={roadColors.base}
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          {/* Road inner lane */}
          <path
            d={roadPathD}
            fill="none"
            stroke={roadColors.inner}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          {/* Road glowing dotted line */}
          <path
            d={roadPathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="12 10"
            strokeLinecap="round"
            opacity="0.9"
            className="animate-pulse"
          />

          {/* 3. Interactive Stage Nodes Placed along the Path */}
          {world.stages.map((stage, idx) => {
            const coord = STAGE_COORDS[idx] || STAGE_COORDS[0];
            const unlocked = isStageUnlocked(stage);
            const stageSave = saveState.completedStages[stage.id];
            const isCompleted = !!stageSave?.completed;
            const stars = stageSave?.stars || 0;
            const isBoss = stage.stageNumber === 5;
            const isHovered = hoveredStage?.id === stage.id;
            const isCurrentHeroTarget = currentHeroStage?.id === stage.id;

            return (
              <g
                key={stage.id}
                transform={`translate(${coord.x}, ${coord.y})`}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => {
                  setHoveredStage(stage);
                  setActiveTooltipPos({ x: coord.x, y: coord.y });
                  soundSystem.playSelect();
                }}
                onMouseLeave={() => {
                  setHoveredStage(null);
                  setActiveTooltipPos(null);
                }}
                onClick={() => {
                  if (unlocked) {
                    onSelectStage(stage);
                    soundSystem.playSelect();
                  } else {
                    soundSystem.playWrong();
                  }
                }}
              >
                {/* Outer Pulsing Aura on Current/Playable Unlocked Node */}
                {unlocked && (
                  <circle
                    r={isBoss ? 38 : 30}
                    fill="none"
                    stroke={isBoss ? '#F59E0B' : '#6366F1'}
                    strokeWidth="3"
                    opacity={isHovered ? 1 : 0.6}
                    strokeDasharray="6 4"
                    className="animate-spin"
                  />
                )}

                {/* Node Outer Disc */}
                <circle
                  r={isBoss ? 32 : 24}
                  fill={
                    unlocked
                      ? isBoss
                        ? '#D97706'
                        : isCompleted
                        ? '#16A34A'
                        : '#4F46E5'
                      : '#334155'
                  }
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  filter="drop-shadow(0px 6px 10px rgba(0,0,0,0.5))"
                  className={isHovered ? 'scale-110' : ''}
                />

                {/* Inner Icon / Boss Crown / Zone Symbol */}
                <text
                  x="0"
                  y={isBoss ? 8 : 6}
                  fontSize={isBoss ? 24 : 16}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {unlocked ? (isBoss ? '👑' : stage.zoneIcon || '⚔️') : '🔒'}
                </text>

                {/* Floating Zone Number Badge below Node */}
                <g transform="translate(0, 36)">
                  <rect
                    x="-40"
                    y="-10"
                    width="80"
                    height="20"
                    rx="10"
                    fill="#0F172A"
                    stroke={unlocked ? (isBoss ? '#F59E0B' : '#818CF8') : '#475569'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="4"
                    fontSize="10"
                    fontWeight="900"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    className="pointer-events-none"
                  >
                    {isBoss ? 'Jefe' : `Nivel ${stage.stageNumber}`}
                  </text>
                </g>

                {/* Star Badges for Completed Stages */}
                {isCompleted && (
                  <g transform="translate(-20, -32)">
                    <rect x="0" y="0" width="40" height="14" rx="7" fill="#0F172A" stroke="#CA8A04" strokeWidth="1" />
                    <text x="20" y="10" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FBBF24">
                      {'⭐'.repeat(stars)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 4. Player Hero Pin on the active/current stage */}
          {heroPos && (
            <g
              transform={`translate(${heroPos.x}, ${heroPos.y - 48})`}
              className="pointer-events-none animate-bounce"
            >
              {/* Pin Banner */}
              <rect x="-35" y="-24" width="70" height="20" rx="10" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="-10" fontSize="10" fontWeight="900" textAnchor="middle" fill="#FFFFFF">
                TÚ AQUÍ 📍
              </text>
              {/* Pin Pointer */}
              <polygon points="-6,-4 6,-4 0,6" fill="#4F46E5" />
            </g>
          )}
        </svg>

        {/* Floating Quick Tooltip on Hover */}
        {hoveredStage && activeTooltipPos && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(activeTooltipPos.x / 1000) * 100}%`,
              top: `${Math.max(15, (activeTooltipPos.y / 560) * 100 - 8)}%`
            }}
          >
            <div className="p-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500 text-white shadow-2xl w-64 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-300">
                  {hoveredStage.stageNumber === 5 ? '👑 Jefe Final' : `Nivel ${hoveredStage.stageNumber}`}
                </span>
                <span className="text-[10px] font-bold text-amber-400">
                  Elo {hoveredStage.bossElo}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <img
                  src={hoveredStage.bossAvatar}
                  alt={hoveredStage.bossName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black truncate">{hoveredStage.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{hoveredStage.bossName}</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-300 line-clamp-2 italic">
                "{hoveredStage.storyIntro}"
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-bold text-amber-300">
                <span>+{hoveredStage.rewardGold} Oro 🪙</span>
                <span>+{hoveredStage.rewardXp} XP ✨</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay at Bottom-Left */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2.5 text-white flex items-center gap-3 text-xs shadow-lg pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-[11px] font-bold">Completado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span className="text-[11px] font-bold">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
            <span className="text-[11px] font-bold">Bloqueado</span>
          </div>
        </div>

        {/* Quick Launch Button at Bottom-Right */}
        {currentHeroStage && isStageUnlocked(currentHeroStage) && (
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={() => onSelectStage(currentHeroStage)}
              className="px-4 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>Continuar en {currentHeroStage.zoneName}</span>
            </button>
          </div>
        )}
      </div>

      {/* World Stages Bottom Grid / Card Drawer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {world.stages.map((stage) => {
          const unlocked = isStageUnlocked(stage);
          const stageSave = saveState.completedStages[stage.id];
          const stars = stageSave?.stars || 0;
          const isBoss = stage.stageNumber === 5;
          const isCompleted = !!stageSave?.completed;

          return (
            <div
              key={stage.id}
              onClick={() => {
                if (unlocked) {
                  onSelectStage(stage);
                  soundSystem.playSelect();
                } else {
                  soundSystem.playWrong();
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                unlocked
                  ? isBoss
                    ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/50 hover:border-amber-400 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-xs'
                  : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-200/40 dark:border-slate-800/40 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{stage.zoneIcon || '⚔️'}</span>
                  <span className={`text-[10px] font-black uppercase ${isBoss ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {isBoss ? '👑 Jefe Final' : `Nivel ${stage.stageNumber}`}
                  </span>
                </div>
                {unlocked ? (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <img
                  src={stage.bossAvatar}
                  alt={stage.bossName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {stage.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {stage.bossName} (Elo {stage.bossElo})
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                <span className="font-bold text-amber-500">
                  +{stage.rewardGold} Oro 🪙
                </span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                  <span>Jugar</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
