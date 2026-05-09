"use client";

import styles from "./AppNavbar.module.css";

interface AppNavbarProps {
  activePage: "dashboard" | "focus" | "analytics" | "profile";
  rightContent?: React.ReactNode;
}

export default function AppNavbar({ activePage, rightContent }: AppNavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo}>
        <div className={styles.logoIcon}>◈</div>
        <span className={styles.logoText}>VIBBE</span>
      </div>

      <div className={styles.navTabs}>
        <a href="/dashboard">
          <button
            className={`${styles.navTab} ${activePage === "dashboard" ? styles.active : ""}`}
          >
            Dashboard
          </button>
        </a>
        <a href="/focus">
          <button
            className={`${styles.navTab} ${activePage === "focus" ? styles.active : ""}`}
          >
            Focus
          </button>
        </a>
        <a href="/analytics">
          <button
            className={`${styles.navTab} ${activePage === "analytics" ? styles.active : ""}`}
          >
            Summary
          </button>
        </a>
      </div>

      <div className={styles.navRight}>{rightContent}</div>
    </nav>
  );
}