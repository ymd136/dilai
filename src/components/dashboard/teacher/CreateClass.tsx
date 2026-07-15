"use client";

import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { addTeacherClass } from "@/lib/mocks/assignmentStore";
import type { ExamType } from "@/types/exam";
import { toast } from "@/lib/toast";
import styles from "./CreateClass.module.css";

const EXAM_OPTIONS: { id: ExamType; label: string }[] = [
  { id: "TOEFL", label: "TOEFL" },
  { id: "YDS", label: "YDS" },
  { id: "YOKDIL", label: "YÖKDİL" },
];

export default function CreateClass() {
  const { selectClass, examColor } = useDashboard();
  const [name, setName] = useState("");
  const [examType, setExamType] = useState<ExamType>("TOEFL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    const created = addTeacherClass({
      name: name.trim(),
      examType,
    });
    toast.success(`“${created.name}” sınıfı oluşturuldu.`);
    setIsSubmitting(false);
    setName("");
    selectClass(created.id);
  };

  return (
    <div
      className={`${styles.createClass} animate-fade-in-up`}
      id="create-class"
    >
      <div className={styles.header}>
        <span className="section-label">🏫 Yeni Sınıf</span>
        <h2 className="section-title">
          Sınıf <span className="text-gradient">Oluştur</span>
        </h2>
        <p className="section-subtitle">
          Yeni bir sınıf tanımlayın, sınav formatını seçin ve öğrenci eklemeye
          başlayın.
        </p>
      </div>

      <div
        className={`glass-card ${styles.formCard}`}
        style={{ "--exam-color": examColor } as React.CSSProperties}
      >
        <div className={styles.formGroup}>
          <label htmlFor="class-name">Sınıf Adı</label>
          <input
            id="class-name"
            className="input-field"
            placeholder="Örn: YDS İlkbahar Grubu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Sınav Formatı</label>
          <div className={styles.examPills}>
            {EXAM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.examPill} ${
                  examType === opt.id ? styles.examPillActive : ""
                }`}
                onClick={() => setExamType(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`btn btn-primary ${styles.submitBtn}`}
          disabled={!name.trim() || isSubmitting}
          onClick={handleCreate}
        >
          {isSubmitting ? "Oluşturuluyor…" : "Sınıfı Oluştur"}
        </button>
      </div>
    </div>
  );
}
