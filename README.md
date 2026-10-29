# Ravi Gauswami — AI Engineer Portfolio

A cinematic, interactive portfolio built around one idea: **turning unstructured language into structured intelligence**, which is the common thread in Ravi's LLM, RAG, NLP and conversational-AI work.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis · Three.js via React Three Fiber, Drei and postprocessing

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

Requires Node.js 20.9+.

### Environment variables (all optional)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for metadata, Open Graph, JSON-LD, `robots.txt` and `sitemap.xml`. Defaults to `https://ravijg.github.io`; set it if you move to a custom domain. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | A JSON form endpoint (e.g. [Formspree](https://formspree.io)). If set, the contact form POSTs `{ name, email, message }` to it. If unset, the form opens the visitor's mail client with the message pre-filled. |

Put them in `.env.local` for local development.

## Editing content

All copy lives in **[`src/data/resume.ts`](src/data/resume.ts)**. Every section reads from it, so you don't need to touch component code to change content:

- `profile`: name, role, contact details, LinkedIn, resume path, hero typing phrases
- `story`, `strengths`: About section
- `skillCategories`: Skills section. Proficiency rings are **computed** from how many projects list each skill in their `skills` array (no made-up percentages).
- `projects`: project cards and modals (problem, solution, achievements, impact, stack)
- `experience`, `education`, `stats`, `highlights`
- `certifications`: empty by default. Add entries and a certifications row appears in the Achievements section automatically.

The downloadable resume is served from `public/Ravi_Gauswami_AI_Engineer_Resume.pdf`. Replace that file to update it.

**Profile photo:** the hero shows an animated "RG" monogram. To use a photo, add it to `public/` and swap the `Avatar` component in `src/components/sections/Hero.tsx` for a `next/image`.

**Project images:** cards use generated SVG cover art (`src/components/projects/ProjectArt.tsx`). Swap in real screenshots with `next/image` if you have them.

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # fonts, SEO metadata, JSON-LD (Person / ProfilePage / projects)
│   ├── page.tsx              # section composition
│   ├── globals.css           # design tokens, Tailwind v4 theme, utilities
│   ├── opengraph-image.tsx   # generated 1200×630 social card
│   ├── icon.svg, robots.ts, sitemap.ts
├── data/resume.ts            # ← single source of truth for content
├── lib/                      # hooks (device tier, media queries, in-view), GSAP setup, Lenis handle (smooth.ts)
└── components/
    ├── layout/               # Navbar (scroll-spy), ScrollProgress, CursorGlow, BackgroundMesh, Footer
    ├── sections/             # Hero, About, Skills, Experience, Projects, AILab, Achievements, Education, Contact
    ├── three/HeroScene.tsx   # R3F neural core, holographic project screens, glyph particles, grid, stars
    ├── lab/                  # AI Lab demos: NeuralViz, ExtractDemo, PipelineDemo, TriageDemo
    ├── projects/             # ProjectArt (SVG covers), ProjectModal (shared-layout dialog)
    ├── contact/              # ContactForm (validation + feedback), Starfield canvas
    └── ui/                   # Reveal/Stagger, SectionHeading, MagneticButton, TiltCard, TypingText, Counter, TechIcon
```

## Design and motion notes

- **Visual identity:** near-black canvas with a cyan → violet → magenta "signal" gradient, Geist Sans/Mono for UI and code, and Instrument Serif italics for emphasis words.
- **3D storytelling:**
  - The hero opens with a camera dolly-in on a glass "AI core": a transmission-material crystal with chromatic aberration, a glowing heart, wireframe shells and orbit rings, lit by procedural Lightformers, with bloom, chromatic aberration and vignette post-processing. Hovering the core spins it up.
  - Behind the rest of the page, a single GPU particle system (**MorphField**) morphs between shapes as you scroll, telling the unstructured → structured story: chaos (About), sphere (Skills), double helix (Experience), lattice (Projects), torus knot (AI Lab) and galaxy (Contact). Morphing is staggered per particle with a mid-flight swirl, all in the vertex shader.
  - **Skills** is a draggable 3D sphere of logos with inertia and depth of field.
- **Feel:**
  - Lenis inertial smooth scrolling, synced to GSAP's ticker.
  - A custom cursor (dot plus lagging ring) that grows over interactive elements and morphs into labelled pills: "View" on project cards, "Drag" on the sphere, and "Open" / "AI core" on 3D objects.
  - Masked heading reveals, and 3D swing-up entrances on cards.
- **Framer Motion** handles UI transitions: staggered reveals, the nav pill, the card-to-modal shared layout, tab panels, and form feedback.
- **GSAP ScrollTrigger** handles storytelling: the About manifesto lights up word by word, and the journey and experience timelines draw themselves as you scroll.
- **AI Lab:** interactive simulations of entity extraction, the RAG pipeline with relevance scoring, and intent detection with slot filling. The sample data is fictional and the outputs are pre-computed. The UI says so.

## Performance and accessibility

- The hero intro is pure CSS, so the headline (the LCP element) paints before hydration.
- The 3D scene is code-split (`next/dynamic`, `ssr: false`) and mounts on `requestIdleCallback`. It renders only while the hero is on screen (`frameloop="never"` otherwise) and adapts its resolution with Drei's `PerformanceMonitor`.
- **Graceful degradation:** `useDeviceTier()` picks one of three levels:
  - `high`: full scene
  - `low` (touch, ≤4 cores or ≤4 GB memory): fewer nodes, particles and screens
  - `none` (reduced motion, Save-Data or no WebGL): a static SVG network
- Post-processing and the transmission crystal are used only on the `high` tier. The page-wide particle field uses 9k particles (high) or 3.5k (low) and renders only once the hero has scrolled away, so only one WebGL scene animates at a time.
- Canvas effects (neural viz, starfield, skill sphere) pause when off screen.
- `prefers-reduced-motion` disables the 3D scenes, smooth scrolling, the custom cursor, the typing effect, GSAP scrubs and CSS animations.
- Skip link, semantic landmarks, labelled sections, keyboard-navigable tabs (arrow keys), a focus-trapped modal (Esc closes it and focus is restored), an `aria-live` form status, and visible focus rings.

## Deploying

The site is a static export (`output: "export"` in `next.config.ts`). `npm run build` writes plain HTML, CSS and JS to `out/`.

**GitHub Pages (live at https://ravijg.github.io):** `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`. One-time setup in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

To preview the exported site locally, run `npx serve out`.
