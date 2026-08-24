import { HexTileData, HexWorldMap } from '../types/hexMap';
import { ADVENTURE_WORLDS } from './adventureData';
import { AdventureStage } from '../types/adventure';

// Helper to look up a world's stages
const getWorldStages = (worldId: string): AdventureStage[] => {
  const world = ADVENTURE_WORLDS.find((w) => w.id === worldId);
  return world?.stages || [];
};

// Axial coordinates for standard 41-hex circular concentric layout:
// Ring 0 (Center): (0, 0) -> Boss Sanctum
// Ring 1 (6 hexes): radius 1
// Ring 2 (12 hexes): radius 2
// Ring 3 (18 hexes): radius 3
// Ring 4 (4 satellites): radius 4 (North Spire, East Vault, South Entrance Portal, West Crypt)

export const HEX_WORLD_MAPS: Record<string, HexWorldMap> = {
  // ==========================================
  // MUNDO 1: REINO MEDIEVAL (41 Hexágonos en Anillos Concéntricos, 3 Llaves requeridas)
  // ==========================================
  'world-1': (() => {
    const stages = getWorldStages('world-1');

    const rawTiles: Omit<HexTileData, 'stage'>[] = [
      // --- RING 4: SATELLITE BASTIONS (Radius 4) ---
      { id: 'w1-r4-south', col: 0, row: 4, q: 0, r: 4, ring: 4, type: 'start', name: 'Puerta Principal del Feudo', description: 'Portal de entrada al gran reino concéntrico.', icon: '🚩', ambientFeature: 'castle' },
      { id: 'w1-r4-north', col: 0, row: -4, q: 0, r: -4, ring: 4, type: 'key_shrine', name: 'Aguja Celestial de los Reyes', description: '¡Altar sagrado que guarda la 1ª Llave de Bronce del Feudo!', icon: '🗝️', ambientFeature: 'castle' },
      { id: 'w1-r4-east', col: 4, row: -4, q: 4, r: -4, ring: 4, type: 'key_shrine', name: 'Sagrario del Roble Dorado', description: '¡Cofre sellado con la 2ª Llave de Plata del Reino!', icon: '🗝️', ambientFeature: 'trees' },
      { id: 'w1-r4-west', col: -4, row: 4, q: -4, r: 4, ring: 4, type: 'key_shrine', name: 'Cripta de los Antiguos Campeones', description: '¡Guarda la 3ª Llave Real de Oro indispensable para el Jefe!', icon: '🗝️', ambientFeature: 'castle' },

      // --- RING 3: ANILLO EXTERIOR PERIFÉRICO (Radius 3, 18 Hexágonos) ---
      { id: 'w1-r3-01', col: 0, row: -3, q: 0, r: -3, ring: 3, type: 'path', name: 'Paso de la Almena Norte', description: 'Muralla empedrada con vista al valle.', ambientFeature: 'castle' },
      { id: 'w1-r3-02', col: 1, row: -3, q: 1, r: -3, ring: 3, type: 'treasure', name: 'Cofre del Halconero', description: 'Alijo con 80 Monedas de Oro.', rewardGold: 80, icon: '📦' },
      { id: 'w1-r3-03', col: 2, row: -3, q: 2, r: -3, ring: 3, type: 'blocking', name: 'Foso de Rocas Escarpadas', description: 'Precipicio escarpado de granito.', blockingReason: 'Roca resbaladiza e inaccesible.', icon: '⛰️', ambientFeature: 'rocks' },
      { id: 'w1-r3-04', col: 3, row: -3, q: 3, r: -3, ring: 3, type: 'path', name: 'Sendero del Este Soleado', description: 'Camino despejado hacia el bosque de robles.', ambientFeature: 'trees' },
      { id: 'w1-r3-05', col: 3, row: -2, q: 3, r: -2, ring: 3, type: 'battle_no_reward', name: 'Puesto del Escudero', description: 'Escaramuza rápida de práctica de aperturas.', icon: '⚔️', ambientFeature: 'trench' },
      { id: 'w1-r3-06', col: 3, row: -1, q: 3, r: -1, ring: 3, type: 'treasure', name: 'Alijo en el Granero Real', description: 'Bolsa con 90 Monedas de Oro y una Poción del Oráculo.', rewardGold: 90, rewardConsumable: 'oracle_potion', icon: '📦' },
      { id: 'w1-r3-07', col: 3, row: 0, q: 3, r: 0, ring: 3, type: 'blocking', name: 'Río Torrencial del Feudo', description: 'Aguas caudalosas con estacas.', blockingReason: 'Corriente impetuosa imposible de cruzar.', icon: '🌊', ambientFeature: 'water' },
      { id: 'w1-r3-08', col: 2, row: 1, q: 2, r: 1, ring: 3, type: 'path', name: 'Paso de los Establos del Este', description: 'Sendero ancho para carromatos.', ambientFeature: 'castle' },
      { id: 'w1-r3-09', col: 1, row: 2, q: 1, r: 2, ring: 3, type: 'rest_camp', name: 'Manantial de los Peregrinos', description: 'Agua pura que renueva el enfoque táctico.', icon: '⛲', ambientFeature: 'water' },
      { id: 'w1-r3-10', col: 0, row: 3, q: 0, r: 3, ring: 3, type: 'path', name: 'Avenida de los Laureles Sur', description: 'Conector directo desde la puerta sur al anillo intermedio.', ambientFeature: 'trees' },
      { id: 'w1-r3-11', col: -1, row: 3, q: -1, r: 3, ring: 3, type: 'battle_reward', name: 'Puesto de Vanguardia Sur', description: 'Duelo inicial contra el Guardia Bruno.', stageId: 'w1-s1', ambientFeature: 'castle' },
      { id: 'w1-r3-12', col: -2, row: 3, q: -2, r: 3, ring: 3, type: 'path', name: 'Calzada de Adoquines Oeste', description: 'Camino adoquinado hacia la cripta.', ambientFeature: 'castle' },
      { id: 'w1-r3-13', col: -3, row: 3, q: -3, r: 3, ring: 3, type: 'path', name: 'Sendero de las Antorchas', description: 'Vía iluminada que bordea la muralla oeste.', ambientFeature: 'castle' },
      { id: 'w1-r3-14', col: -3, row: 2, q: -3, r: 2, ring: 3, type: 'blocking', name: 'Bosque Prohibido de Espinas', description: 'Zarzales impenetrables.', blockingReason: 'Espinas mágicas impenetrables.', icon: '🌲', ambientFeature: 'trees' },
      { id: 'w1-r3-15', col: -3, row: 1, q: -3, r: 1, ring: 3, type: 'treasure', name: 'Cofre del Cantero', description: '100 Monedas de Oro escondidas en la cantera.', rewardGold: 100, icon: '📦' },
      { id: 'w1-r3-16', col: -3, row: 0, q: -3, r: 0, ring: 3, type: 'battle_no_reward', name: 'Garita de la Guardia Oeste', description: 'Entrenamiento de táctica defensiva.', icon: '⚔️', ambientFeature: 'trench' },
      { id: 'w1-r3-17', col: -2, row: -1, q: -2, r: -1, ring: 3, type: 'blocking', name: 'Muralla de Asedio Infranqueable', description: 'Pared de granito de 8 metros.', blockingReason: 'Muro fortificado impenetrable.', icon: '🧱', ambientFeature: 'castle' },
      { id: 'w1-r3-18', col: -1, row: -2, q: -1, r: -2, ring: 3, type: 'path', name: 'Escaleras de la Guardia Real', description: 'Peldaños de piedra hacia el norte.', ambientFeature: 'castle' },

      // --- RING 2: ANILLO MEDIO / BASTIONES DE COMBATE (Radius 2, 12 Hexágonos) ---
      { id: 'w1-r2-01', col: 0, row: -2, q: 0, r: -2, ring: 2, type: 'battle_reward', name: 'Puente del Foso Superior', description: 'Prueba Táctica contra el Arquero Sir Balin.', stageId: 'w1-s2', ambientFeature: 'castle' },
      { id: 'w1-r2-02', col: 1, row: -2, q: 1, r: -2, ring: 2, type: 'path', name: 'Galería de los Estandartes', description: 'Corredor engalanado con blasones reales.', ambientFeature: 'castle' },
      { id: 'w1-r2-03', col: 2, row: -2, q: 2, r: -2, ring: 2, type: 'treasure', name: 'Alijo del Alquimista', description: '110 Monedas de Oro y una Runa Protectora.', rewardGold: 110, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w1-r2-04', col: 2, row: -1, q: 2, r: -1, ring: 2, type: 'blocking', name: 'Reja de Hierro Forjado Cerrada', description: 'Portón con cerrojo mágico.', blockingReason: 'Reja indestructible.', icon: '🛡️', ambientFeature: 'castle' },
      { id: 'w1-r2-05', col: 2, row: 0, q: 2, r: 0, ring: 2, type: 'path', name: 'Patio de Armas Oriental', description: 'Área de entrenamiento militar.', ambientFeature: 'castle' },
      { id: 'w1-r2-06', col: 1, row: 1, q: 1, r: 1, ring: 2, type: 'battle_reward', name: 'Campamento de Caballería Pesada', description: 'Combate táctico contra Sir Tristán del Roble.', stageId: 'w1-s3', ambientFeature: 'trench' },
      { id: 'w1-r2-07', col: 0, row: 2, q: 0, r: 2, ring: 2, type: 'path', name: 'Pasadizo de los Héroes', description: 'Senda principal que conecta el sur con la antecámara.', ambientFeature: 'castle' },
      { id: 'w1-r2-08', col: -1, row: 2, q: -1, r: 2, ring: 2, type: 'rest_camp', name: 'Campamento de Juglares Reales', description: 'Música y relatos de campeones para afinar el juego.', icon: '⛺', ambientFeature: 'trees' },
      { id: 'w1-r2-09', col: -2, row: 2, q: -2, r: 2, ring: 2, type: 'blocking', name: 'Foso con Estacas Afiladas', description: 'Trinchera defensiva profunda.', blockingReason: 'Estacas de madera y foso profundo.', icon: '🌊', ambientFeature: 'water' },
      { id: 'w1-r2-10', col: -2, row: 1, q: -2, r: 1, ring: 2, type: 'path', name: 'Camino de los Escudos', description: 'Avenida conmemorativa de victorias feudales.', ambientFeature: 'castle' },
      { id: 'w1-r2-11', col: -2, row: 0, q: -2, r: 0, ring: 2, type: 'battle_reward', name: 'Bastión de la Guardia de Honor', description: 'Prueba Táctica contra la Comandante Gwendolyn.', stageId: 'w1-s4', ambientFeature: 'castle' },
      { id: 'w1-r2-12', col: -1, row: -1, q: -1, r: -1, ring: 2, type: 'path', name: 'Arco Triunfal de Piedra', description: 'Pórtico solemne hacia el círculo interior.', ambientFeature: 'castle' },

      // --- RING 1: ANILLO INTERIOR / PUERTAS DEL REY (Radius 1, 6 Hexágonos) ---
      { id: 'w1-r1-north', col: 0, row: -1, q: 0, r: -1, ring: 1, type: 'path', name: 'Puente Levadizo Norte', description: 'Acceso superior a la Sala del Trono.', ambientFeature: 'castle' },
      { id: 'w1-r1-northeast', col: 1, row: -1, q: 1, r: -1, ring: 1, type: 'rest_camp', name: 'Estatua del Gran Campeón', description: 'Monumento sagrado que otorga templanza absoluta.', icon: '🗿', ambientFeature: 'castle' },
      { id: 'w1-r1-southeast', col: 1, row: 0, q: 1, r: 0, ring: 1, type: 'path', name: 'Pórtico Real del Este', description: 'Entrada majestuosa alfombrada en terciopelo.', ambientFeature: 'castle' },
      { id: 'w1-r1-south', col: 0, row: 1, q: 0, r: 1, ring: 1, type: 'path', name: 'Gran Escalinata de Mármol', description: 'Acceso ceremonial central al Trono.', ambientFeature: 'castle' },
      { id: 'w1-r1-southwest', col: -1, row: 1, q: -1, r: 1, ring: 1, type: 'treasure', name: 'Tesoro de la Corona Real', description: '150 Monedas de Oro y Runa de Defensa.', rewardGold: 150, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w1-r1-northwest', col: -1, row: 0, q: -1, r: 0, ring: 1, type: 'path', name: 'Pórtico Real del Oeste', description: 'Acceso iluminado por candelabros dorados.', ambientFeature: 'castle' },

      // --- RING 0: NÚCLEO CENTRAL / SALÓN DEL JEFE SUPREMO (Radius 0, 1 Hexágono) ---
      { id: 'w1-boss', col: 0, row: 0, q: 0, r: 0, ring: 0, type: 'boss_gate', name: 'Salón del Rey Tirano de Hierro', description: '¡La Batalla Final del Feudo! Requiere las 3 Llaves Místicas para romper el sello.', stageId: 'w1-s5', icon: '👑', ambientFeature: 'castle' }
    ];

    const tiles: HexTileData[] = rawTiles.map((t) => ({
      ...t,
      stage: t.stageId ? stages.find((s) => s.id === t.stageId) : undefined
    }));

    return {
      worldId: 'world-1',
      worldNumber: 1,
      worldName: 'Reino Medieval & Bastión Feudal',
      themeStyle: 'medieval',
      cols: 9,
      rows: 9,
      requiredKeysForBoss: 3,
      startHexId: 'w1-r4-south',
      bossHexId: 'w1-boss',
      tiles
    };
  })(),

  // ==========================================
  // MUNDO 2: FRENTE DE GUERRA TÁCTICA (41 Hexágonos Radiales, 3 Llaves requeridas)
  // ==========================================
  'world-2': (() => {
    const stages = getWorldStages('world-2');

    const rawTiles: Omit<HexTileData, 'stage'>[] = [
      // Ring 4 Satellites
      { id: 'w2-r4-south', col: 0, row: 4, q: 0, r: 4, ring: 4, type: 'start', name: 'Trinchera Base Alfa (Spawn)', description: 'Puesto de mando de despliegue aliado.', icon: '🚩', ambientFeature: 'trench' },
      { id: 'w2-r4-north', col: 0, row: -4, q: 0, r: -4, ring: 4, type: 'key_shrine', name: 'Torre de Radar Norte', description: '¡Guarda la 1ª Tarjeta Llave Militar!', icon: '🗝️', ambientFeature: 'radar' },
      { id: 'w2-r4-east', col: 4, row: -4, q: 4, r: -4, ring: 4, type: 'key_shrine', name: 'Búnker de Criptografía Oriental', description: '¡Contiene la 2ª Tarjeta Llave de Cifrado!', icon: '🗝️', ambientFeature: 'trench' },
      { id: 'w2-r4-west', col: -4, row: 4, q: -4, r: 4, ring: 4, type: 'key_shrine', name: 'Cúpula Blindada Secreta', description: '¡Aquí está la 3ª Tarjeta Llave del Estado Mayor!', icon: '🗝️', ambientFeature: 'trench' },

      // Ring 3 Outer
      { id: 'w2-r3-01', col: 0, row: -3, q: 0, r: -3, ring: 3, type: 'path', name: 'Pista de Aterrizaje Norte', description: 'Asfalto militar transitable.', ambientFeature: 'trench' },
      { id: 'w2-r3-02', col: 1, row: -3, q: 1, r: -3, ring: 3, type: 'treasure', name: 'Caja de Suministros Médicos', description: '90 Oro y Reloj Temporal.', rewardGold: 90, rewardConsumable: 'time_warp', icon: '📦' },
      { id: 'w2-r3-03', col: 2, row: -3, q: 2, r: -3, ring: 3, type: 'blocking', name: 'Campo Minado Activo', description: 'Explosivos enterrados activos.', blockingReason: 'Minas terrestres sin detonar.', icon: '💥', ambientFeature: 'crater' },
      { id: 'w2-r3-04', col: 3, row: -3, q: 3, r: -3, ring: 3, type: 'path', name: 'Línea de Abastecimiento', description: 'Carretera de convoy militar.', ambientFeature: 'trench' },
      { id: 'w2-r3-05', col: 3, row: -2, q: 3, r: -2, ring: 3, type: 'battle_no_reward', name: 'Puesto de Francotirador', description: 'Reto rápido de puntería táctica.', icon: '⚔️', ambientFeature: 'trench' },
      { id: 'w2-r3-06', col: 3, row: -1, q: 3, r: -1, ring: 3, type: 'treasure', name: 'Cofre de Munición Especial', description: '100 Monedas de Oro tácticas.', rewardGold: 100, icon: '📦' },
      { id: 'w2-r3-07', col: 3, row: 0, q: 3, r: 0, ring: 3, type: 'blocking', name: 'Río Tóxico con Residuos Químicos', description: 'Líquido corrosivo hirviente.', blockingReason: 'Corriente química mortal.', icon: '☣️', ambientFeature: 'water' },
      { id: 'w2-r3-08', col: 2, row: 1, q: 2, r: 1, ring: 3, type: 'path', name: 'Perímetro del Aeródromo', description: 'Camino de grava junto a los hangares.', ambientFeature: 'trench' },
      { id: 'w2-r3-09', col: 1, row: 2, q: 1, r: 2, ring: 3, type: 'rest_camp', name: 'Hospital de Campaña Aliado', description: 'Recupera fuerzas con consejos del oficial médico.', icon: '🏥', ambientFeature: 'trench' },
      { id: 'w2-r3-10', col: 0, row: 3, q: 0, r: 3, ring: 3, type: 'path', name: 'Zanja de Comunicación Sur', description: 'Corredor protegido por sacos de arena.', ambientFeature: 'trench' },
      { id: 'w2-r3-11', col: -1, row: 3, q: -1, r: 3, ring: 3, type: 'battle_reward', name: 'Trinchera de Vanguardia', description: 'Duelo de artillería contra el Sargento Viktor.', stageId: 'w2-s1', ambientFeature: 'trench' },
      { id: 'w2-r3-12', col: -2, row: 3, q: -2, r: 3, ring: 3, type: 'path', name: 'Camino de Blindados', description: 'Huellas de tanques en el barro.', ambientFeature: 'trench' },
      { id: 'w2-r3-13', col: -3, row: 3, q: -3, r: 3, ring: 3, type: 'path', name: 'Sector de Morteros Oeste', description: 'Línea de fuego aliada.', ambientFeature: 'trench' },
      { id: 'w2-r3-14', col: -3, row: 2, q: -3, r: 2, ring: 3, type: 'blocking', name: 'Alambre de Espino Electrificado', description: 'Cerca con alto voltaje.', blockingReason: 'Voltaje letal e infranqueable.', icon: '⚡', ambientFeature: 'trench' },
      { id: 'w2-r3-15', col: -3, row: 1, q: -3, r: 1, ring: 3, type: 'treasure', name: 'Bolsa Táctica de Oficial', description: '120 Oro y Poción del Oráculo.', rewardGold: 120, rewardConsumable: 'oracle_potion', icon: '📦' },
      { id: 'w2-r3-16', col: -3, row: 0, q: -3, r: 0, ring: 3, type: 'battle_no_reward', name: 'Patrulla de Reconocimiento', description: 'Escaramuza de maniobras rápidas.', icon: '⚔️', ambientFeature: 'trench' },
      { id: 'w2-r3-17', col: -2, row: -1, q: -2, r: -1, ring: 3, type: 'blocking', name: 'Muro Antitanque Dientes de Dragón', description: 'Pirámides macizas de hormigón.', blockingReason: 'Barrera antitanque impenetrable.', icon: '🚧', ambientFeature: 'rocks' },
      { id: 'w2-r3-18', col: -1, row: -2, q: -1, r: -2, ring: 3, type: 'path', name: 'Paso del Río Fangoso', description: 'Vado reforzado de hormigón.', ambientFeature: 'water' },

      // Ring 2 Mid
      { id: 'w2-r2-01', col: 0, row: -2, q: 0, r: -2, ring: 2, type: 'battle_reward', name: 'Batería Antiaérea Pesada', description: 'Prueba Táctica contra la Mayor Elena.', stageId: 'w2-s2', ambientFeature: 'trench' },
      { id: 'w2-r2-02', col: 1, row: -2, q: 1, r: -2, ring: 2, type: 'path', name: 'Túnel Subterráneo Reforzado', description: 'Corredor blindado bajo el frente.', ambientFeature: 'trench' },
      { id: 'w2-r2-03', col: 2, row: -2, q: 2, r: -2, ring: 2, type: 'treasure', name: 'Caja Fuerte de Campaña', description: '130 Monedas de Oro.', rewardGold: 130, icon: '📦' },
      { id: 'w2-r2-04', col: 2, row: -1, q: 2, r: -1, ring: 2, type: 'blocking', name: 'Zona Cero de Bombardeo', description: 'Fuego activo y escombros incandescentes.', blockingReason: 'Fuego activo e intransitable.', icon: '🔥', ambientFeature: 'crater' },
      { id: 'w2-r2-05', col: 2, row: 0, q: 2, r: 0, ring: 2, type: 'path', name: 'Acceso al Puente de Acero', description: 'Estructura metálica hacia el cuartel general.', ambientFeature: 'trench' },
      { id: 'w2-r2-06', col: 1, row: 1, q: 1, r: 1, ring: 2, type: 'battle_reward', name: 'Hangar de Tanques Blindados', description: 'Combate táctico contra el Coronel Marcus.', stageId: 'w2-s3', ambientFeature: 'trench' },
      { id: 'w2-r2-07', col: 0, row: 2, q: 0, r: 2, ring: 2, type: 'path', name: 'Carretera de Tanques Pesados', description: 'Pavimento reforzado hacia el búnker.', ambientFeature: 'trench' },
      { id: 'w2-r2-08', col: -1, row: 2, q: -1, r: 2, ring: 2, type: 'rest_camp', name: 'Tienda de Inteligencia Táctica', description: 'Analiza mapas de posiciones maestras.', icon: '⛺', ambientFeature: 'trench' },
      { id: 'w2-r2-09', col: -2, row: 2, q: -2, r: 2, ring: 2, type: 'blocking', name: 'Torreta Automática de Calibre Pesado', description: 'Cañón centinela computarizado.', blockingReason: 'Línea de fuego letal ininterrumpida.', icon: '🛡️', ambientFeature: 'trench' },
      { id: 'w2-r2-10', col: -2, row: 1, q: -2, r: 1, ring: 2, type: 'path', name: 'Puesto de Observación Oeste', description: 'Mirador fortificado.', ambientFeature: 'trench' },
      { id: 'w2-r2-11', col: -2, row: 0, q: -2, r: 0, ring: 2, type: 'battle_reward', name: 'Torre de Francotiradores Élite', description: 'Prueba Táctica contra la Francotiradora Natasha.', stageId: 'w2-s4', ambientFeature: 'trench' },
      { id: 'w2-r2-12', col: -1, row: -1, q: -1, r: -1, ring: 2, type: 'path', name: 'Avenida de la Victoria', description: 'Gran explanada ante la fortaleza.', ambientFeature: 'trench' },

      // Ring 1 Inner
      { id: 'w2-r1-north', col: 0, row: -1, q: 0, r: -1, ring: 1, type: 'path', name: 'Compuerta Hidráulica Norte', description: 'Esclusa de acero de alta presión.', ambientFeature: 'trench' },
      { id: 'w2-r1-northeast', col: 1, row: -1, q: 1, r: -1, ring: 1, type: 'rest_camp', name: 'Monumento a los Héroes', description: 'Disciplina y calma para el duelo final.', icon: '🗿', ambientFeature: 'trench' },
      { id: 'w2-r1-southeast', col: 1, row: 0, q: 1, r: 0, ring: 1, type: 'path', name: 'Corredor Blindado Este', description: 'Paredes de titanio antimisiles.', ambientFeature: 'trench' },
      { id: 'w2-r1-south', col: 0, row: 1, q: 0, r: 1, ring: 1, type: 'path', name: 'Pasarela del Alto Mando', description: 'Acceso central al búnker supremo.', ambientFeature: 'trench' },
      { id: 'w2-r1-southwest', col: -1, row: 1, q: -1, r: 1, ring: 1, type: 'treasure', name: 'Caja Fuerte del Estado Mayor', description: '160 Monedas de Oro y Runa de Escudo.', rewardGold: 160, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w2-r1-northwest', col: -1, row: 0, q: -1, r: 0, ring: 1, type: 'path', name: 'Corredor Blindado Oeste', description: 'Puertas herméticas reforzadas.', ambientFeature: 'trench' },

      // Ring 0 Center Boss
      { id: 'w2-boss', col: 0, row: 0, q: 0, r: 0, ring: 0, type: 'boss_gate', name: 'Búnker Acorazado del General Blitz', description: '¡Batalla Final del Frente! Requiere 3 Tarjetas Llave Militares para desactivar los cierres blindados.', stageId: 'w2-s5', icon: '👑', ambientFeature: 'trench' }
    ];

    const tiles: HexTileData[] = rawTiles.map((t) => ({
      ...t,
      stage: t.stageId ? stages.find((s) => s.id === t.stageId) : undefined
    }));

    return {
      worldId: 'world-2',
      worldNumber: 2,
      worldName: 'Frente de Guerra Táctica',
      themeStyle: 'war',
      cols: 9,
      rows: 9,
      requiredKeysForBoss: 3,
      startHexId: 'w2-r4-south',
      bossHexId: 'w2-boss',
      tiles
    };
  })(),

  // ==========================================
  // MUNDO 3: ODISEA ESPACIAL (41 Hexágonos Orbitales, 4 Llaves requeridas)
  // ==========================================
  'world-3': (() => {
    const stages = getWorldStages('world-3');

    const rawTiles: Omit<HexTileData, 'stage'>[] = [
      // Ring 4 Satellites
      { id: 'w3-r4-south', col: 0, row: 4, q: 0, r: 4, ring: 4, type: 'start', name: 'Muelle de Atraque Orbital (Spawn)', description: 'Bahía de aterrizaje de tu transbordador.', icon: '🚩', ambientFeature: 'radar' },
      { id: 'w3-r4-north', col: 0, row: -4, q: 0, r: -4, ring: 4, type: 'key_shrine', name: 'Satélite Baliza Pulsar Alfa', description: '¡Guarda la 1ª Llave Cuántica!', icon: '🗝️', ambientFeature: 'crystals' },
      { id: 'w3-r4-east', col: 4, row: -4, q: 4, r: -4, ring: 4, type: 'key_shrine', name: 'Núcleo de Criógeno Cósmico', description: '¡Guarda la 2ª Llave Cuántica!', icon: '🗝️', ambientFeature: 'crystals' },
      { id: 'w3-r4-west', col: -4, row: 4, q: -4, r: 4, ring: 4, type: 'key_shrine', name: 'Esfera de Energía Solar Primaria', description: '¡Guarda la 3ª Llave Cuántica!', icon: '🗝️', ambientFeature: 'crystals' },

      // Ring 3 Outer
      { id: 'w3-r3-01', col: 0, row: -3, q: 0, r: -3, ring: 3, type: 'path', name: 'Pasarela Gravitacional Alfa', description: 'Puente magnético presurizado.', ambientFeature: 'radar' },
      { id: 'w3-r3-02', col: 1, row: -3, q: 1, r: -3, ring: 3, type: 'treasure', name: 'Cápsula de Antimateria', description: '110 Monedas de Oro estelares.', rewardGold: 110, icon: '📦' },
      { id: 'w3-r3-03', col: 2, row: -3, q: 2, r: -3, ring: 3, type: 'blocking', name: 'Campo de Asteroides Letal', description: 'Meteoritos a hipervelocidad.', blockingReason: 'Impactos de asteroides constantes.', icon: '☄️', ambientFeature: 'rocks' },
      { id: 'w3-r3-04', col: 3, row: -3, q: 3, r: -3, ring: 3, type: 'path', name: 'Anillo de Aceleración Cuántica', description: 'Túnel de partículas subatómicas.', ambientFeature: 'radar' },
      { id: 'w3-r3-05', col: 3, row: -2, q: 3, r: -2, ring: 3, type: 'battle_no_reward', name: 'Simulador de Drones Tácticos', description: 'Entrenamiento táctico sin recompensa.', icon: '⚔️', ambientFeature: 'radar' },
      { id: 'w3-r3-06', col: 3, row: -1, q: 3, r: -1, ring: 3, type: 'treasure', name: 'Alijo del Corsario Galáctico', description: '120 Oro y Poción del Oráculo.', rewardGold: 120, rewardConsumable: 'oracle_potion', icon: '📦' },
      { id: 'w3-r3-07', col: 3, row: 0, q: 3, r: 0, ring: 3, type: 'key_shrine', name: 'Compuerta del Hiperespacio Profundo', description: '¡Guarda la 4ª Llave Cuántica!', icon: '🗝️' },
      { id: 'w3-r3-08', col: 2, row: 1, q: 2, r: 1, ring: 3, type: 'path', name: 'Sector de Lanzaderas', description: 'Plataformas de despegue vertical.', ambientFeature: 'radar' },
      { id: 'w3-r3-09', col: 1, row: 2, q: 1, r: 2, ring: 3, type: 'rest_camp', name: 'Cámara de Regeneración Celular', description: 'Recarga escudos y medita en jugadas cósmicas.', icon: '✨', ambientFeature: 'crystals' },
      { id: 'w3-r3-10', col: 0, row: 3, q: 0, r: 3, ring: 3, type: 'path', name: 'Corredor de Hiperpropulsión Sur', description: 'Pasillo con ledes de navegación estelar.', ambientFeature: 'radar' },
      { id: 'w3-r3-11', col: -1, row: 3, q: -1, r: 3, ring: 3, type: 'battle_reward', name: 'Bahía de Cazas Estelares', description: 'Duelo cósmico contra el Piloto Orión.', stageId: 'w3-s1', ambientFeature: 'radar' },
      { id: 'w3-r3-12', col: -2, row: 3, q: -2, r: 3, ring: 3, type: 'path', name: 'Conducto de Plasma Solar', description: 'Tuberías de energía brillante.', ambientFeature: 'radar' },
      { id: 'w3-r3-13', col: -3, row: 3, q: -3, r: 3, ring: 3, type: 'path', name: 'Pasarela de Cristal Reforzado', description: 'Vista panorámica de la nebulosa.', ambientFeature: 'crystals' },
      { id: 'w3-r3-14', col: -3, row: 2, q: -3, r: 2, ring: 3, type: 'blocking', name: 'Vacío Interestelar Sin Gravedad', description: 'Abismo estelar sin oxígeno.', blockingReason: 'Vacío espacial despresurizado.', icon: '🌌', ambientFeature: 'crystals' },
      { id: 'w3-r3-15', col: -3, row: 1, q: -3, r: 1, ring: 3, type: 'treasure', name: 'Batería de Iones Raros', description: '130 Monedas de Oro estelares.', rewardGold: 130, icon: '📦' },
      { id: 'w3-r3-16', col: -3, row: 0, q: -3, r: 0, ring: 3, type: 'battle_no_reward', name: 'Cámara de Telemetría Láser', description: 'Escaramuza de rayos fotónicos.', icon: '⚔️', ambientFeature: 'radar' },
      { id: 'w3-r3-17', col: -2, row: -1, q: -2, r: -1, ring: 3, type: 'blocking', name: 'Radiación de Supernova', description: 'Ondas térmicas letales.', blockingReason: 'Radiación gamma extrema.', icon: '☀️', ambientFeature: 'crystals' },
      { id: 'w3-r3-18', col: -1, row: -2, q: -1, r: -2, ring: 3, type: 'path', name: 'Vía Láctea Estelar', description: 'Camino de luz hacia la superestructura.', ambientFeature: 'crystals' },

      // Ring 2 Mid
      { id: 'w3-r2-01', col: 0, row: -2, q: 0, r: -2, ring: 2, type: 'battle_reward', name: 'Cúpula del Observatorio Galáctico', description: 'Prueba Táctica contra la Oficial Lyra.', stageId: 'w3-s2', ambientFeature: 'radar' },
      { id: 'w3-r2-02', col: 1, row: -2, q: 1, r: -2, ring: 2, type: 'path', name: 'Paso del Puente Magnético', description: 'Senda flotante sobre el reactor.', ambientFeature: 'radar' },
      { id: 'w3-r2-03', col: 2, row: -2, q: 2, r: -2, ring: 2, type: 'treasure', name: 'Cristales de Hiperespacio', description: '140 Monedas de Oro.', rewardGold: 140, icon: '📦' },
      { id: 'w3-r2-04', col: 2, row: -1, q: 2, r: -1, ring: 2, type: 'blocking', name: 'Anomalía Temporal Cuántica', description: 'Fisura gravitacional distorsionada.', blockingReason: 'Distorsión de la física euclidiana.', icon: '🌀', ambientFeature: 'crystals' },
      { id: 'w3-r2-05', col: 2, row: 0, q: 2, r: 0, ring: 2, type: 'path', name: 'Corredor de Titanes', description: 'Columnas de aleación espacial.', ambientFeature: 'radar' },
      { id: 'w3-r2-06', col: 1, row: 1, q: 1, r: 1, ring: 2, type: 'battle_reward', name: 'Generador de Agujeros Negros', description: 'Combate táctico contra el Dr. Vórtice.', stageId: 'w3-s3', ambientFeature: 'crystals' },
      { id: 'w3-r2-07', col: 0, row: 2, q: 0, r: 2, ring: 2, type: 'path', name: 'Plataforma de Acoplamiento Supremo', description: 'Ruta principal a la nave nodriza.', ambientFeature: 'radar' },
      { id: 'w3-r2-08', col: -1, row: 2, q: -1, r: 2, ring: 2, type: 'rest_camp', name: 'Santuario de Hologramas Ancestrales', description: 'Aprende lecciones de las civilizaciones estelares.', icon: '🌌', ambientFeature: 'crystals' },
      { id: 'w3-r2-09', col: -2, row: 2, q: -2, r: 2, ring: 2, type: 'blocking', name: 'Campo de Fuerza de Materia Oscura', description: 'Barrera impenetrable de energía.', blockingReason: 'Escudo energético impenetrable.', icon: '🛡️', ambientFeature: 'crystals' },
      { id: 'w3-r2-10', col: -2, row: 1, q: -2, r: 1, ring: 2, type: 'path', name: 'Laboratorio de Astrofísica', description: 'Módulos con telescopios cuánticos.', ambientFeature: 'radar' },
      { id: 'w3-r2-11', col: -2, row: 0, q: -2, r: 0, ring: 2, type: 'battle_reward', name: 'Matriz de Inteligencia Sintética', description: 'Prueba Táctica contra la Androide Cyra-7.', stageId: 'w3-s4', ambientFeature: 'radar' },
      { id: 'w3-r2-12', col: -1, row: -1, q: -1, r: -1, ring: 2, type: 'path', name: 'Portal de la Ciudadela Orbital', description: 'Grandes puertas de aleación estelar.', ambientFeature: 'radar' },

      // Ring 1 Inner
      { id: 'w3-r1-north', col: 0, row: -1, q: 0, r: -1, ring: 1, type: 'path', name: 'Acceso a la Cubierta de Mando', description: 'Elevador de alta velocidad gravitatoria.', ambientFeature: 'radar' },
      { id: 'w3-r1-northeast', col: 1, row: -1, q: 1, r: -1, ring: 1, type: 'rest_camp', name: 'Monolito Alienígena de Sabiduría', description: 'Conecta con la mente maestra del cosmos.', icon: '🛸', ambientFeature: 'crystals' },
      { id: 'w3-r1-southeast', col: 1, row: 0, q: 1, r: 0, ring: 1, type: 'path', name: 'Cámara de Fusión de Iones', description: 'Túnel de plasma estabilizado.', ambientFeature: 'radar' },
      { id: 'w3-r1-south', col: 0, row: 1, q: 0, r: 1, ring: 1, type: 'path', name: 'Puerta del Núcleo Estelar', description: 'Acceso sellado a la cámara principal.', ambientFeature: 'radar' },
      { id: 'w3-r1-southwest', col: -1, row: 1, q: -1, r: 1, ring: 1, type: 'treasure', name: 'Tesoro de la Federación Galáctica', description: '180 Monedas de Oro y Runa de Escudo.', rewardGold: 180, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w3-r1-northwest', col: -1, row: 0, q: -1, r: 0, ring: 1, type: 'path', name: 'Esclusa de Plasma', description: 'Compuerta de vacío cuántico.', ambientFeature: 'radar' },

      // Ring 0 Boss
      { id: 'w3-boss', col: 0, row: 0, q: 0, r: 0, ring: 0, type: 'boss_gate', name: 'Reactor de Fusión del Almirante Nova', description: '¡La Batalla Espacial Suprema! Requiere 4 Llaves Cuánticas para apagar el escudo de hiperfusión.', stageId: 'w3-s5', icon: '👑', ambientFeature: 'radar' }
    ];

    const tiles: HexTileData[] = rawTiles.map((t) => ({
      ...t,
      stage: t.stageId ? stages.find((s) => s.id === t.stageId) : undefined
    }));

    return {
      worldId: 'world-3',
      worldNumber: 3,
      worldName: 'Odisea Espacial & Flota Cósmica',
      themeStyle: 'space',
      cols: 9,
      rows: 9,
      requiredKeysForBoss: 4,
      startHexId: 'w3-r4-south',
      bossHexId: 'w3-boss',
      tiles
    };
  })(),

  // ==========================================
  // MUNDO 4: APOCALIPSIS ZOMBI (41 Hexágonos Radiales, 4 Llaves requeridas)
  // ==========================================
  'world-4': (() => {
    const stages = getWorldStages('world-4');

    const rawTiles: Omit<HexTileData, 'stage'>[] = [
      // Ring 4 Satellites
      { id: 'w4-r4-south', col: 0, row: 4, q: 0, r: 4, ring: 4, type: 'start', name: 'Zona Segura de Evacuación (Spawn)', description: 'Punto de partida de los sobrevivientes.', icon: '🚩', ambientFeature: 'trench' },
      { id: 'w4-r4-north', col: 0, row: -4, q: 0, r: -4, ring: 4, type: 'key_shrine', name: 'Helipuerto Hundido', description: '¡Guarda la 1ª Tarjeta Llave Biológica!', icon: '🗝️', ambientFeature: 'trench' },
      { id: 'w4-r4-east', col: 4, row: -4, q: 4, r: -4, ring: 4, type: 'key_shrine', name: 'Laboratorio de Vacunas Alpha', description: '¡Guarda la 2ª Llave Biológica!', icon: '🗝️', ambientFeature: 'trench' },
      { id: 'w4-r4-west', col: -4, row: 4, q: -4, r: 4, ring: 4, type: 'key_shrine', name: 'Caja Fuerte de Bioseguridad', description: '¡Guarda la 3ª Llave Biológica!', icon: '🗝️', ambientFeature: 'trench' },

      // Ring 3 Outer
      { id: 'w4-r3-01', col: 0, row: -3, q: 0, r: -3, ring: 3, type: 'path', name: 'Callejón Abandonado Norte', description: 'Asfalto agrietado con vehículos volcados.', ambientFeature: 'trench' },
      { id: 'w4-r3-02', col: 1, row: -3, q: 1, r: -3, ring: 3, type: 'treasure', name: 'Mochila de Paramédico', description: '120 Oro y Poción del Oráculo.', rewardGold: 120, rewardConsumable: 'oracle_potion', icon: '📦' },
      { id: 'w4-r3-03', col: 2, row: -3, q: 2, r: -3, ring: 3, type: 'blocking', name: 'Charco de Ácido Corrosivo', description: 'Sustancia viscosa verde que disuelve todo.', blockingReason: 'Sopa química altamente tóxica.', icon: '☣️', ambientFeature: 'water' },
      { id: 'w4-r3-04', col: 3, row: -3, q: 3, r: -3, ring: 3, type: 'path', name: 'Avenida Cuarentena', description: 'Carretera delimitada con cinta de peligro.', ambientFeature: 'trench' },
      { id: 'w4-r3-05', col: 3, row: -2, q: 3, r: -2, ring: 3, type: 'battle_no_reward', name: 'Nido de Rastreadores', description: 'Escaramuza rápida contra infectados ágiles.', icon: '⚔️', ambientFeature: 'crater' },
      { id: 'w4-r3-06', col: 3, row: -1, q: 3, r: -1, ring: 3, type: 'treasure', name: 'Alijo del Soldado Caído', description: '130 Monedas de Oro y Reloj Temporal.', rewardGold: 130, rewardConsumable: 'time_warp', icon: '📦' },
      { id: 'w4-r3-07', col: 3, row: 0, q: 3, r: 0, ring: 3, type: 'key_shrine', name: 'Cripta Subterránea del Arzobispo', description: '¡Guarda la 4ª Llave Biológica!', icon: '🗝️' },
      { id: 'w4-r3-08', col: 2, row: 1, q: 2, r: 1, ring: 3, type: 'path', name: 'Sendero de las Lápidas', description: 'Paso de piedra entre mausoleos antiguos.', ambientFeature: 'rocks' },
      { id: 'w4-r3-09', col: 1, row: 2, q: 1, r: 2, ring: 3, type: 'rest_camp', name: 'Campamento de Sobrevivientes', description: 'Fuego de campamento y café caliente.', icon: '🔥', ambientFeature: 'trench' },
      { id: 'w4-r3-10', col: 0, row: 3, q: 0, r: 3, ring: 3, type: 'path', name: 'Carretera de Evacuación Sur', description: 'Paso directo hacia el laboratorio maestro.', ambientFeature: 'trench' },
      { id: 'w4-r3-11', col: -1, row: 3, q: -1, r: 3, ring: 3, type: 'battle_reward', name: 'Avenida de los Infectados', description: 'Duelo de supervivencia contra el Errante Voraz.', stageId: 'w4-s1', ambientFeature: 'crater' },
      { id: 'w4-r3-12', col: -2, row: 3, q: -2, r: 3, ring: 3, type: 'path', name: 'Paso Bajo Nivel Inundado', description: 'Charcos oscuros con paso accesible.', ambientFeature: 'water' },
      { id: 'w4-r3-13', col: -3, row: 3, q: -3, r: 3, ring: 3, type: 'path', name: 'Plaza de las Sombras', description: 'Espacio abierto con niebla espesa.', ambientFeature: 'trench' },
      { id: 'w4-r3-14', col: -3, row: 2, q: -3, r: 2, ring: 3, type: 'blocking', name: 'Barricada de Autobuses en Llamas', description: 'Hierro retorcido y fuego.', blockingReason: 'Fuego activo y barrera de metal.', icon: '🔥', ambientFeature: 'crater' },
      { id: 'w4-r3-15', col: -3, row: 1, q: -3, r: 1, ring: 3, type: 'treasure', name: 'Botiquín Militar Secreto', description: '140 Monedas de Oro.', rewardGold: 140, icon: '📦' },
      { id: 'w4-r3-16', col: -3, row: 0, q: -3, r: 0, ring: 3, type: 'battle_no_reward', name: 'Emboscada de Acechadores', description: 'Combate rápido de reflejos.', icon: '⚔️', ambientFeature: 'crater' },
      { id: 'w4-r3-17', col: -2, row: -1, q: -2, r: -1, ring: 3, type: 'blocking', name: 'Fosa Común Radiactiva', description: 'Gases neurotóxicos letales.', blockingReason: 'Gas letal altamente concentrado.', icon: '☠️', ambientFeature: 'crater' },
      { id: 'w4-r3-18', col: -1, row: -2, q: -1, r: -2, ring: 3, type: 'path', name: 'Galería Comercial Saqueada', description: 'Pasillo de tiendas desiertas.', ambientFeature: 'trench' },

      // Ring 2 Mid
      { id: 'w4-r2-01', col: 0, row: -2, q: 0, r: -2, ring: 2, type: 'battle_reward', name: 'Hospital de Cuarentena', description: 'Prueba Táctica contra la Enfermera Toxina.', stageId: 'w4-s2', ambientFeature: 'trench' },
      { id: 'w4-r2-02', col: 1, row: -2, q: 1, r: -2, ring: 2, type: 'path', name: 'Puente Colapsado Parcial', description: 'Viga de acero transitable a pie.', ambientFeature: 'rocks' },
      { id: 'w4-r2-03', col: 2, row: -2, q: 2, r: -2, ring: 2, type: 'treasure', name: 'Caja Fuerte de la Morgue', description: '150 Monedas de Oro.', rewardGold: 150, icon: '📦' },
      { id: 'w4-r2-04', col: 2, row: -1, q: 2, r: -1, ring: 2, type: 'blocking', name: 'Abismo de Basura Infectada', description: 'Fisura de 30 metros.', blockingReason: 'Grieta profunda intransitable.', icon: '🕳️', ambientFeature: 'crater' },
      { id: 'w4-r2-05', col: 2, row: 0, q: 2, r: 0, ring: 2, type: 'path', name: 'Patio de los Lamentos', description: 'Explanada adoquinada con niebla.', ambientFeature: 'trench' },
      { id: 'w4-r2-06', col: 1, row: 1, q: 1, r: 1, ring: 2, type: 'battle_reward', name: 'Cementerio de las Sombras', description: 'Combate táctico contra el Monstruo de la Cripta.', stageId: 'w4-s3', ambientFeature: 'crater' },
      { id: 'w4-r2-07', col: 0, row: 2, q: 0, r: 2, ring: 2, type: 'path', name: 'Puerta Blindada de Descontaminación', description: 'Esclusa de aire presurizado.', ambientFeature: 'trench' },
      { id: 'w4-r2-08', col: -1, row: 2, q: -1, r: 2, ring: 2, type: 'rest_camp', name: 'Búnker de Radiofrecuencia', description: 'Transmisiones con aperturas ganadoras.', icon: '📻', ambientFeature: 'trench' },
      { id: 'w4-r2-09', col: -2, row: 2, q: -2, r: 2, ring: 2, type: 'blocking', name: 'Muro con Alambre Navaja y Minas', description: 'Fortificación perimetral inexpugnable.', blockingReason: 'Defensas letales automatizadas.', icon: '🚧', ambientFeature: 'trench' },
      { id: 'w4-r2-10', col: -2, row: 1, q: -2, r: 1, ring: 2, type: 'path', name: 'Rampa de Ambulancias', description: 'Camino despejado hacia el laboratorio.', ambientFeature: 'trench' },
      { id: 'w4-r2-11', col: -2, row: 0, q: -2, r: 0, ring: 2, type: 'battle_reward', name: 'Laboratorio de Mutágenos', description: 'Prueba Táctica contra la Doctora Plaga.', stageId: 'w4-s4', ambientFeature: 'crater' },
      { id: 'w4-r2-12', col: -1, row: -1, q: -1, r: -1, ring: 2, type: 'path', name: 'Pasarela de Bioseguridad Nivel 5', description: 'Corredor estéril hacia la torre.', ambientFeature: 'trench' },

      // Ring 1 Inner
      { id: 'w4-r1-north', col: 0, row: -1, q: 0, r: -1, ring: 1, type: 'path', name: 'Acceso a la Morgue Central', description: 'Puertas de acero reforzado.', ambientFeature: 'trench' },
      { id: 'w4-r1-northeast', col: 1, row: -1, q: 1, r: -1, ring: 1, type: 'rest_camp', name: 'Capilla de los Caídos', description: 'Encuentra paz interior y enfoque mental absoluto.', icon: '🕯️', ambientFeature: 'rocks' },
      { id: 'w4-r1-southeast', col: 1, row: 0, q: 1, r: 0, ring: 1, type: 'path', name: 'Esclusa de Contención Este', description: 'Paredes de cristal blindado.', ambientFeature: 'trench' },
      { id: 'w4-r1-south', col: 0, row: 1, q: 0, r: 1, ring: 1, type: 'path', name: 'Gran Escalera de la Torre', description: 'Acceso central a la sala del nigromante.', ambientFeature: 'trench' },
      { id: 'w4-r1-southwest', col: -1, row: 1, q: -1, r: 1, ring: 1, type: 'treasure', name: 'Cámara Acorazada del Gobierno', description: '200 Monedas de Oro y Runa Sagrada.', rewardGold: 200, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w4-r1-northwest', col: -1, row: 0, q: -1, r: 0, ring: 1, type: 'path', name: 'Esclusa de Contención Oeste', description: 'Paso estéril de desinfección.', ambientFeature: 'trench' },

      // Ring 0 Boss
      { id: 'w4-boss', col: 0, row: 0, q: 0, r: 0, ring: 0, type: 'boss_gate', name: 'Torre de Cuarentena del Nigromante Putrefacto', description: '¡El Enfrentamiento Final! Requiere 4 Llaves Biológicas para disipar la niebla venenosa.', stageId: 'w4-s5', icon: '👑', ambientFeature: 'crater' }
    ];

    const tiles: HexTileData[] = rawTiles.map((t) => ({
      ...t,
      stage: t.stageId ? stages.find((s) => s.id === t.stageId) : undefined
    }));

    return {
      worldId: 'world-4',
      worldNumber: 4,
      worldName: 'Apocalipsis Zombi & Ciudad Devastada',
      themeStyle: 'zombie',
      cols: 9,
      rows: 9,
      requiredKeysForBoss: 4,
      startHexId: 'w4-r4-south',
      bossHexId: 'w4-boss',
      tiles
    };
  })(),

  // ==========================================
  // MUNDO 5: METRÓPOLIS CYBERPUNK (41 Hexágonos Neón, 5 Llaves requeridas)
  // ==========================================
  'world-5': (() => {
    const stages = getWorldStages('world-5');

    const rawTiles: Omit<HexTileData, 'stage'>[] = [
      // Ring 4 Satellites
      { id: 'w5-r4-south', col: 0, row: 4, q: 0, r: 4, ring: 4, type: 'start', name: 'Terminal Jack-In (Spawn)', description: 'Conexión inicial al ciberespacio.', icon: '🚩', ambientFeature: 'neon' },
      { id: 'w5-r4-north', col: 0, row: -4, q: 0, r: -4, ring: 4, type: 'key_shrine', name: 'Nodo de Cifrado Alpha', description: '¡Guarda la 1ª Llave Holográfica!', icon: '🗝️', ambientFeature: 'neon' },
      { id: 'w5-r4-east', col: 4, row: -4, q: 4, r: -4, ring: 4, type: 'key_shrine', name: 'Nodo de Cifrado Beta', description: '¡Guarda la 2ª Llave Holográfica!', icon: '🗝️', ambientFeature: 'neon' },
      { id: 'w5-r4-west', col: -4, row: 4, q: -4, r: 4, ring: 4, type: 'key_shrine', name: 'Nodo de Cifrado Gamma', description: '¡Guarda la 3ª Llave Holográfica!', icon: '🗝️', ambientFeature: 'neon' },

      // Ring 3 Outer
      { id: 'w5-r3-01', col: 0, row: -3, q: 0, r: -3, ring: 3, type: 'path', name: 'Autopista de Fibra Óptica Norte', description: 'Canal de transmisión de alta velocidad.', ambientFeature: 'neon' },
      { id: 'w5-r3-02', col: 1, row: -3, q: 1, r: -3, ring: 3, type: 'treasure', name: 'Billetera Cripto Secreta', description: '150 Monedas de Oro digitales.', rewardGold: 150, icon: '📦' },
      { id: 'w5-r3-03', col: 2, row: -3, q: 2, r: -3, ring: 3, type: 'blocking', name: 'Firewall de Alta Densidad', description: 'Muro criptográfico de 4096 bits.', blockingReason: 'Muro de código impenetrable.', icon: '🔥', ambientFeature: 'neon' },
      { id: 'w5-r3-04', col: 3, row: -3, q: 3, r: -3, ring: 3, type: 'key_shrine', name: 'Nodo de Cifrado Delta', description: '¡Guarda la 4ª Llave Holográfica!', icon: '🗝️' },
      { id: 'w5-r3-05', col: 3, row: -2, q: 3, r: -2, ring: 3, type: 'battle_no_reward', name: 'Centinela de Seguridad Bot', description: 'Duelo rápido contra un bot de patrulla.', icon: '⚔️', ambientFeature: 'neon' },
      { id: 'w5-r3-06', col: 3, row: -1, q: 3, r: -1, ring: 3, type: 'treasure', name: 'Chip de Memoria Élite', description: '160 Oro y Poción del Oráculo.', rewardGold: 160, rewardConsumable: 'oracle_potion', icon: '📦' },
      { id: 'w5-r3-07', col: 3, row: 0, q: 3, r: 0, ring: 3, type: 'key_shrine', name: 'Nodo de Cifrado Epsilon', description: '¡Guarda la 5ª Llave Holográfica!', icon: '🗝️' },
      { id: 'w5-r3-08', col: 2, row: 1, q: 2, r: 1, ring: 3, type: 'path', name: 'Pista de Levitación Magnética', description: 'Vía elevada de trenes bala.', ambientFeature: 'neon' },
      { id: 'w5-r3-09', col: 1, row: 2, q: 1, r: 2, ring: 3, type: 'rest_camp', name: 'Café Netrunner de Descanso', description: 'Toma un café sintético y analiza variantes.', icon: '☕', ambientFeature: 'neon' },
      { id: 'w5-r3-10', col: 0, row: 3, q: 0, r: 3, ring: 3, type: 'path', name: 'Avenida del Dragón Neón', description: 'Camino con hologramas asiáticos.', ambientFeature: 'neon' },
      { id: 'w5-r3-11', col: -1, row: 3, q: -1, r: 3, ring: 3, type: 'battle_reward', name: 'Distrito de Neón Bajo', description: 'Duelo callejero contra el Cyber-Hacker Null.', stageId: 'w5-s1', ambientFeature: 'neon' },
      { id: 'w5-r3-12', col: -2, row: 3, q: -2, r: 3, ring: 3, type: 'path', name: 'Bulevar de Realidad Aumentada', description: 'Paseo con hologramas flotantes.', ambientFeature: 'neon' },
      { id: 'w5-r3-13', col: -3, row: 3, q: -3, r: 3, ring: 3, type: 'path', name: 'Pasadizo de Circuitos Impresos', description: 'Ruta iluminada por trazas de silicio.', ambientFeature: 'neon' },
      { id: 'w5-r3-14', col: -3, row: 2, q: -3, r: 2, ring: 3, type: 'blocking', name: 'Glitch de la Realidad Virtual', description: 'Vacío de memoria corrupto.', blockingReason: 'Falla en la matriz que desintegra datos.', icon: '👾', ambientFeature: 'neon' },
      { id: 'w5-r3-15', col: -3, row: 1, q: -3, r: 1, ring: 3, type: 'treasure', name: 'Almacén de Chips Cuánticos', description: '170 Monedas de Oro.', rewardGold: 170, icon: '📦' },
      { id: 'w5-r3-16', col: -3, row: 0, q: -3, r: 0, ring: 3, type: 'battle_no_reward', name: 'Duelo en el Callejón Virtual', description: 'Desafío rápido de táctica sin recompensa.', icon: '⚔️', ambientFeature: 'neon' },
      { id: 'w5-r3-17', col: -2, row: -1, q: -2, r: -1, ring: 3, type: 'blocking', name: 'Río de Silicio Líquido Hirviente', description: 'Canal de refrigerante tóxico.', blockingReason: 'Refrigerante hirviente a 250°C.', icon: '🌊', ambientFeature: 'neon' },
      { id: 'w5-r3-18', col: -1, row: -2, q: -1, r: -2, ring: 3, type: 'path', name: 'Paso del Mercado Negro', description: 'Callejón con puestos de implantes.', ambientFeature: 'neon' },

      // Ring 2 Mid
      { id: 'w5-r2-01', col: 0, row: -2, q: 0, r: -2, ring: 2, type: 'battle_reward', name: 'Rascacielos Corporativo Neon', description: 'Prueba Táctica contra la Directora Vex.', stageId: 'w5-s2', ambientFeature: 'neon' },
      { id: 'w5-r2-02', col: 1, row: -2, q: 1, r: -2, ring: 2, type: 'path', name: 'Túnel de Enrutamiento Subterráneo', description: 'Canal de cables de datos pesados.', ambientFeature: 'neon' },
      { id: 'w5-r2-03', col: 2, row: -2, q: 2, r: -2, ring: 2, type: 'treasure', name: 'Caja Fuerte de la Megacorp', description: '180 Monedas de Oro.', rewardGold: 180, icon: '📦' },
      { id: 'w5-r2-04', col: 2, row: -1, q: 2, r: -1, ring: 2, type: 'blocking', name: 'Campo de Minas Láser', description: 'Red de rayos infrarrojos explosivos.', blockingReason: 'Malla de sensores letales interconectados.', icon: '⚡', ambientFeature: 'neon' },
      { id: 'w5-r2-05', col: 2, row: 0, q: 2, r: 0, ring: 2, type: 'path', name: 'Puente Aéreo de Neón Rosa', description: 'Conexión entre rascacielos.', ambientFeature: 'neon' },
      { id: 'w5-r2-06', col: 1, row: 1, q: 1, r: 1, ring: 2, type: 'battle_reward', name: 'Fábrica de Drogas Sintéticas', description: 'Combate táctico contra el Cyborg Cronos.', stageId: 'w5-s3', ambientFeature: 'neon' },
      { id: 'w5-r2-07', col: 0, row: 2, q: 0, r: 2, ring: 2, type: 'path', name: 'Plaza del Servidor Raíz', description: 'Gran explanada bajo la torre central.', ambientFeature: 'neon' },
      { id: 'w5-r2-08', col: -1, row: 2, q: -1, r: 2, ring: 2, type: 'rest_camp', name: 'Refugio de Netrunners Rebeldes', description: 'Sincroniza tus algoritmos de variantes.', icon: '💻', ambientFeature: 'neon' },
      { id: 'w5-r2-09', col: -2, row: 2, q: -2, r: 2, ring: 2, type: 'blocking', name: 'Subestación Eléctrica Colapsada', description: 'Arcos eléctricos de 50.000 voltios.', blockingReason: 'Descargas eléctricas continuas.', icon: '⚡', ambientFeature: 'neon' },
      { id: 'w5-r2-10', col: -2, row: 1, q: -2, r: 1, ring: 2, type: 'path', name: 'Plataforma de Drones Asesinos', description: 'Pista con reflectores láser.', ambientFeature: 'neon' },
      { id: 'w5-r2-11', col: -2, row: 0, q: -2, r: 0, ring: 2, type: 'battle_reward', name: 'Laboratorio de Neuro-Implantes', description: 'Prueba Táctica contra la Dra. Turing.', stageId: 'w5-s4', ambientFeature: 'neon' },
      { id: 'w5-r2-12', col: -1, row: -1, q: -1, r: -1, ring: 2, type: 'path', name: 'Compuerta Cuántica de Alta Seguridad', description: 'Pasaje directo al procesador central.', ambientFeature: 'neon' },

      // Ring 1 Inner
      { id: 'w5-r1-north', col: 0, row: -1, q: 0, r: -1, ring: 1, type: 'path', name: 'Corredor de Servidores Primarios', description: 'Hileras infinitas de luces parpadeantes.', ambientFeature: 'neon' },
      { id: 'w5-r1-northeast', col: 1, row: -1, q: 1, r: -1, ring: 1, type: 'rest_camp', name: 'Terminal de Sincronización Cuántica', description: 'Máxima claridad mental antes del duelo.', icon: '🔮', ambientFeature: 'neon' },
      { id: 'w5-r1-southeast', col: 1, row: 0, q: 1, r: 0, ring: 1, type: 'path', name: 'Acceso a la Gran Red Neuronal', description: 'Pasadizo de fibra luminiscente.', ambientFeature: 'neon' },
      { id: 'w5-r1-south', col: 0, row: 1, q: 0, r: 1, ring: 1, type: 'path', name: 'Esclusa Central del Mainframe', description: 'Puertas holográficas blindadas.', ambientFeature: 'neon' },
      { id: 'w5-r1-southwest', col: -1, row: 1, q: -1, r: 1, ring: 1, type: 'treasure', name: 'Banco Central Criptográfico', description: '220 Monedas de Oro y Runa de Defensa.', rewardGold: 220, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w5-r1-northwest', col: -1, row: 0, q: -1, r: 0, ring: 1, type: 'path', name: 'Paso del Algoritmo Maestro', description: 'Túnel de datos purificados.', ambientFeature: 'neon' },

      // Ring 0 Boss
      { id: 'w5-boss', col: 0, row: 0, q: 0, r: 0, ring: 0, type: 'boss_gate', name: 'Servidor Central de la IA Nexus-9', description: '¡La Batalla Cibernética Definitiva! Requiere las 5 Llaves Holográficas para hackear el núcleo.', stageId: 'w5-s5', icon: '👑', ambientFeature: 'neon' }
    ];

    const tiles: HexTileData[] = rawTiles.map((t) => ({
      ...t,
      stage: t.stageId ? stages.find((s) => s.id === t.stageId) : undefined
    }));

    return {
      worldId: 'world-5',
      worldNumber: 5,
      worldName: 'Metrópolis Cyberpunk & Ciberespacio',
      themeStyle: 'cyberpunk',
      cols: 9,
      rows: 9,
      requiredKeysForBoss: 5,
      startHexId: 'w5-r4-south',
      bossHexId: 'w5-boss',
      tiles
    };
  })(),

  // ==========================================
  // MUNDO 6: SANTUARIO ANIMAL (41 Hexágonos Druídicos, 5 Llaves requeridas)
  // ==========================================
  'world-6': (() => {
    const stages = getWorldStages('world-6');

    const rawTiles: Omit<HexTileData, 'stage'>[] = [
      // Ring 4 Satellites
      { id: 'w6-r4-south', col: 0, row: 4, q: 0, r: 4, ring: 4, type: 'start', name: 'Entrada al Bosque Salvaje (Spawn)', description: 'Sendero de tierra donde comienza tu travesía.', icon: '🚩', ambientFeature: 'trees' },
      { id: 'w6-r4-north', col: 0, row: -4, q: 0, r: -4, ring: 4, type: 'key_shrine', name: 'Tótem del Halcón Dorado', description: '¡Guarda la 1ª Llave Tribal de la Selva!', icon: '🗝️', ambientFeature: 'trees' },
      { id: 'w6-r4-east', col: 4, row: -4, q: 4, r: -4, ring: 4, type: 'key_shrine', name: 'Cueva Sagrada del Jaguar', description: '¡Guarda la 2ª Llave Tribal!', icon: '🗝️', ambientFeature: 'rocks' },
      { id: 'w6-r4-west', col: -4, row: 4, q: -4, r: 4, ring: 4, type: 'key_shrine', name: 'Altar del Colmillo Ancestral', description: '¡Guarda la 3ª Llave Tribal!', icon: '🗝️', ambientFeature: 'trees' },

      // Ring 3 Outer
      { id: 'w6-r3-01', col: 0, row: -3, q: 0, r: -3, ring: 3, type: 'path', name: 'Senda de las Huellas Ancestrales', description: 'Camino de tierra rodeado de helechos.', ambientFeature: 'trees' },
      { id: 'w6-r3-02', col: 1, row: -3, q: 1, r: -3, ring: 3, type: 'treasure', name: 'Colmena de Miel Sagrada', description: '150 Monedas de Oro y Fruto Vigorizante.', rewardGold: 150, icon: '📦' },
      { id: 'w6-r3-03', col: 2, row: -3, q: 2, r: -3, ring: 3, type: 'blocking', name: 'Cascada Abrupta y Rápidos', description: 'Catarata rugiente de 50 metros.', blockingReason: 'Corriente impetuosa imposible de cruzar.', icon: '🌊', ambientFeature: 'water' },
      { id: 'w6-r3-04', col: 3, row: -3, q: 3, r: -3, ring: 3, type: 'key_shrine', name: 'Santuario del Elefante Blanco', description: '¡Guarda la 4ª Llave Tribal!', icon: '🗝️' },
      { id: 'w6-r3-05', col: 3, row: -2, q: 3, r: -2, ring: 3, type: 'battle_no_reward', name: 'Duelo en la Rama del Roble', description: 'Escaramuza acrobática con ardillas maestras.', icon: '⚔️', ambientFeature: 'trees' },
      { id: 'w6-r3-06', col: 3, row: -1, q: 3, r: -1, ring: 3, type: 'treasure', name: 'Alijo del Tejón Explorador', description: '160 Oro y Poción del Oráculo.', rewardGold: 160, rewardConsumable: 'oracle_potion', icon: '📦' },
      { id: 'w6-r3-07', col: 3, row: 0, q: 3, r: 0, ring: 3, type: 'key_shrine', name: 'Templo del Dragón de Bambú', description: '¡Guarda la 5ª Llave Tribal!', icon: '🗝️' },
      { id: 'w6-r3-08', col: 2, row: 1, q: 2, r: 1, ring: 3, type: 'path', name: 'Sendero de las Huellas de Oso', description: 'Camino ancho en el corazón de la floresta.', ambientFeature: 'trees' },
      { id: 'w6-r3-09', col: 1, row: 2, q: 1, r: 2, ring: 3, type: 'rest_camp', name: 'Manantial de los Ciervos Sagrados', description: 'Bebe agua pura y medita en jugadas armónicas.', icon: '🦌', ambientFeature: 'water' },
      { id: 'w6-r3-10', col: 0, row: 3, q: 0, r: 3, ring: 3, type: 'path', name: 'Avenida de los Árboles Milenarios', description: 'Troncos gigantescos que forman un arco.', ambientFeature: 'trees' },
      { id: 'w6-r3-11', col: -1, row: 3, q: -1, r: 3, ring: 3, type: 'battle_reward', name: 'Madriguera de los Zorros Astutos', description: 'Duelo táctico contra el Zorro Astuto Vulpix.', stageId: 'w6-s1', ambientFeature: 'trees' },
      { id: 'w6-r3-12', col: -2, row: 3, q: -2, r: 3, ring: 3, type: 'path', name: 'Pradera de Bambú', description: 'Bosque sereno con tallos de bambú.', ambientFeature: 'trees' },
      { id: 'w6-r3-13', col: -3, row: 3, q: -3, r: 3, ring: 3, type: 'path', name: 'Claro de los Lirios Gigantes', description: 'Pradera aromática con flores silvestres.', ambientFeature: 'trees' },
      { id: 'w6-r3-14', col: -3, row: 2, q: -3, r: 2, ring: 3, type: 'blocking', name: 'Espinar de Enredaderas Gigantes', description: 'Zarzales con espinas venenosas.', blockingReason: 'Vegetación impenetrable y peligrosa.', icon: '🌿', ambientFeature: 'trees' },
      { id: 'w6-r3-15', col: -3, row: 1, q: -3, r: 1, ring: 3, type: 'treasure', name: 'Cesta de Frutos Sagrados', description: '170 Monedas de Oro.', rewardGold: 170, icon: '📦' },
      { id: 'w6-r3-16', col: -3, row: 0, q: -3, r: 0, ring: 3, type: 'battle_no_reward', name: 'Desafío del Mono Ágil', description: 'Entrenamiento rápido de piezas menores.', icon: '⚔️', ambientFeature: 'trees' },
      { id: 'w6-r3-17', col: -2, row: -1, q: -2, r: -1, ring: 3, type: 'blocking', name: 'Ciénaga Movediza Profunda', description: 'Arena movediza de profundidad mortal.', blockingReason: 'Ciénaga que succiona todo.', icon: '🌊', ambientFeature: 'water' },
      { id: 'w6-r3-18', col: -1, row: -2, q: -1, r: -2, ring: 3, type: 'path', name: 'Paso de Piedras sobre el Arroyo', description: 'Ruta segura sobre rocas redondas.', ambientFeature: 'water' },

      // Ring 2 Mid
      { id: 'w6-r2-01', col: 0, row: -2, q: 0, r: -2, ring: 2, type: 'battle_reward', name: 'Pantano de la Serpiente Mamba', description: 'Prueba Táctica contra la Serpiente Venenosa.', stageId: 'w6-s2', ambientFeature: 'water' },
      { id: 'w6-r2-02', col: 1, row: -2, q: 1, r: -2, ring: 2, type: 'path', name: 'Paso de los Monos Sabios', description: 'Camino rocoso con esculturas milenarias.', ambientFeature: 'rocks' },
      { id: 'w6-r2-03', col: 2, row: -2, q: 2, r: -2, ring: 2, type: 'treasure', name: 'Alijo del Águila Real', description: '180 Monedas de Oro.', rewardGold: 180, icon: '📦' },
      { id: 'w6-r2-04', col: 2, row: -1, q: 2, r: -1, ring: 2, type: 'blocking', name: 'Muralla de Rocas Volcánicas', description: 'Formación de basalto macizo.', blockingReason: 'Rocas de basalto impenetrables.', icon: '🌋', ambientFeature: 'rocks' },
      { id: 'w6-r2-05', col: 2, row: 0, q: 2, r: 0, ring: 2, type: 'path', name: 'Ascenso al Monte Fiera', description: 'Senda empinada hacia la cumbre.', ambientFeature: 'rocks' },
      { id: 'w6-r2-06', col: 1, row: 1, q: 1, r: 1, ring: 2, type: 'battle_reward', name: 'Cueva del Oso Pardo Gigante', description: 'Combate táctico contra el Oso Ursus.', stageId: 'w6-s3', ambientFeature: 'rocks' },
      { id: 'w6-r2-07', col: 0, row: 2, q: 0, r: 2, ring: 2, type: 'path', name: 'Puente de Lianas Tejidas', description: 'Paso colgante sobre el desfiladero.', ambientFeature: 'trees' },
      { id: 'w6-r2-08', col: -1, row: 2, q: -1, r: 2, ring: 2, type: 'rest_camp', name: 'Nido del Gran Búho Sabio', description: 'Consejos de visión profunda en el tablero.', icon: '🦉', ambientFeature: 'trees' },
      { id: 'w6-r2-09', col: -2, row: 2, q: -2, r: 2, ring: 2, type: 'blocking', name: 'Abismo del Cañón Verde', description: 'Barranco insondable de 100 metros.', blockingReason: 'Caída libre hacia aguas profundas.', icon: '🕳️', ambientFeature: 'rocks' },
      { id: 'w6-r2-10', col: -2, row: 1, q: -2, r: 1, ring: 2, type: 'path', name: 'Ruta de las Flores Silvestres', description: 'Sendero aromático y tranquilo.', ambientFeature: 'trees' },
      { id: 'w6-r2-11', col: -2, row: 0, q: -2, r: 0, ring: 2, type: 'battle_reward', name: 'Cumbre de los Lobos Alfa', description: 'Prueba Táctica contra el Lobo Alfa Fenrir.', stageId: 'w6-s4', ambientFeature: 'rocks' },
      { id: 'w6-r2-12', col: -1, row: -1, q: -1, r: -1, ring: 2, type: 'path', name: 'Arco de Piedra Druídico', description: 'Pórtico ancestral de acceso al santuario interior.', ambientFeature: 'trees' },

      // Ring 1 Inner
      { id: 'w6-r1-north', col: 0, row: -1, q: 0, r: -1, ring: 1, type: 'path', name: 'Escalones del Gran Roble Sagrado', description: 'Peldaños de raíces milenarias.', ambientFeature: 'trees' },
      { id: 'w6-r1-northeast', col: 1, row: -1, q: 1, r: -1, ring: 1, type: 'rest_camp', name: 'Templo de los Espíritus del Bosque', description: 'Sintonía total con la naturaleza y calma absoluta.', icon: '✨', ambientFeature: 'trees' },
      { id: 'w6-r1-southeast', col: 1, row: 0, q: 1, r: 0, ring: 1, type: 'path', name: 'Galería de los Colmillos', description: 'Pasadizo bordeado de monolitos con garras.', ambientFeature: 'rocks' },
      { id: 'w6-r1-south', col: 0, row: 1, q: 0, r: 1, ring: 1, type: 'path', name: 'Calzada del Trono de la Selva', description: 'Camino directo a la guarida del Rey.', ambientFeature: 'trees' },
      { id: 'w6-r1-southwest', col: -1, row: 1, q: -1, r: 1, ring: 1, type: 'treasure', name: 'Tesoro del Santuario Ancestral', description: '250 Monedas de Oro y Runa de Defensa.', rewardGold: 250, rewardConsumable: 'shield_rune', icon: '📦' },
      { id: 'w6-r1-northwest', col: -1, row: 0, q: -1, r: 0, ring: 1, type: 'path', name: 'Portal de las Lianas Sagradas', description: 'Arco vegetal que susurra sabiduría.', ambientFeature: 'trees' },

      // Ring 0 Boss
      { id: 'w6-boss', col: 0, row: 0, q: 0, r: 0, ring: 0, type: 'boss_gate', name: 'Trono Salvaje del Rey León Simba-Rex', description: '¡La Batalla Definitiva del Santuario! Requiere las 5 Llaves Tribales para abrir la puerta de la Roca del Rey.', stageId: 'w6-s5', icon: '👑', ambientFeature: 'trees' }
    ];

    const tiles: HexTileData[] = rawTiles.map((t) => ({
      ...t,
      stage: t.stageId ? stages.find((s) => s.id === t.stageId) : undefined
    }));

    return {
      worldId: 'world-6',
      worldNumber: 6,
      worldName: 'Santuario Animal & Selva Primordial',
      themeStyle: 'animals',
      cols: 9,
      rows: 9,
      requiredKeysForBoss: 5,
      startHexId: 'w6-r4-south',
      bossHexId: 'w6-boss',
      tiles
    };
  })()
};

// Mini Puzzles for quick skirmish
export const QUICK_SKIRMISH_PUZZLES = [
  {
    id: 'skirmish-1',
    title: 'Clavada en e4',
    fen: 'r1bqk2r/pppp1ppp/2n5/4p3/1b2n3/2NP1N2/PPP1BPPP/R1BQK2R w KQkq - 0 6',
    solutionSan: ['dxe4'],
    hint: 'Gana la pieza clavada.'
  },
  {
    id: 'skirmish-2',
    title: 'Ataque Doble de Caballo',
    fen: 'r1b1kb1r/pppp1ppp/8/4q3/4N3/8/PPP2PPP/R1BQKB1R w KQkq - 0 7',
    solutionSan: ['Qe2'],
    hint: 'Aprovecha la clavada del caballo en la columna e.'
  }
];
