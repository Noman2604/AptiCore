"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import axios from "axios"
import {
  Flame,
  Play,
  Trophy,
  Target,
  Clock,
  Zap,
  BookOpen,
  Award,
  ArrowRight,
  BarChart3,
  Users,
  Bookmark,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  Activity,
  Percent,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
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
  role?: string
}

interface ProfileData {
  totalXP?: number
  level?: number
  currentStreak?: number
  questionsAttempted?: number
  correctAnswers?: number
}

interface Achievement {
  achievementId: {
    name: string
    description: string
    pointsReward?: number
    rarity?: string
  }
  unlockedAt: string
}

interface PlatformBenchmarks {
  avgAccuracy: number
  avgXP: number
  avgTestsCompleted: number
  avgStreak: number
  totalStudents: number
  placementCutoffAccuracy: number
}

const QUICK_ACTIONS = [
  {
    href: "/dashboard/tests",
    label: "Practice Tests",
    description: "Timed aptitude mock tests",
    icon: Play,
    color: "#6ee7c9",
    bg: "rgba(110, 231, 201, 0.08)",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics Hub",
    description: "Detailed performance breakdown",
    icon: BarChart3,
    color: "#8b7cf6",
    bg: "rgba(139, 124, 246, 0.08)",
  },
  {
    href: "/dashboard/leaderboard",
    label: "Leaderboard",
    description: "Rank against other learners",
    icon: Trophy,
    color: "#f5a623",
    bg: "rgba(245, 166, 35, 0.08)",
  },
  {
    href: "/dashboard/achievements",
    label: "Badges & XP",
    description: "Milestones & rewards",
    icon: Award,
    color: "#3ecf8e",
    bg: "rgba(62, 207, 142, 0.08)",
  },
  {
    href: "/dashboard/bookmark",
    label: "Bookmarks",
    description: "Saved review questions",
    icon: Bookmark,
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.08)",
  },
  {
    href: "/dashboard/profile",
    label: "My Profile",
    description: "Academic & resume details",
    icon: Users,
    color: "#f472b6",
    bg: "rgba(244, 114, 182, 0.08)",
  },
]

