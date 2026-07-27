"use client"

import { useEffect, useMemo, useState } from "react"
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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const rarityColors: Record<AchievementRarity, string> = {
  common: "from-slate-500/20 to-slate-500/5 border-slate-500/30",
  rare: "from-sky-500/20 to-sky-500/5 border-sky-500/30",
  epic: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  legendary: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30",
}

const rarityTextColors: Record<AchievementRarity, string> = {
  common: "text-slate-400",
  rare: "text-sky-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
}

const rarityBadgeColors: Record<AchievementRarity, string> = {
  common: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  rare: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
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
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        if (filter === "unlocked") return achievement.earned
        if (filter === "locked") return !achievement.earned
        return true
      }),
    [achievements, filter]
  )

  const totalUnlocked = achievements.filter(
    (achievement) => achievement.earned
  ).length
  const totalXP = achievements
    .filter((achievement) => achievement.earned)
    .reduce((sum, achievement) => sum + achievement.pointsReward, 0)

  const handleShare = async (achievementName: string) => {
    const shareText = `I unlocked the "${achievementName}" achievement on AptiCore!`

    if (navigator.share) {
      await navigator
        .share({
          title: "AptiCore Achievement",
          text: shareText,
        })
        .catch(() => undefined)
      return
    }

    await navigator.clipboard?.writeText(shareText)
  }

  return (
    <div className="min-h-screen mt-15 sm:mt-2 space-y-6 bg-linear-to-b from-background to-background/50 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-linear-to-r from-sky-400 via-purple-400 to-yellow-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Achievements
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your milestones and earn rewards
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 border-sky-500/30 bg-sky-500/10 text-sky-400">
            <Trophy className="h-3 w-3" />
            {totalUnlocked}/{achievements.length} Unlocked
          </Badge>
          <Badge variant="secondary" className="gap-1.5 border-purple-500/30 bg-purple-500/10 text-purple-400">
            <Zap className="h-3 w-3" />
            {totalXP} XP Earned
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-linear-to-r from-sky-500 to-sky-600" : ""}
        >
          All
        </Button>
        <Button
          variant={filter === "unlocked" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unlocked")}
          className={`gap-2 ${filter === "unlocked" ? "bg-linear-to-r from-gray-250 to-gray-300" : ""}`}
        >
          <Trophy className="h-4 w-4" />
          Unlocked
        </Button>
        <Button
          variant={filter === "locked" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("locked")}
          className={`gap-2 ${filter === "locked" ? "bg-linear-to-r from-gray-250 to-gray-300" : ""}`}
        >
          <Lock className="h-4 w-4" />
          Locked
        </Button>
      </div>

      {error ? (
        <Card className="border-2 border-red-500/30 bg-linear-to-br from-red-500/10 to-red-500/5">
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-red-400/50" />
            <p className="font-medium text-red-400">Could not load achievements</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-5 gap-1">
            {rarityTabs.map((rarity) => (
              <TabsTrigger 
                key={rarity} 
                value={rarity} 
                className="capitalize text-xs data-[state=active]:bg-linear-to-r data-[state=active]:from-sky-500 data-[state=active]:to-sky-600 data-[state=active]:text-white"
              >
                {rarity}
              </TabsTrigger>
            ))}
          </TabsList>

          {rarityTabs.map((rarity) => {
            const tabAchievements = filteredAchievements.filter(
              (achievement) => rarity === "all" || achievement.rarity === rarity
            )

            return (
              <TabsContent key={rarity} value={rarity} className="mt-6">
                {isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index}>
                        <CardContent className="space-y-4 pt-6">
                          <div className="flex items-start justify-between">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : tabAchievements.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tabAchievements.map((achievement) => {
                      const Icon =
                        criteriaIcons[achievement.criteriaType] || Medal
                      const progressValue = achievement.earned ? 100 : 0

                      return (
                        <Card
                          key={achievement._id}
                          className={`relative overflow-hidden border-2 bg-linear-to-br ${
                            rarityColors[achievement.rarity]
                          } ${!achievement.earned ? "opacity-60 backdrop-blur-sm" : ""}`}
                        >
                          <CardContent className="pt-6">
                            <div className="mb-4 flex items-start justify-between">
                              <div
                                className={`rounded-xl p-3 ${
                                  achievement.earned
                                    ? "bg-linear-to-br from-background to-background/80"
                                    : "bg-muted/50"
                                }`}
                              >
                                <Icon
                                  className={`h-6 w-6 ${
                                    achievement.earned
                                      ? rarityTextColors[achievement.rarity]
                                      : "text-muted-foreground/50"
                                  }`}
                                />
                              </div>
                              <Badge
                                className={`capitalize border-2 font-semibold ${
                                  rarityBadgeColors[achievement.rarity]
                                }`}
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>

                            <h3 className="mb-2 text-lg font-bold">
                              {achievement.name}
                            </h3>
                            <p className="mb-4 min-h-10 text-sm text-muted-foreground">
                              {achievement.description ||
                                `${criteriaLabels[achievement.criteriaType]}: ${formatRequirement(
                                  achievement
                                )}`}
                            </p>

                            {achievement.earned ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div className={`flex items-center gap-1.5 text-sm font-medium ${rarityTextColors[achievement.rarity]}`}>
                                    <Trophy className="h-4 w-4" />
                                    <span>
                                      {formatDate(achievement.unlockedAt)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <Badge variant="outline" className={`gap-1 border-2 ${rarityBadgeColors[achievement.rarity]}`}>
                                    <Zap className="h-3 w-3" />+
                                    {achievement.pointsReward} XP
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleShare(achievement.name)
                                    }
                                    className="h-8 w-8"
                                    aria-label={`Share ${achievement.name}`}
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                  <span className="text-muted-foreground">
                                    {criteriaLabels[achievement.criteriaType]}
                                  </span>
                                  <span className="font-semibold">
                                    {formatRequirement(achievement)}
                                  </span>
                                </div>
                                <Progress
                                  value={progressValue}
                                  className="h-2.5"
                                />
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Zap className="h-3 w-3" />
                                  <span>
                                    {achievement.pointsReward} XP reward
                                  </span>
                                </div>
                              </div>
                            )}
                          </CardContent>

                          {!achievement.earned && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-xs/20">
                              <Lock className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="border-2 border-sky-500/30 bg-linear-to-br from-sky-500/10 to-sky-500/5">
                    <CardContent className="py-12 text-center">
                      <Trophy className="mx-auto mb-4 h-12 w-12 text-sky-400/50" />
                      <p className="text-muted-foreground">
                        No achievements found
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-slate-500/30 bg-linear-to-br from-slate-500/10 to-slate-500/5">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-slate-400">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Total Earned</span>
            </div>
            <p className="text-3xl font-bold text-slate-400">{totalUnlocked}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-500/30 bg-linear-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-purple-400">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Total XP</span>
            </div>
            <p className="text-3xl font-bold text-purple-400">{totalXP}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-sky-500/30 bg-linear-to-br from-sky-500/10 to-sky-500/5">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-sky-400">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Rare Earned</span>
            </div>
            <p className="text-3xl font-bold text-sky-400">
              {
                achievements.filter(
                  (achievement) =>
                    achievement.rarity === "rare" && achievement.earned
                ).length
              }
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-yellow-500/30 bg-linear-to-br from-yellow-500/10 to-yellow-500/5">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-yellow-400">
              <Crown className="h-5 w-5" />
              <span className="text-sm font-medium">Legendaries</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {
                achievements.filter(
                  (achievement) =>
                    achievement.rarity === "legendary" && achievement.earned
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
