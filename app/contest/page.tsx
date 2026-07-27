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
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
            <Trophy className="h-3.5 w-3.5" /> Compete & Win XP
          </div>
          <h1 className="font-display mb-3 text-4xl font-bold">
            Weekly Contests
          </h1>
          <p className="mx-auto max-w-xl text-[hsl(var(--muted-foreground))]">
            Compete globally in timed aptitude contests. Top scorers earn
            massive XP, badges, and leaderboard glory.
          </p>
        </div>

        {/* Live contests */}
        {live.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live Now
            </h2>
            {live.map((c) => (
              <div
                key={c.id}
                className="relative mb-4 overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-900/40 to-purple-900/40 p-6"
              >
                <div className="grid-bg absolute inset-0 opacity-20" />
                <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                        LIVE
                      </span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {c.category} · {c.difficulty}
                      </span>
                    </div>
                    <h3 className="font-display mb-1 text-xl font-bold text-white">
                      {c.title}
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      {c.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {formatNumber(c.participants)} joined
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap className="h-4 w-4 text-amber-400" />
                        {c.prize}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Timer className="h-4 w-4 text-red-400" />
                        <Countdown seconds={c.endsIn!} />
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/test/${c.id}`}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-sky-500/30 transition-all hover:opacity-90"
                  >
                    <Play className="h-4 w-4 fill-current" /> Join Contest
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming */}
        <div className="mb-10">
          <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold">
            <Calendar className="h-4 w-4 text-sky-400" /> Upcoming
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-all hover:border-sky-500/30"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400">
                    Upcoming
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {c.category}
                  </span>
                </div>
                <h3 className="font-display mb-2 font-semibold">{c.title}</h3>
                <p className="mb-4 text-xs text-[hsl(var(--muted-foreground))]">
                  {c.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1 text-xs text-[hsl(var(--muted-foreground))]">
                      Starts in
                    </div>
                    <Countdown seconds={c.startsIn!} />
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-xs text-[hsl(var(--muted-foreground))]">
                      Prize
                    </div>
                    <div className="text-sm font-bold text-amber-400">
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
          <h2 className="font-display mb-4 text-lg font-bold">Past Contests</h2>
          <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="grid grid-cols-5 gap-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-hover))] px-5 py-3 text-xs font-semibold tracking-wider text-[hsl(var(--muted-foreground))] uppercase">
              <div className="col-span-2">Contest</div>
              <div className="text-right">Participants</div>
              <div className="text-right">Your Score</div>
              <div className="text-right">Your Rank</div>
            </div>
            {ended.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-5 items-center gap-2 border-b border-[hsl(var(--border))] px-5 py-4 transition-colors last:border-0 hover:bg-[hsl(var(--surface-hover))]"
              >
                <div className="col-span-2">
                  <div className="text-sm font-medium">{c.title}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {c.category} · {c.difficulty}
                  </div>
                </div>
                <div className="text-right text-sm text-[hsl(var(--muted-foreground))]">
                  {formatNumber(c.participants!)}
                </div>
                <div className="text-right text-sm font-semibold text-emerald-400">
                  {c.myScore}%
                </div>
                <div className="font-display gradient-text text-right text-sm font-bold">
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
