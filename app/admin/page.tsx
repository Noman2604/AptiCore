"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  ClipboardList,
  Layers,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  FileBadge,
} from "lucide-react"

import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AdminSummary = {
  usersTotal?: number
  usersActive?: number
  resultsTotal?: number
  resultsCompleted?: number
  resultsAbandoned?: number
  resultsInProgress?: number
  avgAccuracy?: number
}

const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  tone,
}: {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  subtitle?: string
  tone: "blue" | "emerald" | "amber" | "rose" | "indigo"
}) => {
  const toneClass =
    tone === "blue"
      ? "border-sky-500/20"
      : tone === "emerald"
        ? "border-emerald-500/20"
        : tone === "amber"
          ? "border-amber-500/20"
          : tone === "rose"
            ? "border-rose-500/20"
            : "border-indigo-500/20"

  const iconToneClass =
    tone === "blue"
      ? "text-sky-500"
      : tone === "emerald"
        ? "text-emerald-500"
        : tone === "amber"
          ? "text-amber-500"
          : tone === "rose"
            ? "text-rose-500"
            : "text-indigo-500"

  return (
    <Card className={`${toneClass} bg-card/60`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </div>
          <div className={`rounded-lg bg-muted/40 p-2 ${iconToneClass}`}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div className="text-3xl font-semibold tabular-nums">{value}</div>
        </div>
        {subtitle ? (
          <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<AdminSummary>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const run = async () => {
      try {
        setLoading(true)

        // Reuse existing data shape behind admin APIs if available.
        // We attempt to fetch multiple lightweight summaries.
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
          usersRes.status === "fulfilled" ? await usersRes.value.json() : null
        const resultsJson =
          resultsRes.status === "fulfilled" ? await resultsRes.value.json() : null
        const accuracyJson =
          accuracyRes.status === "fulfilled" ? await accuracyRes.value.json() : null

        if (usersJson && !usersJson.success) {
          throw new Error(usersJson.error || "Failed to load users summary")
        }
        if (resultsJson && !resultsJson.success) {
          throw new Error(resultsJson.error || "Failed to load results summary")
        }

        const usersData = usersJson?.data ?? []
        const resultsData = resultsJson?.data ?? []
        const completedData = accuracyJson?.data ?? []

        const usersTotal = usersData.length
        const usersActive = usersData.filter((u: any) => u.isActive).length

        const resultsTotal = resultsData.length
        const resultsCompleted = resultsData.filter((r: any) => r.status === "completed").length
        const resultsAbandoned = resultsData.filter((r: any) => r.status === "abandoned").length
        const resultsInProgress = resultsData.filter((r: any) => r.status === "in_progress").length

        const completedAccs = (completedData as any[])
          .map((r) => r.accuracy)
          .filter((a) => typeof a === "number")

        const avgAccuracy = completedAccs.length
          ? completedAccs.reduce((a: number, b: number) => a + b, 0) / completedAccs.length
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
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quick overview of users and test activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Live summary
          </Badge>
          <Badge>
            Avg accuracy: {Number.isFinite(summary.avgAccuracy ?? 0) ? (summary.avgAccuracy ?? 0).toFixed(1) : "0.0"}%
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          tone="blue"
          title="Users"
          value={loading ? "—" : summary.usersTotal ?? 0}
          subtitle="Total registered accounts"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          tone="emerald"
          title="Active Users"
          value={loading ? "—" : summary.usersActive ?? 0}
          subtitle="Currently active"
          icon={<Shield className="h-5 w-5" />}
        />
        <StatCard
          tone="amber"
          title="Results Completed"
          value={loading ? "—" : summary.resultsCompleted ?? 0}
          subtitle="Finished attempts"
          icon={<FileBadge className="h-5 w-5" />}
        />
        <StatCard
          tone="rose"
          title="Abandoned"
          value={loading ? "—" : summary.resultsAbandoned ?? 0}
          subtitle="Dropped mid-way"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/analytics" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <Users className="h-4 w-4" />
                User Management
              </Button>
            </Link>
            <Link href="/admin/results" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <ClipboardList className="h-4 w-4" />
                Results
              </Button>
            </Link>
            <Link href="/admin/questions" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <FileText className="h-4 w-4" />
                Questions
              </Button>
            </Link>
            <Link href="/admin/tests" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <Layers className="h-4 w-4" />
                Tests
              </Button>
            </Link>
            <Link href="/admin/categories" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <Sparkles className="h-4 w-4" />
                Categories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total results</span>
              <span className="text-sm font-medium tabular-nums">
                {loading ? "—" : summary.resultsTotal ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In progress</span>
              <span className="text-sm font-medium tabular-nums">
                {loading ? "—" : summary.resultsInProgress ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-medium tabular-nums">
                {loading ? "—" : summary.resultsCompleted ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Abandoned</span>
              <span className="text-sm font-medium tabular-nums">
                {loading ? "—" : summary.resultsAbandoned ?? 0}
              </span>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              Summary computed from admin results endpoints (limited rows).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

