import { useEffect, useRef } from 'react';

const COLORS = ['#e8413a', '#f4c64a', '#2aa775', '#5b6af5', '#ff9a3c', '#141414', '#fff'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  isRect: boolean;
  size: number;
  rot: number;
  rotV: number;
  opacity: number;
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext('2d');
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    const particles: Particle[] = [];
    const EMIT_DURATION = 4200;
    const startTime = Date.now();
    let animId = 0;

    function spawn(): Particle {
      return {
        x: Math.random() * W,
        y: -(Math.random() * 40 + 10),
        vx: (Math.random() - 0.5) * 3.5,
        vy: 1.5 + Math.random() * 3.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isRect: Math.random() < 0.6,
        size: 7 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.1,
        opacity: 1,
      };
    }

    function tick() {
      const now = Date.now();
      ctx.clearRect(0, 0, W, H);

      if (now - startTime < EMIT_DURATION) {
        const rate = now - startTime < 400 ? 8 : 2;
        for (let i = 0; i < rate; i++) particles.push(spawn());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.1;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        if (p.y > H * 0.88) p.opacity -= 0.03;
        if (p.opacity <= 0 || p.y > H + 20) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.isRect) {
          ctx.fillRect(-p.size / 2, -p.size * 0.4, p.size, p.size * 0.8);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0 || now - startTime < EMIT_DURATION) {
        animId = requestAnimationFrame(tick);
      }
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  );
}
