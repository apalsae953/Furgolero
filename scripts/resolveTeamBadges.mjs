// Genera src/data/teamBadges.json: mapa equipo.id -> URL de escudo (TheSportsDB).
import { writeFileSync } from 'fs';
import { LALIGA_EQUIPOS } from '../src/data/laliga.js';
import { PREMIER_EQUIPOS } from '../src/data/premier.js';

const API = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=';
const DELAY_MS = 1500;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function resolveTeam(nombre, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(API + encodeURIComponent(nombre));
      const text = await res.text();
      const data = JSON.parse(text);
      return data.teams?.[0]?.strBadge || null;
    } catch {
      await sleep(4000 * (i + 1));
    }
  }
  return null;
}

async function main() {
  const allTeams = [...LALIGA_EQUIPOS, ...PREMIER_EQUIPOS];
  const badgeMap = {};
  let found = 0;

  for (const equipo of allTeams) {
    const badge = await resolveTeam(equipo.nombre);
    if (badge) {
      badgeMap[equipo.id] = badge;
      found++;
      console.log(`OK   ${equipo.nombre} -> ${badge}`);
    } else {
      console.log(`MISS ${equipo.nombre}`);
    }
    await sleep(DELAY_MS);
  }

  writeFileSync('src/data/teamBadges.json', JSON.stringify(badgeMap, null, 2));
  console.log(`\nHecho. ${found}/${allTeams.length} equipos guardados en src/data/teamBadges.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
