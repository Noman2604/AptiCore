"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Layers, MoreHorizontal, PencilLine, Plus, Trash2 } from "lucide-react"

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

type Subcategory = {
  _id: string
  categoryId: string
  name: string
  slug: string
  description?: string
}

type CategoryDetails = {
  _id: string
  name: string
  slug: string
  description?: string
  subcategories?: Subcategory[]
}

export default function AdminCategoryDetailsPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params.slug

  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<CategoryDetails | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [subName, setSubName] = useState("")
  const [subSlug, setSubSlug] = useState("")
  const [subDescription, setSubDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<Subcategory | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const res = await fetch(`/api/categories/${slug}`)
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.message || json.error || "Failed to load category")
        }
        setCategory(json.data ?? null)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load category")
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [slug])

  const subcategories = useMemo(() => {
    return category?.subcategories ?? []
  }, [category])

  const resetForm = () => {
    setSubName("")
    setSubSlug("")
    setSubDescription("")
  }

  const openEditSheet = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory)
    setSubName(subcategory.name)
    setSubSlug(subcategory.slug)
    setSubDescription(subcategory.description ?? "")
  }

  const closeEditSheet = () => {
    setEditingSubcategory(null)
    resetForm()
  }

  const createSubcategory = async () => {
    if (!category?._id) return

    const name = subName.trim()
    const slugValue = subSlug.trim()

    if (!name || !slugValue) {
      toast.error("Subcategory name and slug are required")
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: category._id,
          name,
          slug: slugValue,
          description: subDescription.trim() || undefined,
          isActive: true,
          displayOrder: 0,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to create subcategory")
      }

      toast.success("Subcategory created")
      setAddOpen(false)
      resetForm()

      // Refresh details (subcategories)
      const refetch = await fetch(`/api/categories/${slug}`)
      const refetchJson = await refetch.json()
      if (refetch.ok && refetchJson.success) {
        setCategory(refetchJson.data ?? null)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create subcategory")
    } finally {
      setSubmitting(false)
    }
  }

  const saveSubcategory = async () => {
    if (!editingSubcategory?._id) return

    const name = subName.trim()
    const slugValue = subSlug.trim()

    if (!name || !slugValue) {
      toast.error("Subcategory name and slug are required")
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch(`/api/subcategories/${editingSubcategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugValue,
          description: subDescription.trim() || undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to update subcategory")
      }

      toast.success("Subcategory updated")
      closeEditSheet()

      const refetch = await fetch(`/api/categories/${slug}`)
      const refetchJson = await refetch.json()
      if (refetch.ok && refetchJson.success) {
        setCategory(refetchJson.data ?? null)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update subcategory")
    } finally {
      setSubmitting(false)
    }
  }

  const deleteSubcategory = async () => {
    if (!deleteTarget?._id) return

    try {
      setSubmitting(true)
      const res = await fetch(`/api/subcategories/${deleteTarget._id}`, {
        method: "DELETE",
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to delete subcategory")
      }

      toast.success("Subcategory deleted")
      setDeleteTarget(null)

      const refetch = await fetch(`/api/categories/${slug}`)
      const refetchJson = await refetch.json()
      if (refetch.ok && refetchJson.success) {
        setCategory(refetchJson.data ?? null)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete subcategory")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6">Loading...</CardContent>
        </Card>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground">Category not found.</div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => router.push("/admin/categories")}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 mt-12 sm:mt-2 lg:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle className="text-3xl font-semibold">{category.name}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Category details and its subcategories.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <Badge variant="outline">/{category.slug}</Badge>
          <Button variant="secondary" onClick={() => router.push("/admin/categories")}>Back</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Subcategories</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Total: {subcategories.length}
              </p>
            </div>

            <Sheet open={addOpen} onOpenChange={setAddOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              </SheetTrigger>
              <SheetContent className="p-2">
                <SheetHeader>
                  <SheetTitle>Add subcategory</SheetTitle>
                  <SheetDescription>
                    Create a new subcategory under <b>{category.name}</b>.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Name</div>
                    <Input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="e.g. Algebra" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Slug</div>
                    <Input value={subSlug} onChange={(e) => setSubSlug(e.target.value)} placeholder="e.g. algebra" />
                  </div>

                  <div className="space-y-2 mb-2">
                    <div className="text-sm font-medium">Description (optional)</div>
                    <Input value={subDescription} onChange={(e) => setSubDescription(e.target.value)} placeholder="Short description" />
                  </div>
                </div>

                <SheetFooter>
                  <Button variant="secondary" onClick={() => setAddOpen(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button onClick={createSubcategory} disabled={submitting}>
                    {submitting ? "Creating..." : "Create"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Sheet
              open={Boolean(editingSubcategory)}
              onOpenChange={(open) => {
                if (!open) closeEditSheet()
              }}
            >
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit subcategory</SheetTitle>
                  <SheetDescription>
                    Update the selected subcategory under <b>{category.name}</b>.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Name</div>
                    <Input
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      placeholder="e.g. Algebra"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Slug</div>
                    <Input
                      value={subSlug}
                      onChange={(e) => setSubSlug(e.target.value)}
                      placeholder="e.g. algebra"
                    />
                  </div>

                  <div className="space-y-2 mb-2">
                    <div className="text-sm font-medium">Description (optional)</div>
                    <Input
                      value={subDescription}
                      onChange={(e) => setSubDescription(e.target.value)}
                      placeholder="Short description"
                    />
                  </div>
                </div>

                <SheetFooter>
                  <Button
                    variant="secondary"
                    onClick={closeEditSheet}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveSubcategory} disabled={submitting}>
                    {submitting ? "Saving..." : "Save changes"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                      No subcategories yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  subcategories.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/categories/${slug}/${s.slug}`}
                          className="group inline-flex items-center gap-2 hover:underline"
                        >
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{s.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{s.slug}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.description || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditSheet(s)}>
                              <PencilLine className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-rose-600 focus:text-rose-600"
                              onClick={() => setDeleteTarget(s)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subcategory?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <b>{deleteTarget?.name}</b>. Any questions
              linked to it will lose this subcategory association.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSubcategory}
              disabled={submitting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {submitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

