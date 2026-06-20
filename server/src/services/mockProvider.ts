import type {
  ThoughtProvider,
  RefineResult,
  SearchRequest,
  SearchResult,
  ReportRequest,
  ReportResult,
  Voice,
  RefineQuestion,
} from "../types.js";
import { VOICES, VOICE_BY_ID } from "../data/voices.js";
import { tokens, normalize, TOPIC_SYNONYMS } from "./text.js";
import { buildMarkdownReport } from "../lib/report.js";

/**
 * Proveedor por defecto: funciona SIN clave de IA.
 * - "Curado": busca y puntúa sobre la base de voces.
 * - Refinamiento y relevancia: heurísticas (plantillas) sobre el tema detectado.
 *
 * Es el sustituto directo del proveedor Claude: mismas firmas, mismos tipos.
 */
export class MockProvider implements ThoughtProvider {
  readonly name = "mock";

  /** Expande la consulta a un conjunto de palabras clave usando sinónimos de tema. */
  private expandKeywords(query: string, extra: string[] = []): Set<string> {
    const base = [...tokens(query), ...extra.flatMap((e) => tokens(e))];
    const norm = normalize(query);
    const expanded = new Set<string>(base);

    // sinónimos por token
    for (const t of base) {
      for (const syn of TOPIC_SYNONYMS[t] ?? []) expanded.add(syn);
    }
    // sinónimos por frase (claves multipalabra)
    for (const [phrase, syns] of Object.entries(TOPIC_SYNONYMS)) {
      if (phrase.includes(" ") && norm.includes(phrase)) {
        syns.forEach((s) => expanded.add(s));
      }
    }
    return expanded;
  }

  private scoreVoice(voice: Voice, keywords: Set<string>): number {
    let score = 0;
    const tagSet = new Set(voice.tags.map(normalize));
    const domainSet = new Set(voice.domains.map(normalize));
    const haystack = normalize(`${voice.summary} ${voice.thesis} ${voice.title}`);

    for (const kw of keywords) {
      const n = normalize(kw);
      if (!n) continue;
      if (tagSet.has(n)) score += 3;
      if (domainSet.has(n)) score += 2;
      if (haystack.includes(n)) score += 1;
    }
    return score;
  }

  async refine(query: string): Promise<RefineResult> {
    const keywords = this.expandKeywords(query);
    const ranked = VOICES.map((v) => ({ v, s: this.scoreVoice(v, keywords) }))
      .sort((a, b) => b.s - a.s);
    const detectedDomains = Array.from(
      new Set(ranked.slice(0, 5).flatMap(({ v }) => v.domains)),
    ).slice(0, 5);

    const framing =
      ranked[0]?.s > 0
        ? `Detecté que tu búsqueda "${query}" se relaciona con: ${detectedDomains.join(", ")}. Afinemos el enfoque para encontrar las voces más útiles para ti.`
        : `Vamos a explorar "${query}". Respóndeme un par de preguntas para orientar la búsqueda de voces.`;

    const questions: RefineQuestion[] = [
      {
        id: "perspective",
        question: "¿Qué perspectiva te interesa más sobre este tema?",
        options: [
          "Práctica y aplicable (qué hacer)",
          "Teórica y de fondo (por qué)",
          "Inspiracional y motivadora",
          "Crítica o contrarian (otra mirada)",
        ],
        multiSelect: true,
      },
      {
        id: "format",
        question: "¿Cómo prefieres consumir el contenido de estas voces?",
        options: ["Libros", "Podcasts", "Charlas / videos", "Ensayos / newsletters", "Cursos"],
        multiSelect: true,
      },
      {
        id: "level",
        question: "¿En qué punto estás con este tema?",
        options: ["Recién empiezo", "Tengo base, quiero profundizar", "Busco perspectivas avanzadas"],
        multiSelect: false,
      },
    ];

    return { framing, detectedDomains, questions };
  }

  async search(req: SearchRequest): Promise<SearchResult> {
    const extra = req.answers ? Object.values(req.answers).flat() : [];
    const keywords = this.expandKeywords(req.query, extra);
    const limit = req.limit ?? 8;

    let ranked = VOICES.map((v) => ({ ...v, score: this.scoreVoice(v, keywords) }))
      .filter((v) => v.score > 0)
      .sort((a, b) => b.score - a.score);

    // Si no hubo coincidencias, ofrece una selección diversa por dominio.
    if (ranked.length === 0) {
      const seen = new Set<string>();
      ranked = VOICES.filter((v) => {
        const d = v.domains[0];
        if (seen.has(d)) return false;
        seen.add(d);
        return true;
      }).map((v) => ({ ...v, score: 0 }));
    }

    const voices = ranked.slice(0, limit).map((v) => ({
      ...v,
      relevance: this.relevanceLine(v, keywords),
    }));

    return {
      query: req.query,
      voices,
      meta: { provider: this.name, curatedCount: voices.length, aiCount: 0 },
    };
  }

  private relevanceLine(voice: Voice, keywords: Set<string>): string {
    const hit = voice.tags.find((t) => keywords.has(normalize(t)));
    if (hit) {
      return `Relevante por su trabajo en torno a "${hit}". ${voice.summary}`;
    }
    return voice.summary;
  }

  async report(req: ReportRequest): Promise<ReportResult> {
    const voices: Voice[] = [];
    for (const id of req.voiceIds) {
      const fromBase = VOICE_BY_ID.get(id);
      if (fromBase) voices.push(fromBase);
    }
    // Permite voces externas (p.ej. enviadas por la IA) que no están en la base.
    if (req.voices) {
      for (const v of req.voices) {
        if (!VOICE_BY_ID.has(v.id)) voices.push(v);
      }
    }
    return buildMarkdownReport(req, voices);
  }
}
