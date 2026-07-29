"use client";

import { useState, useMemo } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { WritingQuestion } from "@/types/question";
import styles from "./WritingExercise.module.css";

type AIEvaluationResult = {
  overall_score: number;
  grammar_score: number;
  vocabulary_score: number;
  feedback: string;
  corrections: Array<{
    original: string;
    corrected: string;
    reason: string;
  }>;
};

type WritingExerciseProps = {
  level: string;
  onBack: () => void;
};

const SCORE_LABELS: Record<string, string> = {
  grammar_score: "Dilbilgisi",
  vocabulary_score: "Kelime Bilgisi",
};

export default function WritingExercise({
  level,
  onBack,
}: WritingExerciseProps) {
  const questions = useMemo(() => {
    return (questionsData.writing as WritingQuestion[]).filter(
      (q) => q.level === level
    );
  }, [level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const question = questions[currentIndex];
  const minWords = question?.minWords ?? 200;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const meetsMinimum = wordCount >= minWords;

  const overallScore = aiResult
    ? aiResult.overall_score
    : 0;

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Lütfen bir değerlendirilecek metin girin.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Değerlendirme başarısız oldu.');
      }

      setAiResult(result.data);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      console.error('AI Değerlendirme Hatası:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setText("");
      setShowResults(false);
    }
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
      <button type="button" className={styles.backBtn} onClick={onBack}>
        ← Ödevlerime Dön
      </button>

      {/* Prompt */}
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

      {/* Editor */}
      {!showResults && (
        <div className={`glass-card ${styles.editorSection}`}>
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
              <span className={styles.wordCountTarget}>/ {minWords} kelime</span>
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
            disabled={wordCount < 20 || isAnalyzing}
            onClick={handleSubmit}
          >
            {isAnalyzing ? 'Analiz Ediliyor...' : 'AI Değerlendirmesi İçin Gönder 🤖'}
          </button>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className={`glass-card ${styles.resultsCard}`}>
          <h3 className={styles.resultsTitle}>AI Yazma Analizi</h3>

          <div className={styles.overallScore}>
            <span className={styles.overallScoreValue}>%{overallScore}</span>
            <span className={styles.overallScoreLabel}>Genel Puan</span>
          </div>

          <div className={styles.scoreGrid}>
            {aiResult && (
              <>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>
                    {SCORE_LABELS.grammar_score}
                  </span>
                  <span className={styles.scoreValue}>{aiResult.grammar_score}</span>
                  <div className={styles.scoreBar}>
                    <div
                      className={styles.scoreBarFill}
                      style={{ width: `${aiResult.grammar_score}%` }}
                    />
                  </div>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>
                    {SCORE_LABELS.vocabulary_score}
                  </span>
                  <span className={styles.scoreValue}>{aiResult.vocabulary_score}</span>
                  <div className={styles.scoreBar}>
                    <div
                      className={styles.scoreBarFill}
                      style={{ width: `${aiResult.vocabulary_score}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={styles.feedbackSection}>
            <h4 className={styles.feedbackTitle}>AI Geri Bildirimi</h4>
            <p className={styles.feedbackText}>
              {aiResult?.feedback || 'Geri bildirim yükleniyor...'}
            </p>
          </div>

          {/* Corrections */}
          {aiResult?.corrections && aiResult.corrections.length > 0 && (
            <div className={styles.corrections}>
              <h4 className={styles.feedbackTitle}>
                🔍 Tespit Edilen Hatalar
              </h4>
              {aiResult.corrections.map((c, i) => (
                <div key={i} className={styles.correction}>
                  <span className={styles.correctionIcon}>✏️</span>
                  <div>
                    <p className={styles.correctionText}>
                      <span className={styles.correctionOriginal}>
                        {c.original}
                      </span>
                      {" → "}
                      <span className={styles.correctionFixed}>{c.corrected}</span>
                    </p>
                    <p className={styles.correctionText}>{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}


          {currentIndex < questions.length - 1 && (
            <button
              type="button"
              className={styles.nextBtn}
              onClick={nextQuestion}
            >
              Sonraki Soru →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
