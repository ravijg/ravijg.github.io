import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile, projects, experience, education, skillCategories } from "@/data/resume";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${profile.name} — ${profile.role} | LLMs, RAG & Conversational AI`;
const description = `${profile.name} is an AI Engineer in ${profile.location} with ${profile.yearsOfExperience} years building LLM applications, RAG pipelines, conversational agents and NLP systems with Python, LangChain, LangGraph, FAISS and ChromaDB.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  keywords: [
    "Ravi Gauswami",
    "AI Engineer",
    "Machine Learning Engineer",
    "LLM Engineer",
    "RAG",
    "LangChain",
    "LangGraph",
    "NLP",
    "Conversational AI",
    "ChromaDB",
    "FAISS",
    "FastAPI",
    "Ahmedabad",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title,
    description,
    siteName: `${profile.name} — ${profile.role}`,
    firstName: "Ravi",
    lastName: "Gauswami",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${profile.siteUrl}/#profile`,
      url: profile.siteUrl,
      name: title,
      mainEntity: { "@id": `${profile.siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      email: `mailto:${profile.email}`,
      telephone: profile.phone,
      url: profile.siteUrl,
      sameAs: [profile.linkedin],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: education.institution,
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: `${education.degree} in ${education.field}`,
      },
      worksFor: experience.map((r) => ({ "@type": "Organization", name: r.company })),
      knowsAbout: skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
    },
    {
      "@type": "ItemList",
      name: "Selected AI projects",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: p.title,
          description: p.tagline,
          programmingLanguage: p.stack[0],
          keywords: p.stack.join(", "),
          author: { "@id": `${profile.siteUrl}/#person` },
        },
      })),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
