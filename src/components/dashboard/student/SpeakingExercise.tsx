"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { SpeakingQuestion } from "@/types/question";
import styles from "./SpeakingExercise.module.css";

type SpeakingExerciseProps = {
  level: string;
  onBack: () => void;
};

type RecordingState = "idle" | "recording" | "done";

type GrammarError = {
  error: string;
  correction: string;
  explanation: string;
};

type SpeechAnalysisResult = {
  transcript?: string;
  overallScore?: number;
  fluencyScore?: number;
  accuracyScore?: number;
  grammarErrors?: GrammarError[];
  pronunciationFeedback?: string;
  feedback?: string;
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<SpeechAnalysisResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const question = questions[currentIndex];
  const duration = question?.recommendedDuration ?? 60;

  useEffect(() => {
    if (recordingState !== "recording") return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopRecording();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingState]);

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingState("recording");
      setTimeLeft(duration);
      setShowResults(false);
      setAiResult(null);
    } catch (err) {
      console.error("Microphone error:", err);
      setErrorMessage(
        "Mikrofon erişimi sağlanamadı. Lütfen tarayıcı izinlerini kontrol edin."
      );
    }
  };

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecordingState("done");
  }, []);

  const submitForAnalysis = async () => {
    if (!audioBlob) {
      setErrorMessage("Analiz edilecek ses kaydı bulunamadı.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("audio", audioBlob, `speech.${extension}`);
      formData.append("assignmentId", question?.id || "practice-id");
      formData.append("userId", "student-user-id");
      if (question?.question) {
        formData.append("referenceText", question.question);
      }

      const response = await fetch("/api/speech?dryRun=true", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ses analizi yapılırken sunucu hatası oluştu.");
      }

      setAiResult(data);
      setShowResults(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      console.error("Analysis submit error:", err);
      setErrorMessage(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setRecordingState("idle");
      setShowResults(false);
      setAudioBlob(null);
      setAudioUrl(null);
      setAiResult(null);
      setErrorMessage(null);
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

  const overallScore = aiResult?.overallScore ?? 0;
  const fluencyScore = aiResult?.fluencyScore ?? 0;
  const accuracyScore = aiResult?.accuracyScore ?? 0;

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

      {errorMessage && (
        <div className={styles.errorBanner}>
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {/* Recorder */}
      {!showResults && !isAnalyzing && (
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

          {/* Audio Preview Player */}
          {recordingState === "done" && audioUrl && (
            <div className={styles.audioPreviewContainer}>
              <p className={styles.audioPreviewLabel}>Kayıt Önizleme:</p>
              <audio src={audioUrl} controls className={styles.audioPreview} />
            </div>
          )}

          {recordingState === "done" && (
            <button
              type="button"
              className={styles.submitBtn}
              onClick={submitForAnalysis}
            >
              Gemini AI ile Analiz Et 🤖
            </button>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isAnalyzing && (
        <div className={`glass-card ${styles.loadingSection}`}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>
            Gemini konuşmanızı dinliyor ve yapay zeka analizini hazırlıyor...
          </p>
        </div>
      )}

      {/* Results */}
      {showResults && aiResult && (
        <div className={`glass-card ${styles.resultsCard}`}>
          <h3 className={styles.resultsTitle}>
            AI Konuşma Analizi — %{overallScore}
          </h3>

          {/* Audio Replay */}
          {audioUrl && (
            <div className={styles.audioReplayBox}>
              <span>🎧 Kaydınız:</span>
              <audio src={audioUrl} controls className={styles.audioPreview} />
            </div>
          )}

          {/* Transcript Display */}
          {aiResult.transcript && (
            <div className={styles.transcriptSection}>
              <h4 className={styles.feedbackTitle}>🎙 Transkripsiyon (Söyledikleriniz)</h4>
              <blockquote className={styles.transcriptText}>
                "{aiResult.transcript}"
              </blockquote>
            </div>
          )}

          {/* Scores */}
          <div className={styles.scoreGrid}>
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>Genel Puan</span>
              <span className={styles.scoreValue}>{overallScore}</span>
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>Akıcılık (Fluency)</span>
              <span className={styles.scoreValue}>{fluencyScore}</span>
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${fluencyScore}%` }}
                />
              </div>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>Doğruluk (Accuracy)</span>
              <span className={styles.scoreValue}>{accuracyScore}</span>
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${accuracyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grammar Errors */}
          {aiResult.grammarErrors && aiResult.grammarErrors.length > 0 && (
            <div className={styles.grammarSection}>
              <h4 className={styles.feedbackTitle}>✏️ Dilbilgisi Tespitleri & Düzeltmeler</h4>
              <div className={styles.grammarList}>
                {aiResult.grammarErrors.map((item, idx) => (
                  <div key={idx} className={styles.grammarCard}>
                    <div className={styles.grammarRow}>
                      <span className={styles.grammarBadgeError}>Hata:</span>
                      <span className={styles.grammarErrorText}>{item.error}</span>
                    </div>
                    <div className={styles.grammarRow}>
                      <span className={styles.grammarBadgeSuccess}>Doğrusu:</span>
                      <span className={styles.grammarCorrectText}>{item.correction}</span>
                    </div>
                    {item.explanation && (
                      <p className={styles.grammarExplanation}>💡 {item.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {aiResult.pronunciationFeedback && (
            <div className={styles.feedbackSection}>
              <h4 className={styles.feedbackTitle}>🗣 Telaffuz & Akıcılık Geri Bildirimi</h4>
              <p className={styles.feedbackText}>{aiResult.pronunciationFeedback}</p>
            </div>
          )}

          {aiResult.feedback && (
            <div className={styles.feedbackSection} style={{ marginTop: "var(--space-4)" }}>
              <h4 className={styles.feedbackTitle}>🤖 Genel Değerlendirme</h4>
              <p className={styles.feedbackText}>{aiResult.feedback}</p>
            </div>
          )}

          {currentIndex < questions.length - 1 && (
            <button
              type="button"
              className={styles.submitBtn}
              onClick={nextQuestion}
              style={{ marginTop: "var(--space-6)", width: "100%" }}
            >
              Sonraki Soru →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

