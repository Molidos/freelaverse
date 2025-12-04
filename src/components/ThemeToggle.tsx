'use client';

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const STORAGE_KEY = "freelaverse-theme";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem(STORAGE_KEY) as
      | "light"
      | "dark"
      | null;
    if (saved) return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  if (!mounted) {
    return (
      <button
        aria-label="Alternar tema"
        className="inline-flex items-center justify-center h-10 w-10 rounded-full glass"
      >
        <FiMoon className="opacity-70" />
      </button>
    );
  }

  return (
    <button
      aria-label="Alternar tema"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center h-10 w-10 rounded-full glass hover:scale-[1.05] transition-transform"
    >
      {theme === "dark" ? (
        <FiSun className="text-yellow-300" />
      ) : (
        <FiMoon className="text-sky-600" />
      )}
    </button>
  );
}


