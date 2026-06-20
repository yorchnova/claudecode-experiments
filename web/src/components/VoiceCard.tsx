import type { Voice } from "../types";

const WORK_ICON: Record<string, string> = {
  book: "📖",
  podcast: "🎧",
  course: "🎓",
  essay: "✍️",
  talk: "🎤",
  newsletter: "📬",
};

interface Props {
  voice: Voice;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function VoiceCard({ voice, selected, onToggle }: Props) {
  return (
    <article className={`card voice ${selected ? "is-selected" : ""}`}>
      <header className="voice-head">
        <div>
          <h3>{voice.name}</h3>
          <p className="voice-title">{voice.title}</p>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(voice.id)}
            aria-label={`Seleccionar a ${voice.name}`}
          />
          <span>{selected ? "Seleccionada" : "Seleccionar"}</span>
        </label>
      </header>

      {voice.source === "ai" && <span className="badge badge-ai">sugerida por IA</span>}

      <p className="voice-relevance">{voice.relevance ?? voice.summary}</p>
      <p className="voice-thesis">
        <strong>Idea central:</strong> {voice.thesis}
      </p>

      <ul className="voice-works">
        {voice.keyWorks.map((w, i) => (
          <li key={i}>
            <span className="work-icon">{WORK_ICON[w.type] ?? "•"}</span> {w.title}
            {w.year ? ` (${w.year})` : ""}
          </li>
        ))}
      </ul>

      <div className="voice-tags">
        {voice.domains.map((d) => (
          <span key={d} className="tag">
            {d}
          </span>
        ))}
      </div>
    </article>
  );
}
