"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { SpeakingQuestion } from "@/types/question";
import styles from "./SpeakingExercise.module.css";

type SpeakingExerciseProps = {
  level: string;
  onBack: () => void;
};

type RecordingState = "idle" | "recording" | "done";

const MOCK_AI_SCORES = {
  fluency: 72,
  vocabulary: 68,
  grammar: 75,
  pronunciation: 70,
};

const SCORE_LABELS: Record<string, string> = {
  fluency: "Akıcılık",
  vocabulary: "Kelime Bilgisi",
  grammar: "Dilbilgisi",
  pronunciation: "Telaffuz",
};

export default function SpeakingExercise({
  level,
  onBack,
}: SpeakingExerciseProps) {
  const questions = useMemo(() => {
    return (questionsData.speaking as SpeakingQuestion[]).filter(
      (q) => q.level === level
    );
  }, [level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentIndex];
  const duration = question?.recommendedDuration ?? 60;

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
    setShowResults(false);
  }, [duration]);

  const stopRecording = useCallback(() => {
    setRecordingState("done");
  }, []);

  const submitForAnalysis = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setRecordingState("idle");
      setShowResults(false);
    }
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

  const overallScore = Math.round(
    Object.values(MOCK_AI_SCORES).reduce((a, b) => a + b, 0) /
      Object.values(MOCK_AI_SCORES).length
  );

  return (
    <div className={`${styles.speaking} animate-fade-in-up`}>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        ← Ödevlerime Dön
      </button>

      {/* Prompt Card */}
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

      {/* Recorder */}
      {!showResults && (
        <div className={`glass-card ${styles.recorderSection}`}>
          {/* Timer */}
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

          {/* Wave Animation */}
          {recordingState === "recording" && (
            <div className={styles.waveContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.waveBar} />
              ))}
            </div>
          )}

          {/* Mic Button */}
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
              AI Analizi İçin Gönder 🤖
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className={`glass-card ${styles.resultsCard}`}>
          <h3 className={styles.resultsTitle}>
            AI Konuşma Analizi — %{overallScore}
          </h3>

          <div className={styles.scoreGrid}>
            {Object.entries(MOCK_AI_SCORES).map(([key, value]) => (
              <div key={key} className={styles.scoreItem}>
                <span className={styles.scoreLabel}>
                  {SCORE_LABELS[key] || key}
                </span>
                <span className={styles.scoreValue}>{value}</span>
                <div className={styles.scoreBar}>
                  <div
                    className={styles.scoreBarFill}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.feedbackSection}>
            <h4 className={styles.feedbackTitle}>AI Geri Bildirimi</h4>
            <p className={styles.feedbackText}>
              Genel akıcılık orta seviyede. Cümle yapılarında çeşitlilik
              artırılmalı. Kelime hazinesi konuya uygun ancak akademik ifadeler
              daha fazla kullanılabilir. Telaffuzda /θ/ ve /ð/ seslerine dikkat
              edilmeli.
            </p>
          </div>

          <div className={styles.analysisNote}>
            <span>⚠️</span>
            Bu sonuçlar mock verilerdir. API entegrasyonu sonraki aşamada
            eklenecektir.
          </div>

          {currentIndex < questions.length - 1 && (
            <button
              type="button"
              className={styles.submitBtn}
              onClick={nextQuestion}
              style={{ marginTop: "var(--space-4)", width: "100%" }}
            >
              Sonraki Soru →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
