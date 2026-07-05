const SS_SEARCH = 'https://api.sofascore.com/api/v1/search/all?q=';
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

const KNOWN_TEAMS = {
  'real madrid': 2829,
  'fc barcelona': 2817,
  'barcelona': 2817,
  'atletico de madrid': 2836,
  'athletic club': 2825,
  'real sociedad': 2824,
  'girona': 24264,
  'girona fc': 24264,
  'real betis': 2816,
  'villarreal': 2819,
  'villarreal cf': 2819,
  'valencia': 2828,
  'valencia cf': 2828,
  'sevilla': 2833,
  'sevilla fc': 2833,
  'osasuna': 2820,
  'ca osasuna': 2820,
  'alaves': 2885,
  'deportivo alaves': 2885,
  'celta': 2821,
  'celta de vigo': 2821,
  'rayo vallecano': 2818,
  'mallorca': 2826,
  'rcd mallorca': 2826,
  'las palmas': 2835,
  'ud las palmas': 2835,
  'getafe': 2859,
  'getafe cf': 2859,
  'espanyol': 2814,
  'rcd espanyol': 2814,
  'leganes': 2845,
  'cd leganes': 2845,
  'valladolid': 2831,
  'real valladolid': 2831,
};

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

async function fetchLogo(nombre) {
  if (!nombre) return null;
  const n = norm(nombre);
  if (KNOWN_TEAMS[n]) return `${SS_IMG}${KNOWN_TEAMS[n]}/image`;

  try {
    let r = await fetchWithTimeout(SS_SEARCH + encodeURIComponent(nombre), {
      headers: { Accept: 'application/json' },
    }, 2500);
    if (!r.ok) {
      r = await fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(SS_SEARCH + encodeURIComponent(nombre)), {}, 3500);
      if (!r.ok) {
        r = await fetchWithTimeout('https://corsproxy.io/?' + encodeURIComponent(SS_SEARCH + encodeURIComponent(nombre)), {}, 3500);
        if (!r.ok) return null;
      }
    }
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
    if (best < 0.65 || !bestId) return null;
    return `${SS_IMG}${bestId}/image`;
  } catch { return undefined; }
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
  const p = fetchLogo(nombre).then(url => {
    saveLogo(key, url);
    pending.delete(key);
    return url;
  });
  pending.set(key, p);
  return p;
}
