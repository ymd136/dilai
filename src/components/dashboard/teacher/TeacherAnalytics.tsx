"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { getAnalyticsByExam, getClassesByExam } from "@/lib/mocks/teacherData";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import { MOCK_TOPIC_ERROR_RATES } from "@/lib/mocks/studentMockData";
import styles from "./TeacherAnalytics.module.css";

function buildLinePath(values: number[], width: number, height: number): string {
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

function buildAreaPath(values: number[], width: number, height: number): string {
  const line = buildLinePath(values, width, height);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

function getScoreClass(score: number): string {
  if (score >= 80) return styles.miniScoreHigh;
  if (score >= 60) return styles.miniScoreMid;
  return styles.miniScoreLow;
}

export default function TeacherAnalytics() {
  const { selectedExam, examColor } = useDashboard();
  const data = getAnalyticsByExam(selectedExam);
  const classes = getClassesByExam(selectedExam);

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  const chartWidth = 400;
  const chartHeight = 160;
  const linePath = buildLinePath(data.weeklyTrend, chartWidth, chartHeight);
  const areaPath = buildAreaPath(data.weeklyTrend, chartWidth, chartHeight);
  const maxBar = Math.max(...data.sectionScores.map((s) => s.value));
  const maxError = Math.max(...MOCK_TOPIC_ERROR_RATES.map((e) => e.errorRate));

  return (
    <div className={`${styles.analytics} animate-fade-in-up`} id="teacher-analytics">
      <div className={styles.header}>
        <span className="section-label">📈 Sınav Başarı Analitiği</span>
        <h2 className="section-title">
          <span className="text-gradient">{examLabel}</span> Performans Özeti
        </h2>
        <p className="section-subtitle">
          Sınıf ortalamaları, haftalık gelişim trendi ve bölüm bazlı skor dağılımı.
        </p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statGrid}>
        <article className={`glass-card ${styles.statCard} ${styles.featured}`}>
          <span className={styles.statLabel}>Sınıf Ortalama Gelişim Skoru</span>
          <span className={`${styles.statValue} ${styles.statValueAccent}`}>
            %{data.avgProgressScore}
          </span>
          <span className={styles.statHint}>Son 7 haftalık ortalama</span>
        </article>
        <article
          className={`glass-card ${styles.statCard}`}
          style={{ "--exam-color": examColor } as React.CSSProperties}
        >
          <span className={styles.statLabel}>Ödev Tamamlama Oranı</span>
          <span className={styles.statValue}>%{data.completionRate}</span>
          <span className={styles.statHint}>{examLabel} formatı</span>
        </article>
        <article
          className={`glass-card ${styles.statCard}`}
          style={{ "--exam-color": examColor } as React.CSSProperties}
        >
          <span className={styles.statLabel}>Aktif Öğrenci</span>
          <span className={styles.statValue}>{data.activeStudents}</span>
          <span className={styles.statHint}>Seçili sınav grupları</span>
        </article>
        <article
          className={`glass-card ${styles.statCard}`}
          style={{ "--exam-color": examColor } as React.CSSProperties}
        >
          <span className={styles.statLabel}>Haftalık Artış</span>
          <span className={styles.statValue}>
            +{data.weeklyTrend[data.weeklyTrend.length - 1] - data.weeklyTrend[0]} puan
          </span>
          <span className={styles.statHint}>7 haftalık trend</span>
        </article>
      </div>

      {/* Charts */}
      <div className={styles.chartGrid}>
        <article className={`glass-card ${styles.chartCard}`}>
          <div>
            <h3 className={styles.chartTitle}>Haftalık Gelişim Trendi</h3>
            <p className={styles.chartSubtitle}>Sınıf ortalama skoru — son 7 hafta</p>
          </div>
          <div className={styles.lineChart}>
            <svg
              className={styles.lineChartSvg}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
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
            {["H1", "H2", "H3", "H4", "H5", "H6", "H7"].map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </article>

        <article className={`glass-card ${styles.chartCard}`}>
          <div>
            <h3 className={styles.chartTitle}>Bölüm Skorları</h3>
            <p className={styles.chartSubtitle}>{examLabel} alt beceri dağılımı</p>
          </div>
          <div className={styles.barChart}>
            {data.sectionScores.map((section, i) => (
              <div key={section.label} className={styles.barGroup}>
                <span className={styles.barValue}>%{section.value}</span>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(section.value / maxBar) * 140}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <span className={styles.barLabel}>{section.label}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Topic Error Analysis */}
      <div className={styles.errorSection}>
        <div>
          <h3 className="section-title" style={{ fontSize: "var(--text-2xl)" }}>
            🔍 En Çok Hata Yapılan <span className="text-gradient">Konular</span>
          </h3>
          <p className="section-subtitle" style={{ fontSize: "var(--text-sm)" }}>
            Öğrencilerin en sık hata yaptığı dilbilgisi ve kelime konuları.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "var(--space-6)" }}>
          <div className={styles.errorBars}>
            {MOCK_TOPIC_ERROR_RATES.map((item) => (
              <div key={item.topic} className={styles.errorBarRow}>
                <span className={styles.errorBarLabel}>{item.topic}</span>
                <div className={styles.errorBarTrack}>
                  <div
                    className={`${styles.errorBarFill} ${
                      item.errorRate < 25 ? styles.errorBarFillLow : ""
                    }`}
                    style={{ width: `${(item.errorRate / maxError) * 100}%` }}
                  />
                </div>
                <span className={styles.errorBarValue}>%{item.errorRate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Performance Table */}
      <div className={styles.errorSection}>
        <div>
          <h3 className="section-title" style={{ fontSize: "var(--text-2xl)" }}>
            👥 Öğrenci <span className="text-gradient">Performansları</span>
          </h3>
          <p className="section-subtitle" style={{ fontSize: "var(--text-sm)" }}>
            {examLabel} formatındaki sınıflardaki öğrencilerin ilerleme durumu.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "var(--space-6)" }}>
          <div className={styles.studentTableWrap}>
            <table className={styles.studentTable}>
              <thead>
                <tr>
                  <th>Öğrenci</th>
                  <th>Sınıf</th>
                  <th>İlerleme</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {classes.flatMap((cls) =>
                  cls.students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <span className={styles.studentName}>{student.name}</span>
                      </td>
                      <td>{cls.name}</td>
                      <td>
                        <span
                          className={`${styles.miniScore} ${getScoreClass(
                            student.progressScore
                          )}`}
                        >
                          %{student.progressScore}
                        </span>
                      </td>
                      <td>
                        {student.progressScore >= 80
                          ? "🟢 İyi"
                          : student.progressScore >= 60
                          ? "🟡 Gelişiyor"
                          : "🔴 Destek Gerekli"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
