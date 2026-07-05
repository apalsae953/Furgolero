// Editor de alineación — campo VERTICAL con drag & drop
import { useState, useEffect, useRef } from 'react';
import {
  FORMACIONES, calcularMediaEfectiva, calcularPenalizacion,
  calcularQuimicaEquipo, calcularMediaEquipo, getColorPosicion, matchesPosicion,
} from '../utils/chemistry.js';
import { getPhotoUrl, getCachedPhoto, getDiceBearUrl } from '../utils/playerPhotos.js';

// Mapeo inverso para display (LD/LI/ED/EI/DC)
const DISP = { LAD:'LD', LAI:'LI', EXD:'ED', EXI:'EI', DEL:'DC' };
function displayPos(pos) {
  if (Array.isArray(pos)) return pos.map(p => DISP[p] || p).join('/');
  return String(pos).split('/').map(p => DISP[p.trim()] || p.trim()).join('/');
}

// Dimensiones campo portrait
const FW = 400, FH = 600;

// Coordenadas portrait: x→left, y→top (igual que MiniCampo del draft)
function slotFrac(slot) {
  return { x: 1 - slot.y, y: 1 - slot.x };
}

function usePhotos(jugadores) {
  const [fotos, setFotos] = useState({});
  const loaded = useRef(new Set());

  useEffect(() => {
    jugadores.forEach(j => {
      if (!j) return;
      const nombre = j.nombre;
      const equipo = j.equipoNombre || '';
      const loadKey = `${nombre}__${equipo}`;
      if (!nombre || loaded.current.has(loadKey)) return;
      loaded.current.add(loadKey);
      const cached = getCachedPhoto(nombre, equipo);
      if (cached !== undefined) {
        setFotos(prev => ({ ...prev, [nombre]: cached }));
        return;
      }
      getPhotoUrl(nombre, j.liga, equipo).then(url => {
        setFotos(prev => ({ ...prev, [nombre]: url || null }));
      });
    });
  }, [jugadores]);

  return (j) => {
    if (!j) return null;
    if (j.liga === 'mundial') return getDiceBearUrl(j.nombre);
    return fotos[j.nombre] || null;
  };
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

function autoAsignar(jugs, formNombre) {
  const slots = FORMACIONES[formNombre].posiciones;
  const asig = {};
  const usados = new Set();
  // Primera pasada: posición exacta o compatible
  slots.forEach(slot => {
    const idx = jugs.findIndex((j, i) => !usados.has(i) && matchesPosicion(j.pos, slot.pos));
    if (idx !== -1) { asig[slot.slot] = jugs[idx]; usados.add(idx); }
  });
  // Segunda pasada: sobrantes en slots libres
  slots.forEach(slot => {
    if (asig[slot.slot] !== undefined) return;
    const idx = jugs.findIndex((_, i) => !usados.has(i));
    if (idx !== -1) { asig[slot.slot] = jugs[idx]; usados.add(idx); }
  });
  return asig;
}

// Círculo de jugador en el campo
function JugadorCirculo({ jugador, foto, size = 54, isDragging = false, media = null, pen = 0 }) {
  const nombre = (jugador?.nombre || '').replace(/\s*\(\d+\)\s*$/, '').trim();
  const apellido = nombre.split(' ').pop();
  const mediaColor = pen < -8 ? '#ef4444' : pen < -3 ? '#fbbf24' : '#4ade80';
  const posColor = getColorPosicion(Array.isArray(jugador?.pos) ? jugador.pos[0] : jugador?.pos);

  return (
    <div className="flex flex-col items-center" style={{ gap: 2 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <div
          className={`rounded-full overflow-hidden ${foto ? 'shadow-xl' : ''}`}
          style={foto ? {
            width: size, height: size,
            background: jugador?.color || (posColor + '88'),
            border: isDragging
              ? '3px solid #ffd700'
              : '2.5px solid rgba(255,255,255,0.80)',
          } : {
            width: size, height: size,
          }}
        >
          {foto && (
            <img
              src={foto}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
        {/* Badge media — fuera del overflow:hidden */}
        {media !== null && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            background: 'rgba(0,0,0,0.90)', color: mediaColor,
            fontSize: Math.max(7, size * 0.145), fontWeight: 900, lineHeight: 1,
            padding: '2px 3px', borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.15)', zIndex: 5,
          }}>
            {media}
          </div>
        )}
      </div>
      <div style={{
        fontSize: Math.max(7.5, size * 0.16), lineHeight: 1.2, maxWidth: size + 12,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        color: '#fff', fontWeight: 700,
        textShadow: '0 1px 4px #000, 0 0 8px #000',
        background: 'rgba(0,0,0,0.55)', padding: '1px 4px', borderRadius: 3,
      }}>
        {apellido}
      </div>
    </div>
  );
}

export default function LineupEditor({ jugadores, asignacionesIniciales, formacionInicial, onConfirmar, onVolver }) {
  const getPhoto = usePhotos(jugadores);
  const [formacion, setFormacion] = useState(formacionInicial || '4-3-3');
  const [asignaciones, setAsignaciones] = useState(() => {
    if (asignacionesIniciales && Object.keys(asignacionesIniciales).length > 0) {
      return asignacionesIniciales;
    }
    return autoAsignar(jugadores, formacionInicial || '4-3-3');
  });
  const [draggingSlot, setDraggingSlot] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0.5, y: 0.5 });
  const fieldRef = useRef(null);
  const s = useFieldScale(fieldRef, FW);

  const form = FORMACIONES[formacion];

  function cambiarFormacion(nuevaForm) {
    setFormacion(nuevaForm);
    const jugs = Object.values(asignaciones).filter(Boolean);
    setAsignaciones(autoAsignar(jugs, nuevaForm));
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────────
  function fieldFrac(e) {
    const touch = e.touches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0.5, y: 0.5 };
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  }

  function nearestSlot(frac) {
    let best = null, bestD = Infinity;
    form.posiciones.forEach(slot => {
      const sf = slotFrac(slot);
      const d = Math.hypot(frac.x - sf.x, frac.y - sf.y);
      if (d < bestD) { bestD = d; best = slot.slot; }
    });
    return best;
  }

  function swap(from, to) {
    if (from === to) return;
    setAsignaciones(prev => {
      const next = { ...prev };
      const fromJ = next[from];
      const toJ = next[to];
      if (toJ !== undefined) next[from] = toJ; else delete next[from];
      next[to] = fromJ;
      return next;
    });
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
    swap(draggingSlot, nearestSlot(fieldFrac(e)));
    setDraggingSlot(null);
  }
  function onTouchStart(e, slotIdx) {
    if (!asignaciones[slotIdx]) return;
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
    swap(draggingSlot, nearestSlot(fieldFrac(e)));
    setDraggingSlot(null);
  }

  // ── Cálculos ─────────────────────────────────────────────────────────────────
  const alineacionCalc = form.posiciones.map(slot => ({
    jugador: asignaciones[slot.slot],
    posFormacion: slot.pos,
  })).filter(item => item.jugador);
  const mediaEquipo  = calcularMediaEquipo(alineacionCalc);
  const quimicaEquipo = calcularQuimicaEquipo(alineacionCalc);

  function confirmar() {
    const alineacion = form.posiciones.map(slot => ({
      jugador: asignaciones[slot.slot],
      posFormacion: slot.pos,
      slot: slot.slot,
    }));
    onConfirmar(alineacion, formacion, mediaEquipo, quimicaEquipo);
  }

  const draggingPlayer = draggingSlot !== null ? asignaciones[draggingSlot] : null;

  return (
    <div className="min-h-screen px-3 sm:px-4 py-5 sm:py-6 max-w-6xl mx-auto">
      <button onClick={onVolver} className="text-gray-400 hover:text-white mb-3 sm:mb-4 text-xs sm:text-sm flex items-center gap-1">
        ← Volver al Draft
      </button>
      <h1 className="text-xl sm:text-3xl font-black text-white mb-1">Ordenar Alineación</h1>
      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        Arrastra los jugadores para cambiarlos de posición.
      </p>

      {/* Formaciones */}
      <div className="flex gap-1.5 sm:gap-2 mb-5 sm:mb-6 flex-wrap">
        {Object.keys(FORMACIONES).map(f => (
          <button key={f} onClick={() => cambiarFormacion(f)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${
              formacion === f ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">

        {/* ══ CAMPO VERTICAL ══════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div
            ref={fieldRef}
            className="relative rounded-2xl overflow-hidden select-none w-full max-w-[400px] mx-auto"
            style={{
              aspectRatio: `${FW} / ${FH}`,
              background: 'linear-gradient(180deg, #145c18 0%, #1a7020 25%, #1e7a25 50%, #1a7020 75%, #145c18 100%)',
              cursor: draggingSlot !== null ? 'grabbing' : 'default',
              touchAction: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Líneas del campo */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full" viewBox={`0 0 ${FW} ${FH}`}>
              {/* Franjas de hierba */}
              {[...Array(7)].map((_, i) => (
                <rect key={i} x="0" y={i*(FH/7)} width={FW} height={FH/14} fill="rgba(0,0,0,0.04)"/>
              ))}
              {/* Borde exterior */}
              <rect x="12" y="12" width={FW-24} height={FH-24} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
              {/* Línea de medio campo */}
              <line x1="12" y1={FH/2} x2={FW-12} y2={FH/2} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
              {/* Círculo central */}
              <circle cx={FW/2} cy={FH/2} r="55" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2"/>
              <circle cx={FW/2} cy={FH/2} r="3.5" fill="rgba(255,255,255,0.5)"/>
              {/* Área superior (rival) */}
              <rect x={FW*0.16} y="12" width={FW*0.68} height={FH*0.18} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>
              <rect x={FW*0.32} y="12" width={FW*0.36} height={FH*0.085} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8"/>
              <rect x={FW*0.37} y="4" width={FW*0.26} height="11" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
              <circle cx={FW/2} cy={FH*0.135} r="3" fill="rgba(255,255,255,0.35)"/>
              {/* Área inferior (tuya) */}
              <rect x={FW*0.16} y={FH-12-FH*0.18} width={FW*0.68} height={FH*0.18} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>
              <rect x={FW*0.32} y={FH-12-FH*0.085} width={FW*0.36} height={FH*0.085} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8"/>
              <rect x={FW*0.37} y={FH-15} width={FW*0.26} height="11" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
              <circle cx={FW/2} cy={FH*0.865} r="3" fill="rgba(255,255,255,0.35)"/>
            </svg>

            {/* Slots de jugadores */}
            {form.posiciones.map(slot => {
              const sf = slotFrac(slot);
              const jugador = asignaciones[slot.slot];
              const isDragged = slot.slot === draggingSlot;
              const media = jugador ? calcularMediaEfectiva(jugador, slot.pos) : null;
              const pen   = jugador ? calcularPenalizacion(jugador.pos, slot.pos) : 0;
              const foto  = jugador ? getPhoto(jugador) : null;

              return (
                <div
                  key={slot.slot}
                  className="absolute"
                  style={{
                    left: `${sf.x * 100}%`,
                    top:  `${sf.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isDragged ? 1 : 10,
                    opacity: isDragged ? 0.2 : 1,
                    cursor: jugador ? 'grab' : 'default',
                  }}
                  onMouseDown={jugador ? e => onMouseDown(e, slot.slot) : undefined}
                  onTouchStart={jugador ? e => onTouchStart(e, slot.slot) : undefined}
                >
                  {jugador ? (
                    <JugadorCirculo
                      jugador={jugador}
                      foto={foto}
                      size={Math.round(54 * s)}
                      pen={pen}
                      media={media}
                    />
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
                        <span style={{ fontSize: Math.max(7, 8 * s), color: getColorPosicion(slot.pos), fontWeight: 700 }}>
                          {displayPos(slot.pos)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Fantasma mientras se arrastra */}
            {draggingPlayer && (
              <div
                style={{
                  position: 'absolute',
                  left: `${dragPos.x * 100}%`,
                  top:  `${dragPos.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 50,
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.9))',
                }}
              >
                <JugadorCirculo
                  jugador={draggingPlayer}
                  foto={getPhoto(draggingPlayer)}
                  size={Math.round(62 * s)}
                  isDragging
                />
              </div>
            )}

            {/* Hint */}
            {draggingSlot === null && Object.keys(asignaciones).length > 0 && (
              <div style={{
                position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.45)',
                fontSize: Math.max(7.5, 9 * s), padding: '2px 10px', borderRadius: 8, pointerEvents: 'none',
              }}>
                Arrastra para mover
              </div>
            )}
          </div>
        </div>

        {/* ══ PANEL LATERAL ═══════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Estadísticas */}
          <div className="rounded-xl p-4" style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}>
            <h3 className="text-white font-bold mb-3">Estadísticas</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Media equipo</span>
                  <span className="text-white font-bold">{mediaEquipo}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#1e2d3d' }}>
                  <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${mediaEquipo}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Química</span>
                  <span className="text-white font-bold">{quimicaEquipo}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#1e2d3d' }}>
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${quimicaEquipo}%`,
                    background: quimicaEquipo > 70 ? '#22c55e' : quimicaEquipo > 40 ? '#eab308' : '#ef4444',
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Lista jugadores con posiciones alternativas */}
          <div className="rounded-xl p-4" style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}>
            <h3 className="text-white font-bold mb-3 text-sm">Jugadores</h3>
            <div className="space-y-1">
              {form.posiciones.map(slot => {
                const jugador = asignaciones[slot.slot];
                const media = jugador ? calcularMediaEfectiva(jugador, slot.pos) : null;
                const pen   = jugador ? calcularPenalizacion(jugador.pos, slot.pos) : 0;
                const posArr = jugador ? (Array.isArray(jugador.pos) ? jugador.pos : [jugador.pos]) : [];
                const alts   = posArr.slice(1).map(p => displayPos(p));

                return (
                  <div key={slot.slot}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs"
                    style={{ background: '#0a1220', border: '1px solid #1a2535' }}
                  >
                    <span className="font-black flex-shrink-0 px-1.5 py-0.5 rounded"
                      style={{ background: getColorPosicion(slot.pos), color: '#fff', fontSize: 9, minWidth: 28, textAlign: 'center' }}>
                      {displayPos(slot.pos)}
                    </span>
                    {jugador ? (
                      <>
                        <span className="text-white truncate flex-1 font-medium">{jugador.nombre}</span>
                        {alts.length > 0 && (
                          <span className="flex gap-0.5 flex-shrink-0">
                            {alts.map((a, ai) => (
                              <span key={ai} style={{ background: '#1e2d3d', color: '#6b7280', fontSize: 8, padding: '1px 4px', borderRadius: 3 }}>
                                {a}
                              </span>
                            ))}
                          </span>
                        )}
                        {pen < -3 && (
                          <span className="flex-shrink-0 font-bold" style={{ color: pen < -8 ? '#ef4444' : '#fbbf24' }}>
                            {pen}
                          </span>
                        )}
                        <span className="font-bold flex-shrink-0"
                          style={{ color: pen < -8 ? '#ef4444' : pen < -3 ? '#fbbf24' : '#4ade80' }}>
                          {media}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600">— vacío —</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={confirmar} className="btn-dorado w-full text-lg py-3">
            Jugar Torneo →
          </button>
        </div>
      </div>
    </div>
  );
}
