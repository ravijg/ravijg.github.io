"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/resume";

/**
 * Generated cover art for each project — an abstract illustration of what the
 * system does. Stands in for screenshots (swap in real images via next/image).
 */
export function ProjectArt({ project, className }: { project: Project; className?: string }) {
  const [a, b] = project.palette;
  const id = `g-${project.slug}`;
  const ref = useRef<SVGSVGElement>(null);

  // SMIL <animate> runs on the main thread and forces a style recalc every frame,
  // even off-screen. Only animate while the art is visible (never for reduced motion).
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.pauseAnimations();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 400 240" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${id}-bg`} cx="0.7" cy="0.3" r="0.9">
          <stop offset="0" stopColor={a} stopOpacity=".22" />
          <stop offset="1" stopColor="#05060a" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity=".05" />
        </pattern>
      </defs>
      <rect width="400" height="240" fill="#0a0c14" />
      <rect width="400" height="240" fill={`url(#${id}-grid)`} />
      <rect width="400" height="240" fill={`url(#${id}-bg)`} />
      <g className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ transformOrigin: "200px 120px" }}>
        {VISUALS[project.visual](id)}
      </g>
    </svg>
  );
}

const VISUALS: Record<Project["visual"], (id: string) => React.ReactNode> = {
  // Unstructured document → highlighted entities → JSON
  extract: (id) => (
    <>
      <rect x="40" y="40" width="150" height="160" rx="10" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".1" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x="56" y={58 + i * 17} width={[110, 90, 118, 70, 104, 96, 80, 112][i]} height="6" rx="3" fill="#fff" fillOpacity=".12" />
      ))}
      <rect x="56" y="75" width="44" height="6" rx="3" fill={`url(#${id})`} />
      <rect x="96" y="126" width="36" height="6" rx="3" fill={`url(#${id})`} />
      <rect x="70" y="160" width="50" height="6" rx="3" fill={`url(#${id})`} />
      <path d="M200 120h40" stroke={`url(#${id})`} strokeWidth="2" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <rect x="250" y="64" width="116" height="112" rx="10" fill="#000" fillOpacity=".35" stroke={`url(#${id})`} strokeOpacity=".6" />
      <text x="264" y="92" fontFamily="monospace" fontSize="12" fill="#fff" fillOpacity=".8">{"{"}</text>
      {["drug", "dose", "trial"].map((k, i) => (
        <text key={k} x="276" y={112 + i * 18} fontFamily="monospace" fontSize="11" fill="#fff" fillOpacity=".6">
          <tspan fill={`url(#${id})`}>{k}</tspan>: …
        </text>
      ))}
      <text x="264" y="166" fontFamily="monospace" fontSize="12" fill="#fff" fillOpacity=".8">{"}"}</text>
    </>
  ),
  // Query vector searching an embedding cloud
  retrieve: (id) => {
    const pts = Array.from({ length: 40 }, (_, i) => ({
      x: 180 + Math.cos(i * 2.4) * (30 + ((i * 37) % 90)),
      y: 120 + Math.sin(i * 2.4) * (20 + ((i * 23) % 70)),
    }));
    const near = [3, 11, 19];
    return (
      <>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={near.includes(i) ? 5 : 2.5} fill={near.includes(i) ? `url(#${id})` : "#fff"} fillOpacity={near.includes(i) ? 1 : 0.25} />
        ))}
        <circle cx="70" cy="120" r="9" fill={`url(#${id})`} />
        <text x="50" y="148" fontFamily="monospace" fontSize="10" fill="#fff" fillOpacity=".6">query</text>
        {near.map((n) => (
          <line key={n} x1="70" y1="120" x2={pts[n].x} y2={pts[n].y} stroke={`url(#${id})`} strokeOpacity=".7" strokeDasharray="3 3">
            <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite" />
          </line>
        ))}
        <rect x="300" y="90" width="76" height="60" rx="10" fill="#000" fillOpacity=".4" stroke={`url(#${id})`} strokeOpacity=".6" />
        <text x="318" y="125" fontFamily="monospace" fontSize="12" fill="#fff">LLM</text>
      </>
    );
  },
  // LangGraph state machine
  graph: (id) => {
    const n = [
      { x: 60, y: 120, l: "intent" },
      { x: 160, y: 60, l: "slots" },
      { x: 160, y: 180, l: "ask" },
      { x: 260, y: 120, l: "assess" },
      { x: 350, y: 120, l: "route" },
    ];
    const e = [[0, 1], [1, 2], [2, 1], [1, 3], [3, 4]];
    return (
      <>
        {e.map(([s, t], i) => (
          <line key={i} x1={n[s].x} y1={n[s].y} x2={n[t].x} y2={n[t].y} stroke={`url(#${id})`} strokeOpacity=".5" strokeWidth="1.5" />
        ))}
        {n.map((p, i) => (
          <g key={p.l}>
            <circle cx={p.x} cy={p.y} r="22" fill="#0a0c14" stroke={`url(#${id})`} strokeWidth="1.5" />
            <circle cx={p.x} cy={p.y} r="22" fill={`url(#${id})`} fillOpacity=".15">
              <animate attributeName="fill-opacity" values=".05;.45;.05" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff">{p.l}</text>
          </g>
        ))}
      </>
    );
  },
  // Modular builder blocks
  builder: (id) => (
    <>
      {[
        [70, 60, "intent"],
        [170, 60, "slots"],
        [270, 60, "llm"],
        [120, 130, "pipeline"],
        [220, 130, "apis"],
      ].map(([x, y, l], i) => (
        <g key={l as string}>
          <rect x={x as number} y={y as number} width="88" height="52" rx="12" fill="#fff" fillOpacity=".04" stroke={`url(#${id})`} strokeOpacity=".7" />
          <text x={(x as number) + 44} y={(y as number) + 31} textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#fff" fillOpacity=".85">{l}</text>
          <circle cx={(x as number) + 88} cy={(y as number) + 26} r="4" fill={`url(#${id})`}>
            <animate attributeName="r" values="3;5;3" dur="1.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <rect x="150" y="196" width="100" height="24" rx="12" fill={`url(#${id})`} />
      <text x="200" y="212" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#05060a" fontWeight="700">deploy()</text>
    </>
  ),
  // Embedded chat widget
  widget: (id) => (
    <>
      <rect x="40" y="36" width="230" height="168" rx="10" fill="#fff" fillOpacity=".03" stroke="#fff" strokeOpacity=".08" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="56" y={56 + i * 26} width={[150, 120, 170, 90][i]} height="10" rx="5" fill="#fff" fillOpacity=".08" />
      ))}
      <rect x="230" y="60" width="140" height="150" rx="16" fill="#0b0d14" stroke={`url(#${id})`} strokeOpacity=".8" />
      <rect x="230" y="60" width="140" height="30" rx="16" fill={`url(#${id})`} fillOpacity=".9" />
      <rect x="244" y="102" width="80" height="18" rx="9" fill="#fff" fillOpacity=".12" />
      <rect x="276" y="128" width="80" height="18" rx="9" fill={`url(#${id})`} fillOpacity=".7" />
      <rect x="244" y="154" width="96" height="18" rx="9" fill="#fff" fillOpacity=".12" />
      <circle cx="356" cy="196" r="4" fill={`url(#${id})`}>
        <animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <text x="246" y="80" fontFamily="monospace" fontSize="10" fill="#05060a" fontWeight="700">RBAC ✓</text>
    </>
  ),
  // Leaf with detection boxes
  vision: (id) => (
    <>
      <path d="M200 40c70 20 110 70 90 140-60 10-120-10-150-60 10-40 30-70 60-80Z" fill={`url(#${id})`} fillOpacity=".18" stroke={`url(#${id})`} strokeWidth="1.5" />
      <path d="M150 170C190 130 230 100 280 70" stroke={`url(#${id})`} strokeOpacity=".6" />
      <rect x="196" y="86" width="48" height="40" rx="3" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
      <rect x="196" y="74" width="66" height="12" fill="#fbbf24" />
      <text x="199" y="83" fontFamily="monospace" fontSize="8" fill="#05060a" fontWeight="700">disease</text>
      <rect x="160" y="128" width="40" height="34" rx="3" fill="none" stroke="#fb7185" strokeWidth="1.5" />
      <rect x="160" y="116" width="58" height="12" fill="#fb7185" />
      <text x="163" y="125" fontFamily="monospace" fontSize="8" fill="#05060a" fontWeight="700">deficiency</text>
      <line x1="120" x2="300" y1="60" y2="60" stroke={`url(#${id})`} strokeOpacity=".8">
        <animate attributeName="y1" values="50;200;50" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="50;200;50" dur="3s" repeatCount="indefinite" />
      </line>
    </>
  ),
  // Query image → crop → embedding → top-4 grid
  similarity: (id) => (
    <>
      <rect x="30" y="70" width="80" height="100" rx="10" fill="#fff" fillOpacity=".04" stroke={`url(#${id})`} />
      <circle cx="70" cy="112" r="22" fill={`url(#${id})`} fillOpacity=".5" />
      <rect x="44" y="86" width="52" height="52" fill="none" stroke="#fbbf24" strokeDasharray="3 3" />
      <text x="70" y="160" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff" fillOpacity=".6">query</text>
      <path d="M118 120h28" stroke={`url(#${id})`} strokeWidth="2" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={154 + i * 5} y={120 - (((i * 37) % 9) + 3) * 3} width="3" height={(((i * 37) % 9) + 3) * 6} rx="1" fill={`url(#${id})`} fillOpacity=".8" />
      ))}
      <path d="M222 120h20" stroke={`url(#${id})`} strokeWidth="2" strokeDasharray="4 4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={250 + (i % 2) * 64} y={52 + Math.floor(i / 2) * 70} width="56" height="62" rx="8" fill="#fff" fillOpacity=".04" stroke={`url(#${id})`} strokeOpacity={1 - i * 0.18} />
          <circle cx={278 + (i % 2) * 64} cy={78 + Math.floor(i / 2) * 70} r={16 - i} fill={`url(#${id})`} fillOpacity={0.5 - i * 0.08} />
          <text x={278 + (i % 2) * 64} y={108 + Math.floor(i / 2) * 70} textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#fff" fillOpacity=".7">#{i + 1}</text>
        </g>
      ))}
    </>
  ),
  // Stacked rolls with detection boxes and a live count
  counter: (id) => (
    <>
      {[0, 1, 2, 3].flatMap((row) =>
        Array.from({ length: 5 - (row % 2) }, (_, col) => {
          const cx = 80 + col * 42 + (row % 2) * 21;
          const cy = 190 - row * 38;
          return (
            <g key={`${row}-${col}`}>
              <circle cx={cx} cy={cy} r="18" fill="#fff" fillOpacity=".05" stroke={`url(#${id})`} strokeOpacity=".6" />
              <circle cx={cx} cy={cy} r="6" fill="none" stroke={`url(#${id})`} strokeOpacity=".5" />
              <rect x={cx - 20} y={cy - 20} width="40" height="40" fill="none" stroke="#a3e635" strokeOpacity=".7">
                <animate attributeName="stroke-opacity" values="0;.9;.9" keyTimes="0;.5;1" dur="2.4s" begin={`${(row * 5 + col) * 0.08}s`} repeatCount="indefinite" />
              </rect>
            </g>
          );
        }),
      )}
      <rect x="296" y="40" width="80" height="58" rx="10" fill="#000" fillOpacity=".5" stroke={`url(#${id})`} />
      <text x="336" y="62" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff" fillOpacity=".6">rolls</text>
      <text x="336" y="88" textAnchor="middle" fontFamily="monospace" fontSize="22" fontWeight="700" fill={`url(#${id})`}>18</text>
    </>
  ),
  // DB2 → validate → IRIS → e-invoice / e-way bill, with audit log
  billing: (id) => (
    <>
      {[
        [40, "DB2"],
        [130, "validate"],
        [220, "IRIS"],
      ].map(([x, l], i) => (
        <g key={l as string}>
          <rect x={x as number} y="92" width="70" height="44" rx="10" fill="#fff" fillOpacity=".04" stroke={`url(#${id})`} />
          <text x={(x as number) + 35} y="118" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#fff" fillOpacity=".85">{l}</text>
          {i < 2 && (
            <path d={`M${(x as number) + 72} 114h16`} stroke={`url(#${id})`} strokeWidth="2" strokeDasharray="4 3">
              <animate attributeName="stroke-dashoffset" from="14" to="0" dur=".9s" repeatCount="indefinite" />
            </path>
          )}
        </g>
      ))}
      <path d="M292 108l18-20M292 120l18 20" stroke={`url(#${id})`} strokeWidth="1.5" />
      <rect x="312" y="62" width="64" height="40" rx="6" fill={`url(#${id})`} fillOpacity=".85" />
      <text x="344" y="86" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#05060a">e-invoice</text>
      <rect x="312" y="128" width="64" height="40" rx="6" fill="#fff" fillOpacity=".08" stroke={`url(#${id})`} />
      <text x="344" y="152" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff">e-way bill</text>
      <rect x="40" y="168" width="250" height="40" rx="8" fill="#000" fillOpacity=".35" stroke="#fff" strokeOpacity=".08" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="52" y={176 + i * 9} width={[200, 160, 120][i]} height="4" rx="2" fill="#fff" fillOpacity=".15" />
      ))}
      <text x="282" y="200" textAnchor="end" fontFamily="monospace" fontSize="8" fill={`url(#${id})`}>audit · MSSQL</text>
    </>
  ),
  // Inbox → folders by invoice no. → client mail-out
  mail: (id) => (
    <>
      <rect x="36" y="80" width="90" height="64" rx="8" fill="#fff" fillOpacity=".05" stroke={`url(#${id})`} />
      <path d="M36 84l45 34 45-34" fill="none" stroke={`url(#${id})`} />
      <text x="81" y="162" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff" fillOpacity=".6">mailbox</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M130 112C170 112 170 ${64 + i * 52} 210 ${64 + i * 52}`} fill="none" stroke={`url(#${id})`} strokeOpacity=".6" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.1s" repeatCount="indefinite" />
          </path>
          <path d={`M212 ${50 + i * 52}h22l6 6h34v24h-62z`} fill="#fff" fillOpacity=".06" stroke={`url(#${id})`} strokeOpacity=".8" />
          <text x="243" y={70 + i * 52} textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#fff" fillOpacity=".7">INV-{["A", "B", "C"][i]}</text>
          <path d={`M278 ${64 + i * 52}h40`} stroke={`url(#${id})`} strokeOpacity=".5" />
          <circle cx="334" cy={64 + i * 52} r="12" fill={`url(#${id})`} fillOpacity={0.7 - i * 0.15} />
          <text x="334" y={68 + i * 52} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#05060a">{["C1", "C2", "C3"][i]}</text>
        </g>
      ))}
    </>
  ),
  // ICEGATE + PDFs → MSSQL → report bars
  exim: (id) => (
    <>
      <rect x="30" y="50" width="70" height="40" rx="8" fill="#fff" fillOpacity=".05" stroke={`url(#${id})`} />
      <text x="65" y="74" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff" fillOpacity=".8">ICEGATE</text>
      <rect x="30" y="140" width="70" height="40" rx="8" fill="#fff" fillOpacity=".05" stroke={`url(#${id})`} />
      <text x="65" y="164" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fff" fillOpacity=".8">PDFs</text>
      <path d="M102 70C130 70 130 115 150 115M102 160C130 160 130 115 150 115" fill="none" stroke={`url(#${id})`} strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <ellipse cx="180" cy="98" rx="28" ry="8" fill="none" stroke={`url(#${id})`} />
      <path d="M152 98v34c0 4 12 8 28 8s28-4 28-8V98" fill="#fff" fillOpacity=".05" stroke={`url(#${id})`} />
      <text x="180" y="125" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#fff" fillOpacity=".7">MSSQL</text>
      <path d="M212 118h20" stroke={`url(#${id})`} />
      <rect x="238" y="40" width="140" height="160" rx="10" fill="#000" fillOpacity=".35" stroke="#fff" strokeOpacity=".1" />
      {[52, 80, 38, 66, 90, 58, 74].map((h, i) => (
        <rect key={i} x={252 + i * 17} y={160 - h} width="11" height={h} rx="2" fill={`url(#${id})`} fillOpacity={0.4 + (i % 3) * 0.2}>
          <animate attributeName="height" values={`${h * 0.6};${h};${h * 0.6}`} dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`${160 - h * 0.6};${160 - h};${160 - h * 0.6}`} dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <text x="252" y="182" fontFamily="monospace" fontSize="9" fill="#fff" fillOpacity=".6">14 reports · .xlsx</text>
    </>
  ),
};
