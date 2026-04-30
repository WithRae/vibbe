'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './sentinel.module.css';

const EVOLUTION_STAGES = [
  { level: 1, name: 'Awakening', xp: 0, color: '#00ff88' },
  { level: 2, name: 'Rising', xp: 100, color: '#00ffcc' },
  { level: 3, name: 'Ascending', xp: 300, color: '#00ccff' },
  { level: 4, name: 'Transcending', xp: 600, color: '#8800ff' },
  { level: 5, name: 'Enlightened', xp: 1000, color: '#ff00ff' },
];

export default function SentinelPage() {
  const [currentXP] = useState(350);
  const [isGlowing, setIsGlowing] = useState(false);

  const currentStage = EVOLUTION_STAGES.reduce((acc, stage) => 
    currentXP >= stage.xp ? stage : acc
  , EVOLUTION_STAGES[0]);

  const nextStage = EVOLUTION_STAGES[currentStage.level] || null;
  const progressToNext = nextStage 
    ? ((currentXP - currentStage.xp) / (nextStage.xp - currentStage.xp)) * 100
    : 100;

  return (
    <main className={styles.main}>
      <div className={styles.bgGlow}></div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>VIBBE</span>
        </div>
        <div className={styles.navTabs}>
          <a href="/"><button className={styles.navTab}>Home</button></a>
          <a href="/dashboard"><button className={styles.navTab}>Dashboard</button></a>
          <a href="/focus"><button className={styles.navTab}>Focus</button></a>
        </div>
        <div className={styles.xpBadge}>
          <span className={styles.xpText}>⚡ {currentXP} XP</span>
        </div>
      </nav>

      <div className={styles.content}>

        {/* Left — Stage Info */}
        <motion.div
          className={styles.stagePanel}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.panelTitle}>Evolution Stages</h2>
          <div className={styles.stageList}>
            {EVOLUTION_STAGES.map((stage) => (
              <div
                key={stage.level}
                className={`${styles.stageItem} ${currentStage.level >= stage.level ? styles.stageUnlocked : ''} ${currentStage.level === stage.level ? styles.stageCurrent : ''}`}
              >
                <div className={styles.stageNumber}>{stage.level}</div>
                <div className={styles.stageInfo}>
                  <span className={styles.stageName}>{stage.name}</span>
                  <span className={styles.stageXp}>{stage.xp} XP required</span>
                </div>
                {currentStage.level >= stage.level && (
                  <span className={styles.stageCheck}>✓</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Center — Avatar */}
        <div className={styles.centerPanel}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Sentinel Avatar
          </motion.h1>
          <p className={styles.subtitle}>Stage: {currentStage.name}</p>

          {/* Avatar */}
          <motion.div
            className={styles.avatarWrapper}
            animate={{
              y: [0, -20, 0],
              filter: isGlowing ? [
                `drop-shadow(0 0 30px ${currentStage.color})`,
                `drop-shadow(0 0 60px ${currentStage.color})`,
                `drop-shadow(0 0 30px ${currentStage.color})`,
              ] : [
                `drop-shadow(0 0 20px ${currentStage.color})`,
                `drop-shadow(0 0 40px ${currentStage.color})`,
                `drop-shadow(0 0 20px ${currentStage.color})`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => setIsGlowing(!isGlowing)}
          >
            <svg viewBox="0 0 300 300" className={styles.avatarSvg}>
              {/* Outer rings */}
              <ellipse cx="150" cy="240" rx="100" ry="16"
                fill="none" stroke={currentStage.color} strokeWidth="1" opacity="0.4"/>
              <ellipse cx="150" cy="240" rx="70" ry="10"
                fill="none" stroke={currentStage.color} strokeWidth="0.5" opacity="0.3"/>

              {/* Main body */}
              <polygon points="150,30 220,90 220,180 150,230 80,180 80,90"
                fill="none" stroke={currentStage.color} strokeWidth="2"/>

              {/* Inner faces */}
              <polygon points="150,30 220,90 150,120"
                fill={`${currentStage.color}10`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="150,30 80,90 150,120"
                fill={`${currentStage.color}15`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="220,90 220,180 150,120"
                fill={`${currentStage.color}08`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="80,90 80,180 150,120"
                fill={`${currentStage.color}12`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="150,230 220,180 150,180"
                fill={`${currentStage.color}10`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="150,230 80,180 150,180"
                fill={`${currentStage.color}14`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="220,90 150,120 150,180 220,180"
                fill={`${currentStage.color}06`} stroke={currentStage.color} strokeWidth="1"/>
              <polygon points="80,90 150,120 150,180 80,180"
                fill={`${currentStage.color}10`} stroke={currentStage.color} strokeWidth="1"/>

              {/* Core glow */}
              <circle cx="150" cy="130" r="10"
                fill={currentStage.color} opacity="0.9"/>
              <circle cx="150" cy="130" r="20"
                fill="none" stroke={currentStage.color} strokeWidth="1" opacity="0.4"/>
              <circle cx="150" cy="130" r="35"
                fill="none" stroke={currentStage.color} strokeWidth="0.5" opacity="0.2"/>

              {/* Level indicator dots */}
              {Array.from({ length: currentStage.level }).map((_, i) => (
                <circle
                  key={i}
                  cx={130 + i * 10}
                  cy="265"
                  r="3"
                  fill={currentStage.color}
                  opacity="0.8"
                />
              ))}
            </svg>
          </motion.div>

          <p className={styles.clickHint}>Click avatar to pulse</p>

          {/* XP Progress */}
          <div className={styles.xpSection}>
            <div className={styles.xpHeader}>
              <span className={styles.xpLabel}>Progress to {nextStage?.name || 'Max Level'}</span>
              <span className={styles.xpValue}>{currentXP} / {nextStage?.xp || currentXP} XP</span>
            </div>
            <div className={styles.xpBar}>
              <motion.div
                className={styles.xpFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Right — Stats */}
        <motion.div
          className={styles.statsPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.panelTitle}>Your Stats</h2>
          <div className={styles.statsList}>
            {[
              { label: 'Tasks Completed', value: '24', icon: '✅' },
              { label: 'Focus Sessions', value: '18', icon: '🎯' },
              { label: 'Total Focus Time', value: '7.5h', icon: '⏱' },
              { label: 'Current Streak', value: '5 days', icon: '🔥' },
              { label: 'Mercy Tokens Used', value: '2', icon: '🪙' },
              { label: 'XP Earned', value: '350', icon: '⚡' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={styles.statItem}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className={styles.statIcon}>{stat.icon}</span>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a href="/focus">
            <motion.button
              className={styles.focusBtn}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ▶ Start Focus Session
            </motion.button>
          </motion.a>
        </motion.div>

      </div>
    </main>
  );
}