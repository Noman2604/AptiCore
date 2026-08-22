"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import {
  Flame,
  Play,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Zap,
  BookOpen,
  Award,
  ArrowRight,
  BarChart3,
  Users,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { IResultDocument } from "@/lib/models/Result"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"

type LeaderboardEntry = {
  rank: number
  totalXP: number
  totalTestsTaken: number
  averageAccuracy: number
  level: number
  userId: {
    _id: string
    name?: string
    email?: string
  }
}

interface UserData {
  id?: string
  name?: string
  email?: string
}

interface ProfileData {
  totalXP?: number
  level?: number
  currentStreak?: number
  questionsAttempted?: number
  correctAnswers?: number
}

interface Achievement {
  achievementId: { name: string; description: string }
  unlockedAt: string
}

const QUICK_ACTIONS = [
  { href: "/dashboard/tests", label: "Take a Test", icon: Play, color: "#6ee7c9" },
  { href: "/dashboard/analytics", label: "View Analytics", icon: BarChart3, color: "#8b7cf6" },
  { href: "/dashboard/profile", label: "Profile", icon: Users, color: "#3ecf8e" },
  { href: "/dashboard/settings", label: "Settings", icon: Zap, color: "#f5a623" },
  { href: "/dashboard/feedback", label: "Feedback", icon: ArrowRight, color: "#f2896b" },
]

