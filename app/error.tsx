"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0a0e14] px-4 font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="w-full max-w-100 rounded-2xl border border-[#212a37] bg-[#10151d] p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(242,85,90,0.3)] bg-[rgba(242,85,90,0.1)]">
          <AlertTriangle className="h-6 w-6 text-[#f2555a]" />
        </div>
        <h1 className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
          Something went wrong
        </h1>
        <p className="mt-2 text-[13px] leading-6 text-[#8a96a8]">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="mt-2 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-2.5 text-[13px] font-bold text-[#06120d] transition hover:brightness-105"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#212a37] py-2.5 text-[13px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
          >
            <Home className="h-4 w-4" />
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}