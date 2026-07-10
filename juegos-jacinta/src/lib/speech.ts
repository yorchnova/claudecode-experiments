// Narración en español con Web Speech API.
// Preferencia de voz: es-CL → es-ES → es-419 → es-MX/es-US → cualquier "es" → voz por defecto.
// Nunca lanza: si no hay síntesis de voz disponible, todo es un no-op silencioso.

import { isMuted } from './audio';

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesReady = false;

const LANG_PRIORITY = ['es-cl', 'es-es', 'es-419', 'es-mx', 'es-us'];

function pickVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  for (const lang of LANG_PRIORITY) {
    const match = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === lang);
    if (match) return match;
  }
  const anySpanish = voices.find((v) => v.lang.toLowerCase().startsWith('es'));
  if (anySpanish) return anySpanish;
  return voices.find((v) => v.default) ?? voices[0] ?? null;
}

function refreshVoice() {
  cachedVoice = pickVoice();
  voicesReady = cachedVoice !== null;
}

if ('speechSynthesis' in window) {
  refreshVoice();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoice);
}

export interface SpeakOptions {
  /** Interrumpe lo que se esté diciendo (por defecto true). */
  interrupt?: boolean;
  rate?: number;
  pitch?: number;
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!('speechSynthesis' in window)) return;
  if (isMuted()) return;
  const { interrupt = true, rate = 0.95, pitch = 1.15 } = opts;

  try {
    if (interrupt) window.speechSynthesis.cancel();
    if (!voicesReady) refreshVoice();

    const utterance = new SpeechSynthesisUtterance(text);
    if (cachedVoice) {
      utterance.voice = cachedVoice;
      utterance.lang = cachedVoice.lang;
    } else {
      utterance.lang = 'es-CL';
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    window.speechSynthesis.speak(utterance);
  } catch {
    // La voz nunca debe romper el juego.
  }
}

export function stopSpeaking(): void {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* no-op */
  }
}

const PRAISES = [
  '¡Muy bien, Jaci!',
  '¡Bravo, Jaci!',
  '¡Excelente!',
  '¡Qué bien lo haces!',
  '¡Eso es, Jaci!',
  '¡Genial!',
];

export function randomPraise(): string {
  return PRAISES[Math.floor(Math.random() * PRAISES.length)];
}
