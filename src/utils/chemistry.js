// Sistema de química y posiciones

const POS_ALIAS = {
  'LD': 'LAD',
  'LI': 'LAI',
  'ED': 'EXD',
  'EI': 'EXI',
  'DC': 'DEL'
};

function normalizarPos(p) {
  const t = p.trim().toUpperCase();
  return POS_ALIAS[t] || t;
}

export const POSICIONES = {
  POR: { nombre: 'Portero', x: 0.08, y: 0.5 },
  LAD: { nombre: 'Lateral Der.', x: 0.25, y: 0.2 },
  DFC: { nombre: 'Def. Central', x: 0.25, y: 0.5 },
  LAI: { nombre: 'Lateral Izq.', x: 0.25, y: 0.8 },
  MCD: { nombre: 'Med. Def.', x: 0.45, y: 0.5 },
  MC: { nombre: 'Mediocampista', x: 0.45, y: 0.35 },
  EXD: { nombre: 'Extremo Der.', x: 0.62, y: 0.15 },
  EXI: { nombre: 'Extremo Izq.', x: 0.62, y: 0.85 },
  MCO: { nombre: 'Med. Creativo', x: 0.62, y: 0.5 },
  DEL: { nombre: 'Delantero', x: 0.80, y: 0.5 },
};

// Compatibilidad de posición: cuánto penaliza jugar fuera de posición
// 0 = perfecta, negativo = penalización en media
const COMPATIBILIDAD = {
  POR:  { POR: 0 },
  LAD:  { LAD: 0, DFC: -5, MC: -8, LAI: -10 },
  DFC:  { DFC: 0, LAD: -5, LAI: -5, MCD: -8, MC: -10 },
  LAI:  { LAI: 0, DFC: -5, MC: -8, LAD: -10 },
  MCD:  { MCD: 0, MC: -3, DFC: -8, MCO: -10, LAD: -12, LAI: -12 },
  MC:   { MC: 0, MCD: -3, MCO: -5, EXD: -8, EXI: -8, DEL: -12, LAD: -12, LAI: -12 },
  EXD:  { EXD: 0, EXI: -5, MC: -8, MCO: -5, DEL: -10, LAD: -12 },
  EXI:  { EXI: 0, EXD: -5, MC: -8, MCO: -5, DEL: -10, LAI: -12 },
  MCO:  { MCO: 0, MC: -5, EXD: -5, EXI: -5, DEL: -8, MCD: -12 },
  DEL:  { DEL: 0, MCO: -8, EXD: -10, EXI: -10 },
};

export function calcularPenalizacion(posJugador, posFormacion) {
  if (!posJugador || !posFormacion) return -15;
  
  const posiciones = Array.isArray(posJugador)
    ? posJugador.map(normalizarPos)
    : (typeof posJugador === 'string' ? posJugador.split(/[\/,]/).map(normalizarPos) : []);

  const formPos = normalizarPos(posFormacion);

  let maxCompat = -15;
  for (const pos of posiciones) {
    const compat = COMPATIBILIDAD[pos];
    if (compat) {
      const currentCompat = compat[formPos] !== undefined ? compat[formPos] : -15;
      if (currentCompat > maxCompat) {
        maxCompat = currentCompat;
      }
    }
  }
  return maxCompat;
}

export function matchesPosicion(posJugador, posSlot) {
  if (!posJugador || !posSlot) return false;
  const posiciones = Array.isArray(posJugador)
    ? posJugador.map(normalizarPos)
    : (typeof posJugador === 'string' ? posJugador.split(/[\/,]/).map(normalizarPos) : []);
  const formPos = normalizarPos(posSlot);
  return posiciones.includes(formPos);
}

export function calcularMediaEfectiva(jugador, posFormacion) {
  const pen = calcularPenalizacion(jugador?.pos, posFormacion);
  return Math.max(60, (jugador?.mediaFinal ?? jugador?.media ?? 80) + pen);
}

export function calcularQuimicaEquipo(alineacion) {
  // alineacion: array de { jugador, posFormacion }
  if (!alineacion || alineacion.length === 0) return 0;
  const total = alineacion.reduce((acc, item) => {
    const pen = calcularPenalizacion(item.jugador?.pos, item.posFormacion);
    // Mapear penalización a química: 0 pen -> 10 química, -15 pen -> 0 química
    const quim = Math.max(0, 10 + pen * (10/15));
    return acc + quim;
  }, 0);
  return Math.round((total / alineacion.length) * 10); // 0-100
}

export function calcularMediaEquipo(alineacion) {
  if (!alineacion || alineacion.length === 0) return 0;
  const sum = alineacion.reduce((acc, item) => {
    return acc + calcularMediaEfectiva(item.jugador, item.posFormacion);
  }, 0);
  return Math.round(sum / alineacion.length);
}

