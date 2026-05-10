'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { HttpError } from '@/lib/api';
import type { StreakData } from '@/types/auth';
import styles from './MercyCard.module.css';

interface MercyCardProps {
  streak: StreakData | null;
  onStreakRestored: (updated: StreakData) => void;
}

export default function MercyCard({ streak, onStreakRestored }: MercyCardProps) {
  const [isUsing, setIsUsing] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleUseMercyToken = async () => {
    setIsUsing(true);
    setError(null);

    try {
      const response = await apiClient.post<{ streak: StreakData }>('/streak/mercy');
      onStreakRestored(response.data!.streak);
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setIsUsing(false);
    }
  };

  const tokenCount  = streak?.mercy_tokens ?? 3;
  const isBroken    = streak?.is_broken ?? false;
  const current     = streak?.current ?? 0;
  const longest     = streak?.longest ?? 0;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={styles.cardTitle}>Mercy Tokens</span>
        <span className={styles.tokenCount}>{tokenCount} remaining</span>
      </div>

      {/* ── Token Icons ── */}
      <div className={styles.tokenRow}>
        <span className={styles.tokenNumber}>{tokenCount}</span>
        <div className={styles.tokenIcons}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`${styles.tokenIcon} ${i < tokenCount ? styles.tokenIconActive : styles.tokenIconEmpty}`}
            >
              🪙
            </span>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className={styles.divider} />

      {/* ── Streak Stats ── */}
      <div className={styles.streakRow}>
        <div className={styles.streakStat}>
          <span className={styles.streakIcon}>🔥</span>
          <div className={styles.streakInfo}>
            <span className={styles.streakLabel}>Current Streak</span>
            <span className={`${styles.streakValue} ${isBroken ? styles.streakValueBroken : ''}`}>
              {isBroken ? '— broken' : `${current} day${current !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div className={styles.streakStat}>
          <span className={styles.streakIcon}>🏆</span>
          <div className={styles.streakInfo}>
            <span className={styles.streakLabel}>Longest Streak</span>
            <span className={styles.streakValue}>
              {longest} day{longest !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Mercy Token Use Button (only when broken and tokens available) ── */}
      <AnimatePresence>
        {isBroken && tokenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className={styles.mercyBtn}
              onClick={handleUseMercyToken}
              disabled={isUsing}
            >
              {isUsing ? 'Applying...' : '🪙 Use Token — Restore Streak'}
            </button>
          </motion.div>
        )}

        {isBroken && tokenCount === 0 && (
          <motion.p
            className={styles.noTokensHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No tokens left. Refills 1st of next month.
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
      {error && <p className={styles.errorText}>{error}</p>}

      {/* ── Refill hint ── */}
      <p className={styles.refillHint}>Tokens refill on the 1st of each month</p>
    </motion.div>
  );
}