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

type ReportRow = {
  _id: string
  reportType: "question" | "user" | "content"
  status: "pending" | "resolved" | "rejected"
  reason: string
  adminNotes?: string
  createdAt?: string
  reportedBy?: { name?: string; email?: string } | null
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<ReportRow[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)

        // Admin report APIs are not currently present in the repo tree we inspected.
        // This page uses the UI scaffolding and expects a backend endpoint.
        const res = await fetch("/api/reports?status=pending&limit=200")
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

    void run()
  }, [])

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      r.reason.toLowerCase().includes(q) ||
      r.reportType.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
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
                  <TableHead className="hidden xl:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
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
                      <TableCell className="hidden xl:table-cell">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
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
        Note: report admin API endpoint was not found in the inspected repo tree, so this page expects
        a REST endpoint at <span className="font-mono">/api/reports</span>.
      </div>
    </div>
  )
}

