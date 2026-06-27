"use client";

import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  getAiWorkroomOutput,
  type AiWorkroomTool,
} from "@/lib/mocks/teacherData";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import styles from "./TeacherAiWorkroom.module.css";

const tools: { id: AiWorkroomTool; label: string; icon: string }[] = [
  { id: "reading", label: "Okuma Metni Oluştur", icon: "📄" },
  { id: "questions", label: "Soru Bankası Üret", icon: "❓" },
  { id: "vocabulary", label: "Kelime Listesi Çıkar", icon: "📚" },
];

export default function TeacherAiWorkroom() {
  const { selectedExam, examColor } = useDashboard();
  const [activeTool, setActiveTool] = useState<AiWorkroomTool>("reading");
  const [isGenerating, setIsGenerating] = useState(false);

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  const output = getAiWorkroomOutput(selectedExam, activeTool);

  const handleToolSelect = (tool: AiWorkroomTool) => {
    setIsGenerating(true);
    setActiveTool(tool);
    setTimeout(() => setIsGenerating(false), 400);
  };

  return (
    <div className={`${styles.workroom} animate-fade-in-up`} id="teacher-ai-workroom">
      <div className={styles.header}>
        <span className="section-label">🤖 AI Ödev Hazırlama Odası</span>
        <h2 className="section-title">
          <span className="text-gradient">{examLabel}</span> İçerik Üretici
        </h2>
        <p className="section-subtitle">
          Yapay zeka asistanınla okuma metni, soru bankası ve kelime listesi
          oluştur. Ürettiğin içeriği doğrudan sınıfına atayabilirsin.
        </p>
      </div>

      <div className={styles.toolBar} role="group" aria-label="AI içerik araçları">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`${styles.toolBtn} ${activeTool === tool.id ? styles.active : ""}`}
            onClick={() => handleToolSelect(tool.id)}
            style={
              activeTool === tool.id
                ? ({ "--exam-color": examColor } as React.CSSProperties)
                : undefined
            }
            aria-pressed={activeTool === tool.id}
          >
            <span aria-hidden="true">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div
        className={`glass-card ${styles.outputArea}`}
        style={{ "--exam-color": examColor } as React.CSSProperties}
      >
        <div className={styles.outputHeader}>
          <span className={styles.outputLabel}>
            AI Çıktı — {output.label}
          </span>
          <span className={styles.aiBadge}>
            <span className={styles.aiDot} aria-hidden="true" />
            DilAI Model v0.1
          </span>
        </div>

        <div className={styles.outputContent} aria-live="polite">
          {isGenerating ? "İçerik üretiliyor..." : output.content}
        </div>

        <div className={styles.outputActions}>
          <button type="button" className="btn btn-primary">
            Sınıfa Ata
          </button>
          <button type="button" className="btn btn-secondary">
            Düzenle
          </button>
          <button type="button" className="btn btn-secondary btn-sm">
            Yeniden Üret
          </button>
        </div>
      </div>
    </div>
  );
}
