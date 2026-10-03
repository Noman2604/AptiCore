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
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import AuthNavbar from "@/components/auth/AuthNavbar"
import { toast } from "sonner"

function StrengthBar({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Symbol", pass: /[!@#$%^&*]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const colors = [
    "",
    "bg-red-500",
    "bg-amber-500",
    "bg-sky-500",
    "bg-emerald-500",
  ]
  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  if (!password) return null
  return (
    <div className="mt-2.5">
      <div className="mb-1.5 flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= score ? colors[score] : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Strength:{" "}
          <span className="font-medium text-foreground">
            {labels[score]}
          </span>
        </span>
        <div className="flex gap-2">
          {checks.map((c) => (
            <span
              key={c.label}
              className={cn(
                "text-[10px] font-medium",
                c.pass
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground/60"
              )}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      toast.error("Password must be at least 8 characters.")
      return
    }
    if (!/[A-Z]/.test(form.password)) {
      setError("Password must contain at least one uppercase letter.")
      toast.error("Password must contain at least one uppercase letter.")
      return
    }
    if (!/[0-9]/.test(form.password)) {
      setError("Password must contain at least one number.")
      toast.error("Password must contain at least one number.")
      return
    }
    setStep(1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.name.trim()) {
      toast.error("Please enter your full name.")
      return
    }
    if (!form.email.trim()) {
      toast.error("Please enter your email address.")
      return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      toast.error("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)

    try {
      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      })

      toast.success("Account created! Check your email for the verification code.")
      setDone(true)
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(form.email.trim())}`)
      }, 1500)
    } catch (err: any) {
      const message =
        err?.response?.data?.error || "Registration failed. Please try again."
      setError(message)
      toast.error(message)
      setStep(0)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
        <AuthNavbar />
        <div className="flex flex-1 items-center justify-center p-6 sm:p-8 pt-24 sm:pt-28">
          <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xl backdrop-blur-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Mail className="h-10 w-10" />
            </div>
            <h2 className="mb-3 font-[Space_Grotesk,sans-serif] text-3xl font-bold tracking-tight text-foreground">
              Almost there! 🚀
            </h2>
            <p className="mb-2 text-muted-foreground">
              Welcome to AptiCore,{" "}
              <strong className="text-foreground">{form.name}</strong>!
            </p>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              We sent a 6-digit verification code to{" "}
              <strong className="text-foreground">{form.email}</strong>. Please
              verify your email to activate your account.
            </p>
            <Link
              href={`/auth/verify-email?email=${encodeURIComponent(form.email)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:opacity-95"
            >
              Enter Verification Code <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      {/* ── Top Navigation Bar ──────────────────────────────────── */}
      <AuthNavbar />

      <div className="flex flex-1">
        {/* ── Left Pitch Panel (Desktop lg and up) ───────────────── */}
        <div className="relative hidden w-[48%] lg:flex flex-col justify-between overflow-hidden border-r border-border/60 bg-linear-to-br from-slate-50 via-indigo-50/25 to-emerald-50/20 p-8 xl:p-10 pt-16 xl:pt-18 dark:from-[#080c14] dark:via-[#0e1320] dark:to-[#09101b]">
          {/* Decorative grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/15" />

          {/* Eyebrow badge */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              100% Free Placement Preparation
            </div>
          </div>

          {/* Main pitch copy */}
          <div className="relative my-auto py-4">
            <h1 className="mb-3 font-[Space_Grotesk,sans-serif] text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-[1.14]">
              Join{" "}
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                128,000+
              </span>
              <br />
              career achievers
            </h1>
            <p className="mb-6 max-w-md text-sm xl:text-base leading-relaxed text-muted-foreground">
              Free forever. No credit card required. Start practicing and measuring
              your skills in under 2 minutes.
            </p>

            <div className="space-y-2.5">
              {[
                "2,840+ mock tests from top placement drives",
                "Real-time global leaderboard with XP and streaks",
                "Step-by-step written explanations",
                "Full-screen timed test simulator",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <span className="text-xs xl:text-sm font-medium text-foreground/80">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof card */}
          <div className="relative rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-xs backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="flex">
                {["AS", "PK", "RM", "SN"].map((init, i) => (
                  <div
                    key={init}
                    className="flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-surface bg-linear-to-br from-sky-500 to-purple-600 text-[9px] font-bold text-white shadow-2xs"
                    style={{ marginLeft: i > 0 ? -7 : 0 }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground/90">
                +1,240 students joined this week
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Average aptitude accuracy boost:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                +34%
              </strong>{" "}
              within first 2 weeks.
            </p>
          </div>
        </div>

        {/* ── Right Form Panel ────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8 pt-16 sm:pt-16 lg:pt-16">
          <div className="w-full max-w-md">
            {/* Step header */}
            <div className="mb-4 sm:mb-5">
              <h2 className="mb-1 font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Start preparing for campus placements today
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Full name */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full name
                </label>
                <div className="group relative">
                  <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-sky-500" />
                  <input
                    type="text"
                    required
                    placeholder="Arjun Sharma"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-10 sm:h-11 w-full rounded-xl border border-input bg-surface pr-4 pl-10 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                  />
                </div>
              </div>

              {/* Email address */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email address
                </label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-sky-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@university.edu"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-10 sm:h-11 w-full rounded-xl border border-input bg-surface pr-4 pl-10 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-sky-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="h-10 sm:h-11 w-full rounded-xl border border-input bg-surface pr-10 pl-10 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
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
                <StrengthBar password={form.password} />
              </div>

              {/* Submit button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex h-10 sm:h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 active:scale-98",
                    isLoading
                      ? "cursor-not-allowed bg-sky-500/50"
                      : "bg-linear-to-r from-sky-500 to-indigo-600 shadow-sky-500/20 hover:opacity-95 hover:shadow-sky-500/30"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer switcher */}
            <p className="mt-4 sm:mt-5 text-center text-xs sm:text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-sky-600 dark:text-sky-400 transition-colors hover:underline"
              >
                Sign in →
              </Link>
            </p>

            <p className="mt-2.5 sm:mt-3 text-center text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground/75">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
