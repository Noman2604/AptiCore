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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

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

const palette = [
  "#0ea5e9",
  "#6366f1",
  "#d946ef",
  "#ef4444",
  "#f59e0b",
  "#14b8a6",
]

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
    <div className="h-2 overflow-hidden rounded-full bg-muted">
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7d")
  const [results, setResults] = useState<AnalyticsResult[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
  const weeklyGoalProgress = Math.min(
    100,
    Math.round((windowResults.length / 3) * 100)
  )
  const nextStep = focusAreas[0]?.topic
    ? `Practice ${focusAreas[0].topic} for a few focused sets today.`
    : "Complete a test to start building your analytics insights."

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center p-8 text-sm text-muted-foreground">
        Loading your analytics...
      </div>
    )
  }

  return (
    <div className="mx-auto mt-15 flex max-w-7xl flex-col gap-6 p-4 sm:mt-2 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-linear-to-br from-primary/10 via-background to-background p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-primary/15 p-2 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <Badge variant="secondary">Performance insights</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Analytics Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review your recent progress, identify weak areas, and keep your prep
            momentum high.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-background/80 p-1.5">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="rounded-xl"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Average score",
            value: `${averageScore}%`,
            change: windowResults.length ? "+ live" : "No data yet",
            icon: Target,
            color: "text-sky-500",
          },
          {
            label: "Tests taken",
            value: `${windowResults.length}`,
            change: `${completedResults.length} total`,
            icon: BookOpen,
            color: "text-emerald-500",
          },
          {
            label: "Study time",
            value: formatDuration(studyTime),
            change: "Based on completed tests",
            icon: Clock3,
            color: "text-violet-500",
          },
          {
            label: "Best result",
            value: bestResult ? `${bestResult.accuracy ?? 0}%` : "0%",
            change: bestResult?.testName || "No result yet",
            icon: Trophy,
            color: "text-amber-500",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card/70">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className={cn("rounded-xl bg-muted p-2", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-border/60 bg-card/70">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance trend</CardTitle>
                <CardDescription>
                  Your recent accuracy across the selected range
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3.5 w-3.5" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#0ea5e9"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#0ea5e9"
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value ?? 0}%`, "Score"]}
                    cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#0ea5e9"
                    fill="url(#scoreFill)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle>Topic accuracy</CardTitle>
            <CardDescription>
              How you performed across your recent topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topicData.length ? (
              topicData.map((topic) => (
                <div key={topic.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{topic.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {topic.tests} tests
                      </span>
                      <span
                        className="font-semibold"
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
              <p className="text-sm text-muted-foreground">
                Complete a few tests to see topic-level insights here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle>Consistency streak</CardTitle>
            <CardDescription>
              Keep up the rhythm with your recent practice pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current streak
                  </p>
                  <p className="text-3xl font-semibold">{currentStreak} days</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <Progress value={weeklyGoalProgress} className="mt-4" />
              <p className="mt-2 text-sm text-muted-foreground">
                You are {weeklyGoalProgress}% of the way to your weekly goal.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">Best day</p>
                <p className="mt-1 text-xl font-semibold">
                  {bestDay?.date || "—"}
                </p>
                <p className="text-sm text-primary">
                  {bestDay?.score ?? 0}% score
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">Focus goal</p>
                <p className="mt-1 text-xl font-semibold">3 timed sets</p>
                <p className="text-sm text-primary">This week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle>Focus areas</CardTitle>
            <CardDescription>
              Topics that need a little more attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusAreas.length > 0 ? (
              focusAreas.map((item) => (
                <div
                  key={item.topic}
                  className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{item.topic}</p>
                    <span className="text-sm font-semibold text-red-400">
                      {item.accuracy}%
                    </span>
                  </div>

                  <MiniBar value={item.accuracy} max={100} color="#ef4444" />

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.tip}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex min-h-45 items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center">
                <div>
                  <p className="text-base font-medium">No focus areas found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete a few more tests to receive personalized
                    improvement suggestions.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/70">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-2 text-primary">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Next best step</p>
              <p className="text-sm text-muted-foreground">{nextStep}</p>
            </div>
          </div>
          <Button className="gap-2">
            Continue practice
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
