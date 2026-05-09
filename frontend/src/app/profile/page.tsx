'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import AppNavbar from '@/components/shared/AppNavbar';
import ProfileDropdown from '@/components/shared/ProfileDropdown';
import GlowButton from '@/components/ui/GlowButton';
import { ToastContainer, useToast } from '@/components/ui/Notification';

import { HttpError } from '@/lib/api';
import { profileService } from '@/lib/profile';
import { authService } from '@/lib/auth';

import type { ChangePasswordPayload, ProfileResponse } from '@/types/auth';

import styles from './profile.module.css';

type Tab = 'profile' | 'security' | 'activity';

export default function ProfilePage() {
  const toast = useToast();

  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const data = await profileService.getProfile();
      setProfileData(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!currentPassword || !password || !passwordConfirmation) {
      toast.warning('Incomplete', 'Please fill all password fields.');
      return;
    }

    if (password !== passwordConfirmation) {
      toast.warning('Mismatch', 'Passwords do not match.');
      return;
    }

    setIsSaving(true);

    try {
      const payload: ChangePasswordPayload = {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      };

      await authService.changePassword(payload);
      toast.success('Updated', 'Password updated successfully.');
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      if (err instanceof HttpError) {
        toast.error('Failed', err.message);
      } else {
        toast.error('Error', 'Something went wrong.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <main className={styles.loading}>Loading profile...</main>;
  }

  const profile = profileData?.profile;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Security' },
    { key: 'activity', label: 'Activity' },
  ];

  return (
    <main className={styles.main}>
      <ToastContainer />

      <AppNavbar activePage="profile" rightContent={<ProfileDropdown />} />

      <div className={styles.page}>

        {/* ── HERO ── */}
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className={styles.heroCover} />

          <div className={styles.heroBody}>
            <div className={styles.heroAvatar}>
              <img
                src={profile?.avatar ? `/avatars/${profile.avatar}.jpg` : '/avatars/avatar-1.jpg'}
                alt="Avatar"
                className={styles.heroAvatarImg}
              />
            </div>

            <div className={styles.heroInfo}>
              <p className={styles.heroName}>
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className={styles.heroHandle}>@{profile?.username}</p>
              <div className={styles.heroMetaInline}>
                <span>Joined <strong>{new Date(profileData?.created_at ?? '').toLocaleDateString()}</strong></span>
                <span>DOB <strong>{profile?.dob}</strong></span>
                <span>Gender <strong>{profile?.gender}</strong></span>
              </div>
            </div>

            <div className={styles.heroBadge}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" fill="#00ff88" />
              </svg>
              Active
            </div>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PROFILE PANEL ── */}
        {activeTab === 'profile' && (
          <motion.div
            className={styles.contentGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.card}>
              <p className={styles.cardLabel}>Account Info</p>
              <div className={styles.metaGrid}>
                <div className={`${styles.metaTile} ${styles.metaTileFull}`}>
                  <p className={styles.tileLabel}>Email</p>
                  <p className={styles.tileValue}>{profileData?.email}</p>
                </div>
                <div className={styles.metaTile}>
                  <p className={styles.tileLabel}>Username</p>
                  <p className={styles.tileValue}>@{profile?.username}</p>
                </div>
                <div className={styles.metaTile}>
                  <p className={styles.tileLabel}>Gender</p>
                  <p className={styles.tileValue}>{profile?.gender}</p>
                </div>
                <div className={styles.metaTile}>
                  <p className={styles.tileLabel}>Date of Birth</p>
                  <p className={styles.tileValue}>{profile?.dob}</p>
                </div>
                <div className={styles.metaTile}>
                  <p className={styles.tileLabel}>Member Since</p>
                  <p className={styles.tileValue}>
                    {new Date(profileData?.created_at ?? '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <p className={styles.cardLabel}>Overview</p>

              <div className={styles.statRow}>
                <div className={styles.statTile}>
                  <p className={styles.statVal}>42</p>
                  <p className={styles.statLabel}>Sessions</p>
                </div>
                <div className={styles.statTile}>
                  <p className={styles.statVal}>18h</p>
                  <p className={styles.statLabel}>Focus Time</p>
                </div>
                <div className={styles.statTile}>
                  <p className={styles.statVal}>94%</p>
                  <p className={styles.statLabel}>Consistency</p>
                </div>
              </div>

              <div className={styles.divider} />
              <p className={styles.sectionTitle}>Recent Activity</p>

              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <span className={styles.activityName}>Deep Focus Session</span>
                  <span className={styles.activityMeta}>2h 15m</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.activityName}>Weekly Summary</span>
                  <span className={styles.activityMeta}>Reviewed</span>
                </div>
                <div className={styles.activityItem}>
                  <span className={styles.activityName}>Goal Completed</span>
                  <span className={styles.activityDone}>✓ Done</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SECURITY PANEL ── */}
        {activeTab === 'security' && (
          <motion.div
            className={styles.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className={styles.cardLabel}>Change Password</p>

            <form onSubmit={handlePasswordUpdate}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Current Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>New Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Confirm Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formFooter}>
                <span className={styles.formHint}>
                  Use 8+ characters, a mix of letters and numbers.
                </span>
                <GlowButton size="lg" disabled={isSaving}>
                  {isSaving ? 'Updating...' : 'Update Password'}
                </GlowButton>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── ACTIVITY PANEL ── */}
        {activeTab === 'activity' && (
          <motion.div
            className={styles.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className={styles.cardLabel}>Activity Log</p>
            <p className={styles.emptyHint}>No recent activity to display.</p>
          </motion.div>
        )}

      </div>
    </main>
  );
}