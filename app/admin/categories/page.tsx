"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Layers, Plus, Search } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Subcategory = {
  _id: string
  categoryId: string
  name: string
  slug: string
}

type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  subcategories?: Subcategory[]
}

type CreateCategoryPayload = {
  name: string
  slug: string
  description?: string
  iconUrl?: string
  colorCode?: string
  displayOrder?: number
  isActive?: boolean
}

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [countMode, setCountMode] = useState<"category" | "subcategory">(
    "category"
  )

  const [addOpen, setAddOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [catName, setCatName] = useState("")
  const [catSlug, setCatSlug] = useState("")
  const [catDescription, setCatDescription] = useState("")
  const [catIconUrl, setCatIconUrl] = useState("")
  const [catColorCode, setCatColorCode] = useState("")

  const loadCategories = async () => {
    const res = await fetch("/api/categories?includeInactive=false")
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to fetch categories")
    }
    setCategories(json.data ?? [])
  }

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        await loadCategories()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load categories")
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories

    return categories.filter((c) => {
      const inCat =
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      const inSub = (c.subcategories ?? []).some(
        (s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
      )
      return inCat || inSub
    })
  }, [categories, search])

  const resetCreateForm = () => {
    setCatName("")
    setCatSlug("")
    setCatDescription("")
    setCatIconUrl("")
    setCatColorCode("")
  }

  const createCategory = async () => {
    const name = catName.trim()
    const slug = catSlug.trim()

    if (!name || !slug) {
      toast.error("Category name and slug are required")
      return
    }

    const payload: CreateCategoryPayload = {
      name,
      slug,
      description: catDescription.trim() || undefined,
      iconUrl: catIconUrl.trim() || undefined,
      colorCode: catColorCode.trim() || undefined,
      displayOrder: 0,
      isActive: true,
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to create category")
      }

      toast.success("Category created")
      setAddOpen(false)
      resetCreateForm()
      await loadCategories()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create category")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6 mt-12 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">Admin Categories</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                View active categories and subcategories from the database.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Categories: {categories.length}</Badge>
              <Badge>
                Subcategories shown:{" "}
                {categories.reduce(
                  (acc, c) => acc + (c.subcategories?.length ?? 0),
                  0
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories or subcategories..."
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Select
                value={countMode}
                onValueChange={(v) => setCountMode(v as any)}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Count mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Show subcategory count</SelectItem>
                  <SelectItem value="subcategory">
                    Show category count (same list)
                  </SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={addOpen} onOpenChange={setAddOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add category</SheetTitle>
                    <SheetDescription>
                      Create a new category. After creating, click it to manage its subcategories.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Name</div>
                      <Input
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="e.g. Mathematics"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Slug</div>
                      <Input
                        value={catSlug}
                        onChange={(e) => setCatSlug(e.target.value)}
                        placeholder="e.g. mathematics"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Description (optional)</div>
                      <Input
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        placeholder="Short description"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Icon URL (optional)</div>
                      <Input
                        value={catIconUrl}
                        onChange={(e) => setCatIconUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Color code (optional)</div>
                      <Input
                        value={catColorCode}
                        onChange={(e) => setCatColorCode(e.target.value)}
                        placeholder="#RRGGBB"
                      />
                    </div>
                  </div>

                  <SheetFooter>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setAddOpen(false)
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={createCategory} disabled={submitting}>
                      {submitting ? "Creating..." : "Create"}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
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
                  <TableHead className="w-65">Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="text-right">Subcategories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-28 text-center text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((cat) => (
                    <TableRow key={cat._id}>
                      <TableCell>
                        <Link
                          href={`/admin/categories/${cat.slug}`}
                          className="group inline-flex items-center gap-2 hover:underline"
                        >
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{cat.name}</span>
                        </Link>

                        {(cat.subcategories ?? []).length > 0 && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {(cat.subcategories ?? [])
                              .slice(0, 3)
                              .map((s) => s.name)
                              .join(", ")}
                            {(cat.subcategories ?? []).length > 3 ? "…" : ""}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="max-w-130">
                        <span className="text-muted-foreground line-clamp-2">
                          {cat.description ?? "—"}
                        </span>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{cat.slug}</Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge>{(cat.subcategories ?? []).length}</Badge>
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
        Tip: Click a category to open details and add subcategories.
      </div>
    </div>
  )
}

