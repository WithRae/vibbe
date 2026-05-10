'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import styles from './ProfileDropdown.module.css';

export default function ProfileDropdown() {
  const router = useRouter();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
  }

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        className={styles.profileBtn}
        onClick={() => setOpen(prev => !prev)}
      >
        <span>👤</span>
        <span>Profile</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <button
                className={styles.item}
                onClick={() => {
                    setOpen(false);
                    router.push('/profile');
                }}
                >
                <span className={styles.itemIcon}>👤</span>
                <span>Profile</span>
            </button>

            <button
                className={`${styles.item} ${styles.logout}`}
                onClick={handleLogout}
                >
                <span className={styles.itemIcon}>⇥</span>
                <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}