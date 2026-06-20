// Utilidades de texto compartidas por los proveedores.

/** Normaliza: minúsculas, sin acentos, sin signos. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tokeniza descartando palabras vacías muy comunes (es/en). */
const STOPWORDS = new Set([
  "the", "and", "for", "que", "los", "las", "del", "una", "uno", "con", "por",
  "para", "como", "este", "esta", "sobre", "de", "la", "el", "en", "un", "se",
  "su", "al", "lo", "es", "mi", "tu", "of", "to", "in", "on", "a", "an", "i",
  "me", "my", "how", "what", "why", "quiero", "busco", "sobre",
]);

export function tokens(input: string): string[] {
  return normalize(input)
    .split(" ")
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Mapa de temas → etiquetas, para que consultas en lenguaje natural conecten
 * con los tags de las voces aunque no coincidan literalmente.
 */
export const TOPIC_SYNONYMS: Record<string, string[]> = {
  productividad: ["productivity", "focus", "deep work", "habits"],
  productivity: ["productivity", "focus", "habits"],
  habitos: ["habits", "behavior", "tiny habits"],
  habits: ["habits", "behavior"],
  concentracion: ["focus", "deep work", "attention"],
  foco: ["focus", "deep work"],
  emprender: ["entrepreneurship", "startups", "founders"],
  emprendimiento: ["entrepreneurship", "startups"],
  startup: ["startups", "lean", "mvp", "founders"],
  startups: ["startups", "founders", "lean"],
  negocio: ["entrepreneurship", "business", "marketing"],
  negocios: ["entrepreneurship", "business"],
  marketing: ["marketing", "audience", "marca"],
  marca: ["marketing", "audience"],
  dinero: ["money", "finance", "investing", "wealth"],
  finanzas: ["finance", "money", "investing"],
  inversion: ["investing", "money", "risk"],
  riqueza: ["wealth", "money", "leverage"],
  creatividad: ["creativity", "art", "writing"],
  arte: ["art", "creativity"],
  escritura: ["writing", "creativity"],
  liderazgo: ["leadership", "teams", "purpose"],
  proposito: ["purpose", "why", "leadership"],
  miedo: ["vulnerability", "courage", "psychology"],
  vulnerabilidad: ["vulnerability", "courage", "empathy"],
  emociones: ["emotions", "psychology", "vulnerability"],
  mentalidad: ["mindset", "growth", "motivation"],
  motivacion: ["motivation", "mindset", "behavior"],
  decisiones: ["decision", "bias", "risk", "thinking"],
  sesgos: ["bias", "decision", "behavioral"],
  estoicismo: ["stoicism", "discipline", "resilience"],
  disciplina: ["discipline", "habits", "stoicism"],
  resiliencia: ["resilience", "stoicism", "obstacles"],
  aprender: ["learning", "study", "education"],
  aprendizaje: ["learning", "study", "memory"],
  estudio: ["study", "learning", "memory"],
  conocimiento: ["knowledge", "second brain", "learning"],
  notas: ["notes", "second brain", "pkm"],
  ia: ["ai", "machine learning", "tech"],
  "inteligencia artificial": ["ai", "machine learning"],
  tecnologia: ["technology", "ai", "tech"],
  salud: ["health", "sleep", "performance"],
  sueno: ["sleep", "health"],
  bienestar: ["health", "psychology", "performance"],
  riesgo: ["risk", "uncertainty", "antifragile"],
  incertidumbre: ["uncertainty", "risk", "probability"],
  historia: ["history", "society", "future"],
  futuro: ["future", "ai", "technology"],
};
