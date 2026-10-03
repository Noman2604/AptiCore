"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, BookOpen, Trophy, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import ThemeToggle from "@/components/ThemeToggle"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { label: "Practice", href: "/tests", icon: BookOpen },
    { label: "Contests", href: "/contest", icon: Trophy },
    { label: "Leaderboard", href: "/leaderboard", icon: BarChart2 },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 shadow-sm backdrop-blur-md dark:border-[#212a37] dark:bg-[#0a0e14]/90 dark:shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="AptiCore Logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text font-[Space_Grotesk,sans-serif] text-xl font-bold text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
              AptiCore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 after:absolute after:bottom-1 after:left-4 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:bg-muted hover:text-foreground hover:after:w-1/2 dark:after:bg-[#6ee7c9] dark:hover:text-[#6ee7c9]"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle Button */}
            <ThemeToggle className="h-9 w-9 rounded-lg text-foreground" />

            <Link
              href="/auth/login"
              className="relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-xs transition-all hover:-translate-y-0.5 hover:brightness-105 dark:from-[#6ee7c9] dark:to-[#57c9a8] dark:text-[#06120d] dark:shadow-[0_0_16px_rgba(110,231,201,0.2)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="h-9 w-9 rounded-lg border border-border bg-card/60 text-foreground dark:border-[#212a37] dark:bg-[#10151d]" />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-foreground hover:bg-muted"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden dark:border-[#212a37] dark:bg-[#0a0e14]">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 dark:border-[#212a37]">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-muted-foreground">
                Appearance
              </span>
              <ThemeToggle
                showLabel
                className="h-8 w-8 rounded-md border border-border bg-card dark:border-[#212a37] dark:bg-[#10151d]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted dark:border-[#212a37]"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 px-4 py-2 text-center text-sm font-bold text-white dark:from-[#6ee7c9] dark:to-[#57c9a8] dark:text-[#06120d]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
