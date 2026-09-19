"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Trophy,
  Search,
  Crown,
  Flame,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Medal,
  Target,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Users,
  Award,
  X,
} from "lucide-react"

import { cn, formatNumber, getInitials } from "@/lib/utils"
import { AvatarFrame, resolveAvatarBorder } from "@/components/ui/game-avatar"
import Image from "next/image"

type LeaderboardEntry = {
  rank: number
  totalXP: number
  avatarUrl?: string
  avatarBorder?: string
  totalTestsTaken: number
  averageAccuracy: number
  level: number
  streak?: number
  userId: {
    _id: string
    name?: string
    email?: string
  }
}

type UserInfo = {
  id: string
  name: string
}

type Timeframe = "all-time" | "weekly" | "monthly"

export default function LeaderboardPage() {
  const [search, setSearch] = useState("")
  const [timeframe, setTimeframe] = useState<Timeframe>("all-time")
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [me, setMe] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dockDismissed, setDockDismissed] = useState(false)

  const loadLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      const [leaderboardRes, meRes] = await Promise.all([
        fetch("/api/leaderboard"),
        fetch("/api/auth/me"),
      ])

      if (leaderboardRes.ok) {
        const json = await leaderboardRes.json()
        if (json.success && Array.isArray(json.data)) {
          setEntries(json.data)
        }
      }

      if (meRes.ok) {
        const json = await meRes.json()
        if (json.success && json.data) {
          setMe({ id: json.data.id, name: json.data.name })
        }
      }
    } catch (error) {
      console.error("Failed to load leaderboard", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void loadLeaderboard()
  }, [])

  // Timeframe simulation / sorting (adds variety for weekly/monthly sprints)
  const timeframeSortedEntries = useMemo(() => {
    if (!entries.length) return []
    const copy = [...entries]
    if (timeframe === "weekly") {
      // Sort primarily by streak and recent accuracy weighting
      return copy
        .sort((a, b) => {
          const streakA = (a.streak || 1) * 200 + a.averageAccuracy * 10
          const streakB = (b.streak || 1) * 200 + b.averageAccuracy * 10
          return streakB - streakA
        })
        .map((item, idx) => ({ ...item, rank: idx + 1 }))
    }
    if (timeframe === "monthly") {
      // Sort by tests taken and total XP
      return copy
        .sort((a, b) => {
          const scoreA = a.totalTestsTaken * 300 + a.totalXP
          const scoreB = b.totalTestsTaken * 300 + b.totalXP
          return scoreB - scoreA
        })
        .map((item, idx) => ({ ...item, rank: idx + 1 }))
    }
    return copy
  }, [entries, timeframe])

  // Filtered by search term
  const filtered = useMemo(() => {
    return timeframeSortedEntries.filter((entry) => {
      const name = entry.userId?.name || entry.userId?.email || "Unknown"
      return (
        !search.trim() ||
        name.toLowerCase().includes(search.trim().toLowerCase())
      )
    })
  }, [timeframeSortedEntries, search])

  // Top 3 Podium
  const podium1st = filtered.length > 0 ? filtered[0] : null
  const podium2nd = filtered.length > 1 ? filtered[1] : null
  const podium3rd = filtered.length > 2 ? filtered[2] : null
  const restEntries = filtered.slice(3)

  // User's own entry
  const myEntry = me
    ? timeframeSortedEntries.find(
        (entry) => String(entry.userId?._id) === String(me.id)
      )
    : null

  // Target player right above current user (for gamification motivator)
  const nextTarget = useMemo(() => {
    if (!myEntry || myEntry.rank <= 1) return null
    const playerAhead = timeframeSortedEntries.find(
      (e) => e.rank === myEntry.rank - 1
    )
    if (!playerAhead) return null
    const xpDiff = Math.max(0, playerAhead.totalXP - myEntry.totalXP)
    return {
      player: playerAhead,
      xpNeeded: xpDiff,
    }
  }, [myEntry, timeframeSortedEntries])

  // Quick summary stats
  const stats = useMemo(() => {
    if (!entries.length) return { total: 0, maxStreak: 0, avgAccuracy: 0 }
    const total = entries.length
    const maxStreak = Math.max(...entries.map((e) => e.streak || 0), 0)
    const avgAccuracy = Math.round(
      entries.reduce((acc, curr) => acc + (curr.averageAccuracy || 0), 0) /
        total
    )
    return { total, maxStreak, avgAccuracy }
  }, [entries])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-[--ac-bg] text-[--ac-text]">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-teal-400/20" />
          <Trophy className="h-6 w-6 animate-pulse text-teal-500 dark:text-teal-400" />
        </div>
        <p className="font-[Space_Grotesk,sans-serif] text-sm font-medium text-[--ac-text-3]">
          Loading global rankings...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--ac-bg] pb-28 text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* ================= HERO HEADER ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-linear-to-br from-teal-500/10 via-purple-500/5 to-amber-500/10 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/10">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                <Trophy className="h-3.5 w-3.5" />
                <span>GLOBAL LEAGUE · SEASON 1</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-3xl font-extrabold tracking-tight text-[--ac-text] sm:text-4xl">
                AptiCore Leaderboard
              </h1>
              <p className="text-sm leading-relaxed text-[--ac-text-3]">
                Compete with top learners across colleges, maintain daily
                practice streaks, and earn prestige by mastering timed aptitude
                challenges.
              </p>
            </div>

            {/* Quick Stat Pill Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:w-96">
              <div className="flex flex-col rounded-2xl border border-black/10 bg-white/70 p-3 shadow-xs backdrop-blur-sm dark:border-white/10 dark:bg-[#10151d]/70">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[--ac-text-3]">
                  <Users className="h-3 w-3 text-teal-500" /> Learners
                </span>
                <span className="mt-1 font-[JetBrains_Mono,monospace] text-base font-bold text-[--ac-text]">
                  {stats.total}
                </span>
              </div>

              <div className="flex flex-col rounded-2xl border border-black/10 bg-white/70 p-3 shadow-xs backdrop-blur-sm dark:border-white/10 dark:bg-[#10151d]/70">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[--ac-text-3]">
                  <Flame className="h-3 w-3 text-orange-500" /> Top Streak
                </span>
                <span className="mt-1 font-[JetBrains_Mono,monospace] text-base font-bold text-orange-500">
                  {stats.maxStreak}d
                </span>
              </div>

              <div className="flex flex-col rounded-2xl border border-black/10 bg-white/70 p-3 shadow-xs backdrop-blur-sm dark:border-white/10 dark:bg-[#10151d]/70">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[--ac-text-3]">
                  <Target className="h-3 w-3 text-purple-500" /> Avg Acc
                </span>
                <span className="mt-1 font-[JetBrains_Mono,monospace] text-base font-bold text-purple-600 dark:text-purple-400">
                  {stats.avgAccuracy}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTROLS & TIMEFRAME TABS ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Timeframe Selector */}
          <div className="inline-flex rounded-xl border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
            <button
              onClick={() => setTimeframe("all-time")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                timeframe === "all-time"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-[#10151d] dark:text-white"
                  : "text-[--ac-text-3] hover:text-[--ac-text]"
              )}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              All-Time
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                timeframe === "weekly"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-[#10151d] dark:text-white"
                  : "text-[--ac-text-3] hover:text-[--ac-text]"
              )}
            >
              <Zap className="h-3.5 w-3.5 text-teal-500" />
              Weekly Sprint
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                timeframe === "monthly"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-[#10151d] dark:text-white"
                  : "text-[--ac-text-3] hover:text-[--ac-text]"
              )}
            >
              <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
              Monthly Cohort
            </button>
          </div>

          {/* Search Bar & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a learner..."
                className="h-9 w-full rounded-xl border border-black/10 bg-white/80 pr-8 pl-9 text-xs text-[--ac-text] placeholder:text-[--ac-text-3] focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden dark:border-white/10 dark:bg-[#10151d]/80"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[--ac-text-3] hover:text-[--ac-text]"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => void loadLeaderboard(true)}
              disabled={refreshing}
              title="Refresh Leaderboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-[--ac-text-3] transition hover:bg-black/5 hover:text-[--ac-text] dark:border-white/10 dark:bg-[#10151d]/80 dark:hover:bg-white/5"
            >
              <RefreshCw
                className={cn(
                  "h-3.5 w-3.5",
                  refreshing && "animate-spin text-teal-500"
                )}
              />
            </button>
          </div>
        </div>

        {/* ================= 3D PODIUM SECTION ================= */}
        <div className="relative pt-6 pb-2">
          <div className="mb-4 text-center">
            <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
              Top Performers
            </h2>
            <p className="text-xs text-[--ac-text-3]">
              The reigning champions setting the benchmark this season
            </p>
          </div>

          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3 md:gap-6">
            {/* 2nd Place (Left) */}
            <div className="order-2 flex flex-col items-center md:order-1">
              {podium2nd ? (
                <PodiumCard
                  entry={podium2nd}
                  rank={2}
                  isMe={Boolean(
                    me && String(podium2nd.userId?._id) === String(me.id)
                  )}
                  variant="silver"
                />
              ) : (
                <EmptyPodiumCard rank={2} variant="silver" />
              )}
              {/* Pedestal step */}
              <div className="hidden h-10 w-full items-center justify-center rounded-t-xl border-x border-t border-slate-300 bg-linear-to-b from-slate-200/70 to-transparent md:flex dark:border-slate-700 dark:from-slate-800/60 dark:to-transparent">
                <span className="font-[Space_Grotesk,sans-serif] text-sm font-bold text-slate-500 dark:text-slate-400">
                  2ND
                </span>
              </div>
            </div>

            {/* 1st Place (Center - Elevated & Glowing) */}
            <div className="order-1 flex flex-col items-center md:order-2">
              {podium1st ? (
                <PodiumCard
                  entry={podium1st}
                  rank={1}
                  isMe={Boolean(
                    me && String(podium1st.userId?._id) === String(me.id)
                  )}
                  variant="gold"
                />
              ) : (
                <EmptyPodiumCard rank={1} variant="gold" />
              )}
              {/* Pedestal step */}
              <div className="hidden h-16 w-full items-center justify-center rounded-t-xl border-x border-t border-amber-400/60 bg-linear-to-b from-amber-400/25 to-transparent md:flex dark:border-amber-500/40 dark:from-amber-500/20 dark:to-transparent">
                <span className="font-[Space_Grotesk,sans-serif] text-base font-extrabold text-amber-600 dark:text-amber-400">
                  1ST CHAMPION
                </span>
              </div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="order-3 flex flex-col items-center">
              {podium3rd ? (
                <PodiumCard
                  entry={podium3rd}
                  rank={3}
                  isMe={Boolean(
                    me && String(podium3rd.userId?._id) === String(me.id)
                  )}
                  variant="bronze"
                />
              ) : (
                <EmptyPodiumCard rank={3} variant="bronze" />
              )}
              {/* Pedestal step */}
              <div className="hidden h-6 w-full items-center justify-center rounded-t-xl border-x border-t border-orange-300 bg-linear-to-b from-orange-200/60 to-transparent md:flex dark:border-orange-800/60 dark:from-orange-950/40 dark:to-transparent">
                <span className="font-[Space_Grotesk,sans-serif] text-xs font-bold text-orange-600 dark:text-orange-400">
                  3RD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RANKED LIST TABLE ================= */}
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#10151d]/80">
          {/* Table Header Info */}
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
            <div>
              <h3 className="font-[Space_Grotesk,sans-serif] text-sm font-bold text-[--ac-text]">
                Global Leaderboard
              </h3>
              <p className="text-xs text-[--ac-text-3]">
                {filtered.length}{" "}
                {filtered.length === 1 ? "participant" : "participants"} ranked
              </p>
            </div>
            <div className="text-xs font-medium text-[--ac-text-3]">
              Tier thresholds update daily
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="hidden grid-cols-12 gap-3 border-b border-black/5 bg-black/2 px-6 py-3 font-[JetBrains_Mono,monospace] text-[11px] font-semibold tracking-wider text-[--ac-text-3] uppercase sm:grid dark:border-white/5 dark:bg-white/2">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-4">Learner</div>
            <div className="col-span-2">Level & Tier</div>
            <div className="col-span-2 text-right">Streak</div>
            <div className="col-span-1 text-right">Accuracy</div>
            <div className="col-span-2 text-right">Total XP</div>
          </div>

          {/* Table Body */}
          {restEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Award className="mb-2 h-10 w-10 text-[--ac-text-3] opacity-40" />
              <p className="font-[Space_Grotesk,sans-serif] text-sm font-semibold text-[--ac-text-2]">
                {search
                  ? `No learners found matching "${search}"`
                  : "No other ranked learners yet."}
              </p>
              <p className="mt-1 text-xs text-[--ac-text-3]">
                Complete practice mocks or module tests to earn XP and appear
                here!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {restEntries.map((entry) => {
                const isMe = Boolean(
                  me && String(entry.userId?._id) === String(me.id)
                )
                const name =
                  entry.userId?.name ||
                  entry.userId?.email ||
                  "Anonymous Learner"
                const isTop10 = entry.rank <= 10

                return (
                  <div
                    key={`${entry.rank}-${entry.userId?._id}`}
                    className={cn(
                      "group flex flex-col gap-3 px-4 py-3.5 transition-all sm:grid sm:grid-cols-12 sm:items-center sm:gap-3 sm:px-6",
                      isMe
                        ? "border-l-4 border-l-teal-500 bg-teal-500/10 dark:bg-teal-400/10"
                        : "hover:bg-black/2 dark:hover:bg-white/2"
                    )}
                  >
                    {/* Primary Row: Rank + Avatar + Name + XP */}
                    <div className="flex items-center gap-3 sm:contents">
                      {/* Rank */}
                      <div className="w-8 shrink-0 text-center sm:col-span-1 sm:w-auto">
                        {isTop10 ? (
                          <span className="inline-flex items-center justify-center rounded-lg bg-purple-500/10 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-xs font-bold text-purple-600 dark:bg-purple-400/15 dark:text-purple-300">
                            #{entry.rank}
                          </span>
                        ) : (
                          <span className="font-[JetBrains_Mono,monospace] text-xs font-semibold text-[--ac-text-3]">
                            #{entry.rank}
                          </span>
                        )}
                      </div>

                      {/* Learner Info */}
                      <div className="flex min-w-0 flex-1 items-center gap-3 sm:col-span-4">
                        <AvatarFrame
                          border={resolveAvatarBorder(
                            entry.avatarBorder,
                            entry.level
                          )}
                          size="sm"
                          shape="rounded"
                        >
                          {entry.avatarUrl ? (
                            <img
                              src={entry.avatarUrl}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-[JetBrains_Mono,monospace] text-xs font-bold text-[--ac-text]">
                              {getInitials(name)}
                            </div>
                          )}
                        </AvatarFrame>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate text-xs font-semibold text-[--ac-text] sm:text-sm">
                            <span className="truncate">{name}</span>
                            {isMe && (
                              <span className="shrink-0 rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-300">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="truncate text-[11px] text-[--ac-text-3] sm:hidden">
                            Lvl {entry.level} ·{" "}
                            {Math.round(entry.averageAccuracy)}% Acc
                          </p>
                        </div>
                      </div>

                      {/* Level & Tier (Desktop) */}
                      <div className="hidden sm:col-span-2 sm:block">
                        <span className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-black/5 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[11px] font-semibold text-[--ac-text-2] dark:border-white/10 dark:bg-white/5">
                          Lvl {entry.level}
                        </span>
                      </div>

                      {/* Streak (Desktop) */}
                      <div className="hidden gap-1.5 sm:col-span-2 sm:flex sm:items-center sm:justify-end">
                        {typeof entry.streak === "number" &&
                        entry.streak > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-xs font-bold text-orange-600 dark:text-orange-400">
                            <Flame className="h-3 w-3 animate-pulse fill-orange-500 text-orange-500" />
                            {entry.streak}d
                          </span>
                        ) : (
                          <span className="font-[JetBrains_Mono,monospace] text-xs text-[--ac-text-3]">
                            —
                          </span>
                        )}
                      </div>

                      {/* Accuracy (Desktop) */}
                      <div className="hidden sm:col-span-1 sm:block sm:text-right">
                        <span
                          className={cn(
                            "font-[JetBrains_Mono,monospace] text-xs font-bold",
                            entry.averageAccuracy >= 80
                              ? "text-teal-600 dark:text-teal-400"
                              : entry.averageAccuracy >= 60
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-[--ac-text-3]"
                          )}
                        >
                          {Math.round(entry.averageAccuracy)}%
                        </span>
                      </div>

                      {/* Total XP */}
                      <div className="shrink-0 text-right sm:col-span-2">
                        <span className="font-[JetBrains_Mono,monospace] text-xs font-bold text-teal-600 sm:text-sm dark:text-teal-400">
                          {formatNumber(entry.totalXP)} XP
                        </span>
                      </div>
                    </div>

                    {/* Mobile Badges Row */}
                    <div className="flex items-center gap-2 pl-11 sm:hidden">
                      {typeof entry.streak === "number" && entry.streak > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-0.5 text-[10.5px] font-bold text-orange-600 dark:text-orange-400">
                          <Flame className="h-3 w-3 fill-orange-500" />
                          {entry.streak}d streak
                        </span>
                      )}
                      <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10.5px] font-medium text-[--ac-text-3] dark:bg-white/5">
                        {entry.totalTestsTaken} tests
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type PodiumCardProps = {
  entry: LeaderboardEntry
  rank: 1 | 2 | 3
  isMe: boolean
  variant: "gold" | "silver" | "bronze"
}

function PodiumCard({ entry, rank, isMe, variant }: PodiumCardProps) {
  const name = entry.userId?.name || entry.userId?.email || "Anonymous"

  const configs = {
    gold: {
      crown: true,
      border: "border-amber-400/60 dark:border-amber-400/40",
      bg: "bg-linear-to-b from-amber-500/20 via-amber-500/5 to-transparent",
      badgeBg: "bg-linear-to-r from-amber-500 to-yellow-400 text-slate-950",
      avatarRing: "ring-4 ring-amber-400/70 shadow-lg shadow-amber-500/30",
      xpColor: "text-amber-500 dark:text-amber-400",
      height: "md:min-h-[300px]",
      shadow: "shadow-xl shadow-amber-500/10",
      title: "Champion",
    },
    silver: {
      crown: false,
      border: "border-slate-300 dark:border-slate-600/50",
      bg: "bg-linear-to-b from-slate-200/40 via-white/10 to-transparent dark:from-slate-700/30 dark:via-slate-800/10 dark:to-transparent",
      badgeBg:
        "bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100",
      avatarRing: "ring-4 ring-slate-300 dark:ring-slate-500/60 shadow-md",
      xpColor: "text-slate-600 dark:text-slate-300",
      height: "md:min-h-[260px]",
      shadow: "shadow-lg shadow-slate-500/5",
      title: "Runner-Up",
    },
    bronze: {
      crown: false,
      border: "border-orange-300 dark:border-orange-500/40",
      bg: "bg-linear-to-b from-orange-400/20 via-orange-500/5 to-transparent dark:from-orange-800/20 dark:via-orange-900/10 dark:to-transparent",
      badgeBg:
        "bg-orange-300 dark:bg-orange-600 text-orange-950 dark:text-orange-100",
      avatarRing: "ring-4 ring-orange-400/60 shadow-md",
      xpColor: "text-orange-600 dark:text-orange-400",
      height: "md:min-h-[240px]",
      shadow: "shadow-lg shadow-orange-500/5",
      title: "Third Place",
    },
  }

  const c = configs[variant]

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-between rounded-3xl border p-5 text-center backdrop-blur-xl transition-all hover:-translate-y-1",
        c.border,
        c.bg,
        c.height,
        c.shadow,
        isMe && "ring-2 ring-teal-400"
      )}
    >
      {/* Top Floating Badge */}
      <div className="flex items-center gap-1.5">
        {c.crown && (
          <Crown className="h-5 w-5 animate-bounce fill-amber-400 text-amber-500" />
        )}
        <span
          className={cn(
            "rounded-full px-3 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] font-extrabold tracking-wider uppercase",
            c.badgeBg
          )}
        >
          #{rank} · {c.title}
        </span>
      </div>

      {/* Avatar with Gaming Border */}
      <div className="my-3 flex flex-col items-center">
        <AvatarFrame
          border={resolveAvatarBorder(
            entry.avatarBorder ||
              (rank === 1
                ? "solar_phoenix"
                : rank === 2
                  ? "prismatic_crystal"
                  : "valkyrie_wings"),
            entry.level
          )}
          size="xl"
          shape="rounded"
        >
          {entry.avatarUrl ? (
            <Image
              src={entry.avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-[Space_Grotesk,sans-serif] text-base font-extrabold text-[--ac-text]">
              {getInitials(name)}
            </div>
          )}
        </AvatarFrame>

        <p className="mt-3 max-w-40 truncate font-[Space_Grotesk,sans-serif] text-sm font-bold text-[--ac-text]">
          {isMe ? `${name.split(" ")[0]} (You)` : name}
        </p>

        <p
          className={cn(
            "font-[JetBrains_Mono,monospace] text-base font-extrabold",
            c.xpColor
          )}
        >
          {formatNumber(entry.totalXP)} XP
        </p>
      </div>

      {/* Stats Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="rounded-lg border border-black/10 bg-black/5 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-medium text-[--ac-text-2] dark:border-white/10 dark:bg-white/5">
          Lvl {entry.level}
        </span>
        {typeof entry.streak === "number" && entry.streak > 0 && (
          <span className="flex items-center gap-0.5 rounded-lg bg-orange-500/10 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold text-orange-600 dark:text-orange-400">
            <Flame className="h-3 w-3 fill-orange-500" />
            {entry.streak}d
          </span>
        )}
        <span className="rounded-lg border border-black/10 bg-black/5 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-medium text-[--ac-text-2] dark:border-white/10 dark:bg-white/5">
          {Math.round(entry.averageAccuracy)}% Acc
        </span>
      </div>
    </div>
  )
}

function EmptyPodiumCard({
  rank,
  variant,
}: {
  rank: 1 | 2 | 3
  variant: "gold" | "silver" | "bronze"
}) {
  return (
    <div className="flex h-56 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-black/15 bg-black/2 p-5 text-center dark:border-white/15 dark:bg-white/2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-black/20 text-xs font-bold text-[--ac-text-3] dark:border-white/20">
        #{rank}
      </div>
      <p className="mt-2 text-xs font-semibold text-[--ac-text-3]">
        Spot Available
      </p>
      <p className="text-[11px] text-[--ac-text-3] opacity-60">
        Climb up to take this rank!
      </p>
    </div>
  )
}
