'use client';

import { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { HttpError } from '@/lib/api';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, useToast } from '@/components/ui/Notification';
import styles from './login.module.css';

function LoginContent() {
  const { login } = useAuth();
  const toast = useToast();
  const params = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning('Missing Fields', 'Email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });

      const redirect = params.get('redirect');

      if (redirect) {
        window.location.href = redirect;
      }
    } catch (err) {
      if (err instanceof HttpError) {
        toast.error('Login Failed', err.message);
      } else {
        toast.error('Network Error', 'Unable to connect to server.');
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

        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to continue your focus journey
        </p>

        <form className={styles.form} onSubmit={handleLogin} noValidate>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className={styles.forgotRow}>
            <a href="#" className={styles.forgotLink}>
              Forgot password?
            </a>
          </div>

          <motion.button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
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

        <p className={styles.registerText}>
          Don&apos;t have an account?{' '}
          <a href="/register" className={styles.registerLink}>
            Create one
          </a>
        </p>
      </motion.div>

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
          <ellipse
            cx="100"
            cy="160"
            rx="70"
            ry="12"
            fill="none"
            stroke="#00ff88"
            strokeWidth="1"
            opacity="0.4"
          />

          <polygon
            points="100,20 145,60 145,120 100,155 55,120 55,60"
            fill="none"
            stroke="#00ff88"
            strokeWidth="1.5"
          />

          <polygon
            points="100,20 145,60 100,80"
            fill="rgba(0,255,136,0.05)"
            stroke="#00ff88"
            strokeWidth="1"
          />

          <polygon
            points="100,20 55,60 100,80"
            fill="rgba(0,255,136,0.08)"
            stroke="#00ff88"
            strokeWidth="1"
          />

          <polygon
            points="145,60 145,120 100,80"
            fill="rgba(0,255,136,0.04)"
            stroke="#00ff88"
            strokeWidth="1"
          />

          <polygon
            points="55,60 55,120 100,80"
            fill="rgba(0,255,136,0.07)"
            stroke="#00ff88"
            strokeWidth="1"
          />

          <circle cx="100" cy="88" r="6" fill="#00ff88" opacity="0.9" />

          <circle
            cx="100"
            cy="88"
            r="12"
            fill="none"
            stroke="#00ff88"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </svg>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}