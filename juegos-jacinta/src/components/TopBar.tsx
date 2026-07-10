// Barra superior siempre visible dentro de un juego: 🏠 volver, 🔊 repetir consigna, 🔇 silencio.
import { useState } from 'react';
import { isMuted, setMuted, pop } from '../lib/audio';
import { stopSpeaking } from '../lib/speech';

interface TopBarProps {
  onHome: () => void;
  onRepeat: () => void;
}

export function TopBar({ onHome, onRepeat }: TopBarProps) {
  const [muted, setMutedState] = useState(isMuted());

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) pop();
  };

  return (
    <div className="top-bar">
      <button
        className="round-btn"
        aria-label="Volver al menú"
        onClick={() => {
          stopSpeaking();
          pop();
          onHome();
        }}
      >
        🏠
      </button>
      <div className="top-bar-right">
        <button
          className="round-btn"
          aria-label="Repetir instrucción"
          onClick={() => {
            pop();
            onRepeat();
          }}
        >
          🔊
        </button>
        <button
          className={`round-btn small ${muted ? 'muted' : ''}`}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          onClick={toggleMute}
        >
          {muted ? '🔇' : '🎶'}
        </button>
      </div>
    </div>
  );
}
