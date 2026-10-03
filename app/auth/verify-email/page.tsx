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
import AuthNavbar from "@/components/auth/AuthNavbar"
import { toast } from "sonner"

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

      if (data?.success) {
        setIsVerified(true)
        setSuccessMessage("Email verified successfully! Redirecting...")
        toast.success("Email verified successfully! Welcome to AptiCore.")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1800)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Token verification failed. Please enter the OTP code manually."
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp
    if (!email) {
      setError("Please provide your email address.")
      toast.error("Please provide your email address.")
      return
    }
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.")
      toast.error("Please enter the complete 6-digit code.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const { data } = await api.post("/auth/verify-email", {
        email: email.trim(),
        otp: code,
      })

      if (data?.success) {
        setIsVerified(true)
        setSuccessMessage("Email verified successfully! Redirecting...")
        toast.success("Email verified successfully! Welcome to AptiCore.")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1800)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Verification failed. Please check the code and try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address to resend the code.")
      toast.error("Please enter your email address to resend the code.")
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

      if (data?.success) {
        setSuccessMessage("A fresh verification code has been sent to your email.")
        toast.success("A fresh verification code has been sent to your email.")
        setResendCooldown(60)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Failed to resend code. Please try again."
      setError(msg)
      toast.error(msg)
      if (err?.response?.data?.retryAfter) {
        setResendCooldown(err.response.data.retryAfter)
      }
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
        <AuthNavbar />
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-card p-8 text-center shadow-xl backdrop-blur-md">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight text-foreground">
              Account Verified! 🎉
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your email has been verified. Welcome to{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">AptiCore</span>.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Taking you to your dashboard...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <AuthNavbar />

      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight text-foreground">
              Verify Your Email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a 6-digit verification code to
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground">
              <Mail className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>{email || "your email address"}</span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMessage && !error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* OTP Input Form */}
          <div className="mt-6 flex flex-col items-center">
            <label className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-10 sm:h-13 sm:w-12 rounded-lg border-input bg-surface text-lg font-bold text-foreground focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* Verify Button */}
            <Button
              onClick={() => handleVerifyOtp()}
              disabled={isLoading || otp.length !== 6}
              className="mt-6 h-11 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 disabled:opacity-50"
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
          <div className="mt-6 border-t border-border/70 pt-5 text-center">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className={cn(
                  "font-semibold transition-colors",
                  resendCooldown > 0
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : "text-sky-600 dark:text-sky-400 hover:underline"
                )}
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </button>
            </p>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link
                href="/auth/login"
                className="hover:text-foreground transition-colors"
              >
                Back to Login
              </Link>
              <span>•</span>
              <Link
                href="/auth/register"
                className="hover:text-foreground transition-colors"
              >
                Create New Account
              </Link>
            </div>
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
        <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin text-sky-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
