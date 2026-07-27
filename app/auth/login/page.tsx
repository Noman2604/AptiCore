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
  AlertCircle,
  CheckCircle2,
  Flame,
  Trophy,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import api from "@/lib/api"
import Image from "next/image"

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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      })

      setSuccess("Login successful! Redirecting...")

      setTimeout(() => {
        const role = data.data.user.role
        console.log("User role:", role) // Log the role for debugging

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
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="dark flex min-h-screen bg-[hsl(var(--background))]">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-linear-to-br from-[#050d1a] via-[#0a1628] to-[#0d1f3c] p-14 lg:flex">
        {/* Background elements */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(14,165,233,0.08) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 h-150 w-150 translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-100 w-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/8 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative flex w-fit items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="AptiCore Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />

          <span className="font-display bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
            AptiCore
          </span>
        </Link>

        {/* Main pitch */}
        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            4,200 students active right now
          </div>

          <h1 className="font-display mb-5 text-5xl leading-[1.08] font-extrabold text-white xl:text-6xl">
            Your placement
            <br />
            starts{" "}
            <span className="bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              here.
            </span>
          </h1>

          <p className="mb-10 max-w-md text-lg leading-relaxed text-white/60">
            Practice with real company questions, climb the leaderboard, and
            track your growth — all in one place.
          </p>

          {/* Highlight chips */}
          <div className="mb-12 flex flex-wrap gap-3">
            {highlights.map((h) => (
              <div
                key={h.text}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
              >
                <h.icon className="h-4 w-4 text-sky-400" />
                {h.text}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              ["128K+", "Students"],
              ["85+", "Companies"],
              ["4.9★", "Rating"],
            ].map(([v, l]) => (
              <div
                key={l}
                className="rounded-2xl border border-white/8 bg-white/5 p-4"
              >
                <div className="font-display bg-linear-to-r from-sky-400 to-blue-300 bg-clip-text text-2xl font-bold text-transparent">
                  {v}
                </div>
                <div className="mt-0.5 text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
      </div>

      {/* ── Right panel (form) ──────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.03)_0%,transparent_70%)]" />

        <div className="relative w-full max-w-105">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Image
              src="/logo.png"
              alt="AptiCore Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-display bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
              AptiCore
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="font-display mb-1.5 text-[2rem] font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Sign in to continue your preparation journey
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="animate-fade-in mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="animate-fade-in mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-4 pl-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-sky-400 transition-colors hover:text-sky-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="group relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-sky-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
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
            </div>

            {/* Remember */}
            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <div
                className={cn(
                  "flex h-4.5 w-4.5 items-center justify-center rounded-lg border-2 transition-all",
                  form.remember
                    ? "border-sky-500 bg-sky-500"
                    : "border-[hsl(var(--border))] hover:border-sky-500/50"
                )}
                onClick={() => setForm({ ...form, remember: !form.remember })}
              >
                {form.remember && (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                Keep me signed in
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200",
                isLoading
                  ? "cursor-not-allowed bg-sky-500/40 text-white/60"
                  : "bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:-translate-y-0.5 hover:opacity-90"
              )}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            No account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-sky-400 transition-colors hover:text-sky-300"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
