import {
  AdventureWorld,
  AdventureRelic,
  AdventureSkill,
  HeroState,
  AdventureSaveState
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
  // MUNDO 1: EL VALLE DE LOS PEONES
  // ==========================================
  {
    id: 'world-1',
    number: 1,
    name: 'Valle de los Peones',
    subtitle: 'Tierras Rústicas de la Infantería',
    description: 'Comienza tu viaje en las verdes colinas del reino. Aprende la fuerza de las cadenas de peones y derrota a los bandidos campesinos.',
    bgGradient: 'from-emerald-900/40 via-slate-900 to-slate-950',
    accentColor: 'emerald',
    borderAccent: 'border-emerald-500/30',
    icon: '🌾',
    requiredStarsToUnlock: 0,
    bossName: 'Gólem de Arcilla & Capitán Alfil',
    stages: [
      {
        id: 'w1-s1',
        worldId: 'world-1',
        stageNumber: 1,
        title: 'El Bautismo del Peón',
        type: 'boss_duel',
        storyIntro: 'Un guardia novato vigila el sendero de entrada. Demuestra que sabes dominar el centro del tablero.',
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
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 0, // Zen
        starObjectives: [
          'Vencer al Guardia Bruno',
          'Ganar sin recibir más de 1 jaque',
          'Completar en menos de 30 movimientos'
        ],
        rewardXp: 120,
        rewardGold: 50,
        dialogue: {
          intro: '¡Alto ahí, forastero! Nadie cruza el puente sin conocer los secretos del centro.',
          onPlayerGoodMove: '¡Vaya! No esperaba que atacaras con tanta solidez.',
          onBossAttack: '¡Mis peones no retrocederán jamás!',
          onPlayerCheck: '¡Arg! ¡Cuidado con mi rey!',
          onBossCheck: '¡Jaque! ¿Puedes escapar de mi asalto?',
          onDefeat: 'Bien jugado... Tienes talento. El sendero del valle es tuyo.',
          onVictory: '¡Victoria para la guardia del valle!'
        }
      },
      {
        id: 'w1-s2',
        worldId: 'world-1',
        stageNumber: 2,
        title: 'La Clavada del Molino',
        type: 'puzzle_trial',
        storyIntro: 'Un pícaro ladrón ha caído en una trampa táctica. Utiliza una clavada para rematar la posición en 2 jugadas.',
        bossName: 'Duende Sombra',
        bossTitle: 'Ladrón de Caminos',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 850,
        bossMaxHp: 60,
        bossStyle: 'Evasivo y oportunista',
        initialFen: 'r1b1kb1r/pppp1ppp/5n2/4q3/4P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 7',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['f4', 'e6', 'fxe5'],
        solutionExplanation: 'Avanzando el peón o clavando a la dama rival ganas material decisivo de inmediato.',
        starObjectives: [
          'Encontrar la jugada ganadora',
          'Resolver sin pedir pistas',
          'Resolver en menos de 45 segundos'
        ],
        rewardXp: 150,
        rewardGold: 70,
        rewardRelic: ADVENTURE_RELICS[0], // Ojo de halcón
        timeControlSeconds: 120,
        dialogue: {
          intro: '¡Jajaja! ¿Crees que puedes atraparme en este tablero?',
          onPlayerGoodMove: '¡Maldición! ¡No vi venir esa amenaza!',
          onBossAttack: '¡Mis piezas son veloces como el viento!',
          onPlayerCheck: '¡Jaque! ¡No puede ser!',
          onBossCheck: '¡Cuidado con tus flancos!',
          onDefeat: '¡Me rindo! Toma este Ojo de Halcón y déjame ir.',
          onVictory: '¡Te he burlado una vez más!'
        }
      },
      {
        id: 'w1-s3',
        worldId: 'world-1',
        stageNumber: 3,
        title: 'Asedio al Campamento',
        type: 'boss_duel',
        storyIntro: 'El lugarteniente de los bandidos quiere impedir que llegues a la cima de la colina.',
        bossName: 'Bandido Silas',
        bossTitle: 'Lugarteniente del Valle',
        bossAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bossElo: 950,
        bossMaxHp: 90,
        bossStyle: 'Agresivo temprano',
        bossTrait: {
          id: 'asalto_temprano',
          name: 'Asalto Temprano',
          description: 'Saca su dama y caballos rápidamente al ataque.',
          icon: '⚔️',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar al Bandido Silas',
          'No perder la dama',
          'Realizar al menos 1 sacrificio o captura mayor'
        ],
        rewardXp: 180,
        rewardGold: 90,
        dialogue: {
          intro: '¡Nadie pasa por mi campamento sin pagar el peaje del rey!',
          onPlayerGoodMove: '¡Tu defensa es de piedra!',
          onBossAttack: '¡Ataquen por las columnas abiertas!',
          onPlayerCheck: '¡Ugh! ¡Mi rey está acorralado!',
          onBossCheck: '¡Jaque a tu monarca!',
          onDefeat: '¡Silas cae derrotado! El camino al jefe del valle está libre.',
          onVictory: '¡Tu oro y tus piezas me pertenecen!'
        }
      },
      {
        id: 'w1-s4',
        worldId: 'world-1',
        stageNumber: 4,
        title: 'El Mate del Pastor Oscuro',
        type: 'puzzle_trial',
        storyIntro: 'Una emboscada mortal acecha al rey negro desprotegido en la casilla f7. ¡Ejecuta el jaque mate fulminante!',
        bossName: 'Sombra Silenciosa',
        bossTitle: 'Espía del Valle',
        bossAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        bossElo: 900,
        bossMaxHp: 70,
        bossStyle: 'Táctico',
        initialFen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Dxf7#'],
        solutionExplanation: 'La dama apoyada por el alfil en c4 ejecuta un jaque mate demoledor en f7.',
        starObjectives: [
          'Ejecutar el Jaque Mate en f7',
          'Resolver a la primera jugada',
          'Resolver en menos de 20 segundos'
        ],
        rewardXp: 200,
        rewardGold: 100,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'La debilidad de f7 es una lección que todo rey debe aprender...',
          onPlayerGoodMove: '¡Impecable precisión geométrica!',
          onBossAttack: '¡Mis piezas cubren la retirada!',
          onPlayerCheck: '¡Jaque mate!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Has descubierto el secreto del mate elemental!',
          onVictory: 'Demasiado lento para el tablero de sombras.'
        }
      },
      {
        id: 'w1-s5',
        worldId: 'world-1',
        stageNumber: 5,
        title: 'El Gólem de Arcilla & Capitán Alfil',
        type: 'boss_duel',
        storyIntro: '¡EL JEFE DEL VALLE! El temible Gólem de Arcilla protege las puertas del bosque encantado. Derrótalo para coronarte campeón del Valle.',
        bossName: 'Gólem de Arcilla & Capitán Alfil',
        bossTitle: 'Guardián Supremo del Valle',
        bossAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        bossElo: 1050,
        bossMaxHp: 120,
        bossStyle: 'Sólido y pesado',
        bossTrait: {
          id: 'armadura_de_barro',
          name: 'Armadura de Barro',
          description: 'Bloquea las diagonales y fortalece sus peones doblados.',
          icon: '🗿',
          badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar al Gólem de Arcilla',
          'Conquistar con ventaja de material de +3 o más',
          'Lograr la victoria en menos de 40 movimientos'
        ],
        rewardXp: 350,
        rewardGold: 200,
        rewardRelic: ADVENTURE_RELICS[2], // Amuleto del peón
        dialogue: {
          intro: '¡GRRRR! ¡Nadie cruza las fronteras del Valle de los Peones! ¡Siente el peso de la roca!',
          onPlayerGoodMove: '¡La roca se agrieta ante tus jugadas!',
          onBossAttack: '¡Aplastaré tu posición!',
          onPlayerCheck: '¡GRRR! ¡Mi rey de piedra resistirá!',
          onBossCheck: '¡Jaque! ¡La tierra tiembla bajo tus pies!',
          onDefeat: '¡El Gólem se desmorona! Has conquistado el Valle de los Peones. ¡El Bosque de los Caballeros te espera!',
          onVictory: '¡Tu ejército ha sido pulverizado por la roca!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 2: EL BOSQUE ENCANTADO DE LOS CABALLEROS
  // ==========================================
  {
    id: 'world-2',
    number: 2,
    name: 'Bosque de los Caballeros',
    subtitle: 'Espesuras Místicas del Doble Ataque',
    description: 'Adéntrate en la niebla donde los caballos saltan sobre las ramas y ejecutan letales bifurcaciones tácticas.',
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    accentColor: 'indigo',
    borderAccent: 'border-indigo-500/30',
    icon: '🌲',
    requiredStarsToUnlock: 9,
    bossName: 'Centauro Galopante & Bruja de Ébano',
    stages: [
      {
        id: 'w2-s1',
        worldId: 'world-2',
        stageNumber: 1,
        title: 'El Salto en L',
        type: 'boss_duel',
        storyIntro: 'Un jinete del bosque pone a prueba tu capacidad para defenderte de saltos inesperados de caballo.',
        bossName: 'Jinete Rowan',
        bossTitle: 'Explorador del Bosque',
        bossAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        bossElo: 1150,
        bossMaxHp: 100,
        bossStyle: 'Táctico con caballos',
        bossTrait: {
          id: 'galope_mistico',
          name: 'Galope Místico',
          description: 'Prioriza ocupar casillas avanzadas en d5 y e5 con sus caballos.',
          icon: '🐎',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Jinete Rowan',
          'Capturar al menos 1 caballo rival',
          'Evitar que el rival corone un peón'
        ],
        rewardXp: 220,
        rewardGold: 110,
        dialogue: {
          intro: 'En este bosque, un solo salto de caballo puede cambiar el destino del reino.',
          onPlayerGoodMove: '¡Excelente control de las casillas de entrada!',
          onBossAttack: '¡Mis caballos bailan alrededor de tus torres!',
          onPlayerCheck: '¡Ugh! ¡Me has sorprendido en pleno salto!',
          onBossCheck: '¡Jaque con horquilla en el horizonte!',
          onDefeat: 'Tus piezas dominan las bifurcaciones. Adelante.',
          onVictory: '¡Los caballos del bosque son invencibles!'
        }
      },
      {
        id: 'w2-s2',
        worldId: 'world-2',
        stageNumber: 2,
        title: 'La Horquilla Real',
        type: 'puzzle_trial',
        storyIntro: 'El rey y la dama enemiga están en casillas de salto simultáneo. ¡Encuentra el ataque doble con el caballo!',
        bossName: 'Silfo del Sauce',
        bossTitle: 'Espíritu de las Sombras',
        bossAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
        bossElo: 1200,
        bossMaxHp: 80,
        bossStyle: 'Emboscada',
        initialFen: 'r1bqk2r/pp3ppp/2n1pn2/2pp4/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R w KQkq - 2 7',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['a3', 'Bxc3', 'Bxc3'],
        solutionExplanation: 'Eliminando la pieza clave desarmas la presión rival y ganas control total del centro.',
        starObjectives: [
          'Resolver la combinación táctica',
          'Completar sin pistas',
          'Completar en menos de 30 segundos'
        ],
        rewardXp: 250,
        rewardGold: 130,
        rewardRelic: ADVENTURE_RELICS[3], // Botas de caballería
        timeControlSeconds: 90,
        dialogue: {
          intro: 'La niebla oculta la casilla mágica. ¿La ves?',
          onPlayerGoodMove: '¡La has encontrado al instante!',
          onBossAttack: '¡La niebla te confunde!',
          onPlayerCheck: '¡Jaque!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Has dominado el arte del ataque doble!',
          onVictory: 'Perdido en el bosque para siempre.'
        }
      },
      {
        id: 'w2-s3',
        worldId: 'world-2',
        stageNumber: 3,
        title: 'El Laberinto de Zarzas',
        type: 'boss_duel',
        storyIntro: 'Una hechicera silvestre desafía tu cálculo táctico en un medio juego complejo.',
        bossName: 'Hechicera Morgana',
        bossTitle: 'Guardiana de los Helechos',
        bossAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bossElo: 1280,
        bossMaxHp: 110,
        bossStyle: 'Posicional y punzante',
        bossTrait: {
          id: 'zarzas_espinosas',
          name: 'Zarzas Espinosas',
          description: 'Aprovecha las clavadas en la columna del rey.',
          icon: '🌿',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer a Morgana',
          'Enrocar antes de la jugada 15',
          'Completar con más de 1 minuto en el reloj'
        ],
        rewardXp: 280,
        rewardGold: 150,
        dialogue: {
          intro: 'Las zarzas atraparán a quien se apresure sin pensar en cada jugada.',
          onPlayerGoodMove: '¡Tu rey está bien protegido!',
          onBossAttack: '¡Siente el aguijón de mi alfil!',
          onPlayerCheck: '¡Mis defensas no aguantan esa presión!',
          onBossCheck: '¡Jaque! ¿A dónde huirás?',
          onDefeat: 'Tu visión trasciende mis hechizos. Pasa.',
          onVictory: 'Las zarzas reclaman otra alma.'
        }
      },
      {
        id: 'w2-s4',
        worldId: 'world-2',
        stageNumber: 4,
        title: 'El Mate de la Coz Silvestre',
        type: 'puzzle_trial',
        storyIntro: 'El rey enemigo está asfixiado por sus propias piezas. ¡Ejecuta el legendario Mate de la Coz con el caballo!',
        bossName: 'Sombra Asfixiante',
        bossTitle: 'Fantasma de las Raíces',
        bossAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        bossElo: 1320,
        bossMaxHp: 90,
        bossStyle: 'Táctico extremo',
        initialFen: '6k1/5ppp/8/8/8/5N2/5PPP/4Q1K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Qe8#'],
        solutionExplanation: 'La dama entra en la octava fila aprovechando la falta de escape del monarca.',
        starObjectives: [
          'Ejecutar el jaque mate',
          'Resolver sin fallos',
          'Resolver en menos de 20 segundos'
        ],
        rewardXp: 300,
        rewardGold: 170,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'Un rey sin casillas de escape es un rey condenado...',
          onPlayerGoodMove: '¡La red de mate es perfecta!',
          onBossAttack: '¡Aún respiro!',
          onPlayerCheck: '¡Jaque mate!',
          onBossCheck: '¡No hay escapatoria!',
          onDefeat: '¡Magia pura! Has aprendido el arte del mate sin salida.',
          onVictory: 'El aire se agotó para tus piezas.'
        }
      },
      {
        id: 'w2-s5',
        worldId: 'world-2',
        stageNumber: 5,
        title: 'Centauro Galopante & Bruja de Ébano',
        type: 'boss_duel',
        storyIntro: '¡JEFE DEL MUNDO 2! El Centauro Galopante y la Bruja de Ébano combinan ataques fulminantes de caballo y diagonales místicas. ¡Derrótalos para abrir las murallas del Bastión de las Torres!',
        bossName: 'Centauro Galopante & Bruja de Ébano',
        bossTitle: 'Señores del Bosque Encantado',
        bossAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        bossElo: 1380,
        bossMaxHp: 150,
        bossStyle: 'Agresivo y punzante',
        bossTrait: {
          id: 'furia_equina',
          name: 'Furia Equina',
          description: 'Calcula con gran rapidez ataques dobles y sacrificios de piezas menores.',
          icon: '🦄',
          badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Centauro & Bruja de Ébano',
          'Vencer sin permitir que den jaque a tu rey más de 2 veces',
          'Ganar en menos de 45 jugadas'
        ],
        rewardXp: 500,
        rewardGold: 300,
        rewardRelic: ADVENTURE_RELICS[1], // Reloj de Krónos
        dialogue: {
          intro: '¡Pisarás las hojas caídas de nuestro bosque por última vez! ¡Mis caballos destruirán tu monarquía!',
          onPlayerGoodMove: '¡Maldición! ¡Esa jugada frena toda mi caballería!',
          onBossAttack: '¡A la carga por el flanco de dama!',
          onPlayerCheck: '¡El Centauro tiembla ante tu ofensiva!',
          onBossCheck: '¡Jaque! ¡Nadie resiste la tormenta de casillas negras!',
          onDefeat: '¡Increíble! Has domado a las bestias del bosque místico. ¡El Bastión de las Torres te aguarda!',
          onVictory: '¡El bosque devoró a tu ejército!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 3: EL BASTIÓN DE LAS TORRES Y ALMENAS
  // ==========================================
  {
    id: 'world-3',
    number: 3,
    name: 'Bastión de las Torres',
    subtitle: 'Fortaleza de Piedra y Columnas Abiertas',
    description: 'Asalta las inmensas murallas donde las torres dominan las columnas abiertas y la temida séptima fila.',
    bgGradient: 'from-amber-950 via-slate-900 to-stone-950',
    accentColor: 'amber',
    borderAccent: 'border-amber-500/30',
    icon: '🏰',
    requiredStarsToUnlock: 22,
    bossName: 'General de Acero & Titán de la Séptima Fila',
    stages: [
      {
        id: 'w3-s1',
        worldId: 'world-3',
        stageNumber: 1,
        title: 'La Columna Abierta',
        type: 'boss_duel',
        storyIntro: 'Un veterano artillero defiende el foso de la fortaleza utilizando el control de columnas centrales.',
        bossName: 'Comandante Vance',
        bossTitle: 'Capitán de Artillería',
        bossAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        bossElo: 1450,
        bossMaxHp: 120,
        bossStyle: 'Posicional con torres',
        bossTrait: {
          id: 'artilleria_pesada',
          name: 'Artillería Pesada',
          description: 'Dobla sus torres en la columna abierta para asfixiar la posición.',
          icon: '🏯',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Comandante Vance',
          'Ocupar la 7ma fila con al menos 1 torre',
          'Victoria con más de +4 de ventaja material'
        ],
        rewardXp: 350,
        rewardGold: 180,
        dialogue: {
          intro: 'Quien controle las columnas abiertas controla las llaves de la fortaleza.',
          onPlayerGoodMove: '¡Has colocado tu torre en la columna perfecta!',
          onBossAttack: '¡Mis torres barren todo a su paso!',
          onPlayerCheck: '¡Las murallas ceden!',
          onBossCheck: '¡Jaque desde la retaguardia!',
          onDefeat: 'Bien jugado. Has derribado la primera almena.',
          onVictory: 'La fortaleza es inexpugnable.'
        }
      },
      {
        id: 'w3-s2',
        worldId: 'world-3',
        stageNumber: 2,
        title: 'El Mate del Pasillo',
        type: 'puzzle_trial',
        storyIntro: 'El rey enemigo no tiene casilla de escape (luft) tras sus peones. ¡Aprovecha la debilidad de la primera fila!',
        bossName: 'Centinela de la Fila 8',
        bossTitle: 'Guardia de Almenas',
        bossAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bossElo: 1480,
        bossMaxHp: 90,
        bossStyle: 'Táctico',
        initialFen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Rxd8#'],
        solutionExplanation: 'La torre penetra en d8 ejecutando un mate de pasillo inapelable.',
        starObjectives: [
          'Ejecutar el mate de pasillo',
          'Completar en 1 solo intento',
          'Resolver en menos de 15 segundos'
        ],
        rewardXp: 380,
        rewardGold: 200,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'Un rey atrapado tras sus propios peones cava su propia tumba.',
          onPlayerGoodMove: '¡Directo a la octava fila!',
          onBossAttack: '¡Mi torre vigila!',
          onPlayerCheck: '¡Jaque mate!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Lección aprendida: siempre abre un respiro para el rey!',
          onVictory: 'Tu torre no pudo entrar.'
        }
      },
      {
        id: 'w3-s3',
        worldId: 'world-3',
        stageNumber: 3,
        title: 'Invasión a la Séptima Fila',
        type: 'boss_duel',
        storyIntro: 'El duque de la fortaleza planta cara con una sólida estructura francesa. Penetra en su séptima fila.',
        bossName: 'Duque Rurik',
        bossTitle: 'Señor de los Baluartes',
        bossAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        bossElo: 1550,
        bossMaxHp: 140,
        bossStyle: 'Defensa de hierro',
        bossTrait: {
          id: 'muro_de_piedra',
          name: 'Muro de Piedra',
          description: 'Bloquea el centro y castiga los errores de cálculo.',
          icon: '🧱',
          badgeColor: 'bg-stone-600/30 text-stone-300 border-stone-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Duque Rurik',
          'No permitir que el rival doble torres',
          'Ganar en menos de 40 jugadas'
        ],
        rewardXp: 420,
        rewardGold: 220,
        dialogue: {
          intro: 'Mis muros han resistido cien asedios. No serás la excepción.',
          onPlayerGoodMove: '¡Has encontrado la fisura en mi defensa!',
          onBossAttack: '¡Las catapultas abren fuego!',
          onPlayerCheck: '¡El Duque retrocede!',
          onBossCheck: '¡Jaque a tu rey imprudente!',
          onDefeat: 'Imposible... El baluarte ha caído.',
          onVictory: 'Otro asedio fracasado.'
        }
      },
      {
        id: 'w3-s4',
        worldId: 'world-3',
        stageNumber: 4,
        title: 'Batería de Torres Gemelas',
        type: 'puzzle_trial',
        storyIntro: 'Dos torres conectadas en la séptima fila devoran todo el ejército rival. ¡Encuentra la secuencia de mate!',
        bossName: 'Centinela de Hierro',
        bossTitle: 'Vigilante del Rastril',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 1580,
        bossMaxHp: 100,
        bossStyle: 'Táctico',
        initialFen: '2r3k1/5ppp/8/8/8/8/1R5P/1R4K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Rb8', 'Rxb8', 'Rxb8#'],
        solutionExplanation: 'La simplificación forzada en b8 deja a las negras sin defensa ante el mate en la última fila.',
        starObjectives: [
          'Ejecutar la combinación de torres',
          'Resolver sin usar pistas',
          'Resolver en menos de 25 segundos'
        ],
        rewardXp: 450,
        rewardGold: 240,
        rewardRelic: ADVENTURE_RELICS[4], // Escudo de la corona
        timeControlSeconds: 60,
        dialogue: {
          intro: 'Cuando dos torres marchan unidas, nada sobrevive.',
          onPlayerGoodMove: '¡La coordinación es magistral!',
          onBossAttack: '¡Contraataque!',
          onPlayerCheck: '¡Jaque mate!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Has dominado el poder de las torres pesadas!',
          onVictory: 'Las almenas permanecen intactas.'
        }
      },
      {
        id: 'w3-s5',
        worldId: 'world-3',
        stageNumber: 5,
        title: 'General de Acero & Titán de la Séptima Fila',
        type: 'boss_duel',
        storyIntro: '¡JEFE DEL MUNDO 3! El General de Acero comanda un ejército acorazado con torres imparables. ¡Destruye su fortaleza para acceder al Templo Sagrado de los Alfiles!',
        bossName: 'General de Acero & Titán de la Séptima Fila',
        bossTitle: 'Gobernador del Gran Bastión',
        bossAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bossElo: 1650,
        bossMaxHp: 180,
        bossStyle: 'Implacable y técnico',
        bossTrait: {
          id: 'coraza_inmortal',
          name: 'Coraza Inmortal',
          description: 'Aprovecha cualquier peón débil para generar finales ganadores.',
          icon: '🛡️',
          badgeColor: 'bg-amber-600/30 text-amber-200 border-amber-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al General de Acero',
          'Ganar sin perder ninguna de tus 2 torres',
          'Vencer en menos de 50 jugadas'
        ],
        rewardXp: 650,
        rewardGold: 400,
        dialogue: {
          intro: '¡Mi armadura fue forjada con mil victorias! ¡Tus piezas serán aplastadas bajo mis almenas!',
          onPlayerGoodMove: '¡Maldición! ¡Ese plan estratégico rompe mi formación!',
          onBossAttack: '¡Fuego a discreción por el centro!',
          onPlayerCheck: '¡El General tambalea!',
          onBossCheck: '¡Jaque! ¡Ríndete ahora y salvarás tu reino!',
          onDefeat: '¡El Bastión de las Torres se rinde ante ti! Has probado ser un verdadero estratega. ¡El Templo de los Alfiles te llama!',
          onVictory: '¡Tu ejército ha sido sepultado bajo las ruinas del bastión!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 4: EL TEMPLO SAGRADO DE LOS ALFILES
  // ==========================================
  {
    id: 'world-4',
    number: 4,
    name: 'Templo de los Alfiles',
    subtitle: 'Santuario de las Grandes Diagonales',
    description: 'Asciende por las escaleras de mármol donde los monjes diagonales dominan los complejos de casillas claras y oscuras.',
    bgGradient: 'from-sky-950 via-slate-900 to-teal-950',
    accentColor: 'sky',
    borderAccent: 'border-sky-500/30',
    icon: '🏛️',
    requiredStarsToUnlock: 36,
    bossName: 'Sumo Sacerdote Diagonal & Quimera Solar',
    stages: [
      {
        id: 'w4-s1',
        worldId: 'world-4',
        stageNumber: 1,
        title: 'El Monje de Casillas Negras',
        type: 'boss_duel',
        storyIntro: 'Un devoto del templo te reta a un duelo donde su alfil oscuro controla todas las diagonales vitales.',
        bossName: 'Hermano Kaspar',
        bossTitle: 'Monje de la Sombra',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 1720,
        bossMaxHp: 150,
        bossStyle: 'Fianchetto y presión diagonal',
        bossTrait: {
          id: 'ojo_diagonal',
          name: 'Ojo Diagonal',
          description: 'Fianchetta sus alfiles en g2/b2 y g7/b7 ejerciendo presión constante.',
          icon: '✨',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar al Hermano Kaspar',
          'Mantener la pareja de alfiles',
          'Completar en menos de 45 jugadas'
        ],
        rewardXp: 500,
        rewardGold: 260,
        dialogue: {
          intro: 'La gran diagonal a1-h8 es el río por donde fluye el destino.',
          onPlayerGoodMove: '¡Qué armonía en tus diagonales!',
          onBossAttack: '¡La luz del alfil ciega a tu rey!',
          onPlayerCheck: '¡El santuario se estremece!',
          onBossCheck: '¡Jaque en la gran diagonal!',
          onDefeat: 'Tu visión trasciende el dogma del templo. Bien jugado.',
          onVictory: 'La luz diagonal disipó tus piezas.'
        }
      },
      {
        id: 'w4-s2',
        worldId: 'world-4',
        stageNumber: 2,
        title: 'El Sacrificio Griego Clásico',
        type: 'puzzle_trial',
        storyIntro: '¡El legendario sacrificio en h7! Destruye el enroque enemigo con una entrega brillante de alfil.',
        bossName: 'Oráculo Solar',
        bossTitle: 'Guardián del Fuego',
        bossAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        bossElo: 1780,
        bossMaxHp: 110,
        bossStyle: 'Ataque de mate',
        initialFen: 'r1bq1rk1/pppn1ppp/4p3/3p4/2PP4/2PBPN2/P4PPP/R2QK2R w KQ - 0 9',
        playerColor: 'w',
        mateIn: 3,
        solutionSan: ['Bxh7+', 'Kxh7', 'Ng5+'],
        solutionExplanation: 'El sacrificio temático Bxh7+ abre el rey enemigo para el asalto decisivo de caballo y dama.',
        starObjectives: [
          'Ejecutar el Sacrificio Griego en h7',
          'Completar sin errores a la primera',
          'Resolver en menos de 30 segundos'
        ],
        rewardXp: 550,
        rewardGold: 290,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'A veces hay que entregar la pieza más noble para alcanzar la gloria inmortal.',
          onPlayerGoodMove: '¡Bxh7+! ¡La entrega perfecta!',
          onBossAttack: '¡El rey defiende!',
          onPlayerCheck: '¡Jaque con sacrificio!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Una obra de arte digna de los grandes maestros!',
          onVictory: 'El sacrificio fue en vano.'
        }
      },
      {
        id: 'w4-s3',
        worldId: 'world-4',
        stageNumber: 3,
        title: 'La Pareja de Alfiles Divina',
        type: 'boss_duel',
        storyIntro: 'La Gran Sacerdotisa domina el tablero abierto con la letal coordinación de dos alfiles.',
        bossName: 'Sacerdotisa Helena',
        bossTitle: 'Custodia del Rayo Sagrado',
        bossAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bossElo: 1850,
        bossMaxHp: 160,
        bossStyle: 'Dinámico y táctico',
        bossTrait: {
          id: 'rayo_bipolar',
          name: 'Rayo Bipolar',
          description: 'Calcula con precisión láser ataques cruzados de ambos alfiles.',
          icon: '⚡',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer a la Sacerdotisa Helena',
          'Lograr ventaja de +3 en el medio juego',
          'Completar en menos de 45 jugadas'
        ],
        rewardXp: 600,
        rewardGold: 320,
        dialogue: {
          intro: 'Dos alfiles en tablero abierto cortan el espacio como espadas gemelas.',
          onPlayerGoodMove: '¡Has neutralizado mi alfil de casillas claras!',
          onBossAttack: '¡Las diagonales se cruzan sobre tu rey!',
          onPlayerCheck: '¡Helena pierde el equilibrio!',
          onBossCheck: '¡Jaque cruzado!',
          onDefeat: 'Tu comprensión del juego abierto es sublime.',
          onVictory: 'Los alfiles sagrados han triunfado.'
        }
      },
      {
        id: 'w4-s4',
        worldId: 'world-4',
        stageNumber: 4,
        title: 'El Mate de Boden',
        type: 'puzzle_trial',
        storyIntro: 'Dos alfiles cruzados en tijera ejecutan un jaque mate estético a un rey enrocado largo.',
        bossName: 'Espíritu de Boden',
        bossTitle: 'Maestro de la Tijera',
        bossAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        bossElo: 1900,
        bossMaxHp: 120,
        bossStyle: 'Geometría pura',
        initialFen: '2kr3r/ppp2ppp/4b3/8/1b1n4/2N5/PPPB1PPP/R3KB1R w KQ - 4 11',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['O-O-O', 'Bxc3', 'Bxc3'],
        solutionExplanation: 'Enrocando largo preparas el asalto fulminante de las diagonales cruzadas.',
        starObjectives: [
          'Resolver la secuencia geométrica',
          'Resolver sin pedir sugerencias',
          'Completar en menos de 25 segundos'
        ],
        rewardXp: 650,
        rewardGold: 350,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'La tijera de alfiles no deja escapar ni a reyes ni a damas.',
          onPlayerGoodMove: '¡Geometría impecable!',
          onBossAttack: '¡Mis líneas de visión están abiertas!',
          onPlayerCheck: '¡Jaque mate!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Has dominado el legendario Mate de Boden!',
          onVictory: 'La tijera cortó tus esperanzas.'
        }
      },
      {
        id: 'w4-s5',
        worldId: 'world-4',
        stageNumber: 5,
        title: 'Sumo Sacerdote Diagonal & Quimera Solar',
        type: 'boss_duel',
        storyIntro: '¡JEFE DEL MUNDO 4! El Sumo Sacerdote y su Quimera Solar custodian el portal a la Cripta de la Reina Oscura. ¡Demuestra maestría suprema en el cálculo táctico!',
        bossName: 'Sumo Sacerdote Diagonal & Quimera Solar',
        bossTitle: 'Patriarca del Templo Sagrado',
        bossAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        bossElo: 1980,
        bossMaxHp: 200,
        bossStyle: 'Maestro táctico',
        bossTrait: {
          id: 'resplandor_solar',
          name: 'Resplandor Solar',
          description: 'Aumenta su profundidad de cálculo en posiciones con material sacrificado.',
          icon: '☀️',
          badgeColor: 'bg-amber-400/30 text-amber-200 border-amber-400/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Sumo Sacerdote & Quimera',
          'No permitir que corone ningún peón',
          'Ganar en menos de 50 jugadas'
        ],
        rewardXp: 850,
        rewardGold: 500,
        dialogue: {
          intro: '¡Las columnas del templo serán testigo de tu derrota! ¡Siente la luz implacable de las 64 casillas!',
          onPlayerGoodMove: '¡Increíble jugada! ¡Ni el oráculo la anticipó!',
          onBossAttack: '¡Que el fuego sagrado consuma tu flanco!',
          onPlayerCheck: '¡El Sumo Sacerdote cae de rodillas!',
          onBossCheck: '¡Jaque! ¡La quimera ruge!',
          onDefeat: '¡Has purificado el Templo Sagrado! Las puertas hacia la Cripta de la Reina Oscura están abiertas... ten cuidado con las sombras.',
          onVictory: '¡Has sido devorado por la luz sagrada!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 5: LA CRIPTA DE LA REINA OSCURA
  // ==========================================
  {
    id: 'world-5',
    number: 5,
    name: 'Cripta de la Reina Oscura',
    subtitle: 'El Abismo de los Sacrificios Mortales',
    description: 'Desciende a las catacumbas donde la Reina de Sombras desata ataques demoledores, sacrificios de dama y persecuciones despiadadas al rey.',
    bgGradient: 'from-purple-950 via-slate-900 to-rose-950',
    accentColor: 'purple',
    borderAccent: 'border-purple-500/30',
    icon: '🔮',
    requiredStarsToUnlock: 50,
    bossName: 'Reina Maldita de Sombras & Nigromante Real',
    stages: [
      {
        id: 'w5-s1',
        worldId: 'world-5',
        stageNumber: 1,
        title: 'El Espejo de Sombras',
        type: 'boss_duel',
        storyIntro: 'Una ilusión espectral copia tu estilo de juego con agresividad feroz.',
        bossName: 'Sombra Espectral',
        bossTitle: 'Reflejo Maldito',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 2080,
        bossMaxHp: 180,
        bossStyle: 'Ultra agresivo',
        bossTrait: {
          id: 'ataque_espectral',
          name: 'Ataque Espectral',
          description: 'Lanza todas sus piezas contra el enroque enemigo sin piedad.',
          icon: '👻',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Derrotar a la Sombra Espectral',
          'Ganar con rey seguro sin recibir más de 2 jaques',
          'Completar en menos de 45 jugadas'
        ],
        rewardXp: 750,
        rewardGold: 400,
        dialogue: {
          intro: 'Soy todo lo que temes en el tablero. Cada jugada tuya será castigada.',
          onPlayerGoodMove: '¡Maldición! ¡No pudiste ver esa defensa!',
          onBossAttack: '¡Tu enroque se derrumba en pedazos!',
          onPlayerCheck: '¡El reflejo se quiebra!',
          onBossCheck: '¡Jaque! ¡No hay salida en la oscuridad!',
          onDefeat: 'El reflejo se desvanece... eres más fuerte de lo que creía.',
          onVictory: 'Atrapado en el espejo de las sombras.'
        }
      },
      {
        id: 'w5-s2',
        worldId: 'world-5',
        stageNumber: 2,
        title: 'El Sacrificio de Dama Inmortal',
        type: 'puzzle_trial',
        storyIntro: '¡La jugada más bella del ajedrez! Entrega tu dama para asestar un jaque mate inevitable con piezas menores.',
        bossName: 'Nigromante de Ébano',
        bossTitle: 'Invocador de Reyes Caídos',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 2150,
        bossMaxHp: 130,
        bossStyle: 'Sacrificio supremo',
        initialFen: 'r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
        playerColor: 'b',
        mateIn: 3,
        solutionSan: ['Nf6', 'Re1', 'd6'],
        solutionExplanation: 'La armonía y el contrajuego preciso destruyen las pretensiones de ataque blanco.',
        starObjectives: [
          'Completar la secuencia defensiva/contraataque',
          'Resolver a la primera',
          'Resolver en menos de 30 segundos'
        ],
        rewardXp: 800,
        rewardGold: 430,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'Quien no teme entregar a su reina conquista la eternidad.',
          onPlayerGoodMove: '¡Qué golpe táctico tan exquisito!',
          onBossAttack: '¡Las sombras reclaman tu material!',
          onPlayerCheck: '¡Jaque magistral!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Un sacrificio que entrará en los libros de historia!',
          onVictory: 'La dama cayó sin recompensa.'
        }
      },
      {
        id: 'w5-s3',
        worldId: 'world-5',
        stageNumber: 3,
        title: 'La Cacería del Rey Fugitivo',
        type: 'boss_duel',
        storyIntro: 'El general oscuro intenta escapar por el centro del tablero. ¡Acorrála a su rey con piezas coordinadas!',
        bossName: 'Lord Malakar',
        bossTitle: 'Comandante del Vacío',
        bossAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bossElo: 2220,
        bossMaxHp: 200,
        bossStyle: 'Feroz y peligroso',
        bossTrait: {
          id: 'caza_implacable',
          name: 'Caza Implacable',
          description: 'Abre líneas mediante rupturas de peones en f4/f5 y c4/c5.',
          icon: '⚡',
          badgeColor: 'bg-purple-500/30 text-purple-200 border-purple-400/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer a Lord Malakar',
          'Dar Jaque Mate antes de la jugada 45',
          'Ganar sin perder la dama'
        ],
        rewardXp: 900,
        rewardGold: 480,
        dialogue: {
          intro: 'En esta cripta no hay piedad. Tu rey será perseguido hasta la última casilla.',
          onPlayerGoodMove: '¡Has cerrado mi ruta de escape!',
          onBossAttack: '¡Mis peones de tormenta avanzan!',
          onPlayerCheck: '¡Lord Malakar queda sin casillas!',
          onBossCheck: '¡Jaque! ¡Tu rey corre peligro mortal!',
          onDefeat: 'El Vacío se repliega... eres un verdadero Gran Maestro.',
          onVictory: 'El vacío devoró a tu rey.'
        }
      },
      {
        id: 'w5-s4',
        worldId: 'world-5',
        stageNumber: 4,
        title: 'El Mate de Anastasia',
        type: 'puzzle_trial',
        storyIntro: 'Caballo y torre se combinan para asestar el famoso Mate de Anastasia al rey arrinconado en la banda.',
        bossName: 'Reina de Hielo',
        bossTitle: 'Guardiana del Frío Eterno',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 2280,
        bossMaxHp: 140,
        bossStyle: 'Táctico legendario',
        initialFen: '5rk1/1p3ppp/8/8/8/5N2/5PPP/4R1K1 w - - 0 1',
        playerColor: 'w',
        mateIn: 2,
        solutionSan: ['Re8', 'Rxe8', 'Nxe8'],
        solutionExplanation: 'La simplificación forzada corona la ventaja táctica definitiva.',
        starObjectives: [
          'Resolver el Mate de Anastasia',
          'Resolver sin pedir pistas',
          'Completar en menos de 20 segundos'
        ],
        rewardXp: 950,
        rewardGold: 500,
        rewardRelic: ADVENTURE_RELICS[5], // Cáliz de la dama
        timeControlSeconds: 60,
        dialogue: {
          intro: 'El frío congela toda esperanza cuando la torre y el caballo atacan juntos.',
          onPlayerGoodMove: '¡La coordinación perfecta de Anastasia!',
          onBossAttack: '¡El frío te alcanza!',
          onPlayerCheck: '¡Jaque mate helado!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡El hielo se funde ante tu fuego táctico!',
          onVictory: 'Congelado en la banda del tablero.'
        }
      },
      {
        id: 'w5-s5',
        worldId: 'world-5',
        stageNumber: 5,
        title: 'Reina Maldita de Sombras & Nigromante Real',
        type: 'boss_duel',
        storyIntro: '¡JEFE DEL MUNDO 5! La soberana del abismo despliega toda la furia de las piezas negras. ¡Derrótala para ascender al Trono Celestial del Rey Supremo!',
        bossName: 'Reina Maldita de Sombras & Nigromante Real',
        bossTitle: 'Monarca Suprema del Abismo',
        bossAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bossElo: 2350,
        bossMaxHp: 240,
        bossStyle: 'Gran Maestro Agresivo',
        bossTrait: {
          id: 'corona_maldita',
          name: 'Corona Maldita',
          description: 'Calcula con precisión de módulo las amenazas de mate y combinaciones tácticas.',
          icon: '👑',
          badgeColor: 'bg-rose-600/30 text-rose-200 border-rose-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer a la Reina Maldita de Sombras',
          'Completar con ventaja de peones o calidad',
          'Ganar en menos de 50 jugadas'
        ],
        rewardXp: 1200,
        rewardGold: 700,
        dialogue: {
          intro: '¡Has osado pisar mi santuario de sombras! ¡Mi dama danzará sobre los restos de tu ejército!',
          onPlayerGoodMove: '¡Imposible! ¡Esa jugada es digna de los campeones mundiales!',
          onBossAttack: '¡Tormenta de piezas sobre tu rey!',
          onPlayerCheck: '¡La Reina de Sombras se retuerce!',
          onBossCheck: '¡Jaque! ¡Tu monarquía termina hoy!',
          onDefeat: '¡La Cripta se ilumina! Has derrotado a la reina de la noche. ¡El Trono Celestial del Rey Supremo te espera para la batalla final!',
          onVictory: '¡Tu alma pertenece a la Cripta de las Sombras!'
        }
      }
    ]
  },

  // ==========================================
  // MUNDO 6: EL TRONO CELESTIAL DEL REY SUPREMO
  // ==========================================
  {
    id: 'world-6',
    number: 6,
    name: 'Trono del Rey Supremo',
    subtitle: 'El Olimpo de los Grandes Maestros Inmortales',
    description: 'La cima del universo del ajedrez. Enfréntate a las leyendas inmortales y al Emperador Supremo para coronarte Campeón Absoluto.',
    bgGradient: 'from-amber-900 via-slate-900 to-indigo-950',
    accentColor: 'amber',
    borderAccent: 'border-amber-400/40',
    icon: '👑',
    requiredStarsToUnlock: 65,
    bossName: 'Emperador Inmortal del Ajedrez',
    stages: [
      {
        id: 'w6-s1',
        worldId: 'world-6',
        stageNumber: 1,
        title: 'El Guardián del Olimpo',
        type: 'boss_duel',
        storyIntro: 'El primer paladín del cielo te recibe en el tablero dorado de las estrellas.',
        bossName: 'Paladín Aurelio',
        bossTitle: 'Campeón de la Luz',
        bossAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        bossElo: 2450,
        bossMaxHp: 220,
        bossStyle: 'Clásico y perfecto',
        bossTrait: {
          id: 'luz_inmortal',
          name: 'Luz Inmortal',
          description: 'Minimiza los errores y castiga cualquier debilidad posicional.',
          icon: '✨',
          badgeColor: 'bg-amber-400/20 text-amber-200 border-amber-400/30'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Paladín Aurelio',
          'No cometer errores graves',
          'Vencer en menos de 50 jugadas'
        ],
        rewardXp: 1200,
        rewardGold: 600,
        dialogue: {
          intro: 'Solo las mentes más brillantes pueden pisar el tablero del Olimpo.',
          onPlayerGoodMove: '¡Sublime precisión!',
          onBossAttack: '¡El orden divino prevalece!',
          onPlayerCheck: '¡Aurelio retrocede!',
          onBossCheck: '¡Jaque celestial!',
          onDefeat: 'Eres digno de ascender a las cámaras del Rey.',
          onVictory: 'El Olimpo rechaza tu desafío.'
        }
      },
      {
        id: 'w6-s2',
        worldId: 'world-6',
        stageNumber: 2,
        title: 'La Partida Inmortal',
        type: 'puzzle_trial',
        storyIntro: 'Inspirado en la inmortal de Anderssen. ¡Entrega ambas torres y alfil para dar un mate asombroso!',
        bossName: 'Espíritu de Anderssen',
        bossTitle: 'Maestro del Romanticismo',
        bossAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        bossElo: 2520,
        bossMaxHp: 160,
        bossStyle: 'Ataque romántico',
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
        rewardXp: 1400,
        rewardGold: 700,
        timeControlSeconds: 60,
        dialogue: {
          intro: '¿Qué importa el material cuando el rey rival perece?',
          onPlayerGoodMove: '¡Be7#! ¡Inmortal y eterno!',
          onBossAttack: '¡Todo por el ataque!',
          onPlayerCheck: '¡Jaque mate inmortal!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Una partida que vivirá por los siglos de los siglos!',
          onVictory: 'La inmortalidad se te escapó de las manos.'
        }
      },
      {
        id: 'w6-s3',
        worldId: 'world-6',
        stageNumber: 3,
        title: 'El Dragón de las 64 Casillas',
        type: 'boss_duel',
        storyIntro: 'La bestia mitológica del ajedrez ataca con la variante Dragón de la Siciliana con precisión arrolladora.',
        bossName: 'Dragón de Kaspar',
        bossTitle: 'Bestia Táctica del Trono',
        bossAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        bossElo: 2600,
        bossMaxHp: 260,
        bossStyle: 'Ataque yugoslavo',
        bossTrait: {
          id: 'aliento_de_fuego',
          name: 'Aliento de Fuego',
          description: 'Abre la columna h lanzando peones h4-h5 con violencia demoledora.',
          icon: '🐉',
          badgeColor: 'bg-red-500/30 text-red-200 border-red-500/40'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Dragón de Kaspar',
          'Mantener la ventaja de tiempo',
          'Vencer en menos de 50 jugadas'
        ],
        rewardXp: 1600,
        rewardGold: 850,
        dialogue: {
          intro: '¡ROAAAR! ¡El dragón calienta sus llamas en la gran diagonal!',
          onPlayerGoodMove: '¡Esa jugada apaga mi llamarada!',
          onBossAttack: '¡Fuego directo contra tu enroque!',
          onPlayerCheck: '¡El dragón es herido de muerte!',
          onBossCheck: '¡Jaque con aliento de fuego!',
          onDefeat: '¡El dragón rinde pleitesía a tu espada!',
          onVictory: '¡Cenizas en el tablero!'
        }
      },
      {
        id: 'w6-s4',
        worldId: 'world-6',
        stageNumber: 4,
        title: 'El Final de Reyes y Peones de Capablanca',
        type: 'puzzle_trial',
        storyIntro: 'En el Olimpo, la técnica en los finales de reyes y peones decide los campeonatos mundiales. ¡Crea el peón pasado!',
        bossName: 'Espíritu de Capablanca',
        bossTitle: 'La Máquina Humana del Ajedrez',
        bossAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bossElo: 2680,
        bossMaxHp: 180,
        bossStyle: 'Precisión cristalina',
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
        rewardXp: 1800,
        rewardGold: 950,
        timeControlSeconds: 60,
        dialogue: {
          intro: 'El ajedrez es técnica, claridad y armonía sin desperdiciar un solo movimiento.',
          onPlayerGoodMove: '¡La oposición perfecta de Capablanca!',
          onBossAttack: '¡El rey defiende la casilla clave!',
          onPlayerCheck: '¡La coronación es matemática!',
          onBossCheck: '¡Cuidado!',
          onDefeat: '¡Has alcanzado la perfección en los finales!',
          onVictory: 'Un error en el final no se perdona.'
        }
      },
      {
        id: 'w6-s5',
        worldId: 'world-6',
        stageNumber: 5,
        title: 'Emperador Inmortal del Ajedrez',
        type: 'boss_duel',
        storyIntro: '¡LA GRAN BATALLA FINAL! El Emperador Inmortal posee la sabiduría acumulada de todos los campeones de la historia. ¡Véncelo para reclamar la Corona Suprema y salvar el Reino del Ajedrez!',
        bossName: 'Emperador Inmortal del Ajedrez',
        bossTitle: 'Señor Supremo de las 64 Casillas',
        bossAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bossElo: 2800,
        bossMaxHp: 300,
        bossStyle: 'Fuerza de Gran Maestro Legendario',
        bossTrait: {
          id: 'mente_cosmica',
          name: 'Mente Cósmica',
          description: 'Calcula con visión sobrehumana, táctica perfecta y juego posicional implacable.',
          icon: '🌌',
          badgeColor: 'bg-amber-400/40 text-amber-100 border-amber-300/50'
        },
        initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        playerColor: 'w',
        timeControlSeconds: 300,
        starObjectives: [
          'Vencer al Emperador Inmortal del Ajedrez',
          'Coronar tu leyenda con el título de Gran Campeón',
          'Completar la Gran Aventura del Tablero'
        ],
        rewardXp: 3000,
        rewardGold: 2000,
        dialogue: {
          intro: '¡Has cruzado valles, bosques, bastiones, templos y criptas! ¡Ahora demuéstrame que tu mente merece portar la Corona Suprema!',
          onPlayerGoodMove: '¡Magnífico! ¡Una jugada digna de las estrellas del firmamento!',
          onBossAttack: '¡Siente el peso de mil años de estrategia!',
          onPlayerCheck: '¡El Emperador Inmortal dobla la rodilla!',
          onBossCheck: '¡Jaque! ¡El cosmos tiembla!',
          onDefeat: '¡HONOR Y GLORIA AL NUEVO REY SUPREMO DEL AJEDREZ! Has completado el Modo Aventura y tu nombre quedará grabado en oro por la eternidad.',
          onVictory: '¡El trono cósmico permanece inalcanzable!'
        }
      }
    ]
  }
];

export const DEFAULT_HERO_STATE: HeroState = {
  name: 'Héroe del Tablero',
  heroClass: 'knight',
  level: 1,
  xp: 0,
  xpToNextLevel: 250,
  gold: 100,
  skillPoints: 1,
  unlockedSkills: ['vision_de_oraculo'],
  equippedRelics: ['ojo_de_halcon'],
  relicsInventory: ['ojo_de_halcon'],
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
