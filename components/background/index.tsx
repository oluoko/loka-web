"use client";

import { useTheme } from "next-themes";

export default function Background() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  return <div className="w-screen h-screen absolute top-0 left-0 -z-50"></div>;
}
