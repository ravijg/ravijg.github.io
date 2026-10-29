/**
 * Single source of truth for every piece of portfolio content.
 * Facts come from Ravi Gauswami's resume plus project details Ravi supplied
 * (Skaps Industries work and EximAutomation); copy has been rewritten for the
 * web but no numbers, employers, dates or technologies were invented.
 */

export const profile = {
  name: "Ravi Gauswami",
  firstName: "Ravi",
  initials: "RG",
  role: "AI Engineer",
  headline: "LLMs · RAG · Computer Vision",
  location: "Ahmedabad, India",
  email: "rjgauswami2002@gmail.com",
  phone: "+91-8401209718",
  linkedin: "https://www.linkedin.com/in/ravi-gauswami-26681a195",
  resumeUrl: "/Ravi_Gauswami_AI_Engineer_Resume.pdf",
  yearsOfExperience: "3+",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Short summary used in metadata and schema markup. */
  summary:
    "AI/ML Engineer with 3+ years of experience building machine learning, NLP and computer vision systems with Python, FastAPI, Flask and Django. Specialised in LLM applications, RAG pipelines, visual search and enterprise automation.",
  typing: [
    "LLM-powered applications",
    "RAG pipelines",
    "conversational agents",
    "visual search engines",
    "computer vision counters",
    "medical NLP systems",
    "enterprise automation",
  ],
} as const;

export const story = {
  lead: "I build AI that reads the messy stuff — research papers, product photos, customs PDFs, inboxes, free-form conversations — and turns it into answers, data and decisions.",
  paragraphs: [
    "For over three years I've engineered production systems end to end: extracting structured clinical data from medical research, retrieval-augmented Q&A over private documents, multi-turn triage chatbots, and a Django platform that turns ICEGATE data and customs PDFs into 14 client reports.",
    "Today I'm an ML Engineer at Skaps Industries India, where my work runs on the factory floor and in the back office: YOLOv8 counting of rolls, pipes and bags, a DINOv2-powered visual product search API, e-invoice middleware and mailbox automation.",
    "My toolkit is Python-first — FastAPI, Flask and Django on the backend; LangChain, LangGraph and OpenAI models for reasoning; FAISS and ChromaDB for memory. I care about the unglamorous parts too: multiprocessing for throughput, relevance scoring to cut token spend, and middleware that keeps queries secure.",
  ],
  /** Phrase revealed word-by-word on scroll. */
  manifesto:
    "Language is the world's largest unstructured dataset. I build the systems that give it structure.",
};

export type Strength = {
  title: string;
  body: string;
  icon: "brain" | "vector" | "chat" | "bolt";
};

export const strengths: Strength[] = [
  {
    title: "LLM Application Engineering",
    body: "Production apps on OpenAI models with dynamic prompting, intent detection and context-aware generation.",
    icon: "brain",
  },
  {
    title: "Retrieval & Vector Search",
    body: "RAG pipelines on ChromaDB and FAISS with embeddings and relevance scoring for accurate, token-efficient answers.",
    icon: "vector",
  },
  {
    title: "Conversational Systems",
    body: "LangGraph agents with multi-turn slot filling, workflow automation and REST API orchestration.",
    icon: "chat",
  },
  {
    title: "Vision & Enterprise Automation",
    body: "YOLO detectors, DINOv2 visual search, and the scrapers, schedulers and DB2 / MSSQL integrations that put AI into real business workflows.",
    icon: "bolt",
  },
];

export type SkillId =
  | "python"
  | "sql"
  | "javascript"
  | "llms"
  | "langchain"
  | "langgraph"
  | "prompt"
  | "rag"
  | "nlp"
  | "spacy"
  | "huggingface"
  | "ml"
  | "faiss"
  | "chromadb"
  | "embeddings"
  | "yolov8"
  | "roboflow"
  | "cv"
  | "fastapi"
  | "flask"
  | "django"
  | "apis"
  | "docker"
  | "git"
  | "multiprocessing"
  | "db2"
  | "scraping"
  | "ocr"
  | "dinov2"
  | "scheduling";

