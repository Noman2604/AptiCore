"use client"

import React, { useEffect, useMemo, useState } from "react"
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
  KeyRound,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react"

import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type AdminSummary = {
  usersTotal?: number
  usersActive?: number
  resultsTotal?: number
  resultsCompleted?: number
  resultsAbandoned?: number
  resultsInProgress?: number
  avgAccuracy?: number
}

type ActivityItem = {
  id: string
  title: string
  description?: string
  time: string
  tone: "emerald" | "amber" | "rose" | "indigo"
  icon: React.ReactNode
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

function formatPct(n: number) {
  if (!Number.isFinite(n)) return "0.0%"
  return `${n.toFixed(1)}%`
}

export default function SuperAdminDashboardPage() {
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

        // If super-admin has separate endpoints later, this block is where to swap them.
        const [usersRes, resultsRes, accuracyRes] = await Promise.allSettled([
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

        // Some APIs may provide accuracy as part of completed results.
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

  const activityItems: ActivityItem[] = useMemo(
    () => [
      {
        id: "a1",
        title: "Access policy verified",
        description: "Role mappings for super-admin checked successfully.",
        time: "Just now",
        tone: "emerald",
        icon: <CheckCircle2 className="h-4 w-4" />,
      },
      {
        id: "a2",
        title: "Admin audit snapshot",
        description: "Audit log prepared for the last 24 hours.",
        time: "12m ago",
        tone: "indigo",
        icon: <Activity className="h-4 w-4" />,
      },
      {
        id: "a3",
        title: "Rate limit recalibrated",
        description: "Requests per minute tuned for stability.",
        time: "1h ago",
        tone: "amber",
        icon: <RotateCcw className="h-4 w-4" />,
      },
      {
        id: "a4",
        title: "Anomalies detected",
        description: "Temporary alert raised for unusual login attempts.",
        time: "2h ago",
        tone: "rose",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
    ],
    []
  )

  const maintenanceText = useMemo(() => {
    // Pure UI banner. Can be tied to an API later.
    return {
      title: "System Health: Operational",
      detail: "Background jobs running normally. No active maintenance windows detected.",
    }
  }, [])

  const avgAcc = loading ? 0 : summary.avgAccuracy ?? 0

  if (!mounted) return null

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Super Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cross-tenant oversight for admins, access policies, and system activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Live summary
          </Badge>
          <Badge>
            Avg accuracy: {formatPct(avgAcc)}
          </Badge>
        </div>
      </div>

      {/* Maintenance / health banner */}
      <Card className="bg-linear-to-r from-muted/50 to-transparent">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold">{maintenanceText.title}</div>
              <div className="text-sm text-muted-foreground">{maintenanceText.detail}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/super-admin/logs">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                View logs
              </Button>
            </Link>
            <Link href="/super-admin/access">
              <Button variant="outline" className="gap-2">
                <KeyRound className="h-4 w-4" />
                Audit access
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
            <Link href="/super-admin/analytics" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>

            <Link href="/super-admin/users" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <Users className="h-4 w-4" />
                User management
              </Button>
            </Link>

            <Link href="/super-admin/access" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <KeyRound className="h-4 w-4" />
                Access & roles
              </Button>
            </Link>

            <Link href="/super-admin/admins" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <Shield className="h-4 w-4" />
                Admin management
              </Button>
            </Link>

            <Link href="/super-admin/settings" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <Settings className="h-4 w-4" />
                System settings
              </Button>
            </Link>

            <Link href="/super-admin/logs" className="block">
              <Button className="h-full w-full justify-start gap-2" variant="outline">
                <FileText className="h-4 w-4" />
                Audit logs
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

      {/* Extra UI: Activity feed + recent alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={
                      item.tone === "emerald"
                        ? "mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400"
                        : item.tone === "amber"
                          ? "mt-0.5 rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400"
                          : item.tone === "rose"
                            ? "mt-0.5 rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400"
                            : "mt-0.5 rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400"
                    }
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate font-medium">{item.title}</div>
                      <div className="shrink-0 text-xs text-muted-foreground">{item.time}</div>
                    </div>
                    {item.description ? (
                      <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-500" />
                  <div>
                    <div className="text-sm font-medium">Suspicious login pattern</div>
                    <div className="text-xs text-muted-foreground">Investigate last sign-ins</div>
                  </div>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              <Separator className="my-3" />
              <Link href="/super-admin/logs">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Review audit trail
                </Button>
              </Link>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-amber-500" />
                  <div>
                    <div className="text-sm font-medium">Cache warm-up pending</div>
                    <div className="text-xs text-muted-foreground">Will complete in ~5m</div>
                  </div>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <Separator className="my-3" />
              <Link href="/super-admin/settings">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Layers className="h-4 w-4" />
                  Run maintenance tasks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

