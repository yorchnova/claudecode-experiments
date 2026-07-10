// Confeti liviano en canvas: sin librerías, ~150 partículas suaves.
import { useEffect, useRef } from 'react';

const COLORS = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e0bbff', '#ffd6e7'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  shape: 'rect' | 'circle';
}

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const g = canvas.getContext('2d');
    if (!g) return;
    g.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const particles: Particle[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 1.5 + Math.random() * 2.5,
      size: 7 + Math.random() * 9,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    let raf = 0;
    const started = performance.now();
    const DURATION = 4000;

    const tick = (now: number) => {
      const elapsed = now - started;
      g.clearRect(0, 0, w, h);
      const fade = elapsed > DURATION - 800 ? Math.max(0, (DURATION - elapsed) / 800) : 1;

      for (const p of particles) {
        p.x += p.vx + Math.sin((now / 600) + p.y / 50) * 0.6;
        p.y += p.vy;
        p.rotation += p.vr;
        if (p.y > h + 30) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        g.save();
        g.globalAlpha = fade;
        g.translate(p.x, p.y);
        g.rotate(p.rotation);
        g.fillStyle = p.color;
        if (p.shape === 'rect') {
          g.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else {
          g.beginPath();
          g.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();
      }

      if (elapsed < DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        g.clearRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
