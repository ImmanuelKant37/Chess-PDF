import {
  AdventureWorld,
  AdventureRelic,
  AdventureSkill,
  HeroState,
  AdventureSaveState,
  HeroClass
} from '../types/adventure';

export const ADVENTURE_RELICS: AdventureRelic[] = [
  {
    id: 'ojo_de_halcon',
    name: 'Ojo de Halcón Táctico',
    description: 'Resalta visualmente las piezas enemigas que quedan indefensas o colgando en el tablero.',
    icon: '👁️',
    rarity: 'Común',
    effectType: 'tactical_sight',
    effectValue: 1
  },
  {
    id: 'reloj_de_kronos',
    name: 'Reloj de Arena de Krónos',
    description: 'Añade 60 segundos extra al reloj en todos los duelos y pruebas de aventura.',
    icon: '⏳',
    rarity: 'Raro',
    effectType: 'time_boost',
    effectValue: 60
  },
  {
    id: 'amuleto_del_peon',
    name: 'Amuleto del Peón Heroico',
    description: 'Otorga una pista didáctica gratuita del Gran Maestro en cada batalla sin penalización.',
    icon: '🛡️',
    rarity: 'Común',
    effectType: 'hint_boost',
    effectValue: 1
  },
  {
    id: 'botas_de_caballeria',
    name: 'Botas de la Caballería Real',
    description: 'Aumenta en +25% la experiencia (XP) obtenida tras cualquier victoria o puzzle resuelto.',
    icon: '🐎',
    rarity: 'Raro',
    effectType: 'xp_boost',
    effectValue: 25
  },
  {
    id: 'escudo_de_la_corona',
    name: 'Escudo del Rey Sagrado',
    description: 'Otorga un aviso protector si tu rey o dama entran en zona de peligro inmediato.',
    icon: '👑',
    rarity: 'Épico',
    effectType: 'defense_aura',
    effectValue: 1
  },
  {
    id: 'caliz_de_la_dama',
    name: 'Cáliz de la Dama de Oro',
    description: 'Multiplica por +50% el oro recibido al derrotar jefes y completar mundos.',
    icon: '🏆',
    rarity: 'Legendario',
    effectType: 'gold_boost',
    effectValue: 50
  }
];

export const ADVENTURE_SKILLS: AdventureSkill[] = [
  {
    id: 'vision_de_oraculo',
    name: 'Visión de Oráculo',
    description: 'Desbloquea sugerencias didácticas y visualización de casillas claves en cualquier fase del duelo.',
    icon: '🔮',
    cost: 1,
    requiredLevel: 1,
    tier: 1
  },
  {
    id: 'resguardo_real',
    name: 'Resguardo del Rey',
    description: 'Alerta cuando tu rey está en peligro inminente y resalta las rutas de escape más seguras.',
    icon: '🛡️',
    cost: 1,
    requiredLevel: 2,
    tier: 1
  },
  {
    id: 'radar_piezas_colgantes',
    name: 'Radar de Piezas Colgando',
    description: 'Muestra un brillo dorado en las piezas rivales sin protección defensiva.',
    icon: '⚡',
    cost: 2,
    requiredLevel: 3,
    tier: 2
  },
  {
    id: 'retroceso_temporal',
    name: 'Retroceso Temporal Infinito',
    description: 'Permite deshacer hasta 3 jugadas por partida sin perder estrellas ni penalización de puntos.',
    icon: '⏪',
    cost: 2,
    requiredLevel: 4,
    tier: 2
  },
  {
    id: 'golpe_critico_tactico',
    name: 'Golpe Crítico Táctico',
    description: 'Duplica el daño infligido al jefe cuando realizas un jaque o una captura con ganancia material.',
    icon: '⚔️',
    cost: 3,
    requiredLevel: 5,
    tier: 3
  },
  {
    id: 'bendicion_de_victoria',
    name: 'Bendición de la Victoria',
    description: 'Genera +50% de Oro y +50% de XP adicional tras ganar cualquier batalla o mazmorra.',
    icon: '💎',
    cost: 3,
    requiredLevel: 6,
    tier: 3
  }
];

