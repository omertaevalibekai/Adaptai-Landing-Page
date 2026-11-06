import { useEffect, useRef, useState } from "react";

/* порядок и отделы помощников - по каталогу «ИИ-сотрудники» в продукте */
export const TEAM_ORDER = [
  ["assistant", "general"],
  ["whatsapp_sales", "sales"],
  ["instagram_sales", "sales"],
  ["scout", "sales"],
  ["reply_assistant", "sales"],
  ["dossier", "sales"],
  ["followup", "sales"],
  ["instagram_comments", "sales"],
  ["visualizer", "sales"],
  ["warehouse", "stock"],
  ["kaspi", "stock"],
  ["tasks", "general"],
  ["recruiter", "team"],
  ["personnel", "team"],
];
const DEPTS = ["sales", "stock", "team", "general"];

/* помощники тянутся к курсору: пружина на requestAnimationFrame,
   двигается внутренняя обёртка, а измеряется неподвижная кнопка - без обратной связи */
function useLean(shelfRef) {
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return undefined;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return undefined;
    const cells = [...shelf.querySelectorAll("[data-cell]")];
    const st = cells.map(() => ({ x: 0, y: 0, r: 0, s: 1 }));
    let px = null;
    let py = null;
    let raf = 0;

    const tick = () => {
      let moving = false;
      cells.forEach((cell, i) => {
        const b = cell.getBoundingClientRect();
        let tx = 0;
        let ty = 0;
        let tr = 0;
        let ts = 1;
        if (px !== null) {
          const dx = px - (b.left + b.width / 2);
          const dy = py - (b.top + b.height * 0.4);
          const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 280);
          tx = dx * 0.09 * pull;
          ty = dy * 0.06 * pull - pull * 8;
          tr = Math.max(-14, Math.min(14, dx * 0.06)) * pull;
          ts = 1 + pull * 0.1;
        }
        const s = st[i];
        s.x += (tx - s.x) * 0.16;
        s.y += (ty - s.y) * 0.16;
        s.r += (tr - s.r) * 0.16;
        s.s += (ts - s.s) * 0.16;
        if (Math.abs(tx - s.x) + Math.abs(ty - s.y) + Math.abs(tr - s.r) + Math.abs(ts - s.s) * 40 > 0.05) moving = true;
        cell.firstElementChild.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(2)}deg) scale(${s.s.toFixed(3)})`;
      });
      raf = moving || px !== null ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onLeave = () => {
      px = py = null;
      kick();
    };
    shelf.addEventListener("pointermove", onMove);
    shelf.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      shelf.removeEventListener("pointermove", onMove);
      shelf.removeEventListener("pointerleave", onLeave);
    };
  }, [shelfRef]);
}

export default function TeamShelf({ data }) {
  const [dept, setDept] = useState("all");
  const [active, setActive] = useState("scout");
  const shelfRef = useRef(null);
  useLean(shelfRef);

  const activeDept = TEAM_ORDER.find(([id]) => id === active)[1];
  const [name, desc] = data.agents[active];

  const pickDept = (d) => {
    setDept(d);
    if (d !== "all" && activeDept !== d) setActive(TEAM_ORDER.find(([, dd]) => dd === d)[0]);
  };

  return (
    <section id="team" className="mt-28 scroll-mt-24 md:mt-40">
      <div className="grid gap-5 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16">
        <h2 className="font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink text-balance md:text-5xl">
          {data.title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">{data.text}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={data.title}>
        {["all", ...DEPTS].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => pickDept(d)}
            aria-pressed={dept === d}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
              dept === d ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/70 hover:border-ink/30 hover:text-ink"
            }`}
          >
            {d === "all" ? data.all : data.depts[d]}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <ul ref={shelfRef} className="grid grid-cols-3 gap-y-2 px-2 pb-4 pt-8 sm:grid-cols-5 lg:grid-cols-7 lg:px-6">
          {TEAM_ORDER.map(([id, d], i) => {
            const on = dept === "all" || dept === d;
            const isActive = active === id;
            return (
              <li key={id} className="flex justify-center">
                <button
                  type="button"
                  data-cell
                  onMouseEnter={() => on && setActive(id)}
                  onFocus={() => setActive(id)}
                  onClick={() => setActive(id)}
                  aria-pressed={isActive}
                  aria-label={data.agents[id][0]}
                  className={`mascot-cell group flex w-full flex-col items-center rounded-2xl px-1 pb-2 pt-1 transition-[opacity,filter] duration-500 ${
                    on ? "opacity-100" : "pointer-events-none opacity-25 grayscale"
                  }`}
                  tabIndex={on ? 0 : -1}
                >
                  <span className="relative block will-change-transform">
                    <img
                      src={`/mascots/${id}.webp`}
                      alt=""
                      width="112"
                      height="112"
                      loading="lazy"
                      draggable="false"
                      className="mascot-float h-20 w-20 select-none object-contain sm:h-24 sm:w-24"
                      style={{ animationDelay: `${(i % 7) * -0.55}s` }}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full blur-[3px] transition-colors duration-300 ${
                        isActive ? "bg-brand/45" : "bg-ink/10"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-3 line-clamp-2 min-h-[2.5em] px-1 text-center text-[13px] leading-tight transition-colors duration-200 ${
                      isActive ? "font-medium text-ink" : "text-ink/60"
                    }`}
                  >
                    {data.agents[id][0]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line bg-mist/60 px-5 py-4 md:px-8 md:py-5" aria-live="polite">
          <img key={active} src={`/mascots/${active}.webp`} alt="" className="team-detail-in h-12 w-12 shrink-0 object-contain" />
          <div key={`${active}-t`} className="team-detail-in min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="font-display text-lg font-medium tracking-[-0.02em] text-ink">{name}</span>
              <span className="text-xs text-brand-deep">{data.depts[activeDept]}</span>
            </p>
            <p className="mt-0.5 text-[15px] leading-snug text-ink/70">{desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
