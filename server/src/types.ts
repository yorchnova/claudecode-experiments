// Tipos compartidos del dominio "Línea de pensamiento".
// (Se duplican en web/src/types.ts para mantener los paquetes desacoplados.)

export type WorkType = "book" | "podcast" | "course" | "essay" | "talk" | "newsletter";

export interface KeyWork {
  type: WorkType;
  title: string;
  year?: number;
}

/** Una "voz validada": un referente reconocido en una o más materias. */
export interface Voice {
  id: string;
  name: string;
  title: string; // rol / cómo se le conoce
  domains: string[]; // áreas amplias (entrepreneurship, psychology, ...)
  tags: string[]; // palabras clave finas para el matching
  summary: string; // una línea de presentación
  thesis: string; // su idea o tesis central
  keyWorks: KeyWork[];
  follow: string[]; // dónde encontrarle (plataforma + nombre, o sitio)
  language: "en" | "es" | "both";
  /** Por qué aparece en esta búsqueda (lo rellena el proveedor según la consulta). */
  relevance?: string;
  /** Origen de la sugerencia, para transparencia. */
  source?: "curated" | "ai" | "web";
  /** Puntaje interno de relevancia (no se muestra necesariamente). */
  score?: number;
}

/** Pregunta de refinamiento que la herramienta hace al usuario. */
export interface RefineQuestion {
  id: string;
  question: string;
  options: string[];
  multiSelect: boolean;
}

export interface RefineResult {
  framing: string; // breve encuadre del tema detectado
  detectedDomains: string[];
  questions: RefineQuestion[];
}

/** Respuestas del usuario a las preguntas de refinamiento. */
export type RefineAnswers = Record<string, string[]>;

export interface SearchRequest {
  query: string;
  answers?: RefineAnswers;
  limit?: number;
}

export interface SearchResult {
  query: string;
  voices: Voice[];
  meta: {
    provider: string;
    curatedCount: number;
    aiCount: number;
  };
}

export interface ReportRequest {
  query: string;
  answers?: RefineAnswers;
  voiceIds: string[];
  /** Permite enviar voces completas (p.ej. sugeridas por IA que no están en la base). */
  voices?: Voice[];
}

export interface ReportResult {
  markdown: string;
  title: string;
}

/** Contrato que cualquier proveedor (mock, Claude, web) debe cumplir. */
export interface ThoughtProvider {
  readonly name: string;
  refine(query: string): Promise<RefineResult>;
  search(req: SearchRequest): Promise<SearchResult>;
  report(req: ReportRequest): Promise<ReportResult>;
}
