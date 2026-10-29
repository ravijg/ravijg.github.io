"use client";

// R3F animates by mutating three.js objects inside useFrame; see HeroScene.tsx.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ResumeLoop } from "./ResumeLoop";

/**
 * Page-wide particle field that morphs between shapes as the visitor scrolls —
 * the "unstructured → structured" story told in 3D:
 *   chaos → sphere → double helix → lattice → torus knot → galaxy
 * All morphing runs in the vertex shader; JS only updates a few uniforms.
 */

const SHAPES = 6;
/** Which shape each section shows (by element id, in page order). */
const SECTION_SHAPES: [string, number][] = [
  ["about", 0],
  ["skills", 1],
  ["experience", 2],
  ["projects", 3],
  ["lab", 4],
  ["achievements", 1],
  ["education", 2],
  ["contact", 5],
];
/** Accent pair per shape — the palette drifts with the story. */
const SHAPE_COLORS: [string, string][] = [
  ["#5b6478", "#8b7bff"],
  ["#7cf7ff", "#8b7bff"],
  ["#ff7ad9", "#8b7bff"],
  ["#7cf7ff", "#4ade80"],
  ["#8b7bff", "#ff7ad9"],
  ["#7cf7ff", "#ff7ad9"],
];

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function buildShapes(n: number) {
  const r = rng(1337);
  const shapes = Array.from({ length: SHAPES }, () => new Float32Array(n * 3));
  const gauss = () => (r() + r() + r() - 1.5) / 1.5;

  for (let i = 0; i < n; i++) {
    const k = i * 3;
    const u = i / n;

    // 0 — chaos: clustered noise cloud (unstructured data)
    const c = Math.floor(r() * 7);
    shapes[0][k] = Math.cos(c * 2.1) * 4.5 + gauss() * 2.6;
    shapes[0][k + 1] = Math.sin(c * 1.3) * 2.6 + gauss() * 1.8;
    shapes[0][k + 2] = Math.sin(c * 3.7) * 2 + gauss() * 2.4;

    // 1 — Fibonacci sphere with a few concentric shells
    const shell = 2.2 + (i % 3) * 0.55;
    const phi = Math.acos(1 - 2 * ((i + 0.5) / n));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    shapes[1][k] = Math.cos(theta) * Math.sin(phi) * shell;
    shapes[1][k + 1] = Math.cos(phi) * shell;
    shapes[1][k + 2] = Math.sin(theta) * Math.sin(phi) * shell;

    // 2 — double helix with rungs (timeline / sequence)
    const t = u * Math.PI * 9;
    const y = (u - 0.5) * 11;
    const strand = i % 5;
    if (strand < 2) {
      const a = t + strand * Math.PI;
      shapes[2][k] = Math.cos(a) * 1.8 + gauss() * 0.08;
      shapes[2][k + 1] = y;
      shapes[2][k + 2] = Math.sin(a) * 1.8 + gauss() * 0.08;
    } else {
      const s = r() * 2 - 1;
      const a = Math.round(t / 0.6) * 0.6;
      shapes[2][k] = Math.cos(a) * 1.8 * s;
      shapes[2][k + 1] = (Math.round(y / 0.42) * 0.42);
      shapes[2][k + 2] = Math.sin(a) * 1.8 * s;
    }

    // 3 — cubic lattice: edges of a 6×6×6 grid (structure)
    const g = 6;
    const step = 0.9;
    const axis = i % 3;
    const p = [
      (Math.floor(r() * g) - (g - 1) / 2) * step,
      (Math.floor(r() * g) - (g - 1) / 2) * step,
      (Math.floor(r() * g) - (g - 1) / 2) * step,
    ];
    p[axis] = (r() - 0.5) * (g - 1) * step;
    shapes[3][k] = p[0];
    shapes[3][k + 1] = p[1];
    shapes[3][k + 2] = p[2];

    // 4 — torus knot (p=2, q=3) with tube scatter (a model's latent manifold)
    const kt = u * Math.PI * 2 * 1;
    const kp = 2;
    const kq = 3;
    const rad = 2 + Math.cos(kq * kt * 1) * 0.9;
    const cx = rad * Math.cos(kp * kt);
    const cy = rad * Math.sin(kp * kt);
    const cz = Math.sin(kq * kt) * 0.9;
    const tube = 0.35 * Math.sqrt(r());
    const ta = r() * Math.PI * 2;
    shapes[4][k] = (cx + Math.cos(ta) * tube) * 1.1;
    shapes[4][k + 1] = (cy + Math.sin(ta) * tube) * 1.1;
    shapes[4][k + 2] = (cz + Math.cos(ta * 1.7) * tube) * 1.1;

    // 5 — spiral galaxy (open invitation)
    const arms = 3;
    const arm = i % arms;
    const dist = Math.pow(r(), 0.7) * 5.5;
    const ang = (arm / arms) * Math.PI * 2 + dist * 0.9;
    const spread = 0.35 + dist * 0.06;
    shapes[5][k] = Math.cos(ang) * dist + gauss() * spread;
    shapes[5][k + 1] = gauss() * 0.25 * (1.2 - dist / 6);
    shapes[5][k + 2] = Math.sin(ang) * dist + gauss() * spread;
  }

  const rand = new Float32Array(n);
  for (let i = 0; i < n; i++) rand[i] = r();
  return { shapes, rand };
}

