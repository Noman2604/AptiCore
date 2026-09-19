"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import axios from "axios"
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  Percent,
  Play,
  ArrowRight,
  Users,
  Award,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from "@/lib/utils"

interface LeaderboardEntry {
  rank: number
  totalXP: number
  totalTestsTaken: number
  averageAccuracy: number
  level: number
  userId: { _id: string; name?: string; email?: string }
}

type AnalyticsResult = {
  _id?: string
  accuracy?: number
  timeSpentSeconds?: number
  status?: string
  submittedAt?: string
  startedAt?: string
  createdAt?: string
  testName?: string
  marksObtained?: number
  totalMarks?: number
  testId?: {
    title?: string
    categoryId?: { name?: string; slug?: string } | string | null
    subcategory?: { name?: string; slug?: string } | string | null
  }
}

interface ProfileSummary {
  currentStreak?: number
  longestStreak?: number
  totalXP?: number
  level?: number
  questionsAttempted?: number
  correctAnswers?: number
}

interface PlatformBenchmarks {
  avgAccuracy: number
  avgXP: number
  avgTestsCompleted: number
  avgTimeSpentMinutes: number
  avgStreak: number
  totalStudents: number
  placementCutoffAccuracy: number
}

interface UserData {
  id?: string
  name?: string
  email?: string
  role?: string
}

