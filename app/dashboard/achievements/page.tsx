"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Flame,
  Lock,
  Medal,
  Search,
  Share2,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react"

type AchievementRarity = "common" | "rare" | "epic" | "legendary"
type AchievementCriteria =
  | "score"
  | "streak"
  | "test_count"
  | "accuracy"
  | "time_spent"

type Achievement = {
  _id: string
  name: string
  description?: string
  iconUrl?: string
  criteriaType: AchievementCriteria
  criteriaValue: number
  pointsReward: number
  rarity: AchievementRarity
  earned?: boolean
  unlockedAt?: string
}

type UserAchievement = {
  achievementId:
    | string
    | {
        _id: string
      }
  unlockedAt?: string
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

const RARITY_THEMES: Record<
  AchievementRarity,
  {
    name: string
    color: string
    bg: string
    border: string
    glow: string
    badgeBg: string
    text: string
  }
> = {
  common: {
    name: "Common",
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.08)",
    border: "rgba(148, 163, 184, 0.25)",
    glow: "rgba(148, 163, 184, 0.15)",
    badgeBg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    text: "text-slate-400",
  },
  rare: {
    name: "Rare",
    color: "#3ecf8e",
    bg: "rgba(62, 207, 142, 0.08)",
    border: "rgba(62, 207, 142, 0.3)",
    glow: "rgba(62, 207, 142, 0.25)",
    badgeBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30",
    text: "text-emerald-500 dark:text-emerald-400",
  },
  epic: {
    name: "Epic",
    color: "#9933ff",
    bg: "rgba(153, 51, 255, 0.08)",
    border: "rgba(139, 124, 246, 0.3)",
    glow: "rgba(139, 124, 246, 0.25)",
    badgeBg: "bg-purple-500/10 text-purple-500 dark:text-purple-200 border-purple-500/30",
    text: "text-purple-500 dark:text-purple-300",
  },
  legendary: {
    name: "Legendary",
    color: "#f5a623",
    bg: "rgba(245, 166, 35, 0.08)",
    border: "rgba(245, 166, 35, 0.35)",
    glow: "rgba(245, 166, 35, 0.3)",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/35",
    text: "text-amber-500 dark:text-amber-400",
  },
}

const criteriaLabels: Record<AchievementCriteria, string> = {
  score: "Score Target",
  streak: "Day Streak",
  test_count: "Tests Completed",
  accuracy: "Accuracy Target",
  time_spent: "Practice Minutes",
}

const criteriaIcons: Record<AchievementCriteria, LucideIcon> = {
  score: Trophy,
  streak: Flame,
  test_count: Target,
  accuracy: Star,
  time_spent: Zap,
}

function getAchievementId(userAchievement: UserAchievement) {
  return typeof userAchievement.achievementId === "string"
    ? userAchievement.achievementId
    : userAchievement.achievementId._id
}

function formatRequirement(achievement: Achievement) {
  if (
    achievement.criteriaType === "accuracy" ||
    achievement.criteriaType === "score"
  ) {
    return `${achievement.criteriaValue}%`
  }

  if (achievement.criteriaType === "time_spent") {
    return `${achievement.criteriaValue} min`
  }

  return achievement.criteriaValue.toLocaleString()
}

