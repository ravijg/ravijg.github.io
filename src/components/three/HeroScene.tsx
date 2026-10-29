"use client";

// React Three Fiber animates by mutating three.js objects inside useFrame, outside React's
// render cycle. That is the documented R3F pattern, so the compiler immutability rule is off here.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Grid,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Stars,
} from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { projects } from "@/data/resume";
import { scrollToTarget } from "@/lib/smooth";
import { ResumeLoop } from "./ResumeLoop";

type Tier = "low" | "high";

const PALETTE = [new THREE.Color("#7cf7ff"), new THREE.Color("#8b7bff"), new THREE.Color("#ff7ad9")];

/** Deterministic PRNG so the network layout is stable between renders. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function gradientAt(t: number, out = new THREE.Color()) {
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * (PALETTE.length - 1);
  const i = Math.min(Math.floor(scaled), PALETTE.length - 2);
  return out.copy(PALETTE[i]).lerp(PALETTE[i + 1], scaled - i);
}

/* ------------------------------------------------------------------ */
/* Neural network core: instanced nodes, edges and travelling pulses  */
/* ------------------------------------------------------------------ */
function NeuralCore({ tier }: { tier: Tier }) {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const { nodes, edges, outgoing, edgeGeometry, pulseCount } = useMemo(() => {
    const rand = rng(42);
    const layers = tier === "high" ? [6, 10, 14, 10, 6] : [4, 7, 9, 7, 4];
    const nodes: { pos: THREE.Vector3; layer: number; phase: number }[] = [];
    const byLayer: number[][] = [];

    layers.forEach((count, li) => {
      const x = (li / (layers.length - 1) - 0.5) * 6.4;
      const radius = 0.6 + Math.sin((li / (layers.length - 1)) * Math.PI) * 1.5;
      byLayer.push([]);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rand() * 0.4;
        const pos = new THREE.Vector3(
          x + (rand() - 0.5) * 0.3,
          Math.cos(a) * radius,
          Math.sin(a) * radius,
        );
        byLayer[li].push(nodes.length);
        nodes.push({ pos, layer: li, phase: rand() * Math.PI * 2 });
      }
    });

    const edges: [number, number][] = [];
    for (let li = 0; li < byLayer.length - 1; li++) {
      for (const a of byLayer[li]) {
        const targets = [...byLayer[li + 1]].sort(() => rand() - 0.5).slice(0, 3);
        for (const b of targets) edges.push([a, b]);
      }
    }

    const positions = new Float32Array(edges.length * 6);
    const colors = new Float32Array(edges.length * 6);
    const c = new THREE.Color();
    edges.forEach(([a, b], i) => {
      nodes[a].pos.toArray(positions, i * 6);
      nodes[b].pos.toArray(positions, i * 6 + 3);
      gradientAt(nodes[a].layer / (layers.length - 1), c).toArray(colors, i * 6);
      gradientAt(nodes[b].layer / (layers.length - 1), c).toArray(colors, i * 6 + 3);
    });
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    edgeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const outgoing: number[][] = nodes.map(() => []);
    edges.forEach(([a], i) => outgoing[a].push(i));

    return { nodes, edges, outgoing, edgeGeometry, pulseCount: tier === "high" ? 90 : 40 };
  }, [tier]);

  // Each pulse travels along one edge; when it arrives it hops to a random edge.
  const pulseState = useMemo(() => {
    const rand = rng(7);
    return Array.from({ length: pulseCount }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.25 + rand() * 0.5,
    }));
  }, [pulseCount, edges.length]);

  const pulseGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pulseCount * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(pulseCount * 3), 3));
    return g;
  }, [pulseCount]);

  useLayoutEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    nodes.forEach((n, i) => {
      mesh.setMatrixAt(i, m.makeTranslation(n.pos.x, n.pos.y, n.pos.z));
      mesh.setColorAt(i, gradientAt(n.layer / 4, c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes]);

  useEffect(() => () => {
    edgeGeometry.dispose();
    pulseGeometry.dispose();
  }, [edgeGeometry, pulseGeometry]);

  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), s: new THREE.Vector3(), q: new THREE.Quaternion(), c: new THREE.Color() }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.x = Math.sin(t * 0.15) * 0.12;
      group.current.rotation.y += delta * 0.08;
    }

    // Breathing nodes
    const mesh = nodesRef.current;
    if (mesh) {
      nodes.forEach((n, i) => {
        const s = 1 + Math.sin(t * 2 + n.phase) * 0.25;
        tmp.s.setScalar(s);
        tmp.m.compose(n.pos, tmp.q, tmp.s);
        mesh.setMatrixAt(i, tmp.m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    // Travelling pulses
    const pos = pulseGeometry.attributes.position as THREE.BufferAttribute;
    const col = pulseGeometry.attributes.color as THREE.BufferAttribute;
    const d = Math.min(delta, 0.05);
    pulseState.forEach((p, i) => {
      p.t += d * p.speed;
      if (p.t >= 1) {
        // Continue from the arrival node when possible, giving the "signal propagation" look.
        const out = outgoing[edges[p.edge][1]];
        p.edge =
          out.length && Math.random() > 0.2
            ? out[Math.floor(Math.random() * out.length)]
            : Math.floor(Math.random() * edges.length);
        p.t = 0;
      }
      const [a, b] = edges[p.edge];
      const pa = nodes[a].pos;
      const pb = nodes[b].pos;
      pos.setXYZ(i, pa.x + (pb.x - pa.x) * p.t, pa.y + (pb.y - pa.y) * p.t, pa.z + (pb.z - pa.z) * p.t);
      gradientAt((nodes[a].layer + p.t) / 4, tmp.c);
      col.setXYZ(i, tmp.c.r, tmp.c.g, tmp.c.b);
    });
    pos.needsUpdate = true;
    col.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <points geometry={pulseGeometry}>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          map={glowSprite()}
        />
      </points>
      {/* Soft core light */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#8b7bff" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Procedural textures (no network requests)                          */
/* ------------------------------------------------------------------ */
let glowCache: THREE.Texture | null = null;
function glowSprite() {
  if (glowCache) return glowCache;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,.6)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowCache = new THREE.CanvasTexture(c);
  return glowCache;
}

function glyphTexture(glyph: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.font = "600 64px ui-monospace, SFMono-Regular, Menlo, monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(124,247,255,.9)";
  g.shadowBlur = 16;
  g.fillStyle = "#ffffff";
  g.fillText(glyph, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const SCREEN_SNIPPETS: Record<string, string[]> = {
  extract: ["doc = load(pdf)", "ents = ner(doc)", "llm.extract(ents)", "→ { drug, dose }"],
  retrieve: ["q = embed(query)", "k = chroma.query(q)", "rank(k, score)", "llm.answer(k)"],
  graph: ["graph = StateGraph()", "intent = detect(msg)", "fill_slots(state)", "route(priority)"],
  builder: ["bot = Nemo(domain)", "bot.add(intent)", "bot.add(slots)", "bot.deploy()"],
  widget: ["<script widget/>", "auth.rbac(user)", "api.orchestrate()", "docs.answer(q)"],
  vision: ["model = YOLO('v8')", "aug(dataset)", "model.train()", "detect(leaf)"],
  similarity: ["crop = yolo11n(img)", "vec = dinov2(crop)", "txt = easyocr(crop)", "→ top_k(vec, k=4)"],
  counter: ["model = YOLO('v8')", "dets = model(photo)", "count(dets.cls)", "→ { rolls, pipes, bags }"],
  billing: ["rows = db2.proc()", "validate(rows)", "iris.e_invoice(rows)", "→ audit(mssql)"],
  mail: ["inbox.fetch()", "match(invoice_no)", "file_to(folder)", "→ mail(client)"],
  exim: ["scrape(icegate)", "parse(customs_pdf)", "mssql.save(rows)", "→ export_xlsx()"],
};

function screenTexture(title: string, category: string, lines: string[], accent: string) {
  const W = 640;
  const H = 400;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const r = 28;
  g.beginPath();
  g.roundRect(4, 4, W - 8, H - 8, r);
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "rgba(16,20,34,0.92)");
  bg.addColorStop(1, "rgba(8,10,18,0.92)");
  g.fillStyle = bg;
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = accent;
  g.globalAlpha = 0.6;
  g.stroke();
  g.globalAlpha = 1;

  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(40 + i * 26, 40, 8, 0, Math.PI * 2);
    g.fill();
  });
  g.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  g.fillStyle = "rgba(255,255,255,.45)";
  g.fillText(category, 130, 48);

  g.font = "700 40px ui-sans-serif, system-ui, sans-serif";
  g.fillStyle = "#ffffff";
  g.fillText(title, 36, 120);

  g.font = "500 26px ui-monospace, SFMono-Regular, Menlo, monospace";
  lines.forEach((line, i) => {
    g.fillStyle = "rgba(255,255,255,.25)";
    g.fillText(String(i + 1).padStart(2, "0"), 36, 190 + i * 46);
    g.fillStyle = i === lines.length - 1 ? accent : "rgba(230,235,255,.85)";
    g.fillText(line, 90, 190 + i * 46);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Floating holographic screens showing project previews              */
/* ------------------------------------------------------------------ */
function FloatingScreens({ tier }: { tier: Tier }) {
  // Six screens max keeps the orbit legible; the first projects are the featured ones.
  const list = useMemo(() => projects.slice(0, tier === "high" ? 6 : 4), [tier]);
  const textures = useMemo(
    () =>
      list.map((p) =>
        screenTexture(p.codename, p.category.split("·")[0].trim(), SCREEN_SNIPPETS[p.visual], p.palette[0]),
      ),
    [list],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  return (
    <group>
      {list.map((p, i) => {
        // Narrow ellipse so the screens stay on the right half, clear of the headline.
        const angle = (i / list.length) * Math.PI * 2 + 0.4;
        const x = Math.cos(angle) * 2.6;
        const z = Math.sin(angle) * 4 - 1;
        const y = ((i % 3) - 1) * 1.2;
        return (
          <Float key={p.slug} speed={1.2} rotationIntensity={0.25} floatIntensity={0.8}>
            <Screen
              texture={textures[i]}
              position={[x, y, z]}
              accent={p.palette[0]}
              href={`#project-${p.slug}`}
            />
          </Float>
        );
      })}
    </group>
  );
}

function Screen({
  texture,
  position,
  accent,
  href,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  accent: string;
  href: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  useFrame(({ camera }, delta) => {
    const g = ref.current;
    if (!g) return;
    g.lookAt(camera.position);
    const target = hover ? 1.12 : 1;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 8, delta));
  });

  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    document.body.dataset.cursor = hover ? "Open" : "";
    return () => {
      document.body.style.cursor = "";
      document.body.dataset.cursor = "";
    };
  }, [hover]);

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onClick={() => scrollToTarget(href, -120)}
    >
      <mesh>
        <planeGeometry args={[1.92, 1.2]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Holographic glow plate behind the screen */}
      <mesh position={[0, 0, -0.02]} scale={1.08}>
        <planeGeometry args={[1.92, 1.2]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={hover ? 0.28 : 0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Floating code glyph particles                                      */
/* ------------------------------------------------------------------ */
const GLYPHS = ["{ }", "</>", "01", "λ", "∑", "→", "[ ]", "AI"];

function CodeParticles({ tier }: { tier: Tier }) {
  const perGlyph = tier === "high" ? 14 : 6;
  const groups = useMemo(() => {
    const rand = rng(99);
    return GLYPHS.map((glyph, gi) => {
      const positions = new Float32Array(perGlyph * 3);
      for (let i = 0; i < perGlyph; i++) {
        positions[i * 3] = (rand() - 0.5) * 22;
        positions[i * 3 + 1] = (rand() - 0.5) * 12;
        positions[i * 3 + 2] = (rand() - 0.5) * 14 - 3;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return { geo, tex: glyphTexture(glyph), color: PALETTE[gi % PALETTE.length], speed: 0.06 + rand() * 0.1 };
    });
  }, [perGlyph]);

  useEffect(
    () => () =>
      groups.forEach((g) => {
        g.geo.dispose();
        g.tex.dispose();
      }),
    [groups],
  );

  useFrame((_, delta) => {
    groups.forEach((g) => {
      const pos = g.geo.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < pos.count; j++) {
        let y = pos.getY(j) + delta * g.speed * 3;
        if (y > 6) y = -6;
        pos.setY(j, y);
      }
      pos.needsUpdate = true;
    });
  });

  return (
    <>
      {groups.map((g, i) => (
        <points key={i} geometry={g.geo}>
          <pointsMaterial
            map={g.tex}
            color={g.color}
            size={0.42}
            transparent
            opacity={0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig: pointer parallax + scroll dolly                        */
/* ------------------------------------------------------------------ */
function Rig() {
  const { camera, pointer } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  // Own timer: R3F resets its clock whenever the loop resumes, which would replay the intro.
  const introTime = useRef(0);
  useFrame((_, delta) => {
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    // Cinematic entrance: dolly in from deep space over the first ~2.5s.
    introTime.current += Math.min(delta, 0.1);
    const intro = THREE.MathUtils.smootherstep(introTime.current, 0, 2.6);
    const z = THREE.MathUtils.lerp(24, 10 + scroll * 4, intro);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 1.4 + (1 - intro) * -4, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.6 + pointer.y * 0.8 - scroll * 1.5 + (1 - intro) * 3, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 4, delta);
    camera.lookAt(look);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* AI core: glass crystal, energy heart, wireframe shells, orbit rings */
/* ------------------------------------------------------------------ */
function AICore({ tier }: { tier: Tier }) {
  const root = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const heart = useRef<THREE.Mesh>(null);
  const shellA = useRef<THREE.LineSegments>(null);
  const shellB = useRef<THREE.LineSegments>(null);
  const rings = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const spin = useRef(1);

  const shellGeoA = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.45, 1)), []);
  const shellGeoB = useMemo(() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.95, 0)), []);
  useEffect(() => () => {
    shellGeoA.dispose();
    shellGeoB.dispose();
  }, [shellGeoA, shellGeoB]);

  useEffect(() => {
    document.body.dataset.cursor = hover ? "AI core" : "";
    return () => {
      document.body.dataset.cursor = "";
    };
  }, [hover]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    spin.current = THREE.MathUtils.damp(spin.current, hover ? 4 : 1, 3, delta);
    const s = spin.current;
    if (crystal.current) {
      crystal.current.rotation.x += delta * 0.25 * s;
      crystal.current.rotation.y += delta * 0.35 * s;
    }
    if (heart.current) {
      const pulse = 1 + Math.sin(t * 2.4) * 0.08 + (hover ? 0.15 : 0);
      heart.current.scale.setScalar(THREE.MathUtils.damp(heart.current.scale.x, pulse, 6, delta));
    }
    if (shellA.current) shellA.current.rotation.set(t * 0.15 * s, -t * 0.2 * s, 0);
    if (shellB.current) shellB.current.rotation.set(-t * 0.1 * s, t * 0.12 * s, t * 0.05);
    if (rings.current) {
      rings.current.children.forEach((ring, i) => {
        ring.rotation.z += delta * (0.4 + i * 0.25) * s * (i % 2 ? -1 : 1);
      });
    }
    if (root.current) {
      const target = hover ? 1.12 : 1;
      root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, target, 5, delta));
    }
  });

  return (
    <group
      ref={root}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      {/* Energy heart — bright enough to bloom */}
      <mesh ref={heart}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color={[1.6, 2.4, 3]} toneMapped={false} />
      </mesh>
      <pointLight color="#7cf7ff" intensity={18} distance={8} />

      {/* Glass crystal */}
      <mesh ref={crystal}>
        <icosahedronGeometry args={[1, 0]} />
        {tier === "high" ? (
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            thickness={0.9}
            roughness={0.05}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.6}
            anisotropicBlur={0.2}
            distortion={0.35}
            distortionScale={0.4}
            temporalDistortion={0.15}
            iridescence={1}
            iridescenceIOR={1.3}
            color="#cfd8ff"
            backside
          />
        ) : (
          <meshPhysicalMaterial
            color="#9fb3ff"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.35}
            emissive="#3b3b9a"
            emissiveIntensity={0.4}
            flatShading
          />
        )}
      </mesh>

      {/* Wireframe shells */}
      <lineSegments ref={shellA} geometry={shellGeoA}>
        <lineBasicMaterial color="#7cf7ff" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <lineSegments ref={shellB} geometry={shellGeoB}>
        <lineBasicMaterial color="#ff7ad9" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      {/* Orbit rings with electrons */}
      <group ref={rings}>
        {[
          { r: 2.35, tilt: [1.1, 0.2, 0], color: [0.5, 2.2, 2.6] },
          { r: 2.7, tilt: [0.4, 1.0, 0], color: [1.6, 1.2, 3] },
          { r: 3.05, tilt: [-0.7, -0.5, 0], color: [2.6, 0.9, 2] },
        ].map((o, i) => (
          <group key={i} rotation={o.tilt as [number, number, number]}>
            <mesh>
              <torusGeometry args={[o.r, 0.006, 8, 160]} />
              <meshBasicMaterial color="#8b7bff" transparent opacity={0.4} toneMapped={false} />
            </mesh>
            <mesh position={[o.r, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={o.color as [number, number, number]} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
export default function HeroScene({ tier, active }: { tier: Tier; active: boolean }) {
  const [dpr, setDpr] = useState(tier === "high" ? 1.5 : 1);
  const cinematic = tier === "high";

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [-4, 3.6, 24], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: !cinematic, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ResumeLoop active={active} />
      {cinematic && <color attach="background" args={["#05060a"]} />}
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(cinematic ? 1.75 : 1.25, d + 0.25))}
      />
      <fog attach="fog" args={["#05060a", 9, 30]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[-6, 4, 6]} color="#8b7bff" intensity={60} />
      <pointLight position={[8, -3, 4]} color="#ff7ad9" intensity={40} />
      {/* Procedural studio lighting for the glass — no HDR download */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="ring" intensity={4} color="#7cf7ff" position={[0, 3, -6]} scale={6} />
        <Lightformer form="rect" intensity={3} color="#8b7bff" position={[-5, 0, 2]} scale={[2, 8, 1]} />
        <Lightformer form="rect" intensity={3} color="#ff7ad9" position={[5, -1, 2]} scale={[2, 8, 1]} />
        <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, 6, 4]} scale={3} />
      </Environment>
      <Rig />
      <group position={[3.4, 0, 0]}>
        <NeuralCore tier={tier} />
        <AICore tier={tier} />
        <FloatingScreens tier={tier} />
      </group>
      {/* Volumetric-looking backglow */}
      <mesh position={[3.4, 0, -4]}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial map={glowSprite()} color="#3b2f8f" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <CodeParticles tier={tier} />
      <Stars radius={60} depth={40} count={tier === "high" ? 2500 : 900} factor={3} saturation={0} fade speed={0.6} />
      <Grid
        position={[0, -3.2, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#1d2a44"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#5b5bd6"
        fadeDistance={24}
        fadeStrength={1.6}
        infiniteGrid
      />
      {cinematic && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.22} luminanceSmoothing={0.3} radius={0.75} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0006, 0.0009)}
            radialModulation
            modulationOffset={0.4}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
