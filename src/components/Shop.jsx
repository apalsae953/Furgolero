// Tienda: comprar sobres y rerolls
import React, { useState } from 'react';
import { abrirSobre } from '../utils/draftEngine.js';
import PlayerCard from './PlayerCard.jsx';

const PRECIOS = {
  sobrelaliga:   100,
  sobrepremier:  100,
  sobremundial:  120,
  rerollEquipo:  50,
  rerollJugador: 25,
};

const MAX_REROLLS_EQUIPO  = 30;
const MAX_REROLLS_JUGADOR = 20;

export default function Shop({ dinero, rerollsEquipo, rerollsJugador, onComprar, onAnadirAlAlbum, onVolver }) {
  const [cartasSobre, setCartasSobre] = useState(null);
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cartaRevealIdx, setCartaRevealIdx] = useState(0);

  function comprar(tipo) {
    const precio = PRECIOS[tipo];
    if (dinero < precio) { setMensaje('No tienes suficientes monedas.'); return; }

    if (tipo.startsWith('sobre')) {
      const modo = tipo.replace('sobre', '');
      const cartas = abrirSobre(modo);
      setCartasSobre(cartas);
      setSobreAbierto(true);
      setCartaRevealIdx(0);
      onComprar(tipo, precio, cartas);
      setMensaje('');
    } else if (tipo === 'rerollEquipo') {
      if (rerollsEquipo >= MAX_REROLLS_EQUIPO) { setMensaje(`Ya tienes el máximo de rerolls de equipo (${MAX_REROLLS_EQUIPO}).`); return; }
      onComprar(tipo, precio);
      setMensaje('+1 Reroll de equipo comprado.');
    } else if (tipo === 'rerollJugador') {
      if (rerollsJugador >= MAX_REROLLS_JUGADOR) { setMensaje(`Ya tienes el máximo de rerolls de jugador (${MAX_REROLLS_JUGADOR}).`); return; }
      onComprar(tipo, precio);
      setMensaje('+1 Reroll de jugadores comprado.');
    }
  }

  function revelarSiguiente() {
    if (cartaRevealIdx < (cartasSobre?.length ?? 0) - 1) {
      setCartaRevealIdx(prev => prev + 1);
    } else {
      // cartasSobre?.forEach(c => onAnadirAlAlbum?.(c));
      cerrarSobre();
    }
  }

  function cerrarSobre() {
    setSobreAbierto(false);
    setCartasSobre(null);
    setCartaRevealIdx(0);
  }

  const articulos = [
    {
      tipo: 'sobrelaliga',
      nombre: 'Sobre La Liga',
      icon: 'fas fa-futbol',
      iconColor: '#ff4040',
      descripcion: '5 cartas aleatorias de La Liga 2025-26',
      precio: PRECIOS.sobrelaliga,
      bg: 'linear-gradient(135deg, #2a0000, #4a0808)',
      border: '#880000',
      proximamente: true,
    },
    {
      tipo: 'sobrepremier',
      nombre: 'Sobre Premier',
      icon: 'fas fa-crown',
      iconColor: '#b040ff',
      descripcion: '5 cartas aleatorias de la Premier League 2025-26',
      precio: PRECIOS.sobrepremier,
      bg: 'linear-gradient(135deg, #0d0020, #1e0040)',
      border: '#5a0099',
      proximamente: true,
    },
    {
      tipo: 'sobremundial',
      nombre: 'Sobre Mundiales',
      icon: 'fas fa-trophy',
      iconColor: '#ffd700',
      descripcion: '5 cartas de selecciones históricas de Mundiales',
      precio: PRECIOS.sobremundial,
      bg: 'linear-gradient(135deg, #1a1000, #3d2800)',
      border: '#7a5000',
      proximamente: true,
    },
    {
      tipo: 'rerollEquipo',
      nombre: 'Reroll Equipo',
      icon: 'fas fa-exchange-alt',
      iconColor: '#b040ff',
      descripcion: `Cambia el equipo asignado. Tienes ${rerollsEquipo}/${MAX_REROLLS_EQUIPO}`,
      precio: PRECIOS.rerollEquipo,
      bg: 'linear-gradient(135deg, #0a0020, #1a0045)',
      border: '#3a0080',
    },
    {
      tipo: 'rerollJugador',
      nombre: 'Reroll Jugadores',
      icon: 'fas fa-dice',
      iconColor: '#40c0ff',
      descripcion: `Mezcla los jugadores del equipo. Tienes ${rerollsJugador}/${MAX_REROLLS_JUGADOR}`,
      precio: PRECIOS.rerollJugador,
      bg: 'linear-gradient(135deg, #001020, #002540)',
      border: '#005599',
    },
  ];

  return (
    <div className="min-h-screen px-3 sm:px-4 py-5 sm:py-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-5">
        <button onClick={onVolver} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
          <i className="fas fa-arrow-left"></i> Menú
        </button>
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
          <i className="fas fa-store text-yellow-400"></i>
          Tienda
        </h1>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl"
          style={{ background: '#1a1200', border: '1px solid #3d2d00' }}>
          <i className="fas fa-coins text-yellow-400"></i>
          <span className="text-yellow-300 font-black text-sm sm:text-lg">{dinero}</span>
          <span className="text-yellow-700 text-xs sm:text-sm">monedas</span>
        </div>
      </div>

      {mensaje && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-2 mb-4 text-sm"
          style={{ background: '#0a1a2a', border: '1px solid #1e4060', color: '#60aaff' }}>
          <i className="fas fa-info-circle"></i>
          <span>{mensaje}</span>
        </div>
      )}

      {/* Artículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {articulos.map(art => {
          const sinFondos = dinero < art.precio;
          return (
            <div key={art.tipo} className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: art.bg, border: `1px solid ${art.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${art.iconColor}18`, border: `1px solid ${art.iconColor}40` }}>
                  <i className={`${art.icon} text-xl`} style={{ color: art.iconColor }}></i>
                </div>
                <div>
                  <div className="text-white font-black">{art.nombre}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{art.descripcion}</div>
                </div>
              </div>
              <div className="mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <i className="fas fa-coins text-yellow-400 text-sm"></i>
                    <span className="text-yellow-300 font-black text-lg">{art.precio}</span>
                  </div>
                  {sinFondos && <span className="text-red-500 text-xs font-semibold">Sin fondos</span>}
                </div>
                <button
                  onClick={() => comprar(art.tipo)}
                  disabled={sinFondos || art.proximamente}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                    (sinFondos || art.proximamente)
                      ? 'cursor-not-allowed opacity-30'
                      : 'hover:brightness-125 active:scale-95'
                  }`}
                  style={(sinFondos || art.proximamente)
                    ? { background: '#1e2d3d', color: '#4a6070' }
                    : { background: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#000' }
                  }
                >
                  <i className={`fas ${art.proximamente ? 'fa-clock' : (sinFondos ? 'fa-lock' : 'fa-shopping-cart')} mr-1.5`}></i>
                  {art.proximamente ? 'Próximamente' : (sinFondos ? 'Sin fondos' : 'Comprar')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla de premios */}
      <div className="rounded-xl p-4 text-sm" style={{ background: '#060d14', border: '1px solid #0f1e2e' }}>
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <i className="fas fa-coins text-yellow-400"></i>
          ¿Cómo ganar monedas?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { ronda: 'Octavos', premio: 150, color: '#22c55e' },
            { ronda: 'Cuartos', premio: 250, color: '#22c55e' },
            { ronda: 'Semis', premio: 400, color: '#ffd700' },
            { ronda: 'Final', premio: 700, color: '#ffd700' },
          ].map(p => (
            <div key={p.ronda} className="rounded-lg p-2.5 text-center" style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}>
              <div className="font-black" style={{ color: p.color }}>+{p.premio}</div>
              <div className="text-gray-500 text-xs mt-0.5">Ganar {p.ronda}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal sobre */}
      {sobreAbierto && cartasSobre && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-5 sm:p-8 max-w-sm w-full text-center"
            style={{ background: '#0c1525', border: '1px solid #1e3050' }}>
            <h2 className="text-white font-black text-xl sm:text-2xl mb-1 flex items-center justify-center gap-2">
              <i className="fas fa-box-open text-yellow-400"></i>
              Sobre abierto
            </h2>
            <p className="text-gray-500 mb-5 text-sm">
              Carta <span className="text-white font-bold">{cartaRevealIdx + 1}</span> de {cartasSobre.length}
            </p>
            <div className="flex justify-center mb-5">
              <PlayerCard jugador={cartasSobre[cartaRevealIdx]} />
            </div>
            {cartasSobre[cartaRevealIdx]?.esEspecial && (
              <div className="font-black text-lg mb-4 animate-pulse"
                style={{ color: '#ffd700', textShadow: '0 0 20px #ffd700' }}>
                <i className="fas fa-star mr-1"></i>
                ¡CARTA LEGENDARIA!
                <i className="fas fa-star ml-1"></i>
              </div>
            )}
            <button onClick={revelarSiguiente} className="btn-dorado w-full text-base py-3 flex items-center justify-center gap-2">
              {cartaRevealIdx < cartasSobre.length - 1
                ? <><i className="fas fa-arrow-right"></i> Siguiente carta</>
                : <><i className="fas fa-check"></i> Guardar todas al álbum</>
              }
            </button>
            <button
              onClick={() => { /* cartasSobre?.forEach(c => onAnadirAlAlbum?.(c)); */ cerrarSobre(); }}
              className="text-gray-600 hover:text-gray-400 text-sm mt-2 block w-full transition-colors"
            >
              Saltar todo y guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
