"use client";

import { useEffect, useState } from "react";
import { toast, type ToastMessage } from "@/lib/toast";
import styles from "./ToastHost.module.css";

export default function ToastHost() {
  const [current, setCurrent] = useState<ToastMessage | null>(null);

  useEffect(() => {
    return toast.subscribe((msg) => {
      setCurrent(msg);
      if (msg) {
        window.setTimeout(() => {
          setCurrent((prev) => (prev?.id === msg.id ? null : prev));
        }, 3500);
      }
    });
  }, []);

  if (!current) return null;

  return (
    <div
      className={`${styles.toast} ${styles[current.type]}`}
      role="status"
      aria-live="polite"
    >
      <span>{current.type === "success" ? "✅" : current.type === "error" ? "⚠️" : "ℹ️"}</span>
      <span>{current.message}</span>
    </div>
  );
}
