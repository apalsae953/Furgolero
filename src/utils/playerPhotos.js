// Fotos de jugadores — SofaScore API
// Mundiales → DiceBear | La Liga/Premier → SofaScore portrait
// Busca por nombre y VERIFICA el equipo del resultado para evitar caras incorrectas

const SS_SEARCH = 'https://api.sofascore.com/api/v1/search/all?q=';
const SS_IMG    = 'https://img.sofascore.com/api/v1/player/';
const LS        = 'fg_ph15_';  // prefijo localStorage
const memPhoto  = new Map();   // clave → url | null
const pending   = new Map();   // clave → Promise<url|null>

// Limpiar caché envenenada de errores anteriores
try {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(LS) && localStorage.getItem(k) === '__none__') {
      localStorage.removeItem(k);
    }
  });
} catch {}

function lsGet(k)    { try { return localStorage.getItem(LS + k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(LS + k, v); }   catch {} }

function normName(s) {
  if (!s) return '';
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '').trim();
}

function cacheKey(nombre, equipoNombre) {
  const n = normName(nombre).slice(0, 25);
  const e = normName(equipoNombre).slice(0, 15);
  const base = e ? `${n}_${e}` : n;
  // Forzar recarga de cache para estos jugadores que tenían alias equivocados
  if (base.includes('carmona') || base.includes('mendy')) return base + '_v2';
  return base;
}

const ALIAS = {
  'Vini Jr.':       'Vinicius Junior',
  'Vini Jr':        'Vinicius Junior',
  'Vini':           'Vinicius Junior',
  'Vinicius Jr':    'Vinicius Junior',
  'K. Mbappé':      'Kylian Mbappe',
  'Mbappé':         'Kylian Mbappe',
  'A. Griezmann':   'Antoine Griezmann',
  'J. Bellingham':  'Jude Bellingham',
  'Éder Militão':   'Eder Militao',
  'A. Rüdiger':     'Antonio Rudiger',
  'R. Lewandowski': 'Robert Lewandowski',
  'Lamine Yamal':   'Lamine Yamal',
  'Abde':           'Abde Ezzalzouli',
  'Cucho':          'Cucho Hernandez',
  'Isi':            'Isi Palazon',
  'Koke':           'Koke',
  'Parejo':         'Dani Parejo',
  'Ayoze':          'Ayoze Perez',
  'Pedri':          'Pedri',
  'Balde':          'Alejandro Balde',
  'Guruzeta':       'Gorka Guruzeta',
  'Morales':        'Jose Luis Morales',
  'Brugui':         'Roger Brugue',
  'Puado':          'Javi Puado',
  'Oyarzabal':      'Mikel Oyarzabal',
  'Barrenetxea':    'Ander Barrenetxea',
  'Sancet':         'Oihan Sancet',
  'Berenguer':      'Alex Berenguer',
  'Zubeldia':       'Luca Zubeldia',
  'Vivian':         'Dani Vivian',
  'Mingueza':       'Oscar Mingueza',
  'Bartra':         'Marc Bartra',
  'Moleiro':        'Alberto Moleiro',
  'M. Arambarri':   'Mauro Arambarri',
  'Carmona':        'Jose Angel Carmona',
  'B. Mendy':       'Batista Mendy',
  'Gayà':           'Jose Luis Gaya',
  'Gayá':           'Jose Luis Gaya',
  'Gaya':           'Jose Luis Gaya',
  'Aarón':          'Aaron Escandell',
  'Raíllo':         'Antonio Raillo',
  'Maffeo':         'Pablo Maffeo',
  'Gabriel':        'Gabriel Magalhaes',
  'Pepelu':         'Pepelu',
  'Sivera':         'Antonio Sivera',
  'Alisson':        'Alisson',
  'Alisson Becker': 'Alisson',
  'N. Aké':         'Nathan Ake',
  'N. Ak':         'Nathan Ake',
  'Aké':            'Nathan Ake',
  'F. Boyomo':      'Enzo Boyomo',
  'Boyomo':         'Enzo Boyomo',
  'Guridi':         'Jon Guridi',
  'J. Giménez':     'Jose Maria Gimenez',
  'Giménez':        'Jose Maria Gimenez',
  'Pacheco':        'Jon Pacheco',
  'Aleña':          'Carles Alena',
  'Aleñá':          'Carles Alena',
  'Valera':         'German Valera',
  'Manu Sánchez':   'Manuel Sanchez',
  'M. Ryan':        'Mathew Ryan',
};

