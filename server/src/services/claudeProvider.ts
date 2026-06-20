import type {
  ThoughtProvider,
  RefineResult,
  SearchRequest,
  SearchResult,
  ReportRequest,
  ReportResult,
  Voice,
} from "../types.js";
import { VOICES, VOICE_BY_ID } from "../data/voices.js";
import { MockProvider } from "./mockProvider.js";
import { buildMarkdownReport } from "../lib/report.js";

const API_URL = "https://api.anthropic.com/v1/messages";

/**
 * Proveedor con IA (Claude). Implementa el lado "IA" del modelo híbrido:
 * la base curada siempre se incluye y Claude la complementa con más voces y
 * con la relevancia/encuadre redactados a medida.
 *
 * Se activa cuando AI_PROVIDER=claude y ANTHROPIC_API_KEY está definida.
 * Si la llamada falla, hace fallback al proveedor mock para no romper la app.
 *
 * Nota: la capa "web en tiempo real" del híbrido puede añadirse aquí más
 * adelante habilitando la herramienta de búsqueda web de la API (tools:
 * web_search). Ver README.
 */
export class ClaudeProvider implements ThoughtProvider {
  readonly name = "claude";
  private fallback = new MockProvider();
  private model: string;
  private apiKey: string;

  constructor(apiKey: string, model = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6") {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async call(system: string, user: string, maxTokens = 2000): Promise<string> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as { content: Array<{ type: string; text?: string }> };
    return data.content.map((c) => c.text ?? "").join("");
  }

  /** Extrae el primer bloque JSON de una respuesta del modelo. */
  private parseJson<T>(text: string): T {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    return JSON.parse(raw) as T;
  }

  async refine(query: string): Promise<RefineResult> {
    try {
      const system =
        "Eres el guía de 'Línea de pensamiento', una herramienta educativa que ayuda a " +
        "encontrar referentes (académicos, emprendedores, creadores) sobre un tema. " +
        "Tu tarea: encuadrar el tema y proponer preguntas de refinamiento. " +
        "Responde SOLO con JSON válido, sin texto adicional.";
      const user = `Tema buscado: "${query}".
Devuelve JSON con esta forma exacta:
{
  "framing": "2-3 frases que encuadren el tema y por qué importa, en español",
  "detectedDomains": ["3 a 5 áreas en una palabra"],
  "questions": [
    {"id": "perspective", "question": "...", "options": ["...","..."], "multiSelect": true},
    {"id": "format", "question": "...", "options": ["...","..."], "multiSelect": true},
    {"id": "level", "question": "...", "options": ["...","..."], "multiSelect": false}
  ]
}
Genera 3 preguntas útiles para afinar la búsqueda de voces.`;
      const out = await this.call(system, user, 1200);
      return this.parseJson<RefineResult>(out);
    } catch (err) {
      console.warn("[claude] refine falló, usando fallback:", (err as Error).message);
      return this.fallback.refine(query);
    }
  }

  async search(req: SearchRequest): Promise<SearchResult> {
    // 1) Base curada (siempre presente).
    const curated = await this.fallback.search(req);

    // 2) Voces sugeridas por IA, evitando duplicar las curadas.
    try {
      const exclude = curated.voices.map((v) => v.name).join(", ");
      const answers = req.answers
        ? Object.values(req.answers).flat().join("; ")
        : "sin preferencias indicadas";
      const system =
        "Eres un investigador riguroso. Propones referentes REALES y reconocidos " +
        "(no inventes personas ni obras). Si no estás seguro de un dato, omítelo. " +
        "Responde SOLO con JSON válido.";
      const user = `Tema: "${req.query}". Preferencias del usuario: ${answers}.
Ya tenemos en la lista: ${exclude}.
Propón hasta 4 referentes adicionales REALES, distintos a los anteriores.
Devuelve JSON: {"voices": [
  {"id":"slug-unico","name":"...","title":"rol","domains":["..."],"tags":["..."],
   "summary":"una línea","thesis":"idea central","keyWorks":[{"type":"book|podcast|course|essay|talk|newsletter","title":"...","year":2020}],
   "follow":["dónde seguirle"],"language":"en|es|both","relevance":"por qué es relevante para esta búsqueda"}
]}`;
      const out = await this.call(system, user, 2000);
      const parsed = this.parseJson<{ voices: Voice[] }>(out);
      const aiVoices = (parsed.voices ?? [])
        .filter((v) => v && v.name)
        .map((v) => ({ ...v, source: "ai" as const }));

      return {
        query: req.query,
        voices: [...curated.voices, ...aiVoices],
        meta: {
          provider: this.name,
          curatedCount: curated.voices.length,
          aiCount: aiVoices.length,
        },
      };
    } catch (err) {
      console.warn("[claude] search (IA) falló, devuelvo solo curadas:", (err as Error).message);
      return { ...curated, meta: { ...curated.meta, provider: this.name } };
    }
  }

  async report(req: ReportRequest): Promise<ReportResult> {
    // Reutiliza el mismo generador de Markdown para mantener un formato consistente.
    const voices: Voice[] = [];
    for (const id of req.voiceIds) {
      const v = VOICE_BY_ID.get(id);
      if (v) voices.push(v);
    }
    if (req.voices) {
      for (const v of req.voices) if (!VOICE_BY_ID.has(v.id)) voices.push(v);
    }
    return buildMarkdownReport(req, voices);
  }
}
