"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ModeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative h-6 w-12 rounded-full p-1 bg-muted hover:bg-muted/80 border border-foreground/40 cursor-pointer ${className ?? ""}`}
      // Prevent the button from being interactive before client hydrates
      aria-label="Toggle theme"
    >
      {/* Skeleton shown on server + first paint — no theme-dependent classes */}
      {!mounted ? (
        <div className="absolute size-4 rounded-full bg-muted-foreground/30 left-7" />
      ) : (
        <div
          className={`absolute size-4 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center ${
            isDark ? "left-1 bg-slate-600" : "left-7 bg-orange-500"
          }`}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-white" />
          ) : (
            <Sun className="h-3 w-3 text-white" />
          )}
        </div>
      )}
    </Button>
  );
}
