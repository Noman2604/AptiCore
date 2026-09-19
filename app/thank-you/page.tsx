import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  CheckCircle2,
  ArrowRight,
  Home,
  BookOpen,
  Trophy,
  LayoutDashboard,
  Sparkles,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Thank You — AptiCore",
  description:
    "Thank you for contacting AptiCore. We have received your inquiry and will respond within 24 hours.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]">
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Glow background accent */}
        <div className="pointer-events-none absolute top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#6ee7c9]/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          {/* Animated badge */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#6ee7c9]/30 bg-[#6ee7c9]/10 shadow-[0_0_40px_rgba(110,231,201,0.25)] animate-bounce-slow">
            <CheckCircle2 className="h-10 w-10 text-[#6ee7c9]" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6ee7c9]/30 bg-[#6ee7c9]/10 px-4 py-1.5 font-[JetBrains_Mono,monospace] text-xs font-medium text-[#6ee7c9]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Request Received</span>
          </div>

          <h1 className="font-[Space_Grotesk,sans-serif] text-4xl font-extrabold sm:text-5xl">
            Thank You for <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">Connecting</span>!
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#8a96a8] sm:text-lg">
            We have received your submission. A member of our placement team will
            get back to you within 24 hours. In the meantime, start preparing for
            your dream company!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tests"
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#6ee7c9] to-[#57c9a8] px-6 py-3.5 text-sm font-bold text-[#06120d] shadow-[0_0_20px_rgba(110,231,201,0.25)] transition-all hover:brightness-105"
            >
              <Zap className="h-4 w-4" />
              <span>Explore Practice Tests</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-[#212a37] bg-[#10151d] px-6 py-3.5 text-sm font-semibold text-[#e7ecf3] transition-colors hover:border-[#3a4a5e] hover:bg-[#141b25]"
            >
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>

        {/* What to explore next */}
        <div className="mt-20">
          <h2 className="mb-6 text-center font-[Space_Grotesk,sans-serif] text-xl font-bold text-[#e7ecf3]">
            While You Wait, Level Up Your Prep
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Topic Modules",
                desc: "Sharpen quant, logical reasoning, and coding MCQs topic-wise.",
                href: "/categories",
                color: "#6ee7c9",
              },
              {
                icon: Trophy,
                title: "Live Contests",
                desc: "Compete with peers under real exam timer pressure.",
                href: "/contest",
                color: "#f5a623",
              },
              {
                icon: LayoutDashboard,
                title: "Your Dashboard",
                desc: "Track streaks, accuracy rates, and AI recommendations.",
                href: "/dashboard",
                color: "#8b7cf6",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#212a37] bg-[#10151d] p-6 transition-all hover:-translate-y-1 hover:border-[#3a4a5e] hover:shadow-xl"
              >
                <div>
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-[Space_Grotesk,sans-serif] text-base font-semibold text-[#e7ecf3] group-hover:text-[#6ee7c9] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#8a96a8]">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#6ee7c9]">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
