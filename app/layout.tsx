import type { Metadata } from "next";
import { Poppins, Alkalami, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Background from "@/components/background";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
});

const fontSerif = Alkalami({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Loka",
  description: "Kenyan Languages Learning App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