function getLevelTitle(level: number): string {
  if (level <= 1) return "Novice Learner"
  if (level <= 3) return "Aptitude Apprentice"
  if (level <= 6) return "Skilled Practitioner"
  if (level <= 10) return "Master Strategist"
  return "Grandmaster Scholar"
}

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
  const [allResults, setAllResults] = useState<IResultDocument[]>([])
  const [allTests, setAllTests] = useState<any[]>([])
  const [totalAvailableTests, setTotalAvailableTests] = useState(0)
  const [benchmarks, setBenchmarks] = useState<PlatformBenchmarks>({
    avgAccuracy: 58,
    avgXP: 480,
    avgTestsCompleted: 4.5,
    avgStreak: 2,
    totalStudents: 1,
    placementCutoffAccuracy: 65,
  })
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
        setAllResults(data.data.allResults || [])
        setAllTests(data.data.allTests || [])
        setTotalAvailableTests(data.data.totalAvailableTests || data.data.allTests?.length || 0)
        setEntries(data.data.leaderboard || [])
        if (data.data.benchmarks) {
          setBenchmarks(data.data.benchmarks)
        }
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

  const completedResults = useMemo(() => {
    return (allResults || []).filter(
      (r) => r.status === "completed" && (r.totalMarks ? r.totalMarks > 0 : true)
    )
  }, [allResults])

  const completedRecentResults = useMemo(() => {
    return (recentResults || []).filter(
      (r) => r.status === "completed" && (r.totalMarks ? r.totalMarks > 0 : true)
    )
  }, [recentResults])

  const testsCompleted = completedResults.length
  const userAccuracy = Math.round(
    completedResults.length > 0
      ? completedResults.reduce((sum, result) => sum + (result.accuracy || 0), 0) /
          completedResults.length
      : 0
  )

  const totalXP = profile?.totalXP || 0
  const level = profile?.level || 1
  const streak = profile?.currentStreak || 0
  const xpPerLevel = 500
  const progress = Math.min(100, Math.max(0, ((totalXP % xpPerLevel) / xpPerLevel) * 100))
  const nextLevelXP = xpPerLevel - (totalXP % xpPerLevel)


  // Format performance chart data from results
  const chartData = useMemo(() => {
    if (!completedResults || completedResults.length === 0) return []
    return [...completedResults]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-7)
      .map((item, idx) => ({
        index: `Test ${idx + 1}`,
        accuracy: Math.round(item.accuracy || 0),
        platformAvg: benchmarks.avgAccuracy,
        score: item.marksObtained || 0,
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
  }, [allResults, benchmarks.avgAccuracy])

  if (!mounted || loading) {
    return <DashboardSkeleton />
  }
  
  const firstName = userData?.name?.split(" ")[0] || "Scholar"

  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* ================= HERO WELCOME BANNER ================= */}
        <div className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-linear-to-br from-teal-500/10 via-purple-500/5 to-amber-500/10 p-5 sm:p-7 backdrop-blur-sm shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Welcome Copy */}
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{greeting}, {firstName}!</span>
              </div>

              <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-[--ac-text]">
                Ready to sharpen your aptitude today?
              </h1>

              <p className="text-xs sm:text-sm text-[--ac-text-2] leading-relaxed">
                {streak > 0
                  ? `You are on a ${streak}-day learning streak with ${userAccuracy}% accuracy. Track your metrics against campus benchmarks below.`
                  : "Begin your practice journey today to earn bonus XP, build streaks, and benchmark your scores against the campus cohort."}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/dashboard/tests">
                  <button className="flex items-center gap-2 rounded-lg bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#06120d] shadow-md shadow-teal-500/20 transition hover:brightness-105 active:scale-98 cursor-pointer">
                    <Play className="h-4 w-4 fill-current" />
                    Start Practice Test
                  </button>
                </Link>

                <Link href="/dashboard/analytics">
                  <button className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[--ac-text] hover:bg-[--ac-hover] transition cursor-pointer">
                    <BarChart3 className="h-4 w-4 text-[--ac-purple]" />
                    View Detailed Analytics
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Quick Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3">
              <div className="rounded-xl border border-amber-500/20 bg-white/60 dark:bg-[#10151d]/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
                  <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-semibold">Daily Streak</span>
                </div>
                <div className="mt-1.5 text-2xl font-bold text-[--ac-text]">{streak} Days</div>
                <div className="text-[11px] text-[--ac-text-3]">
                  {streak >= benchmarks.avgStreak ? "Ahead of cohort avg" : "Keep chain active"}
                </div>
              </div>

              <div className="rounded-xl border border-teal-500/20 bg-white/60 dark:bg-[#10151d]/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Trophy className="h-4 w-4 text-teal-500" />
                  <span className="text-xs font-semibold">Global Rank</span>
                </div>
                <div className="mt-1.5 text-2xl font-bold text-[--ac-text]">
                  {myEntry ? `#${myEntry.rank}` : "#1"}
                </div>
                <div className="text-[11px] text-[--ac-text-3]">
                  {entries.length > 0 ? `Top among ${entries.length} learners` : "Leaderboard standing"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LEVEL & TIER PROGRESSION ================= */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm transition hover:border-black/15 dark:hover:border-white/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#6ee7c9] via-[#8b7cf6] to-[#f5a623] font-[Space_Grotesk,sans-serif] text-xl sm:text-2xl font-black text-[#08110d] shadow-lg shadow-teal-500/10">
                {level}
                <div className="absolute -bottom-1 rounded-full bg-black/70 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                  LVL
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                    Level {level} — {getLevelTitle(level)}
                  </span>
                </div>
                <p className="text-xs text-[--ac-text-3]">
                  <span className="font-semibold text-teal-600 dark:text-teal-300">{formatNumber(totalXP)} XP</span> earned total · <span className="font-medium text-[--ac-text-2]">{nextLevelXP} XP</span> to Level {level + 1}
                </p>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full md:w-80 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[--ac-text-3]">Tier Progress</span>
                <span className="text-teal-600 dark:text-teal-300">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 p-0.5">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] via-[#8b7cf6] to-[#f5a623] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= USER PERFORMANCE TRAJECTORY CHART ================= */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Accuracy Trajectory Chart */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                  <h3 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                    Accuracy Trajectory
                  </h3>
                </div>
                <p className="text-xs text-[--ac-text-3]">
                  Performance trend across your recent test attempts
                </p>
              </div>

              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-300 hover:underline"
              >
                Detailed analytics
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {chartData.length > 1 ? (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6ee7c9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6ee7c9" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: isDark ? "#8a96a8" : "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: isDark ? "#8a96a8" : "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#141b25" : "#ffffff",
                        borderColor: isDark ? "#293443" : "#e2e8f0",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: isDark ? "#e7ecf3" : "#0f172a",
                      }}
                      formatter={(val: any) => [`${val}%`, "Accuracy"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#6ee7c9"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#accuracyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-black/10 dark:border-white/10 p-6 text-center">
                <Target className="mb-2 h-8 w-8 text-[--ac-text-3]" />
                <p className="text-xs sm:text-sm font-semibold text-[--ac-text]">
                  No sufficient test history yet
                </p>
                <p className="mt-1 text-xs text-[--ac-text-3] max-w-xs">
                  Take at least 2 practice tests to view your automated trajectory plotted against campus baselines.
                </p>
                <Link href="/dashboard/tests" className="mt-3">
                  <button className="rounded-lg bg-teal-500/15 px-3.5 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-300 hover:bg-teal-500/25 transition">
                    Start a Test Now
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Curated Recommendations */}
          <div className="flex flex-col justify-between rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="h-5 w-5 text-[--ac-purple]" />
                <h3 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                  Curated Mock Practice
                </h3>
              </div>
              <p className="text-xs text-[--ac-text-3] mb-4">
                Recommended modules to beat cohort averages
              </p>

              {allTests && allTests.length > 0 ? (
                <div className="space-y-3">
                  {allTests.slice(0, 3).map((test: any, idx: number) => (
                    <div
                      key={test._id || idx}
                      className="group flex items-center justify-between rounded-lg border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/2 p-3 transition hover:border-teal-500/30 hover:bg-teal-500/5"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="truncate text-xs sm:text-sm font-semibold text-[--ac-text] group-hover:text-teal-600 dark:group-hover:text-teal-300">
                          {test.title}
                        </p>
                        <span className="text-[10px] text-[--ac-text-3] uppercase tracking-wider">
                          Recommended Practice
                        </span>
                      </div>
                      <Link href="/dashboard/tests">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-300 transition hover:bg-teal-500 hover:text-black">
                          <Play className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-black/5 dark:border-white/5 p-4 text-center">
                  <BookOpen className="mx-auto mb-2 h-7 w-7 text-[--ac-text-3]" />
                  <p className="text-xs font-semibold">Mock tests are ready in test center</p>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-teal-500/20 bg-teal-500/5 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Placement Strategy Tip</span>
              </div>
              <p className="mt-1 text-[11px] text-[--ac-text-2]">
                Candidates who maintain a 5+ day streak increase test accuracy by an average of 18% during campus drives.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RECENT RESULTS & ACHIEVEMENTS SPLIT ================= */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Recent Results (2 Cols) */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#6ee7c9]" />
                <h3 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                  Recent Test Attempts
                </h3>
              </div>
              <Link
                href="/dashboard/history"
                className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-300 hover:underline"
              >
                View full history
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {completedRecentResults.length > 0 ? (
                completedRecentResults.map((result, idx) => {
                  const acc = Math.round(result.accuracy || 0)
                  const accBadgeColor =
                    acc >= 75
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : acc >= 50
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"

                  const beatsAvg = acc >= benchmarks.avgAccuracy

                  return (
                    <div
                      key={result._id ? String(result._id) : idx}
                      className="flex items-center justify-between rounded-lg border border-black/5 dark:border-white/5 bg-slate-50/70 dark:bg-white/2 p-3 sm:p-3.5 transition hover:border-black/15 dark:hover:border-white/15"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="truncate text-xs sm:text-sm font-bold text-[--ac-text]">
                          {result.testName || "Comprehensive Test"}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[--ac-text-3]">
                          <span>
                            {result.marksObtained ?? 0} / {result.totalMarks ?? 100} marks
                          </span>
                          <span>•</span>
                          <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={beatsAvg ? "text-emerald-500 font-semibold" : "text-[--ac-text-3]"}>
                            {beatsAvg ? "✓ Above Platform Avg" : "Below Baseline"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${accBadgeColor}`}
                        >
                          {acc}%
                        </div>
                        <Link href="/dashboard/history">
                          <button className="flex h-7 w-7 items-center justify-center rounded-md text-[--ac-text-3] hover:bg-[--ac-hover] hover:text-[--ac-text] transition">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-xl border border-dashed border-black/10 dark:border-white/10 p-8 text-center">
                  <Clock className="mx-auto mb-2 h-7 w-7 text-[--ac-text-3]" />
                  <p className="text-xs sm:text-sm font-semibold text-[--ac-text]">No test attempts recorded yet</p>
                  <p className="mt-1 text-xs text-[--ac-text-3]">
                    Attempt a practice test to see your scores and comparison analytics.
                  </p>
                  <Link href="/dashboard/tests" className="mt-4 inline-block">
                    <button className="flex items-center gap-2 rounded-lg bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] px-4 py-2 text-xs font-bold text-[#06120d]">
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Take Your First Test
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Achievements (1 Col) */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#f5a623]" />
                <h3 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                  Recent Badges
                </h3>
              </div>
              <Link
                href="/dashboard/achievements"
                className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-300 hover:underline"
              >
                All badges
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {userAchievements.length > 0 ? (
                userAchievements.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 transition hover:bg-amber-500/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-bold text-[--ac-text]">
                        {item.achievementId?.name || "Milestone Achieved"}
                      </p>
                      <p className="truncate text-[10.5px] text-[--ac-text-3]">
                        {item.achievementId?.description || "Unlocked for practicing on AptiCore"}
                      </p>
                    </div>
                    {item.achievementId?.pointsReward ? (
                      <span className="shrink-0 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        +{item.achievementId.pointsReward} XP
                      </span>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-amber-500/20 bg-amber-500/5 p-6 text-center">
                  <Award className="mx-auto mb-2 h-7 w-7 text-amber-500/50" />
                  <p className="text-xs font-bold text-[--ac-text]">No achievements unlocked yet</p>
                  <p className="mt-1 text-[11px] text-[--ac-text-3]">
                    Earn badges by maintaining a streak and scoring high in tests!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= QUICK ACCESS NAVIGATION ================= */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-500" />
              <h3 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                Quick Navigation
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href} className="group">
                  <div className="flex h-full flex-col justify-between rounded-xl border border-black/8 dark:border-white/10 bg-card dark:bg-[#10151d] p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md cursor-pointer">
                    <div
                      className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg transition group-hover:scale-110"
                      style={{
                        backgroundColor: action.bg,
                        color: action.color,
                      }}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[--ac-text] group-hover:text-teal-600 dark:group-hover:text-teal-300">
                        {action.label}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[10.5px] text-[--ac-text-3]">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Hero Banner Skeleton */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-6 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 rounded-full" />
              <Skeleton className="h-8 w-64 sm:w-80" />
              <Skeleton className="h-4 w-52 sm:w-72" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 w-36 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-20 w-28 rounded-xl" />
              <Skeleton className="h-20 w-28 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Level Progression Skeleton */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full md:w-80 rounded-full" />
          </div>
        </div>

        {/* Benchmark Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3 py-2">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-4/5 rounded-full" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 space-y-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </div>

        {/* Quick Nav Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

      </div>
    </div>
  )
}