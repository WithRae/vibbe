'use client';

import { useAuth } from '@/hooks/useAuth';
import { HttpError } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ToastContainer, useToast } from '@/components/ui/Notification';
import styles from './register.module.css';

export default function RegisterPage() {
  const { register, verifyOtp, resendOtp } = useAuth();
  const toast = useToast();

  // ── Step ────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // ── Form state ───────────────────────────────────────────────────────────
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [agree,     setAgree]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── OTP state ────────────────────────────────────────────────────────────
  const [otp,         setOtp]         = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown,   setCountdown]   = useState(60);
  const [canResend,   setCanResend]   = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown when OTP step mounts ──────────────────────────────────────
  useEffect(() => {
    if (step !== 'otp') return;

    setCountdown(60);
    setCanResend(false);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // ── Register submit ──────────────────────────────────────────────────────
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
      await register({ name, email, password, password_confirmation: confirm });
      toast.success('OTP Sent', 'Check your email for the verification code.');
      setStep('otp');
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } catch (err) {
      if (err instanceof HttpError) {
        const firstFieldError = err.response?.errors
          ? (Object.values(err.response.errors).flat()[0] as string)
          : null;
        toast.error('Registration Failed', firstFieldError ?? err.message);
      } else {
        toast.error('Network Error', 'Could not reach the server. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handlers ───────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      toast.warning('Incomplete', 'Please enter all 6 digits.');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtp({ email, otp: code });
      // verifyOtp in AuthContext handles redirect to /login
      toast.success('Verified!', 'Your account is ready. Please log in.');
    } catch (err) {
      if (err instanceof HttpError) {
        toast.error('Verification Failed', err.message);
      } else {
        toast.error('Network Error', 'Could not reach the server.');
      }
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      await resendOtp({ email });
      toast.success('OTP Resent', 'A new code has been sent to your email.');
      setOtp(['', '', '', '', '', '']);
      setCanResend(false);
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);

      inputRefs.current[0]?.focus();
    } catch (err) {
      if (err instanceof HttpError) {
        toast.error('Failed', err.message);
      } else {
        toast.error('Network Error', 'Could not reach the server.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className={styles.main}>
      <ToastContainer />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <AnimatePresence mode="wait">

        {/* ── REGISTER FORM ── */}
        {step === 'form' && (
          <motion.div
            key="form"
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
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
                <input id="name" type="text" className={styles.input}
                  placeholder="Your name" value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name" required />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input id="email" type="email" className={styles.input}
                  placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email" required />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <input id="password" type="password" className={styles.input}
                  placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password" required />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="confirm">Confirm Password</label>
                <input id="confirm" type="password" className={styles.input}
                  placeholder="••••••••" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password" required />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxWrapper}>
                  <input type="checkbox" checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className={styles.checkbox} />
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
        )}

        {/* ── OTP STEP ── */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◈</span>
              <span className={styles.logoText}>VIBBE</span>
            </div>

            <h1 className={styles.title}>Verify Email</h1>
            <p className={styles.subtitle}>
              We sent a 6-digit code to<br />
              <strong style={{ color: '#00ff88' }}>{email}</strong>
            </p>

            {/* 6-digit OTP boxes */}
            <div className={styles.otpRow} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`${styles.otpBox} ${digit ? styles.otpBoxFilled : ''}`}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <motion.button
              type="button"
              className={styles.registerBtn}
              onClick={handleVerify}
              disabled={isVerifying}
              whileHover={{ scale: isVerifying ? 1 : 1.02 }}
              whileTap={{ scale: isVerifying ? 1 : 0.98 }}
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </motion.button>

            {/* Resend row */}
            <p className={styles.resendRow}>
              {canResend ? (
                <button
                  className={styles.resendBtn}
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <span className={styles.resendTimer}>
                  Resend code in{' '}
                  <strong style={{ color: '#00ff88' }}>{countdown}s</strong>
                </span>
              )}
            </p>

            <p className={styles.loginText}>
              Wrong email?{' '}
              <button
                className={styles.loginLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => setStep('form')}
              >
                Go back
              </button>
            </p>
          </motion.div>
        )}

      </AnimatePresence>

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