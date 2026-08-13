"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Flag, Search } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

type ReportRow = {
  _id: string
  reportType: "question" | "user" | "content"
  status: "pending" | "resolved" | "rejected"
  reason: string
  adminNotes?: string
  createdAt?: string
  reportedBy?: { name?: string; email?: string } | null
  questionId?: string
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<ReportRow[]>([])
  const [search, setSearch] = useState("")
  const [notes, setNotes] = useState<Record<string, string>>({})

  const loadReports = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/reports?status=all&limit=200", {
        credentials: "include",
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load reports")
      }

      setRows(json.data ?? [])
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to load admin reports"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadReports()
  }, [])

  const actOnReport = async (id: string, action: "resolve" | "reject" | "reopen") => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          action,
          adminNotes: notes[id] ?? "",
        }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update report")
      }

      toast.success(`Report ${action === "resolve" ? "resolved" : action === "reject" ? "rejected" : "reopened"}`)
      await loadReports()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update report")
    }
  }

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      r.reason.toLowerCase().includes(q) ||
      r.reportType.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.reportedBy?.name?.toLowerCase().includes(q) ||
      r.reportedBy?.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 p-6 mt-12 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">Admin Reports</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Review user/content/question reports (pending).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Rows: {filtered.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reason / type / status..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden xl:table-cell">Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{r.reportType}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-130 truncate text-sm" title={r.reason}>
                          {r.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            r.status === "pending"
                              ? "bg-amber-500 text-white"
                              : r.status === "resolved"
                                ? "bg-emerald-600 text-white"
                                : "bg-rose-600 text-white"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{r.reportedBy?.name ?? "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{r.reportedBy?.email ?? "—"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Textarea
                            value={notes[r._id] ?? r.adminNotes ?? ""}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [r._id]: e.target.value }))}
                            placeholder="Admin note"
                            className="min-h-20"
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => actOnReport(r._id, "resolve")}>
                              Resolve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => actOnReport(r._id, "reject")}>
                              Reject
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => actOnReport(r._id, "reopen")}>
                              Reopen
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        This page uses the admin reports API at <span className="font-mono">/api/admin/reports</span>.
      </div>
    </div>
  )
}

