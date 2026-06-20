import type { ThoughtProvider } from "../types.js";
import { MockProvider } from "./mockProvider.js";
import { ClaudeProvider } from "./claudeProvider.js";

/**
 * Selección de proveedor por configuración.
 *
 *   AI_PROVIDER=claude  + ANTHROPIC_API_KEY=...   -> Claude (híbrido curado + IA)
 *   (por defecto)                                 -> Mock (solo base curada, sin clave)
 */
export function getProvider(): ThoughtProvider {
  const which = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (which === "claude" && apiKey) {
    console.log("[provider] usando Claude");
    return new ClaudeProvider(apiKey);
  }
  if (which === "claude" && !apiKey) {
    console.warn("[provider] AI_PROVIDER=claude pero falta ANTHROPIC_API_KEY; uso mock.");
  }
  console.log("[provider] usando mock (sin IA)");
  return new MockProvider();
}
