'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TaskShatter.module.css';
import { taskService } from '@/lib/tasks';
import type { Task, MicroTask } from '@/types/task';

interface TaskShatterProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: (task: Task) => void;
}

export default function TaskShatter({
  task,
  onClose,
  onTaskUpdated,
}: TaskShatterProps) {
  const [newMicroTask, setNewMicroTask] = useState('');
  const [isShattered, setIsShattered] = useState(task.microtasks.length > 0);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const completedCount = task.microtasks.filter(mt => mt.completed).length;
  const totalCount = task.microtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddMicroTask = async () => {
    const title = newMicroTask.trim();
    if (!title || loading) return;

    setLoading(true);
    try {
      const microtask = await taskService.createMicroTask(task.id, title);
      onTaskUpdated({
        ...task,
        microtasks: [...task.microtasks, microtask],
      });
      setNewMicroTask('');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMicroTask = async (microtask: MicroTask) => {
    if (togglingId === microtask.id) return;
    setTogglingId(microtask.id);
    try {
      const result = await taskService.toggleMicroTask(task.id, microtask.id);
      const updatedMicrotasks = task.microtasks.map(mt =>
        mt.id === microtask.id ? result.microtask : mt
      );
      onTaskUpdated({
        ...task,
        completed: result.task_completed ? true : task.completed,
        microtasks: updatedMicrotasks,
      });
    } catch {
      // silently fail — UI stays unchanged
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteMicroTask = async (microtask: MicroTask) => {
    try {
      await taskService.deleteMicroTask(task.id, microtask.id);
      onTaskUpdated({
        ...task,
        microtasks: task.microtasks.filter(mt => mt.id !== microtask.id),
      });
    } catch {
      // silently fail
    }
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 40 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.shatterIcon}>⚡</span>
            <h2 className={styles.title}>Task Shatter</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Task Title */}
        <div className={styles.taskTitle}>
          <h3 className={styles.taskName}>{task.title}</h3>
          <p className={styles.taskHint}>Break this into smaller pieces</p>
        </div>

        {/* Shatter Button or Content */}
        {!isShattered ? (
          <motion.button
            className={styles.shatterBtn}
            onClick={() => setIsShattered(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.shatterBtnIcon}>⚡</span>
            Shatter This Task
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress */}
            {totalCount > 0 && (
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={styles.progressValue}>
                    {completedCount}/{totalCount} done
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <motion.div
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Micro Tasks List */}
            <div className={styles.microTaskList}>
              <AnimatePresence>
                {task.microtasks.map((mt, index) => (
                  <motion.div
                    key={mt.id}
                    className={`${styles.microTask} ${mt.completed ? styles.microTaskDone : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      className={`
                        ${styles.microCheck}
                        ${mt.completed ? styles.microCheckDone : ''}
                        ${togglingId === mt.id ? styles.microCheckLoading : ''}
                      `}
                      onClick={() => handleToggleMicroTask(mt)}
                      disabled={togglingId === mt.id}
                    >
                      {togglingId === mt.id ? '◌' : mt.completed ? '✓' : ''}
                    </button>
                    <span className={styles.microTitle}>{mt.title}</span>
                    <span className={styles.microXp}>+{mt.xp_reward} XP</span>
                    <button
                      className={styles.microDelete}
                      onClick={() => handleDeleteMicroTask(mt)}
                      disabled={togglingId === mt.id}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {task.microtasks.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No micro-tasks yet. Add your first one below!</p>
                </div>
              )}
            </div>

            {/* Add Micro Task */}
            <div className={styles.addMicroTask}>
              <input
                type="text"
                className={styles.microInput}
                placeholder="Add a micro-task..."
                value={newMicroTask}
                onChange={(e) => setNewMicroTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMicroTask()}
                disabled={loading}
              />
              <motion.button
                className={styles.addBtn}
                onClick={handleAddMicroTask}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? '...' : '+'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}