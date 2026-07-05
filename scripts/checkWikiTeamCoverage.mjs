import { LALIGA_EQUIPOS } from '../src/data/laliga.js';
import { PREMIER_EQUIPOS } from '../src/data/premier.js';

const API = 'https://en.wikipedia.org/w/api.php';
const HEADERS = { 'User-Agent': 'FurgoleroApp/1.0 (proyecto personal de aficionado; https://furgolero.vercel.app)' };
const DELAY_MS = 700;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 429 || res.status === 503) { await sleep(5000 * (i + 1)); continue; }
    return res;
  }
  return null;
}

async function getPageInfo(title) {
  const url = `${API}?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&origin=*&pithumbsize=200`;
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) return null;
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return null;
  return { title: page.title, thumb: page.thumbnail?.source || null };
}

async function searchWiki(query) {
  const url = `${API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3`;
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) return [];
  const data = await res.json();
  return data.query?.search || [];
}

async function main() {
  const allTeams = [...LALIGA_EQUIPOS, ...PREMIER_EQUIPOS];
  let found = 0, total = 0;
  for (const equipo of allTeams) {
    total++;
    let info = await getPageInfo(equipo.nombre);
    if (!info) {
      const results = await searchWiki(`${equipo.nombre} football club`);
      if (results[0]) info = await getPageInfo(results[0].title);
    }
    if (info?.thumb) {
      found++;
      console.log(`OK   ${equipo.nombre} -> ${info.title}`);
    } else {
      console.log(`MISS ${equipo.nombre}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`\n=== RESUMEN EQUIPOS ===\nTotal: ${total}\nCon escudo: ${found} (${(100*found/total).toFixed(1)}%)`);
}

main().catch(e => { console.error(e); process.exit(1); });
