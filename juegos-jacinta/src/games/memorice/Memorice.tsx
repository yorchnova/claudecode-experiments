// Memorice Sonoro: memorice de pares donde cada animal tiene su nombre narrado
// y su propio motivo musical, para que la memoria trabaje por ojo y por oído.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TopBar } from '../../components/TopBar';
import { Confetti } from '../../lib/Confetti';
import { fanfare, flip, match as matchSound, neutral, playMotif, pop } from '../../lib/audio';
import { randomPraise, speak } from '../../lib/speech';

interface Animal {
  id: string;
  emoji: string;
  /** Con artículo, para narrar al revelar: "¡El gato!" */
  name: string;
  /** En plural, para celebrar el par: "¡Los gatos!" */
  plural: string;
}

const ANIMALS: Animal[] = [
  { id: 'gato', emoji: '🐱', name: 'El gato', plural: 'los gatos' },
  { id: 'perro', emoji: '🐶', name: 'El perro', plural: 'los perros' },
  { id: 'pato', emoji: '🦆', name: 'El pato', plural: 'los patos' },
  { id: 'vaca', emoji: '🐮', name: 'La vaca', plural: 'las vacas' },
  { id: 'rana', emoji: '🐸', name: 'La rana', plural: 'las ranas' },
  { id: 'leon', emoji: '🦁', name: 'El león', plural: 'los leones' },
  { id: 'pollito', emoji: '🐥', name: 'El pollito', plural: 'los pollitos' },
  { id: 'conejo', emoji: '🐰', name: 'El conejo', plural: 'los conejos' },
  { id: 'pez', emoji: '🐟', name: 'El pez', plural: 'los peces' },
  { id: 'chancho', emoji: '🐷', name: 'El chanchito', plural: 'los chanchitos' },
];

type Difficulty = 'pocas' | 'muchas';
type Phase = 'pick' | 'play' | 'won';

interface Card {
  key: number;
  animal: Animal;
  state: 'down' | 'up' | 'matched';
  /** true justo cuando se acierta, para la animación de estrellas. */
  justMatched: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck(difficulty: Difficulty): Card[] {
  const pairCount = difficulty === 'pocas' ? 3 : 6;
  const chosen = shuffle(ANIMALS).slice(0, pairCount);
  const cards = chosen.flatMap((animal, i) => [
    { key: i * 2, animal, state: 'down' as const, justMatched: false },
    { key: i * 2 + 1, animal, state: 'down' as const, justMatched: false },
  ]);
  return shuffle(cards);
}

const INSTRUCTIONS = {
  pick: '¿Quieres jugar con pocas cartas, o con muchas cartas? Toca la que quieras.',
  play: 'Encuentra las parejas de animales. Toca una carta para darla vuelta.',
  won: '¡Lo lograste, Jaci! ¡Encontraste todas las parejas! Toca la flecha para jugar de nuevo.',
};

export function Memorice({ onHome }: { onHome: () => void }) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [difficulty, setDifficulty] = useState<Difficulty>('pocas');
  const [cards, setCards] = useState<Card[]>([]);
  const [busy, setBusy] = useState(false);
  const timeouts = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timeouts.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    speak(INSTRUCTIONS[phase]);
    // La consigna se narra al entrar a cada fase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startGame = (diff: Difficulty) => {
    pop();
    setDifficulty(diff);
    setCards(buildDeck(diff));
    setBusy(false);
    setPhase('play');
  };

  const upCards = useMemo(() => cards.filter((c) => c.state === 'up'), [cards]);

  const handleCardClick = (card: Card) => {
    if (busy || card.state !== 'down' || upCards.length >= 2) return;

    flip();
    playMotif(card.animal.id);
    speak(`¡${card.animal.name}!`);
    const revealed = cards.map((c) => (c.key === card.key ? { ...c, state: 'up' as const } : c));
    setCards(revealed);

    const nowUp = revealed.filter((c) => c.state === 'up');
    if (nowUp.length < 2) return;

    setBusy(true);
    const [a, b] = nowUp;
    if (a.animal.id === b.animal.id) {
      later(() => {
        matchSound();
        speak(`${randomPraise()} ¡${a.animal.plural}!`);
        setCards((prev) =>
          prev.map((c) =>
            c.state === 'up' ? { ...c, state: 'matched' as const, justMatched: true } : c,
          ),
        );
        setBusy(false);
      }, 450);
    } else {
      later(() => {
        neutral();
        setCards((prev) =>
          prev.map((c) => (c.state === 'up' ? { ...c, state: 'down' as const } : c)),
        );
        setBusy(false);
      }, 1400);
    }
  };

  // Victoria: todas las cartas emparejadas.
  useEffect(() => {
    if (phase === 'play' && cards.length > 0 && cards.every((c) => c.state === 'matched')) {
      later(() => {
        fanfare();
        setPhase('won');
      }, 700);
    }
  }, [cards, phase, later]);

  const repeatInstruction = () => speak(INSTRUCTIONS[phase]);

  return (
    <div className="game-screen">
      <TopBar onHome={onHome} onRepeat={repeatInstruction} />

      {phase === 'pick' && (
        <div className="difficulty-picker">
          <div className="picker-title" aria-hidden="true">
            🐱🐶🐰
          </div>
          <div className="picker-options">
            <button className="picker-card" onClick={() => startGame('pocas')} aria-label="Pocas cartas">
              <div className="mini-grid few">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <span className="picker-emoji">🐥</span>
            </button>
            <button className="picker-card" onClick={() => startGame('muchas')} aria-label="Muchas cartas">
              <div className="mini-grid many">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <span className="picker-emoji">🦁</span>
            </button>
          </div>
        </div>
      )}

      {(phase === 'play' || phase === 'won') && (
        <div className={`board ${difficulty}`}>
          {cards.map((card) => (
            <button
              key={card.key}
              className={`card ${card.state} ${card.justMatched ? 'just-matched' : ''}`}
              onClick={() => handleCardClick(card)}
              disabled={phase === 'won'}
              aria-label={card.state === 'down' ? 'Carta escondida' : card.animal.name}
            >
              <span className="card-inner">
                <span className="card-face card-back">❓</span>
                <span className="card-face card-front">{card.animal.emoji}</span>
              </span>
              {card.justMatched && (
                <span className="sparkles" aria-hidden="true">
                  <i>✨</i>
                  <i>⭐</i>
                  <i>✨</i>
                  <i>🌟</i>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {phase === 'won' && (
        <div className="win-overlay">
          <div className="win-card">
            <div className="win-emoji">🎉</div>
            <div className="win-stars" aria-hidden="true">
              ⭐⭐⭐
            </div>
            <button
              className="replay-btn"
              aria-label="Jugar de nuevo"
              onClick={() => {
                pop();
                setPhase('pick');
                setCards([]);
              }}
            >
              🔁
            </button>
          </div>
        </div>
      )}

      <Confetti active={phase === 'won'} />
    </div>
  );
}