export type Skill = { id: SkillId; name: string };

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "genai",
    title: "LLMs & Generative AI",
    blurb: "Reasoning layer",
    skills: [
      { id: "llms", name: "OpenAI LLMs" },
      { id: "langchain", name: "LangChain" },
      { id: "langgraph", name: "LangGraph" },
      { id: "prompt", name: "Prompt Engineering" },
      { id: "rag", name: "RAG" },
    ],
  },
  {
    id: "nlp",
    title: "NLP & Machine Learning",
    blurb: "Understanding layer",
    skills: [
      { id: "nlp", name: "NLP / Custom NER" },
      { id: "spacy", name: "spaCy" },
      { id: "huggingface", name: "Hugging Face" },
      { id: "ml", name: "Machine Learning" },
    ],
  },
  {
    id: "retrieval",
    title: "Embeddings & Vector Search",
    blurb: "Memory layer",
    skills: [
      { id: "chromadb", name: "ChromaDB" },
      { id: "faiss", name: "FAISS" },
      { id: "embeddings", name: "Embeddings" },
      { id: "dinov2", name: "DINOv2 Visual Embeddings" },
    ],
  },
  {
    id: "vision",
    title: "Computer Vision",
    blurb: "Perception layer",
    skills: [
      { id: "yolov8", name: "YOLOv8 / YOLO11" },
      { id: "roboflow", name: "Roboflow" },
      { id: "ocr", name: "EasyOCR" },
      { id: "cv", name: "Data Augmentation" },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    blurb: "Delivery layer",
    skills: [
      { id: "fastapi", name: "FastAPI" },
      { id: "flask", name: "Flask" },
      { id: "django", name: "Django" },
      { id: "apis", name: "REST API Orchestration" },
      { id: "scheduling", name: "Automation & Schedulers" },
      { id: "javascript", name: "JavaScript" },
    ],
  },
  {
    id: "foundations",
    title: "Data & Tooling",
    blurb: "Foundation layer",
    skills: [
      { id: "python", name: "Python" },
      { id: "sql", name: "SQL / MSSQL" },
      { id: "db2", name: "IBM DB2" },
      { id: "scraping", name: "Web Scraping" },
      { id: "multiprocessing", name: "Multiprocessing" },
      { id: "docker", name: "Docker" },
      { id: "git", name: "Git" },
    ],
  },
];

export type ProjectKind = "cv" | "llm" | "automation";

export const projectKinds: { id: ProjectKind | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "cv", label: "Computer Vision" },
  { id: "llm", label: "LLMs & NLP" },
  { id: "automation", label: "Automation & Data" },
];

export type Project = {
  slug: string;
  codename: string;
  title: string;
  tagline: string;
  category: string;
  kind: ProjectKind;
  /** Employer, when known. */
  org?: string;
  problem: string;
  solution: string;
  achievements: string[];
  /** Qualitative outcomes — the resume does not publish hard numbers. */
  impact: { label: string; value: string }[];
  stack: string[];
  skills: SkillId[];
  /** Two-stop gradient used for the generated cover art. */
  palette: [string, string];
  visual:
    | "extract"
    | "retrieve"
    | "vision"
    | "widget"
    | "graph"
    | "builder"
    | "similarity"
    | "counter"
    | "billing"
    | "mail"
    | "exim";
};

