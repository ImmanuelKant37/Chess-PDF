import { TacticalTheme, TacticalThemeInfo, Puzzle } from '../types';
import { COMPREHENSIVE_PUZZLES } from './puzzleDatabase';

export const TACTICAL_THEMES: Record<TacticalTheme, TacticalThemeInfo> = {
  'ataque-doble': {
    id: 'ataque-doble',
    name: 'Ataque Doble (Horquilla)',
    description: 'Una pieza ataca simultáneamente a dos o más objetivos enemigos que no pueden defenderse a la vez.',
    difficulty: 'Principiante',
    color: 'amber'
  },
  'clavada-tactica': {
    id: 'clavada-tactica',
    name: 'Clavada Táctica (Pin)',
    description: 'Una pieza defensora queda inmovilizada porque moverse expondría al rey u otra pieza de mayor valor.',
    difficulty: 'Principiante',
    color: 'blue'
  },
  'ataque-descubierto': {
    id: 'ataque-descubierto',
    name: 'Ataque Descubierto',
    description: 'Mover una pieza propia libera la línea de ataque de otra pieza de largo alcance situada detrás.',
    difficulty: 'Intermedio',
    color: 'cyan'
  },
  'jaque-descubierto': {
    id: 'jaque-descubierto',
    name: 'Jaque Descubierto',
    description: 'El movimiento de una pieza descubre un jaque implacable al rey contrario, a menudo con jaque doble.',
    difficulty: 'Intermedio',
    color: 'indigo'
  },
  'desviacion': {
    id: 'desviacion',
    name: 'Desviación (Deflection)',
    description: 'Forzar o atraer a una pieza defensora clave para que abandone la casilla o línea que protege.',
    difficulty: 'Intermedio',
    color: 'orange'
  },
  'eliminacion-del-defensor': {
    id: 'eliminacion-del-defensor',
    name: 'Eliminación del Defensor',
    description: 'Destrucción, captura o neutralización de la pieza rival que protegía el punto crítico de mate.',
    difficulty: 'Intermedio',
    color: 'rose'
  },
  'atraccion': {
    id: 'atraccion',
    name: 'Atracción (Decoy)',
    description: 'Arrastrar al rey o una pieza enemiga mediante sacrificios directos a una casilla fatal sin escapatoria.',
    difficulty: 'Intermedio',
    color: 'pink'
  },
  'rayos-x': {
    id: 'rayos-x',
    name: 'Rayos X (X-Ray)',
    description: 'Ataque o defensa ejercido por una pieza de largo alcance a través de una pieza enemiga interpuesta.',
    difficulty: 'Intermedio',
    color: 'purple'
  },
  'sobrecarga': {
    id: 'sobrecarga',
    name: 'Sobrecarga (Overloading)',
    description: 'Explotar que una pieza enemiga tiene asignadas dos o más funciones defensivas imposibles de cumplir.',
    difficulty: 'Intermedio',
    color: 'teal'
  },
  'combinaciones-tacticas': {
    id: 'combinaciones-tacticas',
    name: 'Combinaciones Tácticas',
    description: 'Secuencia combinada de sacrificios y maniobras forzadas que conducen de forma ineludible al jaque mate.',
    difficulty: 'Avanzado',
    color: 'emerald'
  },
  'mate-del-pasillo': {
    id: 'mate-del-pasillo',
    name: 'Mate del Pasillo (Back Rank)',
    description: 'El rey enemigo queda atrapado en su última fila detrás de su propia barrera de peones.',
    difficulty: 'Principiante',
    color: 'emerald'
  },
  'mate-de-la-coz': {
    id: 'mate-de-la-coz',
    name: 'Mate de la Coz (Smothered Mate)',
    description: 'El caballo da jaque mate a un rey asfixiado completamente por sus propias piezas tras un sacrificio.',
    difficulty: 'Intermedio',
    color: 'indigo'
  },
  'sacrificio-de-dama': {
    id: 'sacrificio-de-dama',
    name: 'Sacrificio de Dama Espectacular',
    description: 'Entrega voluntaria de la pieza más valiosa para forzar la apertura decisiva de líneas hacia el rey.',
    difficulty: 'Intermedio',
    color: 'amber'
  },
  'mate-de-anastasia': {
    id: 'mate-de-anastasia',
    name: 'Mate de Anastasia',
    description: 'Caballo y torre colaboran atrapando al rey entre el borde del tablero y un peón amigo.',
    difficulty: 'Intermedio',
    color: 'sky'
  },
  'mate-arabe': {
    id: 'mate-arabe',
    name: 'Mate Árabe',
    description: 'El caballo protege a la torre en la casilla de mate en la esquina mientras corta la casilla de escape.',
    difficulty: 'Principiante',
    color: 'teal'
  },
  'mate-de-boden': {
    id: 'mate-de-boden',
    name: 'Mate de Boden',
    description: 'Dos alfiles en diagonales cruzadas aniquilan al rey rival que tiene sus casillas bloqueadas.',
    difficulty: 'Intermedio',
    color: 'purple'
  },
  'mate-de-damiano': {
    id: 'mate-de-damiano',
    name: 'Mate de Damiano',
    description: 'Ataque frontal a la columna h tras abrirla con sacrificios de torre apoyados por un peón en g6.',
    difficulty: 'Avanzado',
    color: 'rose'
  },
  'mate-del-molino': {
    id: 'mate-del-molino',
    name: 'Ataque de Molino',
    description: 'Repetición alternada de jaques descubiertos y capturas demoledoras que culminan en red de mate.',
    difficulty: 'Avanzado',
    color: 'violet'
  },
  'mate-de-morphy': {
    id: 'mate-de-morphy',
    name: 'Mate de Morphy / Ópera',
    description: 'Patrón clásico de alfil y torre inspirador de la famosa partida de Paul Morphy en la Ópera de París.',
    difficulty: 'Principiante',
    color: 'emerald'
  },
  'patron-clasico': {
    id: 'patron-clasico',
    name: 'Patrones Combinatorios Clásicos',
    description: 'Combinaciones tácticas esenciales que todo jugador principiante debe dominar para rematar.',
    difficulty: 'Principiante',
    color: 'slate'
  }
};

export const INITIAL_PUZZLES: Puzzle[] = COMPREHENSIVE_PUZZLES;
export const PUZZLES: Puzzle[] = COMPREHENSIVE_PUZZLES;

export function getPuzzlesByMate(mateIn?: number): Puzzle[] {
  if (!mateIn) return COMPREHENSIVE_PUZZLES;
  return COMPREHENSIVE_PUZZLES.filter(p => p.mateIn === mateIn);
}

export function getPuzzlesByTheme(theme?: TacticalTheme): Puzzle[] {
  if (!theme) return COMPREHENSIVE_PUZZLES;
  return COMPREHENSIVE_PUZZLES.filter(p => p.theme === theme);
}

export function getRandomPuzzle(mateIn?: number, theme?: TacticalTheme, difficulty?: string): Puzzle {
  let list = COMPREHENSIVE_PUZZLES;
  if (mateIn) list = list.filter(p => p.mateIn === mateIn);
  if (theme) list = list.filter(p => p.theme === theme);
  if (difficulty) list = list.filter(p => p.difficulty === difficulty);
  
  if (list.length === 0) list = COMPREHENSIVE_PUZZLES;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
