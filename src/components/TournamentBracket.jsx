// Vista del torneo: bracket, rival actual y resultado
import React, { useState, useEffect } from 'react';
import { RONDAS, RONDAS_NOMBRE, PREMIOS_RONDA, siguienteRonda, getMediaRival } from '../utils/tournamentEngine.js';
import { generarEquipoIA, getMediaObjetivoRonda } from '../utils/draftEngine.js';
import MatchSimulator from './MatchSimulator.jsx';

function colorDistance(c1, c2) {
  const n1 = parseInt((c1 || '#000').replace('#', ''), 16);
  const n2 = parseInt((c2 || '#000').replace('#', ''), 16);
  const r1 = (n1 >> 16) & 0xff, g1 = (n1 >> 8) & 0xff, b1 = n1 & 0xff;
  const r2 = (n2 >> 16) & 0xff, g2 = (n2 >> 8) & 0xff, b2 = n2 & 0xff;
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function getContrastVisit(localColor, visitColor) {
  if (colorDistance(localColor, visitColor) >= 90) return visitColor;
  const alts = ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#06b6d4', '#f97316', '#ffffff'];
  return alts.find(c => colorDistance(localColor, c) >= 90) || '#ef4444';
}

export default function TournamentBracket({
  modo,
  mediaJugador,
  equipo,
  formacion,
  jugadoresLocal,
  onGanarTorneo,
  onPerderTorneo,
  onGanarRonda,
  onVolver,
}) {
  const [rondaActual, setRondaActual] = useState('octavos');
  const [historial, setHistorial] = useState([]);
  const [rivalActual, setRivalActual] = useState(null);
  const [estadoPartido, setEstadoPartido] = useState('pendiente'); // 'pendiente' | 'jugando' | 'ganado' | 'perdido'
  const [resultadoPartido, setResultadoPartido] = useState(null);
  const [equiposUsadosIA, setEquiposUsadosIA] = useState([]);

  // Generar rival para la ronda actual
  useEffect(() => {
    if (estadoPartido === 'pendiente') {
      const mediaObj = getMediaObjetivoRonda(rondaActual, mediaJugador);
      const ia = generarEquipoIA(modo, mediaObj, equiposUsadosIA);
      setRivalActual(ia);
    }
  }, [rondaActual, estadoPartido]);

  function comenzarPartido() {
    setEstadoPartido('jugando');
  }

  function onPartidoTerminado(golesLocal, golesVisitante, penaltisL, penaltisV) {
    const gano = penaltisL !== undefined ? penaltisL > penaltisV : golesLocal > golesVisitante;
    const resultado = {
      ronda: rondaActual,
      rival: rivalActual?.equipo?.nombre || '?',
      golesLocal,
      golesVisitante,
      penaltisL,
      penaltisV,
      gano,
    };
    setResultadoPartido(resultado);
    setHistorial(prev => [...prev, resultado]);

    if (gano) {
      setEstadoPartido('ganado');
      onGanarRonda?.(PREMIOS_RONDA[rondaActual], rondaActual);
    } else {
      setEstadoPartido('perdido');
    }
  }

  function continuarTorneo() {
    const siguiente = siguienteRonda(rondaActual);
    if (!siguiente) {
      // ¡Campeón!
      onGanarTorneo?.();
    } else {
      if (rivalActual?.equipo) {
        setEquiposUsadosIA(prev => [...prev, rivalActual.equipo.id]);
      }
      setRondaActual(siguiente);
      setEstadoPartido('pendiente');
      setResultadoPartido(null);
      setRivalActual(null);
    }
  }

  const rondaIdx = RONDAS.indexOf(rondaActual);
  const mediaRival = rivalActual ? Math.round(rivalActual.mediaReal ?? mediaJugador) : getMediaRival(rondaActual, mediaJugador);

  const equipoNombreJugador = 'Tú';
  const colorVisit = rivalActual?.equipo?.color || '#ef4444';
  const colorLocal = getContrastVisit(colorVisit, equipo?.color || '#3b82f6');

  return (
    <div className="min-h-screen px-3 sm:px-4 py-5 sm:py-6 max-w-3xl mx-auto">
      <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4">
        <button onClick={onVolver} className="text-gray-400 hover:text-white text-xs sm:text-sm">← Menú</button>
        <h1 className="text-lg sm:text-2xl font-black text-white">
          <i className={`fas ${modo === 'mundial' ? 'fa-globe' : 'fa-trophy'} mr-2 text-yellow-400`}></i>
          {modo === 'mundial' ? 'Mundial' : modo === 'laliga' ? 'Copa del Rey' : modo === 'premier' ? 'FA Cup' : 'Champions League'}
        </h1>
      </div>

      {/* Bracket visual */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {RONDAS.map((ronda, idx) => {
          const histRonda = historial.find(h => h.ronda === ronda);
          const esCurrent = ronda === rondaActual;
          const yaJugada = histRonda !== undefined;
          const ganada = histRonda?.gano;

          return (
            <div key={ronda} className="flex items-center gap-1 flex-shrink-0">
              <div
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  esCurrent
                    ? 'bg-yellow-600 text-black scale-105'
                    : yaJugada
                      ? ganada ? 'bg-green-800 text-green-300' : 'bg-red-900 text-red-300'
                      : 'bg-gray-800 text-gray-500'
                }`}
              >
                <div>{RONDAS_NOMBRE[ronda]}</div>
                {yaJugada && (
                  <div className="text-center mt-1">
                    <i className={`fas ${ganada ? 'fa-check' : 'fa-times'} mr-1`}></i>
                    {histRonda.golesLocal}-{histRonda.golesVisitante}
                  </div>
                )}
                {esCurrent && !yaJugada && (
                  <div className="text-center mt-1">
                    <i className="fas fa-play text-xs"></i> Ahora
                  </div>
                )}
              </div>
              {idx < RONDAS.length - 1 && <div className="text-gray-600 text-lg">›</div>}
            </div>
          );
        })}
      </div>

      {/* Estado del partido */}
      {estadoPartido === 'pendiente' && rivalActual && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-6 text-center">
          <div className="text-yellow-400 font-black text-base sm:text-xl mb-3 sm:mb-4">{RONDAS_NOMBRE[rondaActual]}</div>
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="text-center w-24 sm:w-32 min-w-0">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-black text-sm sm:text-xl mx-auto mb-2"
                style={{ background: colorLocal }}
              >
                TÚ
              </div>
              <div className="text-white font-bold text-sm sm:text-base truncate">{equipoNombreJugador}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Media: {mediaJugador}</div>
            </div>
            <div className="text-white font-black text-lg sm:text-3xl flex-shrink-0">VS</div>
            <div className="text-center w-24 sm:w-32 min-w-0">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-black text-sm sm:text-xl mx-auto mb-2"
                style={{ background: colorVisit }}
              >
                {(rivalActual?.equipo?.abrev || 'IA').slice(0, 3)}
              </div>
              <div className="text-white font-bold text-sm sm:text-base truncate">{rivalActual?.equipo?.nombre || 'Rival IA'}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Media: {Math.round(rivalActual?.mediaReal || mediaRival)}</div>
              {rivalActual?.equipo?.anio && (
                <div className="text-gray-500 text-xs truncate">{rivalActual.equipo.pais} {rivalActual.equipo.anio}</div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold mb-3 sm:mb-4 text-sm sm:text-base">
            <i className="fas fa-coins"></i>
            Premio: {PREMIOS_RONDA[rondaActual]} monedas
          </div>
          <button onClick={comenzarPartido} className="btn-principal text-base sm:text-xl px-6 sm:px-10 py-3 sm:py-4 flex items-center gap-2 mx-auto">
            <i className="fas fa-futbol"></i> ¡JUGAR!
          </button>
        </div>
      )}

      {estadoPartido === 'pendiente' && !rivalActual && (
        <div className="text-center py-10">
          <div className="text-gray-400">Preparando rival...</div>
        </div>
      )}

      {/* Simulación en curso */}
      {estadoPartido === 'jugando' && (
        <MatchSimulator
          equipoLocal="Tú"
          equipoVisitante={rivalActual?.equipo?.nombre || 'Rival'}
          equipoVisitanteId={rivalActual?.equipo?.id}
          mediaLocal={mediaJugador}
          mediaVisitante={Math.round(rivalActual?.mediaReal || mediaRival)}
          formacionLocal={formacion}
          formacionVisitante="4-3-3"
          colorLocal={colorLocal}
          colorVisitante={colorVisit}
          jugadoresLocal={jugadoresLocal}
          jugadoresVisitante={rivalActual?.jugadores || []}
          onPartidoTerminado={onPartidoTerminado}
        />
      )}

      {/* Resultado */}
      {(estadoPartido === 'ganado' || estadoPartido === 'perdido') && resultadoPartido && (
        <div
          className={`bg-gray-900 border rounded-2xl p-4 sm:p-8 text-center ${
            estadoPartido === 'ganado' ? 'border-green-500' : 'border-red-500'
          }`}
        >
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">
            <i className={`fas ${estadoPartido === 'ganado' ? 'fa-trophy text-yellow-400' : 'fa-times-circle text-red-500'}`}></i>
          </div>
          <div className={`text-xl sm:text-3xl font-black mb-2 ${estadoPartido === 'ganado' ? 'text-green-400' : 'text-red-400'}`}>
            {estadoPartido === 'ganado' ? '¡VICTORIA!' : 'ELIMINADO'}
          </div>
          <div className="text-white text-lg sm:text-2xl font-bold mb-1 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {resultadoPartido.golesLocal} — {resultadoPartido.golesVisitante}
            {resultadoPartido.penaltisL !== undefined && (
               <span className="text-xs sm:text-sm bg-gray-800 px-2 py-1 rounded text-yellow-400 border border-yellow-500/30">
                 ({resultadoPartido.penaltisL}-{resultadoPartido.penaltisV} pen)
               </span>
            )}
          </div>
          <div className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base truncate">
            vs {resultadoPartido.rival}
          </div>

          {estadoPartido === 'ganado' && (
            <>
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                <i className="fas fa-coins"></i>
                +{PREMIOS_RONDA[rondaActual]} monedas ganadas
              </div>
              {siguienteRonda(rondaActual) ? (
                <button onClick={continuarTorneo} className="btn-principal text-base sm:text-xl px-6 sm:px-10 flex items-center gap-2 mx-auto">
                  Siguiente ronda <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button onClick={onGanarTorneo} className="btn-dorado text-base sm:text-xl px-6 sm:px-10 flex items-center gap-2 mx-auto">
                  <i className="fas fa-trophy"></i> ¡CAMPEÓN! Ver celebración
                </button>
              )}
            </>
          )}

          {estadoPartido === 'perdido' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-xs sm:text-sm">
                Tus cartas especiales se han guardado en el álbum.
              </p>
              <button onClick={onPerderTorneo} className="btn-secundario text-base sm:text-lg px-6 sm:px-8">
                Volver al menú
              </button>
            </div>
          )}
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && estadoPartido === 'pendiente' && (
        <div className="mt-6 bg-gray-900 rounded-xl p-3 sm:p-4">
          <h3 className="text-white font-bold mb-2 text-sm">Historial de partidos</h3>
          {historial.map((h, i) => (
            <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-1 border-b border-gray-800 flex-wrap">
              <span className={h.gano ? 'text-green-400' : 'text-red-400'}>{h.gano ? '✅' : '❌'}</span>
              <span className="text-gray-300">{RONDAS_NOMBRE[h.ronda]}</span>
              <span className="text-white font-bold flex items-center gap-1">
                 {h.golesLocal}-{h.golesVisitante}
                 {h.penaltisL !== undefined && <span className="text-[10px] sm:text-xs text-yellow-500 bg-yellow-500/10 px-1 rounded">({h.penaltisL}-{h.penaltisV} p)</span>}
              </span>
              <span className="text-gray-500 truncate">vs {h.rival}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