const vertexShader = /* glsl */ `
  attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2;
  attribute vec3 aP3; attribute vec3 aP4; attribute vec3 aP5;
  attribute float aRand;
  uniform float uFrom; uniform float uTo; uniform float uMix;
  uniform float uTime; uniform float uSize; uniform float uPixelRatio;
  uniform vec3 uColA; uniform vec3 uColB;
  varying vec3 vColor; varying float vAlpha;

  vec3 pick(float i) {
    if (i < 0.5) return aP0;
    if (i < 1.5) return aP1;
    if (i < 2.5) return aP2;
    if (i < 3.5) return aP3;
    if (i < 4.5) return aP4;
    return aP5;
  }

  void main() {
    // Staggered morph: each particle starts at a slightly different moment.
    float m = clamp(uMix * 1.5 - aRand * 0.5, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(pick(uFrom), pick(uTo), m);

    // Mid-flight swirl so morphs feel like flowing matter, not a cross-fade.
    float flight = sin(m * 3.14159);
    float a = aRand * 6.2831 + uTime * 0.6;
    p += vec3(cos(a), sin(a * 1.3), sin(a)) * flight * (0.8 + aRand * 1.4);

    // Idle breathing
    p += 0.05 * vec3(sin(uTime * 0.7 + aRand * 40.0), cos(uTime * 0.6 + aRand * 31.0), sin(uTime * 0.5 + aRand * 17.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.75 + 0.25 * sin(uTime * 2.0 + aRand * 60.0);
    gl_PointSize = uSize * (0.5 + aRand) * uPixelRatio * twinkle * (10.0 / -mv.z);

    vColor = mix(uColA, uColB, smoothstep(-3.0, 3.0, p.y + p.x * 0.4));
    vAlpha = (0.35 + 0.65 * aRand) * (0.7 + flight * 0.6);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 3.0);
    gl_FragColor = vec4(vColor * (0.6 + glow * 1.4), (core * 0.55 + glow) * vAlpha * uOpacity);
  }
`;

type Section = { top: number; shape: number };

function Particles({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const sections = useRef<Section[]>([]);

  const { geometry, material } = useMemo(() => {
    const { shapes, rand } = buildShapes(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    shapes.forEach((s, i) => geometry.setAttribute(`aP${i}`, new THREE.BufferAttribute(s, 3)));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uFrom: { value: 0 },
        uTo: { value: 0 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 3.2 },
        uOpacity: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColA: { value: new THREE.Color(SHAPE_COLORS[0][0]) },
        uColB: { value: new THREE.Color(SHAPE_COLORS[0][1]) },
      },
    });
    return { geometry, material };
  }, [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // Cache section offsets (re-measured on resize / layout shifts).
  useEffect(() => {
    const measure = () => {
      sections.current = SECTION_SHAPES.flatMap(([id, shape]) => {
        const el = document.getElementById(id);
        return el ? [{ top: el.getBoundingClientRect().top + window.scrollY, shape }] : [];
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const tmp = useMemo(() => ({ a: new THREE.Color(), b: new THREE.Color(), c: new THREE.Color() }), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;

    const secs = sections.current;
    const center = window.scrollY + window.innerHeight * 0.55;
    let from = 0;
    let to = 0;
    let mix = 0;
    if (secs.length) {
      let i = secs.findLastIndex((s) => s.top <= center);
      if (i < 0) i = 0;
      const cur = secs[i];
      const next = secs[i + 1];
      from = cur.shape;
      to = next ? next.shape : cur.shape;
      if (next) {
        const prog = (center - cur.top) / (next.top - cur.top);
        mix = THREE.MathUtils.smoothstep(prog, 0.6, 1);
      }
    }
    // When the shape pair changes, snap; otherwise ease the mix.
    if (u.uFrom.value !== from || u.uTo.value !== to) {
      u.uFrom.value = from;
      u.uTo.value = to;
      u.uMix.value = mix;
    } else {
      u.uMix.value = THREE.MathUtils.damp(u.uMix.value, mix, 6, delta);
    }

    tmp.a.set(SHAPE_COLORS[from][0]).lerp(tmp.c.set(SHAPE_COLORS[to][0]), u.uMix.value);
    tmp.b.set(SHAPE_COLORS[from][1]).lerp(tmp.c.set(SHAPE_COLORS[to][1]), u.uMix.value);
    u.uColA.value.lerp(tmp.a, 0.08);
    u.uColB.value.lerp(tmp.b, 0.08);

    // Fade in once the hero has scrolled away.
    const target = THREE.MathUtils.smoothstep(window.scrollY / window.innerHeight, 0.35, 0.9);
    u.uOpacity.value = THREE.MathUtils.damp(u.uOpacity.value, target, 4, delta);

    const g = group.current;
    if (g) {
      g.rotation.y += delta * 0.06;
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, mouse.current.y * 0.25 + 0.15, 2, delta);
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -mouse.current.x * 0.12, 2, delta);
      g.position.x = THREE.MathUtils.damp(g.position.x, mouse.current.x * 0.4, 2, delta);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function MorphField({ tier, active }: { tier: "low" | "high"; active: boolean }) {
  return (
    <Canvas
      dpr={[1, tier === "high" ? 1.5 : 1]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 11], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ResumeLoop active={active} />
      <Particles count={tier === "high" ? 9000 : 3500} />
    </Canvas>
  );
}
