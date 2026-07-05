// Motor de simulación de partidos — lógica matemática pura (sin canvas)
// El canvas/animación está en el componente MatchSimulator

// Simular goles basado en medias de los equipos
export function simularResultado(mediaLocal, mediaVisitante) {
  const diff = mediaLocal - mediaVisitante;
  // Factor aleatorio + diferencia de calidad
  const probGolLocal = 0.45 + diff * 0.006;
  const probGolVisit = 0.45 - diff * 0.006;

  const maxGoles = 5;
  let golesLocal = 0;
  let golesVisit = 0;

  // Simular múltiples oportunidades por partido
  const oportunidades = 18;
  for (let i = 0; i < oportunidades; i++) {
    if (Math.random() < Math.max(0.05, Math.min(0.55, probGolLocal / oportunidades * 3))) {
      golesLocal++;
    }
    if (Math.random() < Math.max(0.05, Math.min(0.55, probGolVisit / oportunidades * 3))) {
      golesVisit++;
    }
  }

  return {
    golesLocal: Math.min(golesLocal, maxGoles),
    golesVisitante: Math.min(golesVisit, maxGoles),
  };
}

// Generar eventos de partido para la animación
export function generarEventos(mediaLocal, mediaVisitante, duracionMs = 180000) {
  const eventos = [];
  const { golesLocal, golesVisitante } = simularResultado(mediaLocal, mediaVisitante);
  const totalGoles = golesLocal + golesVisitante;

  // Distribución de goles en el tiempo
  const minutosGol = [];
  for (let i = 0; i < totalGoles; i++) {
    minutosGol.push(Math.floor(Math.random() * 88) + 1);
  }
  minutosGol.sort((a, b) => a - b);

  // Asignar goles a equipos manteniendo el total
  let asignados = { local: 0, visitante: 0 };
  minutosGol.forEach((min, idx) => {
    const quedan_local = golesLocal - asignados.local;
    const quedan_visita = golesVisitante - asignados.visitante;
    const queda_total = totalGoles - idx - 1;
    let equipo;
    if (quedan_local === 0) equipo = 'visitante';
    else if (quedan_visita === 0) equipo = 'local';
    else equipo = Math.random() < quedan_local / (quedan_local + quedan_visita) ? 'local' : 'visitante';
    asignados[equipo]++;
    eventos.push({ tipo: 'gol', minuto: min, equipo, ms: (min / 90) * duracionMs });
  });

  // Añadir eventos de comentario
  const comentarios = [
    { tipo: 'pase', ms: duracionMs * 0.1 },
    { tipo: 'regate', ms: duracionMs * 0.2 },
    { tipo: 'parada', ms: duracionMs * 0.35 },
    { tipo: 'disparo', ms: duracionMs * 0.5 },
    { tipo: 'falta', ms: duracionMs * 0.65 },
    { tipo: 'corner', ms: duracionMs * 0.80 },
  ];

  return [...eventos, ...comentarios].sort((a, b) => a.ms - b.ms);
}

// Textos de comentario para el simulador
export const COMENTARIOS = {
  gol: (equipo, equipoNombre) => [
    `⚽ ¡¡¡GOOOOL DE ${equipoNombre.toUpperCase()}!!!`,
    `⚽ ¡QUÉ GOLAZO! Lo mete ${equipoNombre}`,
    `⚽ ¡INCREÍBLE GOL DEL ${equipoNombre}!`,
  ],
  pase: () => [
    '🎯 ¡Pase filtrado entre líneas!',
    '👟 Combinación de lujo en el mediocampo',
    '🔄 El balón corre veloz de lado a lado',
  ],
  regate: () => [
    '💫 ¡Caño espectacular!',
    '🌀 ¡Regate imposible!',
    '✨ ¡Se va de dos rivales con facilidad!',
  ],
  parada: () => [
    '🧤 ¡Paradón del portero!',
    '🧤 ¡El meta lo detiene todo!',
    '🧤 ¡Mano a mano y lo para!',
  ],
  disparo: () => [
    '🎯 ¡Disparo al palo!',
    '🔫 ¡Chut potente que se va fuera!',
    '⚡ ¡Tiro desde lejos!',
  ],
  falta: () => [
    '🟡 Tarjeta amarilla. El partido se calienta',
    '🦵 Falta fuerte en el centro del campo',
    '😤 Protesta de los jugadores al árbitro',
  ],
  corner: () => [
    '🏳️ Córner para intentar el gol',
    '🌀 Saque de esquina, peligro en el área',
  ],
  descanso: () => ['⏸️ ¡Pitido! Se va al descanso'],
  final: () => ['🎉 ¡Pitido final!'],
};

export function getComentarioAleatorio(tipo, equipoNombre = '') {
  const lista = COMENTARIOS[tipo]?.(tipo === 'gol' ? 'local' : '', equipoNombre) || ['Acción en el campo...'];
  return lista[Math.floor(Math.random() * lista.length)];
}

// Posiciones iniciales de jugadores en el campo (normalizado 0-1)
export function getPosicionesIniciales(formacion, equipo = 'local') {
  const base = {
    '4-3-3': [
      [0.08, 0.50],
      [0.22, 0.80], [0.22, 0.60], [0.22, 0.40], [0.22, 0.20],
      [0.42, 0.75], [0.42, 0.50], [0.42, 0.25],
      [0.65, 0.85], [0.72, 0.50], [0.65, 0.15],
    ],
    '4-4-2': [
      [0.08, 0.50],
      [0.22, 0.80], [0.22, 0.60], [0.22, 0.40], [0.22, 0.20],
      [0.48, 0.85], [0.48, 0.62], [0.48, 0.38], [0.48, 0.15],
      [0.72, 0.65], [0.72, 0.35],
    ],
    '4-2-3-1': [
      [0.08, 0.50],
      [0.22, 0.80], [0.22, 0.60], [0.22, 0.40], [0.22, 0.20],
      [0.40, 0.65], [0.40, 0.35],
      [0.60, 0.85], [0.63, 0.50], [0.60, 0.15],
      [0.78, 0.50],
    ],
    '3-5-2': [
      [0.08, 0.50],
      [0.22, 0.70], [0.22, 0.50], [0.22, 0.30],
      [0.42, 0.88], [0.42, 0.65], [0.45, 0.50], [0.42, 0.35], [0.42, 0.12],
      [0.72, 0.65], [0.72, 0.35],
    ],
  };

  const pos = base[formacion] || base['4-3-3'];

  if (equipo === 'visitante') {
    return pos.map(([x, y]) => [1 - x, 1 - y]);
  }
  return pos;
}
