"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailParam = searchParams.get("email") || ""
  const tokenParam = searchParams.get("token") || ""

  const [email, setEmail] = useState(emailParam)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Sync email from query param if available
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // One-click token verification if token param is present in URL
  useEffect(() => {
    if (tokenParam && emailParam && !isVerified) {
      handleAutoVerifyToken(emailParam, tokenParam)
    }
  }, [tokenParam, emailParam])

  const handleAutoVerifyToken = async (
    targetEmail: string,
    targetToken: string
  ) => {
    setIsLoading(true)
    setError("")
    try {
      const { data } = await api.post("/auth/verify-email", {
        email: targetEmail,
        token: targetToken,
      })

      if (data.success) {
        setIsVerified(true)
        setSuccessMessage("Email verified successfully! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1800)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Token verification failed. Please enter the OTP code manually."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp
    if (!email) {
      setError("Please provide your email address.")
      return
    }
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const { data } = await api.post("/auth/verify-email", {
        email: email.trim(),
        otp: code,
      })

      if (data.success) {
        setIsVerified(true)
        setSuccessMessage("Email verified successfully! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1800)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Verification failed. Please check the code and try again."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address to resend the code.")
      return
    }
    if (resendCooldown > 0) return

    setIsResending(true)
    setError("")
    setSuccessMessage("")

    try {
      const { data } = await api.post("/auth/resend-verification", {
        email: email.trim(),
      })

      if (data.success) {
        setSuccessMessage("A fresh verification code has been sent to your email.")
        setResendCooldown(60)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Failed to resend code. Please try again."
      setError(msg)
      if (err?.response?.data?.retryAfter) {
        setResendCooldown(err.response.data.retryAfter)
      }
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-50">
        <div className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Account Verified! 🎉
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Your email has been verified. Welcome to{" "}
            <span className="font-semibold text-emerald-400">AptiCore</span>.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Taking you to your dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            We sent a 6-digit verification code to
          </p>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-800/60 px-3 py-1 text-xs font-medium text-sky-300">
            <Mail className="h-3.5 w-3.5" />
            {email || "your email address"}
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {successMessage && !error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {/* OTP Input Form */}
        <div className="mt-6 flex flex-col items-center">
          <label className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Enter 6-Digit Code
          </label>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => {
              setOtp(val)
              if (val.length === 6) {
                handleVerifyOtp(val)
              }
            }}
            disabled={isLoading}
          >
            <InputOTPGroup className="gap-2 sm:gap-2.5">
              <InputOTPSlot
                index={0}
                className="h-12 w-11 rounded-lg border-slate-700 bg-slate-800/60 text-lg font-bold text-slate-100 focus:border-sky-500 sm:h-13 sm:w-12"
              />
              <InputOTPSlot
                index={1}
                className="h-12 w-11 rounded-lg border-slate-700 bg-slate-800/60 text-lg font-bold text-slate-100 focus:border-sky-500 sm:h-13 sm:w-12"
              />
              <InputOTPSlot
                index={2}
                className="h-12 w-11 rounded-lg border-slate-700 bg-slate-800/60 text-lg font-bold text-slate-100 focus:border-sky-500 sm:h-13 sm:w-12"
              />
              <InputOTPSlot
                index={3}
                className="h-12 w-11 rounded-lg border-slate-700 bg-slate-800/60 text-lg font-bold text-slate-100 focus:border-sky-500 sm:h-13 sm:w-12"
              />
              <InputOTPSlot
                index={4}
                className="h-12 w-11 rounded-lg border-slate-700 bg-slate-800/60 text-lg font-bold text-slate-100 focus:border-sky-500 sm:h-13 sm:w-12"
              />
              <InputOTPSlot
                index={5}
                className="h-12 w-11 rounded-lg border-slate-700 bg-slate-800/60 text-lg font-bold text-slate-100 focus:border-sky-500 sm:h-13 sm:w-12"
              />
            </InputOTPGroup>
          </InputOTP>

          {/* Verify Button */}
          <Button
            onClick={() => handleVerifyOtp()}
            disabled={isLoading || otp.length !== 6}
            className="mt-6 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Verify Account <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        {/* Resend Actions */}
        <div className="mt-6 border-t border-slate-800/80 pt-5 text-center">
          <p className="text-xs text-slate-400">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className={cn(
                "font-semibold transition-colors",
                resendCooldown > 0
                  ? "cursor-not-allowed text-slate-500"
                  : "text-sky-400 hover:text-sky-300 hover:underline"
              )}
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </button>
          </p>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <Link
              href="/auth/login"
              className="hover:text-slate-300 transition-colors"
            >
              Back to Login
            </Link>
            <span>•</span>
            <Link
              href="/auth/register"
              className="hover:text-slate-300 transition-colors"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
