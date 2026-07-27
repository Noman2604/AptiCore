"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Download,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AdminTest = {
  _id: string
  title: string
  description?: string
  categoryId?: { _id: string; name: string; slug?: string }
  subcategory?: { _id: string; name: string; slug?: string } | null
  createdBy?: { _id: string; name?: string; email?: string; role?: string } | null
  totalQuestions?: number
  totalMarks?: number
  durationMinutes?: number
  difficultyLevel?: string
  isPublished?: boolean
}

function safeToIsoDate(value?: string) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleString()
  } catch {
    return "—"
  }
}

function difficultyLabel(value?: string) {
  if (!value) return "—"
  const s = String(value)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<AdminTest[]>([])
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">(
    "all"
  )

  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([])

  const [limit, setLimit] = useState(30)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState<number | null>(null)

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories?limit=1000")
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load categories")
      setCategories(json.data ?? [])
    } catch (err) {
      // Non-blocking: tests list can still render.
      console.error(err)
    }
  }

  const loadTests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("limit", String(limit))
      params.set("offset", String(offset))
      params.set("adminOnly", "true")

      // Server endpoint doesn't support category filter, we do it client-side after fetch.
      const res = await fetch(`/api/tests?${params.toString()}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch tests")
      }

      setTests(json.data ?? [])
      setTotal(json.meta?.total ?? null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load tests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  useEffect(() => {
    void loadTests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, limit])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return tests.filter((t) => {
      const isPublished = Boolean(t.isPublished)

      if (statusFilter === "published" && !isPublished) return false
      if (statusFilter === "unpublished" && isPublished) return false

      if (categoryFilter !== "all") {
        const cid = t.categoryId?._id
        if (cid !== categoryFilter) return false
      }

      if (!q) return true

      const title = t.title?.toLowerCase() ?? ""
      const cat = t.categoryId?.name?.toLowerCase() ?? ""
      const creatorName = t.createdBy?.name?.toLowerCase() ?? ""
      const creatorEmail = t.createdBy?.email?.toLowerCase() ?? ""
      const difficulty = t.difficultyLevel?.toLowerCase() ?? ""

      return (
        title.includes(q) ||
        cat.includes(q) ||
        creatorName.includes(q) ||
        creatorEmail.includes(q) ||
        difficulty.includes(q)
      )
    })
  }, [tests, searchQuery, statusFilter, categoryFilter])

  const canPrev = offset > 0
  const canNext = total === null ? filtered.length === limit : offset + limit < total

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setOffset(0)
    setLimit(30)
  }

  const exportCsv = async () => {
    try {
      // Export from server without pagination by fetching a larger chunk.
      // (Matches existing style in other admin pages.)
      const params = new URLSearchParams()
      params.set("limit", String(5000))
      params.set("offset", "0")
      params.set("adminOnly", "true")

      const res = await fetch(`/api/tests?${params.toString()}`)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || "Export failed")

      const rows = (json.data ?? []) as AdminTest[]

      const header = [
        "testId",
        "title",
        "category",
        "createdByName",
        "createdByEmail",
        "difficulty",
        "totalQuestions",
        "totalMarks",
        "durationMinutes",
        "published",
      ]

      const effective = rows
        .filter((t) => {
          const isPublished = Boolean(t.isPublished)
          if (statusFilter === "published" && !isPublished) return false
          if (statusFilter === "unpublished" && isPublished) return false
          if (categoryFilter !== "all") {
            return t.categoryId?._id === categoryFilter
          }
          return true
        })
        .filter((t) => {
          const q = searchQuery.trim().toLowerCase()
          if (!q) return true
          const title = t.title?.toLowerCase() ?? ""
          const cat = t.categoryId?.name?.toLowerCase() ?? ""
          const creatorName = t.createdBy?.name?.toLowerCase() ?? ""
          const creatorEmail = t.createdBy?.email?.toLowerCase() ?? ""
          const difficulty = t.difficultyLevel?.toLowerCase() ?? ""
          return (
            title.includes(q) ||
            cat.includes(q) ||
            creatorName.includes(q) ||
            creatorEmail.includes(q) ||
            difficulty.includes(q)
          )
        })

      const csv: string[] = [header.join(",")]

      for (const t of effective) {
        const line = [
          t._id,
          t.title ?? "",
          t.categoryId?.name ?? "",
          t.createdBy?.name ?? "",
          t.createdBy?.email ?? "",
          t.difficultyLevel ?? "",
          t.totalQuestions ?? "",
          t.totalMarks ?? "",
          t.durationMinutes ?? "",
          Boolean(t.isPublished) ? "true" : "false",
        ].map((v) => {
          const s = String(v ?? "")
          const escaped = s.replaceAll('"', '""')
          return `"${escaped}"`
        })
        csv.push(line.join(","))
      }

      const blob = new Blob([csv.join("\n")], {
        type: "text/csv;charset=utf-8",
      })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `admin-tests-list-${Date.now()}.csv`
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
              <CardTitle className="text-3xl font-semibold">Admin Tests</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage admin-created tests (create, filter, and export).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/admin/tests/new">
                <Button className="gap-2 text-xs">
                  <Plus /> Create Test
                </Button>
              </Link>
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
                placeholder="Search title, category, creator, difficulty..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Published status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Total Qs</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      Loading tests...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      No tests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell className="min-w-65">
                        <div className="font-medium">{t.title ?? "Untitled"}</div>
                        <div className="text-sm text-muted-foreground">
                          Created by {t.createdBy?.name ?? "Unknown"}
                          {t.createdBy?.email ? ` (${t.createdBy.email})` : ""}
                        </div>
                      </TableCell>
                      <TableCell>{t.categoryId?.name ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{difficultyLabel(t.difficultyLevel)}</Badge>
                      </TableCell>
                      <TableCell>{t.totalQuestions ?? 0}</TableCell>
                      <TableCell>{t.totalMarks ?? 0}</TableCell>
                      <TableCell>{t.durationMinutes ?? "—"} min</TableCell>
                      <TableCell>
                        <Badge variant={t.isPublished ? "default" : "secondary"}>
                          {t.isPublished ? "Published" : "Unpublished"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
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
            : `Showing ${Math.min(offset + 1, total)}-${Math.min(offset + limit, total)} of ${total} tests`}
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
          <span className="min-w-16 text-center text-sm text-muted-foreground">
            {Math.floor(offset / limit) + 1}
          </span>
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

    </div>
  )
}

