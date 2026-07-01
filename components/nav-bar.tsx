import { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar({
  className,
  navList,
  logo,
  showThemeToggle = false,
}: {
  className?: string;
  navList: ReactNode[];
  logo?: ReactNode;
  showThemeToggle?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between w-full px-4 py-2 ${className} bg-foreground/10 backdrop-blur-md border-b border-border`}
    >
      {logo}
      <nav>
        <ul className="flex items-center gap-4">
          {navList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
          <li>{showThemeToggle && <ThemeToggle />}</li>
        </ul>
      </nav>
    </div>
  );
}
