// Motor de simulación de partidos — lógica matemática pura (sin canvas)
// El canvas/animación está en el componente MatchSimulator

// Simular goles basado en medias de los equipos
export function simularResultado(mediaLocal, mediaVisitante) {
  const diff = mediaLocal - mediaVisitante;
  
  // Aumentamos mucho más el impacto de la diferencia de media
  // Un punto de media ahora vale mucho más
  const factorCalidad = diff * 0.025; 
  
  const probGolLocal = 0.50 + factorCalidad;
  const probGolVisit = 0.50 - factorCalidad;

  const maxGoles = 7; // Subimos el límite por si hay palizas
  let golesLocal = 0;
  let golesVisit = 0;

  // 15 oportunidades para reducir la aleatoriedad excesiva de tirar 18 monedas
  const oportunidades = 15;
  for (let i = 0; i < oportunidades; i++) {
    // Math.max de 0.01 permite que los equipos muy malos casi no marquen
    // prob base por oportunidad: ~8-10% si están igualados
    const umbralLocal = Math.max(0.01, Math.min(0.85, probGolLocal / oportunidades * 2.5));
    const umbralVisit = Math.max(0.01, Math.min(0.85, probGolVisit / oportunidades * 2.5));
    
    if (Math.random() < umbralLocal) golesLocal++;
    if (Math.random() < umbralVisit) golesVisit++;
  }

  // Si la diferencia es masiva (> 15), forzamos un mínimo de goles para el fuerte y restamos al débil
  if (diff > 15) {
    golesLocal = Math.max(golesLocal, Math.floor(diff / 10));
    if (Math.random() > 0.2) golesVisit = Math.max(0, golesVisit - 1);
  } else if (diff < -15) {
    golesVisit = Math.max(golesVisit, Math.floor(Math.abs(diff) / 10));
    if (Math.random() > 0.2) golesLocal = Math.max(0, golesLocal - 1);
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