function formatDate(value?: string) {
  if (!value) return "Recently unlocked"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all")
  const [rarityFilter, setRarityFilter] = useState<"all" | AchievementRarity>(
    "all"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadAchievements() {
      setIsLoading(true)
      setError(null)

      try {
        const achievementsResponse = await fetch("/api/achievements", {
          credentials: "include",
        })
        const achievementsJson =
          (await achievementsResponse.json()) as ApiResponse<Achievement[]>

        if (!achievementsResponse.ok || !achievementsJson.success) {
          throw new Error(
            achievementsJson.error || "Failed to fetch achievements"
          )
        }

        const userAchievementsJson = await fetch("/api/achievements/user", {
          credentials: "include",
        })
          .then(async (response) => {
            if (!response.ok) return null
            return (await response.json()) as ApiResponse<UserAchievement[]>
          })
          .catch(() => null)

        const unlockedDates = new Map(
          userAchievementsJson?.data?.map((userAchievement) => [
            getAchievementId(userAchievement),
            userAchievement.unlockedAt,
          ]) || []
        )

        const mergedAchievements = (achievementsJson.data || []).map(
          (achievement) => ({
            ...achievement,
            earned: unlockedDates.has(achievement._id),
            unlockedAt: unlockedDates.get(achievement._id),
          })
        )

        if (isMounted) {
          setAchievements(mergedAchievements)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load achievements"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAchievements()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      if (filter === "unlocked" && !achievement.earned) return false
      if (filter === "locked" && achievement.earned) return false
      if (rarityFilter !== "all" && achievement.rarity !== rarityFilter)
        return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = achievement.name.toLowerCase().includes(q)
        const descMatch = (achievement.description || "")
          .toLowerCase()
          .includes(q)
        if (!nameMatch && !descMatch) return false
      }
      return true
    })
  }, [achievements, filter, rarityFilter, searchQuery])

  const totalUnlocked = achievements.filter((a) => a.earned).length
  const totalLocked = achievements.length - totalUnlocked
  const totalXP = achievements
    .filter((a) => a.earned)
    .reduce((sum, a) => sum + (a.pointsReward || 0), 0)
  const totalAvailableXP = achievements.reduce(
    (sum, a) => sum + (a.pointsReward || 0),
    0
  )
  const rareEarned = achievements.filter(
    (a) => a.rarity === "rare" && a.earned
  ).length
  const legendaryEarned = achievements.filter(
    (a) => a.rarity === "legendary" && a.earned
  ).length

  const completionPct =
    achievements.length > 0
      ? Math.round((totalUnlocked / achievements.length) * 100)
      : 0

  const handleShare = async (achievement: Achievement) => {
    const shareText = `🏆 I unlocked the "${achievement.name}" milestone on AptiCore (+${achievement.pointsReward} XP)!`

    if (navigator.share) {
      await navigator
        .share({ title: "AptiCore Milestone", text: shareText })
        .catch(() => undefined)
      return
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      setCopiedId(achievement._id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ================= HERO BANNER ================= */}
        <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-linear-to-br from-teal-500/10 via-purple-500/5 to-amber-500/10 p-6 sm:p-8 backdrop-blur-md shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/2 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Hall of Honors & Recognition</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold tracking-tight text-[--ac-text] sm:text-4xl">
                Achievements & Badges
              </h1>
              <p className="text-sm leading-relaxed text-[--ac-text-3]">
                Level up your campus placement readiness by completing timed mock
                challenges, building streaks, and earning prestigious milestone badges.
              </p>
            </div>

            {/* Overall Progress Gauge */}
            <div className="flex flex-col gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#10151d]/80 p-4.5 backdrop-blur-sm shadow-sm sm:w-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[--ac-text-2]">
                  Badge Completion
                </span>
                <span className="font-[JetBrains_Mono,monospace] text-xs font-bold text-teal-600 dark:text-teal-400">
                  {completionPct}% Complete
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] via-[#8b7cf6] to-[#f5a623] transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[--ac-text-3]">
                <span>{totalUnlocked} unlocked</span>
                <span>{totalLocked} locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4 METRIC KPI STAT CARDS ================= */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: Total Badges */}
          <div className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-4.5 shadow-sm transition hover:border-teal-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Unlocked Badges
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[--ac-text] sm:text-3xl">
              {totalUnlocked}
              <span className="ml-1 text-xs font-normal text-[--ac-text-3]">
                / {achievements.length}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              {totalUnlocked > 0
                ? `${completionPct}% of total syllabus badges`
                : "Begin tests to earn your first"}
            </p>
          </div>

          {/* Card 2: Total XP Earned */}
          <div className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-4.5 shadow-sm transition hover:border-purple-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Achievement XP
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-purple-600 dark:text-purple-300 sm:text-3xl">
              +{totalXP.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              of {totalAvailableXP.toLocaleString()} total available XP
            </p>
          </div>

          {/* Card 3: Rare Badges */}
          <div className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-4.5 shadow-sm transition hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Rare Achievements
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <Star className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-emerald-500 dark:text-emerald-400 sm:text-3xl">
              {rareEarned}
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              High difficulty benchmarks
            </p>
          </div>

          {/* Card 4: Legendary Badges */}
          <div className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-4.5 shadow-sm transition hover:border-amber-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Legendary Honors
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-amber-600 dark:text-amber-400 sm:text-3xl">
              {legendaryEarned}
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              Elite placement cohort status
            </p>
          </div>
        </div>

        {/* ================= FILTER AND SEARCH CONTROLS ================= */}
        <div className="flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-black/5 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-1">
            {(
              [
                { id: "all", label: "All", count: achievements.length },
                { id: "unlocked", label: "Unlocked", count: totalUnlocked },
                { id: "locked", label: "Locked", count: totalLocked },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-white dark:bg-[#1a2332] text-[--ac-text] shadow-xs"
                      : "text-[--ac-text-3] hover:text-[--ac-text]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      active
                        ? "bg-teal-500/15 text-teal-600 dark:text-teal-300"
                        : "bg-slate-200 dark:bg-white/10 text-[--ac-text-3]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Rarity & Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Rarity Pills */}
            <div className="flex flex-wrap items-center gap-1">
              {(["all", "common", "rare", "epic", "legendary"] as const).map(
                (rarity) => {
                  const active = rarityFilter === rarity
                  return (
                    <button
                      key={rarity}
                      onClick={() => setRarityFilter(rarity)}
                      className={`rounded-full px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[11px] font-semibold capitalize transition ${
                        active
                          ? "border border-teal-500/40 bg-teal-500/15 text-teal-600 dark:text-teal-300"
                          : "border border-transparent text-[--ac-text-3] hover:text-[--ac-text]"
                      }`}
                    >
                      {rarity}
                    </button>
                  )
                }
              )}
            </div>

            {/* Quick Search */}
            <div className="relative min-w-48 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-1.5 pr-3 pl-8 text-xs text-[--ac-text] placeholder:text-[--ac-text-3] outline-none transition focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* ================= ACHIEVEMENT CARDS GRID ================= */}
        {error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-10 text-center">
            <Trophy className="mx-auto mb-3 h-10 w-10 text-rose-500/60" />
            <h3 className="font-semibold text-rose-500">Failed to load milestones</h3>
            <p className="mt-1 text-xs text-[--ac-text-3]">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-5 shadow-sm animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-white/10" />
                  <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : filteredAchievements.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => {
              const theme = RARITY_THEMES[achievement.rarity] || RARITY_THEMES.common
              const Icon = criteriaIcons[achievement.criteriaType] || Medal
              const isEarned = Boolean(achievement.earned)

              return (
                <div
                  key={achievement._id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isEarned
                      ? "border-transparent"
                      : "border-black/10 dark:border-white/10 bg-slate-50/70 dark:bg-[#0c1017]/60"
                  }`}
                  style={{
                    background: isEarned
                      ? `linear-gradient(135deg, ${theme.color}95 0%, ${theme.color}70 55%, #ffffff60 100%)`
                      : undefined,
                    boxShadow: isEarned
                      ? `0 6px 24px -2px ${theme.glow}`
                      : undefined,
                  }}
                >
                  {/* Shimmer on hover */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <div>
                    {/* Top Row: Icon + Rarity & XP Badge */}
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105"
                        style={{
                          borderColor: isEarned ? `${theme.color}80` : theme.border,
                          backgroundColor: isEarned ? `${theme.color}` : theme.bg,
                          color: isEarned ? "#06120d" : theme.color,
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold tracking-wider uppercase ${
                            isEarned
                              ? "border-slate-900/30 bg-black/15 text-slate-950"
                              : theme.badgeBg
                          }`}
                        >
                          {achievement.rarity}
                        </span>
                        <span
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold ${
                            isEarned
                              ? "border-slate-900/30 bg-black/15 text-slate-950"
                              : "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-300"
                          }`}
                        >
                          <Zap className="h-3 w-3 fill-current" />
                          +{achievement.pointsReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3
                      className={`font-[Space_Grotesk,sans-serif] text-base font-bold ${
                        isEarned
                          ? "text-slate-950 font-extrabold"
                          : "text-[--ac-text]"
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isEarned
                          ? "text-slate-900 font-medium"
                          : "text-[--ac-text-3]"
                      }`}
                    >
                      {achievement.description ||
                        `${criteriaLabels[achievement.criteriaType]}: ${formatRequirement(achievement)}`}
                    </p>
                  </div>

                  {/* Bottom Status Section */}
                  <div
                    className={`mt-5 border-t pt-3.5 ${
                      isEarned
                        ? "border-slate-900/15 dark:border-black/20"
                        : "border-black/5 dark:border-white/5"
                    }`}
                  >
                    {isEarned ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-950">
                          <CheckCircle2 className="h-3.5 w-3.5 fill-slate-950/20 text-slate-950" />
                          <span className="text-[11px] font-[JetBrains_Mono,monospace]">
                            {formatDate(achievement.unlockedAt)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleShare(achievement)}
                          title="Share achievement"
                          className="inline-flex items-center gap-1 rounded-md border border-slate-900/25 bg-white/40 dark:bg-black/10 px-2.5 py-1 text-[11px] font-bold text-slate-950 transition hover:bg-white/70"
                        >
                          {copiedId === achievement._id ? (
                            <>
                              <Check className="h-3 w-3 text-slate-950" />
                              <span className="text-slate-950">Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="h-3 w-3" />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[--ac-text-3]">
                          <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          <span className="text-[11px]">
                            Requires {formatRequirement(achievement)}{" "}
                            {criteriaLabels[achievement.criteriaType].toLowerCase()}
                          </span>
                        </div>
                        <Link
                          href="/dashboard/tests"
                          className="flex items-center gap-0.5 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          Unlock <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-12 text-center">
            <Trophy className="mx-auto mb-3 h-10 w-10 text-[--ac-text-3]" />
            <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
              No matching achievements found
            </h3>
            <p className="mt-1 text-xs text-[--ac-text-3]">
              Try adjusting your search query or filters.
            </p>
            <button
              onClick={() => {
                setFilter("all")
                setRarityFilter("all")
                setSearchQuery("")
              }}
              className="mt-4 rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-300 hover:bg-teal-500 hover:text-black transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
