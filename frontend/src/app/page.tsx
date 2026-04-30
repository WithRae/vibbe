'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';

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
          <a href="/"><button className={`${styles.navTab} ${styles.active}`}>Home</button></a>
          <a href="/dashboard"><button className={styles.navTab}>Dashboard</button></a>
          <a href="/analytics"><button className={styles.navTab}>Summary</button></a>
        </div>
        <div className={styles.navRight}>
          <a href="/login">
            <button className={styles.loginNavBtn}>Sign In</button>
          </a>
          <a href="/register">
            <button className={styles.registerNavBtn}>Get Started</button>
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className={styles.hero}>
        <div className={styles.bgGlow1}></div>
        <div className={styles.bgGlow2}></div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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

          <h1 className={styles.heroTitle}>Welcome to VIBBE</h1>
          <p className={styles.heroSubtitle}>
            Low-Friction Productivity for ADHD & Functional Depression
          </p>
          <p className={styles.heroDesc}>
            VIBBE is not a normal task manager. It is built around your brain —
            helping you escape task paralysis, recover without guilt, and stay
            visually anchored to what matters most.
          </p>

          <div className={styles.heroBtns}>
            <a href="/register">
              <motion.button
                className={styles.heroBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
              </motion.button>
            </a>
            <a href="/dashboard">
              <motion.button
                className={styles.heroBtnOutline}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Dashboard
              </motion.button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className={styles.about}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>What is VIBBE?</h2>
          <p className={styles.sectionSubtitle}>
            A productivity system designed around three core psychological principles
          </p>
        </motion.div>

        <div className={styles.aboutGrid}>
          {[
            {
              icon: '🧠',
              title: 'Executive Support',
              desc: 'VIBBE helps you escape task paralysis with single-task focus mode. Only one task visible at a time — no overwhelm, no chaos.',
            },
            {
              icon: '🪙',
              title: 'Guilt-Free Resilience',
              desc: 'Bad days happen. Mercy Tokens let you recover without breaking your streak. Progress is never punished.',
            },
            {
              icon: '⚡',
              title: 'Visual Anchoring',
              desc: 'High-contrast neon visuals keep ADHD brains engaged and focused. The Sentinel Avatar evolves as you complete tasks.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.aboutCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div className={styles.aboutIcon}>{item.icon}</div>
              <h3 className={styles.aboutTitle}>{item.title}</h3>
              <p className={styles.aboutDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className={styles.features}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>Core Features</h2>
          <p className={styles.sectionSubtitle}>Everything you need, nothing you don't</p>
        </motion.div>

        <div className={styles.featuresGrid}>
          {[
            { icon: '🎯', title: 'Single Task Focus', desc: 'One task at a time. Full presence.' },
            { icon: '⚡', title: 'Task Shatter', desc: 'Break big tasks into tiny micro-tasks.' },
            { icon: '⏱', title: 'Focus Timer', desc: 'Animated ring timer with visual progress.' },
            { icon: '🪙', title: 'Mercy Tokens', desc: 'Recover days without breaking streaks.' },
            { icon: '🔋', title: 'Energy Battery', desc: 'Track your energy level daily.' },
            { icon: '✨', title: 'Path of Light', desc: 'Non-linear productivity timeline.' },
            { icon: '🏆', title: 'XP System', desc: 'Gamified progress and level ups.' },
            { icon: '🌙', title: 'Low Energy Mode', desc: 'Simplified UI for depression days.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.featureCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.featureIcon}>{item.icon}</div>
              <h4 className={styles.featureTitle}>{item.title}</h4>
              <p className={styles.featureDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>Ready to Focus?</h2>
          <p className={styles.ctaSubtitle}>
            Join VIBBE and start your productivity journey today
          </p>
          <a href="/register">
            <motion.button
              className={styles.heroBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </a>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>VIBBE</span>
        </div>
        <p className={styles.footerText}>
          Built for ADHD & Functional Depression. Focus. Flow. Rise.
        </p>
      </footer>

    </main>
  );
}