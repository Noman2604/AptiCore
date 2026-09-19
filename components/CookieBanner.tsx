"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, ShieldCheck, X } from "lucide-react"

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = localStorage.getItem("apticore_cookie_consent")
    if (!consent) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => setIsVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleConsent = (type: "all" | "essential") => {
    localStorage.setItem("apticore_cookie_consent", type)
    window.dispatchEvent(
      new CustomEvent("apticore-cookie-consent", { detail: { consent: type } })
    )
    setIsVisible(false)
  }

  if (!mounted || !isVisible) return null

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#212a37] bg-[#10151d]/95 p-5 shadow-2xl backdrop-blur-xl">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-[#6ee7c9]/10 blur-2xl" />

        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6ee7c9]/20 bg-[#6ee7c9]/10 text-[#6ee7c9]">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-[Space_Grotesk,sans-serif] text-sm font-bold text-[#e7ecf3]">
                We Value Your Privacy
              </h3>
              <button
                onClick={() => handleConsent("essential")}
                className="text-[#8a96a8] hover:text-[#e7ecf3] transition-colors p-1"
                aria-label="Close cookie banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-[#8a96a8]">
              We use cookies to maintain your login session, ensure security, and
              analyze platform performance. Read our{" "}
              <Link
                href="/cookies"
                className="text-[#6ee7c9] underline underline-offset-2 hover:text-[#57c9a8]"
              >
                Cookie Policy
              </Link>{" "}
              for details.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleConsent("all")}
                className="flex-1 rounded-lg bg-linear-to-r from-[#6ee7c9] to-[#57c9a8] px-3.5 py-2 text-xs font-bold text-[#06120d] shadow-[0_0_15px_rgba(110,231,201,0.2)] transition-all hover:brightness-105"
              >
                Accept All
              </button>
              <button
                onClick={() => handleConsent("essential")}
                className="rounded-lg border border-[#212a37] bg-[#141b25] px-3.5 py-2 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#3a4a5e] hover:bg-[#1a2330]"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
