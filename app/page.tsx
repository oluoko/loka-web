import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="h-screen w-screen gap-2 flex flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-primary hover:text-foreground transition-colors duration-200 cursor-pointer text-9xl font-black">
        Loka
      </h1>
      <ThemeToggle />
    </div>
  );
}
