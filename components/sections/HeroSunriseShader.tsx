'use client';

import { useEffect, useRef } from 'react';

// "Beyond horizons" — Gosha's Unicorn Studio remix, rebuilt as our own WebGL
// shader (no SDK, no watermark, no video compression). A dark curved planet edge
// with a warm orange sunrise: a bright core on the horizon, a soft "beam" glow
// cone, and "nebula" turbulence (domain-warped fbm) billowing on top — the same
// layer model as their scene. trackMouse is off in the original, so the light
// stays centred; the cursor only stirs the smoke a touch. Palette is their exact
// 7-stop gradient, R/B-swapped blue→brand-orange. See public/sunrise-shader.html
// for the standalone lab version.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uMouse;   // 0..1, y up
uniform float uTime;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

vec3 ramp(float t){
  vec3 c0 = vec3(0.059, 0.027, 0.000);
  vec3 c1 = vec3(0.318, 0.149, 0.000);
  vec3 c2 = vec3(0.549, 0.278, 0.000);
  vec3 c3 = vec3(0.827, 0.427, 0.000);
  vec3 c4 = vec3(1.000, 0.604, 0.271);
  vec3 c5 = vec3(1.000, 0.780, 0.612);
  vec3 c6 = vec3(1.000, 0.949, 0.910);
  if (t < 0.181) return mix(c0, c1, t / 0.181);
  if (t < 0.366) return mix(c1, c2, (t - 0.181) / 0.185);
  if (t < 0.538) return mix(c2, c3, (t - 0.366) / 0.172);
  if (t < 0.700) return mix(c3, c4, (t - 0.538) / 0.162);
  if (t < 0.850) return mix(c4, c5, (t - 0.700) / 0.150);
  return mix(c5, c6, (t - 0.850) / 0.150);
}

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5, norm = 0.0;
  for (int k = 0; k < 5; k++){ s += a*vnoise(p); norm += a; p = p*2.0 + 11.5; a *= 0.5; }
  return s / norm;
}
float ridged(vec2 p){
  float s = 0.0, a = 0.55, norm = 0.0;
  for (int k = 0; k < 5; k++){
    float n = vnoise(p);
    n = 1.0 - abs(2.0*n - 1.0);
    s += a*n*n; norm += a;
    p = p*2.0 + 7.3; a *= 0.55;
  }
  return s / norm;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;

  // horizon sits lower in the hero than in the standalone lab, so the glow
  // settles behind the logo wall and leaves the input on clean dark.
  float hor = 0.21 - 0.04 * (1.0 - cos((uv.x - 0.5) * 3.14159));
  float above = uv.y - hor;

  float gx = 0.5;
  float dx = (uv.x - gx) * aspect;
  float mnudge = uMouse.x - 0.5;

  float core = exp(-(dx*dx*42.0 + (above-0.004)*(above-0.004)*460.0));

  float fy = max(above, 0.0);
  float fx = dx + fy * mnudge * 0.15;

  float wb = 0.06 + fy * 0.50;
  float breath = 1.9 + 0.20*sin(uTime*0.2);   // steeper falloff keeps the dome low
  float beam = exp(-(fx*fx) / (2.0*wb*wb)) * smoothstep(-0.004, 0.045, fy) * exp(-fy*breath);

  vec2 fp = vec2(fx*2.4, fy*2.7 - uTime*0.34);
  vec2 q  = vec2(fbm(fp + vec2(mnudge*0.3, uTime*0.16)),
                 fbm(fp + vec2(3.7, 2.1) - uTime*0.13));
  vec2 wp = fp + vec2(1.35, 0.70)*q;
  float neb = mix(fbm(wp*1.2), ridged(wp*1.4), 0.20);
  float pulse = 0.85 + 0.15*sin(uTime*0.3 + 0.6);
  float column = beam * (0.45 + 0.8*neb) * pulse;

  float halo = exp(-(dx*dx*2.8 + max(above + 0.02, 0.0)*3.4));
  float band = exp(-above*above*1700.0) * exp(-dx*dx*0.20);

  float glow = core*1.7 + column*1.15 + halo*0.26 + band*0.5;
  glow *= 0.97 + 0.03*sin(uTime*0.5);

  float t = clamp(glow*0.85 + core*0.45, 0.0, 1.0);
  float bright = clamp(glow, 0.0, 1.0);
  bright = bright*bright*(3.0 - 2.0*bright);
  vec3 col = mix(ramp(0.0), ramp(t), bright);

  if (uv.y < hor) col *= smoothstep(hor - 0.14, hor, uv.y) * 0.09;

  float vig = smoothstep(1.25, 0.40, distance(uv, vec2(gx, 0.5)));
  col *= 0.78 + 0.22*vig;
  col += (hash(uv*uRes.xy + uTime) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function HeroSunriseShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // alpha:false + low-power: this is a decorative full-bleed background, so we
    // trade sharpness for battery and skip the compositor's alpha blend.
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // one big triangle covering the clip space
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    // DPR capped at 1.75: 20-octave noise per pixel is heavy, and a soft glow
    // doesn't need retina crispness.
    const dprCap = 1.75;
    const resize = () => {
      const dpr = Math.min(dprCap, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const draw = (tSec: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, tSec);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Respect reduced-motion: render one calm frame and stop, no animation loop.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      draw(3.2);
      return () => {
        ro.disconnect();
        window.removeEventListener('mousemove', onMove);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    const t0 = performance.now();
    let raf = 0;
    let running = true;
    const loop = () => {
      if (!running) return;
      draw((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Pause the loop while the hero is scrolled out of view or the tab is hidden.
    const setRunning = (on: boolean) => {
      if (on && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!on && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(([entry]) => setRunning(!!entry?.isIntersecting), {
      threshold: 0,
    });
    io.observe(canvas);
    const onVisibility = () => setRunning(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Sized to the viewport (not the 1340px glow container) so the shader's
      // baked-in horizon (~0.26 from the bottom) lands just above the logo wall,
      // matching the standalone lab calibration.
      className="pointer-events-none absolute inset-x-0 top-0 block h-screen w-full"
    />
  );
}
