'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './focus.module.css';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (mode === 'focus') {
              setSessions(s => s + 1);
              setMode('break');
              return BREAK_TIME;
            } else {
              setMode('focus');
              return FOCUS_TIME;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const handleStartStop = () => setIsRunning(prev => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const handleModeSwitch = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  return (
    <main className={styles.main}>

      {/* Background glow */}
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
          <a href="/focus"><button className={`${styles.navTab} ${styles.active}`}>Focus</button></a>
        </div>
        <div className={styles.sessionCount}>
          <span className={styles.sessionIcon}>🎯</span>
          <span className={styles.sessionText}>{sessions} sessions today</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.content}>

        {/* Mode Switcher */}
        <div className={styles.modeSwitcher}>
          <button
            className={`${styles.modeBtn} ${mode === 'focus' ? styles.modeBtnActive : ''}`}
            onClick={() => handleModeSwitch('focus')}
          >
            Focus
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'break' ? styles.modeBtnActive : ''}`}
            onClick={() => handleModeSwitch('break')}
          >
            Break
          </button>
        </div>

        {/* Timer Ring */}
        <motion.div
          className={styles.timerWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <svg
            className={styles.timerSvg}
            viewBox="0 0 280 280"
          >
            {/* Background ring */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="rgba(0,255,136,0.1)"
              strokeWidth="8"
            />

            {/* Progress ring */}
            <motion.circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="#00ff88"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 140 140)"
              style={{
                filter: 'drop-shadow(0 0 8px #00ff88)',
                transition: 'stroke-dashoffset 1s linear',
              }}
            />

            {/* Outer decorative ring */}
            <circle
              cx="140"
              cy="140"
              r="132"
              fill="none"
              stroke="rgba(0,255,136,0.05)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />

            {/* Inner decorative ring */}
            <circle
              cx="140"
              cy="140"
              r="108"
              fill="none"
              stroke="rgba(0,255,136,0.05)"
              strokeWidth="1"
            />
          </svg>

          {/* Time Display */}
          <div className={styles.timeDisplay}>
            <motion.div
              className={styles.timeText}
              key={timeString}
              animate={isRunning ? {
                textShadow: [
                  '0 0 10px rgba(0,255,136,0.5)',
                  '0 0 20px rgba(0,255,136,0.8)',
                  '0 0 10px rgba(0,255,136,0.5)',
                ],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {timeString}
            </motion.div>
            <div className={styles.modeLabel}>
              {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className={styles.controls}>
          <motion.button
            className={styles.resetBtn}
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↺ Reset
          </motion.button>

          <motion.button
            className={`${styles.startBtn} ${isRunning ? styles.pauseBtn : ''}`}
            onClick={handleStartStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? '⏸ Pause' : '▶ Start Focus'}
          </motion.button>

          <motion.button
            className={styles.skipBtn}
            onClick={() => handleModeSwitch(mode === 'focus' ? 'break' : 'focus')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip ⏭
          </motion.button>
        </div>

        {/* Session dots */}
        <div className={styles.sessionDots}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`${styles.sessionDot} ${i < sessions % 4 ? styles.sessionDotFilled : ''}`}
            />
          ))}
        </div>

        {/* Task being focused on */}
        <motion.div
          className={styles.currentTask}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className={styles.currentTaskLabel}>Currently focusing on</p>
          <h3 className={styles.currentTaskTitle}>Design landing page</h3>
          <a href="/dashboard">
            <button className={styles.changeTaskBtn}>Change Task</button>
          </a>
        </motion.div>

      </div>
    </main>
  );
}