import { Puzzle, TacticalTheme } from '../types';

export const COMPREHENSIVE_PUZZLES: Puzzle[] = [
  // =========================================================================
  // 1. ATAQUE DOBLE (Double Attack / Fork)
  // =========================================================================
  {
    id: 'tac-ad-01',
    title: 'Ataque Doble de Caballo y Dama en la Octava',
    fen: '6k1/5ppp/8/3N4/8/1Q6/5PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'ataque-doble',
    difficulty: 'Fácil',
    rating: 880,
    description: 'El caballo salta con jaque forzando al rey a retirarse a la esquina h8, permitiendo que la dama penetre con jaque mate en la octava fila.',
    solutionSan: ['Ne7+', 'Kh8', 'Qb8#'],
    solutionExplanation: [
      '1. Ce7+! (Ne7+) Ataque doble del caballo: da jaque y arrebata las casillas de escape.',
      '1... Rh8 (Kh8) 2. Db8# (Qb8#) La dama blanca entra en la 8ª fila asestando jaque mate asistida por el caballo.'
    ],
    hints: [
      'Da un jaque inicial con el caballo para empujar al rey a la esquina.',
      'Aprovecha la penetración de la dama en la octava fila.',
      'Juega 1. Ce7+ (Ne7+)'
    ],
    source: 'Táctica elemental de Ataque Doble'
  },
  {
    id: 'tac-ad-02',
    title: 'Ataque Doble Demoledor sobre el Punto f7',
    fen: 'r4rk1/ppp2ppp/8/8/2B5/1Q6/PP3PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 4,
    theme: 'ataque-doble',
    difficulty: 'Desafiante',
    rating: 1320,
    description: 'Dama y alfil crean un ataque doble sobre el peón débil f7 y coordinan con la torre de e1 para forzar la invasión final.',
    solutionSan: ['Bxf7+', 'Rxf7', 'Qxf7+', 'Kh8', 'Re8+', 'Rxe8', 'Qxe8#'],
    solutionExplanation: [
      '1. Axf7+! (Bxf7+) Ataque doble al rey y a la torre defensora.',
      '1... Txf7 2. Dxf7+ Rh8 3. Te8+! Txe8 4. Dxe8# Jaque mate forzado en el pasillo.'
    ],
    hints: [
      'Inicia la combinación sacrificando el alfil en f7.',
      'Penetra con la dama y luego con la torre en la octava fila.',
      'Juega 1. Axf7+ (Bxf7+)'
    ],
    source: 'Batería dama-alfil sobre punto f7'
  },

  // =========================================================================
  // 2. CLAVADA (Pin)
  // =========================================================================
  {
    id: 'tac-clav-01',
    title: 'Explotación de Clavada Absoluta en f7',
    fen: 'rn3rk1/pbpp1ppp/1p6/8/2B5/5Q2/PPP2PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'clavada-tactica',
    difficulty: 'Fácil',
    rating: 920,
    description: 'La torre negra en f7 queda inmovilizada por la clavada del alfil de c4, lo que permite un remate fulminante en la 8ª fila.',
    solutionSan: ['Qxf7+', 'Rxf7', 'Re8#'],
    solutionExplanation: [
      '1. Dxf7+! (Qxf7+) Sacrificio de dama que atrae a la torre negra a f7.',
      '1... Txf7 (Rxf7) 2. Te8# (Re8#) La torre negra en f7 está clavada por el alfil de c4 y no puede bloquear el jaque de la torre.'
    ],
    hints: [
      'Observa que el alfil de c4 clava la columna defensiva f7.',
      'Sacrifica tu dama en f7 para fijar la torre enemiga.',
      'Juega 1. Dxf7+ (Qxf7+)'
    ],
    source: 'Clavada absoluta clásica'
  },
  {
    id: 'tac-clav-02',
    title: 'Clavada en la Gran Diagonal y Mate de Dama',
    fen: '5r1k/5ppp/8/2B5/8/6Q1/5PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'clavada-tactica',
    difficulty: 'Fácil',
    rating: 890,
    description: 'El alfil blanco clava y captura en f8, preparando la entrada mortal de la dama sobre g7.',
    solutionSan: ['Bxf8', 'Kg8', 'Qxg7#'],
    solutionExplanation: [
      '1. Axf8! (Bxf8) Captura la torre defensora y controla la casilla g7.',
      '1... Rg8 (Kg8) 2. Dxg7# (Qxg7#) La dama asesta jaque mate con el apoyo del alfil en f8.'
    ],
    hints: [
      'Elimina la torre negra en f8 con tu alfil.',
      'Remata con la dama en g7.',
      'Juega 1. Axf8 (Bxf8)'
    ],
    source: 'Coordinación alfil-dama'
  },
  {
    id: 'tac-clav-03',
    title: 'Clavada en Columna Central con Batería',
    fen: 'r3r1k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'clavada-tactica',
    difficulty: 'Fácil',
    rating: 860,
    description: 'La torre negra en e8 está sometida a la presión directa de la batería blanca de dama y torre.',
    solutionSan: ['Qxe8+', 'Rxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. Dxe8+! (Qxe8+) Sacrificio de dama que destruye el primer defensor.',
      '1... Txe8 (Rxe8) 2. Txe8# (Rxe8#) La torre blanca retoma dando jaque mate del pasillo.'
    ],
    hints: [
      'La torre en e8 no tiene suficientes defensores.',
      'Captura la torre con tu dama en e8.',
      'Juega 1. Dxe8+ (Qxe8+)'
    ],
    source: 'Batería en columna central'
  },

  // =========================================================================
  // 3. ATAQUE DESCUBIERTO (Discovered Attack)
  // =========================================================================
  {
    id: 'tac-atdesc-01',
    title: 'Ataque Descubierto Demoledor hacia el Enroque',
    fen: 'r1b2rk1/pp3ppp/8/2bN4/8/3B4/PPP2PPP/R2QR1K1 w - - 0 1',
    turn: 'w',
    mateIn: 4,
    theme: 'ataque-descubierto',
    difficulty: 'Desafiante',
    rating: 1340,
    description: 'El alfil de d3 inicia la apertura del enroque con un sacrificio y luego se retira dando jaque descubierto a la descubierta.',
    solutionSan: ['Bxh7+', 'Kh8', 'Qh5', 'g6', 'Bxg6+', 'Kg7', 'Qh7#'],
    solutionExplanation: [
      '1. Axh7+! (Bxh7+) Rompe la coraza del enroque negro.',
      '1... Rh8 2. Dh5 g6 3. Axg6+! Jaque descubierto devastador con la dama en h5.',
      '3... Rg7 4. Dh7# Jaque mate fulminante.'
    ],
    hints: [
      'Sacrifica en h7 para atraer al rey o quitar el peón protector.',
      'Mueve el alfil a g6 para liberar el jaque de la dama.',
      'Juega 1. Axh7+ (Bxh7+)'
    ],
    source: 'Regalo Griego y ataque descubierto clásico'
  },
  {
    id: 'tac-atdesc-02',
    title: 'Ataque Descubierto de Torre en Columna e',
    fen: '6k1/5ppp/8/8/8/4B3/1Q3PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'ataque-descubierto',
    difficulty: 'Fácil',
    rating: 870,
    description: 'El alfil se desplaza a h6 amenazando mate en g7 y destapando la acción de la torre blanca en e1 hacia e8.',
    solutionSan: ['Bh6', 'gxh6', 'Re8#'],
    solutionExplanation: [
      '1. Ah6! (Bh6) Ataque doble descubierto amenazando Dxg7# y abriendo la columna e.',
      '1... gxh6 (gxh6) 2. Te8# (Re8#) La torre blanca sube con jaque mate del pasillo.'
    ],
    hints: [
      'Mueve el alfil a h6 amenazando mate inmediato en g7.',
      'Aprovecha que la torre de e1 penetra en la 8ª fila.',
      'Juega 1. Ah6 (Bh6)'
    ],
    source: 'Despeje y ataque descubierto'
  },

  // =========================================================================
  // 4. JAQUE DESCUBIERTO (Discovered Check)
  // =========================================================================
  {
    id: 'tac-jaqdesc-01',
    title: 'Jaque Doble Descubierto de Philidor',
    fen: '6k1/5Npp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'jaque-descubierto',
    difficulty: 'Medio',
    rating: 980,
    description: 'El salto de caballo a h6 desata un jaque doble simultáneo de dama y caballo que no puede ser bloqueado ni capturado.',
    solutionSan: ['Nh6+', 'Kh8', 'Qg8#'],
    solutionExplanation: [
      '1. Ch6+! (Nh6+) Jaque doble descubierto con caballo y dama. El rey negro está forzado a huir a h8.',
      '1... Rh8 (Kh8) 2. Dg8# (Qg8#) Jaque mate directo con apoyo del caballo en h6.'
    ],
    hints: [
      'Realiza un jaque doble saltando con el caballo a h6.',
      'Remata con la dama en g8.',
      'Juega 1. Ch6+ (Nh6+)'
    ],
    source: 'Patrón de Jaque Doble Descubierto'
  },
  {
    id: 'tac-jaqdesc-02',
    title: 'Jaque Descubierto y Sacrificio de Dama en g8',
    fen: 'r4rk1/ppp2Npp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 3,
    theme: 'jaque-descubierto',
    difficulty: 'Intermedio',
    rating: 1140,
    description: 'La combinación inmortal: jaque doble descubierto con el caballo, sacrificio de dama para asfixiar al rey y mate de coz.',
    solutionSan: ['Nh6+', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'],
    solutionExplanation: [
      '1. Ch6+! (Nh6+) Jaque doble descubierto con caballo y dama.',
      '1... Rh8 2. Dg8+! Txg8 3. Cf7# Jaque mate de la coz.'
    ],
    hints: [
      'Comienza con el jaque doble en h6.',
      'Entrega la dama en g8 para forzar a la torre a encerrar a su propio rey.',
      'Juega 1. Ch6+ (Nh6+)'
    ],
    source: 'Combinación clásica de Philidor'
  },

  // =========================================================================
  // 5. DESVIACIÓN (Deflection)
  // =========================================================================
  {
    id: 'tac-desv-01',
    title: 'Desviación de la Torre Defensora en la Octava',
    fen: '2r3k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'desviacion',
    difficulty: 'Fácil',
    rating: 860,
    description: 'La dama blanca se sacrifica en e8 para desviar a la torre de c8 de su posición defensiva.',
    solutionSan: ['Qe8+', 'Rxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. De8+! (Qe8+) La dama se entrega en la octava fila obligando a la torre de c8 a capturarla.',
      '1... Txe8 (Rxe8) 2. Txe8# (Rxe8#) La torre blanca de e1 retoma con jaque mate del pasillo.'
    ],
    hints: [
      'Desvía a la torre negra de c8 con un sacrificio directo en e8.',
      'Aprovecha que el rey negro está encerrado por sus peones.',
      'Juega 1. De8+ (Qe8+)'
    ],
    source: 'Desviación clásica de pasillo'
  },
  {
    id: 'tac-desv-02',
    title: 'Desviación con Jaque de Dama en e8',
    fen: '3r2k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'desviacion',
    difficulty: 'Fácil',
    rating: 850,
    description: 'La torre en d8 custodia la octava fila. El sacrificio de dama desvía al defensor de su custodia.',
    solutionSan: ['Qe8+', 'Rxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. De8+! (Qe8+) Desvía a la torre negra de d8.',
      '1... Txe8 (Rxe8) 2. Txe8# (Rxe8#) Remate con la torre en e8.'
    ],
    hints: [
      'Fuerza a la torre negra a abandonar su control de la columna d.',
      'Sacrifica en e8 con la dama.',
      'Juega 1. De8+ (Qe8+)'
    ],
    source: 'Táctica elemental de desviación'
  },

  // =========================================================================
  // 6. ELIMINACIÓN DEL DEFENSOR (Removing the Defender)
  // =========================================================================
  {
    id: 'tac-elim-01',
    title: 'Eliminación del Caballo Defensor en e8',
    fen: '4r1k1/5ppp/5n2/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'eliminacion-del-defensor',
    difficulty: 'Fácil',
    rating: 910,
    description: 'El caballo en f6 defiende la casilla e8. La captura con la dama destruye el bastión defensivo y permite el mate.',
    solutionSan: ['Qxe8+', 'Nxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. Dxe8+! (Qxe8+) Elimina la torre de e8 y fuerza al caballo a retirarse a e8.',
      '1... Cxe8 (Nxe8) 2. Txe8# (Rxe8#) La torre blanca captura al caballo con jaque mate del pasillo.'
    ],
    hints: [
      'Elimina la torre en e8 con la dama para descolocar al caballo.',
      'Retoma con la torre de e1 para dar mate.',
      'Juega 1. Dxe8+ (Qxe8+)'
    ],
    source: 'Eliminación de la pieza defensora'
  },
  {
    id: 'tac-elim-02',
    title: 'Destrucción del Defensor en f7',
    fen: '3r1rk1/5ppp/8/8/2B5/1Q6/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 4,
    theme: 'eliminacion-del-defensor',
    difficulty: 'Desafiante',
    rating: 1330,
    description: 'Alfil y dama destruyen la torre en f7 para eliminar la protección de la octava fila y rematar con la torre en e8.',
    solutionSan: ['Bxf7+', 'Rxf7', 'Qxf7+', 'Kh8', 'Re8+', 'Rxe8', 'Qxe8#'],
    solutionExplanation: [
      '1. Axf7+! (Bxf7+) Aniquila el peón y atrae a la torre defensora.',
      '1... Txf7 2. Dxf7+ Rh8 3. Te8+! Txe8 4. Dxe8# Jaque mate forzado.'
    ],
    hints: [
      'Destruye el punto f7 con el alfil.',
      'Invade con la dama y luego con la torre en e8.',
      'Juega 1. Axf7+ (Bxf7+)'
    ],
    source: 'Destrucción de la defensa en f7'
  },

  // =========================================================================
  // 7. ATRACCIÓN (Attraction / Decoy)
  // =========================================================================
  {
    id: 'tac-atrac-01',
    title: 'Atracción del Rey al Rincón en el Mate Árabe',
    fen: '6k1/5R2/5N2/8/8/8/8/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'atraccion',
    difficulty: 'Fácil',
    rating: 920,
    description: 'La torre en f7 atrae al rey rival hacia el rincón h8 mediante un jaque decisivo, creando la red de mate árabe.',
    solutionSan: ['Rg7+', 'Kh8', 'Rh7#'],
    solutionExplanation: [
      '1. Tg7+! (Rg7+) Atrae al rey negro a la casilla fatal h8.',
      '1... Rh8 (Kh8) 2. Th7# (Rh7#) Jaque mate árabe con la torre protegida por el caballo de f6.'
    ],
    hints: [
      'Empuja al rey negro hacia h8 con jaque de torre.',
      'Remata con Th7# protegido por el caballo.',
      'Juega 1. Tg7+ (Rg7+)'
    ],
    source: 'Patrón de atracción árabe'
  },
  {
    id: 'tac-atrac-02',
    title: 'Atracción y Asfixia del Rey en g8',
    fen: '5rk1/6pp/7N/8/8/8/1Q3PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 3,
    theme: 'atraccion',
    difficulty: 'Medio',
    rating: 1150,
    description: 'El sacrificio de dama en g8 atrae a la torre negra a bloquear la última casilla de escape de su propio rey.',
    solutionSan: ['Qb3+', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'],
    solutionExplanation: [
      '1. Db3+! (Qb3+) Jaque que fuerza al rey a h8.',
      '1... Rh8 2. Dg8+! (Qg8+) Sacrificio de atracción: la torre negra está forzada a capturar en g8.',
      '2... Txg8 3. Cf7# Jaque mate de la coz.'
    ],
    hints: [
      'Da jaque primero con la dama en b3.',
      'Sacrifica la dama en g8 para atraer a la torre negra.',
      'Juega 1. Db3+ (Qb3+)'
    ],
    source: 'Atracción legendaria de Philidor'
  },

  // =========================================================================
  // 8. RAYOS X (X-Ray Attack)
  // =========================================================================
  {
    id: 'tac-rx-01',
    title: 'Ataque de Rayos X en la Columna c y e',
    fen: '2r3k1/5ppp/2q5/8/8/8/5PPP/2R1Q1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'rayos-x',
    difficulty: 'Medio',
    rating: 1020,
    description: 'La dama en e1 ejerce rayos X a través del tablero. Al capturar la dama en c6, la torre negra queda desviada y la octava queda libre.',
    solutionSan: ['Rxc6', 'Rxc6', 'Qe8#'],
    solutionExplanation: [
      '1. Txc6! (Rxc6) Captura la dama negra en c6.',
      '1... Txc6 (Rxc6) 2. De8# (Qe8#) Rayos X: la dama blanca sube directamente a e8 asestando jaque mate del pasillo.'
    ],
    hints: [
      'Captura la dama negra en c6 con tu torre.',
      'Aprovecha que la dama blanca en e1 controla la casilla e8.',
      'Juega 1. Txc6 (Rxc6)'
    ],
    source: 'Rayos X en columna y diagonal'
  },
  {
    id: 'tac-rx-02',
    title: 'Rayos X Cruzados con Batería Doblada',
    fen: '2r1r1k1/5ppp/8/8/8/4Q3/5PPP/2R1R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'rayos-x',
    difficulty: 'Fácil',
    rating: 940,
    description: 'La torre en c1 y la torre en e1 ejercen rayos X demoledores sobre la 8ª fila coordinadas con la dama.',
    solutionSan: ['Qxe8+', 'Rxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. Dxe8+! (Qxe8+) Sacrificio de dama en e8 que desmorona la defensa.',
      '1... Txe8 (Rxe8) 2. Txe8# (Rxe8#) La torre blanca retoma con jaque mate del pasillo.'
    ],
    hints: [
      'Rompe el control de la 8ª fila capturando en e8.',
      'Remata con la torre de e1.',
      'Juega 1. Dxe8+ (Qxe8+)'
    ],
    source: 'Rayos X y batería en columnas abiertas'
  },

  // =========================================================================
  // 9. SOBRECARGA (Overloading)
  // =========================================================================
  {
    id: 'tac-sobr-01',
    title: 'Sobrecarga de la Dama Defensora',
    fen: '3q2k1/3r1ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'sobrecarga',
    difficulty: 'Medio',
    rating: 1010,
    description: 'La dama negra en d8 está sobrecargada: debe defender su torre en d7 y al mismo tiempo custodiar el punto crítico e8.',
    solutionSan: ['Qe8+', 'Qxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. De8+! (Qe8+) Explota la sobrecarga de la dama negra obligándola a acudir a e8.',
      '1... Dxe8 (Qxe8) 2. Txe8# (Rxe8#) La torre blanca asesta jaque mate en el pasillo.'
    ],
    hints: [
      'La dama negra no puede cumplir dos tareas a la vez.',
      'Fuerza a la dama a e8 con 1. De8+.',
      'Juega 1. De8+ (Qe8+)'
    ],
    source: 'Táctica clásica de sobrecarga'
  },

  // =========================================================================
  // 10. COMBINACIONES TÁCTICAS (Tactical Combinations)
  // =========================================================================
  {
    id: 'tac-comb-01',
    title: 'Combinación Táctica con Sacrificio en f7',
    fen: 'rn3rk1/pbpp1ppp/1p6/8/2B5/5Q2/PPP2PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'combinaciones-tacticas',
    difficulty: 'Medio',
    rating: 1080,
    description: 'Una brillante combinación que une el sacrificio de dama, la clavada absoluta del alfil y el remate de la torre en la octava.',
    solutionSan: ['Qxf7+', 'Rxf7', 'Re8#'],
    solutionExplanation: [
      '1. Dxf7+! (Qxf7+) Sacrificio de dama demoledor.',
      '1... Txf7 (Rxf7) 2. Te8# (Re8#) Jaque mate del pasillo facilitado por la clavada de la torre.'
    ],
    hints: [
      'Combina el poder de la dama, el alfil y la torre.',
      'Sacrifica en f7 y remata en e8.',
      'Juega 1. Dxf7+ (Qxf7+)'
    ],
    source: 'Combinación táctica multi-pieza'
  },
  {
    id: 'tac-comb-02',
    title: 'La Inmortal Maniobra de Lucena y Philidor',
    fen: '5rk1/6pp/7N/8/8/8/1Q3PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 3,
    theme: 'combinaciones-tacticas',
    difficulty: 'Medio',
    rating: 1160,
    description: 'La combinación por excelencia del ajedrez: jaque de dama, sacrificio en g8 y mate de caballo asfixiante.',
    solutionSan: ['Qb3+', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'],
    solutionExplanation: [
      '1. Db3+! (Qb3+) Jaque forzando al monarca a entrar en la trampa.',
      '1... Rh8 2. Dg8+! (Qg8+) Sacrificio legendario de dama.',
      '2... Txg8 3. Cf7# Jaque mate de la coz.'
    ],
    hints: [
      'Ubica tu dama en b3 para forzar al rey a la esquina.',
      'Sacrifica la dama en g8.',
      'Juega 1. Db3+ (Qb3+)'
    ],
    source: 'Tratado de Lucena (1497)'
  },

  // =========================================================================
  // MATES DEL PASILLO, COZ, ÁRABE Y CLÁSICOS ADICIONALES
  // =========================================================================
  {
    id: 'm2-01',
    title: 'Sacrificio de Dama en el Pasillo',
    fen: '2r3k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'mate-del-pasillo',
    difficulty: 'Fácil',
    rating: 850,
    description: 'El rey negro está atrapado por sus propios peones en f7, g7 y h7. La torre en c8 es el único defensor de la octava fila.',
    solutionSan: ['Qe8+', 'Rxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. De8+! (Qe8+) Sacrificio de atracción: la dama se entrega con jaque forzando a la torre negra a capturarla.',
      '1... Txe8 (Rxe8) 2. Txe8# (Rxe8#) La torre blanca de e1 entra en e8 asestando el jaque mate del pasillo.'
    ],
    hints: [
      'El rey negro carece de casilla de escape en la octava fila.',
      'Entrega la dama en e8 para desviar a la torre de c8.',
      'Juega 1. De8+ (Qe8+)'
    ],
    source: 'Táctica elemental de pasillo'
  },
  {
    id: 'm2-03',
    title: 'El Gancho del Mate Árabe',
    fen: '6k1/5R2/5N2/8/8/8/8/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'mate-arabe',
    difficulty: 'Fácil',
    rating: 920,
    description: 'El caballo en f6 y la torre en f7 coordinan una trampa perfecta en la esquina contra el rey rival.',
    solutionSan: ['Rg7+', 'Kh8', 'Rh7#'],
    solutionExplanation: [
      '1. Tg7+! (Rg7+) La torre se desplaza a g7 dando jaque y obligando al rey a entrar al rincón h8.',
      '1... Rh8 (Kh8) 2. Th7# (Rh7#) Jaque mate árabe: la torre da jaque en h7 protegida por el caballo de f6.'
    ],
    hints: [
      'Empuja al rey negro hacia el rincón h8.',
      'La torre puede dar jaque en g7 primero.',
      'Juega 1. Tg7+ (Rg7+)'
    ],
    source: 'Final clásico árabe'
  },
  {
    id: 'm2-04',
    title: 'Jaque Doble Descubierto de la Coz',
    fen: '6k1/5Npp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'mate-de-la-coz',
    difficulty: 'Medio',
    rating: 980,
    description: 'El caballo en f7 puede saltar descubriendo el poder de la dama en la gran diagonal hacia g8.',
    solutionSan: ['Nh6+', 'Kh8', 'Qg8#'],
    solutionExplanation: [
      '1. Ch6+! (Nh6+) Jaque doble fulminante con el caballo y la dama a la vez.',
      '1... Rh8 (Kh8) 2. Dg8# (Qg8#) La dama se coloca frente al rey dando jaque mate con el apoyo del caballo en h6.'
    ],
    hints: [
      'El jaque doble obliga al rey enemigo a mover su rey a h8.',
      'Salta con el caballo a h6 descubriendo la línea de la dama.',
      'Juega 1. Ch6+ (Nh6+)'
    ],
    source: 'Patrón clásico de Philidor'
  },
  {
    id: 'm2-05',
    title: 'Batería en la Columna e',
    fen: '3r2k1/5ppp/8/8/8/4Q3/5PPP/4R1K1 w - - 0 1',
    turn: 'w',
    mateIn: 2,
    theme: 'mate-del-pasillo',
    difficulty: 'Fácil',
    rating: 840,
    description: 'La dama en e3 y la torre en e1 forman una columna doblada letal contra la 8ª fila negra.',
    solutionSan: ['Qe8+', 'Rxe8', 'Rxe8#'],
    solutionExplanation: [
      '1. De8+! (Qe8+) La dama se entrega en la 8ª fila obligando a la torre negra a capturar.',
      '1... Txe8 (Rxe8) 2. Txe8# (Rxe8#) La torre blanca retoma dando jaque mate sin salida para el rey.'
    ],
    hints: [
      'Las negras no han jugado h6 o g6 para dar aire a su rey.',
      'La dama puede dar jaque en e8 para atraer a la torre negra.',
      'Juega 1. De8+ (Qe8+)'
    ],
    source: 'Batería en columna abierta'
  }
];

export function getFilteredPuzzles(filters: {
  mateIn?: number | number[];
  theme?: TacticalTheme;
  difficulty?: string;
  search?: string;
  onlyFavorites?: boolean;
  favoritesList?: string[];
}): Puzzle[] {
  return COMPREHENSIVE_PUZZLES.filter(puzzle => {
    if (filters.mateIn) {
      if (Array.isArray(filters.mateIn)) {
        if (!filters.mateIn.includes(puzzle.mateIn)) return false;
      } else {
        if (puzzle.mateIn !== filters.mateIn) return false;
      }
    }
    if (filters.theme && puzzle.theme !== filters.theme) return false;
    if (filters.difficulty && puzzle.difficulty !== filters.difficulty) return false;
    if (filters.onlyFavorites && filters.favoritesList) {
      if (!filters.favoritesList.includes(puzzle.id)) return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      const matchTitle = puzzle.title.toLowerCase().includes(q);
      const matchDesc = puzzle.description.toLowerCase().includes(q);
      const matchTheme = puzzle.theme.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTheme) return false;
    }
    return true;
  });
}