// "T. Courtois" → "Courtois" | "K. Mbappé" → "Kylian Mbappe" (via ALIAS)
function getSearchTerm(nombre) {
  const trimmed = nombre.trim();
  if (ALIAS[trimmed]) return ALIAS[trimmed];
  const parts = trimmed.split(/\s+/);
  const clean = parts.filter(p => {
    const pp = p.replace(/\./g, '');
    return pp.length > 1 && !['jr', 'sr', 'ii', 'iii'].includes(pp.toLowerCase());
  });
  if (clean.length === 0) return trimmed;
  // Si empieza por inicial ("T."), quitar el primer token
  if (/^[A-Z]\.?$/.test(clean[0]) && clean.length > 1) return clean.slice(1).join(' ');
  return clean.join(' ');
}

// ── Scoring: nombre del jugador vs nombre en SofaScore ───────────────────────
function nameScore(searchTerm, ssName) {
  const g = normName(searchTerm);
  const t = normName(ssName);
  if (!g || !t) return 0;
  if (g === t) return 1.0;

  // Uno contiene al otro
  if (t.includes(g) && g.length >= 5) return 0.95;
  if (g.includes(t) && t.length >= 5) return 0.93;

  const gP = g.split(' ').filter(Boolean);
  const tP = t.split(' ').filter(Boolean);
  const gL = gP[gP.length - 1];
  const tL = tP[tP.length - 1];

  // Todas las palabras del search están en SS
  if (gP.length >= 2 && gP.every(w => tP.includes(w))) return 0.92;

  // Apellido exacto + primer token coincide
  if (gP.length >= 2 && tP.length >= 2 && gL && tL && gL === tL && gL.length > 3) {
    const gFirst = gP[0].replace('.', '');
    const tFirst = tP[0];
    if (tFirst === gFirst || tFirst.startsWith(gFirst) || (gFirst.length === 1 && tFirst.startsWith(gFirst))) {
      return 0.85;
    }
    if (gL.length >= 7) return 0.72;
    return 0.50;
  }

  // Inicial + apellido
  if (gP.length >= 2 && tP.length >= 2) {
    const gInit = gP[0].replace('.', '');
    if (gInit.length === 1 && gL === tL && gL.length > 3 && tP[0].startsWith(gInit)) return 0.82;
  }

  // Nombre único que coincide exacto en shortName
  if (gP.length === 1 && (tP[0] === g || tP.includes(g)) && g.length >= 3) return 0.78;

  // Apellido único (>= 5 chars) en resultado
  if (gP.length === 1 && g.length >= 5 && tP.includes(g)) return 0.72;

  return 0;
}

// ── Scoring: nombre del equipo del juego vs equipo del jugador en SofaScore ──
function teamScore(gameTeam, ssTeam) {
  if (!gameTeam || !ssTeam) return 0;
  const a = normName(gameTeam);
  const b = normName(ssTeam);
  if (!a || !b) return 0;
  if (a === b) return 1.0;
  // Uno contiene al otro
  if (b.includes(a) || a.includes(b)) return 0.9;
  // Palabras significativas (> 3 chars) — ignora "fc", "ud", "cf", "rc", "ca", "cd", "rcd"
  const sigWords = s => s.split(' ').filter(w => w.length > 3);
  const aW = sigWords(a);
  const bW = sigWords(b);
  if (aW.length > 0 && bW.length > 0 && aW.some(w => bW.includes(w))) return 0.8;
  return 0;
}

const TEAM_OVERRIDE = {
  'A. Witsel': 'Atlético de Madrid',
  'M. Ryan': 'Roma',
  'Alfon': 'RC Celta'
};

