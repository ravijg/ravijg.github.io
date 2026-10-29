import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { BackgroundMesh } from "@/components/layout/BackgroundMesh";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { MorphFieldMount } from "@/components/three/MorphFieldMount";
import { Hero } from "@/components/sections/Hero";
import dynamic from "next/dynamic";

// Below-the-fold sections are still server-rendered (full HTML for SEO and no-JS),
// but each ships as its own chunk inside a Suspense boundary, so React hydrates
// them as separate small tasks instead of one long one that blocks taps on phones.
const About = dynamic(() => import("@/components/sections/About").then((m) => m.About));
const Skills = dynamic(() => import("@/components/sections/Skills").then((m) => m.Skills));
const Experience = dynamic(() => import("@/components/sections/Experience").then((m) => m.Experience));
const Projects = dynamic(() => import("@/components/sections/Projects").then((m) => m.Projects));
const AILab = dynamic(() => import("@/components/sections/AILab").then((m) => m.AILab));
const Achievements = dynamic(() => import("@/components/sections/Achievements").then((m) => m.Achievements));
const Education = dynamic(() => import("@/components/sections/Education").then((m) => m.Education));
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => m.Contact));

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <BackgroundMesh />
      <MorphFieldMount />
      <CursorGlow />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <AILab />
        <Achievements />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
