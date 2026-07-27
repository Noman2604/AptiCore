"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, TrendingUp, Users } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  status: string
  createdAt?: string
  submittedAt?: string
  startedAt?: string
  accuracy?: number
  userId?: { name?: string } | string | null
}

type StatusBucket = {
  status: string
  count: number
  avgAccuracy: number
}

const statuses = ["completed", "abandoned", "in_progress"]

type TimePoint = {
  label: string
  avgAccuracy: number
  count: number
}

function formatDateLabel(d: Date) {
  // short + stable ordering without relying on locale quirks for parsing
  const day = d.toLocaleDateString("en", { month: "short", day: "numeric" })
  return day
}

function safeNumber(n: unknown) {
  return typeof n === "number" && Number.isFinite(n) ? n : null
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<AdminResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          `/api/admin/results?limit=200&offset=0&status=all`
        )
        const json = await res.json()

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to fetch analytics data")
        }

        setRows(json.data ?? [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  const buckets: StatusBucket[] = useMemo(() => {
    const map = new Map<string, { count: number; sumAcc: number; sumAccN: number }>()

    for (const s of statuses) {
      map.set(s, { count: 0, sumAcc: 0, sumAccN: 0 })
    }

    for (const r of rows) {
      const key = r.status
      if (!map.has(key)) continue
      const agg = map.get(key)!
      agg.count += 1
      const acc = safeNumber(r.accuracy)
      if (acc !== null) {
        agg.sumAcc += acc
        agg.sumAccN += 1
      }
    }

    return statuses.map((status) => {
      const agg = map.get(status)!
      const avgAccuracy = agg.sumAccN ? agg.sumAcc / agg.sumAccN : 0
      return { status, count: agg.count, avgAccuracy }
    })
  }, [rows])

  const totals = useMemo(() => {
    const total = rows.length
    const completed = buckets.find((b) => b.status === "completed")?.count ?? 0
    const abandoned = buckets.find((b) => b.status === "abandoned")?.count ?? 0
    const inProgress =
      buckets.find((b) => b.status === "in_progress")?.count ?? 0
    const avgAccuracy = (() => {
      const completedRows = rows.filter((r) => r.status === "completed")
      const accs = completedRows
        .map((r) => safeNumber(r.accuracy))
        .filter((a): a is number => a !== null)

      if (!accs.length) return 0
      return accs.reduce((a, b) => a + b, 0) / accs.length
    })()

    return { total, completed, abandoned, inProgress, avgAccuracy }
  }, [rows, buckets])

  const timeSeriesData: TimePoint[] = useMemo(() => {
    // bucket by day (based on createdAt/submittedAt/startedAt)
    const points = new Map<string, { sumAcc: number; nAcc: number; count: number }>()
    const getTs = (r: AdminResult) =>
      r.createdAt || r.submittedAt || r.startedAt || undefined

    for (const r of rows) {
      const ts = getTs(r)
      if (!ts) continue
      const d = new Date(ts)
      if (Number.isNaN(d.getTime())) continue

      const key = d.toISOString().slice(0, 10) // YYYY-MM-DD
      const existing =
        points.get(key) || { sumAcc: 0, nAcc: 0, count: 0 }

      existing.count += 1
      const acc = safeNumber(r.accuracy)
      if (acc !== null) {
        existing.sumAcc += acc
        existing.nAcc += 1
      }
      points.set(key, existing)
    }

    const sortedKeys = Array.from(points.keys()).sort()
    const recentKeys = sortedKeys.slice(Math.max(0, sortedKeys.length - 14)) // last 14 days

    return recentKeys.map((key) => {
      const [yyyy, mm, dd] = key.split("-").map((x) => Number(x))
      const d = new Date(yyyy, mm - 1, dd)
      const p = points.get(key)!
      const avgAccuracy = p.nAcc ? p.sumAcc / p.nAcc : 0
      return {
        label: formatDateLabel(d),
        avgAccuracy,
        count: p.count,
      }
    })
  }, [rows])

  const topUsersData = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>()
    for (const r of rows) {
      if (r.status !== "completed") continue

      let userName = "Unknown"
      const uid = r.userId
      if (typeof uid === "string") {
        userName = uid || "Unknown"
      } else if (uid && typeof uid === "object") {
        userName = uid.name || "Unknown"
      }

      const key = userName
      const existing = map.get(key) || { name: userName, count: 0 }
      existing.count += 1
      map.set(key, existing)
    }

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((u) => ({ ...u, count: u.count }))
  }, [rows])

  const statusPieData = useMemo(() => {
    const colorByStatus: Record<string, string> = {
      completed: "#10b981",
      abandoned: "#f59e0b",
      in_progress: "#6366f1",
    }

    return statuses.map((s) => {
      const b = buckets.find((x) => x.status === s)
      return {
        name: s.replaceAll("_", " "),
        value: b?.count ?? 0,
        color: colorByStatus[s] ?? "#94a3b8",
      }
    })
  }, [buckets])

  if (loading) {
    return (
      <div className="m-6">
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            Loading analytics...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="m-6">
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Admin Analytics</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Summary based on recent test results (last 200 rows).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Results: {totals.total}</Badge>
          <Badge>
            Avg accuracy:{" "}
            {Number.isFinite(totals.avgAccuracy) ? totals.avgAccuracy.toFixed(1) : 0}%
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base font-medium">Completed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base font-medium">Abandoned</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.abandoned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-base font-medium">
                In progress
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Results over time</CardTitle>
                <div className="mt-1 text-sm text-muted-foreground">
                  Avg accuracy by day (last ~14 days)
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {timeSeriesData.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient
                        id="accuracyFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        `${Number(value ?? 0).toFixed(1)}%`,
                        "Avg accuracy",
                      ]}
                      labelFormatter={() => ""}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgAccuracy"
                      stroke="#0ea5e9"
                      fill="url(#accuracyFill)"
                      strokeWidth={2.5}
                      name="Avg accuracy"
                    />
                    {/* subtle count line */}
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                      opacity={0.35}
                      name="Count"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No time-series data available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Status distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusPieData.reduce((a, b) => a + b.value, 0) ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value: any) => [`${value}`, "Count"]}
                      labelFormatter={(label: any) => `${label}`}
                    />
                    <Pie
                      data={statusPieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {statusPieData.map((s, idx) => (
                        <Cell key={`${s.name}-${idx}`} fill={s.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No status data available.
              </div>
            )}
            <div className="mt-4 space-y-2 text-sm">
              {statusPieData.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: s.color }}
                    />
                    <span>{s.name}</span>
                  </div>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Top users by completed results</CardTitle>
              <div className="mt-1 text-sm text-muted-foreground">
                Shows the most active users among completed tests
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {topUsersData.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topUsersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickMargin={10}
                    minTickGap={10}
                  />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value}`, "Completed count"]}
                    labelFormatter={() => ""}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No completed results found to compute top users.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Avg accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.map((b) => (
                <TableRow key={b.status}>
                  <TableCell className="capitalize">
                    {b.status.replaceAll("_", " ")}
                  </TableCell>
                  <TableCell className="text-right font-medium">{b.count}</TableCell>
                  <TableCell className="text-right">
                    {b.avgAccuracy.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Note: Analytics is based on the first 200 rows from `/api/admin/results`.
      </div>
    </div>
  )
}

