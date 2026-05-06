'use client';

import { useAuth } from '@/hooks/useAuth';
import { HttpError } from '@/lib/api';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ToastContainer, useToast } from '@/components/ui/Notification';
import styles from './register.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast         = useToast();

  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [agree,     setAgree]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      toast.warning('Hold On', 'You must agree to the Terms & Conditions.');
      return;
    }

    if (password !== confirm) {
      toast.error('Password Mismatch', 'Your passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirm,
      });
      // Redirect is handled by AuthContext
    } catch (err) {
      if (err instanceof HttpError) {
        // Surface first field-level error if available
        const firstFieldError = err.errors
          ? Object.values(err.errors).flat()[0]
          : null;
        toast.error('Registration Failed', firstFieldError ?? err.message);
      } else {
        toast.error('Network Error', 'Could not reach the server. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <ToastContainer />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>VIBBE</span>
        </div>

        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Start your focus journey today</p>

        <form className={styles.form} onSubmit={handleRegister} noValidate>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className={styles.checkbox}
              />
              <span>
                I agree to the{' '}
                <a href="/terms" className={styles.link}>Terms &amp; Conditions</a>
              </span>
            </label>
          </div>

          <motion.button
            type="submit"
            className={styles.registerBtn}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <motion.button
            type="button"
            className={styles.googleBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>G</span>
            Continue with Google
          </motion.button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{' '}
          <a href="/login" className={styles.loginLink}>Sign in</a>
        </p>
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
          <circle cx="100" cy="88" r="6" fill="#00ff88" opacity="0.9"/>
          <circle cx="100" cy="88" r="12"
            fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.4"/>
        </svg>
      </motion.div>
    </main>
  );
}