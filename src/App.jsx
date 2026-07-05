// App principal — gestiona el estado global del juego y la navegación entre pantallas
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainMenu from './components/MainMenu.jsx';
import DraftScreen from './components/DraftScreen.jsx';
import LineupEditor from './components/LineupEditor.jsx';
import TournamentBracket from './components/TournamentBracket.jsx';
import Shop from './components/Shop.jsx';
import Album from './components/Album.jsx';
import CelebrationScreen from './components/CelebrationScreen.jsx';
import PenaltyShootout from './components/PenaltyShootout.jsx';

const ESTADO_INICIAL = {
  dinero: 500,
  rerollsEquipo: 5,
  rerollsJugador: 10,
  album: [],
  cartasEspeciales: [],
  torneoGanado: false,
};

const MAX_REROLLS_EQUIPO = 30;
const MAX_REROLLS_JUGADOR = 20;
const MS_POR_REROLL_EQUIPO = 30 * 60 * 1000;
const MS_POR_REROLL_JUGADOR = 15 * 60 * 1000;

function cargarEstado() {
  try {
    const guardado = localStorage.getItem('furgolero_estado');
    if (guardado) return { ...ESTADO_INICIAL, ...JSON.parse(guardado) };
  } catch (e) {}
  return { ...ESTADO_INICIAL };
}

function guardarEstado(estado) {
  try {
    localStorage.setItem('furgolero_estado', JSON.stringify(estado));
  } catch (e) {}
}

const PANTALLAS = {
  MENU: 'menu',
  DRAFT: 'draft',
  LINEUP: 'lineup',
  TOURNAMENT: 'tournament',
  CELEBRATION: 'celebration',
  SHOP: 'shop',
  ALBUM: 'album',
};