const palette = [
  "#6ee7c9",
  "#8b7cf6",
  "#f5a623",
  "#3ecf8e",
  "#38bdf8",
  "#f472b6",
]

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0]
}

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()

  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d")
  const [results, setResults] = useState<AnalyticsResult[]>([])
  const [profile, setProfile] = useState<ProfileSummary | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userdata, setUserData] = useState<UserData | null>(null)
  const [benchmarks, setBenchmarks] = useState<PlatformBenchmarks>({
    avgAccuracy: 58,
    avgXP: 480,
    avgTestsCompleted: 4.5,
    avgTimeSpentMinutes: 18,
    avgStreak: 2,
    totalStudents: 1,
    placementCutoffAccuracy: 65,
  })
  const [loading, setLoading] = useState(true)

  const visibleWindowDays =
    period === "30d"
      ? 30
      : period === "90d"
      ? 90
      : 7

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)

        const { data } = await axios.get("/api/dashboard/analytics", {
          withCredentials: true,
        })

        if (!data.success) {
          throw new Error(data.error || "Failed to load analytics")
        }

        setUserData(data.data.user)
        setProfile(data.data.profile)
        setLeaderboard(data.data.leaderboard || [])
        if (data.data.benchmarks) {
          setBenchmarks(data.data.benchmarks)
        }

        const completedResults = (data.data.results || []).filter(
          (result: AnalyticsResult) => result?.status === "completed"
        )

        setResults(completedResults)
      } catch (error) {
        console.error("Failed to load analytics data", error)
      } finally {
        setLoading(false)
      }
    }

    void loadAnalytics()
  }, [])

  const completedResults = useMemo(
    () => results.filter((item) => item.status === "completed"),
    [results]
  )

  const windowResults = useMemo(() => {
    if (!completedResults.length) return []

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - (visibleWindowDays - 1))

    return completedResults.filter((item) => {
      const submittedAt = item.submittedAt || item.startedAt || item.createdAt
      if (!submittedAt) return false
      return new Date(submittedAt) >= cutoff
    })
  }, [completedResults, visibleWindowDays])

  // Computed metrics
  const testsCompleted = completedResults.length
  const userAccuracy = Math.round(
    completedResults.length > 0
      ? completedResults.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
          completedResults.length
      : 0
  )

  const totalXP = profile?.totalXP || 0
  const level = profile?.level || 1
  const currentStreak = profile?.currentStreak || 0
  const longestStreak = profile?.longestStreak || 0

  const totalStudyTimeSeconds = completedResults.reduce(
    (sum, item) => sum + (item.timeSpentSeconds || 0),
    0
  )
  const avgTimePerTestMinutes =
    testsCompleted > 0
      ? Math.round(totalStudyTimeSeconds / testsCompleted / 60)
      : 0

  // Comparison deltas
  const accuracyDiff = userAccuracy - benchmarks.avgAccuracy
  const xpDiff = totalXP - benchmarks.avgXP
  const testsDiff = Number((testsCompleted - benchmarks.avgTestsCompleted).toFixed(1))
  const timeDiff = benchmarks.avgTimeSpentMinutes - avgTimePerTestMinutes

  const myRankEntry = useMemo(() => {
    if (!userdata?.id || leaderboard.length === 0) return null
    return (
      leaderboard.find(
        (entry) => String(entry.userId?._id) === String(userdata.id)
      ) || null
    )
  }, [leaderboard, userdata])

  // Trajectory Score Chart Data
  const scoreData = useMemo(() => {
    const points = visibleWindowDays
    const buckets = Array.from({ length: points }, (_, index) => {
      const day = new Date()
      day.setDate(day.getDate() - (points - index - 1))
      return day
    })

    return buckets.map((day) => {
      const key = getDateKey(day)

      const dayResults = windowResults.filter((item) => {
        const submittedAt = item.submittedAt || item.startedAt || item.createdAt
        return submittedAt ? getDateKey(new Date(submittedAt)) === key : false
      })

      const dayAverage = dayResults.length
        ? Math.round(
            dayResults.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
              dayResults.length
          )
        : null

      return {
        date:
          points <= 7
            ? day.toLocaleDateString("en-US", { weekday: "short" })
            : day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: dayAverage,
        platformAvg: benchmarks.avgAccuracy,
      }
    })
  }, [visibleWindowDays, windowResults, benchmarks.avgAccuracy])

  // Topic Accuracy Map
  const topicData = useMemo(() => {
    const grouped = new Map<
      string,
      { name: string; accuracy: number; tests: number; color: string }
    >()

    completedResults.forEach((item, index) => {
      const categoryName =
        typeof item.testId?.categoryId === "object" && item.testId.categoryId !== null
          ? item.testId.categoryId.name
          : undefined
      const subcategoryName =
        typeof item.testId?.subcategory === "object" && item.testId.subcategory !== null
          ? item.testId.subcategory.name
          : undefined
      const topicLabel =
        categoryName || subcategoryName || item.testName || `Module ${index + 1}`

      const existing = grouped.get(topicLabel) || {
        name: topicLabel,
        accuracy: 0,
        tests: 0,
        color: palette[grouped.size % palette.length],
      }

      existing.tests += 1
      existing.accuracy += item.accuracy || 0
      grouped.set(topicLabel, existing)
    })

    return Array.from(grouped.values())
      .map((topic) => ({
        ...topic,
        accuracy: Math.round(topic.accuracy / topic.tests),
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
  }, [completedResults])

  // Strong vs Weak Diagnosis
  const strongAreas = useMemo(
    () => topicData.filter((t) => t.accuracy >= benchmarks.avgAccuracy),
    [topicData, benchmarks.avgAccuracy]
  )
  const weakAreas = useMemo(
    () => topicData.filter((t) => t.accuracy < benchmarks.avgAccuracy),
    [topicData, benchmarks.avgAccuracy]
  )

  const bestResult = useMemo(() => {
    if (!completedResults.length) return null
    return completedResults.reduce((best, current) => {
      if (!best) return current
      return (current.accuracy || 0) > (best.accuracy || 0) ? current : best
    }, null as AnalyticsResult | null)
  }, [completedResults])

  if (loading) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* ================= HERO HEADER ================= */}
        <div className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-linear-to-br from-purple-500/10 via-teal-500/5 to-amber-500/10 p-5 sm:p-7 backdrop-blur-sm shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-300 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Performance & Benchmark Diagnostics</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Analytics Hub
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-[--ac-text-2]">
                Detailed insights on your accuracy, syllabus mastery, speed, and side-by-side comparisons with platform averages.
              </p>
            </div>

            {/* Time Window Filters */}
            <div className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 p-1 backdrop-blur-md self-start sm:self-auto">
              {(
                [
                  { value: "7d", label: "7 Days" },
                  { value: "30d", label: "30 Days" },
                  { value: "90d", label: "90 Days" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPeriod(option.value)}
                  className={`rounded-md px-3 py-1.5 font-[Space_Grotesk,sans-serif] text-xs font-bold transition cursor-pointer ${
                    period === option.value
                      ? "bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] text-[#06120d] shadow-sm"
                      : "text-[--ac-text-2] hover:bg-[--ac-hover] hover:text-[--ac-text]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= DEDICATED BENCHMARK COMPARISON MATRIX (YOU VS PLATFORM AVERAGE) ================= */}
        <div>
          <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-teal-500" />
              <div>
                <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[--ac-text]">
                  Detailed Metrics vs. Platform Averages
                </h2>
                <p className="text-xs text-[--ac-text-3]">
                  Separate benchmark cards analyzing accuracy, XP momentum, practice volume, and solving speed
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-card dark:bg-white/5 px-3 py-1 text-xs font-medium text-[--ac-text-2]">
              <Users className="h-3.5 w-3.5 text-[--ac-teal]" />
              <span>Cohort Benchmark ({benchmarks.totalStudents} Candidates Evaluated)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. DEDICATED ACCURACY BENCHMARK CARD */}
            <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-card dark:bg-[#10151d] p-5 shadow-sm hover:border-purple-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-300">
                    <Target className="h-3.5 w-3.5" />
                    Accuracy
                  </span>
                  <h3 className="mt-1.5 text-xs font-medium text-[--ac-text-3]">
                    Overall Precision
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    accuracyDiff >= 0
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {accuracyDiff >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3" />
                      +{accuracyDiff}%
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3" />
                      {accuracyDiff}%
                    </>
                  )}
                </span>
              </div>

              {/* Side-by-Side Values */}
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-y border-black/5 dark:border-white/5 py-2.5">
                <div>
                  <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    You
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-[--ac-text]">
                    {userAccuracy}%
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Your Score</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider">
                    Platform Avg
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-slate-400 dark:text-slate-500">
                    {benchmarks.avgAccuracy}%
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Cut-off: {benchmarks.placementCutoffAccuracy}%</span>
                </div>
              </div>

              {/* Dual Visual Comparison Bars */}
              <div className="mt-3.5 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-teal-600 dark:text-teal-300 font-semibold">Your Rate</span>
                    <span className="font-bold">{userAccuracy}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e]"
                      style={{ width: `${Math.min(userAccuracy, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-purple-400">Platform Mean</span>
                    <span className="text-[--ac-text-3]">{benchmarks.avgAccuracy}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-purple-500/60"
                      style={{ width: `${Math.min(benchmarks.avgAccuracy, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10.5px] text-[--ac-text-3] border-t border-black/5 dark:border-white/5">
                {userAccuracy >= benchmarks.placementCutoffAccuracy
                  ? "✓ Exceeds IT placement cut-off"
                  : `Need +${benchmarks.placementCutoffAccuracy - userAccuracy}% to reach Tier-1 cut-off`}
              </div>
            </div>

            {/* 2. DEDICATED XP COMPARISON CARD */}
            <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-card dark:bg-[#10151d] p-5 shadow-sm hover:border-amber-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Zap className="h-3.5 w-3.5 fill-amber-500" />
                    XP Points
                  </span>
                  <h3 className="mt-1.5 text-xs font-medium text-[--ac-text-3]">
                    Earned Experience
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    xpDiff >= 0
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                  }`}
                >
                  {xpDiff >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3" />
                      +{formatNumber(xpDiff)} XP
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3" />
                      {formatNumber(Math.abs(xpDiff))} XP
                    </>
                  )}
                </span>
              </div>

              {/* Side-by-Side Values */}
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-y border-black/5 dark:border-white/5 py-2.5">
                <div>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    You
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-[--ac-text]">
                    {formatNumber(totalXP)}
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Level {level} Achieved</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Platform Avg
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-slate-400 dark:text-slate-500">
                    {formatNumber(benchmarks.avgXP)}
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Cohort Average</span>
                </div>
              </div>

              {/* Dual Visual Comparison Bars */}
              <div className="mt-3.5 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">Your Total XP</span>
                    <span className="font-bold">{formatNumber(totalXP)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#f5a623] to-[#d946ef]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(15, (totalXP / Math.max(totalXP, benchmarks.avgXP * 1.5)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-slate-400">Platform Mean</span>
                    <span className="text-[--ac-text-3]">{formatNumber(benchmarks.avgXP)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-amber-500/40"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(15, (benchmarks.avgXP / Math.max(totalXP, benchmarks.avgXP * 1.5)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10.5px] text-[--ac-text-3] border-t border-black/5 dark:border-white/5">
                {xpDiff >= 0
                  ? `Ranked among top performers in points`
                  : `Earn XP by completing tests and daily streaks`}
              </div>
            </div>

            {/* 3. DEDICATED TESTS COMPLETED CARD */}
            <div className="relative overflow-hidden rounded-xl border border-teal-500/20 bg-card dark:bg-[#10151d] p-5 shadow-sm hover:border-teal-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-600 dark:text-teal-300">
                    <BookOpen className="h-3.5 w-3.5" />
                    Tests Count
                  </span>
                  <h3 className="mt-1.5 text-xs font-medium text-[--ac-text-3]">
                    Attempted Volume
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    testsDiff >= 0
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                  }`}
                >
                  {testsDiff >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3" />
                      +{testsDiff} tests
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3" />
                      {Math.abs(testsDiff)} tests
                    </>
                  )}
                </span>
              </div>

              {/* Side-by-Side Values */}
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-y border-black/5 dark:border-white/5 py-2.5">
                <div>
                  <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    You
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-[--ac-text]">
                    {testsCompleted}
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Completed</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Platform Avg
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-slate-400 dark:text-slate-500">
                    {benchmarks.avgTestsCompleted}
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Tests Per User</span>
                </div>
              </div>

              {/* Dual Visual Comparison Bars */}
              <div className="mt-3.5 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-teal-600 dark:text-teal-300 font-semibold">Your Completed</span>
                    <span className="font-bold">{testsCompleted} tests</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] to-[#38bdf8]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(15, (testsCompleted / Math.max(testsCompleted, benchmarks.avgTestsCompleted * 1.5)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-slate-400">Platform Mean</span>
                    <span className="text-[--ac-text-3]">{benchmarks.avgTestsCompleted}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-teal-500/40"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(15, (benchmarks.avgTestsCompleted / Math.max(testsCompleted, benchmarks.avgTestsCompleted * 1.5)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10.5px] text-[--ac-text-3] border-t border-black/5 dark:border-white/5">
                {testsDiff >= 0
                  ? `High practice velocity indicates strong discipline`
                  : `Take 1 timed test today to surpass platform average`}
              </div>
            </div>

            {/* 4. DEDICATED SPEED & SOLVING TIME CARD (NEW BONUS!) */}
            <div className="relative overflow-hidden rounded-xl border border-sky-500/20 bg-card dark:bg-[#10151d] p-5 shadow-sm hover:border-sky-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-600 dark:text-sky-300">
                    <Clock3 className="h-3.5 w-3.5" />
                    Solving Speed
                  </span>
                  <h3 className="mt-1.5 text-xs font-medium text-[--ac-text-3]">
                    Avg Time Per Test
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    timeDiff >= 0
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                  }`}
                >
                  {timeDiff >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3" />
                      {timeDiff}m faster
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3" />
                      {Math.abs(timeDiff)}m slower
                    </>
                  )}
                </span>
              </div>

              {/* Side-by-Side Values */}
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-y border-black/5 dark:border-white/5 py-2.5">
                <div>
                  <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    You
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-[--ac-text]">
                    {avgTimePerTestMinutes}m
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Per Test Avg</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Platform Avg
                  </span>
                  <div className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-bold text-slate-400 dark:text-slate-500">
                    {benchmarks.avgTimeSpentMinutes}m
                  </div>
                  <span className="text-[10px] text-[--ac-text-3]">Cohort Baseline</span>
                </div>
              </div>

              {/* Dual Visual Comparison Bars */}
              <div className="mt-3.5 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-sky-600 dark:text-sky-300 font-semibold">Your Pace</span>
                    <span className="font-bold">{avgTimePerTestMinutes} mins</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#38bdf8] to-[#0ea5e9]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(15, (avgTimePerTestMinutes / 30) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-slate-400">Platform Mean Pace</span>
                    <span className="text-[--ac-text-3]">{benchmarks.avgTimeSpentMinutes} mins</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-sky-500/40"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(15, (benchmarks.avgTimeSpentMinutes / 30) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10.5px] text-[--ac-text-3] border-t border-black/5 dark:border-white/5">
                Total study time logged: {formatDuration(totalStudyTimeSeconds)}
              </div>
            </div>

          </div>
        </div>

        {/* ================= USER PERFORMANCE TREND TRAJECTORY + COHORT STANDING ================= */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Trajectory Chart (2 Cols) */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                  <h2 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                    Performance Trend
                  </h2>
                </div>
                <p className="text-xs text-[--ac-text-3]">
                  Your test accuracy progression across the selected time range
                </p>
              </div>

              <span className="flex items-center gap-1.5 rounded-full border border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.1)] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-xs font-semibold text-[#3ecf8e]">
                <Activity className="h-3 w-3" /> Live History
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6ee7c9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6ee7c9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#212a37" : "#e2e8f0"}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: isDark ? "#212a37" : "#e2e8f0" }}
                    tick={{ fill: isDark ? "#8a96a8" : "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tick={{ fill: isDark ? "#8a96a8" : "#64748b", fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val ?? 0}%`, "Accuracy"]}
                    contentStyle={{
                      backgroundColor: isDark ? "#141b25" : "#ffffff",
                      borderColor: isDark ? "#212a37" : "#e2e8f0",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: isDark ? "#e7ecf3" : "#0f172a",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6ee7c9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#analyticsScoreGrad)"
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking & Placement Radial (1 Col) */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                  Cohort Standing
                </h2>
              </div>
              <p className="text-xs text-[--ac-text-3] mb-4">
                Position relative to total active candidates
              </p>

              <div className="flex items-center gap-5 my-3">
                <div className="relative h-28 w-28 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[{ name: "Accuracy", value: userAccuracy, fill: "#6ee7c9" }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar
                        background={{ fill: isDark ? "#212a37" : "#e2e8f0" }}
                        dataKey="value"
                        cornerRadius={8}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-[--ac-text]">
                      {userAccuracy}%
                    </span>
                    <span className="font-[JetBrains_Mono,monospace] text-[9px] text-[--ac-text-3] uppercase">
                      PRECISION
                    </span>
                  </div>
                </div>

                <div>
                  <div className="font-[Space_Grotesk,sans-serif] text-3xl font-bold text-[#6ee7c9]">
                    #{myRankEntry?.rank || 1}
                  </div>
                  <p className="mt-1 font-[JetBrains_Mono,monospace] text-xs text-[--ac-text-3]">
                    out of {benchmarks.totalStudents} learners
                  </p>
                  <span className="inline-block mt-2 rounded-full bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 text-[10.5px] font-semibold text-teal-600 dark:text-teal-300">
                    {accuracyDiff >= 0 ? "Top Quartile Cohort" : "Active Learner"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
              <div className="rounded-lg border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/2 p-3">
                <div className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
                  {testsCompleted}
                </div>
                <div className="text-[10px] uppercase text-[--ac-text-3]">Total Tests</div>
              </div>

              <div className="rounded-lg border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/2 p-3">
                <div className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
                  {formatNumber(totalXP)}
                </div>
                <div className="text-[10px] uppercase text-[--ac-text-3]">Total XP</div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= DIAGNOSTIC MATRIX: STRENGTHS VS FOCUS AREAS ================= */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Strengths (Above Benchmark) */}
          <div className="rounded-xl border border-emerald-500/20 bg-card dark:bg-[#10151d] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h2 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                  Verified Strengths (Above Benchmark)
                </h2>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {strongAreas.length} Modules
              </span>
            </div>

            <div className="space-y-3">
              {strongAreas.length > 0 ? (
                strongAreas.map((topic) => {
                  const lead = topic.accuracy - benchmarks.avgAccuracy
                  return (
                    <div
                      key={topic.name}
                      className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[--ac-text]">
                            {topic.name}
                          </p>
                          <span className="text-[10.5px] text-[--ac-text-3]">
                            {topic.tests} tests completed
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-[Space_Grotesk,sans-serif] text-base font-bold text-emerald-500">
                            {topic.accuracy}%
                          </span>
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            +{lead}% above avg
                          </span>
                        </div>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${topic.accuracy}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-lg border border-dashed border-black/10 dark:border-white/10 p-6 text-center text-xs text-[--ac-text-3]">
                  Take more topic tests to unlock verified subject strengths.
                </div>
              )}
            </div>
          </div>

          {/* Focus Areas (Below Benchmark) */}
          <div className="rounded-xl border border-amber-500/20 bg-card dark:bg-[#10151d] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                <h2 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text]">
                  Focus Areas (Targeted Revision)
                </h2>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                {weakAreas.length} Modules
              </span>
            </div>

            <div className="space-y-3">
              {weakAreas.length > 0 ? (
                weakAreas.map((topic) => {
                  const gap = benchmarks.avgAccuracy - topic.accuracy
                  return (
                    <div
                      key={topic.name}
                      className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[--ac-text]">
                            {topic.name}
                          </p>
                          <span className="text-[10.5px] text-[--ac-text-3]">
                            {topic.tests} tests completed
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-[Space_Grotesk,sans-serif] text-base font-bold text-amber-500">
                            {topic.accuracy}%
                          </span>
                          <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            -{gap}% below avg
                          </span>
                        </div>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${topic.accuracy}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-lg border border-dashed border-black/10 dark:border-white/10 p-6 text-center text-xs text-[--ac-text-3]">
                  {topicData.length > 0
                    ? "Great job! All tested modules are meeting or exceeding cohort benchmarks."
                    : "Complete practice tests to identify high-yield improvement areas."}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= ACTIONABLE NEXT BEST STEP ================= */}
        <div className="flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-purple-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[--ac-text]">Recommended Next Step</p>
              <p className="text-xs text-[--ac-text-2] mt-0.5">
                {weakAreas.length > 0
                  ? `Strengthen your scores in ${weakAreas[0].name} to boost your overall accuracy past the 65% campus cutoff.`
                  : "Maintain your practice rhythm with a full-length timed mock test today."}
              </p>
            </div>
          </div>

          <Link href="/dashboard/tests">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#06120d] shadow-md shadow-teal-500/20 transition hover:brightness-105 active:scale-98 cursor-pointer shrink-0">
              Continue Practice
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-7 space-y-3">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 space-y-3"
            >
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-28 w-28 rounded-full mx-auto" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
