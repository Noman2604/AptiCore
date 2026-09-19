"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
    <div className="mt-2">
      <div className="mb-1.5 flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= score ? colors[score] : "bg-[hsl(var(--border))]"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          Strength:{" "}
          <span className="font-medium text-[hsl(var(--foreground))]">
            {labels[score]}
          </span>
        </span>
        <div className="flex gap-2">
          {checks.map((c) => (
            <span
              key={c.label}
              className={cn(
                "text-[10px]",
                c.pass
                  ? "text-emerald-400"
                  : "text-[hsl(var(--muted-foreground))]"
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
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
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
    // Basic client-side validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (!/[A-Z]/.test(form.password)) {
      setError("Password must contain at least one uppercase letter.")
      return
    }
    if (!/[0-9]/.test(form.password)) {
      setError("Password must contain at least one number.")
      return
    }
    setStep(1)
  }
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setIsLoading(true)

    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })

      setDone(true)
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`)
      }, 1500)
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Registration failed. Please try again."

      setError(message)
      setStep(0)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  if (done)
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-[hsl(var(--background))] p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/15">
            <Mail className="h-10 w-10 text-sky-400" />
          </div>
          <h2 className="font-display mb-3 text-3xl font-bold">
            Almost there! 🚀
          </h2>
          <p className="mb-2 text-[hsl(var(--muted-foreground))]">
            Welcome to AptiCore,{" "}
            <strong className="text-[hsl(var(--foreground))]">
              {form.name}
            </strong>
            !
          </p>
          <p className="mb-8 text-sm text-[hsl(var(--muted-foreground))]">
            We sent a 6-digit verification code to{" "}
            <strong className="text-[hsl(var(--foreground))]">{form.email}</strong>.
            Please verify your email to activate your account.
          </p>
          <Link
            href={`/auth/verify-email?email=${encodeURIComponent(form.email)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:opacity-90"
          >
            Enter Verification Code <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )

  return (
    <div className="dark flex min-h-screen bg-[hsl(var(--background))]">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-linear-to-br from-[#0d0617] via-[#120a22] to-[#0d1025] p-14 lg:flex">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(217,70,239,0.06) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-0 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/6 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-100 w-100 translate-x-1/2 translate-y-1/2 rounded-full bg-sky-500/6 blur-3xl" />

        <Link href="/" className="relative flex w-fit items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="AptiCore Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-display bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
            AptiCore
          </span>
        </Link>

        <div className="relative">
          <h1 className="font-display mb-5 text-5xl leading-[1.08] font-extrabold text-white xl:text-6xl">
            Join{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              128,000+
            </span>
            <br />
            achievers
          </h1>
          <p className="mb-10 max-w-md text-lg leading-relaxed text-white/60">
            Free forever. No credit card needed. Start practicing in under 2
            minutes.
          </p>

          <div className="space-y-3.5">
            {[
              "2,840+ mock tests from top placement drives",
              "AI-powered weak area detection",
              "Real-time global leaderboard with XP",
              "Detailed step-by-step solutions",
              "Streak tracking and achievement badges",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20">
                  <CheckCircle2 className="h-3 w-3 text-purple-400" />
                </div>
                <span className="text-sm text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative rounded-2xl border border-white/8 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex">
              {["AS", "PK", "RM", "SN"].map((init, i) => (
                <div
                  key={init}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0d1025] bg-linear-to-br from-sky-500 to-purple-600 text-[10px] font-bold text-white"
                  style={{ marginLeft: i > 0 ? -10 : 0 }}
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="ml-1 text-sm text-white/70">
              +1,240 joined this week
            </span>
          </div>
          <p className="text-xs text-white/50">
            Average improvement in accuracy:{" "}
            <strong className="text-white/80">+34%</strong> after 2 weeks
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-8">
        <div className="relative w-full max-w-105 py-8">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="">
            <Image
              loading="lazy"
              src="/logo.png"
              alt="AptiCore Logo"
              width={32}
              height={32}
              className="h-10 w-10 rounded-full object-cover sm:h-10 sm:w-10"
            />
          </div>
            <span className="font-display bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent">
              AptiCore
            </span>
          </Link>

          {/* Step header */}
          <div className="mb-6">
            <h2 className="font-display mb-1 text-[1.75rem] font-bold tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Your login details
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fade-in mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── STEP 0 ── */}
          {step === 0 && (
            <form onSubmit={handleStep1} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <div className="group relative">
                  <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-sky-400" />
                  <input
                    type="text"
                    required
                    placeholder="Arjun Sharma"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-4 pl-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email address
                </label>
                <div className="group relative">
                  <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-sky-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-4 pl-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <div className="group relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-sky-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-10 pl-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
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

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleRegister}
                  className={cn(
                    "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                    isLoading
                      ? "cursor-not-allowed bg-sky-500/40 text-white/60"
                      : "bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:opacity-90"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-sky-400 transition-colors hover:text-sky-300"
            >
              Sign in →
            </Link>
          </p>

          <p className="mt-4 text-center text-[10px] leading-relaxed text-[hsl(var(--muted-foreground))]">
            By creating an account you agree to our{" "}
            <Link
              href="#"
              className="underline hover:text-[hsl(var(--foreground))]"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline hover:text-[hsl(var(--foreground))]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
