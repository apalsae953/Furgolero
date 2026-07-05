import { LALIGA_EQUIPOS } from '../src/data/laliga.js';
import { PREMIER_EQUIPOS } from '../src/data/premier.js';

const API = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const allTeams = [...LALIGA_EQUIPOS, ...PREMIER_EQUIPOS];
  let found = 0;
  const results = {};
  for (const equipo of allTeams) {
    try {
      const res = await fetch(API + encodeURIComponent(equipo.nombre));
      const data = await res.json();
      const team = data.teams?.[0];
      if (team?.strBadge) {
        found++;
        results[equipo.id] = team.strBadge;
        console.log(`OK   ${equipo.nombre} -> ${team.strTeam} -> ${team.strBadge}`);
      } else {
        console.log(`MISS ${equipo.nombre}`);
      }
    } catch (e) {
      console.log(`ERROR ${equipo.nombre}: ${e.message}`);
    }
    await sleep(400);
  }
  console.log(`\n=== RESUMEN ===\nTotal: ${allTeams.length}\nCon escudo: ${found} (${(100*found/allTeams.length).toFixed(1)}%)`);
}

main().catch(e => { console.error(e); process.exit(1); });
