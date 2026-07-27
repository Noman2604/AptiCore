"use client"

import React, { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  RotateCcw,
  TrendingUp,
  Users,
  FileText,
  X,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AdminResult = {
  _id: string
  userId?: { _id: string; name?: string; email?: string } | null
  testId?: { _id: string; title?: string } | null
  accuracy?: number
  status: "completed" | "abandoned" | "in_progress"
  startedAt?: string
  submittedAt?: string
  createdAt?: string
  timeSpentSeconds?: number
}

type AnalyticsSummary = {
  usersTotal: number
  usersActive: number
  resultsTotal: number
  resultsCompleted: number
  resultsInProgress: number
  resultsAbandoned: number
  avgAccuracy: number
}

function safePct(n: number) {
  if (!Number.isFinite(n)) return "0.0%"
  return `${n.toFixed(1)}%`
}

function formatDate(d?: string) {
  if (!d) return "—"
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return "—"
  return dt.toLocaleString()
}

function formatDurationSeconds(sec?: number) {
  const s = Number(sec ?? 0)
  if (!Number.isFinite(s) || s <= 0) return "0m"
  const mins = Math.floor(s / 60)
  const hours = Math.floor(mins / 60)
  const remMins = mins % 60
  if (hours > 0) return `${hours}h ${remMins}m`
  return `${mins}m`
}

export default function SuperAdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  const [summary, setSummary] = useState<AnalyticsSummary>({
    usersTotal: 0,
    usersActive: 0,
    resultsTotal: 0,
    resultsCompleted: 0,
    resultsInProgress: 0,
    resultsAbandoned: 0,
    avgAccuracy: 0,
  })

  const [results, setResults] = useState<AdminResult[]>([])

  const [statusFilter, setStatusFilter] = useState<
    "all" | AdminResult["status"]
  >("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchSummaryAndResults = async () => {
    try {
      setLoading(true)

      const [usersRes, resultsAllRes, completedRes, inProgressRes, abandonedRes] =
        await Promise.allSettled([
          fetch("/api/admin/users?limit=300"),
          fetch("/api/admin/results?limit=200&offset=0&status=all"),
          fetch("/api/admin/results?limit=200&offset=0&status=completed"),
          fetch("/api/admin/results?limit=200&offset=0&status=in_progress"),
          fetch("/api/admin/results?limit=200&offset=0&status=abandoned"),
        ])

      const usersJson =
        usersRes.status === "fulfilled" ? await usersRes.value.json() : null
      const resultsAllJson =
        resultsAllRes.status === "fulfilled"
          ? await resultsAllRes.value.json()
          : null
      const completedJson =
        completedRes.status === "fulfilled" ? await completedRes.value.json() : null
      const inProgressJson =
        inProgressRes.status === "fulfilled"
          ? await inProgressRes.value.json()
          : null
      const abandonedJson =
        abandonedRes.status === "fulfilled"
          ? await abandonedRes.value.json()
          : null

      if (usersJson && !usersJson.success) {
        throw new Error(usersJson.error || "Failed to load users")
      }
      if (resultsAllJson && !resultsAllJson.success) {
        throw new Error(resultsAllJson.error || "Failed to load results")
      }

      const usersData = usersJson?.data ?? []
      const resultsAllData = resultsAllJson?.data ?? []

      const completedData = completedJson?.data ?? []
      const inProgressData = inProgressJson?.data ?? []
      const abandonedData = abandonedJson?.data ?? []

      const completedCount = completedData.length
      const inProgressCount = inProgressData.length
      const abandonedCount = abandonedData.length

      const completedAccs = (completedData as any[])
        .map((r) => r.accuracy)
        .filter((a) => typeof a === "number")

      const avgAccuracy = completedAccs.length
        ? completedAccs.reduce((a: number, b: number) => a + b, 0) /
          completedAccs.length
        : 0

      setSummary({
        usersTotal: usersData.length,
        usersActive: usersData.filter((u: any) => u.isActive).length,
        resultsTotal: resultsAllData.length,
        resultsCompleted: completedCount,
        resultsInProgress: inProgressCount,
        resultsAbandoned: abandonedCount,
        avgAccuracy,
      })

      const resultsListRes = await fetch(
        `/api/admin/results?limit=${limit}&offset=0&status=${statusFilter}`
      )
      const resultsListJson = await resultsListRes.json()

      if (!resultsListJson?.success) {
        throw new Error(
          resultsListJson?.error ||
            "Failed to load results list for the selected filters"
        )
      }

      setResults(resultsListJson.data ?? [])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!mounted) return
    void fetchSummaryAndResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => {
      void fetchSummaryAndResults()
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, limit])

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return results

    return results.filter((r) => {
      const name = r.userId?.name ?? ""
      const email = r.userId?.email ?? ""
      const title = r.testId?.title ?? ""
      return (
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        title.toLowerCase().includes(q) ||
        r._id.toLowerCase().includes(q)
      )
    })
  }, [results, searchQuery])

  const exportCsv = () => {
    const headers = [
      "id",
      "userName",
      "userEmail",
      "testTitle",
      "status",
      "accuracy",
      "startedAt",
      "submittedAt",
      "timeSpentSeconds",
    ]

    const rows = filteredResults.map((r) => [
      r._id,
      r.userId?.name ?? "",
      r.userId?.email ?? "",
      r.testId?.title ?? "",
      r.status,
      typeof r.accuracy === "number" ? r.accuracy : "",
      r.startedAt ?? "",
      r.submittedAt ?? "",
      r.timeSpentSeconds ?? "",
    ])

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell ?? "")
            if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
            return s
          })
          .join(",")
      )
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `super-admin-analytics-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-500" />
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Super-admin overview of platform usage and result health.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => void fetchSummaryAndResults()}
            disabled={loading}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportCsv}
            disabled={loading || filteredResults.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" /> Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {loading ? "—" : summary.usersTotal}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Active: {loading ? "—" : summary.usersActive}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {loading ? "—" : summary.resultsCompleted}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Avg acc: {loading ? "—" : safePct(summary.avgAccuracy)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" /> In progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {loading ? "—" : summary.resultsInProgress}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Currently running attempts
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-rose-500" /> Abandoned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {loading ? "—" : summary.resultsAbandoned}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Dropped mid-way
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Result explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name/email or test title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={String(limit)}
                onValueChange={(v) => setLimit(Number(v))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                disabled={!searchQuery.trim()}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading analytics...</div>
            ) : filteredResults.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No results match the filters.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((r) => {
                    const tone =
                      r.status === "completed"
                        ? "text-emerald-500 bg-emerald-500/10"
                        : r.status === "in_progress"
                          ? "text-amber-500 bg-amber-500/10"
                          : "text-rose-500 bg-rose-500/10"

                    return (
                      <TableRow key={r._id}>
                        <TableCell>
                          <div className="font-medium">{r.userId?.name ?? "Unknown"}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-48">
                            {r.userId?.email ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-55">
                          <div className="font-medium">{r.testId?.title ?? "—"}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-64">
                            {r._id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${tone}`}
                          >
                            {r.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {typeof r.accuracy === "number" ? safePct(r.accuracy) : "—"}
                        </TableCell>
                        <TableCell>{formatDurationSeconds(r.timeSpentSeconds)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(r.submittedAt ?? r.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Showing {filteredResults.length} row(s). Analytics summary computed from admin endpoints.
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Health hints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold">Completed accuracy trend</div>
              <div className="text-sm text-muted-foreground">
                Avg accuracy is calculated from completed results returned by the backend.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

