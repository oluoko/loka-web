"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  small?: boolean;
}

export default function Logo({ className, size = "sm", small }: LogoProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-2xl";
      case "md":
        return "text-3xl";
      case "lg":
        return "text-5xl sm:text-5xl";
      case "xl":
        return "text-6xl sm:text-6xl";
      case "2xl":
        return "text-7xl sm:text-7xl";
      case "3xl":
        return "text-8xl sm:text-8xl";
      default:
        return "text-5xl sm:text-5xl";
    }
  };

  return (
    <h1
      className={`${className} ${getSizeClasses()} inline-block align-middle font-background tracking-tight px-2 sm:px-1.5 ${small ? "text-3xl sm:text-4xl" : ""} bg-foreground rounded-3xl`}
    >
      <span
        className={cn(
          "bg-gradient-to-r from-[#FF0080] to-[#7928CA] to-primary bg-clip-text text-transparent",
          isMobile ? "text-3xl sm:text-4xl" : "",
        )}
      >
        Loka
      </span>
    </h1>
  );
}
