// Script de un solo uso: resuelve el ID de SofaScore para cada jugador/equipo
// de La Liga y Premier, para poder pedir la foto/escudo directamente sin
// pasar por el endpoint de búsqueda (que Vercel tiene bloqueado).
import { writeFileSync } from 'fs';
import { LALIGA_EQUIPOS } from '../src/data/laliga.js';
import { PREMIER_EQUIPOS } from '../src/data/premier.js';

const SS_SEARCH = 'https://api.sofascore.com/api/v1/search/all?q=';

function normName(s) {
  if (!s) return '';
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '').trim();
}

function cacheKey(nombre, equipoNombre) {
  const n = normName(nombre).slice(0, 25);
  const e = normName(equipoNombre).slice(0, 15);
  return e ? `${n}_${e}` : n;
}

const ALIAS = {
  'Vini Jr.': 'Vinicius Junior', 'Vini Jr': 'Vinicius Junior', 'Vini': 'Vinicius Junior',
  'Vinicius Jr': 'Vinicius Junior', 'K. Mbappé': 'Kylian Mbappe', 'Mbappé': 'Kylian Mbappe',
  'A. Griezmann': 'Antoine Griezmann', 'J. Bellingham': 'Jude Bellingham',
  'Éder Militão': 'Eder Militao', 'A. Rüdiger': 'Antonio Rudiger', 'R. Lewandowski': 'Robert Lewandowski',
  'Lamine Yamal': 'Lamine Yamal', 'Abde': 'Abde Ezzalzouli', 'Cucho': 'Cucho Hernandez',
  'Isi': 'Isi Palazon', 'Koke': 'Koke', 'Parejo': 'Dani Parejo', 'Ayoze': 'Ayoze Perez',
  'Pedri': 'Pedri', 'Balde': 'Alejandro Balde', 'Guruzeta': 'Gorka Guruzeta', 'Morales': 'Jose Luis Morales',
  'Brugui': 'Roger Brugue', 'Puado': 'Javi Puado', 'Oyarzabal': 'Mikel Oyarzabal',
  'Barrenetxea': 'Ander Barrenetxea', 'Sancet': 'Oihan Sancet', 'Berenguer': 'Alex Berenguer',
  'Zubeldia': 'Luca Zubeldia', 'Vivian': 'Dani Vivian', 'Mingueza': 'Oscar Mingueza',
  'Bartra': 'Marc Bartra', 'Moleiro': 'Alberto Moleiro', 'M. Arambarri': 'Mauro Arambarri',
  'Carmona': 'Jose Angel Carmona', 'B. Mendy': 'Batista Mendy', 'Gayà': 'Jose Luis Gaya',
  'Gayá': 'Jose Luis Gaya', 'Gaya': 'Jose Luis Gaya', 'Aarón': 'Aaron Escandell',
  'Raíllo': 'Antonio Raillo', 'Maffeo': 'Pablo Maffeo', 'Gabriel': 'Gabriel Magalhaes',
  'Pepelu': 'Pepelu', 'Sivera': 'Antonio Sivera', 'Alisson': 'Alisson', 'Alisson Becker': 'Alisson',
  'N. Aké': 'Nathan Ake', 'N. Ak': 'Nathan Ake', 'Aké': 'Nathan Ake', 'F. Boyomo': 'Enzo Boyomo',
  'Boyomo': 'Enzo Boyomo', 'Guridi': 'Jon Guridi', 'J. Giménez': 'Jose Maria Gimenez',
  'Giménez': 'Jose Maria Gimenez', 'Pacheco': 'Jon Pacheco', 'Aleña': 'Carles Alena',
  'Aleñá': 'Carles Alena', 'Valera': 'German Valera', 'Manu Sánchez': 'Manuel Sanchez',
  'M. Ryan': 'Mathew Ryan',
};

function getSearchTerm(nombre) {
  const trimmed = nombre.trim();
  if (ALIAS[trimmed]) return ALIAS[trimmed];
  const parts = trimmed.split(/\s+/);
  const clean = parts.filter(p => {
    const pp = p.replace(/\./g, '');
    return pp.length > 1 && !['jr', 'sr', 'ii', 'iii'].includes(pp.toLowerCase());
  });
  if (clean.length === 0) return trimmed;
  if (/^[A-Z]\.?$/.test(clean[0]) && clean.length > 1) return clean.slice(1).join(' ');
  return clean.join(' ');
}

function nameScore(searchTerm, ssName) {
  const g = normName(searchTerm);
  const t = normName(ssName);
  if (!g || !t) return 0;
  if (g === t) return 1.0;
  if (t.includes(g) && g.length >= 5) return 0.95;
  if (g.includes(t) && t.length >= 5) return 0.93;
  const gP = g.split(' ').filter(Boolean);
  const tP = t.split(' ').filter(Boolean);
  const gL = gP[gP.length - 1];
  const tL = tP[tP.length - 1];
  if (gP.length >= 2 && gP.every(w => tP.includes(w))) return 0.92;
  if (gP.length >= 2 && tP.length >= 2 && gL && tL && gL === tL && gL.length > 3) {
    const gFirst = gP[0].replace('.', '');
    const tFirst = tP[0];
    if (tFirst === gFirst || tFirst.startsWith(gFirst) || (gFirst.length === 1 && tFirst.startsWith(gFirst))) return 0.85;
    if (gL.length >= 7) return 0.72;
    return 0.50;
  }
  if (gP.length >= 2 && tP.length >= 2) {
    const gInit = gP[0].replace('.', '');
    if (gInit.length === 1 && gL === tL && gL.length > 3 && tP[0].startsWith(gInit)) return 0.82;
  }
  if (gP.length === 1 && (tP[0] === g || tP.includes(g)) && g.length >= 3) return 0.78;
  if (gP.length === 1 && g.length >= 5 && tP.includes(g)) return 0.72;
  return 0;
}

