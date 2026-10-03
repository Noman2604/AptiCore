"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Flame,
  Trophy,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import AuthNavbar from "@/components/auth/AuthNavbar"
import { toast } from "sonner"

const highlights = [
  { icon: Trophy, text: "2,840+ mock tests" },
  { icon: Target, text: "24K+ questions" },
  { icon: Flame, text: "Live leaderboard" },
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({ email: "", password: "", remember: false })
  const [mounted, setMounted] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email.trim() || !form.password) {
      toast.error("Please enter both email and password.")
      return
    }

    setError("")
    setSuccess("")
    setUnverifiedEmail("")
    setIsLoading(true)

    try {
      const { data } = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      })

      const role = data?.data?.user?.role
      const userName = data?.data?.user?.name
      toast.success(userName ? `Welcome back, ${userName}!` : "Signed in successfully!")
      setSuccess("Login successful! Redirecting...")

      setTimeout(() => {
        if (role === "admin" || role === "super_admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }, 800)
    } catch (err: any) {
      const message =
        err?.response?.data?.error || "Network error. Please try again."

      setError(message)

      if (err?.response?.data?.requiresVerification) {
        setUnverifiedEmail(err.response.data.email || form.email)
        toast.warning("Please verify your email address to continue.")
      } else {
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      {/* ── Top Navigation Bar ──────────────────────────────────── */}
      <AuthNavbar />

      <div className="flex flex-1">
        {/* ── Left pitch panel (Desktop lg and up) ───────────────── */}
        <div className="relative hidden w-[48%] lg:flex flex-col justify-between overflow-hidden border-r border-border/60 bg-linear-to-br from-slate-50 via-emerald-50/20 to-indigo-50/25 p-12 xl:p-14 pt-24 xl:pt-28 dark:from-[#080b10] dark:via-[#0a0e14] dark:to-[#0c1119]">
          {/* Decorative background grid & radial glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-[#6ee7c9]/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-[#8b7cf6]/10" />

          {/* Active students badge */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-emerald-600 dark:text-[#6ee7c9]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              4,200+ students practicing right now
            </div>
          </div>

          {/* Main pitch copy */}
          <div className="relative my-auto py-8">
            <h1 className="mb-4 font-[Space_Grotesk,sans-serif] text-4xl xl:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Your placement
              <br />
              starts{" "}
              <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                here.
              </span>
            </h1>

            <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Practice with real company recruitment exams, compete on the live
              campus leaderboard, and master concepts with step-by-step analytics.
            </p>

            {/* Highlights chips */}
            <div className="mb-10 flex flex-wrap gap-2.5">
              {highlights.map((h) => (
                <div
                  key={h.text}
                  className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-foreground/80 shadow-2xs backdrop-blur-xs dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                >
                  <h.icon className="h-3.5 w-3.5 text-emerald-600 dark:text-[#6ee7c9]" />
                  <span>{h.text}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3.5">
              {[
                ["128K+", "Students"],
                ["85+", "Top Companies"],
                ["4.9 / 5", "Student Rating"],
              ].map(([val, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-2xs backdrop-blur-md dark:border-white/8 dark:bg-white/5"
                >
                  <div className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                    {val}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground font-medium">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom security assurance */}
          <div className="relative text-xs text-muted-foreground/80">
            Enterprise-grade secure authentication • Fast &amp; Ad-free testing
          </div>
        </div>

        {/* ── Right form panel ────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10 lg:p-12 pt-20 sm:pt-24 lg:pt-24">
          <div className="w-full max-w-md py-4">
            {/* Header */}
            <div className="mb-6">
              <h2 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to continue your aptitude preparation journey
              </p>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email address
                </label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={cn(
                      "h-11 w-full rounded-xl border border-input bg-surface pr-4 pl-10 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
                      error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/15"
                    )}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-emerald-600 dark:text-[#6ee7c9] transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border border-input bg-surface pr-10 pl-10 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
                      error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/15"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember checkbox */}
              <label className="flex cursor-pointer items-center gap-2.5 select-none pt-1">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                  className="h-4 w-4 rounded-md border-input text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Keep me signed in on this device
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-98",
                    isLoading
                      ? "cursor-not-allowed bg-emerald-500/50 text-white"
                      : "bg-linear-to-r from-emerald-600 to-indigo-600 text-white shadow-md shadow-emerald-500/20 hover:opacity-95 dark:from-[#6ee7c9] dark:to-[#8b7cf6] dark:text-[#06120d] dark:font-bold"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to AptiCore</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Switcher to register */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-emerald-600 dark:text-[#6ee7c9] transition-colors hover:underline"
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
