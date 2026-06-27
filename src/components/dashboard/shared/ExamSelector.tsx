"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import styles from "./ExamSelector.module.css";

export default function ExamSelector() {
  const { selectedExam, setSelectedExam, userRole } = useDashboard();

  const ariaLabel =
    userRole === "TEACHER"
      ? "Sınıfların hazırlandığı sınav formatı filtresi"
      : "Sınav seçimi";

  return (
    <div className={styles.selector} role="group" aria-label={ariaLabel} id="exam-selector">
      {MOCK_EXAM_OPTIONS.map((exam) => {
        const isActive = selectedExam === exam.id;

        return (
          <button
            key={exam.id}
            type="button"
            className={`${styles.examBtn} ${isActive ? styles.active : ""}`}
            onClick={() => setSelectedExam(exam.id)}
            style={
              isActive
                ? ({ "--exam-color": exam.color } as React.CSSProperties)
                : undefined
            }
            aria-pressed={isActive}
            id={`exam-btn-${exam.id.toLowerCase()}`}
          >
            {exam.name}
          </button>
        );
      })}
    </div>
  );
}