function teamScore(gameTeam, ssTeam) {
  if (!gameTeam || !ssTeam) return 0;
  const a = normName(gameTeam);
  const b = normName(ssTeam);
  if (!a || !b) return 0;
  if (a === b) return 1.0;
  if (b.includes(a) || a.includes(b)) return 0.9;
  const sigWords = s => s.split(' ').filter(w => w.length > 3);
  const aW = sigWords(a);
  const bW = sigWords(b);
  if (aW.length > 0 && bW.length > 0 && aW.some(w => bW.includes(w))) return 0.8;
  return 0;
}

const TEAM_OVERRIDE = { 'A. Witsel': 'Atlético de Madrid', 'M. Ryan': 'Roma', 'Alfon': 'RC Celta' };

async function fetchJSON(query) {
  const res = await fetch(SS_SEARCH + encodeURIComponent(query), { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

async function resolvePlayer(nombre, equipoNombre) {
  let team = equipoNombre;
  if (TEAM_OVERRIDE[nombre]) team = TEAM_OVERRIDE[nombre];
  const term = getSearchTerm(nombre);
  if (!term) return null;
  const searches = [term];
  const teamClean = normName(team).split(' ').filter(w => w.length > 3)[0];
  if (teamClean) searches.push(`${term} ${teamClean}`);

  for (const query of searches) {
    try {
      const data = await fetchJSON(query);
      if (!data) continue;
      const items = data.results || data.data || [];
      let best = 0, bestId = null, bestName = null;
      for (const item of items) {
        let p = null;
        if (item.type === 'player' && item.entity) p = item.entity;
        else if (item.player) p = item.player;
        else if (item.id && (item.name || item.shortName)) p = item;
        if (!p?.id) continue;
        const names = [p.name, p.shortName, p.lastName].filter(Boolean);
        let nScore = 0;
        for (const n of names) { const s = nameScore(term, n); if (s > nScore) nScore = s; }
        if (nScore < 0.50) continue;
        let tScore = 0;
        if (team && p.team) {
          const teamNames = [p.team.name, p.team.shortName].filter(Boolean);
          for (const tn of teamNames) { const s = teamScore(team, tn); if (s > tScore) tScore = s; }
        }
        const combined = nScore + (tScore * 0.5);
        if (combined > best) { best = combined; bestId = p.id; bestName = p.name; }
      }
      if (best >= 0.68 && bestId) return { id: bestId, matchedName: bestName, score: best };
    } catch {}
  }
  return null;
}

async function resolveTeam(nombre) {
  try {
    const data = await fetchJSON(nombre);
    if (!data) return null;
    const items = data.results || data.data || [];
    let best = 0, bestId = null, bestName = null;
    for (const item of items) {
      if (item.type !== 'team') continue;
      const t = item.entity || item;
      if (!t?.id) continue;
      for (const n of [t.name, t.shortName].filter(Boolean)) {
        const s = teamScore(nombre, n);
        if (s > best) { best = s; bestId = t.id; bestName = t.name; }
      }
    }
    if (best >= 0.65 && bestId) return { id: bestId, matchedName: bestName, score: best };
  } catch {}
  return null;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const playerIds = {};
  const teamIds = {};
  const misses = [];

  const allTeams = [...LALIGA_EQUIPOS, ...PREMIER_EQUIPOS];

  for (const equipo of allTeams) {
    const tResult = await resolveTeam(equipo.nombre);
    if (tResult) {
      teamIds[equipo.id] = tResult.id;
      console.log(`TEAM  OK  ${equipo.nombre} -> ${tResult.id} (${tResult.matchedName}, score ${tResult.score.toFixed(2)})`);
    } else {
      misses.push(`TEAM  ${equipo.nombre}`);
      console.log(`TEAM  MISS ${equipo.nombre}`);
    }
    await sleep(250);

    for (const j of equipo.jugadores) {
      const key = cacheKey(j.nombre, equipo.nombre);
      if (playerIds[key]) continue; // ya resuelto (mismo jugador repetido)
      const pResult = await resolvePlayer(j.nombre, equipo.nombre);
      if (pResult) {
        playerIds[key] = pResult.id;
        console.log(`PLAYER OK  ${j.nombre} (${equipo.nombre}) -> ${pResult.id} (${pResult.matchedName}, score ${pResult.score.toFixed(2)})`);
      } else {
        misses.push(`PLAYER ${j.nombre} (${equipo.nombre})`);
        console.log(`PLAYER MISS ${j.nombre} (${equipo.nombre})`);
      }
      await sleep(250);
    }
  }

  writeFileSync('src/data/sofaPlayerIds.json', JSON.stringify(playerIds, null, 2));
  writeFileSync('src/data/sofaTeamIds.json', JSON.stringify(teamIds, null, 2));
  writeFileSync('scripts/sofaIds_misses.txt', misses.join('\n'));

  console.log(`\nHecho. ${Object.keys(playerIds).length} jugadores y ${Object.keys(teamIds).length} equipos resueltos. ${misses.length} fallos.`);
}

main().catch(e => { console.error(e); process.exit(1); });
