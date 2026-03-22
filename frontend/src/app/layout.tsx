import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIBBE — Focus. Flow. Rise.",
  description: "Low-Friction Productivity System for ADHD & Functional Depression",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}