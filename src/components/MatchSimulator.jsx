// Simulador de partido 2D — versión dinámica
import React, { useRef, useEffect, useState } from 'react';
import PenaltyShootout from './PenaltyShootout.jsx';
import { getPosicionesIniciales } from '../utils/matchEngine.js';
import { FORMACIONES, calcularMediaEfectiva } from '../utils/chemistry.js';

const HALF      = 30_000;   // 30 s reales = 1 tiempo (Total 60s)
const TOTAL     = 60_000;   // 60 s reales = partido completo
const PRORROGA_TIME = 20_000; // 20 s extra si hay prórroga
const PAUSA_GOL = 1_000;
const LERPJ     = 0.04;     // velocidad de movimiento suave
const TRAIL_MAX = 8;        // menos estela para el balón

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dist(a, b)  { return Math.hypot(a.x - b.x, a.y - b.y); }
function lerp(a, b, t) { return a + (b - a) * t; }
function rnd(lo, hi)   { return lo + Math.random() * (hi - lo); }
function rndI(arr)     { return arr[Math.floor(Math.random() * arr.length)]; }
function smooth(t)     { return t * t * (3 - 2 * t); }  // smoothstep

function elegirReceptor(esLocal, portIdx, poses, poses_def) {
  const portador = poses[portIdx];
  const candidates = poses
    .map((p, i) => {
      if (i === portIdx) return null;
      const d = dist(p, portador);
      if (d < 0.05 || d > 0.45) return null; // Pases más cortos (tiki-taka)
      
      let minDefDist = 999;
      poses_def.forEach(def => {
        const dd = dist(p, def);
        if (dd < minDefDist) minDefDist = dd;
      });

      if (minDefDist < 0.05) return null; // Muy marcado

      const avance    = esLocal ? (p.x - portador.x) : (portador.x - p.x);
      const lateral   = Math.abs(p.y - portador.y);
      const penPortero = i === 0 ? -0.5 : 0;
      
      const score = avance * 3.5 + minDefDist * 3.0 + lateral * 0.2 + rnd(0, 0.4) + penPortero;
      return { i, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
    
  if (candidates.length === 0) return null;
  return rndI(candidates.slice(0, 2)).i;
}

function calcTargets(estado) {
  const { accion, posL, posV, basL, basV, pelota } = estado;
  const esLocal = accion.equipo === 'local';
  
  // Calcular el centro de gravedad del juego basado en el balón
  const cogX = pelota.x;
  const cogY = pelota.y;

  // Encontrar defensores más cercanos al balón
  let minDistL = 999; estado._closestDefL = 1;
  let minDistV = 999; estado._closestDefV = 1;
  
  if (!esLocal) {
    posL.forEach((p, i) => { if (i===0) return; const d = dist(basL[i], pelota); if(d < minDistL) { minDistL=d; estado._closestDefL=i; }});
  } else {
    posV.forEach((p, i) => { if (i===0) return; const d = dist(basV[i], pelota); if(d < minDistV) { minDistV=d; estado._closestDefV=i; }});
  }

  // Lógica Equipo Local
  posL.forEach((p, i) => {
    const b = basL[i];
    if (i === 0) { // Portero
      p.tx = b.x; p.ty = clamp(lerp(b.y, pelota.y, 0.4), 0.3, 0.7);
    } else {
      // Bloque bascula hacia el balón
      const shiftX = (cogX - 0.5) * (esLocal ? 0.40 : 0.25); // Atacando empujan más, defendiendo reculan
      const shiftY = (cogY - 0.5) * 0.45;
      
      let tx = b.x + shiftX;
      let ty = b.y + shiftY;

      // Presión si es el más cercano y no tienen el balón
      if (!esLocal && i === estado._closestDefL && dist({x:tx, y:ty}, pelota) < 0.4) {
         tx = lerp(tx, pelota.x - 0.02, 0.8);
         ty = lerp(ty, pelota.y, 0.8);
      }

      // Si tienen el balón, el portador se mueve hacia su destino de acción
      if (esLocal && i === accion.portadorIdx) {
         tx = accion.destX;
         ty = accion.destY;
      }

      p.tx = clamp(tx, 0.05, 0.95);
      p.ty = clamp(ty, 0.05, 0.95);
    }
  });

  // Lógica Equipo Visitante
  posV.forEach((p, i) => {
    const b = basV[i];
    if (i === 0) { // Portero
      p.tx = b.x; p.ty = clamp(lerp(b.y, pelota.y, 0.4), 0.3, 0.7);
    } else {
      const shiftX = (cogX - 0.5) * (!esLocal ? 0.40 : 0.25);
      const shiftY = (cogY - 0.5) * 0.45;
      
      let tx = b.x + shiftX;
      let ty = b.y + shiftY;

      if (esLocal && i === estado._closestDefV && dist({x:tx, y:ty}, pelota) < 0.4) {
         tx = lerp(tx, pelota.x + 0.02, 0.8);
         ty = lerp(ty, pelota.y, 0.8);
      }

      if (!esLocal && i === accion.portadorIdx) {
         tx = accion.destX;
         ty = accion.destY;
      }

      p.tx = clamp(tx, 0.05, 0.95);
      p.ty = clamp(ty, 0.05, 0.95);
    }
  });
}

const NARR = {
  gol:       eq  => rndI([`⚽ ¡¡¡GOL de ${eq}!!!`, `🔥 ¡GOLAZO de ${eq}!`, `💥 ¡INCREÍBLE! Lo mete ${eq}`, `🎯 ¡GOOOOL de ${eq}!`]),
  parada:    ()  => rndI(['🧤 ¡Paradón del portero!', '🧤 ¡Mano a mano salvado!', '🧤 ¡El meta lo detiene todo!', '🧤 ¡Increíble parada!']),
  palo:      ()  => rndI(['💢 ¡Al palo!', '💢 ¡Fuera por centímetros!', '😱 ¡Qué ocasión desperdiciada!', '💢 ¡El larguero lo impide!']),
  pase:      ()  => rndI(['→ Pase en profundidad', '→ Combinación de lujo', '→ Balón entre líneas', '→ Pase filtrado']),
  regate:    ()  => rndI(['⚡ ¡Se va de su rival!', '⚡ ¡Regate magistral!', '💃 ¡Caño espectacular!', '⚡ ¡Se lo come!']),
  intercept: ()  => rndI(['✂️ Robo de balón', '🛡 Corte defensivo', '✂️ ¡Recupera el equipo!', '🛡 Intercepcción']),
  remate:    ()  => rndI(['💥 ¡Disparo peligroso!', '🎯 ¡Tiro a puerta!', '💥 ¡Remata!', '🎯 ¡A portería!']),
  descanso:  ()  => '⏱ Fin del primer tiempo.',
  inicio2:   ()  => '▶ ¡Comienza el segundo tiempo!',
  final:     ()  => '⚽ Pitido final del partido.',
};

function initEstado(formL, formV) {
  const basL = getPosicionesIniciales(formL, 'local');
  const basV = getPosicionesIniciales(formV, 'visitante');
  return {
    tiempoMs: 0,
    golesLocal: 0, golesVisitante: 0,
    posL: basL.map(([x, y]) => ({ x, y, tx: x, ty: y })),
    posV: basV.map(([x, y]) => ({ x, y, tx: x, ty: y })),
    basL: basL.map(([x, y]) => ({ x, y })),
    basV: basV.map(([x, y]) => ({ x, y })),
    pelota: { x: 0.5, y: 0.5 },
    ballTrail: [],
    accion: {
      tipo: 'posesion', equipo: 'local',
      portadorIdx: 9, receptorIdx: -1,
      destX: 0.5, destY: 0.5, goalX: 1.02, goalY: 0.5,
      startBallX: 0.5, startBallY: 0.5,
      timer: 0, duracion: 1000,
    },
    goalFlash: null,   // { ms: 0, lado: 'local'|'visitante' }
    posLocal: 0, posTotal: 1,
    descansoHecho: false,
    terminado: false,
    pausado: false,
    prorrogaActiva: false,
    goleadoresL: [],
    goleadoresV: [],
    jugadoresLocal: [],
    jugadoresVisitante: [],
    _lastTarget: 0,
  };
}

function siguienteAccion(estado, mediaTeamLocal, mediaTeamVisitante, onLog, setMarcador, triggerGol) {
  const { accion, posL, posV, pelota, mediasL, mediasV } = estado;
  const esLocal   = accion.equipo === 'local';
  const poses     = esLocal ? posL : posV;
  const portador  = poses[accion.portadorIdx];
  const mediasAttEq = esLocal ? mediasL : mediasV;
  const mediasDefEq = esLocal ? mediasV : mediasL;

  const mediaAtt  = mediasAttEq[accion.portadorIdx] || (esLocal ? mediaTeamLocal : mediaTeamVisitante);
  const mediaDef  = esLocal ? mediaTeamVisitante : mediaTeamLocal;

  // Actualizar posesión
  estado.posTotal++;
  if (esLocal) estado.posLocal++;

  // Forzar recalc inmediato de targets en próxima acción
  estado._lastTarget = 0;

  if (accion.tipo === 'remate') {
    if (accion.esGolSecreto) {
      if (esLocal) estado.golesLocal++; else estado.golesVisitante++;
      
      const pIdx = accion.portadorIdx;
      const jScorer = esLocal ? estado.jugadoresLocal[pIdx] : estado.jugadoresVisitante[pIdx];
      const name = jScorer ? (jScorer.jugador?.nombreCorto || jScorer.jugador?.nombre || jScorer.nombreCorto || jScorer.nombre || 'Jugador') : (esLocal ? 'Local' : 'Visitante');
      const maxMinutos = estado.prorrogaActiva ? 120 : 90;
      const minStr = Math.min(maxMinutos, Math.round((estado.tiempoMs / TOTAL) * 90)) + "'";

      if (esLocal) estado.goleadoresL.push({ name, minStr });
      else estado.goleadoresV.push({ name, minStr });

      setMarcador({ local: estado.golesLocal, visitante: estado.golesVisitante, golesL: [...estado.goleadoresL], golesV: [...estado.goleadoresV] });
      onLog(NARR.gol(esLocal ? 'tu equipo' : 'el rival'));
      triggerGol(esLocal ? 'local' : 'visitante');
      estado.goalFlash = { ms: 0, lado: esLocal ? 'local' : 'visitante' };
      pelota.x = esLocal ? 0.97 : 0.03;
      pelota.y = accion.goalY;
      estado.ballTrail = [];
      estado.accion = { tipo: 'muerta', equipo: esLocal ? 'visitante' : 'local', portadorIdx: 0, receptorIdx: -1, destX: 0.5, destY: 0.5, goalX: 0.5, goalY: 0.5, startBallX: pelota.x, startBallY: pelota.y, timer: 0, duracion: PAUSA_GOL };
    } else {
      if (Math.abs(accion.goalY - 0.5) > 0.10) {
        onLog(NARR.palo());
        estado.accion = { tipo: 'muerta', equipo: esLocal ? 'visitante' : 'local', portadorIdx: 0, receptorIdx: -1, destX: 0.5, destY: 0.5, goalX: 0.5, goalY: 0.5, startBallX: pelota.x, startBallY: pelota.y, timer: 0, duracion: 600 };
      } else {
        onLog(NARR.parada());
        const porteroOp = esLocal ? posV[0] : posL[0];
        pelota.x = porteroOp.x;
        pelota.y = porteroOp.y;
        estado.ballTrail = [];
        estado.accion = { tipo: 'posesion', equipo: esLocal ? 'visitante' : 'local', portadorIdx: 0, receptorIdx: -1, destX: porteroOp.x, destY: porteroOp.y, goalX: 0.5, goalY: 0.5, startBallX: pelota.x, startBallY: pelota.y, timer: 0, duracion: rnd(300, 600) };
      }
    }
    return;
  }

  // Calcular ventaja
  const ventaja = mediaAtt - mediaDef;

  if (accion.tipo === 'pase') {
    const poses_def = esLocal ? posV : posL;
    let interceptado = false;
    // Ahora comprobamos a todos los jugadores de campo (1 al 10), no solo a los 4 defensas
    for (let i = 1; i <= 10; i++) {
      const def = poses_def[i];
      const px = accion.destX, py = accion.destY;
      const ox = portador.x,  oy = portador.y;
      const denom = Math.pow(px - ox, 2) + Math.pow(py - oy, 2) + 0.0001;
      const t = clamp(((def.x-ox)*(px-ox)+(def.y-oy)*(py-oy)) / denom, 0, 1);
      const cx = ox + t*(px-ox), cy = oy + t*(py-oy);
      const d = dist(def, {x:cx, y:cy});
      const defMedia = mediasDefEq[i] || mediaDef;
      // Multiplicador más fuerte para intercepciones.
      // El clamp de 0.95 asegura que siempre haya un 5% mínimo de que el pase salga bien
      let probI = clamp((0.11 - d) * 2.5 + (defMedia - mediaAtt) * 0.015, 0.01, 0.95);
      
      if (Math.random() < probI) {
        interceptado = true;
        onLog(NARR.intercept());
        estado.accion = { tipo:'posesion', equipo:esLocal?'visitante':'local', portadorIdx:i, receptorIdx:-1, destX:cx, destY:cy, goalX:0.5, goalY:0.5, startBallX:cx, startBallY:cy, timer:0, duracion:rnd(300, 600) };
        break;
      }
    }
    if (!interceptado) {
      pelota.x = accion.destX; pelota.y = accion.destY;
      estado.accion = { tipo:'posesion', equipo:accion.equipo, portadorIdx:accion.receptorIdx, receptorIdx:-1, destX:accion.destX, destY:accion.destY, goalX:0.5, goalY:0.5, startBallX:pelota.x, startBallY:pelota.y, timer:0, duracion:rnd(300, 600) };
    }
    return;
  }

  if (accion.tipo === 'muerta') {
    pelota.x = 0.5; pelota.y = 0.5;
    estado.accion = { tipo:'posesion', equipo:accion.equipo, portadorIdx:9, receptorIdx:-1, destX:0.5, destY:0.5, goalX:0.5, goalY:0.5, startBallX:0.5, startBallY:0.5, timer:0, duracion:rnd(200, 500) };
    return;
  }

  // Posesion / regate → decidir siguiente
  const distGol = Math.abs(portador.x - (esLocal ? 1.0 : 0.0));
  const zonaRemate = distGol < 0.35; // Frontal o dentro del área
  let probRemate = 0;
  
  // Calculamos una ventaja especial para el tiro
  // 40% depende del portero individual, 60% depende de la defensa global del equipo
  const porteroMedia = mediasDefEq[0] || mediaDef;
  const mediaDefensaTiro = (porteroMedia * 0.4) + (mediaDef * 0.6);
  const ventajaTiro = mediaAtt - mediaDefensaTiro;

  if (zonaRemate) {
    if (distGol < 0.15) {
      probRemate = 0.95; // Solo contra el portero, tira casi seguro
    } else {
      // El clamp asegura un mínimo de 2% de intentar tirar por muy mal que juegue
      probRemate = clamp(0.30 + ventajaTiro * 0.02, 0.02, 0.95);
    }
  }

  const r = Math.random();
  if (r < probRemate) {
    const dx = esLocal ? (1.0 - portador.x) : portador.x;
    // Mínimo de 1% de marcar por mucho que sea un portero o la diferencia sea abismal
    let probGol = clamp(0.12 + ventajaTiro * 0.025 + (1 - dx) * 0.10, 0.01, 0.95);
    if (ventajaTiro >= 15) probGol = Math.max(probGol, 0.70); // Premio al equipo muy superior
    
    const esGol = Math.random() < probGol;
    
    let goalX = esLocal ? 1.02 : -0.02; 
    let goalY;
    if (esGol) {
      goalY = 0.5 + rnd(-0.09, 0.09); 
    } else {
      if (Math.random() < 0.5) {
        goalY = 0.5 + rndI([rnd(-0.25, -0.12), rnd(0.12, 0.25)]);
      } else {
        const portero = esLocal ? posV[0] : posL[0];
        goalY = portero.y;
        goalX = portero.x;
      }
    }
    
    onLog(NARR.remate());
    estado.accion = { tipo:'remate', equipo:accion.equipo, portadorIdx:accion.portadorIdx, receptorIdx:-1, destX:goalX, destY:goalY, goalX, goalY, startBallX:pelota.x, startBallY:pelota.y, timer:0, duracion:clamp(distGol/0.0015, 300, 700), esGolSecreto: esGol };
  } else if (r < probRemate + (zonaRemate ? 0.05 : 0.40)) {
    // Fuera del área regatean/avanzan mucho más en vez de pasar rápido
    onLog(NARR.regate());
    estado.accion = { ...accion, tipo:'regate', startBallX:pelota.x, startBallY:pelota.y, timer:0, duracion:rnd(400, 700) };
  } else {
    const poses_def = esLocal ? posV : posL;
    const receptorIdx = elegirReceptor(esLocal, accion.portadorIdx, poses, poses_def);
    
    if (receptorIdx === null) {
      onLog(rndI(['🔄 Retrasa el balón', '🛡 Protege la pelota', '🔄 Toca atrás']));
      estado.accion = { ...accion, tipo:'regate', destX: portador.x + (esLocal ? -0.04 : 0.04), destY: portador.y + rnd(-0.06, 0.06), startBallX:pelota.x, startBallY:pelota.y, timer:0, duracion:rnd(300, 600) };
    } else {
      const receptor    = poses[receptorIdx];
      const d = dist(portador, receptor);
      onLog(NARR.pase());
      estado.accion = { tipo:'pase', equipo:accion.equipo, portadorIdx:accion.portadorIdx, receptorIdx, destX:receptor.x, destY:receptor.y, goalX:0.5, goalY:0.5, startBallX:pelota.x, startBallY:pelota.y, timer:0, duracion:clamp(d/0.0008, 250, 700) };
    }
  }
}

export default function MatchSimulator({
  equipoLocal, equipoVisitante,
  mediaLocal, mediaVisitante,
  formacionLocal    = '4-3-3',
  formacionVisitante = '4-3-3',
  colorLocal        = '#3b82f6',
  colorVisitante    = '#ef4444',
  jugadoresLocal    = [],
  jugadoresVisitante = [],
  onPartidoTerminado,
}) {
  const canvasRef = useRef(null);
  const estadoRef = useRef(null);
  const animRef   = useRef(null);

  const [log, setLog]           = useState([]);
  const [marcador, setMarcador] = useState({ local: 0, visitante: 0, golesL: [], golesV: [] });
  const [tiempoMs, setTiempoMs] = useState(0);
  const [fase, setFase]         = useState('jugando');
  const [destello, setDestello] = useState(null); // null | 'local' | 'visitante'

  const addLog = msg => setLog(prev => [{ msg, id: Math.random() }, ...prev].slice(0, 20));

  const slotsL = FORMACIONES[formacionLocal]?.slots    || [];
  const slotsV = FORMACIONES[formacionVisitante]?.slots || [];

  function hexToRGB(hex) {
    const n = parseInt((hex || '#888888').replace('#', ''), 16);
    return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
  }
  function lighten(hex, f, a = 1) {
    const { r, g, b } = hexToRGB(hex);
    return `rgba(${clamp(r+Math.round(f*255),0,255)},${clamp(g+Math.round(f*255),0,255)},${clamp(b+Math.round(f*255),0,255)},${a})`;
  }

  useEffect(() => {
    estadoRef.current = initEstado(formacionLocal, formacionVisitante);
    estadoRef.current.jugadoresLocal = jugadoresLocal;
    estadoRef.current.jugadoresVisitante = jugadoresVisitante;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!estadoRef.current.mediasL) {
      const e = estadoRef.current;
      e.mediasL = e.posL.map((_, i) => {
        const item = jugadoresLocal[i];
        return item ? calcularMediaEfectiva(item.jugador, item.posFormacion) : mediaLocal;
      });
      e.mediasV = e.posV.map((_, i) => {
        const jug = jugadoresVisitante[i];
        // La IA ya tiene sus medias ajustadas en mediaFinal
        return jug ? (jug.mediaFinal ?? jug.media) : mediaVisitante;
      });
    }
    const estado = estadoRef.current;

    function triggerGol(lado) {
      setDestello(lado);
      setTimeout(() => setDestello(null), 2500);
    }

    function tick(dt) {
      if (estado.terminado || estado.pausado) return;
      estado.tiempoMs += dt;

      const maxTime = estado.prorrogaActiva ? TOTAL + PRORROGA_TIME : TOTAL;
      if (estado.tiempoMs >= maxTime && !estado.fase_transitioned) {
        if (estado.golesLocal === estado.golesVisitante) {
          estado.fase_transitioned = true;
          if (!estado.prorrogaActiva) {
            estado.pausado = true;
            addLog('⏱ Final de los 90 minutos. ¡Habrá prórroga!');
            setFase('esperando_prorroga');
            return;
          } else {
            estado.pausado = true;
            addLog('⏱ Final de la prórroga. ¡Nos vamos a los penaltis!');
            setFase('penaltis');
            return;
          }
        }
        estado.terminado = true;
        addLog(NARR.final());
        setFase('terminado');
        onPartidoTerminado?.(estado.golesLocal, estado.golesVisitante);
        return;
      }

      setTiempoMs(estado.tiempoMs);

      // Mover jugadores con suavidad orgánica
      [...estado.posL, ...estado.posV].forEach((p, i) => {
        // Lerp suaviza el arranque y frenada de forma muy natural
        p.x = lerp(p.x, p.tx, 0.05);
        p.y = lerp(p.y, p.ty, 0.05);
        
        // Micro-movimiento para que parezcan vivos y no estatuas cuando están quietos
        p.x += Math.sin(estado.tiempoMs * 0.004 + i) * 0.0003;
        p.y += Math.cos(estado.tiempoMs * 0.005 + i) * 0.0003;
      });

      const { accion, pelota } = estado;
      const esLocal   = accion.equipo === 'local';
      const poses     = esLocal ? estado.posL : estado.posV;
      const portador  = poses[accion.portadorIdx] || poses[9];

      // Mover balón con historial para el trail
      const prevX = pelota.x, prevY = pelota.y;
      if (accion.tipo === 'posesion' || accion.tipo === 'regate') {
        pelota.x = lerp(pelota.x, portador.x + rnd(-0.006, 0.006), 0.30);
        pelota.y = lerp(pelota.y, portador.y + rnd(-0.006, 0.006), 0.30);
      } else if (accion.tipo === 'pase') {
        const prog = smooth(Math.min(1, accion.timer / accion.duracion));
        const posesList = esLocal ? estado.posL : estado.posV;
        const receptor = posesList[accion.receptorIdx];
        const destX = receptor ? receptor.x : accion.destX;
        const destY = receptor ? receptor.y : accion.destY;
        pelota.x = lerp(accion.startBallX, destX, prog);
        pelota.y = lerp(accion.startBallY, destY, prog);
      } else if (accion.tipo === 'remate') {
        const prog = smooth(Math.min(1, accion.timer / accion.duracion));
        pelota.x = lerp(accion.startBallX, accion.destX, prog);
        pelota.y = lerp(accion.startBallY, accion.destY, prog);
      } else if (accion.tipo === 'muerta') {
        pelota.x = lerp(pelota.x, 0.5, 0.05);
        pelota.y = lerp(pelota.y, 0.5, 0.05);
      }

      // Trail del balón
      if (Math.abs(pelota.x - prevX) + Math.abs(pelota.y - prevY) > 0.001) {
        estado.ballTrail.push({ x: pelota.x, y: pelota.y });
        if (estado.ballTrail.length > TRAIL_MAX) estado.ballTrail.shift();
      }

      // Goal flash timer
      if (estado.goalFlash) {
        estado.goalFlash.ms += dt;
        if (estado.goalFlash.ms > 2200) estado.goalFlash = null;
      }

      // Recalcular targets constantemente para fluidez máxima
      calcTargets(estado);

      accion.timer += dt;
      if (accion.timer >= accion.duracion) {
        siguienteAccion(estado, mediaLocal, mediaVisitante, addLog, setMarcador, triggerGol);
      }
    }

    function draw() {
      const e = estadoRef.current;
      if (!e) return;
      const W = canvas.width, H = canvas.height; ctx.clearRect(0, 0, W, H);
      
      // ── Campo (estilo radar plano) ──
      ctx.fillStyle = '#145c18'; // Verde brillante
      ctx.fillRect(0, 0, W, H);
      
      // Franjas del césped
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#1a7020' : '#145c18';
        ctx.fillRect(i * W / 10, 0, W / 10, H);
      }

      ctx.save();
      // Líneas
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(10, 7, W-20, H-14);
      ctx.beginPath(); ctx.moveTo(W/2, 7); ctx.lineTo(W/2, H-7); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2, H/2, Math.min(W,H)*0.14, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.arc(W/2,H/2,3.5,0,Math.PI*2); ctx.fill();
      // Áreas grandes
      ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1.5;
      ctx.strokeRect(10, H/2-H*0.265, W*0.20, H*0.53);
      ctx.strokeRect(W-10-W*0.20, H/2-H*0.265, W*0.20, H*0.53);
      // Áreas chicas
      ctx.strokeRect(10, H/2-H*0.13, W*0.09, H*0.26);
      ctx.strokeRect(W-10-W*0.09, H/2-H*0.13, W*0.09, H*0.26);
      // Puntos de penalti
      ctx.fillStyle='rgba(255,255,255,0.2)';
      [W*0.17, W*0.83].forEach(px => { ctx.beginPath(); ctx.arc(px,H/2,3,0,Math.PI*2); ctx.fill(); });
      // Arcos de córner
      ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
      [[10,7],[W-10,7],[10,H-7],[W-10,H-7]].forEach(([cx,cy]) => {
        ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2); ctx.stroke();
      });
      // Porterías
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=2;
      ctx.strokeRect(3, H/2-H*0.11, 10, H*0.22);
      ctx.strokeRect(W-13, H/2-H*0.11, 10, H*0.22);
      ctx.restore();

      // ── Barra de tiempo (top) ────────────────────────────────────────────────
      const maxT = e.prorrogaActiva ? TOTAL + PRORROGA_TIME : TOTAL;
      const pctT = Math.min(1, e.tiempoMs / maxT);
      ctx.fillStyle = '#0a1a0a';
      ctx.fillRect(0, 0, W, 5);
      ctx.fillStyle = e.tiempoMs > (e.prorrogaActiva ? TOTAL : HALF) ? '#f59e0b' : '#22c55e';
      ctx.fillRect(0, 0, W * pctT, 5);

      // ── Línea de pase / remate ───────────────────────────────────────────────
      const ac = e.accion;
      const att = ac.equipo === 'local' ? e.posL : e.posV;
      const portL = att[ac.portadorIdx] || att[0];
      const colAtt = ac.equipo === 'local' ? colorLocal : colorVisitante;

      if (ac.tipo === 'pase') {
        const prog = Math.min(1, ac.timer / ac.duracion);
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = colAtt + 'aa';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ac.startBallX * W, ac.startBallY * H);
        ctx.lineTo(ac.destX * W, ac.destY * H);
        ctx.globalAlpha = 1 - prog * 0.8;
        ctx.stroke();
        ctx.restore();
      }
      if (ac.tipo === 'remate') {
        const prog = Math.min(1, ac.timer / ac.duracion);
        ctx.save();
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 6;
        ctx.globalAlpha = 1 - prog * 0.6;
        ctx.beginPath();
        ctx.moveTo(ac.startBallX * W, ac.startBallY * H);
        ctx.lineTo(ac.destX * W, ac.destY * H);
        ctx.stroke();
        ctx.restore();
      }

      // ── Trail del balón ──────────────────────────────────────────────────────
      const R  = Math.min(W, H) * 0.035;
      const BR = R * 0.60;
      e.ballTrail.forEach((pos, idx) => {
        const frac  = idx / TRAIL_MAX;
        const alpha = frac * 0.50;
        const r2    = BR * (0.4 + frac * 0.6);
        ctx.beginPath();
        ctx.arc(pos.x * W, pos.y * H, r2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,240,${alpha})`;
        ctx.fill();
      });

      // ── Jugadores ────────────────────────────────────────────────────────────
      const FONT_SZ = Math.max(10, Math.round(R * 0.70));
      function posLabel(slots, i) {
        const s = (slots[i] || '').replace('LAD','LD').replace('LAI','LI').replace('EXD','ED').replace('EXI','EI').replace('DEL','DC');
        return s || String(i+1);
      }

      function drawPlayers(poses, color, markIdx, slots) {
        poses.forEach((p, i) => {
          const px = p.x * W, py = p.y * H;
          const isPortador = i === markIdx;
          const label = posLabel(slots, i);

          // Círculo principal plano
          ctx.beginPath();
          ctx.arc(px, py, R, 0, Math.PI*2);
          ctx.fillStyle = color;
          ctx.fill();
          
          ctx.strokeStyle = isPortador ? '#ffffff' : 'rgba(0,0,0,0.5)';
          ctx.lineWidth = isPortador ? 2.5 : 1.5;
          ctx.stroke();

          // Etiqueta
          ctx.font = `bold ${FONT_SZ}px Inter,sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Sombra/borde para que se vea el texto en chapas blancas
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(0,0,0,0.7)';
          ctx.strokeText(label, px, py);

          ctx.fillStyle = '#fff';
          ctx.fillText(label, px, py);
        });
      }

      drawPlayers(e.posL, colorLocal,    e.accion.equipo==='local'     ? e.accion.portadorIdx : -1, slotsL);
      drawPlayers(e.posV, colorVisitante, e.accion.equipo==='visitante' ? e.accion.portadorIdx : -1, slotsV);

      // ── Balón ────────────────────────────────────────────────────────────────
      const bx = e.pelota.x * W, by = e.pelota.y * H;
      ctx.beginPath();
      ctx.ellipse(bx+2, by+4, BR*0.9, BR*0.3, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx, by, BR, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.9;
      ctx.stroke();
      // Costura del balón
      ctx.beginPath();
      ctx.arc(bx, by, BR*0.55, 0.6, Math.PI-0.6);
      ctx.strokeStyle = 'rgba(0,0,0,0.20)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // ── Flash GOL ────────────────────────────────────────────────────────────
      if (e.goalFlash) {
        const t = Math.min(1, e.goalFlash.ms / 2200);
        const alpha = t < 0.25 ? t/0.25 : t > 0.65 ? (1-t)/0.35 : 1;
        ctx.fillStyle = `rgba(255,220,0,${alpha * 0.38})`;
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `black ${Math.round(H*0.19)}px Inter,sans-serif`;
        ctx.shadowColor  = '#ffd700';
        ctx.shadowBlur   = 30;
        ctx.fillStyle    = `rgba(255,255,255,${alpha})`;
        ctx.fillText('⚽ GOL!', W/2, H/2 - R);
        ctx.shadowBlur = 0;
        const eq = e.goalFlash.lado === 'local' ? 'TU EQUIPO' : (typeof equipoVisitante === 'string' ? equipoVisitante.toUpperCase() : 'RIVAL');
        ctx.font = `bold ${Math.round(H*0.07)}px Inter,sans-serif`;
        ctx.fillStyle = `rgba(255,240,80,${alpha * 0.9})`;
        ctx.fillText(eq, W/2, H/2 + R * 1.2);
        ctx.restore();
      }

      // ── Barra de posesión (bottom) ───────────────────────────────────────────
      const pctL = e.posLocal / e.posTotal;
      ctx.fillStyle = colorLocal + '99';
      ctx.fillRect(0, H-5, W * pctL, 5);
      ctx.fillStyle = colorVisitante + '99';
      ctx.fillRect(W * pctL, H-5, W * (1 - pctL), 5);
    }

    let last = null;
    function loop(ts) {
      const dt = last ? Math.min(ts - last, 80) : 16;
      last = ts;
      tick(dt);
      draw();
      if (!estadoRef.current?.terminado) animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const prorrogaStr = estadoRef.current?.prorrogaActiva ? ' (PR)' : '';
  const maxTiempoActual = estadoRef.current?.prorrogaActiva ? TOTAL + PRORROGA_TIME : TOTAL;
  const maxMinutos = estadoRef.current?.prorrogaActiva ? 120 : 90;
  const minuto = Math.min(maxMinutos, Math.round((tiempoMs / maxTiempoActual) * maxMinutos));
  const eqV    = typeof equipoVisitante === 'string' ? equipoVisitante : equipoVisitante?.nombre || 'Rival';

  const scoreColor = destello === 'local'
    ? 'linear-gradient(135deg,#0d3060,#1a4a90)'
    : destello === 'visitante'
      ? 'linear-gradient(135deg,#5a0d0d,#8a1a1a)'
      : '#111827';

  return (
    <div className="flex flex-col items-center gap-3 p-3 w-full max-w-3xl mx-auto">

      {/* Marcador */}
      <div
        className="w-full rounded-2xl px-2.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300"
        style={{
          background: scoreColor,
          border: destello ? `2px solid ${destello === 'local' ? colorLocal : colorVisitante}` : '1px solid #2d3748',
          boxShadow: destello ? `0 0 32px ${destello === 'local' ? colorLocal : colorVisitante}55` : 'none',
        }}
      >
        {/* Local */}
        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-white text-[10px] sm:text-xs" style={{ background: colorLocal, textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>TÚ</div>
          <div className="text-white font-black text-sm sm:text-base">Tú</div>
          <div className="text-gray-400 text-[10px] sm:text-xs">Media {mediaLocal}</div>
        </div>

        {/* Marcador central */}
        <div className="text-center px-1.5 sm:px-6 flex-shrink-0">
          <div className={`font-black transition-all ${destello ? 'text-yellow-300 text-3xl sm:text-5xl md:text-6xl drop-shadow-lg' : 'text-white text-2xl sm:text-4xl md:text-5xl'}`}>
            {marcador.local} — {marcador.visitante}
          </div>
          <div className="text-[10px] sm:text-sm font-bold mt-1 tracking-widest" style={{
            color: fase === 'descanso' ? '#ffd700' : fase === 'terminado' ? '#22c55e' : '#9ca3af'
          }}>
            {fase === 'descanso' ? '⏱ DESCANSO' : fase === 'terminado' ? '✅ FINAL' : fase === 'penaltis' ? 'PENALTIS' : `${minuto}'${prorrogaStr}`}
          </div>
          {destello && (
            <div className="text-yellow-400 font-black text-sm sm:text-lg animate-pulse mt-1">⚽ GOL!</div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-white text-[10px] sm:text-xs" style={{ background: colorVisitante, textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
            {(eqV || 'RV').slice(0,2).toUpperCase()}
          </div>
          <div className="text-white font-black text-sm sm:text-base truncate max-w-[90px] sm:max-w-[100px]">{eqV}</div>
          <div className="text-gray-400 text-[10px] sm:text-xs">Media {mediaVisitante}</div>
        </div>
      </div>

      {/* Goleadores */}
      {(marcador.golesL?.length > 0 || marcador.golesV?.length > 0) && (
        <div className="w-full flex bg-[#111827] rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm border border-gray-800 shadow-inner -mt-1 z-10 relative">
          <div className="w-1/2 flex flex-col items-end border-r border-gray-700/50 pr-2 sm:pr-4 min-w-0">
            {marcador.golesL?.map((g, i) => (
               <div key={i} className="flex gap-1.5 sm:gap-2 items-center mb-1 min-w-0 max-w-full">
                 <span className="font-bold text-gray-200 truncate">{g.name}</span>
                 <span className="text-gray-500 text-[10px] sm:text-xs flex-shrink-0">{g.minStr}</span>
                 <i className="fas fa-futbol text-gray-400 text-[10px] flex-shrink-0"></i>
               </div>
            ))}
          </div>
          <div className="w-1/2 flex flex-col items-start pl-2 sm:pl-4 min-w-0">
            {marcador.golesV?.map((g, i) => (
               <div key={i} className="flex gap-1.5 sm:gap-2 items-center mb-1 min-w-0 max-w-full">
                 <i className="fas fa-futbol text-gray-400 text-[10px] flex-shrink-0"></i>
                 <span className="text-gray-500 text-[10px] sm:text-xs flex-shrink-0">{g.minStr}</span>
                 <span className="font-bold text-gray-200 truncate">{g.name}</span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Canvas y Overlays */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl mt-1" style={{ border: '2px solid #166534', aspectRatio: '760 / 460' }}>
        <canvas ref={canvasRef} width={760} height={460} className="absolute inset-0 w-full h-full" />
        
        {fase === 'esperando_prorroga' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 px-3 text-center">
            <div className="text-xl sm:text-3xl md:text-4xl font-black text-yellow-400 mb-1 sm:mb-2">EMPATE A {marcador.local}</div>
            <div className="text-gray-300 mb-3 sm:mb-6 text-xs sm:text-base md:text-lg">El partido se decidirá en la prórroga</div>
            <button onClick={() => {
              estadoRef.current.pausado = false;
              estadoRef.current.prorrogaActiva = true;
              estadoRef.current.fase_transitioned = false;
              setFase('jugando');
            }} className="btn-principal px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-xl flex items-center gap-2">
              <i className="fas fa-play"></i> Jugar Prórroga
            </button>
          </div>
        )}

        {fase === 'penaltis' && (
          <PenaltyShootout
             equipoLocal={equipoLocal}
             equipoVisitante={equipoVisitante}
             colorLocal={colorLocal}
             colorVisitante={colorVisitante}
             mediaLocal={mediaLocal}
             mediaVisitante={mediaVisitante}
             onTerminar={(penaltisL, penaltisV) => {
               estadoRef.current.terminado = true;
               setFase('terminado');
               onPartidoTerminado(estadoRef.current.golesLocal, estadoRef.current.golesVisitante, penaltisL, penaltisV);
             }}
          />
        )}
      </div>

      {/* Barra inferior: leyenda + posesión */}
      <div className="w-full flex items-center justify-between text-xs px-1 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full" style={{ background: colorLocal }}/>
          <span className="text-gray-300 font-semibold">Tú</span>
        </div>
        <div className="text-gray-500 text-center">Posesión ← →</div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300 font-semibold">{eqV}</span>
          <div className="w-3.5 h-3.5 rounded-full" style={{ background: colorVisitante }}/>
        </div>
      </div>

    </div>
  );
}
