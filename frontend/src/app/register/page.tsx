"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./register.module.css";
import { ToastContainer, useToast } from "@/components/ui/Notification";

export default function RegisterPage() {
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      console.log("checkbox not checked")
      toast.warning("Hold On", "You must agree to the Terms & Conditions.");
      return;
    }

    if (password !== confirm) {
      toast.error("Password Mismatch", "Your passwords do not match. Try again.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: confirm,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Registration Failed", data.message || "Something went wrong.");
        return;
      }

      toast.success("Account Created", "Your focus journey begins now!");
    } catch (error) {
      console.error(error);
      toast.error("Network Error", "Could not reach the server. Try again later.");
    }
  };

  return (
    <main className={styles.main}>
      <ToastContainer />
      {/* Background glows */}
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

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

        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Start your focus journey today</p>

        {/* Form */}
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className={styles.checkbox}
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className={styles.link}>
                  Terms & Conditions
                </a>
              </span>
            </label>
          </div>

          <motion.button
            className={styles.registerBtn}
            onClick={handleRegister}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Account
          </motion.button>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine}></span>
          </div>

          <motion.button
            className={styles.googleBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>G</span>
            Continue with Google
          </motion.button>
        </div>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <a href="/login" className={styles.loginLink}>
            Sign in
          </a>
        </p>
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
