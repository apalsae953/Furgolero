// Genera src/data/wikiPlayerPhotos.json: mapa cacheKey -> URL de foto libre en Wikipedia.
import { writeFileSync } from 'fs';
import { LALIGA_EQUIPOS } from '../src/data/laliga.js';
import { PREMIER_EQUIPOS } from '../src/data/premier.js';

const API = 'https://en.wikipedia.org/w/api.php';
const HEADERS = { 'User-Agent': 'FurgoleroApp/1.0 (proyecto personal de aficionado; https://furgolero.vercel.app)' };
const DELAY_MS = 700;

function normName(s) {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, '').trim();
}

// Debe coincidir EXACTAMENTE con cacheKey() de src/utils/playerPhotos.js
function cacheKey(nombre, equipoNombre) {
  const n = normName(nombre).slice(0, 25);
  const e = normName(equipoNombre).slice(0, 15);
  const base = e ? `${n}_${e}` : n;
  if (base.includes('carmona') || base.includes('mendy')) return base + '_v2';
  return base;
}

function getSearchTerm(nombre) {
  const trimmed = nombre.trim();
  const parts = trimmed.split(/\s+/);
  const clean = parts.filter(p => {
    const pp = p.replace(/\./g, '');
    return pp.length > 1 && !['jr', 'sr', 'ii', 'iii'].includes(pp.toLowerCase());
  });
  if (clean.length === 0) return trimmed;
  if (/^[A-Z]\.?$/.test(clean[0]) && clean.length > 1) return clean.slice(1).join(' ');
  return clean.join(' ');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 429 || res.status === 503) { await sleep(5000 * (i + 1)); continue; }
    return res;
  }
  return null;
}

async function searchWiki(query) {
  const url = `${API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`;
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) return [];
  const data = await res.json();
  return data.query?.search || [];
}

async function getPageInfo(title) {
  const url = `${API}?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|pageprops&format=json&origin=*&pithumbsize=300`;
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) return null;
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return null;
  return {
    title: page.title,
    thumb: page.thumbnail?.source || null,
    shortdesc: page.pageprops?.['wikibase-shortdesc'] || '',
  };
}

function stripHtml(s) { return (s || '').replace(/<[^>]+>/g, ''); }

async function resolvePlayer(nombre, equipoNombre) {
  const term = getSearchTerm(nombre);
  const teamWord = normName(equipoNombre).split(' ').filter(w => w.length > 3)[0] || '';
  const results = await searchWiki(`${term} footballer ${teamWord}`);
  if (results.length === 0) return null;

  for (const r of results.slice(0, 3)) {
    const snippet = normName(stripHtml(r.snippet));
    const titleNorm = normName(r.title);
    const nameWords = normName(term).split(' ').filter(Boolean);
    const lastName = nameWords[nameWords.length - 1];
    if (!titleNorm.includes(lastName)) continue;

    const info = await getPageInfo(r.title);
    if (!info) continue;
    const desc = normName(info.shortdesc);
    const isFootballer = desc.includes('footballer') || desc.includes('football player') || snippet.includes('footballer');
    if (!isFootballer) continue;
    if (info.thumb) return { title: info.title, thumb: info.thumb };
    return null;
  }
  return null;
}

async function main() {
  const allTeams = [...LALIGA_EQUIPOS, ...PREMIER_EQUIPOS];
  const photoMap = {};
  let total = 0, found = 0;

  for (const equipo of allTeams) {
    for (const j of equipo.jugadores) {
      total++;
      const key = cacheKey(j.nombre, equipo.nombre);
      if (photoMap[key]) continue; // ya resuelto (mismo jugador repetido en el pool)
      const r = await resolvePlayer(j.nombre, equipo.nombre);
      if (r) {
        photoMap[key] = r.thumb;
        found++;
        console.log(`OK    ${j.nombre.padEnd(28)} (${equipo.nombre}) -> ${r.title}`);
      } else {
        console.log(`MISS  ${j.nombre} (${equipo.nombre})`);
      }
      await sleep(DELAY_MS);
    }
  }

  writeFileSync('src/data/wikiPlayerPhotos.json', JSON.stringify(photoMap, null, 2));
  console.log(`\nHecho. ${found}/${total} jugadores con foto guardados en src/data/wikiPlayerPhotos.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
