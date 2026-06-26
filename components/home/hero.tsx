import { ThemeToggle } from "@/components/theme-toggle";
import { PhoneFrame } from "@/components/phone-frame";

export default function Hero() {
  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-full max-w-6xl mx-auto px-6 gap-8">
        <div className="flex flex-col items-center md:items-start justify-center gap-4 w-full md:w-1/2 z-10">
          <h1 className="text-primary hover:text-foreground text-7xl sm:text-8xl md:text-9xl font-black">
            Loka
          </h1>
          <ThemeToggle />
        </div>

        <div className="w-full md:w-1/2 h-[40vh] md:h-full min-h-70">
          <PhoneFrame />
        </div>
      </div>
    </div>
  );
}
