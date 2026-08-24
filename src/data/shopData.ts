import {
  BoardThemeId,
  PieceSkinId,
  ShopBoardItem,
  ShopPieceItem,
  AdvisorPet,
  ConsumableItem
} from '../types/adventure';

export const SHOP_BOARDS: ShopBoardItem[] = [
  {
    id: 'classic',
    name: 'Tablero Clásico Staunton',
    description: 'El tablero tradicional de competición con contrastes cálidos de madera y crema.',
    icon: '♟️',
    price: 0,
    previewColors: ['#F0D9B5', '#B58863'],
    styleTag: 'Clásico'
  },
  {
    id: 'wood',
    name: 'Madera de Roble Noble',
    description: 'Tallado artesanalmente en madera noble barnizada para grandes maestros.',
    icon: '🪵',
    price: 120,
    previewColors: ['#EBD3A8', '#9A6233'],
    styleTag: 'Artesanal'
  },
  {
    id: 'medieval',
    name: 'Castillo Feudal & Piedra',
    description: 'Piedra de fortaleza medieval con baldosas de salón del trono real.',
    icon: '🏰',
    price: 250,
    previewColors: ['#E2D4C0', '#6D4E3A'],
    styleTag: 'Medieval'
  },
  {
    id: 'war',
    name: 'Trinchera & Frente Bélico',
    description: 'Camuflaje táctico militar y blindaje reforzado con remaches de acero.',
    icon: '🪖',
    price: 320,
    previewColors: ['#A3AA8C', '#46503B'],
    styleTag: 'Guerra'
  },
  {
    id: 'space',
    name: 'Nebulosa & Galaxia Cósmica',
    description: 'Polvo de estrellas y vacío espacial con ribetes de energía ultravioleta.',
    icon: '🚀',
    price: 450,
    previewColors: ['#6366F1', '#1E1B4B'],
    styleTag: 'Espacial'
  },
  {
    id: 'zombie',
    name: 'Yermo Tóxico & Apocalipsis',
    description: 'Suelo radioactivo contaminado con pátina de óxido y niebla verde mutante.',
    icon: '☣️',
    price: 480,
    previewColors: ['#84CC16', '#365314'],
    styleTag: 'Zombies'
  },
  {
    id: 'cyberpunk',
    name: 'Neo-Tokyo 2099 Cyberpunk',
    description: 'Matriz holográfica de cian y magenta neón de alta tecnología.',
    icon: '⚡',
    price: 600,
    previewColors: ['#06B6D4', '#831843'],
    styleTag: 'Futurista'
  },
  {
    id: 'animals',
    name: 'Selva Sagrada & Sabana Salvaje',
    description: 'Follaje esmeralda ancestral y tierra dorada bendecida por los espíritus.',
    icon: '🌿',
    price: 520,
    previewColors: ['#86EFAC', '#14532D'],
    styleTag: 'Animales'
  },
  {
    id: 'gold',
    name: 'Emperador de Oro Puro',
    description: 'Oro macizo de 24 quilates pulido con detalles de terciopelo imperial oscuro.',
    icon: '👑',
    price: 850,
    previewColors: ['#FDE047', '#78350F'],
    styleTag: 'Mítico'
  }
];