async function fetchPhoto(nombre, equipoNombre) {
  if (TEAM_OVERRIDE[nombre]) {
    equipoNombre = TEAM_OVERRIDE[nombre];
  }

  const term = getSearchTerm(nombre);
  if (!term) return null;

  // Intentar primero solo con el nombre, luego con nombre + equipo
  const searches = [term];
  if (equipoNombre) {
    const teamClean = normName(equipoNombre).split(' ').filter(w => w.length > 3)[0];
    if (teamClean) searches.push(`${term} ${teamClean}`);
  }

  for (const query of searches) {
    try {
      let res = await fetch(SS_SEARCH + encodeURIComponent(query), {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        // Fallback to proxy
        res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(SS_SEARCH + encodeURIComponent(query)));
        if (!res.ok) {
          if (res.status === 429) {
            memPhoto.set(cacheKey(nombre, equipoNombre), null);
            return null;
          }
          continue;
        }
      }
      const data = await res.json();

      const items = data.results || data.data || [];
      let best = 0, bestId = null;

      for (const item of items) {
        let p = null;
        if (item.type === 'player' && item.entity) p = item.entity;
        else if (item.player) p = item.player;
        else if (item.id && (item.name || item.shortName)) p = item;
        if (!p?.id) continue;

        // Calcular score del nombre
        const names = [p.name, p.shortName, p.lastName].filter(Boolean);
        let nScore = 0;
        for (const n of names) {
          const s = nameScore(term, n);
          if (s > nScore) nScore = s;
        }
        if (nScore < 0.50) continue;

        // Bonus por equipo correcto
        let tScore = 0;
        if (equipoNombre && p.team) {
          const teamNames = [p.team.name, p.team.shortName].filter(Boolean);
          for (const tn of teamNames) {
            const s = teamScore(equipoNombre, tn);
            if (s > tScore) tScore = s;
          }
        }

        const combined = nScore + (tScore * 0.5);
        if (combined > best) {
          best = combined;
          bestId = p.id;
        }
      }

      if (best >= 0.68 && bestId) return `${SS_IMG}${bestId}/image`;
    } catch {
      // Continuar al siguiente intento de búsqueda
    }
  }
  return null;
}

// ── API pública ───────────────────────────────────────────────────────────────

export function getDiceBearUrl(nombre) {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(nombre || 'player')}&backgroundColor=transparent&baseColor=f9c9b6,ac6651`;
}

export function getCachedPhoto(nombre, equipoNombre) {
  const key = cacheKey(nombre, equipoNombre);
  if (memPhoto.has(key)) return memPhoto.get(key);
  const stored = lsGet('p_' + key);
  if (stored !== null) {
    const url = stored === '__none__' ? null : stored;
    memPhoto.set(key, url);
    return url;
  }
  return undefined; // no en caché
}

function savePhoto(nombre, equipoNombre, url) {
  if (url === undefined) return; // No cachear errores
  const key = cacheKey(nombre, equipoNombre);
  memPhoto.set(key, url ?? null);
  lsSet('p_' + key, url || '__none__');
}

export async function preloadTeamPhotos(jugadores, liga, equipoNombre) {
  if (liga === 'mundial') return;
  for (const j of jugadores) {
    const nombre = j.nombre;
    if (!nombre || getCachedPhoto(nombre, equipoNombre) !== undefined) continue;
    const pKey = cacheKey(nombre, equipoNombre);
    if (pending.has(pKey)) { await pending.get(pKey); continue; }
    
    // Pequeño delay entre peticiones para evitar 429 Too Many Requests
    await new Promise(r => setTimeout(r, 150));
    
    const p = fetchPhoto(nombre, equipoNombre).then(url => {
      savePhoto(nombre, equipoNombre, url);
      pending.delete(pKey);
      return url;
    });
    pending.set(pKey, p);
    await p;
  }
}

export async function getPhotoUrl(nombre, liga, equipoNombre) {
  if (!nombre || liga === 'mundial') return null;
  const cached = getCachedPhoto(nombre, equipoNombre);
  if (cached !== undefined) return cached;
  const pKey = cacheKey(nombre, equipoNombre);
  if (pending.has(pKey)) return pending.get(pKey);
  const p = fetchPhoto(nombre, equipoNombre).then(url => {
    savePhoto(nombre, equipoNombre, url);
    pending.delete(pKey);
    return url;
  });
  pending.set(pKey, p);
  return p;
}

export function clearPhotoCache() {
  memPhoto.clear();
  pending.clear();
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(LS))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}
