import { useEffect, useRef } from "react";

/* жидкий градиент на WebGL: бирюзовые пятна перетекают, тянутся к курсору,
   у заголовка первого экрана светлеют, ниже по странице становятся мягче */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
uniform float s;

vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * snoise(p); p *= 1.9; a *= 0.45; }
  return v * 0.5 + 0.5;
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / r.y;
  uv.y += s / r.y * 0.35;

  vec2 q = vec2(fbm(uv * 0.7 + vec2(0.0, t * 0.04)), fbm(uv * 0.7 + vec2(5.2, 1.3) - t * 0.035));
  float f = fbm(uv * 0.6 + 1.4 * q + vec2(t * 0.025, -t * 0.02));

  vec3 white = vec3(1.0);
  vec3 pale  = vec3(0.86, 0.965, 0.985);
  vec3 brand = vec3(0.043, 0.722, 0.827);
  vec3 sky   = vec3(0.47, 0.76, 0.98);
  vec3 mint  = vec3(0.60, 0.93, 0.85);
  vec3 deep  = vec3(0.031, 0.494, 0.565);

  vec3 col = mix(white, pale, smoothstep(0.24, 0.44, f));
  col = mix(col, mix(brand, sky, smoothstep(0.3, 0.7, q.x)), smoothstep(0.40, 0.70, f) * 0.92);
  col = mix(col, mint, smoothstep(0.62, 0.90, q.y) * 0.35);
  col = mix(col, deep, smoothstep(0.80, 0.95, f) * 0.35);

  float d = distance(frag, m) / r.y;
  col = mix(col, brand, exp(-d * d * 14.0) * 0.32);

  float k = mix(1.0, 0.42, smoothstep(0.0, r.y * 1.3, s));
  vec2 hc = (frag - vec2(r.x * 0.5, r.y * 0.6)) / vec2(max(r.x * 0.30, 150.0), r.y * 0.26);
  float veil = exp(-dot(hc, hc)) * (1.0 - smoothstep(0.0, r.y * 0.7, s)) * 0.6;

  gl_FragColor = vec4(mix(white, col, k * (1.0 - veil)), 1.0);
}`;

export default function FluidBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.classList.add("fluid-fallback");
      return undefined;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.5;

    const shader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.classList.add("fluid-fallback");
      return undefined;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {
      r: gl.getUniformLocation(prog, "r"),
      t: gl.getUniformLocation(prog, "t"),
      m: gl.getUniformLocation(prog, "m"),
      s: gl.getUniformLocation(prog, "s"),
    };

    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const start = performance.now() - 20000;

    const resize = () => {
      w = Math.max(1, Math.round(window.innerWidth * SCALE));
      h = Math.max(1, Math.round(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      mouse.x = mouse.tx = w * 0.75;
      mouse.y = mouse.ty = h * 0.7;
    };

    const frame = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(u.r, w, h);
      gl.uniform1f(u.t, (now - start) / 1000);
      gl.uniform2f(u.m, mouse.x, mouse.y);
      gl.uniform1f(u.s, window.scrollY * SCALE);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      mouse.tx = e.clientX * SCALE;
      mouse.ty = (window.innerHeight - e.clientY) * SCALE;
    };
    const onScroll = () => {
      if (reduce) frame(performance.now());
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full" />;
}
