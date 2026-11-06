import { useEffect, useRef } from "react";

/* поле точек в перспективе: катится волнами, при прокрутке страница «летит» над ним,
   под курсором точки приподнимаются; после первого экрана поле тише, чтобы не спорить с текстом */
export default function DotWaveBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = w < 768;
      cols = small ? 46 : 90;
      rows = small ? 30 : 44;
    };

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const scroll = window.scrollY;
      const travel = scroll * 0.0025;
      const calm = 1 - 0.55 * Math.min(1, scroll / (h * 1.2));
      pointer.sx += (pointer.x - pointer.sx) * 0.12;
      pointer.sy += (pointer.y - pointer.sy) * 0.12;

      ctx.clearRect(0, 0, w, h);
      const settle = Math.min(1, scroll / h);
      const horizon = h * ((w < 768 ? 0.6 : 0.52) + 0.1 * settle);
      const spreadX = Math.max(w, 900) * 0.34;
      const spreadY = h * 0.36;

      for (let j = rows - 1; j >= 0; j--) {
        const z = 1 + j * 0.16;
        const depthA = Math.min(1, 1.7 / z) * Math.min(1, Math.max(0, (rows - j) / (rows * 0.45)));
        for (let i = 0; i < cols; i++) {
          const x = (i / (cols - 1) - 0.5) * 9.5;
          let y =
            Math.sin(x * 0.8 + t * 0.9) * 0.35 +
            Math.cos((z + travel) * 0.9 - t * 0.7 + x * 0.3) * 0.3 +
            Math.sin((z + travel) * 2.1 + x * 0.5 - t * 0.5) * 0.08;
          let sx = w / 2 + (x / z) * spreadX;
          let sy = horizon + ((1.6 - y) / z) * spreadY;

          const dx = sx - pointer.sx;
          const dy = sy - pointer.sy;
          const lift = Math.exp(-(dx * dx + dy * dy) / 9000);
          if (lift > 0.01) {
            y += lift * 0.5;
            sy -= lift * 26 / z;
          }

          const a = depthA * (0.3 + 0.7 * Math.min(1, Math.max(0, (y + 0.65) / 1.3))) * calm;
          if (a < 0.03 || sy > h + 4 || sx < -4 || sx > w + 4) continue;
          const s = Math.max(0.6, 2.7 / z) * (1 + lift * 0.8);
          ctx.fillStyle = y > 0.2 || lift > 0.2 ? `rgba(11,184,211,${a.toFixed(3)})` : `rgba(8,126,144,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s, 0, 6.283);
          ctx.fill();
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onScroll = () => {
      if (reduce) draw(performance.now());
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full" />;
}
