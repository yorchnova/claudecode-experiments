// Menú principal: grilla de íconos gigantes, un dibujo por juego, cero texto necesario.
import { useEffect, useState } from 'react';
import { GAMES } from '../games/registry';
import { isMuted, neutral, pop, setMuted } from '../lib/audio';
import { speak } from '../lib/speech';

export function Menu({ onPlay }: { onPlay: (gameId: string) => void }) {
  const [muted, setMutedState] = useState(isMuted());

  useEffect(() => {
    speak('¡Hola, Jaci! ¿A qué quieres jugar?');
  }, []);

  const handleTile = (id: string, available: boolean, spokenName: string) => {
    if (!available) {
      neutral();
      speak('Este juego todavía está durmiendo. ¡Muy pronto va a despertar!');
      return;
    }
    pop();
    speak(spokenName);
    onPlay(id);
  };

  return (
    <div className="menu-screen">
      <header className="menu-header">
        <span className="menu-rainbow" aria-hidden="true">
          🌈
        </span>
        <h1 className="menu-title">Jaci</h1>
        <button
          className={`round-btn small ${muted ? 'muted' : ''}`}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          onClick={() => {
            const next = !muted;
            setMuted(next);
            setMutedState(next);
            if (!next) pop();
          }}
        >
          {muted ? '🔇' : '🎶'}
        </button>
      </header>

      <div className="menu-grid">
        {GAMES.map((game) => (
          <button
            key={game.id}
            className={`game-tile ${game.available ? '' : 'locked'}`}
            style={{ background: game.color }}
            aria-label={game.spokenName}
            onClick={() => handleTile(game.id, game.available, game.spokenName)}
          >
            <span className="tile-icon">{game.icon}</span>
            {!game.available && (
              <span className="tile-lock" aria-hidden="true">
                🔒
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