export const projects: Project[] = [
  {
    slug: "product-similarity",
    codename: "product_similarity",
    title: "Visual Product Similarity Search",
    tagline: "Send an image, get the 4 most similar products back — a search API other apps build on.",
    category: "Computer Vision · Visual Search",
    kind: "cv",
    org: "Skaps Industries",
    problem:
      "Finding visually similar products in a large, ever-growing image library by eye is slow — and several internal applications needed that capability as a service.",
    solution:
      "A three-model search pipeline: YOLO11n crops the product, DINOv2-Base turns it into a visual embedding, and EasyOCR reads on-product text. A query image returns the top-4 matches; a scheduler keeps the index fresh by embedding new images from the source automatically.",
    achievements: [
      "Indexed a large image library with YOLO11n cropping, DINOv2-Base visual embeddings and EasyOCR text reading.",
      "Search API returns the top 4 most similar images and is consumed by other applications.",
      "Scheduler automatically pulls new images from the source server and embeds them as configured.",
      "Fixed-token admin console to set source folders, configure the scheduler and inspect request and scheduler logs.",
    ],
    impact: [
      { label: "Results", value: "Top-4 similar images" },
      { label: "Index", value: "Self-updating via scheduler" },
      { label: "Consumers", value: "API for other apps" },
    ],
    stack: ["Python", "YOLO11n", "DINOv2-Base", "EasyOCR", "Scheduler", "Admin console"],
    skills: ["python", "yolov8", "dinov2", "ocr", "embeddings", "apis", "scheduling"],
    palette: ["#22d3ee", "#a78bfa"],
    visual: "similarity",
  },
  {
    slug: "ai-counter",
    codename: "AI_Counter",
    title: "AI Counter for Rolls, Pipes & Bags",
    tagline: "Computer vision that counts rolls, pipes and raw-material bags from a photo.",
    category: "Computer Vision · Manufacturing",
    kind: "cv",
    org: "Skaps Industries",
    problem:
      "Counting rolls, pipes and raw-material bags by hand is slow and error-prone for ground staff working across the site.",
    solution:
      "A custom dataset built from images the ground staff captured on site, annotated in Roboflow, and used to train a YOLOv8 detector. The model and its frontend are deployed together with FastAPI.",
    achievements: [
      "Built the training dataset from real on-site images captured by ground staff, labelled in Roboflow.",
      "Trained a YOLOv8 detection model to count rolls, pipes and raw-material bags.",
      "Deployed the model and the user-facing frontend with FastAPI.",
    ],
    impact: [
      { label: "Counts", value: "Rolls · pipes · bags" },
      { label: "Training data", value: "Real site images" },
      { label: "Deployment", value: "FastAPI app + model" },
    ],
    stack: ["YOLOv8", "Roboflow", "FastAPI", "Python"],
    skills: ["yolov8", "roboflow", "fastapi", "python", "ml"],
    palette: ["#a3e635", "#14b8a6"],
    visual: "counter",
  },
  {
    slug: "medical-extraction",
    codename: "lamAutomation",
    title: "Medical Information Extraction System",
    tagline:
      "Pulls structured clinical & pharmaceutical data out of unstructured medical research.",
    category: "NLP · Healthcare",
    kind: "llm",
    problem:
      "Clinical and pharmaceutical facts sit buried inside long, unstructured medical research documents. Extracting them by hand is slow, inconsistent and impossible to scale to large batches.",
    solution:
      "A platform-independent NLP executable that combines OpenAI LLMs, spaCy and a custom NER model to identify and structure the relevant entities — with Python multiprocessing fanning extraction out across cores.",
    achievements: [
      "Shipped as a platform-independent EXE, so non-technical teams can run it with no setup.",
      "Custom NER layered on spaCy alongside LLM extraction for domain-specific clinical entities.",
      "Parallel text extraction and processing via Python multiprocessing for large document batches.",
    ],
    impact: [
      { label: "Response time", value: "Significantly reduced" },
      { label: "Batch throughput", value: "Improved via parallelism" },
      { label: "Deployment", value: "Cross-platform EXE" },
    ],
    stack: ["Python", "OpenAI LLMs", "spaCy", "Custom NER", "Multiprocessing"],
    skills: ["python", "llms", "spacy", "nlp", "multiprocessing", "prompt"],
    palette: ["#7cf7ff", "#3b82f6"],
    visual: "extract",
  },
  {
    slug: "document-reader",
    codename: "DocumentReader",
    title: "LLM-Powered Document Q&A",
    tagline: "Ask questions of your documents and get grounded, context-aware answers.",
    category: "RAG · Search",
    kind: "llm",
    problem:
      "Teams needed accurate answers from large document sets, but feeding entire documents to an LLM is expensive and dilutes answer quality.",
    solution:
      "A retrieval-augmented Q&A system: documents are embedded into ChromaDB for semantic search, and only the most relevant chunks — ranked by relevance scoring — are passed to OpenAI LLMs.",
    achievements: [
      "Semantic search over vector embeddings instead of keyword matching.",
      "Relevance scoring keeps prompts lean, cutting token usage.",
      "Context-aware answers grounded in the retrieved passages.",
    ],
    impact: [
      { label: "Token usage", value: "Reduced" },
      { label: "Answer accuracy", value: "Enhanced" },
      { label: "Retrieval", value: "Semantic, vector-based" },
    ],
    stack: ["Python", "ChromaDB", "OpenAI", "Embeddings"],
    skills: ["python", "chromadb", "llms", "embeddings", "rag", "prompt"],
    palette: ["#a78bfa", "#6366f1"],
    visual: "retrieve",
  },
  {
    slug: "triage-bot",
    codename: "Triage-BOT",
    title: "Medical Triage Chatbot",
    tagline: "A LangGraph agent that assesses symptoms and prioritises patients.",
    category: "Conversational AI · Healthcare",
    kind: "llm",
    problem:
      "Symptom intake is a multi-step conversation: the system has to understand intent, ask the right follow-ups, and route to the right workflow — something single-shot prompts handle poorly.",
    solution:
      "A LangGraph state-machine agent on OpenAI GPT models that detects intent, fills required slots over multiple turns with dynamic prompts, and orchestrates APIs to assess and prioritise symptoms.",
    achievements: [
      "Graph-based dialogue flow built with LangGraph for reliable multi-step reasoning.",
      "Multi-turn slot filling with dynamic prompts adapting to each answer.",
      "API orchestration for symptom assessment and prioritisation.",
    ],
    impact: [
      { label: "Dialogue", value: "Multi-turn, stateful" },
      { label: "Routing", value: "Intent-driven workflows" },
      { label: "Integration", value: "API-orchestrated" },
    ],
    stack: ["LangGraph", "OpenAI GPT", "Python", "REST APIs"],
    skills: ["langgraph", "llms", "python", "apis", "prompt", "nlp"],
    palette: ["#ff7ad9", "#a855f7"],
    visual: "graph",
  },
  {
    slug: "nemo",
    codename: "NEMO",
    title: "Custom Chatbot Builder",
    tagline: "A modular framework for spinning up domain-specific conversational agents.",
    category: "Platform · Conversational AI",
    kind: "llm",
    problem:
      "Every new domain chatbot was being built from scratch — re-implementing intent detection, slot extraction and integrations each time.",
    solution:
      "A modular builder of reusable components — intent detection, slot extraction and customizable pipelines — with multi-API integration, backed by LangChain and ChromaDB.",
    achievements: [
      "Reusable components for intent detection and slot extraction.",
      "Customizable pipelines so each agent fits its domain.",
      "Multi-API integration out of the box.",
    ],
    impact: [
      { label: "Architecture", value: "Modular & reusable" },
      { label: "Agents", value: "Domain-specific" },
      { label: "Integrations", value: "Multi-API" },
    ],
    stack: ["Python", "LangChain", "ChromaDB", "LLMs", "APIs"],
    skills: ["python", "langchain", "chromadb", "llms", "apis", "rag"],
    palette: ["#34d399", "#06b6d4"],
    visual: "builder",
  },
  {
    slug: "billing-middleware",
    codename: "billing_middleware",
    title: "E-Invoice & E-Way Bill Middleware",
    tagline: "Validated billing data from DB2 to the IRIS API — with every change audited.",
    category: "Integration · Finance",
    kind: "automation",
    org: "Skaps Industries",
    problem:
      "Generating e-invoices and e-way bills meant moving billing data out of DB2 into the IRIS API — data that needed validation and conversion first, and accountability for any value a user changed.",
    solution:
      "A middleware layer that fetches billing data from DB2 stored procedures, presents it to users behind extensive validations and conversions, submits it to the IRIS API to generate e-invoices and e-way bills, and records a full audit trail in MSSQL.",
    achievements: [
      "Fetches billing data from DB2 procedures and presents it to users for review.",
      "Extensive validation and data conversion before anything reaches the IRIS API.",
      "Generates e-invoices and e-way bills through the IRIS API integration.",
      "Audits every request and every value changed by a user in MSSQL.",
    ],
    impact: [
      { label: "Output", value: "E-invoice + e-way bill" },
      { label: "Data quality", value: "Validated before submit" },
      { label: "Governance", value: "Full audit trail" },
    ],
    stack: ["IBM DB2", "IRIS API", "MSSQL", "Validation layer", "Audit logging"],
    skills: ["db2", "sql", "apis"],
    palette: ["#fbbf24", "#fb7185"],
    visual: "billing",
  },
  {
    slug: "email-automate",
    codename: "emailautomate",
    title: "Customs Document Mail Automation",
    tagline: "Watches a mailbox, files customs documents by invoice number and mails them to the right client.",
    category: "Automation · Operations",
    kind: "automation",
    org: "Skaps Industries",
    problem:
      "Customs files arriving by email had to be matched to invoices, filed into the right folders and forwarded to the right clients — a repetitive routine done by hand.",
    solution:
      "An automation that checks an account's mailbox, collects the customs files, searches the designated folder for paths matching the invoice-number pattern, files each document into its folder, identifies the client from the file and emails it to them from a client-email mapping list.",
    achievements: [
      "Monitors a mailbox and collects incoming customs files automatically.",
      "Matches invoice-number patterns to locate the right folder and file each document.",
      "Identifies the client from the file and emails it using a client-to-email mapping list.",
    ],
    impact: [
      { label: "Routing", value: "Invoice-number matching" },
      { label: "Delivery", value: "Auto-mailed to clients" },
      { label: "Filing", value: "Hands-off" },
    ],
    stack: ["Mailbox automation", "Pattern matching", "File routing", "Client mapping"],
    skills: ["scheduling"],
    palette: ["#38bdf8", "#818cf8"],
    visual: "mail",
  },
  {
    slug: "exim-automation",
    codename: "EximAutomation",
    title: "EXIM Trade Data & Reporting Platform",
    tagline: "Scrapes ICEGATE, parses customs PDFs and turns it all into 14 client reports.",
    category: "Web App · Trade Data",
    kind: "automation",
    org: "Sarjen Systems",
    problem:
      "Export–import data was scattered across the ICEGATE portal and customs PDFs, and the client needed it consolidated and reportable in many different ways.",
    solution:
      "A Django web application with full CRUD that scrapes data from the ICEGATE site, extracts data from customs PDFs, stores everything in MSSQL and serves 14 reports built to the client's requirements — each with suitable filters, search and Excel export.",
    achievements: [
      "Automated data collection by scraping the ICEGATE site.",
      "Extracted data from customs PDFs and loaded it into MSSQL.",
      "Built 14 reports to client requirements, each with suitable filters.",
      "Full CRUD, search and download / export to Excel throughout.",
    ],
    impact: [
      { label: "Reports", value: "14 custom reports" },
      { label: "Sources", value: "ICEGATE + customs PDFs" },
      { label: "Export", value: "Excel download" },
    ],
    stack: ["Python", "Django", "MSSQL", "Web scraping", "PDF extraction"],
    skills: ["python", "django", "sql", "scraping"],
    palette: ["#f472b6", "#fb923c"],
    visual: "exim",
  },
  {
    slug: "sarjen-bot",
    codename: "Sarjen BOT",
    title: "Plug-and-Play Chatbot Widget",
    tagline: "A configurable chatbot that drops into existing systems with zero code changes.",
    category: "Product · Integration",
    kind: "llm",
    problem:
      "Adding an assistant to existing enterprise systems usually means invasive code changes — and exposing data without access control.",
    solution:
      "A configurable JavaScript widget with dynamic API orchestration and document-based Q&A, protected by custom middleware that enforces role-based access control on every query.",
    achievements: [
      "Plug-and-play deployment — integrates without modifying host systems.",
      "Document-based Q&A and dynamic API orchestration.",
      "Custom middleware for role-based access control and secure query handling.",
    ],
    impact: [
      { label: "Integration cost", value: "No code changes" },
      { label: "Security", value: "Role-based access" },
      { label: "Capabilities", value: "Docs Q&A + APIs" },
    ],
    stack: ["JavaScript", "REST APIs", "NLP", "RBAC Middleware"],
    skills: ["javascript", "apis", "nlp", "rag"],
    palette: ["#fbbf24", "#f97316"],
    visual: "widget",
  },
  {
    slug: "smart-farming",
    codename: "SmartFarming",
    title: "Leaf Disease & Deficiency Detection",
    tagline: "Real-time computer vision that spots disease in cucumber leaves.",
    category: "Computer Vision · AgriTech",
    kind: "cv",
    problem:
      "Leaf diseases and nutrient deficiencies need to be caught early, but manual inspection doesn't scale for smart-agriculture platforms.",
    solution:
      "A YOLOv8 model trained with Roboflow and served through a Flask API for real-time detection, improved with data augmentation and fine-tuning, and packaged as an EXE.",
    achievements: [
      "Real-time disease detection on cucumber leaves via a Flask API.",
      "Data augmentation and fine-tuning to improve model robustness.",
      "Deployed as an EXE for smart-agriculture platforms.",
    ],
    impact: [
      { label: "Inference", value: "Real-time" },
      { label: "Model", value: "Fine-tuned YOLOv8" },
      { label: "Deployment", value: "Standalone EXE" },
    ],
    stack: ["YOLOv8", "Roboflow", "Flask", "Computer Vision"],
    skills: ["yolov8", "roboflow", "flask", "cv", "python", "ml"],
    palette: ["#a3e635", "#22c55e"],
    visual: "vision",
  },
];

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  summary: string;
  highlights: string[];
  focus: string[];
};