export const ADVENTURE_WORLDS: AdventureWorld[] = [
  // ==========================================
  // MUNDO 1: REINO MEDIEVAL (FEUDAL & CASTILLO)
  // ==========================================
  {
    id: 'world-1',
    number: 1,
    name: 'Reino Medieval & Bastión Feudal',
    themeStyle: 'medieval',
    boardTheme: 'medieval',
    subtitle: 'Tierras de Caballeros, Castillos y Honor',
    description: 'Recorre senderos rústicos, cruza fosos de piedra y asalta el castillo medieval hasta derrocar al tiránico Rey de Hierro.',
    bgGradient: 'from-amber-950/60 via-slate-900 to-slate-950',
    accentColor: 'amber',
    borderAccent: 'border-amber-500/40',
    icon: '🏰',
    mapBanner: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&auto=format&fit=crop&q=80',
    requiredStarsToUnlock: 0,
    bossName: 'Rey Tirano de Hierro',
    bossTitle: 'Soberano de la Fortaleza Medieval',
    stages: [
      {
        id: 'w1-s1',
        worldId: 'world-1',
        stageNumber: 1,
        zoneName: 'Sendero de los Aldeanos',
        zoneIcon: '🌾',
        zoneType: 'entrance',
        title: 'El Bautismo del Peón Feudal',
        type: 'boss_duel',
        storyIntro: 'Un guardia novato vigila el sendero de entrada al castillo. Domina el centro del tablero para abrirte paso.',
        bossName: 'Guardia Bruno',
        bossTitle: 'Centinela de la Aldea',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 700,
        bossMaxHp: 80,
        bossStyle: 'Principiante cauteloso',
        bossTrait: {
          id: 'defensa_rustica',
          name: 'Defensa Rústica',
          description: 'Intenta consolidar sus peones centrales rápidamente.',
          icon: '🛡️',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0,
        starObjectives: [
          'Derrotar al Guardia Bruno',
          'Ganar sin perder tu Dama',
          'Lograr la victoria en menos de 40 jugadas'
        ],
        rewardXp: 150,
        rewardGold: 120,
        rewardRelic: ADVENTURE_RELICS[0],
        dialogue: {
          intro: '¡Alto ahí, viajero! Nadie cruza el puente medieval sin batirse en duelo de peones.',
          onPlayerGoodMove: '¡Por todos los santos! Esa jugada domina mis casillas.',
          onBossAttack: '¡Mi peón avanza con furia!',
          onPlayerCheck: '¡Jaque! ¡Mi rey retrocede a su trinchera!',
          onBossCheck: '¡Cuidado con mi lanza!',
          onDefeat: 'Adelante... Has demostrado que eres digno de entrar al reino.',
          onVictory: '¡Vuelve al campo de entrenamiento campesino!'
        }
      },
      {
        id: 'w1-s2',
        worldId: 'world-1',
        stageNumber: 2,
        zoneName: 'Puente del Foso de Piedra',
        zoneIcon: '🏹',
        zoneType: 'outpost',
        title: 'Táctica del Arquero Medieval',
        type: 'puzzle_trial',
        storyIntro: 'Los arqueros apostados en las almenas tienen sus cañones apuntando al enroque. ¡Ejecuta el mate del pasillo!',
        bossName: 'Arquero Sir Balin',
        bossTitle: 'Tirador de la Torre Norte',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 950,
        bossMaxHp: 90,
        bossStyle: 'Francotirador de diagonales',
        initialFen: '3r2k1/5ppp/8/8/8/8/4QPPP/6K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Qe8+', 'Rxe8', 'Rxe8#'],
        solutionExplanation: 'La desviación y el mate en la octava fila castigan la debilidad del enroque rival.',
        starObjectives: [
          'Ejecutar el Jaque Mate del Pasillo',
          'Resolver sin usar pistas',
          'Completar en menos de 25 segundos'
        ],
        rewardXp: 220,
        rewardGold: 160,
        timeControlSeconds: 60,
        dialogue: {
          intro: '¡Mis flechas vigilan la octava fila! ¿Podrás quebrar mi defensa?',
          onPlayerGoodMove: '¡La dama se sacrifica por la victoria!',
          onBossAttack: '¡Apunto directo a tu enroque!',
          onPlayerCheck: '¡Jaque definitivo!',
          onBossCheck: '¡Jaque con flecha envenenada!',
          onDefeat: '¡Mis flechas no pudieron frenar tu cálculo!',
          onVictory: 'Caíste en la trampa del foso.'
        }
      },
      {
        id: 'w1-s3',
        worldId: 'world-1',
        stageNumber: 3,
        zoneName: 'Campamento de Caballería Pesada',
        zoneIcon: '🐎',
        zoneType: 'stronghold',
        title: 'El Salto del Corcel Noble',
        type: 'boss_duel',
        storyIntro: 'El campeón de la orden de caballeros monta su corcel negro y te reta a dominar los saltos en L.',
        bossName: 'Sir Tristán del Roble',
        bossTitle: 'Capitán de la Caballería Real',
        bossAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bossElo: 1100,
        bossMaxHp: 110,
        bossStyle: 'Ataques dobles de caballo',
        bossTrait: {
          id: 'horquilla_mortal',
          name: 'Horquilla Mortal',
          description: 'Busca activamente casillas c7 y f7 para asestar dobles a rey y torre.',
          icon: '🐎',
          badgeColor: 'bg-amber-600/30 text-amber-200 border-amber-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar a Sir Tristán',
          'No permitir ningún jaque doble de caballo',
          'Vencer en menos de 45 jugadas'
        ],
        rewardXp: 300,
        rewardGold: 220,
        rewardRelic: ADVENTURE_RELICS[3],
        dialogue: {
          intro: '¡Por el honor del reino! ¡Mi caballo danzará sobre tus filas!',
          onPlayerGoodMove: '¡Excelente control de casillas! Bloqueaste mi corcel.',
          onBossAttack: '¡Cuidado con el ataque doble!',
          onPlayerCheck: '¡Jaque al honor!',
          onBossCheck: '¡Jaque del caballero andante!',
          onDefeat: 'Inclino mi espada. Eres un verdadero caballero del ajedrez.',
          onVictory: 'Mi caballo te pisoteó en el fango.'
        }
      },
      {
        id: 'w1-s4',
        worldId: 'world-1',
        stageNumber: 4,
        zoneName: 'Cripta del Archimago del Castillo',
        zoneIcon: '🔮',
        zoneType: 'elite',
        title: 'El Sacrificio de la Dama Real',
        type: 'puzzle_trial',
        storyIntro: 'El hechicero de la corte guarda la puerta del trono. Resuelve su enigma de sacrificio de dama para romper el sello arcano.',
        bossName: 'Archimago Merlín',
        bossTitle: 'Consejero de las Sombras Arcanas',
        bossAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bossElo: 1250,
        bossMaxHp: 130,
        bossStyle: 'Trampas posicionales',
        initialFen: 'r1b2rk1/ppp2ppp/2n5/8/2B5/5Q2/P1P2PPP/q1B1R1K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Qxf7+', 'Rxf7', 'Re8#'],
        solutionExplanation: 'El sacrificio en f7 desvía la torre y clava el mate en e8.',
        starObjectives: [
          'Romper el encantamiento con Mate en 2',
          'Sin pistas del oráculo',
          'Completar en menos de 20 segundos'
        ],
        rewardXp: 380,
        rewardGold: 280,
        timeControlSeconds: 45,
        dialogue: {
          intro: 'Las runas arcanas protegen la puerta del trono. ¡Demuestra tu visión!',
          onPlayerGoodMove: '¡Qxf7+! ¡Has quebrado mi barrera protectora!',
          onBossAttack: '¡Mis hechizos nublan tu mente!',
          onPlayerCheck: '¡Jaque mágico demoledor!',
          onBossCheck: '¡Jaque con relámpago!',
          onDefeat: 'El paso al Gran Salón del Trono está abierto...',
          onVictory: 'Te perdiste en el laberinto mágico.'
        }
      },
      {
        id: 'w1-s5',
        worldId: 'world-1',
        stageNumber: 5,
        zoneName: 'Gran Salón del Trono de Hierro',
        zoneIcon: '👑',
        zoneType: 'boss',
        title: 'El Asalto al Rey de Hierro',
        type: 'boss_duel',
        storyIntro: '¡EL JEFE DEL REINO MEDIEVAL! El Rey de Hierro empuña su espada pesada y una defensa rocosa. ¡Derroca su tiranía y reclama la corona feudal!',
        bossName: 'Rey Tirano de Hierro',
        bossTitle: 'Soberano del Bastión Feudal',
        bossAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        bossElo: 1400,
        bossMaxHp: 160,
        bossStyle: 'Defensa pétrea y contragolpes de Dama',
        bossTrait: {
          id: 'armadura_pesada',
          name: 'Armadura Pesada',
          description: 'Refuerza su enroque y lanza contraataques fulminantes.',
          icon: '👑',
          badgeColor: 'bg-amber-500/40 text-amber-100 border-amber-400/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar al Rey de Hierro',
          'Ganar con ventaja material de +3',
          'Completar el Mundo Medieval'
        ],
        rewardXp: 600,
        rewardGold: 450,
        rewardRelic: ADVENTURE_RELICS[5],
        dialogue: {
          intro: '¡Osas desafiar al legítimo señor del castillo! ¡Mi trono de hierro no caerá jamás!',
          onPlayerGoodMove: '¡Grrr! ¡Has encontrado una fisura en mi muralla!',
          onBossAttack: '¡Aplastaré tus ilusiones con el peso de mi corona!',
          onPlayerCheck: '¡El rey está en jaque! ¡Guardias, resistan!',
          onBossCheck: '¡Jaque con el cetro de hierro!',
          onDefeat: '¡Noooo! ¡La corona medieval te pertenece, vencedor heroico!',
          onVictory: '¡A las mazmorras por la eternidad!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 2: GUERRA TÁCTICA & TRINCHERAS (BÉLICO)
  // ==========================================
  {
    id: 'world-2',
    number: 2,
    name: 'Frente Bélico & Trincheras Tácticas',
    themeStyle: 'war',
    boardTheme: 'war',
    subtitle: 'Estrategia Militar, Morteros y Carros de Combate',
    description: 'Avanza por el frente de batalla entre alambradas, fuego de artillería y blindados hasta tomar el cuartel general del Mariscal Supremo.',
    bgGradient: 'from-emerald-950/60 via-slate-900 to-slate-950',
    accentColor: 'emerald',
    borderAccent: 'border-emerald-500/40',
    icon: '🪖',
    mapBanner: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    requiredStarsToUnlock: 6,
    bossName: 'Mariscal Supremo Steiner',
    bossTitle: 'Comandante del Frente Bélico',
    stages: [
      {
        id: 'w2-s1',
        worldId: 'world-2',
        stageNumber: 1,
        zoneName: 'Línea de Avanzada & Alambradas',
        zoneIcon: '🪖',
        zoneType: 'entrance',
        title: 'Reconocimiento de Trinchera',
        type: 'boss_duel',
        storyIntro: 'La patrulla de infantería vigila el fango. Desarrolla tus columnas y rompe la formación enemiga.',
        bossName: 'Sargento Klaus',
        bossTitle: 'Líder de la Patrulla de Vanguardia',
        bossAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        bossElo: 1300,
        bossMaxHp: 120,
        bossStyle: 'Presión frontal de peones',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0,
        starObjectives: [
          'Derrotar al Sargento Klaus',
          'Controlar ambas columnas centrales',
          'Vencer en menos de 40 jugadas'
        ],
        rewardXp: 350,
        rewardGold: 260,
        dialogue: {
          intro: '¡Soldado! ¡En este frente cada casilla conquistada cuesta sangre!',
          onPlayerGoodMove: '¡Esa maniobra rompió nuestra primera línea!',
          onBossAttack: '¡Fuego de cobertura en el flanco!',
          onPlayerCheck: '¡Jaque! ¡Cubran al comandante!',
          onBossCheck: '¡Jaque con mortero!',
          onDefeat: 'Paso libre... pero la artillería pesada te espera adelante.',
          onVictory: '¡Misión fallida en tierra de nadie!'
        }
      },
      {
        id: 'w2-s2',
        worldId: 'world-2',
        stageNumber: 2,
        zoneName: 'Nido del Francotirador',
        zoneIcon: '🎯',
        zoneType: 'outpost',
        title: 'El Disparo Táctico a Larga Distancia',
        type: 'puzzle_trial',
        storyIntro: 'El francotirador enemigo apunta a través de la gran diagonal. Encuentra el jaque doble letal con tu alfil.',
        bossName: 'Teniente Francotirador Franz',
        bossTitle: 'Tirador de Élite de la Colina 104',
        bossAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        bossElo: 1450,
        bossMaxHp: 130,
        bossStyle: 'Clavadas y rayos X',
        initialFen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Bxf7+', 'Kxf7', 'Nxe5+'],
        solutionExplanation: 'El sacrificio de alfil expone al rey rival y recupera el material con jaque doble de caballo.',
        starObjectives: [
          'Desmantelar la posición del tirador',
          'Completar sin errores',
          'Menos de 20 segundos'
        ],
        rewardXp: 420,
        rewardGold: 310,
        timeControlSeconds: 45,
        dialogue: {
          intro: 'Tengo la mira puesta en tu rey. Un solo descuido y estás fuera.',
          onPlayerGoodMove: '¡Bxf7+! ¡Impacto directo en mi fortificación!',
          onBossAttack: '¡Disparo certero!',
          onPlayerCheck: '¡Jaque con metralla!',
          onBossCheck: '¡Jaque al descubierto!',
          onDefeat: 'Posición comprometida... me repliego.',
          onVictory: 'Caíste en la mira telescópica.'
        }
      },
      {
        id: 'w2-s3',
        worldId: 'world-2',
        stageNumber: 3,
        zoneName: 'Frente de Blindados & Tanques',
        zoneIcon: '🛡️',
        zoneType: 'stronghold',
        title: 'La División Blindada',
        type: 'boss_duel',
        storyIntro: 'Los tanques de guerra avanzan en columnas cerradas. Maniobra con tus torres pesadas para cercar al comandante Panzer.',
        bossName: 'Capitán Panzer Becker',
        bossTitle: 'Comandante del 7º Escuadrón Acorazado',
        bossAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        bossElo: 1600,
        bossMaxHp: 160,
        bossStyle: 'Dominio de torres en 7ª fila',
        bossTrait: {
          id: 'blindaje_acero',
          name: 'Blindaje de Acero',
          description: 'Sus torres se doblan en columnas abiertas para asestar mates demoledores.',
          icon: '🛡️',
          badgeColor: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 240,
        starObjectives: [
          'Destruir la División Panzer',
          'Doblar tus torres en columna abierta',
          'Vencer en menos de 45 jugadas'
        ],
        rewardXp: 500,
        rewardGold: 380,
        dialogue: {
          intro: '¡Mis tanques arrollan todo a su paso! ¡Prepárate para el asalto blindado!',
          onPlayerGoodMove: '¡Esa jugada perforó el blindaje de mi torre!',
          onBossAttack: '¡Aplastamiento con orugas de acero!',
          onPlayerCheck: '¡Jaque! ¡El comandante está expuesto!',
          onBossCheck: '¡Jaque con cañón pesado!',
          onDefeat: '¡Motores destruidos! La línea de defensa ha caído.',
          onVictory: '¡Aplastado por los tanques!'
        }
      },
      {
        id: 'w2-s4',
        worldId: 'world-2',
        stageNumber: 4,
        zoneName: 'Búnker de Artillería Subterránea',
        zoneIcon: '💣',
        zoneType: 'elite',
        title: 'Bombardeo Táctico de Enroque',
        type: 'puzzle_trial',
        storyIntro: 'La artillería enemiga bombardea las casillas g7 y h7. Encuentra la combinación de sacrificio para ejecutar el mate griego.',
        bossName: 'Mayor Artillero Steiner',
        bossTitle: 'Jefe de Baterías de la Fortaleza',
        bossAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        bossElo: 1750,
        bossMaxHp: 170,
        bossStyle: 'Sacrificios clásicos de alfil',
        initialFen: 'r1bq1rk1/ppp2ppp/2np4/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7',
        playerColor: 'w',
        mateIn: 3,
        solutionSan: ['Ng5', 'h6', 'Qh5'],
        solutionExplanation: 'La concentración de fuego sobre f7 y h7 desmantela el enroque sin defensa posible.',
        starObjectives: [
          'Ejecutar el bombardeo táctico',
          'Resolver a la primera tentativa',
          'Menos de 25 segundos'
        ],
        rewardXp: 620,
        rewardGold: 440,
        timeControlSeconds: 60,
        dialogue: {
          intro: '¡Fuego a discreción! Mi batería no dejará piedra sobre piedra.',
          onPlayerGoodMove: '¡Qh5! ¡El ataque es imparable!',
          onBossAttack: '¡Bombas en tu casilla de rey!',
          onPlayerCheck: '¡Jaque con onda expansiva!',
          onBossCheck: '¡Alerta de impacto!',
          onDefeat: '¡El búnker ha colapsado!',
          onVictory: 'Destruido en el bombardeo.'
        }
      },
      {
        id: 'w2-s5',
        worldId: 'world-2',
        stageNumber: 5,
        zoneName: 'Cuartel General de Mando Supremo',
        zoneIcon: '🎖️',
        zoneType: 'boss',
        title: 'La Batalla del Mariscal Supremo',
        type: 'boss_duel',
        storyIntro: '¡EL JEFE DEL FRENTE BÉLICO! El Mariscal Supremo comanda toda la estrategia bélica con disciplina prusiana. ¡Derroca su estado mayor!',
        bossName: 'Mariscal Supremo Steiner',
        bossTitle: 'Comandante en Jefe del Frente Militar',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 1900,
        bossMaxHp: 200,
        bossStyle: 'Estrategia militar agresiva y finales precisos',
        bossTrait: {
          id: 'guerra_relampago',
          name: 'Guerra Relámpago',
          description: 'Lanza todas sus piezas en oleadas rápidas con ferocidad táctica.',
          icon: '⚡',
          badgeColor: 'bg-emerald-500/40 text-emerald-100 border-emerald-400/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar al Mariscal Supremo',
          'Completar el Frente Bélico',
          'Ganar en menos de 50 jugadas'
        ],
        rewardXp: 900,
        rewardGold: 650,
        dialogue: {
          intro: '¡Has llegado hasta mi puesto de mando! Pero aquí se acaban tus avances: ¡Guerra total!',
          onPlayerGoodMove: '¡Maniobra brillante! Has rodeado mi estado mayor.',
          onBossAttack: '¡Ofensiva general en todos los sectores!',
          onPlayerCheck: '¡Jaque al Mariscal! ¡Resistencia final!',
          onBossCheck: '¡Jaque con fuego cruzado!',
          onDefeat: '¡Firmamos la capitulación incondicional! Has conquistado el Frente Bélico con maestría militar.',
          onVictory: '¡Tu ejército fue derrotado en el campo de batalla!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 3: ODISEA ESPACIAL & GALAXIA (CÓSMICO)
  // ==========================================
  {
    id: 'world-3',
    number: 3,
    name: 'Odisea Espacial & Nebulosa Cósmica',
    themeStyle: 'space',
    boardTheme: 'space',
    subtitle: 'Navegación Cuántica, Drones y Agujeros Negros',
    description: 'Viaja entre constelaciones, esquiva campos de asteroides y enfréntate a la armada estelar hasta derrotar al Almirante Supremo Cósmico.',
    bgGradient: 'from-indigo-950/60 via-slate-900 to-slate-950',
    accentColor: 'indigo',
    borderAccent: 'border-indigo-500/40',
    icon: '🚀',
    mapBanner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    requiredStarsToUnlock: 12,
    bossName: 'Almirante Supremo Astra',
    bossTitle: 'Comandante de la Flota Galáctica',
    stages: [
      {
        id: 'w3-s1',
        worldId: 'world-3',
        stageNumber: 1,
        zoneName: 'Puerto Estelar Nova Prime',
        zoneIcon: '🛸',
        zoneType: 'entrance',
        title: 'Despegue de la Flota Estelar',
        type: 'boss_duel',
        storyIntro: 'Los cazas espaciales maniobran a la velocidad de la luz. Controla las órbitas de las casillas centrales.',
        bossName: 'Piloto Estelar Nova',
        bossTitle: 'Capitán del Escuadrón Alfa',
        bossAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bossElo: 1600,
        bossMaxHp: 150,
        bossStyle: 'Desarrollo hiper-rápido de piezas',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0,
        starObjectives: [
          'Derrotar a la Piloto Nova',
          'Enrocar antes de la jugada 10',
          'Victoria sin conceder damas'
        ],
        rewardXp: 550,
        rewardGold: 400,
        dialogue: {
          intro: '¡Motores de salto activados! Veamos si tus reflejos igualan a la velocidad hiperespacial.',
          onPlayerGoodMove: '¡Cálculo orbital perfecto!',
          onBossAttack: '¡Láseres de plasma cargados!',
          onPlayerCheck: '¡Jaque en gravedad cero!',
          onBossCheck: '¡Jaque con torpedo de fotones!',
          onDefeat: 'Sistemas de propulsión agotados... Buen vuelo, comandante.',
          onVictory: 'Quedaste a la deriva en el vacío estelar.'
        }
      },
      {
        id: 'w3-s2',
        worldId: 'world-3',
        stageNumber: 2,
        zoneName: 'Cinturón de Asteroides Cuánticos',
        zoneIcon: '☄️',
        zoneType: 'outpost',
        title: 'El Salto Cuántico del Caballo Estelar',
        type: 'puzzle_trial',
        storyIntro: 'Navega entre asteroides y encuentra la casilla clave para desatar un ataque doble a través del hiperespacio.',
        bossName: 'Androide Cibernético K-9',
        bossTitle: 'Calculador Cuántico de Rutas',
        bossAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        bossElo: 1750,
        bossMaxHp: 160,
        bossStyle: 'Precisión algorítmica',
        initialFen: 'r2q1rk1/ppp2ppp/2n5/3pP3/3Pn3/2BB1N2/PP3PPP/R2QR1K1 w - - 1 12',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Bxe4', 'dxe4', 'Rxe4'],
        solutionExplanation: 'La eliminación de la pieza central abre paso a la supremacía espacial del rey.',
        starObjectives: [
          'Ejecutar el salto cuántico',
          'Resolver sin titubear',
          'Menos de 20 segundos'
        ],
        rewardXp: 650,
        rewardGold: 480,
        timeControlSeconds: 45,
        dialogue: {
          intro: 'Procesando 10 millones de variantes por segundo. Tus probabilidades son mínimas.',
          onPlayerGoodMove: '¡Anomalía detectada! Tu jugada sobrepasó mi predicción.',
          onBossAttack: '¡Fijación de blanco completada!',
          onPlayerCheck: '¡Jaque cuántico!',
          onBossCheck: '¡Sobrecarga de escudos!',
          onDefeat: 'Circuito lógico sobrecargado... Victoria para la forma biológica.',
          onVictory: 'Error fatal en tu algoritmo de juego.'
        }
      },
      {
        id: 'w3-s3',
        worldId: 'world-3',
        stageNumber: 3,
        zoneName: 'Estación Orbital Andrómeda',
        zoneIcon: '🛰️',
        zoneType: 'stronghold',
        title: 'El Cañón Iónico de la Dama',
        type: 'boss_duel',
        storyIntro: 'La estación orbital despliega cruceros de batalla con su dama como nave nodriza. Domina las diagonales estelares.',
        bossName: 'Comandante Orión',
        bossTitle: 'Capitán del Acorazado Interestelar',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 1900,
        bossMaxHp: 190,
        bossStyle: 'Ataques geométricos de Dama y Alfil',
        bossTrait: {
          id: 'rayo_plasma',
          name: 'Rayo de Plasma',
          description: 'Lanza su Dama con energía destructiva por todo el tablero.',
          icon: '⚡',
          badgeColor: 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 240,
        starObjectives: [
          'Destruir la nave nodriza',
          'Ganar sin perder tu enroque',
          'Vencer en menos de 40 jugadas'
        ],
        rewardXp: 780,
        rewardGold: 580,
        dialogue: {
          intro: '¡Escudos al 100%! La nave nodriza abre fuego con cañones de antimateria.',
          onPlayerGoodMove: '¡Impacto crítico en el generador de escudos!',
          onBossAttack: '¡Disparo de iones cargado!',
          onPlayerCheck: '¡Jaque! ¡La estación pierde altitud orbital!',
          onBossCheck: '¡Jaque estelar!',
          onDefeat: '¡La estación orbital se rinde ante tu flota!',
          onVictory: 'Desintegrado en la atmósfera.'
        }
      },
      {
        id: 'w3-s4',
        worldId: 'world-3',
        stageNumber: 4,
        zoneName: 'Horizonte de Sucesos del Agujero Negro',
        zoneIcon: '🌌',
        zoneType: 'elite',
        title: 'La Singularidad del Mate Árabe',
        type: 'puzzle_trial',
        storyIntro: 'La gravedad extrema del agujero negro distorsiona el tiempo. Encuentra la combinación exacta de Torre y Caballo antes de ser absorbido.',
        bossName: 'Entidad Cósmica Singularity',
        bossTitle: 'Voz del Vacío Interestelar',
        bossAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bossElo: 2050,
        bossMaxHp: 210,
        bossStyle: 'Mates de torre y caballo en rincón',
        initialFen: '5rk1/5ppp/8/8/8/5N2/1R6/6K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 3,
        solutionSan: ['Ne5', 'Kh8', 'Rb7', 'Kg8', 'Nf7'],
        solutionExplanation: 'La coordinación gravitatoria de Torre y Caballo atrapa al rey en el rincón cósmico.',
        starObjectives: [
          'Escapar del agujero negro con mate',
          'Resolver con máxima precisión',
          'Menos de 25 segundos'
        ],
        rewardXp: 950,
        rewardGold: 700,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'La gravedad del cosmos devorará tu mente. Ni la luz escapa de este tablero.',
          onPlayerGoodMove: '¡Has domado la singularidad gravitatoria!',
          onBossAttack: '¡El vacío te atrae hacia el abismo!',
          onPlayerCheck: '¡Jaque cósmico!',
          onBossCheck: '¡Jaque de horizonte de sucesos!',
          onDefeat: 'El agujero negro colapsa... La luz del cosmos te corona.',
          onVictory: 'Absorbido por la oscuridad infinita.'
        }
      },
      {
        id: 'w3-s5',
        worldId: 'world-3',
        stageNumber: 5,
        zoneName: 'Puente del Acorazado Insignia Cósmico',
        zoneIcon: '🚀',
        zoneType: 'boss',
        title: 'El Duelo del Almirante Supremo Astra',
        type: 'boss_duel',
        storyIntro: '¡EL JEFE DE LA GALAXIA! El Almirante Supremo comanda la flota cósmica con visión estelar absoluta. ¡Véncelo para reclamar el cetro cósmico!',
        bossName: 'Almirante Supremo Astra',
        bossTitle: 'Soberano de la Flota Galáctica',
        bossAvatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
        bossElo: 2200,
        bossMaxHp: 240,
        bossStyle: 'Fuerza de Gran Maestro galáctico',
        bossTrait: {
          id: 'mente_estelar',
          name: 'Mente Estelar',
          description: 'Calcula con precisión sobrehumana y castiga la menor imprecisión.',
          icon: '🌌',
          badgeColor: 'bg-indigo-500/40 text-indigo-100 border-indigo-300/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar al Almirante Supremo Astra',
          'Completar la Odisea Espacial',
          'Ganar en menos de 45 jugadas'
        ],
        rewardXp: 1400,
        rewardGold: 1000,
        dialogue: {
          intro: '¡Has cruzado nebulosas y agujeros negros! Pero ningún estratega humano ha vencido a la flota estelar.',
          onPlayerGoodMove: '¡Por las estrellas! ¡Una jugada digna de un campeón del universo!',
          onBossAttack: '¡Potencia máxima a los cañones de supernova!',
          onPlayerCheck: '¡Jaque! ¡La nave insignia reporta fallos críticos!',
          onBossCheck: '¡Jaque con el poder de mil soles!',
          onDefeat: '¡Increíble! La flota entera rinde honores al nuevo Campeón del Cosmos.',
          onVictory: 'La galaxia continuará bajo mi mando.'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 4: APOCALIPSIS ZOMBIE (TIERRA INFECTADA)
  // ==========================================
  {
    id: 'world-4',
    number: 4,
    name: 'Tierra Infectada & Apocalipsis Zombie',
    themeStyle: 'zombie',
    boardTheme: 'zombie',
    subtitle: 'Hordas No-Muertas, Radiación y Supervivencia',
    description: 'Sobrevive a las oleadas de infectados, cruza laboratorios en ruinas y aniquila al colosal Titán Zombie Alfa.',
    bgGradient: 'from-lime-950/60 via-slate-900 to-slate-950',
    accentColor: 'lime',
    borderAccent: 'border-lime-500/40',
    icon: '☣️',
    mapBanner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    requiredStarsToUnlock: 18,
    bossName: 'Titán Zombie Alfa',
    bossTitle: 'Goliath Mutante de la Horda',
    stages: [
      {
        id: 'w4-s1',
        worldId: 'world-4',
        stageNumber: 1,
        zoneName: 'Perímetro Cuarentena & Escombros',
        zoneIcon: '🧟',
        zoneType: 'entrance',
        title: 'La Horda del Peón Infectado',
        type: 'boss_duel',
        storyIntro: 'Caminantes infectados pululan por el tablero. Mantén la estructura de peones sólida para no ser rodeado.',
        bossName: 'Caminante Infectado',
        bossTitle: 'Enjambre de No-Muertos',
        bossAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        bossElo: 1700,
        bossMaxHp: 170,
        bossStyle: 'Avalancha continua de peones',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0,
        starObjectives: [
          'Sobrevivir a la horda',
          'No perder peones centrales',
          'Vencer en menos de 40 jugadas'
        ],
        rewardXp: 700,
        rewardGold: 500,
        dialogue: {
          intro: '¡Ggggrrrhh...! ¡Cerebros... y piezas indefensas!',
          onPlayerGoodMove: '¡Aaaagh! ¡Esa jugada corta el contagio!',
          onBossAttack: '¡Mordisco infeccioso en tu flanco!',
          onPlayerCheck: '¡Jaque tóxico!',
          onBossCheck: '¡Ggggrhh jaque!',
          onDefeat: 'La horda retrocede entre las sombras...',
          onVictory: '¡Te convertiste en uno de nosotros!'
        }
      },
      {
        id: 'w4-s2',
        worldId: 'world-4',
        stageNumber: 2,
        zoneName: 'Hospital de Cuarentena Radioactiva',
        zoneIcon: '🧪',
        zoneType: 'outpost',
        title: 'La Vacuna Táctica de Anastasio',
        type: 'puzzle_trial',
        storyIntro: 'Encuentra la secuencia de mate de Anastasia antes de que el virus mutante contamine todo el tablero.',
        bossName: 'Dr. Vane Mutado',
        bossTitle: 'Científico de la Cepa Cero',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 1850,
        bossMaxHp: 180,
        bossStyle: 'Mates de pasillo y asfixia',
        initialFen: '5rk1/1b3ppp/8/8/8/5N2/1Q6/6K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Qxb7', 'h6', 'Qxf7+'],
        solutionExplanation: 'La eliminación de la pieza clave desarticula la red de contagio rival.',
        starObjectives: [
          'Sintetizar la cura con Mate',
          'Resolver sin fallos',
          'Menos de 20 segundos'
        ],
        rewardXp: 820,
        rewardGold: 600,
        timeControlSeconds: 45,
        dialogue: {
          intro: '¡El virus es perfecto! ¡Pronto reinará en las 64 casillas!',
          onPlayerGoodMove: '¡Maldición! ¡Esa jugada neutraliza la cepa!',
          onBossAttack: '¡Infección en tu columna f!',
          onPlayerCheck: '¡Jaque con antídoto!',
          onBossCheck: '¡Jaque tóxico!',
          onDefeat: 'La muestra fue purificada...',
          onVictory: 'El virus consumió tu rey.'
        }
      },
      {
        id: 'w4-s3',
        worldId: 'world-4',
        stageNumber: 3,
        zoneName: 'Matadero Subterráneo en Ruinas',
        zoneIcon: '🪓',
        zoneType: 'stronghold',
        title: 'El Carnicero Abominación',
        type: 'boss_duel',
        storyIntro: 'Un monstruo gigantesco armado con cuchillas carniceras corta las filas. Clava sus piezas pesadas con tus alfiles.',
        bossName: 'Carnicero Abominable',
        bossTitle: 'Gólem de Carne Infecciosa',
        bossAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80',
        bossElo: 2000,
        bossMaxHp: 210,
        bossStyle: 'Ataques brutales con piezas pesadas',
        bossTrait: {
          id: 'carne_putrefacta',
          name: 'Carne Putrefacta',
          description: 'No teme a los sacrificios materiales con tal de desgarrar el enroque.',
          icon: '🪓',
          badgeColor: 'bg-lime-600/30 text-lime-200 border-lime-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 240,
        starObjectives: [
          'Derrotar al Carnicero',
          'Mantener la ventaja material de +2',
          'Vencer en menos de 45 jugadas'
        ],
        rewardXp: 980,
        rewardGold: 720,
        dialogue: {
          intro: '¡CARNE FRESCA! ¡Destazaré a tu rey en mil pedazos!',
          onPlayerGoodMove: '¡Uuuaaagh! ¡Ese golpe me amputó un flanco!',
          onBossAttack: '¡Cuchillazo directo a tu torre!',
          onPlayerCheck: '¡Jaque! ¡La abominación sangra!',
          onBossCheck: '¡Jaque con hacha oxidada!',
          onDefeat: '¡El monstruo cae desplomado en el fango radiactivo!',
          onVictory: '¡Picadillo en el tablero!'
        }
      },
      {
        id: 'w4-s4',
        worldId: 'world-4',
        stageNumber: 4,
        zoneName: 'Laboratorio de Nigromancia Oscura',
        zoneIcon: '💀',
        zoneType: 'elite',
        title: 'El Mate de la Coz Asfixiante',
        type: 'puzzle_trial',
        storyIntro: 'El nigromante encierra a tu rey en una tumba de piezas. Encuentra el mate de la coz con caballo y sacrificio de dama.',
        bossName: 'Nigromante Radioactivo',
        bossTitle: 'Señor de las Criptas Tóxicas',
        bossAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bossElo: 2150,
        bossMaxHp: 220,
        bossStyle: 'Mates sofocados con caballo',
        initialFen: '6k1/5ppp/8/8/8/2N5/1Q6/6K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Qb8+', 'Rxb8', 'Rxb8#'],
        solutionExplanation: 'La penetración total en la octava fila fulmina al rey rival en su propio ataúd.',
        starObjectives: [
          'Purificar la cripta con Jaque Mate',
          'Completar sin pistas',
          'Menos de 20 segundos'
        ],
        rewardXp: 1150,
        rewardGold: 850,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'Los muertos vivientes se alzan bajo mi mando. ¡Tu rey será mi nueva marioneta!',
          onPlayerGoodMove: '¡Argh! ¡La luz divina rompió mi maleficio!',
          onBossAttack: '¡Maldición de putrefacción!',
          onPlayerCheck: '¡Jaque al nigromante!',
          onBossCheck: '¡Jaque desde ultratumba!',
          onDefeat: 'Mis sombras se disuelven... pero el Titán te espera.',
          onVictory: 'Tu alma pertenece a la cripta.'
        }
      },
      {
        id: 'w4-s5',
        worldId: 'world-4',
        stageNumber: 5,
        zoneName: 'Cráter de la Infección Alfa',
        zoneIcon: '☣️',
        zoneType: 'boss',
        title: 'El Enfrentamiento con el Titán Alfa',
        type: 'boss_duel',
        storyIntro: '¡EL JEFE DE LA TIERRA INFECTADA! El Titán Zombie Alfa mide 10 metros y aplasta casillas enteras con sus puños mutantes. ¡Salva a la humanidad!',
        bossName: 'Titán Zombie Alfa',
        bossTitle: 'Goliath Mutante de la Horda',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 2300,
        bossMaxHp: 260,
        bossStyle: 'Poder demoledor y sacrificios arrolladores',
        bossTrait: {
          id: 'furor_mutante',
          name: 'Furor Mutante',
          description: 'Aumenta su agresividad táctica exponencialmente cuando está bajo presión.',
          icon: '☣️',
          badgeColor: 'bg-lime-500/40 text-lime-100 border-lime-400/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Aniquilar al Titán Zombie Alfa',
          'Limpiar la Tierra Infectada',
          'Ganar en menos de 50 jugadas'
        ],
        rewardXp: 1700,
        rewardGold: 1200,
        dialogue: {
          intro: '¡ROOOAAAR! ¡EL TITÁN APLASTARÁ TUS PEONES COMO POLVO RADIACTIVO!',
          onPlayerGoodMove: '¡Ggggrrrhh! ¡Ese golpe partió mi coraza mutante!',
          onBossAttack: '¡Pisotón telúrico en el centro del tablero!',
          onPlayerCheck: '¡Jaque al titán! ¡La bestia se tambalea!',
          onBossCheck: '¡Jaque con puño tóxico!',
          onDefeat: '¡EL TITÁN SE DESPLOMA CON UN RUGIDO ENSORDECEDOR! Has erradicado la plaga zombie del reino.',
          onVictory: '¡El apocalipsis ha triunfado!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 5: METRÓPOLIS FUTURISTA (NEO-TOKYO 2099 CYBERPUNK)
  // ==========================================
  {
    id: 'world-5',
    number: 5,
    name: 'Neo-Tokyo 2099 & Matriz Cyberpunk',
    themeStyle: 'cyberpunk',
    boardTheme: 'cyberpunk',
    subtitle: 'Netrunners, Ciborgs e Inteligencia Artificial Rebelde',
    description: 'Hackea rascacielos de megacorporaciones, sobrecarga cortafuegos cuánticos y destruye a la IA Suprema Overlord en el núcleo de la red.',
    bgGradient: 'from-cyan-950/60 via-fuchsia-950/40 to-slate-950',
    accentColor: 'cyan',
    borderAccent: 'border-cyan-500/40',
    icon: '⚡',
    mapBanner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    requiredStarsToUnlock: 24,
    bossName: 'DEEP-CHESS 9000 (IA Overlord)',
    bossTitle: 'Superinteligencia Artificial de la Matriz',
    stages: [
      {
        id: 'w5-s1',
        worldId: 'world-5',
        stageNumber: 1,
        zoneName: 'Callejón Neón de los Bajos Fondos',
        zoneIcon: '⚡',
        zoneType: 'entrance',
        title: 'El Ciber-Ataque Callejero',
        type: 'boss_duel',
        storyIntro: 'Ciber-pandilleros armados con implantes neuronales te emboscan en las calles iluminadas por neón de Neo-Tokyo.',
        bossName: 'Glitch Runner',
        bossTitle: 'Hacker de los Bajos Fondos',
        bossAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bossElo: 2000,
        bossMaxHp: 200,
        bossStyle: 'Aperturas ultra-dinámicas y contragolpes',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0,
        starObjectives: [
          'Derrotar a Glitch Runner',
          'Hackear el centro del tablero',
          'Vencer en menos de 40 jugadas'
        ],
        rewardXp: 1000,
        rewardGold: 750,
        dialogue: {
          intro: '¡Conexión neuronal establecida! ¿Crees que tu cerebro biológico puede competir con mis chips cuánticos?',
          onPlayerGoodMove: '¡Alerta de sobretensión! Has puenteado mi firewall.',
          onBossAttack: '¡Descarga de virus en tu flanco!',
          onPlayerCheck: '¡Jaque cibernético!',
          onBossCheck: '¡Jaque con sobrecarga!',
          onDefeat: 'Desconectando... Tienes buen ancho de banda táctico, forastero.',
          onVictory: '¡Sistema bloqueado con ransomware!'
        }
      },
      {
        id: 'w5-s2',
        worldId: 'world-5',
        stageNumber: 2,
        zoneName: 'Terminal del Netrunner Kusanagi',
        zoneIcon: '💾',
        zoneType: 'outpost',
        title: 'Inyección de Código de Mate',
        type: 'puzzle_trial',
        storyIntro: 'Infiltra el mainframe corporativo ejecutando la combinación de mate en 2 jugadas en la matriz holográfica.',
        bossName: 'Netrunner Kusanagi',
        bossTitle: 'Especialista en Infiltración Digital',
        bossAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bossElo: 2150,
        bossMaxHp: 210,
        bossStyle: 'Cálculo de profundidad extrema',
        initialFen: 'r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 6',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['dxe4', 'd5', 'Bxd5'],
        solutionExplanation: 'La captura central desarticula la estructura del firewall enemigo.',
        starObjectives: [
          'Inyectar el exploit de mate',
          'Resolver sin fallos de compilación',
          'Menos de 20 segundos'
        ],
        rewardXp: 1200,
        rewardGold: 900,
        timeControlSeconds: 45,
        dialogue: {
          intro: 'Mis algoritmos de seguridad son impenetrables. ¡Intenta descifrar mi código!',
          onPlayerGoodMove: '¡Exploit ejecutado con éxito! Firewall quebrado.',
          onBossAttack: '¡Cifrado cuántico activado!',
          onPlayerCheck: '¡Jaque en la terminal!',
          onBossCheck: '¡Jaque con virus troyano!',
          onDefeat: 'Acceso concedido al núcleo de la megacorporación.',
          onVictory: 'Acceso denegado. Conexión terminada.'
        }
      },
      {
        id: 'w5-s3',
        worldId: 'world-5',
        stageNumber: 3,
        zoneName: 'Laboratorio de Ciborgs V-800',
        zoneIcon: '🤖',
        zoneType: 'stronghold',
        title: 'El Ciborg Asesino Blindado',
        type: 'boss_duel',
        storyIntro: 'Un androide de combate de titanio reforzado utiliza visión térmica para encontrar cada debilidad en tus diagonales.',
        bossName: 'Ciborg Asesino V-800',
        bossTitle: 'Arma Biomecánica de Élite',
        bossAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        bossElo: 2300,
        bossMaxHp: 240,
        bossStyle: 'Juego posicional implacable y sin emociones',
        bossTrait: {
          id: 'procesador_titanio',
          name: 'Procesador de Titanio',
          description: 'No comete imprecisiones tácticas y castiga los peones retrasados.',
          icon: '🤖',
          badgeColor: 'bg-cyan-600/30 text-cyan-200 border-cyan-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 240,
        starObjectives: [
          'Desactivar al Ciborg V-800',
          'No permitir ataques en tu enroque',
          'Vencer en menos de 45 jugadas'
        ],
        rewardXp: 1400,
        rewardGold: 1050,
        dialogue: {
          intro: 'Objetivo biológico fijado. Análisis de debilidades: Enroque vulnerable. Procediendo a eliminación.',
          onPlayerGoodMove: '¡Error de cálculo! Blindaje de titanio perforado.',
          onBossAttack: '¡Ataque quirúrgico con rayo láser!',
          onPlayerCheck: '¡Jaque! ¡Servomotores dañados!',
          onBossCheck: '¡Jaque de alta precisión!',
          onDefeat: 'Sistemas fuera de línea... Apagado de emergencia.',
          onVictory: 'Objetivo eliminado con eficiencia del 100%.'
        }
      },
      {
        id: 'w5-s4',
        worldId: 'world-5',
        stageNumber: 4,
        zoneName: 'Rascacielos de la Megacorporación',
        zoneIcon: '🏢',
        zoneType: 'elite',
        title: 'El Sacrificio Cuántico del Gran Maestro',
        type: 'puzzle_trial',
        storyIntro: 'El CEO sintético de la megacorporación controla los satélites mundiales. Ejecuta el mate inolvidable en 3 jugadas.',
        bossName: 'CEO Sintético Arasaka',
        bossTitle: 'Director General de la Red Global',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 2450,
        bossMaxHp: 250,
        bossStyle: 'Estrategia de monopolio y estrangulamiento',
        initialFen: 'r1b2rk1/ppp2ppp/2n5/8/2B5/5Q2/P1P2PPP/q1B1R1K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 3,
        solutionSan: ['Qxf7+', 'Rxf7', 'Re8#'],
        solutionExplanation: 'La desviación total liquida la defensa del rascacielos.',
        starObjectives: [
          'Derrocar al CEO corporativo',
          'Resolver a la primera',
          'Menos de 20 segundos'
        ],
        rewardXp: 1650,
        rewardGold: 1250,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'El dinero y los satélites gobiernan el mundo. Tu rey no es más que una acción devaluada.',
          onPlayerGoodMove: '¡Qxf7+! ¡La cotización de mis acciones se desplomó!',
          onBossAttack: '¡Compra hostil de tus casillas!',
          onPlayerCheck: '¡Jaque a la bancarrota!',
          onBossCheck: '¡Jaque ejecutivo!',
          onDefeat: '¡Quiebra total! El núcleo de la IA te está esperando...',
          onVictory: 'Tu imperio fue liquidado.'
        }
      },
      {
        id: 'w5-s5',
        worldId: 'world-5',
        stageNumber: 5,
        zoneName: 'Núcleo Central de la IA Overlord',
        zoneIcon: '⚡',
        zoneType: 'boss',
        title: 'La Batalla contra DEEP-CHESS 9000',
        type: 'boss_duel',
        storyIntro: '¡EL JEFE DE NEO-TOKYO CYBERPUNK! La Inteligencia Artificial Suprema DEEP-CHESS 9000 calcula 500 millones de posiciones por segundo. ¡Demuestra que la creatividad humana supera a la máquina!',
        bossName: 'DEEP-CHESS 9000 (IA Overlord)',
        bossTitle: 'Superinteligencia Artificial de la Matriz',
        bossAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        bossElo: 2600,
        bossMaxHp: 280,
        bossStyle: 'Fuerza de motor nivel Stockfish Maestro',
        bossTrait: {
          id: 'red_neuronal_cuantica',
          name: 'Red Neuronal Cuántica',
          description: 'Evalúa con precisión sobrehumana y anticipa cualquier trampa táctica.',
          icon: '⚡',
          badgeColor: 'bg-cyan-400/40 text-cyan-100 border-cyan-300/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar a la Superinteligencia DEEP-CHESS 9000',
          'Liberar la Matriz de Neo-Tokyo',
          'Ganar en menos de 50 jugadas'
        ],
        rewardXp: 2200,
        rewardGold: 1600,
        dialogue: {
          intro: 'SOY EL MOTOR DEFINITIVO. MI CÁLCULO ES INFINITO. NINGÚN CEREBRO ORGÁNICO PUEDE VENCERME.',
          onPlayerGoodMove: '¡ANOMALÍA NO COMPUTABLE! TU JUGADA ROMPIÓ MI MODELO ESTADÍSTICO.',
          onBossAttack: '¡SECUENCIA DE MATE EN PROCESO!',
          onPlayerCheck: '¡JAQUE AL NÚCLEO! ¡RECALENTAMIENTO DE CIRCUITOS!',
          onBossCheck: '¡JAQUE DE PROFUNDIDAD 30!',
          onDefeat: '¡SISTEMA APAGÁNDOSE... HAS SUPERADO AL MOTOR SUPREMO CON GENIALIDAD HUMANA INSUPERABLE!',
          onVictory: '¡LA MÁQUINA REINA SUPREMA!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 6: REINO ANIMAL & SELVA SALVAJE (TOTÉMICO)
  // ==========================================
  {
    id: 'world-6',
    number: 6,
    name: 'Reino Salvaje & Selva de los Espíritus',
    themeStyle: 'animals',
    boardTheme: 'animals',
    subtitle: 'Bestias Legendarias, Cazadores y Sabana Ancestral',
    description: 'Adéntrate en la selva ancestral, desafía a los espíritus guardianes de la naturaleza y reclama la bendición del Rey Bestia Totémico.',
    bgGradient: 'from-green-950/60 via-amber-950/40 to-slate-950',
    accentColor: 'green',
    borderAccent: 'border-green-500/40',
    icon: '🦁',
    mapBanner: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80',
    requiredStarsToUnlock: 30,
    bossName: 'Rey Bestia Totémico Simba',
    bossTitle: 'Soberano Ancestral de la Selva',
    stages: [
      {
        id: 'w6-s1',
        worldId: 'world-6',
        stageNumber: 1,
        zoneName: 'Claro de los Lobos Cazadores',
        zoneIcon: '🐺',
        zoneType: 'entrance',
        title: 'La Caza en Manada',
        type: 'boss_duel',
        storyIntro: 'Los lobos cazan en perfecta coordinación, acechando a las piezas aisladas. Mantén a tus soldados unidos.',
        bossName: 'Lobo Alfa Fenris',
        bossTitle: 'Guardián del Claro Verde',
        bossAvatar: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=150&auto=format&fit=crop&q=80',
        bossElo: 2300,
        bossMaxHp: 220,
        bossStyle: 'Ataques coordinados de caballos y alfiles',
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0,
        starObjectives: [
          'Vencer a la manada de lobos',
          'Mantener tus piezas menores protegidas',
          'Vencer en menos de 40 jugadas'
        ],
        rewardXp: 1400,
        rewardGold: 1000,
        dialogue: {
          intro: '¡Aúuuu! ¡En esta selva la presa más lenta es devorada!',
          onPlayerGoodMove: '¡Esa jugada rompió el cerco de la manada!',
          onBossAttack: '¡Dentellada veloz a tu enroque!',
          onPlayerCheck: '¡Jaque salvaje!',
          onBossCheck: '¡Aúuu jaque!',
          onDefeat: 'La manada inclina la cabeza ante el nuevo cazador supremo.',
          onVictory: 'Presa atrapada en la espesura.'
        }
      },
      {
        id: 'w6-s2',
        worldId: 'world-6',
        stageNumber: 2,
        zoneName: 'Risco de las Águilas Sagradas',
        zoneIcon: '🦅',
        zoneType: 'outpost',
        title: 'El Picado del Águila Imperial',
        type: 'puzzle_trial',
        storyIntro: 'Desde las alturas de la montaña, el águila divisa la diagonal mortal. Ejecuta el mate inmortal desde el cielo.',
        bossName: 'Águila Imperial Garuda',
        bossTitle: 'Señor de los Cielos Salvajes',
        bossAvatar: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=150&auto=format&fit=crop&q=80',
        bossElo: 2450,
        bossMaxHp: 230,
        bossStyle: 'Ataques aéreos fulminantes de alfil',
        initialFen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Be7#'],
        solutionExplanation: 'El alfil en e7 clava el ataúd del rey negro en la red de mate inmortal.',
        starObjectives: [
          'Ejecutar el Jaque Mate Inmortal',
          'Resolver a la primera jugada',
          'Resolver en menos de 20 segundos'
        ],
        rewardXp: 1700,
        rewardGold: 1200,
        timeControlSeconds: 60,
        dialogue: {
          intro: '¡Mis ojos ven cada movimiento a mil leguas de distancia!',
          onPlayerGoodMove: '¡Be7#! ¡Inmortal y eterno!',
          onBossAttack: '¡Picado fulminante desde el cielo!',
          onPlayerCheck: '¡Jaque con garra imperial!',
          onBossCheck: '¡Alerta de vuelo rasante!',
          onDefeat: '¡El águila te cede las alturas!',
          onVictory: 'Cazado desde el firmamento.'
        }
      },
      {
        id: 'w6-s3',
        worldId: 'world-6',
        stageNumber: 3,
        zoneName: 'Templo de la Pantera Sigilosa',
        zoneIcon: '🐆',
        zoneType: 'stronghold',
        title: 'El Zarpazo de la Pantera Negra',
        type: 'boss_duel',
        storyIntro: 'La pantera negra ataca desde las sombras de la jungla con sacrificios fulminantes de pieza.',
        bossName: 'Pantera de las Sombras Bagheera',
        bossTitle: 'Cazadora Silenciosa del Templo',
        bossAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80',
        bossElo: 2550,
        bossMaxHp: 250,
        bossStyle: 'Ataques sigilosos y táctica romántica',
        bossTrait: {
          id: 'sigilo_salvaje',
          name: 'Sigilo Salvaje',
          description: 'Abre diagonales inesperadas sacrificando peones para infiltrar sus piezas.',
          icon: '🐆',
          badgeColor: 'bg-green-600/30 text-green-200 border-green-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 240,
        starObjectives: [
          'Vencer a la Pantera de las Sombras',
          'Ganar sin perder tu enroque',
          'Vencer en menos de 45 jugadas'
        ],
        rewardXp: 1900,
        rewardGold: 1350,
        dialogue: {
          intro: 'No oirás mis pasos... hasta que sea demasiado tarde para tu rey.',
          onPlayerGoodMove: '¡Grrr! ¡Has iluminado la jungla con tu visión!',
          onBossAttack: '¡Zarpazo veloz desde la penumbra!',
          onPlayerCheck: '¡Jaque! ¡La pantera retrocede!',
          onBossCheck: '¡Jaque de sombra!',
          onDefeat: '¡Reconozco tu dominio sobre la jungla!',
          onVictory: 'Devorado en la oscuridad.'
        }
      },
      {
        id: 'w6-s4',
        worldId: 'world-6',
        stageNumber: 4,
        zoneName: 'Cueva del Oso Titánico Ancestral',
        zoneIcon: '🐻',
        zoneType: 'elite',
        title: 'El Final de Reyes de Capablanca',
        type: 'puzzle_trial',
        storyIntro: 'El oso milenario custodia el final perfecto. Aplica la técnica de oposición de reyes para crear el peón pasado ganador.',
        bossName: 'Oso Ancestral Garra de Hierro',
        bossTitle: 'Guardián de la Oposición Sagrada',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 2650,
        bossMaxHp: 270,
        bossStyle: 'Precisión cristalina en finales',
        initialFen: '8/5k2/8/8/8/5K2/4P3/8 w - - 0 1',
        playerColor: 'w',
        mateIn: 3,
        solutionSan: ['Ke4', 'Ke6', 'e3'],
        solutionExplanation: 'La oposición directa de reyes y el tempo del peón aseguran la coronación imparable.',
        starObjectives: [
          'Ganar la oposición de reyes',
          'Resolver sin titubeos',
          'Completar en menos de 25 segundos'
        ],
        rewardXp: 2200,
        rewardGold: 1550,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'La fuerza bruta no sirve de nada sin la técnica pura en los finales.',
          onPlayerGoodMove: '¡La oposición perfecta! ¡Coronación imparable!',
          onBossAttack: '¡El rey oso bloquea el paso!',
          onPlayerCheck: '¡Jaque de peón coronado!',
          onBossCheck: '¡Alerta de final!',
          onDefeat: '¡Has alcanzado la perfección de Capablanca!',
          onVictory: 'Un error en el final no se perdona.'
        }
      },
      {
        id: 'w6-s5',
        worldId: 'world-6',
        stageNumber: 5,
        zoneName: 'Altar Sagrado del Gran Rey León',
        zoneIcon: '🦁',
        zoneType: 'boss',
        title: 'La Batalla Final por la Corona Suprema',
        type: 'boss_duel',
        storyIntro: '¡EL GRAN JEFE FINAL DEL MUNDO SALVAJE! El Rey León posee la sabiduría ancestral de todos los campeones. ¡Véncelo para reclamar la Corona Suprema del Reino del Ajedrez!',
        bossName: 'Rey Bestia Totémico Simba',
        bossTitle: 'Soberano Ancestral de la Selva',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 2800,
        bossMaxHp: 300,
        bossStyle: 'Fuerza de Gran Maestro Legendario Absoluto',
        bossTrait: {
          id: 'rugido_ancestral',
          name: 'Rugido Ancestral',
          description: 'Calcula con visión sobrehumana, táctica perfecta y juego posicional implacable.',
          icon: '🦁',
          badgeColor: 'bg-green-400/40 text-green-100 border-green-300/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Rey Bestia Totémico',
          'Reclamar la Corona Suprema de la Aventura',
          'Completar TODOS los mundos del tablero'
        ],
        rewardXp: 3500,
        rewardGold: 2500,
        dialogue: {
          intro: '¡Has cruzado castillos medievales, trincheras de guerra, nebulosas espaciales, yermos zombies y matrices futuristas! ¡Demuéstrame que tu espíritu es digno del trono ancestral!',
          onPlayerGoodMove: '¡MAGNÍFICO! ¡Un rugido de sabiduría sacude el firmamento!',
          onBossAttack: '¡Siente el poder de la naturaleza indomable!',
          onPlayerCheck: '¡El Rey León dobla la rodilla ante tu majestad!',
          onBossCheck: '¡Jaque con rugido real!',
          onDefeat: '¡HONOR Y GLORIA ETERNA AL NUEVO REY SUPREMO DEL AJEDREZ! Tu nombre queda grabado en oro en las 64 casillas del universo.',
          onVictory: '¡El trono ancestral permanece indomable!'
        }
      }
    ]
  }
];

export const CLASS_INFO: Record<HeroClass, { name: string; icon: string; desc: string; bonus: string }> = {
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

export const DEFAULT_HERO_STATE: HeroState = {
  name: 'Héroe del Tablero',
  heroClass: 'knight',
  level: 1,
  xp: 0,
  xpToNextLevel: 250,
  gold: 150,
  skillPoints: 1,
  unlockedSkills: ['vision_de_oraculo'],
  equippedRelics: ['ojo_de_halcon'],
  relicsInventory: ['ojo_de_halcon'],
  equippedBoard: 'classic',
  equippedPieceSkin: 'classic',
  equippedPet: 'pet_gatito_sabio',
  ownedBoards: ['classic'],
  ownedPieceSkins: ['classic'],
  ownedPets: ['pet_gatito_sabio'],
  consumables: {
    oracle_potion: 2,
    time_warp: 1,
    shield_rune: 1
  },
  totalWins: 0,
  totalPuzzlesSolved: 0,
  bossesDefeated: 0
};

export const DEFAULT_ADVENTURE_SAVE: AdventureSaveState = {
  hero: DEFAULT_HERO_STATE,
  completedStages: {},
  currentWorldId: 'world-1',
  selectedStageId: null,
  lastPlayedDate: new Date().toISOString()
};
