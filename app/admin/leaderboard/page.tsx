"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Download, Loader2, Medal, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type LeaderboardEntry = {
  _id: string
  userId?: {
    _id?: string
    username?: string
    name?: string
    email?: string
    avatar?: string
  } | null
  totalXP?: number
  totalTestsTaken?: number
  averageAccuracy?: number
  rank?: number
  level?: number
  updatedAt?: string
}

export default function AdminLeaderboardPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<LeaderboardEntry[]>([])
  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState(100)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/leaderboard?limit=${limit}&offset=0`)
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load leaderboard")
        }
        setRows(json.data ?? [])
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "Failed to load leaderboard"
        )
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [limit])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((r) => {
      const username = r.userId?.username ?? r.userId?.name ?? ""
      const email = r.userId?.email ?? ""
      return (
        username.toLowerCase().includes(q) || email.toLowerCase().includes(q)
      )
    })
  }, [rows, search])

  const exportCsv = async () => {
    if (exporting) return

    try {
      setExporting(true)
      toast.loading("Preparing CSV...", { id: "csv-export" })

      const res = await fetch(
        `/api/leaderboard?limit=${Math.min(5000, limit)}&offset=0`
      )

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Export failed")
      }

      const header = [
        "Rank",
        "Username",
        "Email",
        "XP",
        "Level",
        "Tests Taken",
        "Average Accuracy",
        "Updated At",
      ]

      const csv = [header.join(",")]

      for (const r of (json.data ?? []) as LeaderboardEntry[]) {
        const username = r.userId?.username || r.userId?.name || "Unknown"

        const row = [
          r.rank,
          username,
          r.userId?.email ?? "",
          r.totalXP,
          r.level,
          r.totalTestsTaken,
          `${r.averageAccuracy}%`,
          r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "",
        ].map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)

        csv.push(row.join(","))
      }

      const blob = new Blob([csv.join("\n")], {
        type: "text/csv;charset=utf-8",
      })

      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `leaderboard-${new Date().toISOString().slice(0, 10)}.csv`

      document.body.appendChild(link)
      link.click()

      link.remove()
      URL.revokeObjectURL(url)

      toast.success(`${json.data.length} records exported successfully`, {
        id: "csv-export",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed", {
        id: "csv-export",
      })
    } finally {
      setExporting(false)
    }
  }
  return (
    <div className="mt-12 space-y-6 p-6 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">
                Admin Leaderboard
              </CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Global leaderboard (ranked by rank/totalXP depending on backend
                ordering).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={exportCsv}
                disabled={exporting}
                className="gap-2 rounded-xl"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search username or email..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows</span>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                {[25, 50, 100, 200].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-22.5">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Level</TableHead>
                  <TableHead className="hidden lg:table-cell">XP</TableHead>
                  <TableHead className="hidden xl:table-cell">Tests</TableHead>
                  <TableHead className="text-right">Avg accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-28 text-center text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No entries.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const username =
                      r.userId?.username ?? r.userId?.name ?? "Unknown"
                    return (
                      <TableRow key={r._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {r.rank === 1 ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-yellow-500 text-xs font-semibold text-white">
                                1
                              </span>
                            ) : (
                              <Badge variant="outline">{r.rank ?? "—"}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {username || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {r.userId?.email ?? "No email"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {r.level ?? "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {r.totalXP ?? 0}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {r.totalTestsTaken ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.averageAccuracy ?? 0}%
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