// Formaciones disponibles con sus slots de posición
export const FORMACIONES = {
  '4-3-3': {
    nombre: '4-3-3',
    slots: ['POR', 'LAD', 'DFC', 'DFC', 'LAI', 'MC', 'MCD', 'MC', 'EXD', 'DEL', 'EXI'],
    posiciones: [
      { slot: 0, pos: 'POR', x: 0.08, y: 0.5 },
      { slot: 1, pos: 'LAD', x: 0.25, y: 0.2 },
      { slot: 2, pos: 'DFC', x: 0.25, y: 0.4 },
      { slot: 3, pos: 'DFC', x: 0.25, y: 0.6 },
      { slot: 4, pos: 'LAI', x: 0.25, y: 0.8 },
      { slot: 5, pos: 'MC', x: 0.45, y: 0.25 },
      { slot: 6, pos: 'MCD', x: 0.45, y: 0.5 },
      { slot: 7, pos: 'MC', x: 0.45, y: 0.75 },
      { slot: 8, pos: 'EXD', x: 0.70, y: 0.15 },
      { slot: 9, pos: 'DEL', x: 0.75, y: 0.5 },
      { slot: 10, pos: 'EXI', x: 0.70, y: 0.85 },
    ]
  },
  '4-4-2': {
    nombre: '4-4-2',
    slots: ['POR', 'LAD', 'DFC', 'DFC', 'LAI', 'EXD', 'MC', 'MC', 'EXI', 'DEL', 'DEL'],
    posiciones: [
      { slot: 0, pos: 'POR', x: 0.08, y: 0.5 },
      { slot: 1, pos: 'LAD', x: 0.25, y: 0.2 },
      { slot: 2, pos: 'DFC', x: 0.25, y: 0.4 },
      { slot: 3, pos: 'DFC', x: 0.25, y: 0.6 },
      { slot: 4, pos: 'LAI', x: 0.25, y: 0.8 },
      { slot: 5, pos: 'EXD', x: 0.50, y: 0.15 },
      { slot: 6, pos: 'MC', x: 0.50, y: 0.38 },
      { slot: 7, pos: 'MC', x: 0.50, y: 0.62 },
      { slot: 8, pos: 'EXI', x: 0.50, y: 0.85 },
      { slot: 9, pos: 'DEL', x: 0.78, y: 0.35 },
      { slot: 10, pos: 'DEL', x: 0.78, y: 0.65 },
    ]
  },
  '4-2-3-1': {
    nombre: '4-2-3-1',
    slots: ['POR', 'LAD', 'DFC', 'DFC', 'LAI', 'MCD', 'MCD', 'EXD', 'MCO', 'EXI', 'DEL'],
    posiciones: [
      { slot: 0, pos: 'POR', x: 0.08, y: 0.5 },
      { slot: 1, pos: 'LAD', x: 0.25, y: 0.2 },
      { slot: 2, pos: 'DFC', x: 0.25, y: 0.4 },
      { slot: 3, pos: 'DFC', x: 0.25, y: 0.6 },
      { slot: 4, pos: 'LAI', x: 0.25, y: 0.8 },
      { slot: 5, pos: 'MCD', x: 0.43, y: 0.38 },
      { slot: 6, pos: 'MCD', x: 0.43, y: 0.62 },
      { slot: 7, pos: 'EXD', x: 0.62, y: 0.15 },
      { slot: 8, pos: 'MCO', x: 0.65, y: 0.5 },
      { slot: 9, pos: 'EXI', x: 0.62, y: 0.85 },
      { slot: 10, pos: 'DEL', x: 0.82, y: 0.5 },
    ]
  },
  '3-5-2': {
    nombre: '3-5-2',
    slots: ['POR', 'DFC', 'DFC', 'DFC', 'LAD', 'MC', 'MCD', 'MC', 'LAI', 'DEL', 'DEL'],
    posiciones: [
      { slot: 0, pos: 'POR', x: 0.08, y: 0.5 },
      { slot: 1, pos: 'DFC', x: 0.25, y: 0.3 },
      { slot: 2, pos: 'DFC', x: 0.25, y: 0.5 },
      { slot: 3, pos: 'DFC', x: 0.25, y: 0.7 },
      { slot: 4, pos: 'LAD', x: 0.45, y: 0.15 },
      { slot: 5, pos: 'MC', x: 0.45, y: 0.35 },
      { slot: 6, pos: 'MCD', x: 0.48, y: 0.5 },
      { slot: 7, pos: 'MC', x: 0.45, y: 0.65 },
      { slot: 8, pos: 'LAI', x: 0.45, y: 0.85 },
      { slot: 9, pos: 'DEL', x: 0.78, y: 0.35 },
      { slot: 10, pos: 'DEL', x: 0.78, y: 0.65 },
    ]
  },
};

export function getColorPosicion(pos) {
  const colores = {
    POR: '#F9A825', LAD: '#1565C0', DFC: '#1565C0', LAI: '#1565C0',
    MCD: '#2E7D32', MC: '#2E7D32', EXD: '#C62828', EXI: '#C62828',
    MCO: '#6A1B9A', DEL: '#C62828',
  };
  return colores[pos] || '#555';
}
