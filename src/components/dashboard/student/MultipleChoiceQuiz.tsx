"use client";

import { useState, useMemo } from "react";
import questionsData from "@/lib/mocks/questions.json";
import type { MultipleChoiceQuestion } from "@/types/question";
import styles from "./MultipleChoiceQuiz.module.css";

type MultipleChoiceQuizProps = {
  level: string;
  questionCount?: number;
  onBack: () => void;
};

export default function MultipleChoiceQuiz({
  level,
  questionCount = 10,
  onBack,
}: MultipleChoiceQuizProps) {
  const questions = useMemo(() => {
    const pool = (
      questionsData.multiple_choice as MultipleChoiceQuestion[]
    ).filter((q) => q.level === level);
    // Shuffle and take questionCount
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [level, questionCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const selectAnswer = (answer: string) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  // Calculate results
  const correctCount = questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.correctAnswer ? 1 : 0);
  }, 0);
  const wrongCount = Object.keys(answers).length - correctCount;
  const scorePercent =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  if (questions.length === 0) {
    return (
      <div className={styles.quiz}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Geri Dön
        </button>
        <div className={`glass-card ${styles.resultsCard}`}>
          <p>Bu seviyede soru bulunamadı.</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className={`${styles.quiz} animate-fade-in-up`}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Ödevlerime Dön
        </button>

        <div className={`glass-card ${styles.resultsCard}`}>
          <div className={styles.resultsIcon}>
            {scorePercent >= 80 ? "🎉" : scorePercent >= 60 ? "👍" : "📖"}
          </div>
          <h2 className={styles.resultsTitle}>Sınav Tamamlandı!</h2>
          <div className={styles.resultsScore}>%{scorePercent}</div>

          <div className={styles.resultsStats}>
            <div className={styles.resultStat}>
              <span
                className={`${styles.resultStatValue} ${styles.resultCorrect}`}
              >
                {correctCount}
              </span>
              <span className={styles.resultStatLabel}>Doğru</span>
            </div>
            <div className={styles.resultStat}>
              <span
                className={`${styles.resultStatValue} ${styles.resultWrong}`}
              >
                {wrongCount}
              </span>
              <span className={styles.resultStatLabel}>Yanlış</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatValue}>
                {questions.length - Object.keys(answers).length}
              </span>
              <span className={styles.resultStatLabel}>Boş</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.finishBtn}
            onClick={() => setShowReview((v) => !v)}
          >
            {showReview ? "İncelemeyi Kapat" : "Cevapları İncele"}
          </button>

          {showReview && (
            <div className={styles.reviewList}>
              {questions.map((q, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div key={q.id} className={styles.reviewItem}>
                    <span className={styles.reviewIcon}>
                      {!userAnswer ? "⬜" : isCorrect ? "✅" : "❌"}
                    </span>
                    <div>
                      <p className={styles.reviewQuestion}>
                        {i + 1}. {q.question}
                      </p>
                      <p className={styles.reviewAnswer}>
                        <span className={styles.reviewCorrectAnswer}>
                          Doğru: {q.correctAnswer}
                        </span>
                        {userAnswer && !isCorrect && (
                          <span className={styles.reviewWrongAnswer}>
                            {" "}
                            | Senin cevabın: {userAnswer}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.quiz} animate-fade-in-up`}>
      {/* Header */}
      <div className={styles.quizHeader}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Geri
        </button>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            {currentIndex + 1} / {questions.length}
          </span>
          <div className={styles.progressBarWrap}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className={`glass-card ${styles.questionCard}`}>
        <div className={styles.questionNumber}>
          Soru {currentIndex + 1} — {currentQuestion.level} /{" "}
          {currentQuestion.topic}
        </div>
        <h3 className={styles.questionText}>{currentQuestion.question}</h3>

        <div className={styles.optionsList}>
          {currentQuestion.options.map((option, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = answers[currentIndex] === option;
            return (
              <button
                key={i}
                type="button"
                className={`${styles.optionBtn} ${
                  isSelected ? styles.optionSelected : ""
                }`}
                onClick={() => selectAnswer(option)}
              >
                <span className={styles.optionLetter}>{letter}</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navButtons}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          ← Önceki
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            type="button"
            className={styles.finishBtn}
            onClick={finishQuiz}
          >
            Sınavı Bitir ✓
          </button>
        ) : (
          <button type="button" className={styles.navBtn} onClick={goNext}>
            Sonraki →
          </button>
        )}
      </div>
    </div>
  );
}
