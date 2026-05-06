"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }

  
  if (!mounted) {
    return <div className={cn("h-9 w-9 rounded-xl border border-border bg-background", className)} />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl border overflow-hidden",
        "border-border bg-background hover:bg-accent transition-colors duration-150",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{   rotate:  90,  opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="absolute"
          >
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate:  90, opacity: 0, scale: 0.5 }}
            animate={{ rotate:   0, opacity: 1, scale: 1   }}
            exit={{   rotate: -90,  opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="absolute"
          >
            <Moon className="h-4 w-4 text-muted-foreground" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
