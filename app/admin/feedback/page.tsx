"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Flag, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

type FeedbackRow = {
  _id: string
  feedbackType: "feedback" | "comment"
  targetType: "question" | "test" | "result" | "page" | "platform"
  status: "pending" | "published" | "hidden" | "resolved"
  title?: string
  content: string
  rating?: number
  sentiment?: "positive" | "neutral" | "negative"
  createdAt?: string
  userId?: { name?: string; email?: string; role?: string } | null
}

export default function AdminFeedbackPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<FeedbackRow[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("pending")
  const [targetType, setTargetType] = useState("all")

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: "200",
      })
      if (status !== "all") params.set("status", status)
      if (targetType !== "all") params.set("targetType", targetType)

      const res = await fetch(`/api/admin/feedback?${params.toString()}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load feedback")
      }

      setRows(json.data ?? [])
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load feedback"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFeedback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, targetType])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((item) => {
      return (
        item.content.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.feedbackType.toLowerCase().includes(q) ||
        item.targetType.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.userId?.email?.toLowerCase().includes(q) ||
        item.userId?.name?.toLowerCase().includes(q)
      )
    })
  }, [rows, search])

  const updateStatus = async (id: string, nextStatus: FeedbackRow["status"]) => {
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || "Update failed")
      toast.success("Feedback updated")
      await loadFeedback()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed")
    }
  }

  return (
    <div className="space-y-6 p-6 mt-12 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">
                Admin Feedback
              </CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Review user feedback and comments, then resolve, hide, or keep them published.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Rows: {filtered.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content / title / user..."
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="all">All statuses</SelectItem>
            </SelectContent>
          </Select>
          <Select value={targetType} onValueChange={setTargetType}>
            <SelectTrigger>
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All targets</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="result">Result</SelectItem>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="platform">Platform</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden xl:table-cell">Created</TableHead>
                  <TableHead>Actions</TableHead>
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
                      No feedback found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">{item.feedbackType}</Badge>
                          <div className="text-xs text-muted-foreground">
                            {item.targetType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-96 space-y-1">
                          {item.title && (
                            <div className="font-medium">{item.title}</div>
                          )}
                          <div
                            className="truncate text-sm text-muted-foreground"
                            title={item.content}
                          >
                            {item.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.status === "pending"
                              ? "bg-amber-500 text-white"
                              : item.status === "resolved"
                                ? "bg-emerald-600 text-white"
                                : item.status === "hidden"
                                  ? "bg-slate-700 text-white"
                                  : "bg-sky-600 text-white"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {item.userId?.name ?? "Anonymous"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.userId?.email ?? "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(item._id, "published")}
                          >
                            Publish
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(item._id, "resolved")}
                          >
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(item._id, "hidden")}
                          >
                            Hide
                          </Button>
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

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Flag className="h-4 w-4" />
        This page uses the admin feedback API at <span className="font-mono">/api/admin/feedback</span>.
      </div>
    </div>
  )
}
