'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';
import GlowButton from '@/components/ui/GlowButton';

export default function HomePage() {
  return (
    <main className={styles.main}>

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}>◈</div>
          <span className={styles.logoText}>VIBBE</span>
        </div>
        <div className={styles.navTabs}>
          <button className={`${styles.navTab} ${styles.active}`}>Home</button>
          <button className={styles.navTab}>Summary</button>
        </div>
        <div className={styles.navRight}>
          <div className={styles.profileBtn}>
            <span>👤</span>
            <span>Mash Profit.</span>
            <span>▾</span>
          </div>
          <div className={styles.notifBtn}>🔔</div>
        </div>
      </nav>

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/* ── LEFT PANEL ── */}
        <div className={styles.leftPanel}>

          {/* Mercy Token Card */}
          <motion.div
            className={styles.mercyCard}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.mercyTop}>
              <span className={styles.mercyTitle}>Mercy Token</span>
              <span className={styles.mercyCount}>0 con token</span>
            </div>
            <div className={styles.mercyBottom}>
              <span className={styles.mercyNumber}>0</span>
              <div className={styles.tokenIcons}>
                <span className={styles.tokenIcon}>🪙</span>
                <span className={styles.tokenIcon}>🪙</span>
              </div>
            </div>
          </motion.div>

          {/* Task List */}
          <motion.div
            className={styles.taskCard}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.taskHeader}>
              <span className={styles.taskTitle}>Start Ring list</span>
            </div>
            <div className={styles.taskItem}>
              <div className={styles.taskBar}></div>
              <button className={styles.taskMenu}>⋮</button>
            </div>
            <div className={styles.taskNav}>
              <button className={styles.taskNavBtn}>‹</button>
              <button className={`${styles.taskNavBtn} ${styles.taskNavActive}`}>›</button>
            </div>
            <div className={styles.taskActions}>
              <button className={styles.addTaskBtn}>+</button>
              <button className={styles.addTaskBtn}>+</button>
              <button className={styles.moreBtn}>•••</button>
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

          {/* Heading */}
          <motion.div
            className={styles.centerHeading}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.focusTitle}>single-task focus</h1>
            <p className={styles.focusSubtitle}>users ADHD + chronic depression</p>
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
            <svg
              viewBox="0 0 200 200"
              className={styles.avatarSvg}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer ring */}
              <ellipse cx="100" cy="160" rx="70" ry="12"
                fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
              <ellipse cx="100" cy="160" rx="50" ry="8"
                fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.3"/>

              {/* Icosahedron shape */}
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
              <polygon points="145,60 100,80 100,120 145,120"
                fill="rgba(0,255,136,0.03)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="55,60 100,80 100,120 55,120"
                fill="rgba(0,255,136,0.06)" stroke="#00ff88" strokeWidth="1"/>

              {/* Center glow */}
              <circle cx="100" cy="88" r="6"
                fill="#00ff88" opacity="0.9"/>
              <circle cx="100" cy="88" r="12"
                fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.4"/>
            </svg>
          </motion.div>

          {/* Sentinel Card */}
          <motion.div
            className={styles.sentinelCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className={styles.sentinelTitle}>Sentinel</h2>
            <p className={styles.sentinelSubtitle}>Floating 3D amat geometrics avatar</p>
            <GlowButton size="lg" onClick={() => {}}>
              Start now
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
              <span className={styles.energyTitle}>Energy Battery</span>
              <span className={styles.energyIcon}>⚡</span>
            </div>
            <div className={styles.energyBarWrapper}>
              <motion.div
                className={styles.energyBar}
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Decorative vines */}
          <div className={styles.vinesWrapper}>
            <svg viewBox="0 0 300 300" className={styles.vinesSvg}>
              <path d="M150,50 Q200,100 150,150 Q100,200 150,250"
                fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.3"/>
              <path d="M150,80 Q180,110 160,140"
                fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.2"/>
              <path d="M150,130 Q120,160 140,190"
                fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.2"/>
              <circle cx="150" cy="50" r="3" fill="#00ff88" opacity="0.5"/>
              <circle cx="150" cy="150" r="3" fill="#00ff88" opacity="0.5"/>
              <circle cx="150" cy="250" r="3" fill="#00ff88" opacity="0.4"/>
            </svg>
          </div>

          {/* Path of Light */}
          <motion.div
            className={styles.pathCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.pathTitle}>Path of Light</h3>
            <div className={styles.pathItems}>
              <div className={styles.pathItem}>
                <span className={styles.pathDot}></span>
                <span className={styles.pathLabel}>Starting time</span>
                <span className={styles.pathValue}>00 AM</span>
              </div>
              <div className={styles.pathItem}>
                <span className={`${styles.pathDot} ${styles.pathDotActive}`}></span>
                <span className={styles.pathLabel}>Path of Light</span>
                <span className={styles.pathValue}>27 min</span>
              </div>
              <div className={styles.pathItem}>
                <span className={styles.pathDot}></span>
                <span className={styles.pathLabel}>Concentrating litation</span>
                <span className={styles.pathValue}>50 min</span>
              </div>
            </div>
            <GlowButton size="md" onClick={() => {}}>
              Done
            </GlowButton>
          </motion.div>

        </div>
      </div>
    </main>
  );
}