"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileBadge,
  FileText,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  UserCheck,
  Zap,
} from "lucide-react"

import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminSummary = {
  usersTotal?: number
  usersActive?: number
  resultsTotal?: number
  resultsCompleted?: number
  resultsAbandoned?: number
  resultsInProgress?: number
  avgAccuracy?: number
}

type Tone = "blue" | "emerald" | "amber" | "rose" | "indigo" | "violet"

const toneStyles: Record<
  Tone,
  {
    border: string
    icon: string
    iconBg: string
    glow: string
  }
> = {
  blue: {
    border: "border-sky-500/20",
    icon: "text-sky-500",
    iconBg: "bg-sky-500/10",
    glow: "from-sky-500/10",
  },
  emerald: {
    border: "border-emerald-500/20",
    icon: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    glow: "from-emerald-500/10",
  },
  amber: {
    border: "border-amber-500/20",
    icon: "text-amber-500",
    iconBg: "bg-amber-500/10",
    glow: "from-amber-500/10",
  },
  rose: {
    border: "border-rose-500/20",
    icon: "text-rose-500",
    iconBg: "bg-rose-500/10",
    glow: "from-rose-500/10",
  },
  indigo: {
    border: "border-indigo-500/20",
    icon: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    glow: "from-indigo-500/10",
  },
  violet: {
    border: "border-violet-500/20",
    icon: "text-violet-500",
    iconBg: "bg-violet-500/10",
    glow: "from-violet-500/10",
  },
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone,
  trend,
}: {
  title: string
  value: React.ReactNode
  subtitle: string
  icon: React.ReactNode
  tone: Tone
  trend?: React.ReactNode
}) {
  const styles = toneStyles[tone]

  return (
    <Card
      className={`group relative overflow-hidden border ${styles.border} bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${styles.glow} to-transparent opacity-70`}
      />

      <CardContent className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold tracking-tight tabular-nums">
                {value}
              </span>

              {trend}
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <div
            className={`rounded-xl ${styles.iconBg} ${styles.icon} p-3 transition-transform duration-200 group-hover:scale-105`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingCard() {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressRow({
  label,
  value,
  total,
  icon,
}: {
  label: string
  value: number
  total: number
  icon: React.ReactNode
}) {
  const percentage =
    total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>

        <span className="text-sm font-semibold tabular-nums">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground/80 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="text-right text-[11px] text-muted-foreground">
        {percentage}% of total
      </div>
    </div>
  )
}

const quickActions = [
  {
    title: "Analytics",
    description: "Monitor platform performance",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    description: "Manage registered users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Results",
    description: "Review test submissions",
    href: "/admin/results",
    icon: ClipboardList,
  },
  {
    title: "Questions",
    description: "Manage question bank",
    href: "/admin/questions",
    icon: FileText,
  },
  {
    title: "Tests",
    description: "Create and manage tests",
    href: "/admin/tests",
    icon: Layers,
  },
  {
    title: "Categories",
    description: "Organize aptitude content",
    href: "/admin/categories",
    icon: Sparkles,
  },
]

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<AdminSummary>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [
        usersRes,
        resultsRes,
        accuracyRes,
      ] = await Promise.allSettled([
        fetch("/api/admin/users?limit=300"),
        fetch("/api/admin/results?limit=200&offset=0&status=all"),
        fetch("/api/admin/results?limit=200&offset=0&status=completed"),
      ])

      const usersJson =
        usersRes.status === "fulfilled"
          ? await usersRes.value.json()
          : null

      const resultsJson =
        resultsRes.status === "fulfilled"
          ? await resultsRes.value.json()
          : null

      const accuracyJson =
        accuracyRes.status === "fulfilled"
          ? await accuracyRes.value.json()
          : null

      if (usersJson && !usersJson.success) {
        throw new Error(
          usersJson.error || "Failed to load users summary"
        )
      }

      if (resultsJson && !resultsJson.success) {
        throw new Error(
          resultsJson.error || "Failed to load results summary"
        )
      }

      const usersData = usersJson?.data ?? []
      const resultsData = resultsJson?.data ?? []
      const completedData = accuracyJson?.data ?? []

      const usersTotal = usersData.length

      const usersActive = usersData.filter(
        (user: any) => user.isActive
      ).length

      const resultsTotal = resultsData.length

      const resultsCompleted = resultsData.filter(
        (result: any) => result.status === "completed"
      ).length

      const resultsAbandoned = resultsData.filter(
        (result: any) => result.status === "abandoned"
      ).length

      const resultsInProgress = resultsData.filter(
        (result: any) => result.status === "in_progress"
      ).length

      const completedAccuracies = (completedData as any[])
        .map((result) => result.accuracy)
        .filter((accuracy) => typeof accuracy === "number")

      const avgAccuracy = completedAccuracies.length
        ? completedAccuracies.reduce(
            (sum: number, value: number) => sum + value,
            0
          ) / completedAccuracies.length
        : 0

      setSummary({
        usersTotal,
        usersActive,
        resultsTotal,
        resultsCompleted,
        resultsAbandoned,
        resultsInProgress,
        avgAccuracy,
      })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!mounted) return

    void loadDashboard()
  }, [mounted])

  const completionRate = useMemo(() => {
    if (!summary.resultsTotal) return 0

    return Math.round(
      ((summary.resultsCompleted ?? 0) /
        summary.resultsTotal) *
        100
    )
  }, [summary.resultsCompleted, summary.resultsTotal])

  const activeUserRate = useMemo(() => {
    if (!summary.usersTotal) return 0

    return Math.round(
      ((summary.usersActive ?? 0) /
        summary.usersTotal) *
        100
    )
  }, [summary.usersActive, summary.usersTotal])

  if (!mounted) return null

  return (
    <div className="min-h-screen space-y-6 p-4 pt-20 sm:p-6 sm:pt-6 lg:p-8">
      {/* Header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
            >
              <Activity className="h-3.5 w-3.5" />
              Admin Overview
            </Badge>

            <span className="text-xs text-muted-foreground">
              Live platform data
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Monitor users, test activity, performance and platform
            health from one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden h-9 gap-2 px-3 sm:flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System operational
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={summary.usersTotal ?? 0}
              subtitle="Registered accounts"
              tone="blue"
              icon={<Users className="h-5 w-5" />}
            />

            <StatCard
              title="Active Users"
              value={summary.usersActive ?? 0}
              subtitle={`${activeUserRate}% of all users`}
              tone="emerald"
              icon={<UserCheck className="h-5 w-5" />}
              trend={
                <TrendingUp className="mb-1 h-4 w-4 text-emerald-500" />
              }
            />

            <StatCard
              title="Total Attempts"
              value={summary.resultsTotal ?? 0}
              subtitle="All recorded test attempts"
              tone="indigo"
              icon={<ClipboardList className="h-5 w-5" />}
            />

            <StatCard
              title="Completed"
              value={summary.resultsCompleted ?? 0}
              subtitle={`${completionRate}% completion rate`}
              tone="amber"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />

            <StatCard
              title="In Progress"
              value={summary.resultsInProgress ?? 0}
              subtitle="Currently active attempts"
              tone="violet"
              icon={<Zap className="h-5 w-5" />}
            />

            <StatCard
              title="Avg. Accuracy"
              value={`${(summary.avgAccuracy ?? 0).toFixed(1)}%`}
              subtitle="Across completed attempts"
              tone="rose"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </>
        )}
      </section>

      {/* Main analytics section */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Activity Overview */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
            <div>
              <CardTitle className="text-lg">
                Test Activity
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Current distribution of test attempts
              </p>
            </div>

            <Badge variant="secondary">
              {summary.resultsTotal ?? 0} total
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6 p-5">
            <ProgressRow
              label="Completed"
              value={summary.resultsCompleted ?? 0}
              total={summary.resultsTotal ?? 0}
              icon={
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              }
            />

            <ProgressRow
              label="In Progress"
              value={summary.resultsInProgress ?? 0}
              total={summary.resultsTotal ?? 0}
              icon={
                <Activity className="h-4 w-4 text-indigo-500" />
              }
            />

            <ProgressRow
              label="Abandoned"
              value={summary.resultsAbandoned ?? 0}
              total={summary.resultsTotal ?? 0}
              icon={
                <TrendingDown className="h-4 w-4 text-rose-500" />
              }
            />
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Platform Health
            </CardTitle>

            <p className="text-xs text-muted-foreground">
              Current dashboard indicators
            </p>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  User activity
                </span>

                <span className="text-sm font-semibold">
                  {activeUserRate}%
                </span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${activeUserRate}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Test completion
                </span>

                <span className="text-sm font-semibold">
                  {completionRate}%
                </span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    API Status
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dashboard endpoints
                  </p>
                </div>
              </div>

              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
                Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump directly to the most-used admin tools.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-xl bg-muted p-3 transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {action.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Bottom Summary */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="bg-linear-to-br from-card to-muted/20">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <FileBadge className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                Average Performance
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Students currently average{" "}
                <span className="font-semibold text-foreground">
                  {(summary.avgAccuracy ?? 0).toFixed(1)}%
                </span>{" "}
                accuracy on completed tests.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-card to-muted/20">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                Platform Snapshot
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {summary.resultsInProgress ?? 0} tests are currently
                in progress across the platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