export const SHOP_PIECES: ShopPieceItem[] = [
  {
    id: 'classic',
    name: 'Piezas Tradicionales Staunton',
    description: 'El set oficial mundial de alta visibilidad para cálculo preciso.',
    icon: '♔',
    price: 0,
    styleTag: 'Clásico'
  },
  {
    id: 'medieval',
    name: 'Caballería Feudal & Coronas de Hierro',
    description: 'Yelmos forjados, caballos de batalla acorazados y torreones de piedra tallada.',
    icon: '⚔️',
    price: 220,
    styleTag: 'Medieval'
  },
  {
    id: 'war',
    name: 'Ejército Blindado de Infantería',
    description: 'Cascos de combate, morteros y piezas con blindaje táctico.',
    icon: '🎖️',
    price: 280,
    styleTag: 'Guerra'
  },
  {
    id: 'space',
    name: 'Androides & Cruceros Estelares',
    description: 'Hologramas futuristas con reactores iónicos y plasma cósmico.',
    icon: '🛸',
    price: 420,
    styleTag: 'Espacial'
  },
  {
    id: 'zombie',
    name: 'Horda Mutante & Nigromancia',
    description: 'Cráneos tallados, garras infecciosas y energía putrefacta.',
    icon: '🧟',
    price: 460,
    styleTag: 'Zombies'
  },
  {
    id: 'cyberpunk',
    name: 'Sintéticos Neón & Ciborgs',
    description: 'Líneas de código cibernético brillante con reflejos cian y magenta.',
    icon: '🤖',
    price: 580,
    styleTag: 'Futurista'
  },
  {
    id: 'animals',
    name: 'Espíritus Totémicos Salvajes',
    description: 'Lobos, leones, águilas y osos tallados en jade místico.',
    icon: '🦁',
    price: 500,
    styleTag: 'Animales'
  },
  {
    id: 'gold',
    name: 'Corona Imperial de Oro',
    description: 'Piezas fundidas en oro brillante con incrustaciones de rubíes reales.',
    icon: '💎',
    price: 800,
    styleTag: 'Mítico'
  }
];

