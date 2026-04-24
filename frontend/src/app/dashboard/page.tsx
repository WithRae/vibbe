'use client';

import { motion } from 'framer-motion';
import styles from './dashboard.module.css';
import GlowButton from '@/components/ui/GlowButton';
import NeonCard from '@/components/ui/NeonCard';

export default function DashboardPage() {
  return (
    <main className={styles.main}>

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}>◈</div>
          <span className={styles.logoText}>VIBBE</span>
        </div>
        <div className={styles.navTabs}>
          <button className={styles.navTab}>Home</button>
          <button className={`${styles.navTab} ${styles.active}`}>Dashboard</button>
          <button className={styles.navTab}>Summary</button>
        </div>
        <div className={styles.navRight}>
          <div className={styles.xpBadge}>
            <span className={styles.xpIcon}>⚡</span>
            <span className={styles.xpText}>Level 3</span>
            <div className={styles.xpBarWrapper}>
              <motion.div
                className={styles.xpBar}
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          <div className={styles.profileBtn}>
            <span>👤</span>
            <span>Mash Profit.</span>
          </div>
        </div>
      </nav>

      {/* ── DASHBOARD GRID ── */}
      <div className={styles.grid}>

        {/* ── LEFT PANEL ── */}
        <div className={styles.leftPanel}>

          {/* Mercy Tokens */}
          <motion.div
            className={styles.mercyCard}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.mercyTop}>
              <span className={styles.cardTitle}>Mercy Tokens</span>
              <span className={styles.mercyCount}>3 remaining</span>
            </div>
            <div className={styles.mercyBottom}>
              <span className={styles.mercyNumber}>3</span>
              <div className={styles.tokenIcons}>
                <span className={styles.tokenIcon}>🪙</span>
                <span className={styles.tokenIcon}>🪙</span>
                <span className={styles.tokenIcon}>🪙</span>
              </div>
            </div>
            <p className={styles.mercyHint}>Use a token to protect your streak</p>
          </motion.div>

          {/* Task List */}
          <motion.div
            className={styles.taskCard}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.taskHeader}>
              <span className={styles.cardTitle}>Tasks</span>
              <GlowButton size="sm" variant="outline">+ Add</GlowButton>
            </div>
            <div className={styles.taskList}>
              {['Design landing page', 'Write backend API', 'Fix focus timer'].map((task, i) => (
                <div key={i} className={styles.taskItem}>
                  <div className={styles.taskCheck}></div>
                  <span className={styles.taskText}>{task}</span>
                  <button className={styles.taskShatter}>⚡</button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            className={styles.settingsBtn}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span>⚙</span>
            <span>Settings</span>
          </motion.div>

        </div>

        {/* ── CENTER PANEL ── */}
        <div className={styles.centerPanel}>

          {/* Focus Heading */}
          <motion.div
            className={styles.centerHeading}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.focusTitle}>Single Task Focus</h1>
            <p className={styles.focusSubtitle}>One task at a time. Full presence.</p>
          </motion.div>

          {/* Sentinel Avatar */}
          <motion.div
            className={styles.avatarWrapper}
            animate={{
              y: [0, -15, 0],
              filter: [
                'drop-shadow(0 0 20px #00ff88)',
                'drop-shadow(0 0 40px #00ff88)',
                'drop-shadow(0 0 20px #00ff88)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 200 200" className={styles.avatarSvg}>
              <ellipse cx="100" cy="160" rx="70" ry="12"
                fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
              <ellipse cx="100" cy="160" rx="50" ry="8"
                fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.3"/>
              <polygon points="100,20 145,60 145,120 100,155 55,120 55,60"
                fill="none" stroke="#00ff88" strokeWidth="1.5"/>
              <polygon points="100,20 145,60 100,80"
                fill="rgba(0,255,136,0.05)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="100,20 55,60 100,80"
                fill="rgba(0,255,136,0.08)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="145,60 145,120 100,80"
                fill="rgba(0,255,136,0.04)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="55,60 55,120 100,80"
                fill="rgba(0,255,136,0.07)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="100,155 145,120 100,120"
                fill="rgba(0,255,136,0.06)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="100,155 55,120 100,120"
                fill="rgba(0,255,136,0.09)" stroke="#00ff88" strokeWidth="1"/>
              <circle cx="100" cy="88" r="6" fill="#00ff88" opacity="0.9"/>
              <circle cx="100" cy="88" r="12"
                fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.4"/>
            </svg>
          </motion.div>

          {/* Current Task Card */}
          <motion.div
            className={styles.currentTaskCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className={styles.currentTaskLabel}>Current Task</p>
            <h2 className={styles.currentTaskTitle}>Design landing page</h2>
            <div className={styles.taskProgress}>
              <motion.div
                className={styles.taskProgressBar}
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
            <p className={styles.taskProgressLabel}>45% complete</p>
            <GlowButton size="lg" onClick={() => {}}>
              Start Focus Session
            </GlowButton>
          </motion.div>

        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={styles.rightPanel}>

          {/* Energy Battery */}
          <motion.div
            className={styles.energyCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.energyHeader}>
              <span className={styles.cardTitle}>Energy Battery</span>
              <span>⚡</span>
            </div>
            <div className={styles.energyBarWrapper}>
              <motion.div
                className={styles.energyBar}
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className={styles.energyLabels}>
              <span>Low</span>
              <span>75%</span>
              <span>Full</span>
            </div>
            <div className={styles.energyBtns}>
              <GlowButton size="sm" variant="outline">Low Energy Mode</GlowButton>
            </div>
          </motion.div>

          {/* Path of Light */}
          <motion.div
            className={styles.pathCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.cardTitle}>Path of Light</h3>
            <div className={styles.pathItems}>
              {[
                { label: 'Starting time', value: '9:00 AM', active: false },
                { label: 'Focus session', value: '27 min', active: true },
                { label: 'Break taken', value: '5 min', active: false },
                { label: 'Concentrating', value: '50 min', active: false },
              ].map((item, i) => (
                <div key={i} className={styles.pathItem}>
                  <span className={`${styles.pathDot} ${item.active ? styles.pathDotActive : ''}`}></span>
                  <span className={styles.pathLabel}>{item.label}</span>
                  <span className={styles.pathValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <GlowButton size="md" onClick={() => {}}>Done</GlowButton>
          </motion.div>

        </div>
      </div>
    </main>
  );
}