export default function DashboardPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [greeting, setGreeting] = useState("Good morning")
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([])
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [recentResults, setRecentResults] = useState<IResultDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)

      const hour = new Date().getHours()

      if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon")
      } else if (hour >= 17) {
        setGreeting("Good evening")
      } else {
        setGreeting("Good morning")
      }

      const { data } = await axios.get("/api/dashboard", {
        withCredentials: true,
      })

      if (!data.success) {
        throw new Error(data.error || "Failed to load dashboard")
      }

      setUserData(data.data.user)
      setProfile(data.data.profile)
      setUserAchievements(data.data.userachievements || [])
      setRecentResults(data.data.recentResults || [])
      setEntries(data.data.leaderboard || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  loadData()
}, [])

  const myEntry = userData
    ? entries.find((entry) => String(entry.userId?._id) === String(userData.id))
    : null
  const testsCompleted = recentResults?.length || 0
  const accuracy =
    recentResults.reduce((sum, result) => sum + (result.accuracy || 0), 0) /
    Math.max(recentResults.length, 1)
  const totalXP = profile?.totalXP || 0
  const level = profile?.level || 1
  const streak = profile?.currentStreak || 0
  const questionsAttempted = profile?.questionsAttempted || 0
  const correctAnswers = profile?.correctAnswers || 0
  const xpPerLevel = 500
  const progress = ((totalXP % xpPerLevel) / xpPerLevel) * 100
  const nextLevelXP = xpPerLevel - (totalXP % xpPerLevel)

  const statCards = [
    {
      label: "Tests Completed",
      value: testsCompleted,
      icon: BookOpen,
      color: "#6ee7c9",
    },
    {
      label: "Accuracy",
      value: `${Math.round(accuracy)}%`,
      icon: Target,
      color: "#8b7cf6",
    },
    {
      label: "Global Rank",
      value: myEntry ? `#${myEntry.rank}` : "-",
      icon: Trophy,
      color: "#3ecf8e",
    },
    {
      label: "Total XP",
      value: formatNumber(totalXP),
      icon: Zap,
      color: "#f5a623",
    },
    {
      label: "Current Streak",
      value: `${streak} days`,
      icon: Clock,
      color: "#8b7cf6",
    },
  ]

  const secondaryStats = [
    {
      label: "Questions Attempted",
      value: questionsAttempted,
      icon: BarChart3,
      color: "#6ee7c9",
    },
    {
      label: "Correct Answers",
      value: correctAnswers,
      icon: TrendingUp,
      color: "#f2555a",
    },
  ]
  if (!mounted || loading) {
    return (
     <DashboardSkeleton />
    )
  }

  return (
    <div
      className="min-h-screen bg-[#f4f4f4] dark:bg-[#16191f] font-[Inter,sans-serif] text-foreground transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-4 px-4 pt-4 pb-4 sm:px-6 md:pt-4 lg:px-10">
        {/* Greeting + streak + start test */}
        <div className="flex flex-row items-start justify-between gap-2 sm:items-center">
          <div>
            <p className="mb-1 font-[JetBrains_Mono,monospace] text-[12px] text-muted-foreground">
              {greeting},
            </p>
            <h1 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl">
              {userData?.name?.split(" ")[0] || "User"} 👋
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5  rounded-sm shadow shadow-slate-300  dark:shadow-none border border-[rgba(242,137,107,0.3)] bg-[rgba(242,137,107,0.1)] px-3.5 py-2 font-[JetBrains_Mono,monospace] text-[12.5px] font-semibold text-[#f2896b]">
              <Flame className="h-4 w-4" />
              {streak} day streak
            </div>
            <Link href="/dashboard/tests">
              <button className="flex items-center gap-2  rounded-sm shadow-slate-300 bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2.5 text-[13px] font-bold text-[#06120d] shadow-[0_0_20px_rgba(110,231,201,0.2)] transition hover:brightness-105">
                <Play className="h-4 w-4 fill-current" />
                Start Test
              </button>
            </Link>
          </div>
        </div>

        {/* XP / Level banner */}
        <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center  rounded-sm  shadow-slate-300 bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[#08110d] shadow-[0_0_20px_rgba(110,231,201,0.2)]">
                {level}
              </div>
              <div>
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
                  Level {level}
                </div>
                <div className="font-[JetBrains_Mono,monospace] text-[12px] text-muted-foreground">
                  {formatNumber(totalXP)} XP · {nextLevelXP} XP to next level
                </div>
              </div>
            </div>

            <div className="w-full sm:w-72">
              <div className="mb-1.5 flex justify-between font-[JetBrains_Mono,monospace] text-[10.5px] text-muted-foreground">
                <span>Progress to Level {level + 1}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-sm border-salte-50 bg-muted">
                <div
                  className="h-full  rounded-sm  bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className={` rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-4 transition-colors duration-300 ${index === statCards.length - 1 ? "col-span-2 md:col-span-1" : ""
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    {stat.label}
                  </p>
                  <p
                    className="mt-1 font-[Space_Grotesk,sans-serif] text-[26px] font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5 transition-colors duration-300"
                  style={{
                    borderColor: `${stat.color}40`,
                    backgroundColor: `${stat.color}14`,
                    color: stat.color,
                  }}
                >
                  <stat.icon className="h-5.5 w-5.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary stats */}
        <div className="grid gap-3.5 grid-cols-2">
          {secondaryStats.map((stat) => (
            <div
              key={stat.label}
              className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-4 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-[Space_Grotesk,sans-serif] text-xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <stat.icon
                  className="h-5 w-5 opacity-60"
                  style={{ color: stat.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recent results + achievements */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5 transition-colors duration-300">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#6ee7c9]" />
                  <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
                    Recent Results
                  </h2>
                </div>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#6ee7c9] transition hover:text-[#8ef2d6]"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentResults.length > 0 ? (
                  recentResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between  rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-background p-3.5 transition hover:bg-accent"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">
                          {result.testName}
                        </p>
                        <p className="mt-0.5 font-[JetBrains_Mono,monospace] text-[11px] text-muted-foreground">
                          {result.marksObtained || 0}/{result.totalMarks || 100}{" "}
                          marks
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#6ee7c9]">
                          {result.accuracy || 0}%
                        </p>
                        <p className="font-[JetBrains_Mono,monospace] text-[10.5px] text-muted-foreground">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-dashed border-border bg-background p-8 text-center">
                    <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-[13px] text-muted-foreground">No results yet</p>
                    <Link href="/dashboard/tests">
                      <button className="mt-3 flex items-center gap-2  rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border px-4 py-2 text-[12.5px] font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
                        <Play className="h-3 w-3" /> Start Your First Test
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5 transition-colors duration-300">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1">
                  <Award className="h-5 w-5 text-[#f5a623]" />
                  <h2 className="font-[Space_Grotesk,sans-serif] sm:text-lg text-sm font-bold">
                    Recent Achievements
                  </h2>

                </div>
                <Link
                  href="/dashboard/achievements"
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#6ee7c9] transition hover:text-[#8ef2d6]"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {userAchievements.length > 0 ? (
                  userAchievements.slice(0, 4).map((userAchievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3  rounded-sm shadow shadow-slate-300  dark:shadow-none border border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.06)] p-3 transition hover:bg-[rgba(245,166,35,0.1)]"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center  rounded-sm shadow shadow-slate-300  dark:shadow-none bg-[rgba(245,166,35,0.15)]">
                        <Award className="h-4 w-4 text-[#f5a623]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold">
                          {userAchievement.achievementId.name}
                        </p>
                        <p className="truncate font-[JetBrains_Mono,monospace] text-[10px] text-muted-foreground">
                          {userAchievement.achievementId.description}
                        </p>
                      </div>
                      <p className="shrink-0 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#f5a623]">
                        {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-dashed border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.04)] p-4 text-center">
                    <Award className="mx-auto mb-3 h-8 w-8 text-[#3a4a5e]" />
                    <p className="text-[12.5px] text-muted-foreground">
                      Complete tests to unlock achievements
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5">
          {QUICK_ACTIONS.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={index === QUICK_ACTIONS.length - 1 ? "col-span-2" : ""}
            >
              <button
                className="flex w-full items-center justify-center gap-2  rounded-sm shadow shadow-slate-300  dark:shadow-none border py-2.5 text-[13px] font-semibold transition hover:brightness-110"
                style={{
                  borderColor: `${action.color}35`,
                  backgroundColor: `${action.color}14`,
                  color: action.color,
                }}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background font-[Inter,sans-serif] text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-4 px-4 pt-4 pb-4 sm:px-6 md:pt-4 lg:px-10">

        {/* Greeting + Streak + Start Test */}
        <div className="flex flex-row items-start justify-between gap-2 sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-44 sm:w-52" />
          </div>

          <div className="flex flex-col items-end gap-2.5 sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-28  rounded-sm shadow shadow-slate-300  dark:shadow-none" />
            <Skeleton className="h-10 w-28  rounded-sm shadow shadow-slate-300  dark:shadow-none" />
          </div>
        </div>

        {/* XP / Level Banner */}
        <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16  rounded-sm shadow shadow-slate-300  dark:shadow-none" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>

            <div className="w-full sm:w-72">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-8" />
              </div>

              <Skeleton className="h-3 w-full  rounded-sm shadow shadow-slate-300  dark:shadow-none" />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={item}
              className={` rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-4 ${
                index === 4 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>

                <Skeleton className="h-14 w-14  rounded-sm shadow shadow-slate-300  dark:shadow-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-3.5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-7 w-20" />
                </div>

                <Skeleton className="h-5 w-5 rounded-sm shadow shadow-slate-300  dark:shadow-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Results + Achievements */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Recent Results */}
          <div className="lg:col-span-2">
            <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5">
              
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5  rounded-sm shadow shadow-slate-300  dark:shadow-none" />
                  <Skeleton className="h-5 w-32" />
                </div>

                <Skeleton className="h-4 w-16" />
              </div>

              {/* Results */}
              <div className="space-y-2.5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between  rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-background p-3.5"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className=" rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-card p-5">

              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-5  rounded-sm shadow shadow-slate-300  dark:shadow-none" />
                  <Skeleton className="h-5 w-32 sm:w-40" />
                </div>

                <Skeleton className="h-4 w-16" />
              </div>

              {/* Achievement Items */}
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3  rounded-sm shadow shadow-slate-300  dark:shadow-none border border-border bg-background p-3"
                  >
                    <Skeleton className="h-7 w-7 shrink-0  rounded-sm shadow shadow-slate-300  dark:shadow-none" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-2.5 w-40" />
                    </div>

                    <Skeleton className="h-3 w-16 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Skeleton
              key={item}
              className={`h-10 w-full  rounded-sm shadow shadow-slate-300  dark:shadow-none ${
                index === 4 ? "col-span-2" : ""
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}