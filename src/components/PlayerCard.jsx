// Tarjeta visual de jugador — estilo FIFA Ultimate Team
import { useState, useEffect } from 'react';
import { getColorPosicion } from '../utils/chemistry.js';
import { getPhotoUrl, getCachedPhoto, getDiceBearUrl } from '../utils/playerPhotos.js';
import { getCachedLogo, getLogoAsync } from '../utils/teamLogos.js';

function useTeamLogo(equipoId, nombre) {
  const [url, setUrl] = useState(() => {
    if (!equipoId) return null;
    const c = getCachedLogo(equipoId);
    return c !== undefined ? c : null;
  });
  const [imgErr, setImgErr] = useState(false);
  useEffect(() => {
    setImgErr(false);
    if (!equipoId || !nombre) { setUrl(null); return; }
    const c = getCachedLogo(equipoId);
    if (c !== undefined) { setUrl(c ?? null); return; }
    let cancel = false;
    getLogoAsync(equipoId, nombre).then(u => { if (!cancel) setUrl(u ?? null); });
    return () => { cancel = true; };
  }, [equipoId, nombre]);
  return { logoUrl: imgErr ? null : url, onImgErr: () => setImgErr(true) };
}

const RAREZA_FONDO = {
  especial: 'linear-gradient(160deg, #0d0020 0%, #1a0040 40%, #2d0060 70%, #1a0040 100%)',
  oro:      'linear-gradient(160deg, #1a0e00 0%, #3d2200 40%, #5c3500 70%, #3d2200 100%)',
  plata:    'linear-gradient(160deg, #0a1520 0%, #1a2d45 40%, #243d5a 70%, #1a2d45 100%)',
  bronce:   'linear-gradient(160deg, #150800 0%, #2e1500 40%, #422000 70%, #2e1500 100%)',
  normal:   'linear-gradient(160deg, #0c1422 0%, #152030 40%, #1d2e42 70%, #152030 100%)',
};
const RAREZA_CABECERA = {
  especial: 'linear-gradient(135deg, #3d0080 0%, #7b00cc 50%, #a020f0 100%)',
  oro:      'linear-gradient(135deg, #7a5000 0%, #c4900a 50%, #ffd700 100%)',
  plata:    'linear-gradient(135deg, #2a3a4a 0%, #5a7a8a 50%, #90aabb 100%)',
  bronce:   'linear-gradient(135deg, #3a1500 0%, #7a3800 50%, #cd7f32 100%)',
  normal:   'linear-gradient(135deg, #152030 0%, #2a4055 50%, #3a5570 100%)',
};
const RAREZA_BORDE = {
  especial: '#b040ff', oro: '#ffd700', plata: '#90aabb', bronce: '#cd7f32', normal: '#2a4055',
};
const RAREZA_MEDIA_COLOR = {
  especial: '#f0c0ff', oro: '#ffd700', plata: '#c8dde8', bronce: '#cd9a60', normal: '#8ab0cc',
};

// Mapeo inverso: interno → código JSON original
const DISP = { LAD:'LD', LAI:'LI', EXD:'ED', EXI:'EI', DEL:'DC' };
function displayPos(pos) {
  if (Array.isArray(pos)) return pos.map(p => DISP[p] || p).join('/');
  return String(pos).split('/').map(p => DISP[p.trim()] || p.trim()).join('/');
}

// Solo DiceBear para mundiales; liga/premier → foto ESPN o silhouette
function usePlayerPhoto(nombre, liga, equipoNombre) {
  const isMundial = liga === 'mundial';

  const initSrc = () => {
    if (isMundial) return getDiceBearUrl(nombre);
    const cached = getCachedPhoto(nombre, equipoNombre);
    return cached != null ? cached : null;
  };

  const [src, setSrc] = useState(initSrc);
  const isReal = Boolean(src && !src.includes('dicebear'));

  useEffect(() => {
    if (!nombre || isMundial) return;
    const cached = getCachedPhoto(nombre, equipoNombre);
    if (cached !== undefined) { setSrc(cached); return; }
    let cancelled = false;
    getPhotoUrl(nombre, liga, equipoNombre).then(url => { if (!cancelled) setSrc(url ?? null); });
    return () => { cancelled = true; };
  }, [nombre, liga, equipoNombre]);

  return { src, isReal };
}