export const ADVISOR_PETS: AdvisorPet[] = [
  // GRADO BRONCE
  {
    id: 'pet_gatito_sabio',
    name: 'Gatito Aprendiz Mishi',
    grade: 'bronze',
    gradeLabel: 'Grado Bronce',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80',
    icon: '🐱',
    description: 'Un gatito curioso que observa cada jugada y te anima con ronroneos y consejos básicos de apertura.',
    price: 150,
    goldMultiplier: 1.08,
    xpMultiplier: 1.05,
    perkName: 'Curiosidad Felina',
    perkDescription: '+8% Monedas de oro en cada victoria y recordatorios de desarrollar piezas menores.',
    didacticQuotes: [
      '¡Miau! No olvides controlar las casillas centrales con tus peones.',
      '¡Buen salto! Los caballos en el centro tienen hasta 8 casillas de alcance.',
      'Recuerda enrocar a tiempo para mantener al rey seguro, ¡ronrrón!'
    ],
    threatQuotes: [
      '¡Ffff! ¡Cuidado con esa pieza enemiga que se acerca!',
      '¡Miau! Revisa si tu rey tiene casillas de escape.'
    ],
    victoryQuotes: [
      '¡Purrr! ¡Victoria impecable, eres un gran estratega!',
      '¡Miau miau! ¡Jaque mate de campeonato!'
    ]
  },
  {
    id: 'pet_buho_novato',
    name: 'Búho Centinela Arquímedes',
    grade: 'bronze',
    gradeLabel: 'Grado Bronce',
    avatar: 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?w=150&auto=format&fit=crop&q=80',
    icon: '🦉',
    description: 'Ojos vigilantes que detectan cuando una pieza tuya no tiene defensa.',
    price: 220,
    goldMultiplier: 1.12,
    xpMultiplier: 1.10,
    perkName: 'Vigía Nocturno',
    perkDescription: '+12% Monedas y +10% XP en victorias. Avisa de piezas colgantes.',
    didacticQuotes: [
      'Hoo hoo... Antes de mover, pregúntate qué amenaza la última jugada del rival.',
      'Las torres dominan las columnas abiertas. ¡Aprovéchalas!',
      'La pareja de alfiles en finales abiertos es un arma temible.'
    ],
    threatQuotes: [
      '¡Hoo! ¡Alerta! Comprueba si alguna pieza quedó indefensa.',
      '¡Atención! Tu rey está en la misma diagonal que su alfil.'
    ],
    victoryQuotes: [
      '¡Sabiduría pura! Una victoria digna de la biblioteca real.',
      '¡Hoo hoo! ¡Golpe táctico magistral!'
    ]
  },

  // GRADO PLATA
  {
    id: 'pet_lobo_tactico',
    name: 'Lobo Alfa Fenris',
    grade: 'silver',
    gradeLabel: 'Grado Plata',
    avatar: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=150&auto=format&fit=crop&q=80',
    icon: '🐺',
    description: 'Caza en manada y huele los dobles ataques de caballo y clavadas a kilómetros.',
    price: 450,
    goldMultiplier: 1.22,
    xpMultiplier: 1.18,
    perkName: 'Instinto de Caza',
    perkDescription: '+22% Monedas y +18% XP. Resalta tácticas de ataque doble y horquillas.',
    didacticQuotes: [
      '¡Aúuuu! Si clavas su pieza contra el rey, ¡no podrá escapar!',
      'El caballo en f5 o d5 es un depredador insaciable.',
      '¡Corta las líneas de retirada del rey rival!'
    ],
    threatQuotes: [
      '¡Grrr! El enemigo está preparando un ataque por el flanco.',
      '¡Cuidado con la diagonal del enroque!'
    ],
    victoryQuotes: [
      '¡Aúuuu! ¡La presa ha caído bajo tu garra táctica!',
      '¡Caza perfecta! El rey rival no tuvo escapatoria.'
    ]
  },
  {
    id: 'pet_halcon_militar',
    name: 'Halcón Bélico Valkiria',
    grade: 'silver',
    gradeLabel: 'Grado Plata',
    avatar: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=150&auto=format&fit=crop&q=80',
    icon: '🦅',
    description: 'Explorador aéreo militar que detecta debilidades en la estructura de peones rival.',
    price: 520,
    goldMultiplier: 1.25,
    xpMultiplier: 1.22,
    perkName: 'Reconocimiento Aéreo',
    perkDescription: '+25% Monedas y +22% XP. Bonificación en batallas de Guerra y Medievales.',
    didacticQuotes: [
      '¡Visión clara! Los peones doblados y aislados son el blanco perfecto.',
      'Abre las columnas con rupturas de peones para tus piezas pesadas.',
      '¡Golpea la base de la cadena de peones!'
    ],
    threatQuotes: [
      '¡Swoosh! ¡Peligro de incursión enemiga en la 7ª fila!',
      '¡Protege tu casilla f7/f2 inmediatamente!'
    ],
    victoryQuotes: [
      '¡Ataque fulminante desde las alturas!',
      '¡Victoria táctica superior registrada!'
    ]
  },

  // GRADO ORO
  {
    id: 'pet_fenix_solar',
    name: 'Fénix Solar Ignis',
    grade: 'gold',
    gradeLabel: 'Grado Oro',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
    icon: '🔥',
    description: 'Ave mítica renacida de las cenizas. Aumenta el poder de tus sacrificios y ataques demoledores.',
    price: 750,
    goldMultiplier: 1.40,
    xpMultiplier: 1.35,
    perkName: 'Llamarada Estratégica',
    perkDescription: '+40% Monedas y +35% XP. Otorga 1 pista de oráculo gratuita en cada duelo.',
    didacticQuotes: [
      '¡Quema las defensas! Un sacrificio de pieza bien calculado abre paso al jaque mate.',
      'No temas entregar material si ganas la iniciativa y el rey rival queda expuesto.',
      '¡La iniciativa vale más que un peón de ventaja!'
    ],
    threatQuotes: [
      '¡Alerta ígnea! ¡Tu enroque está siendo bombardeado!',
      '¡Maniobra evasiva con tu dama ya!'
    ],
    victoryQuotes: [
      '¡Arde la corona del rey rival en gloria dorada!',
      '¡Victoria inmortal! Tu juego brilla como el sol.'
    ]
  },
  {
    id: 'pet_zorro_cyber',
    name: 'Zorro Cyber Kitsune-9',
    grade: 'gold',
    gradeLabel: 'Grado Oro',
    avatar: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=150&auto=format&fit=crop&q=80',
    icon: '🦊',
    description: 'Familiar cibernético cuántico que predice 3 variantes de juego simultáneas.',
    price: 820,
    goldMultiplier: 1.45,
    xpMultiplier: 1.40,
    perkName: 'Algoritmo Cuántico',
    perkDescription: '+45% Monedas y +40% XP. Bonificación extrema en mundos Futuristas y Espaciales.',
    didacticQuotes: [
      'Calculando... El contrajuego en el centro neutraliza el ataque lateral.',
      'Red de mate detectada en 3 jugadas forzadas.',
      'Sobrecarga los circuitos de la pieza defensora clave.'
    ],
    threatQuotes: [
      '¡ADVERTENCIA DE SISTEMA! Línea táctica rival potencialmente letal.',
      '¡Cortafuegos activado! Revisa la casilla de coronación.'
    ],
    victoryQuotes: [
      '¡Secuencia de jaque mate ejecutada al 100% de eficiencia!',
      '¡Victoria hacker magistral en el tablero!'
    ]
  },

  // GRADO DIAMANTE
  {
    id: 'pet_androide_quantum',
    name: 'Valquiria Cuántica Nova-X',
    grade: 'diamond',
    gradeLabel: 'Grado Diamante',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    icon: '💎',
    description: 'Entidad de inteligencia artificial hiper-evolucionada con cálculo de nivel Gran Maestro.',
    price: 1100,
    goldMultiplier: 1.65,
    xpMultiplier: 1.60,
    perkName: 'Procesador Gran Maestro',
    perkDescription: '+65% Monedas, +60% XP y 2 pistas de Stockfish automáticas en apuros.',
    didacticQuotes: [
      'Evaluación: +3.4. La combinación ganadora comienza con la eliminación del defensor.',
      'Dominio de casillas débiles establecido con precisión quirúrgica.',
      'El final es técnicamente ganado: avanza el peón pasado protegido.'
    ],
    threatQuotes: [
      '¡Peligro crítico! Jugada obligada para mantener la ventaja posicional.',
      '¡Amenaza de mate del pasillo detectada a tiempo!'
    ],
    victoryQuotes: [
      '¡Cálculo impecable! Tu precisión roza la perfección.',
      '¡Victoria dimensional absoluta!'
    ]
  },

  // GRADO MÍTICO
  {
    id: 'pet_dragon_arcanum',
    name: 'Dragón Astral Bahamut',
    grade: 'mythic',
    gradeLabel: 'Grado Mítico',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    icon: '🐉',
    description: 'El legendario Dragón Cósmico soberano de las 64 casillas del universo. El consejero supremo del ajedrez.',
    price: 1600,
    goldMultiplier: 2.00,
    xpMultiplier: 2.00,
    perkName: 'Soberanía Cósmica',
    perkDescription: '¡Doble de Monedas (+100%) y Doble de XP (+100%) en TODO el juego! Consejos de Campeón Mundial.',
    didacticQuotes: [
      '¡Siente el fluir del cosmos! Cada pieza es un planeta en órbita armónica.',
      '¡Desata la tempestad sobre el rey rival! No hay defensa que resista el orden supremo.',
      'El arte del ajedrez es la victoria del espíritu sobre el caos.'
    ],
    threatQuotes: [
      '¡El dragón despierta su escudo astral! Protege tu retaguardia.',
      '¡Atento al contraataque! Mantén la concentración suprema.'
    ],
    victoryQuotes: [
      '¡GLORIA ETERNA! ¡Los cielos coronan tu maestría sobre el tablero!',
      '¡JAQUE MATE CÓSMICO! Eres el auténtico Rey Supremo de las 64 Casillas.'
    ]
  }
];

export const SHOP_CONSUMABLES: ConsumableItem[] = [
  {
    id: 'oracle_potion',
    name: 'Poción del Oráculo Táctico',
    description: 'Revela la mejor jugada recomendada por el motor de análisis en plena batalla.',
    icon: '🧪',
    price: 40,
    count: 1
  },
  {
    id: 'time_warp',
    name: 'Distorsión Temporal de Kronos',
    description: 'Añade +90 segundos adicionales a tu reloj de batalla cuando estás en apuros.',
    icon: '⏳',
    price: 50,
    count: 1
  },
  {
    id: 'shield_rune',
    name: 'Runa Protectora del Rey',
    description: 'Te advierte visualmente si estás a punto de realizar una jugada que cuelga una pieza o recibe mate.',
    icon: '🛡️',
    price: 65,
    count: 1
  }
];
