'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { HttpError } from '@/lib/api';
import { motion } from 'framer-motion';
import { ToastContainer, useToast } from '@/components/ui/Notification';
import type { SetupProfilePayload } from '@/types/auth';
import styles from './setup.module.css';

// ── Predefined avatars ───────────────────────────────────────────────────────
// Place these WebP files in your /public/avatars/ folder on the server.
const AVATARS = [
  { id: 'avatar-1', src: '/avatars/avatar-1.jpg', alt: 'Avatar 1 — Neon Warrior' },
  { id: 'avatar-2', src: '/avatars/avatar-2.jpg', alt: 'Avatar 2 — Cyber Ghost' },
  { id: 'avatar-3', src: '/avatars/avatar-3.jpg', alt: 'Avatar 3 — Solar Drift' },
  { id: 'avatar-4', src: '/avatars/avatar-4.jpg', alt: 'Avatar 4 — Void Runner' },
  { id: 'avatar-5', src: '/avatars/avatar-5.jpg', alt: 'Avatar 5 — Pulse Core' },
  { id: 'avatar-6', src: '/avatars/avatar-6.jpg', alt: 'Avatar 6 — Phantom Arc' },
];

const GENDERS = ['Male', 'Female', 'Other'] as const;

export default function ProfileSetupPage() {
  const { setupProfile } = useAuth();
  const toast = useToast();

  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [username,   setUsername]   = useState('');
  const [dob,        setDob]        = useState('');
  const [gender,     setGender]     = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [avatar,     setAvatar]     = useState<string | null>(null);
  const [isLoading,  setIsLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !dob || !gender) {
      toast.warning('Incomplete', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: SetupProfilePayload = {
        first_name: firstName,
        last_name:  lastName,
        username,
        dob,
        gender: gender as 'Male' | 'Female' | 'Other',
        avatar: avatar ?? null,
      };

      await setupProfile(payload);
      // AuthContext handles redirect to /dashboard
    } catch (err) {
      if (err instanceof HttpError) {
        const firstFieldError = err.response?.errors
          ? (Object.values(err.response.errors).flat()[0] as string)
          : null;
        toast.error('Setup Failed', firstFieldError ?? err.message);
      } else {
        toast.error('Network Error', 'Could not reach the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <ToastContainer />
      <div className={styles.bgGlow} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>VIBBE</span>
        </div>

        <h1 className={styles.title}>Set Up Your Profile</h1>
        <p className={styles.subtitle}>Tell us a bit about yourself before you dive in</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* ── Avatar Picker ── */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Choose Your Avatar</p>
            <div className={styles.avatarGrid}>
              {AVATARS.map(av => (
                <motion.button
                  key={av.id}
                  type="button"
                  className={`${styles.avatarOption} ${avatar === av.id ? styles.avatarSelected : ''}`}
                  onClick={() => setAvatar(av.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={av.src}
                    alt={av.alt}
                    className={styles.avatarImg}
                  />
                  {avatar === av.id && (
                    <div className={styles.avatarCheck}>✓</div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Name Row ── */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                className={styles.input}
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                className={styles.input}
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ── Username ── */}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Username</label>
            <div className={styles.inputPrefix}>
              <span className={styles.prefix}>@</span>
              <input
                id="username"
                type="text"
                className={`${styles.input} ${styles.inputWithPrefix}`}
                placeholder="your_username"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                required
              />
            </div>
          </div>

          {/* ── DOB ── */}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              className={`${styles.input} ${styles.dateInput}`}
              value={dob}
              onChange={e => setDob(e.target.value)}
              required
            />
          </div>

          {/* ── Gender ── */}
          <div className={styles.inputGroup}>
            <p className={styles.label}>Gender</p>
            <div className={styles.genderRow}>
              {GENDERS.map(g => (
                <button
                  key={g}
                  type="button"
                  className={`${styles.genderBtn} ${gender === g ? styles.genderBtnActive : ''}`}
                  onClick={() => setGender(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Saving...' : 'Complete Setup →'}
          </motion.button>

        </form>
      </motion.div>
    </main>
  );
}