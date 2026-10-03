"use client"

import Link from "next/link"
import Image from "next/image"
import { Home } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"

interface AuthNavbarProps {
  className?: string
  showHome?: boolean
}

export default function AuthNavbar({ className, showHome = true }: AuthNavbarProps) {
  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-50 w-full bg-transparent pointer-events-auto",
        className
      )}
    >
      <div className="mx-auto flex h-14 sm:h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Name */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:opacity-90 active:scale-98"
          aria-label="AptiCore Home"
        >
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center">
            <Image
              src="/logo.png"
              alt="AptiCore Logo"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text font-[Space_Grotesk,sans-serif] text-xl font-bold tracking-tight text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
            AptiCore
          </span>
        </Link>

        {/* Right: Home Link & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showHome && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/60 backdrop-blur-md px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground shadow-2xs transition-all duration-200 hover:border-border hover:bg-surface hover:text-foreground active:scale-95"
              title="Return to homepage"
            >
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Home</span>
            </Link>
          )}

          <div className="rounded-lg p-0.5">
            <ThemeToggle className="h-8 w-8" />
          </div>
        </div>
      </div>
    </header>
  )
}
