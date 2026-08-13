"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  BookOpen,
  Trophy,
  BarChart2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
          ? "border-b border-[#212a37] bg-[#0a0e14]/90 shadow-lg backdrop-blur-md"
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
            <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-xl font-bold text-transparent">
              AptiCore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[#8a96a8] transition-all duration-200 after:absolute after:bottom-1 after:left-4 after:h-0.5 after:w-0 after:bg-[#6ee7c9] after:transition-all after:duration-300 hover:bg-[#141b25] hover:text-[#6ee7c9] hover:after:w-1/2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth/login"
              className="relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[#8a96a8] transition-all duration-200 after:absolute after:bottom-1 after:left-2 after:h-0.5 after:w-0 after:bg-[#6ee7c9] after:transition-all after:duration-300 hover:bg-[#141b25] hover:text-[#6ee7c9] hover:after:w-1/2"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2 text-sm font-bold text-[#06120d] shadow-[0_0_16px_rgba(110,231,201,0.2)] transition-all hover:-translate-y-0.5 hover:brightness-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-[#e7ecf3] hover:bg-[#141b25] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-[#212a37] bg-[#0a0e14] p-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-[#8a96a8] transition-colors hover:bg-[#141b25] hover:text-[#e7ecf3]"
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-[#212a37] pt-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg border border-[#212a37] px-4 py-2 text-center text-sm font-semibold text-[#8a96a8] transition-colors hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2 text-center text-sm font-bold text-[#06120d]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}