export const experience: Role[] = [
  {
    company: "Skaps Industries India Pvt. Ltd.",
    title: "ML Engineer",
    start: "2026",
    end: "Present",
    summary:
      "Building computer vision, visual search and enterprise automation that works on the factory floor and in the back office.",
    highlights: [
      "Built AI_Counter: a YOLOv8 model trained on Roboflow-labelled site images that counts rolls, pipes and raw-material bags, deployed with FastAPI.",
      "Built a visual product-similarity search API (YOLO11n, DINOv2-Base, EasyOCR) returning the top-4 matches, with an auto-ingest scheduler and a token-protected admin console.",
      "Built billing middleware from DB2 to the IRIS API for e-invoices and e-way bills, with validations and a full MSSQL audit trail.",
      "Automated customs-document handling: mailbox monitoring, invoice-number filing and client mail-outs.",
    ],
    focus: ["YOLOv8 / YOLO11", "DINOv2", "EasyOCR", "FastAPI", "DB2 · MSSQL", "Automation"],
  },
  {
    company: "Impero IT",
    title: "Software Developer (AI/ML)",
    start: "Jan 2026",
    end: "Apr 2026",
    summary:
      "Built LLM-based conversational AI for domain-specific clients — systems that understand what users want and act on it.",
    highlights: [
      "Designed and developed LLM-based conversational AI systems for intent detection, workflow automation and multi-turn dialogue management.",
      "Built scalable chatbot architectures with dynamic prompting, slot filling and seamless REST API integrations for domain-specific solutions.",
    ],
    focus: ["LLMs", "Intent detection", "Slot filling", "REST APIs"],
  },
  {
    company: "Sarjen Systems Pvt. Ltd.",
    title: "Python Developer (AI Systems)",
    start: "Jan 2023",
    end: "Jan 2026",
    summary:
      "Three years engineering AI systems for document-heavy workflows — information extraction, data pipelines and the SQL underneath them.",
    highlights: [
      "Engineered AI-powered systems for document processing, NLP-based information extraction and automated data pipelines.",
      "Developed ETL workflows and optimised SQL queries to improve data-processing efficiency and system performance.",
      "Built EximAutomation, a Django + MSSQL platform that scrapes ICEGATE and customs PDFs into 14 client reports with filters, search and Excel export.",
    ],
    focus: ["NLP", "Document processing", "ETL", "Django", "MSSQL"],
  },
];

