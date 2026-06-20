import { Router, type Request, type Response } from "express";
import { getProvider } from "./services/index.js";
import type { SearchRequest, ReportRequest } from "./types.js";

const provider = getProvider();
export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, provider: provider.name });
});

// Paso 1 → refinamiento: encuadre + preguntas.
router.post("/refine", async (req: Request, res: Response) => {
  const query = String(req.body?.query ?? "").trim();
  if (!query) return res.status(400).json({ error: "Falta 'query'." });
  try {
    res.json(await provider.refine(query));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Paso 2 → búsqueda de voces (con respuestas de refinamiento opcionales).
router.post("/search", async (req: Request, res: Response) => {
  const body = req.body as SearchRequest;
  const query = String(body?.query ?? "").trim();
  if (!query) return res.status(400).json({ error: "Falta 'query'." });
  try {
    res.json(await provider.search({ query, answers: body.answers, limit: body.limit }));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Paso 3 → informe en Markdown de las voces seleccionadas.
router.post("/report", async (req: Request, res: Response) => {
  const body = req.body as ReportRequest;
  const query = String(body?.query ?? "").trim();
  if (!query) return res.status(400).json({ error: "Falta 'query'." });
  if (!Array.isArray(body.voiceIds) || body.voiceIds.length === 0) {
    return res.status(400).json({ error: "Selecciona al menos una voz ('voiceIds')." });
  }
  try {
    res.json(await provider.report(body));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
