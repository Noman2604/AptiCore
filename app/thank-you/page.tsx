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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-2xl text-center">
          {/* Status badge */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-xs">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="section-eyebrow mx-auto mb-4">
            <span className="section-eyebrow-dot" />
            <span>Submission Confirmed</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Thank you for connecting with us
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            We have received your inquiry. A member of our placement assessment team will
            get back to you within 24 hours. In the meantime, start preparing with our
            curated question banks.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-600 active:scale-98"
            >
              <Zap className="h-4 w-4" />
              <span>Explore Practice Tests</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-xs font-medium text-foreground transition hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>

        {/* What to explore next */}
        <div className="mt-20 border-t border-border pt-12">
          <div className="mb-8 text-center">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Continue Your Campus Placement Journey
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose a track to build assessment-grade accuracy and speed
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Curriculum Modules",
                desc: "Sharpen quant, logical reasoning, and coding MCQs topic-wise.",
                href: "/categories",
                badge: "Track 01",
              },
              {
                icon: Trophy,
                title: "Live Mocks",
                desc: "Compete with peers under real company exam timer pressure.",
                href: "/contest",
                badge: "Track 02",
              },
              {
                icon: LayoutDashboard,
                title: "Learner Console",
                desc: "Track streaks, accuracy rates, and AI performance diagnosis.",
                href: "/dashboard",
                badge: "Track 03",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-emerald-500/40"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
                      <item.icon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="font-mono text-[10px] font-semibold uppercase text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-emerald-500">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <span>Explore module</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
