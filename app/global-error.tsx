"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Global Error]", error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0e14] px-4 font-sans text-[#e7ecf3]">
        <div className="w-full max-w-md rounded-2xl border border-[#212a37] bg-[#10151d] p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(242,85,90,0.3)] bg-[rgba(242,85,90,0.1)]">
            <AlertTriangle className="h-6 w-6 text-[#f2555a]" />
          </div>
          <h1 className="text-xl font-bold">System Error</h1>
          <p className="mt-2 text-sm text-[#8a96a8]">
            {error.message || "A critical error occurred while rendering the application."}
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-[#5b6577]">
              Digest: {error.digest}
            </p>
          )}

          <div className="mt-6">
            <button
              onClick={() => reset()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6ee7c9] py-2.5 text-sm font-bold text-[#06120d] transition hover:brightness-105"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
