"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

function applyTheme(theme: string) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }
}

function applyColorTheme(colorTheme: string) {
  if (colorTheme === "default" || !colorTheme) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", colorTheme);
  }
}

export function ThemeSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const uid = session.user.id;
    const savedTheme      = localStorage.getItem(`theme_${uid}`);
    const savedColorTheme = localStorage.getItem(`colorTheme_${uid}`);

    if (savedTheme)      applyTheme(savedTheme);
    if (savedColorTheme) applyColorTheme(savedColorTheme);
  }, [status, session?.user?.id]);

  return null;
}


export function userKey(uid: string, key: string) {
  return `${key}_${uid}`;
}
