'use client';

import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardGrid({
  children,
  className = '',
}: DashboardGridProps) {
  return (
    <div className={`${styles.grid} ${className}`}>
      {children}
    </div>
  );
}