"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatedThemeToggler, type TransitionVariant } from "@/components/ui/animated-theme-toggler"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  variant?: TransitionVariant
  showLabel?: boolean
}

export default function ThemeToggle({
  className,
  variant = "circle",
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center text-[--ac-text-2]",
          className
        )}
        aria-hidden="true"
      >
        <div className="h-4 w-4 rounded-full opacity-30" />
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"
  const currentTheme = isDark ? "dark" : "light"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="inline-flex items-center gap-2">
      <AnimatedThemeToggler
        theme={currentTheme}
        onThemeChange={toggleTheme}
        variant={variant}
        className={cn(
          "flex h-9 w-9 items-center justify-center text-[--ac-text-2] cursor-pointer outline-none",
          className
        )}
        title={`Switch to ${isDark ? "light" : "dark"} mode (Hotkey: D)`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      />
      {showLabel && (
        <button
          type="button"
          onClick={toggleTheme}
          className="text-xs font-medium text-[--ac-text-2] cursor-pointer"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      )}
    </div>
  )
}

export { ThemeToggle }
