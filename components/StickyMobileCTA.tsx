"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, X } from "lucide-react"

export default function StickyMobileCTA() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return
      // Show when user scrolls past 280px
      if (window.scrollY > 280) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [dismissed])

  if (!show || dismissed) return null

  return (
    <aside
      aria-label="Quick registration bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#212a37] bg-[#0a0e14]/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-bottom duration-300"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6ee7c9] tracking-wide uppercase">
            <Sparkles className="h-3 w-3" />
            <span>Placement Prep</span>
          </div>
          <span className="truncate text-xs text-[#cbd5e1]">
            24,600+ Questions & Mocks
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/auth/register"
            className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-[#6ee7c9] to-[#57c9a8] px-3.5 py-2 text-xs font-bold text-[#06120d] shadow-[0_0_15px_rgba(110,231,201,0.25)] transition-all active:scale-95"
          >
            <span>Start Free</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-md p-1.5 text-[#8a96a8] hover:text-[#e7ecf3]"
            aria-label="Dismiss quick bar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
