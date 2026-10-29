import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 80% 20%, #2a2266 0%, #05060a 55%)",
          color: "#eef0f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#7cf7ff,#8b7bff,#ff7ad9)",
              color: "#05060a",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 28, color: "#a1a8b8" }}>{`${profile.role} · ${profile.location}`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{profile.name}</div>
          <div
            style={{
              marginTop: 24,
              fontSize: 44,
              backgroundImage: "linear-gradient(90deg,#7cf7ff,#8b7bff,#ff7ad9)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Unstructured language → structured intelligence
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#a1a8b8" }}>
          {["LLMs", "RAG", "LangGraph", "NLP", "Vector DBs", "Computer Vision"].map((t) => (
            <div key={t} style={{ padding: "8px 18px", border: "1px solid #2a2f3d", borderRadius: 999 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
