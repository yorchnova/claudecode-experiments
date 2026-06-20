import type {
  RefineResult,
  RefineAnswers,
  SearchResult,
  ReportResult,
  Voice,
} from "./types";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((msg as { error?: string }).error ?? "Error de red");
  }
  return res.json() as Promise<T>;
}

export const api = {
  refine: (query: string) => post<RefineResult>("/api/refine", { query }),
  search: (query: string, answers: RefineAnswers) =>
    post<SearchResult>("/api/search", { query, answers }),
  report: (query: string, answers: RefineAnswers, voiceIds: string[], voices: Voice[]) =>
    post<ReportResult>("/api/report", { query, answers, voiceIds, voices }),
};
