'use client';

import { motion } from 'framer-motion';
import styles from './NeonCard.module.css';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export default function NeonCard({
  children,
  className = '',
  glow = false,
  onClick,
}: NeonCardProps) {
  return (
    <motion.div
      className={`${styles.card} ${glow ? styles.glow : ''} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}