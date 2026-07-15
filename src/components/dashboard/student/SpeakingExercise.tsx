"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { SpeakingQuestion } from "@/types/question";
import {
  completeStudentAssignment,
  markStudentSubmitting,
} from "@/lib/mocks/assignmentStore";
import { generateMockAiAnalysis } from "@/lib/mocks/studentMockData";
import { toast } from "@/lib/toast";
import styles from "./SpeakingExercise.module.css";

type SpeakingExerciseProps = {
  level: string;
  assignmentId?: string;
  onBack: () => void;
  onSubmitted?: () => void;
};

type RecordingState = "idle" | "recording" | "done";

export default function SpeakingExercise({
  level,
  assignmentId,
  onBack,
  onSubmitted,
}: SpeakingExerciseProps) {
  const questions = useMemo(() => {
    return (questionsData.speaking as SpeakingQuestion[]).filter(
      (q) => q.level === level
    );
  }, [level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = questions[currentIndex];
  const duration = question?.recommendedDuration ?? 60;
  const isLastQuestion = currentIndex >= questions.length - 1;

  useEffect(() => {
    if (recordingState !== "recording") return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRecordingState("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingState]);

  const startRecording = useCallback(() => {
    setRecordingState("recording");
    setTimeLeft(duration);
  }, [duration]);

  const stopRecording = useCallback(() => {
    setRecordingState("done");
  }, []);

  const submitForAnalysis = async () => {
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      setRecordingState("idle");
      return;
    }

    if (!assignmentId) {
      onBack();
      return;
    }

    setIsSubmitting(true);
    markStudentSubmitting(assignmentId, {
      audioLabel: `speaking-${assignmentId}.webm`,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const analysis = generateMockAiAnalysis("SPEAKING", level);
    completeStudentAssignment(assignmentId, analysis);
    toast.success(
      "Ödeviniz başarıyla gönderildi ve AI tarafından puanlandı!"
    );
    setIsSubmitting(false);
    onSubmitted?.();
    onBack();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return (
      <div className={styles.speaking}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Geri Dön
        </button>
        <div className={`glass-card ${styles.promptCard}`}>
          <p>Bu seviyede speaking sorusu bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.speaking} animate-fade-in-up`}>
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
          Speaking — Soru {currentIndex + 1}/{questions.length}
        </div>
        <h3 className={styles.promptText}>{question.question}</h3>
        <p className={styles.durationHint}>
          ⏱ Önerilen süre: {duration} saniye | Seviye: {question.level} |
          Konu: {question.topic}
        </p>
      </div>

      <div className={`glass-card ${styles.recorderSection}`}>
        {isSubmitting ? (
          <div className={styles.processingState}>
            <div className={styles.spinner} aria-hidden />
            <h3 className={styles.processingTitle}>AI Değerlendiriyor…</h3>
            <p className={styles.processingText}>
              Ses kaydınız telaffuz, akıcılık ve dilbilgisi açısından analiz
              ediliyor.
            </p>
          </div>
        ) : (
          <>
            {recordingState === "recording" && (
              <div
                className={`${styles.timer} ${
                  timeLeft <= 10
                    ? styles.timerDanger
                    : timeLeft <= 20
                      ? styles.timerWarning
                      : ""
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            )}

            {recordingState === "recording" && (
              <div className={styles.waveContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.waveBar} />
                ))}
              </div>
            )}

            <button
              type="button"
              className={`${styles.micButton} ${
                recordingState === "recording" ? styles.micButtonRecording : ""
              }`}
              onClick={
                recordingState === "idle"
                  ? startRecording
                  : recordingState === "recording"
                    ? stopRecording
                    : startRecording
              }
            >
              <svg
                className={styles.micIcon}
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {recordingState === "recording" ? (
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                ) : (
                  <>
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </>
                )}
              </svg>
            </button>

            <p
              className={`${styles.recorderStatus} ${
                recordingState === "recording"
                  ? styles.recorderStatusRecording
                  : ""
              }`}
            >
              {recordingState === "idle" &&
                "Mikrofona tıklayarak kayda başlayın"}
              {recordingState === "recording" && "Kayıt devam ediyor..."}
              {recordingState === "done" && "Kayıt tamamlandı!"}
            </p>

            {recordingState === "done" && (
              <button
                type="button"
                className={styles.submitBtn}
                onClick={submitForAnalysis}
              >
                {isLastQuestion ? "Ödevi Gönder" : "Sonraki Soru →"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
