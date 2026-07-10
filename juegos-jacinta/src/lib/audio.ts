// Motor de sonido con Web Audio API: todo sintetizado, cero archivos.
// Sonidos suaves y musicales — nunca estridentes, nunca "de castigo".

const MUTE_KEY = 'jaci.muted';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = localStorage.getItem(MUTE_KEY) === '1';

function ensureCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  if (value && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

interface NoteOpts {
  freq: number;
  start: number; // segundos relativos a "ahora"
  duration: number;
  type?: OscillatorType;
  gain?: number;
  glideTo?: number; // glissando hacia esta frecuencia
}

function playNotes(notes: NoteOpts[]): void {
  if (muted) return;
  const audio = ensureCtx();
  if (!audio || !master) return;
  const now = audio.currentTime;

  for (const n of notes) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = n.type ?? 'sine';
    osc.frequency.setValueAtTime(n.freq, now + n.start);
    if (n.glideTo) {
      osc.frequency.exponentialRampToValueAtTime(n.glideTo, now + n.start + n.duration);
    }
    const peak = n.gain ?? 0.35;
    gain.gain.setValueAtTime(0, now + n.start);
    gain.gain.linearRampToValueAtTime(peak, now + n.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + n.start);
    osc.stop(now + n.start + n.duration + 0.05);
  }
}

// ——— Efectos de interfaz ———

/** "Pop" suave al tocar/agarrar algo. */
export function pop(): void {
  playNotes([{ freq: 520, glideTo: 780, duration: 0.09, type: 'triangle', gain: 0.25, start: 0 }]);
}

/** Giro de carta: soplido cortito. */
export function flip(): void {
  playNotes([{ freq: 340, glideTo: 480, duration: 0.12, type: 'sine', gain: 0.18, start: 0 }]);
}

/** Error amable: dos notas suaves descendentes, sin drama. */
export function neutral(): void {
  playNotes([
    { freq: 392, duration: 0.16, type: 'sine', gain: 0.15, start: 0 },
    { freq: 330, duration: 0.22, type: 'sine', gain: 0.12, start: 0.16 },
  ]);
}

/** Acierto: arpegio alegre (Do–Mi–Sol). */
export function match(): void {
  playNotes([
    { freq: 523.25, duration: 0.18, type: 'triangle', gain: 0.3, start: 0 },
    { freq: 659.25, duration: 0.18, type: 'triangle', gain: 0.3, start: 0.11 },
    { freq: 783.99, duration: 0.3, type: 'triangle', gain: 0.32, start: 0.22 },
  ]);
}

/** Fanfarria de victoria: Do–Mi–Sol–Do' con brillo. */
export function fanfare(): void {
  playNotes([
    { freq: 523.25, duration: 0.22, type: 'triangle', gain: 0.32, start: 0 },
    { freq: 659.25, duration: 0.22, type: 'triangle', gain: 0.32, start: 0.15 },
    { freq: 783.99, duration: 0.22, type: 'triangle', gain: 0.32, start: 0.3 },
    { freq: 1046.5, duration: 0.5, type: 'triangle', gain: 0.35, start: 0.45 },
    // brillitos
    { freq: 2093, duration: 0.4, type: 'sine', gain: 0.08, start: 0.5 },
    { freq: 1567.98, duration: 0.35, type: 'sine', gain: 0.08, start: 0.62 },
  ]);
}

// ——— Motivos musicales por animal ———
// Cada animal tiene su mini-melodía propia (2–3 notas), siempre la misma,
// para que Jaci pueda recordar la carta también por su sonido.

export interface Motif {
  notes: Array<{ freq: number; duration: number; type?: OscillatorType; glideTo?: number }>;
}

const MOTIFS: Record<string, Motif> = {
  gato: {
    // maullido: glissando descendente agudo
    notes: [
      { freq: 880, glideTo: 660, duration: 0.28, type: 'sine' },
      { freq: 990, glideTo: 740, duration: 0.3, type: 'sine' },
    ],
  },
  perro: {
    // dos "guau" cortos y graves
    notes: [
      { freq: 220, glideTo: 180, duration: 0.14, type: 'square' },
      { freq: 220, glideTo: 180, duration: 0.14, type: 'square' },
    ],
  },
  pato: {
    // cuac-cuac nasal
    notes: [
      { freq: 311, duration: 0.13, type: 'sawtooth' },
      { freq: 277, duration: 0.16, type: 'sawtooth' },
    ],
  },
  vaca: {
    // "muuu" grave y largo
    notes: [{ freq: 165, glideTo: 131, duration: 0.6, type: 'sawtooth' }],
  },
  rana: {
    // croac saltarín ascendente
    notes: [
      { freq: 196, glideTo: 294, duration: 0.12, type: 'square' },
      { freq: 196, glideTo: 330, duration: 0.14, type: 'square' },
    ],
  },
  leon: {
    // rugido: glissando grave ascendente
    notes: [{ freq: 110, glideTo: 196, duration: 0.5, type: 'sawtooth' }],
  },
  pollito: {
    // pío-pío agudito
    notes: [
      { freq: 1318.5, duration: 0.09, type: 'sine' },
      { freq: 1568, duration: 0.09, type: 'sine' },
      { freq: 1318.5, duration: 0.12, type: 'sine' },
    ],
  },
  conejo: {
    // saltitos: tres notas que suben
    notes: [
      { freq: 523.25, duration: 0.1, type: 'triangle' },
      { freq: 659.25, duration: 0.1, type: 'triangle' },
      { freq: 880, duration: 0.14, type: 'triangle' },
    ],
  },
  pez: {
    // burbujas: notas que flotan hacia arriba
    notes: [
      { freq: 740, glideTo: 988, duration: 0.16, type: 'sine' },
      { freq: 880, glideTo: 1175, duration: 0.18, type: 'sine' },
    ],
  },
  chancho: {
    // oinc-oinc
    notes: [
      { freq: 294, glideTo: 370, duration: 0.12, type: 'sawtooth' },
      { freq: 262, glideTo: 330, duration: 0.14, type: 'sawtooth' },
    ],
  },
};

export function playMotif(id: string): void {
  const motif = MOTIFS[id];
  if (!motif) return;
  let t = 0;
  const gap = 0.06;
  playNotes(
    motif.notes.map((n) => {
      const note: NoteOpts = { ...n, start: t, gain: 0.22 };
      t += n.duration + gap;
      return note;
    }),
  );
}
