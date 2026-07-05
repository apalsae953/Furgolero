import TEAM_BADGES from '../data/teamBadges.json';

const SS_SEARCH = '/sofa-api/search/all?q=';
const SS_IMG    = 'https://img.sofascore.com/api/v1/team/';

async function fetchWithTimeout(url, options = {}, time = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), time);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
const LS        = 'fg_tm10_';
const memLogo   = new Map();
const pending   = new Map();

try {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(LS) && localStorage.getItem(k) === '__none__') {
      localStorage.removeItem(k);
    }
  });
} catch {}

function norm(s) {
  if (!s) return '';
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '').trim();
}
function lsGet(k)    { try { return localStorage.getItem(LS + k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(LS + k, v); }   catch {} }

// Palabras significativas (> 3 chars) — ignora "fc", "ud", "cf", "rc", "ca"
function sigWords(s) {
  return s.split(' ').filter(w => w.length > 3);
}

function teamScore(nombre, ssName) {
  const a = norm(nombre);
  const b = norm(ssName);
  if (!a || !b) return 0;
  if (a === b) return 1.0;
  const aW = sigWords(a);
  const bW = sigWords(b);
  if (aW.length === 0 || bW.length === 0) return 0;
  // Todas las palabras clave de la búsqueda aparecen en el nombre SS
  if (aW.every(w => bW.includes(w))) return 0.9;
  // Primera palabra clave larga coincide
  if (aW[0] === bW[0] && aW[0].length >= 5) return 0.7;
  return 0;
}

async function fetchLogo(nombre, equipoId) {
  if (!nombre) return null;

  try {
    const r = await fetchWithTimeout(SS_SEARCH + encodeURIComponent(nombre), {
      headers: { Accept: 'application/json' },
    }, 2500);
    if (!r.ok) return TEAM_BADGES[equipoId] || null;
    const data = await r.json();
    const items = data.results || data.data || [];
    let best = 0, bestId = null;
    for (const item of items) {
      if (item.type !== 'team') continue;
      const t = item.entity || item;
      if (!t?.id) continue;
      for (const n of [t.name, t.shortName].filter(Boolean)) {
        const s = teamScore(nombre, n);
        if (s > best) { best = s; bestId = t.id; }
      }
    }
    if (best < 0.65 || !bestId) return TEAM_BADGES[equipoId] || null;
    return `${SS_IMG}${bestId}/image`;
  } catch { return TEAM_BADGES[equipoId] || null; }
}

export function getCachedLogo(key) {
  if (memLogo.has(key)) return memLogo.get(key);
  const s = lsGet(key);
  if (s !== null) {
    const u = s === '__none__' ? null : s;
    memLogo.set(key, u);
    return u;
  }
  return undefined; // no en caché todavía
}

function saveLogo(key, url) {
  if (url === undefined) return;
  memLogo.set(key, url ?? null);
  lsSet(key, url || '__none__');
}

export function getLogoAsync(equipoId, nombre) {
  const key = equipoId || norm(nombre || '').slice(0, 30);
  if (!key || !nombre) return Promise.resolve(null);
  const cached = getCachedLogo(key);
  if (cached !== undefined) return Promise.resolve(cached);
  if (pending.has(key)) return pending.get(key);
  const p = fetchLogo(nombre, equipoId).then(url => {
    saveLogo(key, url);
    pending.delete(key);
    return url;
  });
  pending.set(key, p);
  return p;
}
