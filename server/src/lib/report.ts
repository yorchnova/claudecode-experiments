import type { ReportRequest, ReportResult, Voice, RefineAnswers } from "../types.js";

const WORK_LABEL: Record<string, string> = {
  book: "📖 Libro",
  podcast: "🎧 Podcast",
  course: "🎓 Curso",
  essay: "✍️ Ensayo",
  talk: "🎤 Charla",
  newsletter: "📬 Newsletter",
};

function answersToBullets(answers?: RefineAnswers): string {
  if (!answers) return "";
  const lines = Object.values(answers)
    .flat()
    .filter(Boolean)
    .map((a) => `- ${a}`);
  return lines.length ? lines.join("\n") : "";
}

function voiceSection(voice: Voice, index: number): string {
  const works = voice.keyWorks
    .map((w) => `  - ${WORK_LABEL[w.type] ?? w.type}: *${w.title}*${w.year ? ` (${w.year})` : ""}`)
    .join("\n");
  const follow = voice.follow.length ? voice.follow.map((f) => `\`${f}\``).join(" · ") : "—";
  const relevance = voice.relevance ? `\n> ${voice.relevance}\n` : "";

  return `### ${index}. ${voice.name}
**${voice.title}**
${relevance}
**Idea central:** ${voice.thesis}

**Por dónde empezar:**
${works || "  - —"}

**Dónde seguirle:** ${follow}
`;
}

/**
 * Genera el informe en Markdown de una línea de pensamiento.
 * Compartido por todos los proveedores para garantizar un formato consistente.
 */
export function buildMarkdownReport(req: ReportRequest, voices: Voice[]): ReportResult {
  const title = `Línea de pensamiento: ${req.query}`;
  const date = new Date().toISOString().slice(0, 10);
  const refine = answersToBullets(req.answers);

  const domains = Array.from(new Set(voices.flatMap((v) => v.domains)));

  const map = voices
    .map((v) => `- **${v.name}** — ${v.summary}`)
    .join("\n");

  const sections = voices.map((v, i) => voiceSection(v, i + 1)).join("\n---\n\n");

  const learningPath = voices
    .slice(0, 4)
    .map((v, i) => {
      const first = v.keyWorks[0];
      const ref = first ? `*${first.title}*` : v.name;
      return `${i + 1}. Explora a **${v.name}** empezando por ${ref}.`;
    })
    .join("\n");

  const markdown = `# 🧭 ${title}

> Mapa de voces reconocidas para entender, inspirarte y profundizar en este tema.
> _Generado el ${date} con la herramienta **Línea de pensamiento**._

## 🎯 Tu enfoque
**Concepto buscado:** ${req.query}
${refine ? `\n**Cómo refinaste la búsqueda:**\n${refine}\n` : ""}
**Áreas que cruza:** ${domains.join(", ") || "—"}

## 🗺️ El mapa mental de voces
${map}

## 👤 Tus referentes en detalle
${sections}
---

## 🚀 Una ruta para empezar
${learningPath || "—"}

## 💡 Cómo usar este informe
- Elige **una** voz y dedícale una semana: una obra, un podcast o un ensayo.
- Contrasta perspectivas: las mejores ideas surgen al cruzar voces que no piensan igual.
- Comparte este mapa con alguien que esté explorando el mismo tema.

---
_Línea de pensamiento — guía educativa de uso libre. Las voces y obras citadas pertenecen a sus autores._
`;

  return { markdown, title };
}
