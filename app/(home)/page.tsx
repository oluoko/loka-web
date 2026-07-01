import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import Logo from "@/components/logo";
import Navbar from "@/components/nav-bar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const homeNavList = [
    [
      <a
        key="about"
        href="#about"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        About
      </a>,
    ],

    [
      <a
        key="blog"
        href="#blog"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Blog
      </a>,
    ],
    [
      <a
        key="get-loka"
        href="#get-loka"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Get Loka
      </a>,
    ],
    [
      <Link
        key="register"
        href="/register"
        className={buttonVariants({
          size: "sm",
          className:
            "text-sm font-medium text-muted-foreground hover:text-foreground",
        })}
      >
        Get Started
      </Link>,
    ],
  ];

  return (
    <>
      <Navbar logo={<Logo />} navList={homeNavList} />
      <Hero />
      <About />
    </>
  );
}
