"use client";

import {
  MOCK_STUDENT_WEEKLY_TREND,
  MOCK_STUDENT_SKILL_SCORES,
  MOCK_SUBMISSION_RESULTS,
} from "@/lib/mocks/studentMockData";
import { useStudentAssignments } from "@/hooks/useAssignmentStore";
import styles from "./StudentAnalytics.module.css";

function buildLinePath(
  values: number[],
  width: number,
  height: number
): string {
  const max = Math.max(...values);
  const min = Math.min(...values) - 5;
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  return values
    .map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(
  values: number[],
  width: number,
  height: number
): string {
  const line = buildLinePath(values, width, height);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

export default function StudentAnalytics() {
  const assignments = useStudentAssignments();
  const chartWidth = 400;
  const chartHeight = 160;
  const trendValues = MOCK_STUDENT_WEEKLY_TREND.map((t) => t.score);
  const linePath = buildLinePath(trendValues, chartWidth, chartHeight);
  const areaPath = buildAreaPath(trendValues, chartWidth, chartHeight);
  const maxBar = Math.max(...MOCK_STUDENT_SKILL_SCORES.map((s) => s.value));

  const completedAssignments = assignments.filter(
    (a) => a.status === "completed"
  );
  const avgScore =
    completedAssignments.length > 0
      ? Math.round(
          completedAssignments.reduce((acc, a) => acc + (a.score ?? 0), 0) /
            completedAssignments.length
        )
      : 0;

  const currentWeek =
    MOCK_STUDENT_WEEKLY_TREND[MOCK_STUDENT_WEEKLY_TREND.length - 1];
  const firstWeek = MOCK_STUDENT_WEEKLY_TREND[0];
  const improvement = currentWeek.score - firstWeek.score;

  return (
    <div
      className={`${styles.analytics} animate-fade-in-up`}
      id="student-analytics"
    >
      <div>
        <span className="section-label">📈 Gelişim Analitiği</span>
        <h2 className="section-title">
          Kişisel <span className="text-gradient">Performans</span> Özeti
        </h2>
        <p className="section-subtitle">
          Haftalık gelişim trendlerin, beceri skorların ve ödev geçmişin.
        </p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statGrid}>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Genel Ortalama</span>
          <span className={`${styles.statValue} ${styles.statValueAccent}`}>
            %{avgScore}
          </span>
          <span className={styles.statHint}>Tüm ödevler</span>
        </article>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Tamamlanan Ödev</span>
          <span className={styles.statValue}>
            {completedAssignments.length}
          </span>
          <span className={styles.statHint}>
            / {assignments.length} toplam
          </span>
        </article>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Haftalık Gelişim</span>
          <span className={styles.statValue}>+{improvement} puan</span>
          <span className={styles.statHint}>7 haftalık trend</span>
        </article>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>En Güçlü Alan</span>
          <span className={styles.statValue}>
            {
              MOCK_STUDENT_SKILL_SCORES.reduce((best, s) =>
                s.value > best.value ? s : best
              ).label
            }
          </span>
          <span className={styles.statHint}>
            %
            {
              MOCK_STUDENT_SKILL_SCORES.reduce((best, s) =>
                s.value > best.value ? s : best
              ).value
            }
          </span>
        </article>
      </div>

      {/* Charts */}
      <div className={styles.chartGrid}>
        {/* Weekly Trend */}
        <article className={`glass-card ${styles.chartCard}`}>
          <div>
            <h3 className={styles.chartTitle}>Haftalık Gelişim Trendi</h3>
            <p className={styles.chartSubtitle}>
              Kişisel ortalama skor — son 7 hafta
            </p>
          </div>
          <div className={styles.lineChart}>
            <svg
              className={styles.lineChartSvg}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="studentLineGrad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient
                  id="studentAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  className={styles.gridLine}
                  x1="0"
                  y1={chartHeight * ratio}
                  x2={chartWidth}
                  y2={chartHeight * ratio}
                />
              ))}
              <path className={styles.areaPath} d={areaPath} />
              <path className={styles.linePath} d={linePath} />
            </svg>
          </div>
          <div className={styles.weekLabels}>
            {MOCK_STUDENT_WEEKLY_TREND.map((w) => (
              <span key={w.week}>{w.week}</span>
            ))}
          </div>
        </article>

        {/* Skill Scores */}
        <article className={`glass-card ${styles.chartCard}`}>
          <div>
            <h3 className={styles.chartTitle}>Beceri Skorları</h3>
            <p className={styles.chartSubtitle}>
              Alt yetenek dağılımı — son ödevler
            </p>
          </div>
          <div className={styles.barChart}>
            {MOCK_STUDENT_SKILL_SCORES.map((skill, i) => (
              <div key={skill.label} className={styles.barGroup}>
                <span className={styles.barValue}>%{skill.value}</span>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(skill.value / maxBar) * 140}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <span className={styles.barLabel}>{skill.label}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Recent Submissions */}
      <div className={styles.recentSection}>
        <h3 className={styles.recentTitle}>Son Ödev Sonuçları</h3>
        <div className={styles.recentList}>
          {MOCK_SUBMISSION_RESULTS.map((result) => {
            const assignment = assignments.find(
              (a) => a.id === result.assignmentId
            );
            return (
              <article
                key={result.assignmentId}
                className={`glass-card ${styles.recentItem}`}
              >
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>
                    {assignment?.title ?? "Ödev"}
                  </span>
                  <span className={styles.recentDate}>
                    {new Date(result.submittedAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className={styles.recentScore}>%{result.score}</span>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
