'use client';

import { motion } from 'framer-motion';
import type { XpState } from '@/types/xp';
import { MAX_LEVEL } from '@/types/xp';
import styles from './XpBar.module.css';

interface XpBarProps {
  xp: XpState | null;
  /** 'compact' for navbar, 'full' for sentinel/dashboard */
  variant?: 'compact' | 'full';
}

export default function XpBar({ xp, variant = 'compact' }: XpBarProps) {
  if (!xp) return null;

  const progress = xp.is_max_level ? 100 : xp.progress_percent;
  const levelLabel = xp.is_max_level ? 'MAX' : `Lv ${xp.level}`;
  const nextLabel  = xp.is_max_level
    ? 'Max Level Reached'
    : `${xp.current_level_xp} / ${xp.next_level_xp} XP`;

  if (variant === 'compact') {
    return (
      <div className={styles.compact}>
        <span className={styles.compactLevel}>{levelLabel}</span>
        <div className={styles.compactBar}>
          <motion.div
            className={styles.compactFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <span className={styles.compactXp}>⚡ {xp.total}</span>
      </div>
    );
  }

  return (
    <div className={styles.full}>
      <div className={styles.fullHeader}>
        <div className={styles.fullLeft}>
          <span className={styles.fullLevel}>{levelLabel}</span>
          {!xp.is_max_level && (
            <span className={styles.fullNextLevel}>→ Lv {xp.level + 1}</span>
          )}
        </div>
        <span className={styles.fullXpLabel}>{nextLabel}</span>
      </div>

      <div className={styles.fullBar}>
        <motion.div
          className={styles.fullFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      <div className={styles.fullFooter}>
        <span className={styles.fullTotal}>⚡ {xp.total} Total XP</span>
        {xp.is_max_level && (
          <span className={styles.maxBadge}>MAX LEVEL</span>
        )}
      </div>
    </div>
  );
}