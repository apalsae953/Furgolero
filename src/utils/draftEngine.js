// Motor del draft: lógica de obtención de jugadores y cartas

import { LALIGA_EQUIPOS } from '../data/laliga.js';
import { PREMIER_EQUIPOS } from '../data/premier.js';
import { MUNDIALES_EQUIPOS } from '../data/mundiales.js';

// 5 equipos élite: su estrella puede tener carta legendaria (media 105, prob 1%)
const EQUIPOS_LEGENDARIOS = new Set(['real_madrid', 'barcelona', 'man_city', 'arsenal', 'liverpool']);
const PROB_LEGENDARIO = 0.01;
const MEDIA_LEGENDARIO = 105;

function _norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
}

// Encuentra el id del jugador que corresponde a la cartaEspecial, buscando por nombre
function findCartaEspecialId(jugadores, cartaEspecial) {
  if (!cartaEspecial?.jugadorNombre) return null;
  const key = _norm(cartaEspecial.jugadorNombre.replace(/\s*\(GOLD\).*/i, '').trim());
  for (const j of jugadores) {
    const n = _norm(j.nombre);
    if (n.includes(key) || key.includes(n.split(' ').slice(-1)[0])) return j.id;
  }
  return null;
}

function makeEspecial(j, mediaBase, nombre) {
  return {
    ...j,
    mediaFinal: mediaBase,
    esUpgrade: true,
    esEspecial: true,
    rareza: 'especial',
    versionLabel: nombre,
    nombreMostrado: nombre,
  };
}

// Obtener el pool de equipos según el modo
export function getEquiposPool(modo) {
  if (modo === 'laliga') return LALIGA_EQUIPOS;
  if (modo === 'premier') return PREMIER_EQUIPOS;
  if (modo === 'mundial') return MUNDIALES_EQUIPOS;
  return [];
}

// Elegir equipo aleatorio del pool
export function sortearEquipo(modo, equiposUsados = []) {
  const pool = getEquiposPool(modo);
  const disponibles = pool.filter(e => !equiposUsados.includes(e.id));
  if (disponibles.length === 0) return null;
  return disponibles[Math.floor(Math.random() * disponibles.length)];
}

// Determinar la versión de un jugador: base o upgrade
// canUpgrade=true solo para los top 3 del equipo (draft) o todos (sobres)
export function determinarVersion(jugador, canUpgrade = false) {
  if (!canUpgrade || !jugador.upgrades?.length) {
    return {
      ...jugador,
      mediaFinal: jugador.media,
      esUpgrade: false,
      rareza: 'normal',
      versionLabel: jugador.nombre,
    };
  }
  for (const upg of jugador.upgrades) {
    if (Math.random() < upg.prob) {
      const delta = upg.media - jugador.media;
      return {
        ...jugador,
        mediaFinal: upg.media,
        esUpgrade: true,
        rareza: delta >= 5 ? 'oro' : 'plata',
        versionLabel: jugador.nombre + ' ★',
      };
    }
  }
  return {
    ...jugador,
    mediaFinal: jugador.media,
    esUpgrade: false,
    rareza: 'normal',
    versionLabel: jugador.nombre,
  };
}

