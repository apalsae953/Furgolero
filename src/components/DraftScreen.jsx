import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sortearEquipo, sortearJugadoresEquipo } from '../utils/draftEngine.js';
import {
  POSICIONES, FORMACIONES, calcularMediaEfectiva, calcularPenalizacion,
  calcularQuimicaEquipo, calcularMediaEquipo, getColorPosicion, matchesPosicion
} from '../utils/chemistry.js';
import { getCachedPhoto, getDiceBearUrl } from '../utils/playerPhotos.js';
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
import PlayerCard from './PlayerCard.jsx';

// ─── Foto en el campo: real solo para liga/premier, avatar para mundial ───────
function fotoJugadorCampo(jugador) {
  if (!jugador) return null;
  const liga = jugador.liga;
  if (liga === 'mundial') return getDiceBearUrl(jugador.nombre);
  const c = getCachedPhoto(jugador.nombre, jugador.equipoNombre);
  return c != null ? c : null; // null = sin foto
}

// ─── Círculo de jugador reutilizable ─────────────────────────────────────────
function JugadorCirculo({ jugador, size = 46, isDragging = false, pen = 0 }) {
  const foto = fotoJugadorCampo(jugador);
  const nombre = (jugador?.nombre || '').replace(/\s*\(\d+\)\s*$/, '').trim();
  const apellido = nombre.split(' ').pop();
  const media = jugador?.mediaFinal ?? jugador?.media;
  const mediaColor = pen < -8 ? '#ef4444' : pen < -3 ? '#fbbf24' : '#4ade80';

  return (
    <div className="flex flex-col items-center" style={{ gap: 2 }}>
      {/* Wrapper relativo para posicionar el badge fuera del círculo */}
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <div
          className={`rounded-full overflow-hidden ${foto ? 'shadow-lg' : ''}`}
          style={foto ? {
            width: size,
            height: size,
            background: jugador?.color || '#3b82f6',
            border: isDragging ? '2.5px solid #ffd700' : '2.5px solid rgba(255,255,255,0.75)',
          } : {
            width: size,
            height: size,
            background: 'rgba(255,255,255,0.85)',
            border: isDragging ? '2.5px solid #ffd700' : '2.5px solid rgba(255,255,255,0.4)',
          }}
        >
          {foto && (
            <img
              src={foto}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
        {/* Badge fuera del clip circular */}
        {media && (
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              background: 'rgba(0,0,0,0.88)',
              color: mediaColor,
              fontSize: Math.max(7, size * 0.145),
              fontWeight: 900,
              lineHeight: 1,
              padding: '2px 3px',
              borderRadius: 3,
              border: '1px solid rgba(255,215,0,0.4)',
              zIndex: 5,
            }}
          >
            {media}
          </div>
        )}
      </div>
      <div
        className="text-white font-bold text-center rounded"
        style={{
          fontSize: Math.max(7.5, size * 0.16),
          lineHeight: 1.15,
          maxWidth: size + 10,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 3px #000, 0 0 6px #000',
          background: 'rgba(0,0,0,0.50)',
          padding: '1px 3px',
          borderRadius: 3,
        }}
      >
        {apellido}
      </div>
    </div>
  );
}

// Mapeo inverso para display (mismo que PlayerCard)
const DISP = { LAD:'LD', LAI:'LI', EXD:'ED', EXI:'EI', DEL:'DC' };
function displayPos(pos) {
  if (Array.isArray(pos)) return pos.map(p => DISP[p] || p).join('/');
  return String(pos).split('/').map(p => DISP[p.trim()] || p.trim()).join('/');
}

// ─── Escala fluida: ajusta tamaños de elementos al ancho real del campo ───────
function useFieldScale(ref, baseWidth) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width;
      if (w) setScale(Math.min(1, Math.max(0.72, w / baseWidth)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, baseWidth]);
  return scale;
}

