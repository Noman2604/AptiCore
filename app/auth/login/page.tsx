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

  const [unverifiedEmail, setUnverifiedEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setSuccess("")
    setUnverifiedEmail("")
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

      if (err?.response?.data?.requiresVerification) {
        setUnverifiedEmail(err.response.data.email || form.email)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-linear-to-br from-[#080b10] via-[#0a0e14] to-[#0c1119] p-14 lg:flex">
        {/* Background elements */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(110,231,201,0.08) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 h-150 w-150 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6ee7c9]/6 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-100 w-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#8b7cf6]/8 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative flex w-fit items-center gap-2.5">
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
          <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold text-transparent">
            AptiCore
          </span>
        </Link>

        {/* Main pitch */}
        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] px-3 py-1.5 font-[JetBrains_Mono,monospace] text-xs font-medium text-[#6ee7c9]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3ecf8e]" />
            4,200 students active right now
          </div>

          <h1 className="mb-5 font-[Space_Grotesk,sans-serif] text-5xl leading-[1.08] font-extrabold text-white xl:text-6xl">
            Your placement
            <br />
            starts{" "}
            <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
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
                <h.icon className="h-4 w-4 text-[#6ee7c9]" />
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
                <div className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold text-transparent">
                  {v}
                </div>
                <div className="mt-0.5 text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,231,201,0.04)_0%,transparent_70%)]" />

        <div className="relative w-full max-w-105">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] font-[Space_Grotesk,sans-serif] text-sm font-bold text-[#08110d]">
              AC
            </div>
            <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-xl font-bold text-transparent">
              ApticCore
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-[2rem] font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-[#8a96a8]">
              Sign in to continue your preparation journey
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 rounded-xl border border-[rgba(242,85,90,0.3)] bg-[rgba(242,85,90,0.1)] p-3.5 text-sm text-[#f2555a]">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              {unverifiedEmail && (
                <div className="mt-3 flex justify-end border-t border-[rgba(242,85,90,0.25)] pt-2.5">
                  <Link
                    href={`/auth/verify-email?email=${encodeURIComponent(
                      unverifiedEmail
                    )}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6ee7c9] hover:underline"
                  >
                    Verify Email Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-[rgba(62,207,142,0.3)] bg-[rgba(62,207,142,0.1)] p-3.5 text-sm text-[#3ecf8e]">
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
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5b6577] transition-colors group-focus-within:text-[#6ee7c9]" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#212a37] bg-[#10151d] pr-4 pl-10 text-sm text-[#e7ecf3] transition-all outline-none placeholder:text-[#5b6577] focus:border-[#6ee7c9] focus:ring-2 focus:ring-[#6ee7c9]/15"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#6ee7c9] transition-colors hover:text-[#8ef2d6]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="group relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5b6577] transition-colors group-focus-within:text-[#6ee7c9]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#212a37] bg-[#10151d] pr-10 pl-10 text-sm text-[#e7ecf3] transition-all outline-none placeholder:text-[#5b6577] focus:border-[#6ee7c9] focus:ring-2 focus:ring-[#6ee7c9]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 text-[#5b6577] transition-colors hover:text-[#e7ecf3]"
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
                    ? "border-[#6ee7c9] bg-[#6ee7c9]"
                    : "border-[#212a37] hover:border-[#6ee7c9]/50"
                )}
                onClick={() => setForm({ ...form, remember: !form.remember })}
              >
                {form.remember && (
                  <CheckCircle2 className="h-3 w-3 text-[#06120d]" />
                )}
              </div>
              <span className="text-sm text-[#8a96a8]">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200",
                isLoading
                  ? "cursor-not-allowed bg-[#6ee7c9]/30 text-[#06120d]/60"
                  : "bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] text-[#06120d] shadow-lg shadow-[#6ee7c9]/20 hover:-translate-y-0.5 hover:brightness-105"
              )}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#06120d]/30 border-t-[#06120d]" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8a96a8]">
            No account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-[#6ee7c9] transition-colors hover:text-[#8ef2d6]"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
