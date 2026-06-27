"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      id="main-navbar"
    >
      <div className={`container ${styles.navContent}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="navbar-logo">
          <span className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logo-grad)" />
              <path
                d="M8 10h4v8H8V10zm8 0h4v8h-4V10z"
                fill="white"
                opacity="0.9"
              />
              <path d="M12 13h4v2h-4v-2z" fill="white" opacity="0.7" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className={styles.logoText}>
            Dil<span className={styles.logoHighlight}>AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks} id="navbar-links">
          <li>
            <a href="#features" className={styles.navLink}>
              Özellikler
            </a>
          </li>
          <li>
            <a href="#exams" className={styles.navLink}>
              Sınavlar
            </a>
          </li>
          <li>
            <a href="#audience" className={styles.navLink}>
              Kimler İçin
            </a>
          </li>
          <li>
            <a href="#how-it-works" className={styles.navLink}>
              Nasıl Çalışır
            </a>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className={styles.navActions} id="navbar-actions">
          <Link href="/login" className="btn btn-secondary btn-sm">
            Giriş Yap
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Ücretsiz Dene
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`${styles.menuToggle} ${mobileMenuOpen ? styles.active : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapat"
          id="mobile-menu-toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu} id="mobile-menu">
          <ul className={styles.mobileLinks}>
            <li>
              <a
                href="#features"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Özellikler
              </a>
            </li>
            <li>
              <a
                href="#exams"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sınavlar
              </a>
            </li>
            <li>
              <a
                href="#audience"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Kimler İçin
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Nasıl Çalışır
              </a>
            </li>
          </ul>
          <div className={styles.mobileActions}>
            <Link
              href="/login"
              className="btn btn-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
