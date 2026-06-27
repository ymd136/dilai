"use client";

import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
      {/* Animated background elements */}
      <div className={styles.heroBg} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.gridOverlay} />
      </div>

      <div className={`container ${styles.heroContent}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Yapay Zeka Destekli Dil Eğitimi</span>
        </div>

        <h1 className={`${styles.title} animate-fade-in-up`}>
          Dil Öğrenimini{" "}
          <span className="text-gradient">Yapay Zeka</span> ile
          <br />
          <span className="text-gradient-accent">Dönüştürün</span>
        </h1>

        <p className={`${styles.subtitle} animate-fade-in-up delay-2`}>
          TOEFL, YDS ve YÖKDİL sınav süreçlerini dijitalleştirin. AI destekli
          konuşma analizi, otomatik puanlama ve gelişmiş ödev yönetimi ile
          eğitim kalitesini artırın.
        </p>

        <div className={`${styles.cta} animate-fade-in-up delay-3`}>
          <Link href="/register" className="btn btn-primary btn-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Hemen Başlayın
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Nasıl Çalışır?
          </a>
        </div>

        {/* Stats */}
        <div className={`${styles.stats} animate-fade-in-up delay-5`}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>50+</span>
            <span className={styles.statLabel}>Eğitim Kurumu</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>10.000+</span>
            <span className={styles.statLabel}>Aktif Öğrenci</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>%94</span>
            <span className={styles.statLabel}>Başarı Oranı</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>1M+</span>
            <span className={styles.statLabel}>Analiz Edilen Ödev</span>
          </div>
        </div>
      </div>
    </section>
  );
}