// ─── Campo mini (portrait) con drag & drop entre slots ───────────────────────
function MiniCampo({ asignaciones, setAsignaciones, formacion }) {
  const form = FORMACIONES[formacion];
  const fieldRef = useRef(null);
  const [draggingSlot, setDraggingSlot] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0.5, y: 0.5 });
  const W = 440, H = 580;
  const s = useFieldScale(fieldRef, W);

  function fieldFrac(e) {
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0.5, y: 0.5 };
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top)  / rect.height)),
    };
  }

  // En portrait: slot.x→vertical invertido, slot.y→horizontal invertido
  function slotFrac(slot) {
    return { x: 1 - slot.y, y: 1 - slot.x };
  }

  function nearestSlotTo(frac) {
    let best = null, bestD = Infinity;
    form.posiciones.forEach(slot => {
      const sf = slotFrac(slot);
      const d = Math.hypot(frac.x - sf.x, frac.y - sf.y);
      if (d < bestD) { bestD = d; best = slot.slot; }
    });
    return best;
  }

  function onMouseDown(e, slotIdx) {
    if (!asignaciones[slotIdx]) return;
    e.preventDefault();
    setDraggingSlot(slotIdx);
    setDragPos(fieldFrac(e));
  }

  function onMouseMove(e) {
    if (draggingSlot === null) return;
    e.preventDefault();
    setDragPos(fieldFrac(e));
  }

  function onMouseUp(e) {
    if (draggingSlot === null) return;
    const frac = fieldFrac(e);
    const target = nearestSlotTo(frac);
    if (target !== null && target !== draggingSlot) {
      setAsignaciones(prev => {
        const next = { ...prev };
        const fromP = next[draggingSlot];
        const toP   = next[target];
        if (toP !== undefined) next[draggingSlot] = toP;
        else delete next[draggingSlot];
        next[target] = fromP;
        return next;
      });
    }
    setDraggingSlot(null);
  }

  function onTouchStart(e, slotIdx) {
    if (!asignaciones[slotIdx]) return;
    e.preventDefault();
    setDraggingSlot(slotIdx);
    setDragPos(fieldFrac(e));
  }

  function onTouchMove(e) {
    if (draggingSlot === null) return;
    e.preventDefault();
    setDragPos(fieldFrac(e));
  }

  function onTouchEnd(e) {
    if (draggingSlot === null) return;
    const frac = fieldFrac(e);
    const target = nearestSlotTo(frac);
    if (target !== null && target !== draggingSlot) {
      setAsignaciones(prev => {
        const next = { ...prev };
        const fromP = next[draggingSlot];
        const toP   = next[target];
        if (toP !== undefined) next[draggingSlot] = toP;
        else delete next[draggingSlot];
        next[target] = fromP;
        return next;
      });
    }
    setDraggingSlot(null);
  }

  if (!form) return null;
  const draggingPlayer = draggingSlot !== null ? asignaciones[draggingSlot] : null;

  return (
    <div
      ref={fieldRef}
      className="relative rounded-xl overflow-hidden select-none w-full max-w-[440px] mx-auto"
      style={{
        aspectRatio: `${W} / ${H}`,
        background: 'linear-gradient(180deg, #145c18 0%, #1a7020 30%, #1e7a25 50%, #1a7020 70%, #145c18 100%)',
        cursor: draggingSlot !== null ? 'grabbing' : 'default',
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Líneas del campo */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full" viewBox={`0 0 ${W} ${H}`}>
        {/* Franjas */}
        {[...Array(6)].map((_, i) => (
          <rect key={i} x="0" y={i*(H/6)} width={W} height={H/12} fill="rgba(0,0,0,0.04)"/>
        ))}
        <rect x="10" y="10" width={W-20} height={H-20} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
        <line x1="10" y1={H/2} x2={W-10} y2={H/2} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
        <circle cx={W/2} cy={H/2} r="40" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2"/>
        <circle cx={W/2} cy={H/2} r="3" fill="rgba(255,255,255,0.45)"/>
        {/* Área superior (rival) */}
        <rect x={W*0.18} y="10" width={W*0.64} height={H*0.20} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>
        <rect x={W*0.34} y="10" width={W*0.32} height={H*0.08} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8"/>
        {/* Área inferior (tuya) */}
        <rect x={W*0.18} y={H-10-H*0.20} width={W*0.64} height={H*0.20} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>
        <rect x={W*0.34} y={H-10-H*0.08} width={W*0.32} height={H*0.08} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8"/>
        <rect x={W*0.38} y={H-13} width={W*0.24} height="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.65)" strokeWidth="2"/>
        <circle cx={W/2} cy={H*0.86} r="2.5" fill="rgba(255,255,255,0.35)"/>
      </svg>

      {/* Slots */}
      {form.posiciones.map(slot => {
        const sf = slotFrac(slot);
        const jugador = asignaciones[slot.slot];
        const isBeingDragged = slot.slot === draggingSlot;
        const pen = jugador ? calcularPenalizacion(jugador.pos, slot.pos) : 0;

        return (
          <div
            key={slot.slot}
            className="absolute"
            style={{
              left: `${sf.x * 100}%`,
              top: `${sf.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isBeingDragged ? 1 : 10,
              opacity: isBeingDragged ? 0.25 : 1,
              cursor: jugador ? 'grab' : 'default',
              touchAction: jugador ? 'none' : 'auto',
            }}
            onMouseDown={jugador ? (e) => onMouseDown(e, slot.slot) : undefined}
            onTouchStart={jugador ? (e) => onTouchStart(e, slot.slot) : undefined}
          >
            {jugador ? (
              <JugadorCirculo jugador={jugador} size={Math.round(56 * s)} pen={pen} />
            ) : (
              <div className="flex flex-col items-center" style={{ gap: 2 }}>
                <div
                  className="rounded-full border border-dashed flex items-center justify-center"
                  style={{
                    width: Math.round(36 * s), height: Math.round(36 * s),
                    borderColor: 'rgba(255,255,255,0.28)',
                    background: 'rgba(0,0,0,0.22)',
                  }}
                >
                  <span style={{ fontSize: Math.max(6.5, 7.5 * s), color: getColorPosicion(slot.pos), textShadow: '0 1px 2px #000', fontWeight: 700 }}>
                    {displayPos(slot.pos)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Fantasma flotante mientras se arrastra */}
      {draggingPlayer && (
        <div
          style={{
            position: 'absolute',
            left: `${dragPos.x * 100}%`,
            top: `${dragPos.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))',
          }}
        >
          <JugadorCirculo jugador={draggingPlayer} size={Math.round(64 * s)} isDragging={true} />
        </div>
      )}

      {/* Hint drag */}
      {draggingSlot === null && Object.keys(asignaciones).length > 0 && (
        <div
          style={{
            position: 'absolute', bottom: 6, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.50)',
            color: 'rgba(255,255,255,0.50)',
            fontSize: Math.max(7.5, 9 * s), padding: '2px 8px', borderRadius: 8,
            pointerEvents: 'none',
          }}
        >
          Arrastra para mover
        </div>
      )}
    </div>
  );
}

// ─── Auto-asignar ─────────────────────────────────────────────────────────────
function autoAsignar(jugadores, formacion) {
  const slots = FORMACIONES[formacion].posiciones;
  const asig = {};
  const usados = new Set();
  slots.forEach(slot => {
    const idx = jugadores.findIndex((j, i) => !usados.has(i) && matchesPosicion(j.pos, slot.pos));
    if (idx !== -1) { asig[slot.slot] = jugadores[idx]; usados.add(idx); }
  });
  slots.forEach(slot => {
    if (asig[slot.slot]) return;
    const idx = jugadores.findIndex((_, i) => !usados.has(i));
    if (idx !== -1) { asig[slot.slot] = jugadores[idx]; usados.add(idx); }
  });
  return asig;
}

// ─── Pantalla principal del Draft ─────────────────────────────────────────────
export default function DraftScreen({
  modo,
  rerollsEquipo,
  rerollsJugador,
  onGastarRerollEquipo,
  onGastarRerollJugador,
  onCompletarAlineacion,
  cartasEspeciales,
}) {
  const [equipoActual, setEquipoActual] = useState(null);
  const [equiposUsados, setEquiposUsados] = useState([]);
  const [jugadoresOferta, setJugadoresOferta] = useState([]);
  const [alineacion, setAlineacion] = useState([]);
  const [asignaciones, setAsignaciones] = useState({});
  const [formacion, setFormacion] = useState('4-3-3');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const equipoRef = useRef(null);
  const sorteoIdRef = useRef(0);

  React.useEffect(() => { sortearNuevo([]); }, []);

  async function sortearNuevo(excluidos) {
    setCargando(true);
    const id = ++sorteoIdRef.current;
    const equipo = sortearEquipo(modo, excluidos);
    if (!equipo) { setMensaje('No quedan equipos disponibles.'); setCargando(false); return; }
    const jugadores = sortearJugadoresEquipo(equipo, cartasEspeciales);
    equipoRef.current = equipo;
    setEquipoActual(equipo);
    if (sorteoIdRef.current !== id) return;
    setJugadoresOferta(jugadores);
    setCargando(false);
  }

  function elegirJugador(jugador) {
    const equipo = equipoRef.current;
    if (!equipo || alineacion.some(j => j.id === jugador.id) || alineacion.length >= 11) return;
    const conEquipo = {
      ...jugador,
      equipoId: equipo.id,
      equipoNombre: equipo.nombre,
      color: equipo.color,
      colorSecundario: equipo.colorSecundario,
      liga: equipo.liga || modo,
    };
    const nuevaAlin = [...alineacion, conEquipo];
    setAlineacion(nuevaAlin);

    // Solo asigna el NUEVO jugador a un slot libre — preserva los drag & drop previos
    // Prioriza posición principal, luego secundarias en orden, luego cualquier hueco de campo
    setAsignaciones(prev => {
      const form = FORMACIONES[formacion];
      if (!form) return prev;
      const slotsOcupados = new Set(Object.keys(prev).map(Number));

      // Obtener las posiciones del jugador en orden (primaria primero)
      const jugadorPosiciones = Array.isArray(conEquipo.pos)
        ? conEquipo.pos
        : [conEquipo.pos];

      // 1) Buscar slot vacío para cada posición del jugador, en orden de prioridad
      let libre = null;
      for (const pos of jugadorPosiciones) {
        if (libre !== null) break;
        for (const s of form.posiciones) {
          if (!slotsOcupados.has(s.slot) && matchesPosicion([pos], s.pos)) {
            libre = s.slot;
            break;
          }
        }
      }

      // 2) Si ninguna posición natural encaja, buscar cualquier slot vacío (evitando POR si no es portero)
      if (libre === null) {
        const isPor = jugadorPosiciones.some(p => p === 'POR');
        let primerLibre = null;
        for (const s of form.posiciones) {
          if (!slotsOcupados.has(s.slot)) {
            if (primerLibre === null) primerLibre = s.slot;
            if (!isPor && s.pos !== 'POR') { libre = s.slot; break; }
          }
        }
        if (libre === null) libre = primerLibre;
      }

      return libre !== null ? { ...prev, [libre]: conEquipo } : prev;
    });

    setMensaje('');
    if (nuevaAlin.length < 11) {
      // Permitimos repetir equipos en el draft
      sortearNuevo([]);
    }
  }

  function cambiarEquipo() {
    if (rerollsEquipo <= 0) { setMensaje('Sin rerolls de equipo.'); return; }
    onGastarRerollEquipo();
    // Permitimos repetir equipos en el draft
    sortearNuevo([]);
    setMensaje('');
  }

  async function rerollJugadores() {
    if (rerollsJugador <= 0) { setMensaje('Sin rerolls de jugadores.'); return; }
    onGastarRerollJugador();
    if (!equipoRef.current) return;
    const id = ++sorteoIdRef.current;
    setCargando(true);
    const jugadores = sortearJugadoresEquipo(equipoRef.current, cartasEspeciales);
    if (sorteoIdRef.current !== id) return;
    setJugadoresOferta(jugadores);
    setMensaje('');
    setCargando(false);
  }

  function cambiarFormacion(nuevaForm) {
    setFormacion(nuevaForm);
    setAsignaciones(autoAsignar(alineacion, nuevaForm));
  }

  function completar() {
    if (alineacion.length < 11) { setMensaje('Necesitas 11 jugadores para continuar.'); return; }
    onCompletarAlineacion(alineacion, equipoRef.current, asignaciones, formacion);
  }

  const nombreModo = { mundial: 'Mundiales', premier: 'Premier League', laliga: 'La Liga' }[modo] || modo;
  const { logoUrl, onImgErr } = useTeamLogo(equipoActual?.id, equipoActual?.nombre);
  const mediaMedia = alineacion.length > 0
    ? Math.round(alineacion.reduce((s, j) => s + (j.mediaFinal ?? j.media ?? 0), 0) / alineacion.length) : null;

  return (
    <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-5 max-w-screen-xl mx-auto">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 sm:gap-3">
        <h1 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
          <i className="fas fa-random text-green-400 text-sm sm:text-base"></i>
          Draft — <span className="text-green-400">{nombreModo}</span>
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5">
            {Object.keys(FORMACIONES).map(f => (
              <button key={f} onClick={() => cambiarFormacion(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  formacion === f ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}>{f}</button>
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <i className="fas fa-exchange-alt text-purple-400"></i>
            <span className="text-purple-300 font-bold">{rerollsEquipo}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <i className="fas fa-dice text-blue-400"></i>
            <span className="text-blue-300 font-bold">{rerollsJugador}</span>
          </span>
        </div>
      </div>

      {/* Barra progreso */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 rounded-full overflow-hidden" style={{ background: '#0f1923', height: 6 }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${(alineacion.length / 11) * 100}%`,
            background: alineacion.length >= 11
              ? 'linear-gradient(90deg, #ffd700, #ff8c00)'
              : 'linear-gradient(90deg, #22c55e, #16a34a)',
          }}/>
        </div>
        <span className="text-white font-black text-sm whitespace-nowrap">
          {alineacion.length}<span className="text-gray-600 font-normal">/11</span>
        </span>
      </div>

      {mensaje && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-2 mb-3 text-sm"
          style={{ background: '#1a0a0a', border: '1px solid #7a1a1a', color: '#ff6060' }}>
          <i className="fas fa-exclamation-triangle text-xs"></i> {mensaje}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ===== IZQUIERDA ===== */}
        <div className="flex-1 min-w-0">
          {/* Banner equipo */}
          {cargando ? (
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-3 animate-pulse"
              style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}>
              <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0"></div>
              <div className="flex-1"><div className="h-5 w-36 bg-gray-800 rounded mb-1.5"></div><div className="h-3 w-24 bg-gray-800 rounded"></div></div>
            </div>
          ) : equipoActual && (
            <div className="rounded-2xl p-3 sm:p-4 mb-4 flex items-center gap-2.5 sm:gap-3 flex-wrap"
              style={{ background: `linear-gradient(135deg, ${equipoActual.color}18, #0a1220)`, border: `1px solid ${equipoActual.color}35` }}>
              {logoUrl ? (
                <img src={logoUrl} alt={equipoActual.nombre} className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0 drop-shadow-lg" onError={onImgErr}/>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0"
                  style={{ background: equipoActual.color+'30', border: `2px solid ${equipoActual.color}60`, color: equipoActual.color }}>
                  {equipoActual.abrev}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-black text-base sm:text-xl leading-tight truncate">{equipoActual.nombre}</div>
                {equipoActual.anio && <div className="text-gray-400 text-xs sm:text-sm">{equipoActual.pais} · {equipoActual.anio}</div>}
              </div>
              <div className="flex gap-1.5 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
                <button onClick={rerollJugadores} disabled={rerollsJugador <= 0}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125 flex-1 sm:flex-none justify-center"
                  style={{ background: '#0a1535', border: '1px solid #1e3570', color: '#6090ff' }}>
                  <i className="fas fa-dice"></i> Barajar ({rerollsJugador})
                </button>
                <button onClick={cambiarEquipo} disabled={rerollsEquipo <= 0}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125 flex-1 sm:flex-none justify-center"
                  style={{ background: '#15082a', border: '1px solid #3a1570', color: '#aa60ff' }}>
                  <i className="fas fa-exchange-alt"></i> Equipo ({rerollsEquipo})
                </button>
              </div>
            </div>
          )}

          {alineacion.length < 11 && !cargando && (
            <p className="text-gray-600 text-xs mb-3">
              <i className="fas fa-hand-pointer mr-1 text-green-500"></i>
              Elige un jugador — aparecerá un equipo nuevo automáticamente
            </p>
          )}

          {/* Cartas */}
          {alineacion.length < 11 && (
            <div className="flex flex-wrap gap-3">
              {cargando
                ? [1,2,3,4,5].map(i => (
                    <div key={i} className="rounded-xl animate-pulse flex-shrink-0"
                      style={{ width: 130, height: 196, background: '#0f1923', border: '1px solid #1e2d3d' }}/>
                  ))
                : jugadoresOferta.map((j, idx) => {
                    const yaEnAlin = alineacion.some(a => a.id === j.id);
                    return (
                      <PlayerCard
                        key={`${j.id}_${idx}`}
                        jugador={{
                          ...j,
                          equipoId: equipoRef.current?.id,
                          equipoNombre: equipoRef.current?.nombre,
                          liga: equipoRef.current?.liga || modo,
                        }}
                        onClick={() => elegirJugador(j)}
                        yaEnAlineacion={yaEnAlin}
                      />
                    );
                  })
              }
            </div>
          )}

          {/* Completo */}
          {alineacion.length >= 11 && (
            <div className="text-center py-10">
              <div className="text-green-400 font-bold text-xl mb-2 flex items-center justify-center gap-2">
                <i className="fas fa-check-circle"></i> ¡Alineación completa!
              </div>
              <p className="text-gray-400 text-sm mb-6">Ahora ordena tus jugadores en el campo.</p>
              <button onClick={completar} className="btn-dorado text-xl px-12 py-4 flex items-center gap-3 mx-auto">
                <i className="fas fa-arrow-right"></i> Ordenar en el campo
              </button>
            </div>
          )}
        </div>

        {/* ===== DERECHA: campo grande + lista ===== */}
        <div className="w-full lg:w-[440px] flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
              <i className="fas fa-futbol text-green-500"></i> {formacion}
            </span>
            {mediaMedia !== null && (
              <span className="text-xs font-bold">
                Media <span className="text-white">{mediaMedia}</span>
              </span>
            )}
            <span className="text-gray-600 text-xs">{alineacion.length}/11</span>
          </div>

          <MiniCampo asignaciones={asignaciones} setAsignaciones={setAsignaciones} formacion={formacion} />

          {/* Lista de jugadores con posiciones */}
          {alineacion.length > 0 && (
            <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid #1e2d3d' }}>
              {alineacion.map((j, i) => {
                const posArr = Array.isArray(j.pos) ? j.pos : [j.pos];
                const mainP = displayPos(posArr[0]);
                const alts = posArr.slice(1).map(p => displayPos(p));
                const posColor = getColorPosicion(posArr[0]);
                const apellido = (j.nombre || '').replace(/\s*\(\d+\)\s*$/, '').split(' ').pop();
                return (
                  <div key={j.id || i}
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{ background: i % 2 === 0 ? '#0a1220' : '#0d1628', borderBottom: i < alineacion.length - 1 ? '1px solid #1a2535' : 'none' }}
                  >
                    <span className="font-black text-xs w-5 text-center flex-shrink-0"
                      style={{ color: posColor, textShadow: '0px 1px 2px rgba(0,0,0,0.8), 0px 0px 4px rgba(0,0,0,0.5)' }}>{mainP}</span>
                    <span className="text-white text-xs font-semibold truncate flex-1">{apellido}</span>
                    <span className="text-yellow-400 font-black text-xs flex-shrink-0">
                      {j.mediaFinal ?? j.media}
                    </span>
                    {alts.length > 0 && (
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {alts.map((a, ai) => (
                          <span key={ai} className="ml-1 px-1 rounded text-gray-400"
                            style={{ background: '#1a2535', fontSize: 9 }}>{a}</span>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
