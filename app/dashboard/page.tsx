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
  const [greeting, setGreeting] = useState("Good morning")
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [recentResults, setRecentResults] = useState<IResultDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const hour = new Date().getHours()
        if (hour >= 12 && hour < 17) {
          setGreeting("Good afternoon")
        } else if (hour >= 17) {
          setGreeting("Good evening")
        } else {
          setGreeting("Good morning")
        }

        const [
          { data: userData },
          { data: profileData },
          { data: achievementsData },
          { data: resultsData },
          { data: leaderboardData },
        ] = await Promise.all([
          axios.get("/api/auth/me"),
          axios.get("/api/profile"),
          axios.get("/api/achievements/user"),
          axios.get("/api/results?limit=5"),
          axios.get("/api/leaderboard"),
        ])
        setUserData(userData.data)
        setProfile(profileData.data)
        setAchievements(achievementsData.data || [])
        setRecentResults(resultsData.data || [])
        setEntries(leaderboardData.data || [])
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
    {
      label: "Current Streak",
      value: `${streak} days`,
      icon: Clock,
      color: "#8b7cf6",
    },
  ]

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]">
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2 font-[Space_Grotesk,sans-serif] text-lg font-semibold">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue border-t-transparent mx-auto mb-4"/>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
            Loading your dashboard...
          </div>
          <div className="font-[JetBrains_Mono,monospace] text-[12px] text-[#5b6577]">
            Please wait while we fetch your data
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-4 px-4 pt-20 pb-12 sm:px-6 md:pt-8 lg:px-10">
        {/* Greeting + streak + start test */}
        <div className="flex flex-row items-start justify-between gap-2 sm:items-center">
          <div>
            <p className="mb-1 font-[JetBrains_Mono,monospace] text-[12px] text-[#5b6577]">
              {greeting},
            </p>
            <h1 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl">
              {userData?.name?.split(" ")[0] || "User"} 👋
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(242,137,107,0.3)] bg-[rgba(242,137,107,0.1)] px-3.5 py-2 font-[JetBrains_Mono,monospace] text-[12.5px] font-semibold text-[#f2896b]">
              <Flame className="h-4 w-4" />
              {streak} day streak
            </div>
            <Link href="/dashboard/tests">
              <button className="flex items-center gap-2 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2.5 text-[13px] font-bold text-[#06120d] shadow-[0_0_20px_rgba(110,231,201,0.2)] transition hover:brightness-105">
                <Play className="h-4 w-4 fill-current" />
                Start Test
              </button>
            </Link>
          </div>
        </div>

        {/* XP / Level banner */}
        <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[#08110d] shadow-[0_0_20px_rgba(110,231,201,0.2)]">
                {level}
              </div>
              <div>
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
                  Level {level}
                </div>
                <div className="font-[JetBrains_Mono,monospace] text-[12px] text-[#8a96a8]">
                  {formatNumber(totalXP)} XP · {nextLevelXP} XP to next level
                </div>
              </div>
            </div>

            <div className="w-full sm:w-72">
              <div className="mb-1.5 flex justify-between font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
                <span>Progress to Level {level + 1}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#212a37]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#212a37] bg-[#10151d] p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
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
                  className="rounded-lg border p-2.5"
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
        <div className="grid gap-3.5 md:grid-cols-3">
          {secondaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#212a37] bg-[#10151d] p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
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
            <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5">
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
                      className="flex items-center justify-between rounded-lg border border-[#212a37] bg-[#141b25] p-3.5 transition hover:border-[#37465a]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">
                          {result.testName}
                        </p>
                        <p className="mt-0.5 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577]">
                          {result.marksObtained || 0}/{result.totalMarks || 100}{" "}
                          marks
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#6ee7c9]">
                          {result.accuracy || 0}%
                        </p>
                        <p className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[#212a37] bg-[#141b25] p-8 text-center">
                    <Clock className="mx-auto mb-3 h-8 w-8 text-[#3a4a5e]" />
                    <p className="text-[13px] text-[#5b6577]">No results yet</p>
                    <Link href="/dashboard/tests">
                      <button className="mt-3 flex items-center gap-2 rounded-lg border border-[#212a37] px-4 py-2 text-[12.5px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]">
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
            <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5">
              <div className="mb-5 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#f5a623]" />
                <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
                  Recent Achievements
                </h2>
              </div>

              <div className="space-y-2.5">
                {achievements.length > 0 ? (
                  achievements.slice(0, 4).map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.06)] p-3 transition hover:bg-[rgba(245,166,35,0.1)]"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[rgba(245,166,35,0.15)]">
                        <Award className="h-4 w-4 text-[#f5a623]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold">
                          {achievement.achievementId.name}
                        </p>
                        <p className="truncate font-[JetBrains_Mono,monospace] text-[10px] text-[#5b6577]">
                          {achievement.achievementId.description}
                        </p>
                      </div>
                      <p className="shrink-0 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#f5a623]">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.04)] p-4 text-center">
                    <Award className="mx-auto mb-3 h-8 w-8 text-[#3a4a5e]" />
                    <p className="text-[12.5px] text-[#5b6577]">
                      Complete tests to unlock achievements
                    </p>
                  </div>
                )}

                {achievements.length > 4 && (
                  <Link href="/dashboard/achievements">
                    <button className="w-full rounded-lg border border-[#212a37] py-2.5 text-[12.5px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]">
                      View All Achievements
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid gap-2.5 md:grid-cols-5">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-[13px] font-semibold transition hover:brightness-110"
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