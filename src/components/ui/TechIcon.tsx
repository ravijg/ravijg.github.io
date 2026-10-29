import type { IconType } from "react-icons";
import {
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiHuggingface,
  SiJavascript,
  SiLangchain,
  SiPython,
  SiRoboflow,
  SiSpacy,
  SiMeta,
  SiUltralytics,
} from "react-icons/si";
import {
  TbApi,
  TbBinaryTree,
  TbBrain,
  TbBrandOpenai,
  TbCalendarTime,
  TbCpu,
  TbDatabase,
  TbFileSearch,
  TbHierarchy3,
  TbPhotoScan,
  TbPrompt,
  TbServer,
  TbSpider,
  TbSql,
  TbTextRecognition,
  TbTopologyStar3,
  TbVectorTriangle,
} from "react-icons/tb";
import type { SkillId } from "@/data/resume";

const icons: Record<SkillId, { icon: IconType; color: string }> = {
  python: { icon: SiPython, color: "#ffd43b" },
  sql: { icon: TbSql, color: "#7dd3fc" },
  javascript: { icon: SiJavascript, color: "#f7df1e" },
  llms: { icon: TbBrandOpenai, color: "#ffffff" },
  langchain: { icon: SiLangchain, color: "#4ade80" },
  langgraph: { icon: TbHierarchy3, color: "#a78bfa" },
  prompt: { icon: TbPrompt, color: "#f0abfc" },
  rag: { icon: TbFileSearch, color: "#7cf7ff" },
  nlp: { icon: TbBrain, color: "#ff7ad9" },
  spacy: { icon: SiSpacy, color: "#38bdf8" },
  huggingface: { icon: SiHuggingface, color: "#ffd21e" },
  ml: { icon: TbBinaryTree, color: "#c4b5fd" },
  faiss: { icon: TbTopologyStar3, color: "#60a5fa" },
  chromadb: { icon: TbDatabase, color: "#fb923c" },
  embeddings: { icon: TbVectorTriangle, color: "#8b7bff" },
  yolov8: { icon: SiUltralytics, color: "#38bdf8" },
  roboflow: { icon: SiRoboflow, color: "#a855f7" },
  cv: { icon: TbPhotoScan, color: "#a3e635" },
  fastapi: { icon: SiFastapi, color: "#14b8a6" },
  flask: { icon: SiFlask, color: "#e5e7eb" },
  django: { icon: SiDjango, color: "#44b78b" },
  apis: { icon: TbApi, color: "#7cf7ff" },
  docker: { icon: SiDocker, color: "#2496ed" },
  git: { icon: SiGit, color: "#f05032" },
  multiprocessing: { icon: TbCpu, color: "#fbbf24" },
  db2: { icon: TbServer, color: "#5b9bff" },
  scraping: { icon: TbSpider, color: "#f472b6" },
  ocr: { icon: TbTextRecognition, color: "#fcd34d" },
  dinov2: { icon: SiMeta, color: "#4f9dff" },
  scheduling: { icon: TbCalendarTime, color: "#34d399" },
};

export function TechIcon({ id, className }: { id: SkillId; className?: string }) {
  const { icon: Icon, color } = icons[id];
  return <Icon aria-hidden className={className} style={{ color }} />;
}

export const techColor = (id: SkillId) => icons[id].color;
