"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import type { LucideIcon } from "lucide-react"
import {
  Crown,
  Flame,
  Lock,
  Medal,
  Share2,
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

const RARITY_ACCENT: Record<AchievementRarity, string> = {
  common: "#8a96a8",
  rare: "#6ee7c9",
  epic: "#6f2699",
  legendary: "#f5a623",
}

const criteriaLabels: Record<AchievementCriteria, string> = {
  score: "Score target",
  streak: "Day streak",
  test_count: "Tests completed",
  accuracy: "Accuracy target",
  time_spent: "Time spent",
}

const criteriaIcons: Record<AchievementCriteria, LucideIcon> = {
  score: Trophy,
  streak: Flame,
  test_count: Target,
  accuracy: Star,
  time_spent: Zap,
}

const rarityTabs: Array<"all" | AchievementRarity> = [
  "all",
  "common",
  "rare",
  "epic",
  "legendary",
]

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

  return new Intl.DateTimeFormat("en", {
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
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

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

  const filteredAchievements = useMemo(
    () =>
      achievements.filter((achievement) => {
        if (filter === "unlocked" && !achievement.earned) return false
        if (filter === "locked" && achievement.earned) return false
        if (rarityFilter !== "all" && achievement.rarity !== rarityFilter)
          return false
        return true
      }),
    [achievements, filter, rarityFilter]
  )

  const totalUnlocked = achievements.filter(
    (achievement) => achievement.earned
  ).length
  const totalXP = achievements
    .filter((achievement) => achievement.earned)
    .reduce((sum, achievement) => sum + achievement.pointsReward, 0)
  const rareEarned = achievements.filter(
    (a) => a.rarity === "rare" && a.earned
  ).length
  const legendaryEarned = achievements.filter(
    (a) => a.rarity === "legendary" && a.earned
  ).length

  const handleShare = async (achievementName: string) => {
    const shareText = `I unlocked the "${achievementName}" achievement on AptiCore!`

    if (navigator.share) {
      await navigator
        .share({ title: "AptiCore Achievement", text: shareText })
        .catch(() => undefined)
      return
    }

    await navigator.clipboard?.writeText(shareText)
  }

  const summaryCards = [
    {
      label: "Total Earned",
      value: totalUnlocked,
      icon: Trophy,
      color: "#e7ecf3",
    },
    { label: "Total XP", value: totalXP, icon: Zap, color: "#6f2699" },
    { label: "Rare Earned", value: rareEarned, icon: Star, color: "#6ee7c9" },
    {
      label: "Legendaries",
      value: legendaryEarned,
      icon: Crown,
      color: "#f5a623",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-[#16191f] font-[Inter,sans-serif] text-foreground transition-colors duration-300">
      <div className="max-w-8xl mx-auto space-y-6 px-4 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="bg-linear-to-r from-[#6ee7c9] via-[#8b7cf6] to-[#f5a623] bg-clip-text font-[Space_Grotesk,sans-serif] text-3xl font-bold text-transparent md:text-4xl">
              Achievements
            </h1>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              Track your milestones and earn rewards
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-[rgba(110,231,201,0.35)] bg-[rgba(110,231,201,0.1)] px-3 py-1.5 font-[JetBrains_Mono,monospace] text-[11.5px] font-semibold text-[#6ee7c9]">
              <Trophy className="h-3 w-3" />
              {totalUnlocked}/{achievements.length} Unlocked
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-[rgba(139,124,246,0.35)] bg-[rgba(139,124,246,0.1)] px-3 py-1.5 font-[JetBrains_Mono,monospace] text-[11.5px] font-semibold text-[#8b7cf6]">
              <Zap className="h-3 w-3" />
              {totalXP} XP Earned
            </span>
          </div>
        </div>

        {/* Unlocked / locked filter */}
        <div className="flex flex-wrap gap-2">
          {(["all", "unlocked", "locked"] as const).map((key) => {
            const Icon =
              key === "unlocked" ? Trophy : key === "locked" ? Lock : null
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 rounded-sm border px-4 py-2 text-[13px] font-semibold capitalize transition ${
                  filter === key
                    ? "border-transparent bg-linear-to-r from-[#6ee7c9] to-[#5cceae] text-[#06120d]"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {key}
              </button>
            )
          })}
        </div>

        {error ? (
          <div className="rounded-sm shadow shadow-slate-300  dark:shadow-none border-2 border-[rgba(242,85,90,0.3)] bg-[rgba(242,85,90,0.06)] py-12 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-[#f2555a]/50" />
            <p className="font-semibold text-[#f2555a]">
              Could not load achievements
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            {/* Rarity tabs */}
            <div className="grid grid-cols-5 gap-1.5 rounded-sm border border-border bg-card p-1.5">
              {rarityTabs.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setRarityFilter(rarity)}
                  className={`rounded-sm px-2 py-2 font-[JetBrains_Mono,monospace] text-[11px] font-semibold capitalize transition ${
                    rarityFilter === rarity
                      ? "bg-linear-to-r from-[#6ee7c9] to-[#57c9a8] text-[#06120d]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 animate-pulse rounded-sm bg-muted" />
                      <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAchievements.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAchievements.map((achievement) => {
                  const Icon = criteriaIcons[achievement.criteriaType] || Medal
                  const accent = RARITY_ACCENT[achievement.rarity]

                  return (
                    <div
                      key={achievement._id}
                      className={`relative overflow-hidden rounded-sm shadow shadow-slate-300  dark:shadow-none border p-2 transition ${
                        achievement.earned ? "" : "opacity-80"
                      }`}
                      style={{
                        background: achievement.earned
                          ? `${accent}65`
                          : isDark
                            ? "#0b1017"
                            : "#f8fafc",
                      }}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className="rounded-sm border p-3 dark:border-slate-200 border-slate-800 "
                          
                        >
                          <Icon
                            className="h-6 w-6 dark:text-slate-200 "
                            
                          />
                        </div>
                        <span
                          className="rounded-full border border-slate-800 dark:border-slate-300 px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10px] font-semibold tracking-wide uppercase"
                        >
                          {achievement.rarity}
                        </span>
                      </div>

                      <h3 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-[16px] font-bold">
                        {achievement.name}
                      </h3>
                      <p className="mb-4 min-h-10 text-[13px] leading-5.5 text-muted-foreground">
                        {achievement.description ||
                          `${criteriaLabels[achievement.criteriaType]}: ${formatRequirement(achievement)}`}
                      </p>

                      {achievement.earned ? (
                        <div className="space-y-3">
                          <div
                            className="flex items-center gap-1.5 font-[JetBrains_Mono,monospace] text-[12px] font-semibold"
                          >
                            <Trophy className="h-3.5 w-3.5" />
                            {formatDate(achievement.unlockedAt)}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="flex items-center gap-1 rounded-full border px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[11px] font-semibold"
                              style={{
                                borderColor: achievement.earned
                                  ? `${accent}50`
                                  : isDark
                                    ? "#26303d"
                                    : "#d7dee8",
                                backgroundColor: achievement.earned
                                  ? `${accent}60`
                                  : isDark
                                    ? "#111822"
                                    : "#eef2f7",
                              }}
                            >
                              <Zap className="h-3 w-3" />+
                              {achievement.pointsReward} XP
                            </span>
                            <button
                              onClick={() => handleShare(achievement.name)}
                              aria-label={`Share ${achievement.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3 text-[13px]">
                            <span className="text-muted-foreground">
                              {criteriaLabels[achievement.criteriaType]}
                            </span>
                            <span className="font-semibold">
                              {formatRequirement(achievement)}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted" />
                          <div className="flex items-center gap-1 font-[JetBrains_Mono,monospace] text-[11px] text-muted-foreground">
                            <Zap className="h-3 w-3" />
                            {achievement.pointsReward} XP reward
                          </div>
                        </div>
                      )}

                      {!achievement.earned && (
                        <div
                          className={`pointer-events-none absolute inset-0 flex items-center justify-center backdrop-blur-[1px] ${
                            isDark ? "bg-black/40" : "bg-white/45"
                          }`}
                        >
                          <Lock className="h-8 w-8 text-muted-foreground/60" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-sm shadow shadow-slate-300  dark:shadow-none border-2 border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.05)] py-12 text-center">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-[#6ee7c9]/40" />
                <p className="text-[13.5px] text-muted-foreground">
                  No achievements found
                </p>
              </div>
            )}
          </>
        )}

        {/* Summary cards */}
        <div className="grid gap-3.5 md:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-sm shadow shadow-slate-300  dark:shadow-none border bg-card p-5 transition-colors duration-300"
            >
              <div
                className="mb-3 flex items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] tracking-wider uppercase"
                style={{ color: card.color }}
              >
                <card.icon className="h-5 w-5" />
                {card.label}
              </div>
              <p
                className="font-[Space_Grotesk,sans-serif] text-3xl font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
