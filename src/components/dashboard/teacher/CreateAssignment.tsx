"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { MOCK_TEACHER_CLASSES } from "@/lib/mocks/teacherData";
import questionsData from "@/lib/mocks/questions.json";
import type {
  QuestionLevel,
  SpeakingQuestion,
  WritingQuestion,
  MultipleChoiceQuestion,
} from "@/types/question";
import styles from "./CreateAssignment.module.css";

type AssignmentTypeOption = "MULTIPLE_CHOICE" | "SPEAKING" | "WRITING";

const LEVELS: QuestionLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const TYPE_LABELS: Record<AssignmentTypeOption, string> = {
  MULTIPLE_CHOICE: "Çoktan Seçmeli",
  SPEAKING: "Speaking (Konuşma)",
  WRITING: "Writing (Yazma)",
};

type AnyQuestion = SpeakingQuestion | WritingQuestion | MultipleChoiceQuestion;

export default function CreateAssignment() {
  const { selectedExam } = useDashboard();
  const [selectedClass, setSelectedClass] = useState("");
  const [assignmentType, setAssignmentType] =
    useState<AssignmentTypeOption>("MULTIPLE_CHOICE");
  const [selectedLevel, setSelectedLevel] = useState<QuestionLevel>("B1");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(
    new Set()
  );
  const [dueDate, setDueDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const classes = MOCK_TEACHER_CLASSES.filter(
    (cls) => cls.examType === selectedExam
  );

  const filteredQuestions: AnyQuestion[] = useMemo(() => {
    let pool: AnyQuestion[] = [];

    if (assignmentType === "MULTIPLE_CHOICE") {
      pool = questionsData.multiple_choice as MultipleChoiceQuestion[];
    } else if (assignmentType === "SPEAKING") {
      pool = questionsData.speaking as SpeakingQuestion[];
    } else {
      pool = questionsData.writing as WritingQuestion[];
    }

    return pool.filter((q) => q.level === selectedLevel);
  }, [assignmentType, selectedLevel]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedQuestionIds.size === filteredQuestions.length) {
      setSelectedQuestionIds(new Set());
    } else {
      setSelectedQuestionIds(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  const handleCreate = () => {
    if (selectedQuestionIds.size === 0 || !selectedClass) return;
    setShowSuccess(true);
    setSelectedQuestionIds(new Set());
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isMultipleChoice = assignmentType === "MULTIPLE_CHOICE";

  return (
    <div
      className={`${styles.createAssignment} animate-fade-in-up`}
      id="create-assignment"
    >
      <div className={styles.header}>
        <span className="section-label">📝 Ödev Oluştur</span>
        <h2 className="section-title">
          Sınıfa <span className="text-gradient">Ödev Ata</span>
        </h2>
        <p className="section-subtitle">
          Soru havuzundan seviyeye göre soruları filtrele, seç ve sınıfına ata.
        </p>
      </div>

      {/* --- Form Filters --- */}
      <div className={`glass-card ${styles.formSection}`} style={{ padding: "var(--space-6)" }}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="class-select">Sınıf</label>
            <select
              id="class-select"
              className={styles.selectField}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Sınıf seçin...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.studentCount} Öğrenci)
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type-select">Ödev Tipi</label>
            <select
              id="type-select"
              className={styles.selectField}
              value={assignmentType}
              onChange={(e) => {
                setAssignmentType(e.target.value as AssignmentTypeOption);
                setSelectedQuestionIds(new Set());
              }}
            >
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="due-date">Son Tarih</label>
            <input
              id="due-date"
              type="date"
              className={`input-field`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Level Pills */}
        <div className={styles.formGroup}>
          <label>Seviye</label>
          <div className={styles.levelPills}>
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`${styles.levelPill} ${
                  selectedLevel === level ? styles.levelPillActive : ""
                }`}
                onClick={() => {
                  setSelectedLevel(level);
                  setSelectedQuestionIds(new Set());
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Stats --- */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span>📋</span>
          <span>
            Toplam:{" "}
            <span className={styles.statValue}>
              {filteredQuestions.length}
            </span>{" "}
            soru
          </span>
        </div>
        <div className={styles.statItem}>
          <span>✅</span>
          <span>
            Seçilen:{" "}
            <span className={`${styles.statValue} ${styles.statAccent}`}>
              {selectedQuestionIds.size}
            </span>
          </span>
        </div>
        <div className={styles.statItem}>
          <span>🎯</span>
          <span>
            Tip: <span className={styles.statValue}>{TYPE_LABELS[assignmentType]}</span>
          </span>
        </div>
      </div>

      {/* --- Success Message --- */}
      {showSuccess && (
        <div className={styles.successToast}>
          <span>✅</span>
          Ödev başarıyla oluşturuldu ve sınıfa atandı!
        </div>
      )}

      {/* --- Question Grid --- */}
      {filteredQuestions.length === 0 ? (
        <div className={`glass-card ${styles.emptyState}`}>
          <span className={styles.emptyIcon}>📭</span>
          <h3 className={styles.emptyTitle}>Soru Bulunamadı</h3>
          <p className={styles.emptyDesc}>
            {selectedLevel} seviyesinde {TYPE_LABELS[assignmentType]} sorusu
            bulunmuyor. Farklı bir seviye veya tip seçin.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.questionGrid}>
            {filteredQuestions.map((q) => {
              const isSelected = selectedQuestionIds.has(q.id);
              return (
                <article
                  key={q.id}
                  className={`glass-card ${styles.questionCard} ${
                    isSelected ? styles.questionCardSelected : ""
                  }`}
                  onClick={() => toggleQuestion(q.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleQuestion(q.id);
                    }
                  }}
                >
                  <div className={styles.questionMeta}>
                    <span className={`${styles.badge} ${styles.levelBadge}`}>
                      {q.level}
                    </span>
                    <span className={`${styles.badge} ${styles.topicBadge}`}>
                      {q.topic}
                    </span>
                    {isMultipleChoice && (
                      <span className={`${styles.badge} ${styles.typeBadge}`}>
                        MC
                      </span>
                    )}
                  </div>
                  <p className={styles.questionText}>{q.question}</p>

                  {isMultipleChoice &&
                    "options" in q &&
                    (q as MultipleChoiceQuestion).options && (
                      <div className={styles.questionOptions}>
                        {(q as MultipleChoiceQuestion).options.map(
                          (opt, i) => (
                            <span key={i} className={styles.questionOption}>
                              {String.fromCharCode(65 + i)}) {opt}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  <div
                    className={`${styles.checkIndicator} ${
                      isSelected ? styles.checkIndicatorActive : ""
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      style={{ opacity: isSelected ? 1 : 0 }}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                </article>
              );
            })}
          </div>

          {/* --- Action Bar --- */}
          <div className={styles.actionBar}>
            <div className={styles.actionInfo}>
              <span className={styles.selectedCount}>
                {selectedQuestionIds.size}
              </span>{" "}
              soru seçildi
              {selectedClass && (
                <>
                  {" — "}
                  <strong>
                    {classes.find((c) => c.id === selectedClass)?.name}
                  </strong>
                </>
              )}
            </div>
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.selectAllBtn}
                onClick={selectAll}
              >
                {selectedQuestionIds.size === filteredQuestions.length
                  ? "Seçimi Temizle"
                  : "Tümünü Seç"}
              </button>
              <button
                type="button"
                className={styles.createBtn}
                disabled={selectedQuestionIds.size === 0 || !selectedClass}
                onClick={handleCreate}
              >
                Ödev Oluştur ({selectedQuestionIds.size} Soru)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