// Área de foto: img real, DiceBear (mundiales) o vacío (sin foto)
function FotoArea({ src, isReal, nombre, posColor, borde, size = 64, rounded = true }) {
  const [err, setErr] = useState(false);
  const hasPhoto = Boolean(src && !err);
  const radius = rounded ? (isReal ? '8px' : '50%') : '6px';

  return (
    <div
      className={`overflow-hidden flex-shrink-0 ${hasPhoto ? 'shadow-lg' : ''}`}
      style={hasPhoto
        ? { width: size, height: size, borderRadius: radius, background: posColor + '22', border: `2px solid ${borde}70` }
        : { width: size, height: size }
      }
    >
      {hasPhoto && (
        <img
          src={src}
          alt={nombre}
          className="w-full h-full object-cover"
          style={isReal ? { objectPosition: 'center 15%' } : {}}
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
}

export default function PlayerCard({
  jugador,
  small = false,
  selected = false,
  onClick,
  yaEnAlineacion = false,
}) {
  const { logoUrl, onImgErr } = useTeamLogo(jugador?.equipoId, jugador?.equipoNombre);
  if (!jugador) return null;

  const rareza  = jugador.rareza || 'normal';
  const media   = jugador.mediaFinal ?? jugador.media ?? 80;
  // nombre base (sin suffix de upgrade), nombreMostrado para el label de upgrade
  const nombre     = jugador.nombre || 'Jugador';
  const esUpgrade  = jugador.esUpgrade && jugador.mediaFinal !== jugador.media;
  const rawPos  = jugador.pos || '?';
  let posDisplay = '', mainPos = '';
  if (Array.isArray(rawPos)) {
    posDisplay = displayPos(rawPos); mainPos = rawPos[0] || '?';
  } else {
    posDisplay = displayPos(rawPos); mainPos = String(rawPos).split(/[\/,]/)[0]?.trim() || '?';
  }

  const equipo     = jugador.equipoNombre || jugador.equipo || '';
  const liga       = jugador.liga || '';
  const posColor   = getColorPosicion(mainPos);
  const fondo      = RAREZA_FONDO[rareza]      || RAREZA_FONDO.normal;
  const cabecera   = RAREZA_CABECERA[rareza]   || RAREZA_CABECERA.normal;
  const borde      = RAREZA_BORDE[rareza]      || RAREZA_BORDE.normal;
  const mediaColor = RAREZA_MEDIA_COLOR[rareza] || RAREZA_MEDIA_COLOR.normal;

  const { src: fotoSrc, isReal } = usePlayerPhoto(nombre, liga, equipo);

  // ── Versión compacta ────────────────────────────────────────────────────────
  if (small) {
    return (
      <div
        onClick={!yaEnAlineacion ? onClick : undefined}
        className={`relative rounded-lg overflow-hidden select-none transition-all duration-200 card-shine
          ${!yaEnAlineacion && onClick ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : ''}
          ${selected ? 'ring-2 ring-yellow-400 scale-110' : ''}
          ${yaEnAlineacion ? 'opacity-35 grayscale' : ''}`}
        style={{ width: 70, minHeight: 92, background: fondo, border: `1.5px solid ${borde}` }}
      >
        {yaEnAlineacion && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <i className="fas fa-lock text-white/60 text-sm"></i>
          </div>
        )}
        {jugador.esEspecial && (
          <div className="absolute top-0.5 right-0.5 text-yellow-400 text-xs leading-none z-10">
            <i className="fas fa-star"></i>
          </div>
        )}
        <div className="px-1.5 py-1 flex items-center justify-between" style={{ background: cabecera }}>
          <span className="font-black text-sm leading-none" style={{ color: mediaColor }}>{media}</span>
          <span className="text-white/80 font-bold text-xs" title={posDisplay}>{posDisplay}</span>
        </div>
        <div className="flex flex-col items-center py-1 gap-0.5">
          <FotoArea src={fotoSrc} isReal={isReal} nombre={nombre} posColor={posColor} borde={borde} size={36} />
          <span className="text-white text-xs font-semibold px-1 truncate w-full text-center leading-tight">
            {nombre.split(' ').pop()}
          </span>
        </div>
      </div>
    );
  }

  // ── Versión completa ────────────────────────────────────────────────────────
  const partes     = nombre.split(' ');
  const apellido   = partes.length > 1 ? partes[partes.length - 1] : nombre;
  const nombrePila = partes.length > 1 ? partes.slice(0, -1).join(' ') : '';

  return (
    <div className="relative flex flex-col items-center">
      {/* Legendario */}
      {jugador.esEspecial && !small && (
        <div className="absolute -top-3 z-30 flex justify-center pointer-events-none">
          <span className="text-black font-black text-[10px] px-2 py-0.5 rounded shadow-sm border border-yellow-600"
            style={{ background: 'linear-gradient(90deg, #ffd700, #ffaa00)' }}>
            <i className="fas fa-star mr-1"></i>LEGENDARIO
          </span>
        </div>
      )}

      <div
        onClick={!yaEnAlineacion ? onClick : undefined}
        className={`relative rounded-xl overflow-hidden select-none transition-all duration-200 card-shine
          ${!yaEnAlineacion && onClick ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : ''}
          ${selected ? 'ring-2 ring-yellow-400 scale-105 shadow-xl shadow-yellow-400/40' : ''}
          ${yaEnAlineacion ? 'opacity-30 grayscale pointer-events-none' : ''}`}
        style={{ width: 130, minHeight: 196, background: fondo, border: `2px solid ${borde}` }}
      >
        {/* Badge "YA TIENES" */}
        {yaEnAlineacion && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-black/70 rounded-lg px-2 py-1 text-center">
              <i className="fas fa-check-circle text-green-400 text-lg block mb-0.5"></i>
              <span className="text-white text-xs font-bold">YA TIENES</span>
            </div>
          </div>
        )}

        {/* Upgrade */}
        {esUpgrade && !jugador.esEspecial && (
          <div className="absolute top-0 right-0 z-10">
            <span className="text-white text-xs font-bold px-1.5 py-0.5 rounded-bl-lg"
              style={{ background: 'linear-gradient(135deg, #0055ff, #00aaff)' }}>
              <i className="fas fa-arrow-up"></i> UP
            </span>
          </div>
        )}

      {/* Cabecera: rating + posición + escudo */}
      <div className="flex items-start justify-between px-2 pt-2 pb-1" style={{ background: cabecera }}>
        <div>
          <div className="font-black text-2xl leading-none" style={{ color: mediaColor }}>{media}</div>
          <div className="font-bold text-xs leading-none mt-0.5 text-white/70" title={posDisplay}>{posDisplay}</div>
        </div>
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt={equipo} className="w-9 h-9 object-contain drop-shadow-lg"
              onError={onImgErr} />
          ) : (
            <span className="text-white/50 text-xs font-bold">{(equipo || '??').slice(0, 3).toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Foto */}
      <div className="flex items-center justify-center py-1.5 px-2">
        <FotoArea src={fotoSrc} isReal={isReal} nombre={nombre} posColor={posColor} borde={borde} size={64} />
      </div>

      {/* Footer: nombre + equipo */}
      <div className="px-2 pb-2 text-center">
        <div className="font-black text-sm text-white leading-tight truncate uppercase tracking-wide" title={nombre}>
          {apellido}
        </div>
        {nombrePila && (
          <div className="text-xs text-white/50 leading-tight truncate">{nombrePila}</div>
        )}
        <div className="mt-0.5 text-[11px] truncate font-semibold text-white/90 uppercase tracking-wider shadow-black drop-shadow-sm">
          {equipo}
        </div>
      </div>
    </div>
    </div>
  );
}
