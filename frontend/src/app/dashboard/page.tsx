"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./dashboard.module.css";
import GlowButton from "@/components/ui/GlowButton";
import TaskShatter from "@/components/tasks/TaskShatter";
import AppNavbar from "@/components/shared/AppNavbar";
import ProfileDropdown from "@/components/shared/ProfileDropdown";
import MercyCard from "@/components/dashboard/MercyCard";
import { ToastContainer, useToast } from "@/components/ui/Notification";
import { profileService } from "@/lib/profile";
import { taskService } from "@/lib/tasks";
import type { StreakData } from "@/types/auth";
import type { Task } from "@/types/task";

export default function DashboardPage() {
  const toast = useToast();

  const [streak, setStreak] = useState<StreakData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shatterTask, setShatterTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);

  // Fetch profile + tasks on mount
  useEffect(() => {
    profileService.getProfile().then((data) => {
      if (data?.streak) setStreak(data.streak);
    });

    taskService.getTasks()
      .then(setTasks)
      .finally(() => setTasksLoading(false));
  }, []);

  // Show milestone toast if stored after login
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('vibbe_milestone');
      if (raw) {
        sessionStorage.removeItem('vibbe_milestone');
        const milestone = JSON.parse(raw);
        toast.success(
          `🏆 ${milestone.days}-Day Streak!`,
          `You hit a milestone! +${milestone.xp_bonus} XP bonus earned.`,
          6000,
        );
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleStreakRestored = (updatedStreak: StreakData) => {
    setStreak(updatedStreak);
    toast.success('Streak Restored!', 'Your mercy token was applied successfully.');
  };

  const handleAddTask = async () => {
    const title = newTaskTitle.trim();
    if (!title || addingTask) return;

    setAddingTask(true);
    try {
      const task = await taskService.createTask(title);
      setTasks(prev => [...prev, task]);
      setNewTaskTitle('');
      setShowAddInput(false);
    } catch {
      toast.error('Error', 'Failed to add task. Please try again.');
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updated = await taskService.toggleTask(task.id);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch {
      toast.error('Error', 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await taskService.deleteTask(task.id);
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } catch {
      toast.error('Error', 'Failed to delete task.');
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setShatterTask(updatedTask);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const currentTask = activeTasks[0] ?? null;

  const currentTaskProgress = currentTask
    ? currentTask.microtasks.length > 0
      ? Math.round(
          (currentTask.microtasks.filter(mt => mt.completed).length /
            currentTask.microtasks.length) *
            100
        )
      : 0
    : 0;

  return (
    <main className={styles.main}>
      <ToastContainer />

      {/* ── NAVBAR ── */}
      <AppNavbar
        activePage="dashboard"
        rightContent={
          <>
            <div className={styles.xpBadge}>
              <span className={styles.xpIcon}>⚡</span>
              <span className={styles.xpText}>Level 3</span>
              <div className={styles.xpBarWrapper}>
                <motion.div
                  className={styles.xpBar}
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <ProfileDropdown />
          </>
        }
      />

      {/* ── DASHBOARD GRID ── */}
      <div className={styles.grid}>

        {/* ── LEFT PANEL ── */}
        <div className={styles.leftPanel}>

          <MercyCard streak={streak} onStreakRestored={handleStreakRestored} />

          {/* Task List */}
          <motion.div
            className={styles.taskCard}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.taskHeader}>
              <span className={styles.cardTitle}>Tasks</span>
              <GlowButton
                size="sm"
                variant="outline"
                onClick={() => setShowAddInput(prev => !prev)}
              >
                + Add
              </GlowButton>
            </div>

            {/* Inline Add Input */}
            <AnimatePresence>
              {showAddInput && (
                <motion.div
                  className={styles.addTaskRow}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    autoFocus
                    type="text"
                    className={styles.addTaskInput}
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask();
                      if (e.key === 'Escape') setShowAddInput(false);
                    }}
                    disabled={addingTask}
                  />
                  <button
                    className={styles.addTaskConfirm}
                    onClick={handleAddTask}
                    disabled={addingTask}
                  >
                    {addingTask ? '...' : '✓'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task List */}
            <div className={styles.taskList}>
              {tasksLoading ? (
                <p className={styles.taskEmpty}>Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <p className={styles.taskEmpty}>No tasks yet. Add one above!</p>
              ) : (
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      className={`${styles.taskItem} ${task.completed ? styles.taskItemDone : ''}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <button
                        className={`${styles.taskCheck} ${task.completed ? styles.taskCheckDone : ''}`}
                        onClick={() => handleToggleTask(task)}
                      >
                        {task.completed ? '✓' : ''}
                      </button>
                      <span className={styles.taskText}>{task.title}</span>
                      <button
                        className={styles.taskShatter}
                        onClick={() => setShatterTask(task)}
                      >
                        ⚡
                      </button>
                      <button
                        className={styles.taskDelete}
                        onClick={() => handleDeleteTask(task)}
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            className={styles.settingsBtn}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span>⚙</span>
            <span>Settings</span>
          </motion.div>
        </div>

        {/* ── CENTER PANEL ── */}
        <div className={styles.centerPanel}>
          <motion.div
            className={styles.centerHeading}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.focusTitle}>Single Task Focus</h1>
            <p className={styles.focusSubtitle}>One task at a time. Full presence.</p>
          </motion.div>

          {/* Sentinel Avatar */}
          <motion.div
            className={styles.avatarWrapper}
            animate={{
              y: [0, -15, 0],
              filter: [
                "drop-shadow(0 0 20px #00ff88)",
                "drop-shadow(0 0 40px #00ff88)",
                "drop-shadow(0 0 20px #00ff88)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 200 200" className={styles.avatarSvg}>
              <ellipse cx="100" cy="160" rx="70" ry="12" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
              <ellipse cx="100" cy="160" rx="50" ry="8" fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.3"/>
              <polygon points="100,20 145,60 145,120 100,155 55,120 55,60" fill="none" stroke="#00ff88" strokeWidth="1.5"/>
              <polygon points="100,20 145,60 100,80" fill="rgba(0,255,136,0.05)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="100,20 55,60 100,80" fill="rgba(0,255,136,0.08)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="145,60 145,120 100,80" fill="rgba(0,255,136,0.04)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="55,60 55,120 100,80" fill="rgba(0,255,136,0.07)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="100,155 145,120 100,120" fill="rgba(0,255,136,0.06)" stroke="#00ff88" strokeWidth="1"/>
              <polygon points="100,155 55,120 100,120" fill="rgba(0,255,136,0.09)" stroke="#00ff88" strokeWidth="1"/>
              <circle cx="100" cy="88" r="6" fill="#00ff88" opacity="0.9"/>
              <circle cx="100" cy="88" r="12" fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.4"/>
            </svg>
          </motion.div>

          {/* Current Task Card */}
          <motion.div
            className={styles.currentTaskCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className={styles.currentTaskLabel}>Current Task</p>
            {currentTask ? (
              <>
                <h2 className={styles.currentTaskTitle}>{currentTask.title}</h2>
                <div className={styles.taskProgress}>
                  <motion.div
                    className={styles.taskProgressBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentTaskProgress}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
                <p className={styles.taskProgressLabel}>{currentTaskProgress}% complete</p>
                <a href="/focus">
                  <GlowButton size="lg">Start Focus Session</GlowButton>
                </a>
              </>
            ) : (
              <p className={styles.taskEmpty}>All tasks complete! Add a new one.</p>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={styles.rightPanel}>
          {/* Energy Battery */}
          <motion.div
            className={styles.energyCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.energyHeader}>
              <span className={styles.cardTitle}>Energy Battery</span>
              <span>⚡</span>
            </div>
            <div className={styles.energyBarWrapper}>
              <motion.div
                className={styles.energyBar}
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className={styles.energyLabels}>
              <span>Low</span>
              <span>75%</span>
              <span>Full</span>
            </div>
            <div className={styles.energyBtns}>
              <GlowButton size="sm" variant="outline">Low Energy Mode</GlowButton>
            </div>
          </motion.div>

          {/* Path of Light */}
          <motion.div
            className={styles.pathCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.cardTitle}>Path of Light</h3>
            <div className={styles.pathItems}>
              {[
                { label: "Starting time", value: "9:00 AM", active: false },
                { label: "Focus session", value: "27 min", active: true },
                { label: "Break taken", value: "5 min", active: false },
                { label: "Concentrating", value: "50 min", active: false },
              ].map((item, i) => (
                <div key={i} className={styles.pathItem}>
                  <span className={`${styles.pathDot} ${item.active ? styles.pathDotActive : ""}`}></span>
                  <span className={styles.pathLabel}>{item.label}</span>
                  <span className={styles.pathValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <GlowButton size="md" onClick={() => {}}>Done</GlowButton>
          </motion.div>
        </div>
      </div>

      {/* ── TASK SHATTER MODAL ── */}
      <AnimatePresence>
        {shatterTask && (
          <TaskShatter
            task={shatterTask}
            onClose={() => setShatterTask(null)}
            onTaskUpdated={handleTaskUpdated}
          />
        )}
      </AnimatePresence>
    </main>
  );
}