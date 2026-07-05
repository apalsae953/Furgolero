// Motor del torneo: lógica del bracket y avance de rondas

export const RONDAS = ['octavos', 'cuartos', 'semis', 'final'];
export const RONDAS_NOMBRE = {
  octavos: 'Octavos de Final',
  cuartos: 'Cuartos de Final',
  semis: 'Semifinal',
  final: 'FINAL',
};
export const PREMIOS_RONDA = {
  octavos: 150,
  cuartos: 250,
  semis: 400,
  final: 700,
};

export function crearTorneo(modo, mediaJugador = 82) {
  return {
    modo,
    rondaActual: 'octavos',
    completada: false,
    campeón: false,
    historial: [],
    mediaJugador,
  };
}

export function siguienteRonda(rondaActual) {
  const idx = RONDAS.indexOf(rondaActual);
  if (idx === -1 || idx >= RONDAS.length - 1) return null;
  return RONDAS[idx + 1];
}

export function getRondaIndex(ronda) {
  return RONDAS.indexOf(ronda);
}

// Calcular dificultad del rival en base a la ronda y media del jugador
export function getMediaRival(ronda, mediaJugador) {
  const ajuste = {
    octavos: -6,
    cuartos: -3,
    semis: 1,
    final: 5,
  };
  return Math.max(72, Math.min(99, mediaJugador + (ajuste[ronda] || 0)));
}
