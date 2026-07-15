"use client";

import { useMemo, useState } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { WritingQuestion } from "@/types/question";
import {
  completeStudentAssignment,
  markStudentSubmitting,
} from "@/lib/mocks/assignmentStore";
import { generateMockAiAnalysis } from "@/lib/mocks/studentMockData";
import { toast } from "@/lib/toast";
import styles from "./WritingExercise.module.css";

type WritingExerciseProps = {
  level: string;
  assignmentId?: string;
  onBack: () => void;
  onSubmitted?: () => void;
};

export default function WritingExercise({
  level,
  assignmentId,
  onBack,
  onSubmitted,
}: WritingExerciseProps) {
  const questions = useMemo(() => {
    return (questionsData.writing as WritingQuestion[]).filter(
      (q) => q.level === level
    );
  }, [level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = questions[currentIndex];
  const minWords = question?.minWords ?? 200;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const meetsMinimum = wordCount >= minWords;
  const isLastQuestion = currentIndex >= questions.length - 1;

  const handleSubmit = async () => {
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      setText("");
      return;
    }

    if (!assignmentId) {
      onBack();
      return;
    }

    setIsSubmitting(true);
    markStudentSubmitting(assignmentId, { content: text });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const analysis = generateMockAiAnalysis("WRITING", level);
    completeStudentAssignment(assignmentId, analysis);
    toast.success(
      "Ödeviniz başarıyla gönderildi ve AI tarafından puanlandı!"
    );
    setIsSubmitting(false);
    onSubmitted?.();
    onBack();
  };

  if (questions.length === 0) {
    return (
      <div className={styles.writing}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Geri Dön
        </button>
        <div className={`glass-card ${styles.promptCard}`}>
          <p>Bu seviyede writing sorusu bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.writing} animate-fade-in-up`}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={onBack}
        disabled={isSubmitting}
      >
        ← Ödevlerime Dön
      </button>

      <div className={`glass-card ${styles.promptCard}`}>
        <div className={styles.promptLabel}>
          Writing — Soru {currentIndex + 1}/{questions.length}
        </div>
        <h3 className={styles.promptText}>{question.question}</h3>
        <p className={styles.promptMeta}>
          📝 Minimum {minWords} kelime | Seviye: {question.level} | Konu:{" "}
          {question.topic}
        </p>
      </div>

      <div className={`glass-card ${styles.editorSection}`}>
        {isSubmitting ? (
          <div className={styles.processingState}>
            <div className={styles.spinner} aria-hidden />
            <h3 className={styles.processingTitle}>AI Değerlendiriyor…</h3>
            <p className={styles.processingText}>
              Yazınız dilbilgisi, kelime bilgisi ve tutarlılık açısından
              analiz ediliyor.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.editorHeader}>
              <span className={styles.editorTitle}>Cevabınızı yazın</span>
              <div className={styles.wordCounter}>
                <span
                  className={`${styles.wordCountValue} ${
                    meetsMinimum ? styles.wordCountMet : styles.wordCountNotMet
                  }`}
                >
                  {wordCount}
                </span>
                <span className={styles.wordCountTarget}>
                  / {minWords} kelime
                </span>
              </div>
            </div>

            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your essay here..."
            />

            <button
              type="button"
              className={styles.submitBtn}
              disabled={wordCount < 20}
              onClick={handleSubmit}
            >
              {isLastQuestion
                ? "Ödevi Gönder"
                : "Sonraki Soru →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
