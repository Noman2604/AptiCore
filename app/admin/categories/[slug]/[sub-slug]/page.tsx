"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ChevronLeft,
  Edit3,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BulkUploadWizard } from "@/components/admin/questions/BulkUploadWizard"

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
  subcategories?: Subcategory[]
}

type QuestionOption = {
  text: string
  order: number
  isCorrect: boolean
}

type Question = {
  _id: string
  categoryId: string | { _id: string; name: string; slug: string }
  subcategoryId?: string | { _id: string; name: string; slug: string }
  questionText: string
  questionType: string
  difficultyLevel: "easy" | "medium" | "hard"
  correctAnswer: string
  options?: QuestionOption[]
  explanation?: string
  marks: number
  negativeMarks: number
  timeLimitSeconds: number
  isActive: boolean
  createdAt?: string
}

const getName = (value?: string | { name: string }) => {
  if (!value) return "Unassigned"
  return typeof value === "string" ? value : value.name
}

const formatDate = (value?: string) => {
  if (!value) return "Not available"
  return new Date(value).toLocaleString()
}

export default function SubcategoryDetailsPage() {
  const params = useParams<{ slug: string; "sub-slug": string }>()
  const router = useRouter()

  const slug = params.slug
  const subSlug = params["sub-slug"]

  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<CategoryDetails | null>(null)
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [uploadWizardOpen, setUploadWizardOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    if (!slug || !subSlug) return

    try {
      setLoading(true)

      const [categoryRes, questionsRes] = await Promise.all([
        fetch(`/api/categories/${slug}`),
        fetch(`/api/questions?subcategory=${subSlug}&includeInactive=true&limit=500`),
      ])

      const categoryJson = await categoryRes.json()
      const questionsJson = await questionsRes.json()

      if (!categoryRes.ok || !categoryJson.success) {
        throw new Error(categoryJson.message || categoryJson.error || "Failed to load category")
      }

      if (!questionsRes.ok || !questionsJson.success) {
        throw new Error(questionsJson.message || questionsJson.error || "Failed to load questions")
      }

      const catData = categoryJson.data as CategoryDetails
      setCategory(catData)

      const subCat = catData.subcategories?.find((s) => s.slug === subSlug)
      if (subCat) {
        setSubcategory(subCat)
      } else {
        toast.error("Subcategory not found")
      }

      setQuestions(questionsJson.data ?? [])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [slug, subSlug])

  const stats = useMemo(() => {
    const active = questions.filter((question) => question.isActive).length
    return {
      total: questions.length,
      active,
      inactive: questions.length - active,
    }
  }, [questions])

  const handleDelete = async () => {
    if (!deleteTarget?._id) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/questions/${deleteTarget._id}`, {
        method: "DELETE",
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to delete question")
      }

      toast.success("Question deleted")
      setDeleteTarget(null)
      await loadData()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete question")
    } finally {
      setDeleting(false)
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

  if (!category || !subcategory) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground">Subcategory not found.</div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => router.back()}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-6 p-6 sm:mt-2 lg:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => router.push(`/admin/categories/${slug}`)}
              className="inline-flex items-center hover:text-foreground hover:underline"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {category.name}
            </button>
            <span>/</span>
            <span>{subcategory.name}</span>
          </div>
          <CardTitle className="text-3xl font-semibold">
            {subcategory.name}
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage questions and content for this subcategory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">/{subSlug}</Badge>
          <Badge variant="secondary">Total: {stats.total}</Badge>
          <Badge>Active: {stats.active}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="mt-2 text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="mt-2 text-2xl font-bold">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="mt-2 text-2xl font-bold">{stats.inactive}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Questions</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                All questions in this subcategory. Scroll horizontally if the
                table gets wide.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setUploadWizardOpen(true)}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Questions
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/admin/questions`
                  )
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-auto">
            <div className="min-w-275">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-90">Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Negative Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-muted-foreground"
                      >
                        No questions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.map((question) => (
                      <TableRow key={question._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="line-clamp-2 font-medium">
                              {question.questionText}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground uppercase">
                          {question.questionType}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              question.difficultyLevel === "easy"
                                ? "secondary"
                                : question.difficultyLevel === "hard"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {question.difficultyLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{question.marks} marks</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-muted-foreground text-sm">
                            - {question.negativeMarks}
                          </div>
                        </TableCell> 
                        <TableCell>
                          <Badge
                            className={
                              question.isActive
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {question.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(question.createdAt)}
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
                              <DropdownMenuItem
                                onClick={() => setSelectedQuestion(question)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push("/admin/questions")}
                              >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit in Question Bank
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-rose-600 focus:text-rose-600"
                                onClick={() => setDeleteTarget(question)}
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
          </div>
        </CardContent>
      </Card>

      <BulkUploadWizard
        categoryId={category._id}
        subcategoryId={subcategory._id}
        open={uploadWizardOpen}
        onOpenChange={setUploadWizardOpen}
        onSuccess={loadData}
      />

      <Dialog
        open={Boolean(selectedQuestion)}
        onOpenChange={(open) => !open && setSelectedQuestion(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question details</DialogTitle>
            <DialogDescription>
              Review the full prompt and answer metadata for this question.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-lg font-medium">
              {selectedQuestion?.questionText}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {getName(selectedQuestion?.categoryId)}
              </Badge>
              <Badge variant="outline">
                {getName(selectedQuestion?.subcategoryId)}
              </Badge>
              <Badge>{selectedQuestion?.difficultyLevel}</Badge>
              <Badge variant="secondary">
                {selectedQuestion?.questionType}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Marks</div>
                <div className="font-medium">{selectedQuestion?.marks}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">
                  Negative Marks
                </div>
                <div className="font-medium">
                  {selectedQuestion?.negativeMarks}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">
                Correct Answer
              </div>
              <div className="font-medium">
                {selectedQuestion?.correctAnswer || "Not available"}
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-sm font-medium">Explanation</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {selectedQuestion?.explanation || "No explanation added."}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Created at {formatDate(selectedQuestion?.createdAt)}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete question?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate <b>{deleteTarget?.questionText}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
