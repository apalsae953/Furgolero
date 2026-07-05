// Menú principal del juego
import React from 'react';

export default function MainMenu({ onSeleccionarModo, estadisticas }) {
  const { dinero = 500, rerollsEquipo = 5, rerollsJugador = 10, cartasAlbum = 0 } = estadisticas || {};

  const modos = [
    {
      id: 'mundial',
      icon: 'fas fa-trophy',
      titulo: 'Mundiales',
      subtitulo: '1970 — 2026',
      descripcion: 'Elige una selección histórica y conquista el mundial.',
      color: '#7a5200',
      colorClaro: '#ffd700',
      bg: 'linear-gradient(135deg, #1a1000, #3d2800)',
      border: '#7a5200',
    },
    {
      id: 'premier',
      icon: 'fas fa-crown',
      titulo: 'Premier League',
      subtitulo: 'Temporada 2025-26',
      descripcion: 'Los mejores equipos de Inglaterra. Gana la FA Cup.',
      color: '#3d0080',
      colorClaro: '#b040ff',
      bg: 'linear-gradient(135deg, #0d0020, #1e0040)',
      border: '#5a0099',
    },
    {
      id: 'laliga',
      icon: 'fas fa-futbol',
      titulo: 'La Liga',
      subtitulo: 'Temporada 2025-26',
      descripcion: 'El mejor fútbol español. Conquista la Copa del Rey.',
      color: '#7a0000',
      colorClaro: '#ff4040',
      bg: 'linear-gradient(135deg, #1a0000, #3a0808)',
      border: '#880000',
    },
    {
      id: 'shop',
      icon: 'fas fa-shopping-cart',
      titulo: 'Tienda',
      subtitulo: 'Mejora tu experiencia',
      descripcion: 'Compra Rerolls para tus partidas.',
      color: '#aa7700',
      colorClaro: '#ffbb00',
      bg: 'linear-gradient(135deg, #221800, #443000)',
      border: '#886600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a1a2a 0%, #060d14 100%)' }}
    >
      {/* Logo */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="mb-2 sm:mb-4">
          <i className="fas fa-futbol text-green-400 text-4xl sm:text-5xl md:text-6xl drop-shadow-lg"></i>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter">
          FUR<span className="text-green-400">GOLERO</span>
        </h1>
        <p className="text-gray-500 mt-2 tracking-widest uppercase text-[10px] sm:text-sm px-4">
          Draft &bull; Sobres &bull; Torneo &bull; Simulación
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-10 flex-wrap justify-center">
        {[
          { icon: 'fas fa-coins', valor: dinero, label: 'monedas', color: '#ffd700', bg: '#1a1200' },
          { icon: 'fas fa-exchange-alt', valor: rerollsEquipo, label: 'eq. rerolls', color: '#b040ff', bg: '#100020' },
          { icon: 'fas fa-dice', valor: rerollsJugador, label: 'jug. rerolls', color: '#40c0ff', bg: '#001020' },
          { icon: 'fas fa-book', valor: cartasAlbum, label: 'cartas', color: '#40ff80', bg: '#001510' },
        ].map((s, i) => (
          <div key={i}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm"
            style={{ background: s.bg, border: `1px solid ${s.color}30` }}
          >
            <i className={`${s.icon} text-xs sm:text-sm`} style={{ color: s.color }}></i>
            <span className="font-black" style={{ color: s.color }}>{s.valor}</span>
            <span className="text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Modos de juego */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full mb-8">
        {modos.map(modo => (
          <button
            key={modo.id}
            onClick={() => onSeleccionarModo(modo.id)}
            className="rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105 active:scale-95 hover:brightness-125"
            style={{ background: modo.bg, border: `1px solid ${modo.border}`, boxShadow: `0 8px 30px ${modo.color}40` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${modo.colorClaro}20`, border: `1px solid ${modo.colorClaro}40` }}>
                <i className={`${modo.icon} text-xl`} style={{ color: modo.colorClaro }}></i>
              </div>
              <div>
                <div className="text-white font-black text-xl leading-tight">{modo.titulo}</div>
                <div className="text-xs font-semibold" style={{ color: modo.colorClaro + 'aa' }}>{modo.subtitulo}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{modo.descripcion}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: modo.colorClaro }}>
              <i className="fas fa-play text-xs"></i> Jugar ahora
            </div>
          </button>
        ))}
      </div>

      {/* Guía rápida */}
      <div className="max-w-2xl w-full rounded-xl p-5 text-sm"
        style={{ background: '#060d14', border: '1px solid #0f1e2e' }}>
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <i className="fas fa-question-circle text-green-400"></i>
          ¿Cómo jugar?
        </h3>
        <div className="space-y-2 text-gray-400">
          {[
            { icon: 'fas fa-random', color: '#22c55e', texto: '<b class="text-white">Draft:</b> Se te asigna un equipo con 5 jugadores. Elige uno y salen 5 nuevos del mismo equipo.' },
            { icon: 'fas fa-exchange-alt', color: '#b040ff', texto: '<b class="text-white">Rerolls:</b> Cambia de equipo o mezcla los jugadores. Se regeneran con el tiempo.' },
            { icon: 'fas fa-shield-alt', color: '#60aaff', texto: '<b class="text-white">Alineación:</b> Coloca a tus 11 jugadores en la formación táctica.' },
            { icon: 'fas fa-trophy', color: '#ffd700', texto: '<b class="text-white">Torneo:</b> Octavos → Cuartos → Semis → Final. Cada victoria da monedas.' },
            { icon: 'fas fa-store', color: '#ff8c00', texto: '<b class="text-white">Tienda:</b> Compra sobres con 5 cartas aleatorias o rerolls adicionales.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <i className={`${item.icon} text-xs mt-0.5 flex-shrink-0`} style={{ color: item.color }}></i>
              <span dangerouslySetInnerHTML={{ __html: item.texto }}></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
