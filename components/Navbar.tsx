"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  Zap,
  Moon,
  Sun,
  Search,
  Bell,
  ChevronDown,
  BookOpen,
  Trophy,
  BarChart2,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Image from "next/image"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    if (theme === "dark") document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
    return () => window.removeEventListener("scroll", onScroll)
  }, [theme])

  const navLinks = [
    { label: "Practice", href: "/practice", icon: BookOpen },
    { label: "Contests", href: "/contest", icon: Trophy },
    { label: "Leaderboard", href: "/leaderboard", icon: BarChart2 },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all w-full duration-300",
        scrolled ? "glass border-b border-white/10 shadow-lg" : "bg-transparent"
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
            <span className="font-display gradient-text text-xl font-bold">
              AptiCore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all duration-200 after:absolute after:bottom-1 after:left-4 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:bg-[hsl(var(--surface-hover))] hover:text-blue-400 hover:after:w-1/2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/auth/login"
                className="relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all duration-200 after:absolute after:bottom-1 after:left-2 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:bg-[hsl(var(--surface-hover))] hover:text-blue-400 hover:after:w-1/2"
              >
                Login
              </Link>
            </div>
            <Link
              href="/auth/register"
              className="shadow-glow-brand rounded-lg bg-linear-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 hover:bg-[hsl(var(--surface-hover))] md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="glass animate-slide-up border-t border-white/10 p-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--surface-hover))]"
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-[hsl(var(--surface-hover))]"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg bg-linear-to-r from-sky-500 to-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
