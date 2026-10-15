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
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="AptiCore Logo"
              width={26}
              height={26}
              className="h-6.5 w-6.5 rounded-sm"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              AptiCore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle Button */}
            <ThemeToggle className="h-8.5 w-8.5 rounded-md text-foreground" />

            <Link
              href="/auth/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="h-8.5 w-8.5 rounded-md border border-border bg-card text-foreground" />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-1.5 text-foreground hover:bg-muted"
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
        <div className="border-t border-border bg-background p-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
