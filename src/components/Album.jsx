// Álbum de cartas coleccionables
import React, { useState } from 'react';
import PlayerCard from './PlayerCard.jsx';

export default function Album({ cartas, onVolver }) {
  const [filtroLiga, setFiltroLiga] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('media');

  const rarezaOrden = { especial: 0, oro: 1, plata: 2, bronce: 3, normal: 4 };

  const cartasFiltradas = cartas
    .filter(c => {
      // Filtro por liga — usa el campo liga que se guarda junto a cada carta
      if (filtroLiga !== 'todas' && c.liga !== filtroLiga) return false;
      // Búsqueda por texto
      if (busqueda) {
        const b = busqueda.toLowerCase();
        return (
          (c.nombre || '').toLowerCase().includes(b) ||
          (c.nombreMostrado || '').toLowerCase().includes(b) ||
          (c.equipoNombre || '').toLowerCase().includes(b)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (orden === 'media') return (b.mediaFinal ?? b.media ?? 0) - (a.mediaFinal ?? a.media ?? 0);
      if (orden === 'rareza') return (rarezaOrden[a.rareza] ?? 4) - (rarezaOrden[b.rareza] ?? 4);
      if (orden === 'nombre') return (a.nombre || '').localeCompare(b.nombre || '');
      return 0;
    });

  const totalCartas = cartas.length;
  const especiales = cartas.filter(c => c.esEspecial || c.rareza === 'especial').length;
  const upgrades = cartas.filter(c => c.esUpgrade && !c.esEspecial).length;

  const FILTROS = [
    { key: 'todas',   label: 'Todas',       icon: 'fas fa-globe' },
    { key: 'mundial', label: 'Mundiales',   icon: 'fas fa-trophy' },
    { key: 'laliga',  label: 'La Liga',     icon: 'fas fa-futbol' },
    { key: 'premier', label: 'Premier',     icon: 'fas fa-crown' },
  ];

  return (
    <div className="min-h-screen px-3 sm:px-4 py-5 sm:py-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center gap-2 sm:gap-3 mb-5">
        <button
          onClick={onVolver}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
        >
          <i className="fas fa-arrow-left"></i> Menú
        </button>
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
          <i className="fas fa-book text-yellow-400"></i>
          Álbum de Cartas
        </h1>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        <div className="rounded-xl p-2.5 sm:p-4 text-center" style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}>
          <div className="text-xl sm:text-3xl font-black text-white">{totalCartas}</div>
          <div className="text-gray-500 text-[10px] sm:text-xs mt-1">
            <i className="fas fa-layer-group mr-1"></i>Cartas totales
          </div>
        </div>
        <div className="rounded-xl p-2.5 sm:p-4 text-center" style={{ background: '#0f1923', border: '1px solid #b040ff44' }}>
          <div className="text-xl sm:text-3xl font-black text-purple-300">{especiales}</div>
          <div className="text-gray-500 text-[10px] sm:text-xs mt-1">
            <i className="fas fa-star mr-1 text-yellow-400"></i>Legendarias
          </div>
        </div>
        <div className="rounded-xl p-2.5 sm:p-4 text-center" style={{ background: '#0f1923', border: '1px solid #0055ff44' }}>
          <div className="text-xl sm:text-3xl font-black text-blue-300">{upgrades}</div>
          <div className="text-gray-500 text-[10px] sm:text-xs mt-1">
            <i className="fas fa-arrow-up mr-1 text-blue-400"></i>Upgrades
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-48">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar jugador o equipo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
            style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {FILTROS.map(f => (
            <button
              key={f.key}
              onClick={() => setFiltroLiga(f.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                filtroLiga === f.key
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={filtroLiga === f.key
                ? { background: '#166534', border: '1px solid #22c55e' }
                : { background: '#0f1923', border: '1px solid #1e2d3d' }
              }
            >
              <i className={f.icon}></i>
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={orden}
          onChange={e => setOrden(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          style={{ background: '#0f1923', border: '1px solid #1e2d3d' }}
        >
          <option value="media">Ordenar: Media</option>
          <option value="rareza">Ordenar: Rareza</option>
          <option value="nombre">Ordenar: Nombre</option>
        </select>
      </div>

      {/* Contenido */}
      <div className="text-center py-24">
        <div className="text-2xl sm:text-4xl font-black text-yellow-300 bg-yellow-900/40 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-yellow-500/50 inline-block">
          <i className="fas fa-clock mr-3"></i>
          Próximamente...
        </div>
        <p className="text-gray-400 mt-6 max-w-md mx-auto px-4">
          El álbum completo estará disponible en futuras actualizaciones con todas tus cartas legendarias y especiales guardadas.
        </p>
      </div>
    </div>
  );
}