// Generar 5 jugadores aleatorios del equipo para mostrar en el draft
export function sortearJugadoresEquipo(equipo, _cartasEspecialesObtenidas = []) {
  if (!equipo) return [];
  const jugadores = [...equipo.jugadores];

  // Top 3 por media: únicos con posibilidad de plus en el draft
  const porMedia = [...jugadores].sort((a, b) => b.media - a.media);
  const top3Ids = new Set(porMedia.slice(0, 3).map(j => j.id));

  // Jugador estrella del equipo (del que sale la carta especial/legendaria)
  const cartaEspecialId = findCartaEspecialId(jugadores, equipo.cartaEspecial) ?? porMedia[0]?.id;

  let esCartaEspecial = false;
  let esLegendaria = false;

  if (cartaEspecialId && equipo.cartaEspecial) {
    if (EQUIPOS_LEGENDARIOS.has(equipo.id) && Math.random() < PROB_LEGENDARIO) {
      esLegendaria = true;
      esCartaEspecial = true;
    } else if (Math.random() < equipo.cartaEspecial.probabilidad) {
      esCartaEspecial = true;
    }
  }

  const mezclados = jugadores.sort(() => Math.random() - 0.5);

  if (esCartaEspecial && cartaEspecialId) {
    const idx = mezclados.findIndex(j => j.id === cartaEspecialId);
    if (idx >= 5) {
      const temp = mezclados[4];
      mezclados[4] = mezclados[idx];
      mezclados[idx] = temp;
    }
  }

  const final5 = mezclados.slice(0, 5);

  return final5.map(j => {
    if (j.id === cartaEspecialId && esCartaEspecial) {
      // Carta legendaria o especial
      if (esLegendaria) {
        const legName = equipo.cartaEspecial.jugadorNombre.replace(/\(GOLD\)/i, '(LEGEND)').trim();
        return makeEspecial(j, MEDIA_LEGENDARIO, legName);
      } else {
        return makeEspecial(j, equipo.cartaEspecial.mediaBase, equipo.cartaEspecial.jugadorNombre);
      }
    }

    // Plus normal: solo para los 3 mejores jugadores del equipo
    const version = determinarVersion(j, top3Ids.has(j.id));
    return { ...version, esEspecial: false, nombreMostrado: version.versionLabel };
  });
}

// Generar jugadores para un sobre de cartas
export function abrirSobre(modo) {
  const pool = getEquiposPool(modo);
  if (pool.length === 0) return [];
  const cartas = [];
  for (let i = 0; i < 5; i++) {
    const equipo = pool[Math.floor(Math.random() * pool.length)];
    const jugador = equipo.jugadores[Math.floor(Math.random() * equipo.jugadores.length)];
    const version = determinarVersion(jugador, true); // sobres: todos los jugadores pueden tener plus
    cartas.push({
      ...version,
      equipoId: equipo.id,
      equipoNombre: equipo.nombre,
      color: equipo.color,
      colorSecundario: equipo.colorSecundario,
      liga: equipo.liga,
      esEspecial: false,
      nombreMostrado: version.versionLabel,
    });
  }
  return cartas;
}

// Generar equipo de IA para el torneo, con media objetivo
export function generarEquipoIA(modo, mediaObjetivo = 82, equiposUsados = []) {
  const pool = getEquiposPool(modo);
  const disponibles = pool.filter(e => !equiposUsados.includes(e.id));
  if (disponibles.length === 0) return null;

  // Elegir el equipo cuya media más se acerque al objetivo
  const conMedias = disponibles.map(e => {
    const mediaEq = e.jugadores.reduce((s, j) => s + j.media, 0) / e.jugadores.length;
    return { equipo: e, media: mediaEq };
  });

  conMedias.sort((a, b) => Math.abs(a.media - mediaObjetivo) - Math.abs(b.media - mediaObjetivo));
  const elegido = conMedias[0].equipo;

  // Asignar la mejor versión de cada jugador (base)
  const jugadores = elegido.jugadores.map(j => ({
    ...j,
    mediaFinal: j.media + Math.floor((mediaObjetivo - conMedias[0].media) * 0.5),
    equipoId: elegido.id,
    equipoNombre: elegido.nombre,
  })).slice(0, 11);

  return {
    equipo: elegido,
    jugadores,
    mediaReal: conMedias[0].media,
  };
}

// Determinar media objetivo por ronda
export function getMediaObjetivoRonda(ronda, mediaJugador = 82) {
  const bases = {
    'octavos': mediaJugador - 5,
    'cuartos': mediaJugador - 2,
    'semis': mediaJugador + 2,
    'final': mediaJugador + 6,
  };
  return Math.max(72, Math.min(99, bases[ronda] || 80));
}
