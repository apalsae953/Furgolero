import React, { useRef, useEffect, useState } from 'react';

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function smooth(t) { return t * t * (3 - 2 * t); }

const wait = ms => new Promise(res => setTimeout(res, ms));

export default function PenaltyShootout({
  equipoLocal,
  equipoVisitante,
  colorLocal,
  colorVisitante,
  mediaLocal,
  mediaVisitante,
  onTerminar,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const estadoRef = useRef({
    tiempoMs: 0,
    estadoTiro: 'inicio', // inicio, esperando, carrera, tiro, resultado, fin
    tirador: { x: 0.70, y: 0.5 },
    portero: { x: 0.96, y: 0.5 },
    pelota: { x: 0.83, y: 0.5 },
    ballTrail: [],
    metaPelota: null,
    metaPortero: null,
    esGolActual: false,
    timerEfecto: 0,
  });

  const [ronda, setRonda] = useState(0); 
  const [turno, setTurno] = useState('local'); 
  const [historialLocal, setHistorialLocal] = useState([]);
  const [historialVisitante, setHistorialVisitante] = useState([]);
  const [marcador, setMarcador] = useState({ local: 0, visitante: 0 });
  const [mensaje, setMensaje] = useState('Tanda de Penaltis');

  const animandoRef = useRef(false);

  // Lógica principal de turnos
  useEffect(() => {
    if (animandoRef.current) return;
    animandoRef.current = true;
    iniciarTiro().finally(() => {
       animandoRef.current = false;
    });
  }, [ronda, turno]);

  async function iniciarTiro() {
    const s = estadoRef.current;
    if (s.estadoTiro === 'fin') return;

    // Reset posiciones
    s.tirador = { x: 0.65, y: 0.5 };
    s.portero = { x: 0.96, y: 0.5 }; // En la línea de gol
    s.pelota  = { x: 0.80, y: 0.5 };
    s.ballTrail = [];
    s.timerEfecto = 0;
    
    setMensaje(`Lanza ${turno === 'local' ? equipoLocal : equipoVisitante}`);
    s.estadoTiro = 'esperando';
    await wait(1500);

    // Calcular resultado del tiro
    const mediaTirador = turno === 'local' ? mediaLocal : mediaVisitante;
    const mediaPortero = turno === 'local' ? mediaVisitante : mediaLocal;
    let probGol = 0.75 + (mediaTirador - mediaPortero) * 0.005;
    probGol = Math.max(0.4, Math.min(0.95, probGol)); 
    
    const esGol = Math.random() < probGol;
    s.esGolActual = esGol;

    // Destino del tiro
    let hitY;
    if (esGol) {
      hitY = 0.5 + (Math.random() * 0.22 - 0.11); // Tiros ajustados
      s.metaPelota = { x: 0.98, y: hitY }; // Entra a la portería
      const diveY = Math.random() < 0.3 ? 0.5 : (hitY > 0.5 ? 0.35 : 0.65);
      s.metaPortero = { x: 0.96, y: diveY }; // Se tira sobre la línea de 0.96
    } else {
      hitY = Math.random() < 0.5 ? 0.40 : 0.60;
      s.metaPelota = { x: 0.95, y: hitY }; // El balón se para frente al portero
      s.metaPortero = { x: 0.96, y: hitY }; // El portero vuela a por el balón
    }

    // Comienza carrera
    s.estadoTiro = 'carrera';
    setMensaje('¡Dispara!');
    
    // El motor 2D detectará el choque con el balón y pasará a 'tiro'
    // Esperamos a que termine la animación
    while (s.estadoTiro !== 'resultado') {
      await wait(100);
    }

    // Resultado
    if (esGol) {
      setMensaje('¡GOLAZO!');
      if (turno === 'local') {
        setHistorialLocal(prev => [...prev, true]);
        setMarcador(m => ({ ...m, local: m.local + 1 }));
      } else {
        setHistorialVisitante(prev => [...prev, true]);
        setMarcador(m => ({ ...m, visitante: m.visitante + 1 }));
      }
    } else {
      setMensaje('¡PARADÓN!');
      if (turno === 'local') setHistorialLocal(prev => [...prev, false]);
      else setHistorialVisitante(prev => [...prev, false]);
    }

    await wait(2000); 

    // Comprobar fin
    const hl = turno === 'local' ? [...historialLocal, esGol] : historialLocal;
    const hv = turno === 'visitante' ? [...historialVisitante, esGol] : historialVisitante;
    const ml = hl.filter(Boolean).length;
    const mv = hv.filter(Boolean).length;
    const tirosRestantesL = Math.max(0, 5 - hl.length);
    const tirosRestantesV = Math.max(0, 5 - hv.length);

    const esMuerteSubita = hl.length >= 5 && hv.length >= 5 && hl.length === hv.length;
    let terminado = false;

    if (!esMuerteSubita) {
      if (ml > mv + tirosRestantesV) terminado = true;
      if (mv > ml + tirosRestantesL) terminado = true;
    } else {
       if (hl.length === hv.length && ml !== mv) terminado = true;
    }

    if (terminado) {
      s.estadoTiro = 'fin';
      setMensaje('TANDA FINALIZADA');
      await wait(2500);
      onTerminar(ml, mv);
    } else {
      if (turno === 'local') {
        setTurno('visitante');
      } else {
        setTurno('local');
        setRonda(r => r + 1);
      }
    }
  }

  // Motor 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let last = performance.now();

    function loop(ts) {
      const dt = Math.min(ts - last, 50);
      last = ts;
      
      const s = estadoRef.current;
      s.tiempoMs += dt;

      // Actualizar física
      if (s.estadoTiro === 'carrera') {
        s.tirador.x = lerp(s.tirador.x, 0.81, 0.06);
        if (s.tirador.x >= 0.80) {
          s.estadoTiro = 'tiro';
          s.timerTiro = 0;
          s.origenPelota = { ...s.pelota };
          s.origenPortero = { ...s.portero };
        }
      } else if (s.estadoTiro === 'tiro') {
        s.timerTiro += dt;
        const duracion = 500; // medio segundo de vuelo
        const pct = Math.min(1, s.timerTiro / duracion);
        
        // Easing out para que frene ligeramente al final (efecto de choque/fuerza)
        const ease = 1 - Math.pow(1 - pct, 3);
        
        // Balón viaja
        s.pelota.x = s.origenPelota.x + (s.metaPelota.x - s.origenPelota.x) * ease;
        s.pelota.y = s.origenPelota.y + (s.metaPelota.y - s.origenPelota.y) * ease;
        
        // Portero se tira explosivamente
        s.portero.x = s.origenPortero.x + (s.metaPortero.x - s.origenPortero.x) * ease;
        s.portero.y = s.origenPortero.y + (s.metaPortero.y - s.origenPortero.y) * ease;

        // Trail
        s.ballTrail.push({ x: s.pelota.x, y: s.pelota.y });
        if (s.ballTrail.length > 6) s.ballTrail.shift();

        // Detectar fin del tiro
        if (pct >= 1) {
          s.estadoTiro = 'resultado';
          s.timerEfecto = 0;
        }
      } else if (s.estadoTiro === 'resultado') {
        s.timerEfecto += dt;
      } else {
         // idle
         s.tirador.y += Math.sin(s.tiempoMs * 0.005) * 0.0005;
         s.portero.y += Math.cos(s.tiempoMs * 0.005) * 0.0005;
      }

      // Dibujar
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      
      // ── Campo (estilo radar plano) ──
      ctx.fillStyle = '#0f1a14';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#111d16' : '#0f1a14';
        ctx.fillRect(i * W / 10, 0, W / 10, H);
      }
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(10, 7, W-20, H-14);
      ctx.beginPath(); ctx.moveTo(W/2, 7); ctx.lineTo(W/2, H-7); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2, H/2, Math.min(W,H)*0.14, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.arc(W/2,H/2,3.5,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1.5;
      ctx.strokeRect(10, H/2-H*0.265, W*0.20, H*0.53);
      ctx.strokeRect(W-10-W*0.20, H/2-H*0.265, W*0.20, H*0.53);
      ctx.strokeRect(10, H/2-H*0.13, W*0.09, H*0.26);
      ctx.strokeRect(W-10-W*0.09, H/2-H*0.13, W*0.09, H*0.26);
      ctx.fillStyle='rgba(255,255,255,0.2)';
      [W*0.17, W*0.83].forEach(px => { ctx.beginPath(); ctx.arc(px,H/2,3,0,Math.PI*2); ctx.fill(); });
      ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
      [[10,7],[W-10,7],[10,H-7],[W-10,H-7]].forEach(([cx,cy]) => {
        ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2); ctx.stroke();
      });
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=2;
      ctx.strokeRect(3, H/2-H*0.11, 10, H*0.22);
      ctx.strokeRect(W-13, H/2-H*0.11, 10, H*0.22);
      ctx.restore();

      // ── Línea de remate
      if (s.estadoTiro === 'tiro') {
        ctx.save();
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 6;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.pelota.x * W, s.pelota.y * H);
        ctx.lineTo(s.metaPelota.x * W, s.metaPelota.y * H);
        ctx.stroke();
        ctx.restore();
      }

      // ── Trail
      const R  = Math.min(W, H) * 0.035;
      const BR = R * 0.60;
      s.ballTrail.forEach((pos, idx) => {
        const frac = idx / 6;
        ctx.beginPath();
        ctx.arc(pos.x * W, pos.y * H, BR * (0.4 + frac * 0.6), 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,240,${frac * 0.5})`;
        ctx.fill();
      });

      // ── Resto de jugadores (9 por equipo en la línea de medio campo) ──
      for (let i = 0; i < 9; i++) {
         // Equipo Local (mitad superior de la línea)
         const lyLocal = H * 0.08 + (i * (H * 0.25 / 9));
         ctx.beginPath(); ctx.arc(W * 0.5, lyLocal, R * 0.7, 0, Math.PI*2);
         ctx.fillStyle = colorLocal; ctx.fill();
         ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.stroke();
         
         // Equipo Visitante (mitad inferior de la línea)
         const lyVisit = H * 0.67 + (i * (H * 0.25 / 9));
         ctx.beginPath(); ctx.arc(W * 0.5, lyVisit, R * 0.7, 0, Math.PI*2);
         ctx.fillStyle = colorVisitante; ctx.fill();
         ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.stroke();
      }

      // ── Jugadores (Tirador y Portero defensor)
      const colorTirador = turno === 'local' ? colorLocal : colorVisitante;
      const colorPorteroDefensor = turno === 'local' ? colorVisitante : colorLocal;
      
      [
        { x: s.tirador.x * W, y: s.tirador.y * H, col: colorTirador, lb: '9', portador: true },
        { x: s.portero.x * W, y: s.portero.y * H, col: colorPorteroDefensor, lb: 'PT', portador: false }
      ].forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI*2);
        ctx.fillStyle = p.col; ctx.fill();
        ctx.strokeStyle = p.portador ? '#ffffff' : 'rgba(0,0,0,0.5)';
        ctx.lineWidth = p.portador ? 2.5 : 1.5; ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, Math.round(R * 0.70))}px Inter,sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.lb, p.x, p.y);
      });

      // ── Balón
      const bx = s.pelota.x * W, by = s.pelota.y * H;
      ctx.beginPath(); ctx.ellipse(bx+2, by+4, BR*0.9, BR*0.3, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, BR, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.strokeStyle = '#333'; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.beginPath(); ctx.arc(bx, by, BR*0.55, 0.6, Math.PI-0.6);
      ctx.strokeStyle = 'rgba(0,0,0,0.20)'; ctx.lineWidth = 0.8; ctx.stroke();

      // ── Gol Flash
      if (s.estadoTiro === 'resultado' && s.esGolActual && s.timerEfecto < 2000) {
        const t = Math.min(1, s.timerEfecto / 2000);
        const alpha = t < 0.25 ? t/0.25 : t > 0.65 ? (1-t)/0.35 : 1;
        ctx.fillStyle = `rgba(255,220,0,${alpha * 0.38})`;
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `black ${Math.round(H*0.19)}px Inter,sans-serif`;
        ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 30;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillText('⚽ GOL!', W/2, H/2);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [turno, colorLocal, colorVisitante]);

  // HUD helpers
  const renderCirculos = (historial) => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
       if (i < historial.length) {
         arr.push(
           <div key={i} className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 ${historial[i] ? 'bg-green-500 border-green-600' : 'bg-red-600 border-red-700'}`}>
             <i className={`fas ${historial[i] ? 'fa-check text-green-100' : 'fa-times text-red-200'} text-[8px]`}></i>
           </div>
         );
       } else {
         arr.push(<div key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-600 bg-gray-800/50"></div>);
       }
    }
    // Si hay más de 5 (muerte súbita), mostramos solo el total o los últimos extras
    if (historial.length >= 5) {
      arr.push(<div key="extra" className="ml-1 text-xs text-gray-400 font-bold">+{historial.length - 5}</div>);
    }
    return arr;
  };

  return (
    <div className="absolute inset-0 bg-gray-900 rounded-xl overflow-hidden flex flex-col z-20">
      {/* Top HUD */}
      <div className="bg-black/90 p-1.5 sm:p-3 border-b border-gray-800 flex items-center justify-between shrink-0">
         <div className="flex flex-col gap-0.5 sm:gap-1 w-1/3 min-w-0">
           <div className="text-white font-black truncate text-xs sm:text-sm" style={{ color: colorLocal }}>{equipoLocal}</div>
           <div className="flex gap-0.5 sm:gap-1 items-center">{renderCirculos(historialLocal)}</div>
         </div>
         <div className="w-1/3 text-center flex-shrink-0">
            <div className="text-lg sm:text-2xl md:text-3xl font-black text-white">{marcador.local} - {marcador.visitante}</div>
            <div className="text-yellow-400 font-bold text-[10px] sm:text-xs truncate">{mensaje}</div>
         </div>
         <div className="flex flex-col gap-0.5 sm:gap-1 w-1/3 items-end min-w-0">
           <div className="text-white font-black truncate text-xs sm:text-sm" style={{ color: colorVisitante }}>{equipoVisitante}</div>
           <div className="flex gap-0.5 sm:gap-1 items-center justify-end">{renderCirculos(historialVisitante)}</div>
         </div>
      </div>
      
      {/* Canvas Area */}
      <div className="relative w-full h-full bg-[#0f1a14] overflow-hidden flex-1">
         <canvas ref={canvasRef} width={760} height={460} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