export const education = {
  institution: "Adani Institute of Infrastructure Engineering",
  degree: "Bachelor of Engineering (B.E.)",
  field: "Information and Communication Technology",
  start: "Aug 2019",
  end: "Mar 2023",
  grade: "8.0 / 10 CGPA",
  milestones: [
    { year: "2019", label: "Began B.E. in Information & Communication Technology" },
    { year: "2023", label: "Joined Sarjen Systems as Python Developer (AI Systems)" },
    { year: "2023", label: "Graduated with 8.0 / 10 CGPA" },
  ],
};

export type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  detail: string;
};

/** Every number below is derivable from the resume. */
export const stats: Stat[] = [
  { value: 3, suffix: "+", label: "Years building AI", detail: "Production ML & NLP since Jan 2023" },
  { value: projects.length, label: "Production systems shipped", detail: "AI, vision, automation & data" },
  { value: 4, label: "LLM-powered products", detail: "OpenAI, LangChain & LangGraph" },
  { value: 8, decimals: 1, suffix: "/10", label: "B.E. CGPA", detail: "Information & Communication Tech" },
];

export const highlights = [
  {
    title: "Healthcare-grade NLP",
    body: "Two medical AI systems — clinical data extraction and symptom triage — where accuracy and structure matter most.",
  },
  {
    title: "Shipped beyond the browser",
    body: "Packaged ML into platform-independent executables so real teams could run models without any setup.",
  },
  {
    title: "Full-spectrum AI",
    body: "Language, retrieval, agents and vision: from LLM prompt design to YOLO detectors and DINOv2 visual search.",
  },
  {
    title: "AI wired into the business",
    body: "DB2, MSSQL, IRIS e-invoicing, ICEGATE scraping and mailbox automation — systems that plug into real operations.",
  },
];

/** Add entries here to render a certifications row in the Achievements section. */
export const certifications: { name: string; issuer: string; year: string; url?: string }[] = [];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Work" },
  { href: "#lab", label: "AI Lab" },
  { href: "#contact", label: "Contact" },
] as const;

/** How many shipped projects use a given skill — powers the proficiency rings. */
export function projectUsage(id: SkillId) {
  return projects.filter((p) => p.skills.includes(id));
}
