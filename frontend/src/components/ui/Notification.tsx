"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type NotificationType = "success" | "error" | "warning";

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, 0 = persist until closed
  onClose?: () => void;
}

// ── Icon SVGs ────────────────────────────────────────────────────────────────

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M4 10.5L8 14.5L16 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M6 6L14 14M14 6L6 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 4L10 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="10" cy="14.5" r="1" fill="currentColor" />
  </svg>
);

// Diamond (VIBBE logo-inspired) wrapper for the icon
const DiamondIcon = ({ type }: { type: NotificationType }) => {
  const config = {
    success: { color: "#00e87a", glow: "#00e87a40", Icon: SuccessIcon },
    error: { color: "#ff4060", glow: "#ff406040", Icon: ErrorIcon },
    warning: { color: "#f5a623", glow: "#f5a62340", Icon: WarningIcon },
  }[type];

  return (
    <div style={{ position: "relative", flexShrink: 0, width: 44, height: 44 }}>
      {/* rotating diamond outline */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          border: `1.5px solid ${config.color}`,
          borderRadius: 4,
          opacity: 0.5,
          transform: "rotate(45deg)",
          transformOrigin: "center",
          boxShadow: `0 0 10px ${config.glow}`,
        }}
      />
      {/* static icon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.color,
          filter: `drop-shadow(0 0 6px ${config.color})`,
        }}
      >
        <config.Icon />
      </div>
    </div>
  );
};

// ── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({
  duration,
  type,
}: {
  duration: number;
  type: NotificationType;
}) => {
  const color = { success: "#00e87a", error: "#ff4060", warning: "#f5a623" }[
    type
  ];
  return (
    <motion.div
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      transition={{ duration: duration / 1000, ease: "linear" }}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: color,
        transformOrigin: "left",
        borderRadius: "0 0 12px 12px",
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
};

// ── Notification card ─────────────────────────────────────────────────────────

export const Notification = ({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  const borderColor = {
    success: "#00e87a33",
    error: "#ff406033",
    warning: "#f5a62333",
  }[type];

  const glowColor = {
    success: "#00e87a18",
    error: "#ff406018",
    warning: "#f5a62318",
  }[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "16px 18px",
            borderRadius: 12,
            background: `linear-gradient(135deg, #0d1a0d 0%, #111 100%)`,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 0 24px ${glowColor}, 0 4px 24px #00000080`,
            minWidth: 320,
            maxWidth: 420,
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 40,
              height: 40,
              borderTop: `1px solid ${borderColor}`,
              borderLeft: `1px solid ${borderColor}`,
              borderRadius: "12px 0 0 0",
              opacity: 0.6,
            }}
          />

          <DiamondIcon type={type} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "'Orbitron', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: {
                  success: "#00e87a",
                  error: "#ff4060",
                  warning: "#f5a623",
                }[type],
                marginBottom: 4,
              }}
            >
              {title}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 14,
                color: "#a8b8a8",
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          </div>

          {/* close button */}
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4a5a4a",
              padding: 4,
              lineHeight: 1,
              flexShrink: 0,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ccc")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5a4a")}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2L12 12M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* progress bar */}
          {duration > 0 && <ProgressBar duration={duration} type={type} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Toast container + hook ────────────────────────────────────────────────────

interface ToastItem extends NotificationProps {
  id: number;
}

let _addToast: ((item: Omit<ToastItem, "id">) => void) | null = null;
let _id = 0;

export const useToast = () => ({
  success: (title: string, message: string, duration?: number) =>
    _addToast?.({ type: "success", title, message, duration }),
  error: (title: string, message: string, duration?: number) =>
    _addToast?.({ type: "error", title, message, duration }),
  warning: (title: string, message: string, duration?: number) =>
    _addToast?.({ type: "warning", title, message, duration }),
});

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _addToast = (item) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { ...item, id }]);
    };
    return () => {
      _addToast = null;
    };
  }, []);

  const remove = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;500&display=swap');`}</style>

      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <Notification
              type={t.type}
              title={t.title}
              message={t.message}
              duration={t.duration}
              onClose={() => remove(t.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

// ── Demo (remove in production) ───────────────────────────────────────────────

export default function NotificationDemo() {
  const toast = useToast();

  const btnStyle = (color: string): React.CSSProperties => ({
    padding: "10px 24px",
    borderRadius: 8,
    border: `1px solid ${color}44`,
    background: `${color}18`,
    color,
    fontFamily: "'Orbitron', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: `0 0 12px ${color}22`,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        fontFamily: "'Orbitron', monospace",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;500&display=swap');`}</style>

      <p
        style={{
          color: "#4a5a4a",
          fontSize: 11,
          letterSpacing: "0.2em",
          marginBottom: 8,
        }}
      >
        NOTIFICATION SYSTEM
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          style={btnStyle("#00e87a")}
          onClick={() =>
            toast.success(
              "Account Created",
              "Your focus journey begins now. Welcome aboard.",
            )
          }
        >
          Success
        </button>
        <button
          style={btnStyle("#ff4060")}
          onClick={() =>
            toast.error(
              "Auth Failed",
              "Invalid credentials. Please check your email and password.",
            )
          }
        >
          Error
        </button>
        <button
          style={btnStyle("#f5a623")}
          onClick={() =>
            toast.warning(
              "Session Expiring",
              "Your session will expire in 5 minutes. Save your work.",
            )
          }
        >
          Warning
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
