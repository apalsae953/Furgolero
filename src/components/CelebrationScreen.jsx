// Pantalla de celebración al ganar el torneo
import React, { useEffect, useState } from 'react';

export default function CelebrationScreen({ equipo, modo, onContinuar }) {
  const [confettis, setConfettis] = useState([]);

  useEffect(() => {
    const cols = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const nuevos = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: cols[Math.floor(Math.random() * cols.length)],
      size: 8 + Math.random() * 12,
      speed: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
    }));
    setConfettis(nuevos);
  }, []);

  let titulo = '¡CAMPEÓN!';
  if (modo === 'mundial') titulo = '¡CAMPEÓN DEL MUNDO!';
  else if (modo === 'premier') titulo = '¡CAMPEÓN DE LA FA CUP!';
  else if (modo === 'laliga') titulo = '¡CAMPEÓN DE LA COPA DEL REY!';
  else titulo = '¡CAMPEÓN DE LA CHAMPIONS!';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-900 via-yellow-800 to-amber-900 relative overflow-hidden px-4">
      {confettis.map(c => (
        <div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${c.rotation}deg)`,
            animation: `fall ${c.speed}s linear ${Math.random() * 2}s infinite`,
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.3; }
        }
      `}</style>

      <div className="text-center z-10 max-w-lg">
        <div className="mb-3 sm:mb-4">
          <i className="fas fa-trophy text-yellow-300 text-6xl sm:text-7xl md:text-8xl drop-shadow-xl text-gol"></i>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-yellow-300 text-gol mb-2">
          {titulo}
        </h1>
        <p className="text-yellow-200 text-sm sm:text-lg mb-6 sm:mb-8 mt-2">
          ¡Lo has conseguido! Eres el mejor.
        </p>
        <button
          onClick={onContinuar}
          className="btn-dorado text-base sm:text-xl px-8 sm:px-12 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 mx-auto"
        >
          <i className="fas fa-home"></i>
          Volver al menú
        </button>
      </div>
    </div>
  );
}
