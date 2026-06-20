// Espejo de los tipos del backend (server/src/types.ts).

export type WorkType = "book" | "podcast" | "course" | "essay" | "talk" | "newsletter";

export interface KeyWork {
  type: WorkType;
  title: string;
  year?: number;
}

export interface Voice {
  id: string;
  name: string;
  title: string;
  domains: string[];
  tags: string[];
  summary: string;
  thesis: string;
  keyWorks: KeyWork[];
  follow: string[];
  language: "en" | "es" | "both";
  relevance?: string;
  source?: "curated" | "ai" | "web";
  score?: number;
}

export interface RefineQuestion {
  id: string;
  question: string;
  options: string[];
  multiSelect: boolean;
}

export interface RefineResult {
  framing: string;
  detectedDomains: string[];
  questions: RefineQuestion[];
}

export type RefineAnswers = Record<string, string[]>;

export interface SearchResult {
  query: string;
  voices: Voice[];
  meta: { provider: string; curatedCount: number; aiCount: number };
}

export interface ReportResult {
  markdown: string;
  title: string;
}
