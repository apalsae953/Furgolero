// Audita src/data/teamBadges.json: para cada equipo, verifica que el resultado
// de TheSportsDB pertenezca a la liga correcta (evita casos como "Athletic Club"
// emparejado con un club brasileño homónimo en vez de Athletic Bilbao).
import { LALIGA_EQUIPOS } from '../src/data/laliga.js';
import { PREMIER_EQUIPOS } from '../src/data/premier.js';

const API = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=';
const EXPECTED_LEAGUE = { laliga: 'Spanish La Liga', premier: 'English Premier League' };

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const all = [
    ...LALIGA_EQUIPOS.map(e => ({ ...e, _liga: 'laliga' })),
    ...PREMIER_EQUIPOS.map(e => ({ ...e, _liga: 'premier' })),
  ];

  for (const equipo of all) {
    try {
      const res = await fetch(API + encodeURIComponent(equipo.nombre));
      const data = await res.json();
      const team = data.teams?.[0];
      const expected = EXPECTED_LEAGUE[equipo._liga];
      if (!team) {
        console.log(`SIN RESULTADO  ${equipo.nombre}`);
      } else if (team.strLeague !== expected) {
        console.log(`MISMATCH  ${equipo.nombre} (id=${equipo.id}) -> encontrado "${team.strTeam}" en liga "${team.strLeague}" (esperada: ${expected})`);
      } else {
        console.log(`OK  ${equipo.nombre} -> ${team.strTeam} (${team.strLeague})`);
      }
    } catch (e) {
      console.log(`ERROR ${equipo.nombre}: ${e.message}`);
    }
    await sleep(1500);
  }
  console.log('\nAuditoria completa.');
}

main().catch(e => { console.error(e); process.exit(1); });
