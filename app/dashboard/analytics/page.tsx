"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
} from "recharts"
import { useRouter } from "next/navigation"

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
  testId?: {
    title?: string
    categoryId?: { name?: string; slug?: string } | string | null
    subcategory?: { name?: string; slug?: string } | string | null
  }
}

interface ProfileSummary {
  currentStreak?: number
  longestStreak?: number
}

const palette = [
  "#6ee7c9",
  "#8b7cf6",
  "#f5a623",
  "#f2555a",
  "#3ecf8e",
  "#f2896b",
]

const CHART_TOOLTIP_STYLE = {
  background: "#141b25",
  border: "1px solid #212a37",
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "JetBrains Mono, monospace",
  color: "#e7ecf3",
}

function MiniBar({
  value,
  max,
  color,
}: {
  value: number
  max: number
  color: string
}) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[#212a37]">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(value / max) * 100}%`, background: color }}
      />
    </div>
  )
}

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

function getDayLabel(date: Date) {
  return date.toLocaleDateString("en", { weekday: "short" })
}

interface UserData {
  id?: string
  name?: string
  email?: string
  role?: string
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7d")
  const [results, setResults] = useState<AnalyticsResult[]>([])
  const [profile, setProfile] = useState<ProfileSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userdata, setUserData] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getuserdata = async () => {
      try {
        const { data } = await axios.get("/api/auth/me")
        setUserData(data.data)
      } catch (error) {
        console.error(error)
      }
    }
    getuserdata()
  }, [])

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const { data } = await axios.get("/api/leaderboard")
        if (data.success && Array.isArray(data.data)) {
          setLeaderboard(data.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getLeaderboard()
  }, [])

  const myRankEntry = useMemo(() => {
    if (!userdata?.id || leaderboard.length === 0) return null
    return (
      leaderboard.find(
        (entry) => String(entry.userId?._id) === String(userdata.id)
      ) || null
    )
  }, [leaderboard, userdata])

  const platformAverage = useMemo(() => {
    if (leaderboard.length === 0) return { xp: 0, accuracy: 0, tests: 0 }
    const total = leaderboard.reduce(
      (acc, e) => ({
        xp: acc.xp + (e.totalXP || 0),
        accuracy: acc.accuracy + (e.averageAccuracy || 0),
        tests: acc.tests + (e.totalTestsTaken || 0),
      }),
      { xp: 0, accuracy: 0, tests: 0 }
    )
    return {
      xp: Math.round(total.xp / leaderboard.length),
      accuracy: Math.round(total.accuracy / leaderboard.length),
      tests: Math.round(total.tests / leaderboard.length),
    }
  }, [leaderboard])

  const accuracyChartData = [
    {
      name: "Accuracy",
      value: myRankEntry?.averageAccuracy || 0,
      fill: "#6ee7c9",
    },
  ]

  const comparisonData = [
    {
      metric: "XP",
      You: myRankEntry?.totalXP || 0,
      Average: platformAverage.xp,
    },
    {
      metric: "Accuracy %",
      You: Math.round(myRankEntry?.averageAccuracy || 0),
      Average: platformAverage.accuracy,
    },
    {
      metric: "Tests",
      You: myRankEntry?.totalTestsTaken || 0,
      Average: platformAverage.tests,
    },
  ]

  const rankSuffix = (n: number) => {
    if (n % 100 >= 11 && n % 100 <= 13) return "th"
    switch (n % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [{ data: resultsData }, { data: profileData }] =
          await Promise.all([
            axios.get("/api/results?limit=100"),
            axios.get("/api/profile").catch(() => ({ data: { data: null } })),
          ])

        const completedResults = (resultsData?.data || []).filter(
          (result: AnalyticsResult) => result?.status === "completed"
        )

        setResults(completedResults)
        setProfile(profileData?.data || null)
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

  const visibleWindowDays = period === "30d" ? 30 : period === "90d" ? 90 : 7
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

  const scoreData = useMemo(() => {
    const points = period === "7d" ? 7 : 6
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
      const average = dayResults.length
        ? Math.round(
            dayResults.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
              dayResults.length
          )
        : 0
      const studyTime = dayResults.reduce(
        (sum, item) => sum + (item.timeSpentSeconds || 0),
        0
      )

      return {
        date: getDayLabel(day),
        score: average,
        time: Math.round(studyTime / 60),
      }
    })
  }, [period, windowResults])

  const topicData = useMemo(() => {
    const grouped = new Map<
      string,
      { name: string; accuracy: number; tests: number; color: string }
    >()

    windowResults.forEach((item, index) => {
      const categoryName =
        typeof item.testId?.categoryId === "object" &&
        item.testId.categoryId !== null
          ? item.testId.categoryId.name
          : undefined
      const subcategoryName =
        typeof item.testId?.subcategory === "object" &&
        item.testId.subcategory !== null
          ? item.testId.subcategory.name
          : undefined
      const topicLabel =
        categoryName || subcategoryName || item.testName || `Topic ${index + 1}`
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
      .slice(0, 5)
  }, [windowResults])

  const focusAreas = useMemo(() => {
    if (!topicData.length) {
      return [
        {
          topic: "No completed tests yet",
          accuracy: 0,
          tip: "Take your first test to unlock topic insights.",
        },
      ]
    }

    return topicData
      .filter((topic) => topic.accuracy < 70)
      .slice(0, 4)
      .map((topic) => ({
        topic: topic.name,
        accuracy: topic.accuracy,
        tip: `Practice more ${topic.name.toLowerCase()} questions to lift your accuracy.`,
      }))
  }, [topicData])

  const averageScore = useMemo(() => {
    if (!windowResults.length) return 0
    return Math.round(
      windowResults.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
        windowResults.length
    )
  }, [windowResults])

  const studyTime = useMemo(() => {
    if (!windowResults.length) return 0
    return windowResults.reduce(
      (sum, item) => sum + (item.timeSpentSeconds || 0),
      0
    )
  }, [windowResults])

  const bestResult = useMemo(() => {
    if (!windowResults.length) return null
    return windowResults.reduce(
      (best, current) => {
        if (!best) return current
        return (current.accuracy || 0) > (best.accuracy || 0) ? current : best
      },
      null as AnalyticsResult | null
    )
  }, [windowResults])

  const bestDay = useMemo(() => {
    if (!scoreData.length) return null
    return scoreData.reduce(
      (best, current) => (current.score > best.score ? current : best),
      scoreData[0]
    )
  }, [scoreData])

  const currentStreak = profile?.currentStreak || 0
  const longestStreak = profile?.longestStreak || 0
  const weeklyGoalProgress = Math.min(
    100,
    Math.round((windowResults.length / 3) * 100)
  )
  const nextStep = focusAreas[0]?.topic
    ? `Practice ${focusAreas[0].topic} for a few focused sets today.`
    : "Complete a test to start building your analytics insights."

  const statCards = [
    {
      label: "Average score",
      value: `${averageScore}%`,
      change: windowResults.length ? "Live" : "No data yet",
      icon: Target,
      color: "#6ee7c9",
    },
    {
      label: "Tests taken",
      value: `${windowResults.length}`,
      change: `${completedResults.length} total`,
      icon: BookOpen,
      color: "#3ecf8e",
    },
    {
      label: "Study time",
      value: formatDuration(studyTime),
      change: "Based on completed tests",
      icon: Clock3,
      color: "#8b7cf6",
    },
    {
      label: "Best result",
      value: bestResult ? `${bestResult.accuracy ?? 0}%` : "0%",
      change: bestResult?.testName || "No result yet",
      icon: Trophy,
      color: "#f5a623",
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-sm text-[#8a96a8]">
        <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
        Loading your analytics...
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
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 pt-20 pb-12 sm:px-6 md:pt-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] p-2 text-[#6ee7c9]">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="rounded-full border border-[#212a37] bg-[#141b25] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#8a96a8] uppercase">
                Performance insights
              </span>
            </div>
            <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl">
              Analytics Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-[#8a96a8]">
              Review your recent progress, identify weak areas, and keep your
              prep momentum high.
            </p>
          </div>

          <div className="flex gap-1.5 rounded-xl border-[#212a37] bg-[#141b25] p-1.5">
            <button
              onClick={() => setPeriod("7d")}
              className="rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-3.5 py-1.5 font-[JetBrains_Mono,monospace] text-[12px] font-semibold text-[#06120d]"
            >
              7 days
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="rounded-lg border p-2"
                  style={{
                    borderColor: `${stat.color}45`,
                    backgroundColor: `${stat.color}14`,
                    color: stat.color,
                  }}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-[#212a37] px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] text-[#5b6577]">
                  {stat.change}
                </span>
              </div>
              <div className="font-[Space_Grotesk,sans-serif] text-2xl font-bold">
                {stat.value}
              </div>
              <p className="mt-1 text-[12.5px] text-[#8a96a8]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trend + topic accuracy */}
        <div className="grid gap-3.5 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
                  Performance trend
                </h2>
                <p className="mt-0.5 text-[13px] text-[#8a96a8]">
                  Your recent accuracy across the selected range
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.1)] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold text-[#3ecf8e]">
                <Activity className="h-3 w-3" /> Live
              </span>
            </div>

            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6ee7c9"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#6ee7c9"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#212a37"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: "#212a37" }}
                    tick={{ fill: "#5b6577", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tick={{ fill: "#5b6577", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value ?? 0}%`, "Score"]}
                    cursor={{ stroke: "#3a4a5e", strokeDasharray: "3 3" }}
                    contentStyle={CHART_TOOLTIP_STYLE}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6ee7c9"
                    fill="url(#scoreFill)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
            <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
              Topic accuracy
            </h2>
            <p className="mt-0.5 text-[13px] text-[#8a96a8]">
              How you performed across your recent topics
            </p>

            <div className="mt-5 space-y-4">
              {topicData.length ? (
                topicData.map((topic) => (
                  <div key={topic.name}>
                    <div className="mb-1.5 flex items-center justify-between text-[13px]">
                      <span className="text-[#8a96a8]">{topic.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
                          {topic.tests} tests
                        </span>
                        <span
                          className="font-[Space_Grotesk,sans-serif] font-bold"
                          style={{ color: topic.color }}
                        >
                          {topic.accuracy}%
                        </span>
                      </div>
                    </div>
                    <MiniBar
                      value={topic.accuracy}
                      max={100}
                      color={topic.color}
                    />
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-[#5b6577]">
                  Complete a few tests to see topic-level insights here.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
          {/* Rank card with accuracy radial */}
          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
            <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
              Your Ranking
            </h2>
            <p className="mt-0.5 text-[13px] text-[#8a96a8]">
              Where you stand on the leaderboard
            </p>

            {myRankEntry ? (
              <>
                <div className="mt-5 flex items-center gap-5">
                  <div className="relative h-28 w-28 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={accuracyChartData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 100]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RadialBar
                          background={{ fill: "#212a37" }}
                          dataKey="value"
                          cornerRadius={8}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-[Space_Grotesk,sans-serif] text-xl font-bold">
                        {Math.round(myRankEntry.averageAccuracy)}%
                      </span>
                      <span className="font-[JetBrains_Mono,monospace] text-[9px] text-[#5b6577]">
                        ACCURACY
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="font-[Space_Grotesk,sans-serif] text-3xl font-bold text-[#6ee7c9]">
                      #{myRankEntry.rank}
                      <span className="ml-0.5 text-base text-[#5b6577]">
                        {rankSuffix(myRankEntry.rank)}
                      </span>
                    </div>
                    <p className="mt-1 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577]">
                      out of {leaderboard.length} learners
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-2.5">
                    <div className="font-[Space_Grotesk,sans-serif] text-base font-bold">
                      {myRankEntry.totalTestsTaken}
                    </div>
                    <div className="mt-0.5 text-[9.5px] tracking-wider text-[#5b6577] uppercase">
                      Tests taken
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-2.5">
                    <div className="font-[Space_Grotesk,sans-serif] text-base font-bold">
                      {myRankEntry.totalXP.toLocaleString()}
                    </div>
                    <div className="mt-0.5 text-[9.5px] tracking-wider text-[#5b6577] uppercase">
                      Total XP
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-[10px] border border-dashed border-[#212a37] bg-[#141b25] p-6 text-center text-[13px] text-[#5b6577]">
                Complete a test to appear on the leaderboard.
              </div>
            )}
          </div>

          {/* You vs average chart */}
          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
            <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
              You vs. Platform Average
            </h2>
            <p className="mt-0.5 text-[13px] text-[#8a96a8]">
              How your numbers compare to everyone else
            </p>

            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} barGap={6}>
                  <CartesianGrid stroke="#212a37" vertical={false} />
                  <XAxis
                    dataKey="metric"
                    tick={{ fill: "#5b6577", fontSize: 11 }}
                    axisLine={{ stroke: "#212a37" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#5b6577", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    contentStyle={CHART_TOOLTIP_STYLE}
                  />
                  <Bar dataKey="You" fill="#6ee7c9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Average" fill="#3a4a5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-5 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
              <span className="flex items-center gap-1.5">
                <i className="inline-block h-2 w-2 rounded-sm bg-[#6ee7c9]" />{" "}
                You
              </span>
              <span className="flex items-center gap-1.5">
                <i className="inline-block h-2 w-2 rounded-sm bg-[#3a4a5e]" />{" "}
                Average
              </span>
            </div>
          </div>
        </div>

        {/* Streak + focus areas */}
        <div className="grid gap-3.5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
            <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
              Consistency streak
            </h2>
            <p className="mt-0.5 text-[13px] text-[#8a96a8]">
              Keep up the rhythm with your recent practice pattern
            </p>

            <div className="mt-5 rounded-[14px] border border-[#212a37] bg-[#141b25] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
                    Current streak
                  </p>
                  <p className="mt-1 font-[Space_Grotesk,sans-serif] text-[26px] font-bold">
                    {currentStreak} days
                  </p>
                </div>
                <div className="rounded-[14px] border border-[rgba(242,137,107,0.3)] bg-[rgba(242,137,107,0.12)] p-3 text-[#f2896b]">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#212a37]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#8b7cf6] to-[#6ee7c9] transition-[width] duration-500"
                  style={{ width: `${weeklyGoalProgress}%` }}
                />
              </div>
              <p className="mt-2 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577]">
                {weeklyGoalProgress}% of the way to your weekly goal · best{" "}
                {longestStreak}d
              </p>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] p-4">
                <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
                  Best day
                </p>
                <p className="mt-1 font-[Space_Grotesk,sans-serif] text-lg font-bold">
                  {bestDay?.date || "—"}
                </p>
                <p className="text-[12.5px] text-[#6ee7c9]">
                  {bestDay?.score ?? 0}% score
                </p>
              </div>
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] p-4">
                <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
                  Focus goal
                </p>
                <p className="mt-1 font-[Space_Grotesk,sans-serif] text-lg font-bold">
                  3 timed sets
                </p>
                <p className="text-[12.5px] text-[#6ee7c9]">This week</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
            <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
              Focus areas
            </h2>
            <p className="mt-0.5 text-[13px] text-[#8a96a8]">
              Topics that need a little more attention
            </p>

            <div className="mt-5 space-y-3">
              {focusAreas.length > 0 &&
              focusAreas[0].topic !== "No completed tests yet" ? (
                focusAreas.map((item) => (
                  <div
                    key={item.topic}
                    className="rounded-[14px] border border-[rgba(242,85,90,0.25)] bg-[rgba(242,85,90,0.06)] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[13.5px] font-semibold">
                        {item.topic}
                      </p>
                      <span className="font-[JetBrains_Mono,monospace] text-[13px] font-bold text-[#f2555a]">
                        {item.accuracy}%
                      </span>
                    </div>
                    <MiniBar value={item.accuracy} max={100} color="#f2555a" />
                    <p className="mt-2 text-[12.5px] text-[#8a96a8]">
                      {item.tip}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex min-h-45 items-center justify-center rounded-[14px] border border-dashed border-[#212a37] bg-[#141b25] p-6 text-center">
                  <div>
                    <p className="text-[14px] font-semibold">
                      No focus areas found
                    </p>
                    <p className="mt-1 text-[12.5px] text-[#5b6577]">
                      Complete a few more tests to receive personalized
                      improvement suggestions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next best step */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-[14px] border border-[rgba(139,124,246,0.3)] bg-[rgba(139,124,246,0.1)] p-2.5 text-[#8b7cf6]">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold">Next best step</p>
              <p className="text-[12.5px] text-[#8a96a8]">{nextStep}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/tests")}
            className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-5 py-2.5 text-[13px] font-bold text-[#06120d] transition hover:brightness-105"
          >
            Continue practice
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
