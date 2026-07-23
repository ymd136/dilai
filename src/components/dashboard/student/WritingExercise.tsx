"use client";

import { useState, useMemo } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { WritingQuestion } from "@/types/question";
import styles from "./WritingExercise.module.css";

type WritingExerciseProps = {
  level: string;
  onBack: () => void;
};

const MOCK_AI_SCORES = {
  grammar: 80,
  vocabulary: 75,
  coherence: 82,
  taskAchievement: 78,
};

const SCORE_LABELS: Record<string, string> = {
  grammar: "Dilbilgisi",
  vocabulary: "Kelime Bilgisi",
  coherence: "Tutarlılık",
  taskAchievement: "Görevi Tamamlama",
};

const MOCK_CORRECTIONS = [
  {
    original: "People thinks that",
    fixed: "People think that",
    explanation: "Subject-verb agreement: 'People' çoğul öznedir.",
  },
  {
    original: "It is more better",
    fixed: "It is better / It is much better",
    explanation: "Double comparative hatası.",
  },
  {
    original: "goverment",
    fixed: "government",
    explanation: "Yazım hatası.",
  },
];

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

  const question = questions[currentIndex];
  const minWords = question?.minWords ?? 200;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const meetsMinimum = wordCount >= minWords;

  const overallScore = Math.round(
    Object.values(MOCK_AI_SCORES).reduce((a, b) => a + b, 0) /
      Object.values(MOCK_AI_SCORES).length
  );

  const handleSubmit = () => {
    setShowResults(true);
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
            disabled={wordCount < 20}
            onClick={handleSubmit}
          >
            AI Değerlendirmesi İçin Gönder 🤖
          </button>
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
              Essay yapısı genel olarak iyi. Giriş paragrafı konuyu açıkça
              ortaya koyuyor. Ancak kelime çeşitliliği artırılmalı — aynı
              kelimelerin tekrarı puanı düşürüyor. Bağlaç kullanımı güçlü.
              Sonuç paragrafında kendi fikrinizi daha net belirtmeniz gerekiyor.
            </p>
          </div>

          {/* Corrections */}
          <div className={styles.corrections}>
            <h4 className={styles.feedbackTitle}>
              🔍 Tespit Edilen Hatalar (Mock)
            </h4>
            {MOCK_CORRECTIONS.map((c, i) => (
              <div key={i} className={styles.correction}>
                <span className={styles.correctionIcon}>✏️</span>
                <div>
                  <p className={styles.correctionText}>
                    <span className={styles.correctionOriginal}>
                      {c.original}
                    </span>
                    {" → "}
                    <span className={styles.correctionFixed}>{c.fixed}</span>
                  </p>
                  <p className={styles.correctionText}>{c.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.analysisNote}>
            <span>⚠️</span>
            Bu sonuçlar mock verilerdir. API entegrasyonu sonraki aşamada
            eklenecektir.
          </div>

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
