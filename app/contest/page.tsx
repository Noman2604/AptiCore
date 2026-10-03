"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Trophy,
  Clock,
  Users,
  Zap,
  Play,
  Calendar,
  Medal,
  Crown,
  ChevronRight,
  Timer,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { cn, formatNumber } from "@/lib/utils"

const contests = [
  {
    id: "1",
    title: "Weekly Aptitude Showdown #48",
    status: "live",
    endsIn: 5400,
    participants: 1240,
    prize: "2000 XP",
    category: "Mixed",
    difficulty: "medium",
    description: "Compete live in quantitative, logical and coding rounds!",
  },
  {
    id: "2",
    title: "SQL Championship Round 3",
    status: "upcoming",
    startsIn: 86400,
    participants: 0,
    prize: "1500 XP",
    category: "SQL",
    difficulty: "hard",
    description: "Advanced SQL queries, optimization and schema design.",
  },
  {
    id: "3",
    title: "DSA Speed Contest",
    status: "upcoming",
    startsIn: 172800,
    participants: 0,
    prize: "3000 XP",
    category: "Coding",
    difficulty: "hard",
    description: "60 questions in 45 minutes — only the fastest survive!",
  },
  {
    id: "4",
    title: "TCS NQT Practice Blitz",
    status: "ended",
    participants: 8420,
    myRank: 142,
    myScore: 82,
    prize: "1000 XP",
    category: "Placement",
    difficulty: "medium",
    description: "",
  },
  {
    id: "5",
    title: "Logical Reasoning Sprint",
    status: "ended",
    participants: 5210,
    myRank: 98,
    myScore: 90,
    prize: "1200 XP",
    category: "Logical",
    difficulty: "medium",
    description: "",
  },
]

function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const t = setInterval(() => setLeft((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return (
    <div className="flex items-center gap-1 font-mono text-sm font-bold">
      {h > 0 && (
        <>
          <span className="rounded bg-[hsl(var(--surface-hover))] px-1.5 py-0.5">
            {String(h).padStart(2, "0")}
          </span>
          <span className="text-[hsl(var(--muted-foreground))]">:</span>
        </>
      )}
      <span className="rounded bg-[hsl(var(--surface-hover))] px-1.5 py-0.5">
        {String(m).padStart(2, "0")}
      </span>
      <span className="text-[hsl(var(--muted-foreground))]">:</span>
      <span className="rounded bg-[hsl(var(--surface-hover))] px-1.5 py-0.5">
        {String(s).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function ContestPage() {
  const live = contests.filter((c) => c.status === "live")
  const upcoming = contests.filter((c) => c.status === "upcoming")
  const ended = contests.filter((c) => c.status === "ended")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="section-eyebrow mx-auto mb-3">
            <span className="section-eyebrow-dot" />
            <span>Weekly Campus Benchmarks</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Live Aptitude Contests
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Compete nationwide in timed aptitude challenges under real assessment pressure. Top scorers earn milestone XP and recruitment visibility.
          </p>
        </div>

        {/* Live contests */}
        {live.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground uppercase">
              <span className="status-ping" />
              Live Now
            </h2>
            {live.map((c) => (
              <div
                key={c.id}
                className="relative mb-4 overflow-hidden rounded-xl border border-emerald-500/30 bg-card p-6 shadow-xs"
              >
                <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.category} · {c.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {c.title}
                    </h3>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {c.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-emerald-500" />
                        {formatNumber(c.participants)} joined
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        {c.prize}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-rose-500" />
                        <Countdown seconds={c.endsIn!} />
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/test/${c.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-600 active:scale-98"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Join Contest</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming */}
        <div className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground uppercase">
            <Calendar className="h-4 w-4 text-sky-500" /> Upcoming Contests
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-card p-5 shadow-xs transition hover:border-emerald-500/30"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-500">
                    Upcoming
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 mb-4 text-xs text-muted-foreground">
                  {c.description}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <div className="mb-1 text-[11px] text-muted-foreground">
                      Starts in
                    </div>
                    <Countdown seconds={c.startsIn!} />
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-[11px] text-muted-foreground">
                      Prize
                    </div>
                    <div className="font-mono text-xs font-bold text-amber-500">
                      {c.prize}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past results */}
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-tight text-foreground uppercase">
            Past Contest Ledger
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="grid grid-cols-5 gap-2 border-b border-border bg-muted/40 px-5 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <div className="col-span-2">Contest</div>
              <div className="text-right">Participants</div>
              <div className="text-right">Your Score</div>
              <div className="text-right">Your Rank</div>
            </div>
            {ended.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-5 items-center gap-2 border-b border-border px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/30"
              >
                <div className="col-span-2">
                  <div className="text-xs font-semibold text-foreground">{c.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.category} · {c.difficulty}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {formatNumber(c.participants!)}
                </div>
                <div className="text-right font-mono text-xs font-semibold text-emerald-500">
                  {c.myScore}%
                </div>
                <div className="text-right font-mono text-xs font-bold text-foreground">
                  #{c.myRank}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
