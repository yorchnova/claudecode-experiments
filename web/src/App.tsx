import { useMemo, useState } from "react";
import { api } from "./api";
import type { RefineResult, RefineAnswers, SearchResult, Voice } from "./types";
import { VoiceCard } from "./components/VoiceCard";

type Step = "search" | "refine" | "results" | "report";

const STEPS: { id: Step; label: string }[] = [
  { id: "search", label: "Buscar" },
  { id: "refine", label: "Refinar" },
  { id: "results", label: "Voces" },
  { id: "report", label: "Informe" },
];

const EXAMPLES = [
  "Cómo construir hábitos duraderos",
  "Estoicismo para la vida moderna",
  "Empezar una startup",
  "La psicología del dinero",
  "Creatividad y proceso creativo",
];

export function App() {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [refine, setRefine] = useState<RefineResult | null>(null);
  const [answers, setAnswers] = useState<RefineAnswers>({});
  const [results, setResults] = useState<SearchResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [report, setReport] = useState<string>("");

  const selectedVoices = useMemo<Voice[]>(
    () => results?.voices.filter((v) => selected.has(v.id)) ?? [],
    [results, selected],
  );

  async function run<T>(fn: () => Promise<T>, after: (r: T) => void) {
    setLoading(true);
    setError(null);
    try {
      after(await fn());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function startSearch(q: string) {
    const value = q.trim();
    if (!value) return;
    setQuery(value);
    run(
      () => api.refine(value),
      (r) => {
        setRefine(r);
        setAnswers({});
        setStep("refine");
      },
    );
  }

  function toggleAnswer(qid: string, option: string, multi: boolean) {
    setAnswers((prev) => {
      const current = prev[qid] ?? [];
      if (multi) {
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...prev, [qid]: next };
      }
      return { ...prev, [qid]: [option] };
    });
  }

  function doSearch() {
    run(
      () => api.search(query, answers),
      (r) => {
        setResults(r);
        // Pre-selecciona las 3 más relevantes para acelerar.
        setSelected(new Set(r.voices.slice(0, 3).map((v) => v.id)));
        setStep("results");
      },
    );
  }

  function toggleVoice(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function generateReport() {
    run(
      () =>
        api.report(
          query,
          answers,
          selectedVoices.map((v) => v.id),
          selectedVoices,
        ),
      (r) => {
        setReport(r.markdown);
        setStep("report");
      },
    );
  }

  function reset() {
    setStep("search");
    setQuery("");
    setRefine(null);
    setAnswers({});
    setResults(null);
    setSelected(new Set());
    setReport("");
    setError(null);
  }

  function copyReport() {
    navigator.clipboard.writeText(report);
  }

  function downloadReport() {
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linea-de-pensamiento-${query.slice(0, 40).replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={reset} role="button" tabIndex={0}>
          🧭 <span>Línea de pensamiento</span>
        </div>
        <p className="tagline">Encuentra las voces que inspiran y educan sobre lo que buscas.</p>
      </header>

      <nav className="steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`stepchip ${i === activeIndex ? "active" : ""} ${i < activeIndex ? "done" : ""}`}>
            <span className="num">{i < activeIndex ? "✓" : i + 1}</span>
            {s.label}
          </div>
        ))}
      </nav>

      <main className="content">
        {error && <div className="error">⚠️ {error}</div>}

        {/* PASO 1 — BUSCAR */}
        {step === "search" && (
          <section className="card hero">
            <h1>¿Sobre qué tema buscas voces de referencia?</h1>
            <p className="muted">
              Escribe un concepto, una hipótesis o una idea. Te ayudaremos a encontrar académicos,
              emprendedores y creadores reconocidos que piensan, escriben o enseñan sobre ello.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                startSearch(query);
              }}
            >
              <input
                className="search-input"
                placeholder="Ej. cómo formar hábitos, liderazgo, estoicismo, marketing…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button className="btn primary" type="submit" disabled={loading || !query.trim()}>
                {loading ? "Pensando…" : "Empezar"}
              </button>
            </form>
            <div className="examples">
              <span className="muted">Prueba con:</span>
              {EXAMPLES.map((ex) => (
                <button key={ex} className="chip" onClick={() => startSearch(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* PASO 2 — REFINAR */}
        {step === "refine" && refine && (
          <section className="card">
            <h2>Afinemos tu búsqueda</h2>
            <p className="framing">{refine.framing}</p>
            {refine.detectedDomains.length > 0 && (
              <div className="voice-tags">
                {refine.detectedDomains.map((d) => (
                  <span key={d} className="tag">
                    {d}
                  </span>
                ))}
              </div>
            )}

            <div className="questions">
              {refine.questions.map((q) => (
                <fieldset key={q.id} className="question">
                  <legend>{q.question}</legend>
                  <div className="options">
                    {q.options.map((opt) => {
                      const on = (answers[q.id] ?? []).includes(opt);
                      return (
                        <button
                          key={opt}
                          className={`option ${on ? "on" : ""}`}
                          onClick={() => toggleAnswer(q.id, opt, q.multiSelect)}
                          type="button"
                        >
                          {on ? "✓ " : ""}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="actions">
              <button className="btn ghost" onClick={() => setStep("search")}>
                ← Atrás
              </button>
              <button className="btn primary" onClick={doSearch} disabled={loading}>
                {loading ? "Buscando voces…" : "Buscar voces →"}
              </button>
            </div>
          </section>
        )}

        {/* PASO 3 — RESULTADOS */}
        {step === "results" && results && (
          <section>
            <div className="results-head card">
              <div>
                <h2>Voces para «{results.query}»</h2>
                <p className="muted">
                  {results.voices.length} referentes encontrados · {results.meta.curatedCount} curados
                  {results.meta.aiCount > 0 ? ` · ${results.meta.aiCount} por IA` : ""}. Marca las que te
                  interesen.
                </p>
              </div>
              <div className="counter">{selected.size} seleccionadas</div>
            </div>

            <div className="grid">
              {results.voices.map((v) => (
                <VoiceCard
                  key={v.id}
                  voice={v}
                  selected={selected.has(v.id)}
                  onToggle={toggleVoice}
                />
              ))}
            </div>

            <div className="actions sticky">
              <button className="btn ghost" onClick={() => setStep("refine")}>
                ← Refinar
              </button>
              <button
                className="btn primary"
                onClick={generateReport}
                disabled={loading || selected.size === 0}
              >
                {loading ? "Generando informe…" : `Generar informe (${selected.size}) →`}
              </button>
            </div>
          </section>
        )}

        {/* PASO 4 — INFORME */}
        {step === "report" && (
          <section className="card">
            <div className="report-head">
              <h2>Tu línea de pensamiento</h2>
              <div className="report-actions">
                <button className="btn ghost" onClick={copyReport}>
                  📋 Copiar
                </button>
                <button className="btn primary" onClick={downloadReport}>
                  ⬇️ Descargar .md
                </button>
              </div>
            </div>
            <pre className="report">{report}</pre>
            <div className="actions">
              <button className="btn ghost" onClick={() => setStep("results")}>
                ← Volver a las voces
              </button>
              <button className="btn" onClick={reset}>
                Nueva búsqueda
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer muted">
        Guía educativa de uso libre · Las voces y obras citadas pertenecen a sus autores.
      </footer>
    </div>
  );
}
