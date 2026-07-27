"use client"

import { useEffect, useMemo, useState } from "react"

import { toast } from "sonner"
import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"

type AdminResult = {
  _id: string
  status: string
  startedAt?: string
  submittedAt?: string
  timeSpentSeconds?: number
  marksObtained?: number
  totalMarks?: number
  userId: {
    _id: string
    name: string
    email: string
  } | null
  testId: {
    _id: string
    title: string
  } | null
  accuracy?: number
}

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "abandoned", label: "Abandoned" },
  { value: "in_progress", label: "In progress" },
]

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString() : "—"
}

function formatDuration(seconds?: number) {
  if (seconds === undefined || seconds === null) return "—"
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<AdminResult[]>([])
  const [loading, setLoading] = useState(false)

  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [limit, setLimit] = useState(30)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState<number | null>(null)

  const loadResults = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("limit", String(limit))
      params.set("offset", String(offset))
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/results?${params.toString()}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch results")
      }

      setResults(json.data ?? [])
      setTotal(json.meta?.total ?? null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load results")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await loadResults()
    }
    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, offset, limit])



  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return results

    return results.filter((r) => {
      const name = r.userId?.name?.toLowerCase() ?? ""
      const email = r.userId?.email?.toLowerCase() ?? ""
      const title = r.testId?.title?.toLowerCase() ?? ""
      const status = r.status?.toLowerCase() ?? ""
      return name.includes(q) || email.includes(q) || title.includes(q) || status.includes(q)
    })
  }, [results, searchQuery])

  const canPrev = offset > 0
  const canNext = total === null ? filtered.length === limit : offset + limit < total

  const resetFilters = () => {
    setStatusFilter("all")
    setSearchQuery("")
    setOffset(0)
    setLimit(30)
  }

  const exportCsv = async () => {
    try {
      const params = new URLSearchParams()
      params.set("limit", String(5000))
      params.set("offset", "0")
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/results?${params.toString()}`)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || "Export failed")

      const rows = (json.data ?? []) as AdminResult[]
      const header = [
        "resultId",
        "userName",
        "userEmail",
        "testTitle",
        "status",
        "startedAt",
        "submittedAt",
        "durationSeconds",
        "marksObtained",
        "totalMarks",
        "accuracy",
      ]

      const csv = [header.join(",")]
      for (const r of rows) {
        const line = [
          r._id,
          r.userId?.name ?? "",
          r.userId?.email ?? "",
          r.testId?.title ?? "",
          r.status,
          r.startedAt ? new Date(r.startedAt).toISOString() : "",
          r.submittedAt ? new Date(r.submittedAt).toISOString() : "",
          r.timeSpentSeconds ?? "",
          r.marksObtained ?? "",
          r.totalMarks ?? "",
          r.accuracy ?? "",
        ].map((v) => {
          const s = String(v ?? "")
          const escaped = s.replaceAll('"', '""')
          return `"${escaped}"`
        })
        csv.push(line.join(","))
      }

      const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `admin-results-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("CSV exported")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "CSV export failed")
    }
  }

  return (
    <div className="space-y-6 p-6 mt-12 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">Admin Results</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Track completed/abandoned/in-progress test attempts with user + test metadata.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportCsv} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={resetFilters} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, email, test, status..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows</span>
              <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <TableHead>User</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Started</TableHead>
                  <TableHead className="hidden xl:table-cell">Submitted</TableHead>
                  <TableHead className="hidden xl:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      Loading results...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const status = r.status?.replace("_", " ") ?? "—"
                    return (
                      <TableRow key={r._id}>
                        <TableCell>
                          <div className="font-medium">{r.userId?.name ?? "Unknown user"}</div>
                          <div className="text-sm text-muted-foreground">
                            {r.userId?.email ?? "No email"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {r.testId?.title ?? "Unknown test"}
                          <div className="mt-1 text-xs text-muted-foreground">#{r._id.slice(-6)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(r.startedAt)}</TableCell>
                        <TableCell className="hidden xl:table-cell">{formatDate(r.submittedAt)}</TableCell>
                        <TableCell className="hidden xl:table-cell">{formatDuration(r.timeSpentSeconds)}</TableCell>
                        <TableCell className="text-right">
                          {r.marksObtained ?? 0}/{r.totalMarks ?? 0}
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total === null
            ? ""
            : `Showing ${Math.min(offset + 1, total)}-${Math.min(offset + limit, total)} of ${total} results`}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!canPrev || loading}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-16 text-center text-sm text-muted-foreground">{Math.floor(offset / limit) + 1}</span>
          <Button
            variant="outline"
            size="icon"
            disabled={!canNext || loading}
            onClick={() => setOffset((o) => o + limit)}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Tip: results detail page (non-admin) can be accessed if needed; admin focuses on listing/filtering.
      </div>
    </div>
  )
}