export default function App() {
  const [juego, setJuego] = useState(cargarEstado);
  const [pantalla, setPantalla] = useState(PANTALLAS.MENU);
  const [modoActual, setModoActual] = useState(null);
  const [alineacionDraft, setAlineacionDraft] = useState(null);
  const [equipoDraft, setEquipoDraft] = useState(null);
  const [asignacionesDraft, setAsignacionesDraft] = useState(null);
  const [formacionDraft, setFormacionDraft] = useState('4-3-3');
  const [alineacionFinal, setAlineacionFinal] = useState(null);
  const [formacionFinal, setFormacionFinal] = useState('4-3-3');
  const [mediaEquipoFinal, setMediaEquipoFinal] = useState(80);
  const [notificacion, setNotificacion] = useState(null);
  const [pantallaAnterior, setPantallaAnterior] = useState(PANTALLAS.MENU);

  const ultimaActualizacionRef = useRef(Date.now());

  useEffect(() => {
    guardarEstado(juego);
  }, [juego]);

  // Generación pasiva de rerolls
  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = Date.now();
      const delta = ahora - ultimaActualizacionRef.current;
      ultimaActualizacionRef.current = ahora;
      setJuego(prev => {
        const eqGanados = Math.floor(delta / MS_POR_REROLL_EQUIPO);
        const jugGanados = Math.floor(delta / MS_POR_REROLL_JUGADOR);
        if (eqGanados === 0 && jugGanados === 0) return prev;
        return {
          ...prev,
          rerollsEquipo: Math.min(MAX_REROLLS_EQUIPO, prev.rerollsEquipo + eqGanados),
          rerollsJugador: Math.min(MAX_REROLLS_JUGADOR, prev.rerollsJugador + jugGanados),
        };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const mostrarNotif = useCallback((msg, tipo = 'info') => {
    setNotificacion({ msg, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  }, []);

  function seleccionarModo(modo) {
    if (modo === 'shop') {
      setPantalla(PANTALLAS.SHOP);
      return;
    }
    setModoActual(modo);
    setPantalla(PANTALLAS.DRAFT);
  }

  function completarDraft(alineacion, equipo, asignaciones, formacion) {
    setAlineacionDraft(alineacion);
    setEquipoDraft(equipo);
    setAsignacionesDraft(asignaciones);
    setFormacionDraft(formacion);
    const nuevasCartas = alineacion.map(j => ({ ...j, liga: j.liga || modoActual }));
    setJuego(prev => {
      const albumActualizado = [...prev.album, ...nuevasCartas];
      const especiales = [...prev.cartasEspeciales];
      nuevasCartas.forEach(c => {
        if (c.esEspecial && c.equipoId && !especiales.includes(c.equipoId)) {
          especiales.push(c.equipoId);
          mostrarNotif(`Carta LEGENDARIA de ${c.equipoNombre} guardada!`, 'especial');
        }
      });
      return { ...prev, album: albumActualizado, cartasEspeciales: especiales };
    });
    setPantalla(PANTALLAS.LINEUP);
  }

  function confirmarAlineacion(alineacion, formacion, media) {
    setAlineacionFinal(alineacion);
    setFormacionFinal(formacion);
    setMediaEquipoFinal(media);
    setPantalla(PANTALLAS.TOURNAMENT);
  }

  function ganarRonda(premio, ronda) {
    setJuego(prev => ({ ...prev, dinero: prev.dinero + premio }));
    const nombres = { octavos: 'octavos', cuartos: 'cuartos', semis: 'semifinales', final: 'la FINAL' };
    mostrarNotif(`+${premio} monedas por ganar ${nombres[ronda] || ronda}!`, 'exito');
  }

  function ganarTorneo() {
    setJuego(prev => ({ ...prev, torneoGanado: true }));
    setPantalla(PANTALLAS.CELEBRATION);
  }

  function perderTorneo() {
    mostrarNotif('Sigue intentándolo. Tus cartas están guardadas.', 'info');
    setPantalla(PANTALLAS.MENU);
  }

  function volverAlMenu() {
    setPantalla(PANTALLAS.MENU);
    setModoActual(null);
    setAlineacionDraft(null);
    setEquipoDraft(null);
    setAlineacionFinal(null);
    setAsignacionesDraft(null);
  }

  function abrirPantalla(pantallaNueva) {
    setPantallaAnterior(pantalla);
    setPantalla(pantallaNueva);
  }

  function comprarEnTienda(tipo, precio) {
    setJuego(prev => {
      const nuevoDinero = prev.dinero - precio;
      let nuevoRerollsEq = prev.rerollsEquipo;
      let nuevoRerollsJug = prev.rerollsJugador;
      if (tipo === 'rerollEquipo') nuevoRerollsEq = Math.min(MAX_REROLLS_EQUIPO, nuevoRerollsEq + 1);
      if (tipo === 'rerollJugador') nuevoRerollsJug = Math.min(MAX_REROLLS_JUGADOR, nuevoRerollsJug + 1);
      return { ...prev, dinero: nuevoDinero, rerollsEquipo: nuevoRerollsEq, rerollsJugador: nuevoRerollsJug };
    });
  }

  function anadirAlAlbum(carta) {
    setJuego(prev => {
      const especiales = [...prev.cartasEspeciales];
      if (carta.esEspecial && carta.equipoId && !especiales.includes(carta.equipoId)) {
        especiales.push(carta.equipoId);
        mostrarNotif(`Carta LEGENDARIA de ${carta.equipoNombre || carta.nombre}!`, 'especial');
      }
      return {
        ...prev,
        album: [...prev.album, { ...carta, liga: carta.liga || modoActual || 'desconocido' }],
        cartasEspeciales: especiales,
      };
    });
  }

  function gastarRerollEquipo() {
    setJuego(prev => ({ ...prev, rerollsEquipo: Math.max(0, prev.rerollsEquipo - 1) }));
  }

  function gastarRerollJugador() {
    setJuego(prev => ({ ...prev, rerollsJugador: Math.max(0, prev.rerollsJugador - 1) }));
  }

  const mostrarNav = pantalla !== PANTALLAS.MENU && pantalla !== PANTALLAS.CELEBRATION;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Barra de navegación superior */}
      {mostrarNav && (
        <nav
          className="sticky top-0 z-40 px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-4"
          style={{ background: '#060d14', borderBottom: '1px solid #0f1e2e' }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 font-black text-sm sm:text-lg text-white flex-shrink-0">
            <i className="fas fa-futbol text-green-400"></i>
            <span className="hidden xs:inline">FURGOLERO</span>
          </div>

          <div className="flex gap-1 sm:gap-3 ml-auto items-center flex-wrap justify-end">
            {/* Monedas */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm"
              style={{ background: '#1a1200', border: '1px solid #3d2d00' }}>
              <i className="fas fa-coins text-yellow-400"></i>
              <span className="text-yellow-300 font-bold">{juego.dinero}</span>
            </div>
            {/* Rerolls equipo */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg text-xs sm:text-sm"
              style={{ background: '#10142a', border: '1px solid #1e2860' }}>
              <i className="fas fa-exchange-alt text-purple-400 text-xs"></i>
              <span className="text-purple-300 font-bold text-xs sm:text-sm">{juego.rerollsEquipo}</span>
            </div>
            {/* Rerolls jugadores */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg text-xs sm:text-sm"
              style={{ background: '#0a1a1a', border: '1px solid #0f3535' }}>
              <i className="fas fa-dice text-teal-400 text-xs"></i>
              <span className="text-teal-300 font-bold text-xs sm:text-sm">{juego.rerollsJugador}</span>
            </div>

            <button
              onClick={() => abrirPantalla(PANTALLAS.SHOP)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-lg font-semibold transition-all hover:brightness-125 active:scale-95"
              style={{ background: '#3d2800', border: '1px solid #7a5000', color: '#ffc107' }}
            >
              <i className="fas fa-store"></i>
              <span className="hidden sm:inline">Tienda</span>
            </button>
            {/* 
        <button
          onClick={() => abrirPantalla(PANTALLAS.ALBUM)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded font-bold text-xs sm:text-sm shadow-md transition-all ${
            pantalla === PANTALLAS.ALBUM ? 'bg-indigo-600 text-white shadow-indigo-900/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <i className="fas fa-book"></i>
          <span className="hidden sm:inline">Álbum</span> <span className="opacity-60">({juego.album.length})</span>
        </button>
        */}
            <button
              onClick={volverAlMenu}
              className="text-gray-600 hover:text-gray-400 transition-colors text-sm px-0.5"
              title="Volver al menú"
            >
              <i className="fas fa-home"></i>
            </button>
          </div>
        </nav>
      )}

      {/* Notificación flotante */}
      {notificacion && (
        <div className={`
          fixed top-16 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm shadow-xl
          transition-all duration-300
          ${notificacion.tipo === 'especial'
            ? 'text-black animate-pulse'
            : notificacion.tipo === 'exito'
              ? 'bg-green-900 text-green-200 border border-green-700'
              : 'bg-blue-950 text-blue-200 border border-blue-800'}
        `}
          style={notificacion.tipo === 'especial'
            ? { background: 'linear-gradient(135deg, #ffd700, #ffaa00)', border: '1px solid #ff8800' }
            : {}
          }
        >
          <i className={`fas ${notificacion.tipo === 'especial' ? 'fa-star' : notificacion.tipo === 'exito' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
          {notificacion.msg}
        </div>
      )}

      {/* Pantallas */}
      {pantalla === PANTALLAS.MENU && (
        <MainMenu
          onSeleccionarModo={seleccionarModo}
          estadisticas={{
            dinero: juego.dinero,
            rerollsEquipo: juego.rerollsEquipo,
            rerollsJugador: juego.rerollsJugador,
            cartasAlbum: juego.album.length,
          }}
        />
      )}

      {pantalla === PANTALLAS.DRAFT && modoActual && (
        <DraftScreen
          modo={modoActual}
          rerollsEquipo={juego.rerollsEquipo}
          rerollsJugador={juego.rerollsJugador}
          onGastarRerollEquipo={gastarRerollEquipo}
          onGastarRerollJugador={gastarRerollJugador}
          onCompletarAlineacion={completarDraft}
          cartasEspeciales={juego.cartasEspeciales}
        />
      )}

      {pantalla === PANTALLAS.LINEUP && alineacionDraft && (
        <LineupEditor
          jugadores={alineacionDraft}
          asignacionesIniciales={asignacionesDraft}
          formacionInicial={formacionDraft}
          onConfirmar={confirmarAlineacion}
          onVolver={() => setPantalla(PANTALLAS.DRAFT)}
        />
      )}

      {pantalla === PANTALLAS.TOURNAMENT && alineacionFinal && (
        <TournamentBracket
          modo={modoActual}
          mediaJugador={mediaEquipoFinal}
          equipo={equipoDraft}
          formacion={formacionFinal}
          jugadoresLocal={alineacionFinal}
          onGanarTorneo={ganarTorneo}
          onPerderTorneo={perderTorneo}
          onGanarRonda={ganarRonda}
          onVolver={volverAlMenu}
        />
      )}

      {pantalla === PANTALLAS.CELEBRATION && (
        <CelebrationScreen
          equipo={equipoDraft}
          modo={modoActual}
          onContinuar={volverAlMenu}
        />
      )}

      {pantalla === PANTALLAS.SHOP && (
        <Shop
          dinero={juego.dinero}
          rerollsEquipo={juego.rerollsEquipo}
          rerollsJugador={juego.rerollsJugador}
          onComprar={comprarEnTienda}
          onAnadirAlAlbum={anadirAlAlbum}
          onVolver={() => setPantalla(pantallaAnterior || PANTALLAS.MENU)}
        />
      )}

      {pantalla === PANTALLAS.ALBUM && (
        <Album
          cartas={juego.album}
          onVolver={() => setPantalla(pantallaAnterior || PANTALLAS.MENU)}
        />
      )}


    </div>
  );
}
