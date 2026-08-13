"use client"

import { useEffect, useState } from "react"
import { WifiOff, RotateCcw } from "lucide-react"

export default function NetworkStatus({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOnline, setIsOnline] = useState(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setChecking(true)
    setIsOnline(navigator.onLine)
    setTimeout(() => setChecking(false), 600)
  }

  if (!isOnline) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0a0e14] px-4 font-[Inter,sans-serif] text-[#e7ecf3]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <div className="w-full max-w-100 rounded-2xl border border-[#212a37] bg-[#10151d] p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.1)]">
            <WifiOff className="h-6 w-6 text-[#f5a623]" />
          </div>
          <h1 className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
            No internet connection
          </h1>
          <p className="mt-2 text-[13px] leading-6 text-[#8a96a8]">
            AptiCore needs an internet connection. Check your network and try
            again.
          </p>

          <button
            onClick={handleRetry}
            disabled={checking}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-2.5 text-[13px] font-bold text-[#06120d] transition hover:brightness-105 disabled:opacity-60"
          >
            <RotateCcw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
            {checking ? "Checking..." : "Retry"}
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}