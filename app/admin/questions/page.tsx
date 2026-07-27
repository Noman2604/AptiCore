"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileQuestion,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

type Category = {
  _id: string
  name: string
  slug: string
  subcategories?: Subcategory[]
}

type Subcategory = {
  _id: string
  categoryId: string
  name: string
  slug: string
}

type QuestionOption = {
  text: string
  order: number
  isCorrect: boolean
}

type Question = {
  _id: string
  categoryId: Category | string
  subcategoryId?: Subcategory | string
  questionText: string
  questionType:
    | "mcq"
    | "msq"
    | "true_false"
    | "fill_blank"
    | "numerical"
    | "coding"
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

type QuestionForm = {
  categoryId: string
  subcategoryId: string
  questionText: string
  questionType: Question["questionType"]
  difficultyLevel: Question["difficultyLevel"]
  options: string[]
  correctOption: string
  explanation: string
  marks: string
  negativeMarks: string
  timeLimitSeconds: string
}

const blankForm: QuestionForm = {
  categoryId: "",
  subcategoryId: "",
  questionText: "",
  questionType: "mcq",
  difficultyLevel: "medium",
  options: ["", "", "", ""],
  correctOption: "0",
  explanation: "",
  marks: "1",
  negativeMarks: "0.25",
  timeLimitSeconds: "15",
}

const difficultyOptions = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

const questionTypes = [
  { value: "mcq", label: "MCQ" },
  { value: "msq", label: "MSQ" },
  { value: "true_false", label: "True / False" },
  { value: "fill_blank", label: "Fill Blank" },
  { value: "numerical", label: "Numerical" },
  { value: "coding", label: "Coding" },
] as const

const getId = (value?: Category | Subcategory | string) => {
  if (!value) return ""
  return typeof value === "string" ? value : value._id
}

const getName = (value?: Category | Subcategory | string) => {
  if (!value) return "Unassigned"
  return typeof value === "string" ? value : value.name
}

const formatDate = (value?: string) => {
  if (!value) return "Not available"
  return new Date(value).toLocaleDateString()
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  )
  const [form, setForm] = useState<QuestionForm>(blankForm)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const questionsPerPage = 10

  const selectedCategory = categories.find(
    (category) => category._id === form.categoryId
  )
  const availableSubcategories = selectedCategory?.subcategories ?? []
  const selectedSubcategory = availableSubcategories.find(
    (subcategory) => subcategory._id === form.subcategoryId
  )

  const loadData = async () => {
    try {
      setLoading(true)

      const [questionsRes, categoriesRes] = await Promise.all([
        fetch("/api/questions?limit=200&includeInactive=true"),
        fetch("/api/categories"),
      ])

      const questionsJson = await questionsRes.json()
      const categoriesJson = await categoriesRes.json()

      if (!questionsJson.success)
        throw new Error(questionsJson.error || "Failed to fetch questions")
      if (!categoriesJson.success)
        throw new Error(categoriesJson.error || "Failed to fetch categories")

      setQuestions(questionsJson.data ?? [])
      setCategories(categoriesJson.data ?? [])
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load admin question data"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData)
  }, [])

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return questions.filter((question) => {
      const categoryId = getId(question.categoryId)
      const subcategoryName = getName(question.subcategoryId)
      const matchesSearch =
        !normalizedSearch ||
        question.questionText.toLowerCase().includes(normalizedSearch) ||
        getName(question.categoryId).toLowerCase().includes(normalizedSearch) ||
        subcategoryName.toLowerCase().includes(normalizedSearch)
      const matchesCategory =
        categoryFilter === "all" || categoryId === categoryFilter
      const matchesDifficulty =
        difficultyFilter === "all" ||
        question.difficultyLevel === difficultyFilter

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [categoryFilter, difficultyFilter, questions, searchQuery])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / questionsPerPage)
  )
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, difficultyFilter, searchQuery])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const activeCount = questions.filter((question) => question.isActive).length
  const inactiveCount = questions.length - activeCount
  const reportedCount = 0

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-emerald-600 text-white">Easy</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "hard":
        return <Badge variant="destructive">Hard</Badge>
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  const makeFormFromQuestion = (question: Question): QuestionForm => {
    const options = question.options?.length
      ? question.options
          .sort((a, b) => a.order - b.order)
          .map((option) => option.text)
      : ["", "", "", ""]
    const correctIndex =
      question.options?.find((option) => option.isCorrect)?.order ?? 0

    return {
      categoryId: getId(question.categoryId),
      subcategoryId: getId(question.subcategoryId),
      questionText: question.questionText,
      questionType: question.questionType,
      difficultyLevel: question.difficultyLevel,
      options: [...options, "", "", "", ""].slice(0, 4),
      correctOption: String(correctIndex),
      explanation: question.explanation ?? "",
      marks: String(question.marks ?? 1),
      negativeMarks: String(question.negativeMarks ?? 0.25),
      timeLimitSeconds: String(question.timeLimitSeconds ?? 60),
    }
  }

  const openCreateSheet = () => {
    const firstCategory = categories[0]
    setSelectedQuestion(null)
    setForm({
      ...blankForm,
      categoryId: firstCategory?._id ?? "",
      subcategoryId: firstCategory?.subcategories?.[0]?._id ?? "",
    })
    setShowAddSheet(true)
  }

  const handleView = (question: Question) => {
    setSelectedQuestion(question)
  }

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question)
    setForm(makeFormFromQuestion(question))
    setShowAddSheet(true)
  }

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question)
    setShowDeleteDialog(true)
  }

  const handleCategoryChange = (categoryId: string) => {
    const nextCategory = categories.find(
      (category) => category._id === categoryId
    )

    setForm((current) => ({
      ...current,
      categoryId,
      subcategoryId: nextCategory?.subcategories?.[0]?._id ?? "",
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? value : option
      ),
    }))
  }

  const buildPayload = () => {
    const optionIndex = Number(form.correctOption)
    const options = form.options.map((option, index) => ({
      text: option.trim(),
      order: index,
      isCorrect: index === optionIndex,
    }))

    return {
      categoryId: form.categoryId,
      subcategoryId: form.subcategoryId || undefined,
      questionText: form.questionText.trim(),
      questionType: form.questionType,
      options,
      correctAnswer: options[optionIndex]?.text || form.correctOption,
      explanation: form.explanation.trim(),
      difficultyLevel: form.difficultyLevel,
      marks: Number(form.marks),
      negativeMarks: Number(form.negativeMarks),
      timeLimitSeconds: Number(form.timeLimitSeconds),
    }
  }

  const saveQuestion = async () => {
    try {
      if (!form.categoryId) {
        toast.error("Select a category first")
        return
      }

      if (!form.questionText.trim()) {
        toast.error("Question text is required")
        return
      }

      if (form.options.some((option) => !option.trim())) {
        toast.error("Fill all four answer options")
        return
      }

      setSaving(true)

      const payload = buildPayload()
      const response = await fetch(
        selectedQuestion
          ? `/api/questions/${selectedQuestion._id}`
          : "/api/questions",
        {
          method: selectedQuestion ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      const json = await response.json()

      if (!json.success) throw new Error(json.error || "Question save failed")

      toast.success(selectedQuestion ? "Question updated" : "Question created")
      setShowAddSheet(false)
      setSelectedQuestion(null)
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save question"
      )
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedQuestion) return

    try {
      setSaving(true)

      const response = await fetch(`/api/questions/${selectedQuestion._id}`, {
        method: "DELETE",
      })
      const json = await response.json()

      if (!json.success) throw new Error(json.error || "Question delete failed")

      toast.success("Question deleted")
      setShowDeleteDialog(false)
      setSelectedQuestion(null)
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete question"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDuplicate = (question: Question) => {
    setSelectedQuestion(null)
    setForm({
      ...makeFormFromQuestion(question),
      questionText: `${question.questionText} (copy)`,
    })
    setShowAddSheet(true)
  }

  const handleToggleActive = async (question: Question) => {
    try {
      const response = await fetch(`/api/questions/${question._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !question.isActive }),
      })
      const json = await response.json()

      if (!json.success) throw new Error(json.error || "Status update failed")

      toast.success(
        `Question is now ${question.isActive ? "inactive" : "active"}`
      )
      setSelectedQuestion(null)
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      )
    }
  }

  return (
    <div className="mt-12 sm:mt-2 p-4 space-y-6 ">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Question Bank</h1>
          <p className="text-muted-foreground">
            Manage questions with automatic category and subcategory IDs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" disabled>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={openCreateSheet}>
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{questions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Inactive</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{inactiveCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Reported</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{reportedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Categories</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions, categories, subcategories..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">ID</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Difficulty
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Marks</TableHead>
                  <TableHead className="hidden xl:table-cell">Time</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center">
                      Loading questions...
                    </TableCell>
                  </TableRow>
                ) : filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedQuestions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{question._id.slice(-5)}
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-2 font-medium">
                          {question.questionText}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1 max-w-56 truncate text-xs"
                        >
                          {getName(question.subcategoryId)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {getName(question.categoryId)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getDifficultyBadge(question.difficultyLevel)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {question.isActive ? (
                          <Badge className="bg-emerald-600 text-white">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {question.marks}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {question.timeLimitSeconds}s
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(question)}
                            aria-label="View question"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(question)}
                            aria-label="Edit question"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(question)}
                            aria-label="Delete question"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {filteredQuestions.length === 0
            ? 0
            : (currentPage - 1) * questionsPerPage + 1}
          -{Math.min(currentPage * questionsPerPage, filteredQuestions.length)}{" "}
          of {filteredQuestions.length} questions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-16 text-center text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {selectedQuestion ? "Edit Question" : "Add New Question"}
            </SheetTitle>
            <SheetDescription>
              Pick category names here. Their database IDs are filled
              automatically.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  placeholder="Enter the question text..."
                  className="mt-1.5"
                  rows={3}
                  value={form.questionText}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      questionText: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={form.subcategoryId || "none"}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        subcategoryId: value === "none" ? "" : value,
                      }))
                    }
                    disabled={!form.categoryId}
                  >
                    <SelectTrigger id="subcategory" className="mt-1.5">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No subcategory</SelectItem>
                      {availableSubcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory._id}
                          value={subcategory._id}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="question-type">Type</Label>
                  <Select
                    value={form.questionType}
                    onValueChange={(value: Question["questionType"]) =>
                      setForm((current) => ({
                        ...current,
                        questionType: value,
                      }))
                    }
                  >
                    <SelectTrigger id="question-type" className="mt-1.5">
                      <SelectValue placeholder="Question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={form.difficultyLevel}
                    onValueChange={(value: Question["difficultyLevel"]) =>
                      setForm((current) => ({
                        ...current,
                        difficultyLevel: value,
                      }))
                    }
                  >
                    <SelectTrigger id="difficulty" className="mt-1.5">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="correct-answer">Correct</Label>
                  <Select
                    value={form.correctOption}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        correctOption: value,
                      }))
                    }
                  >
                    <SelectTrigger id="correct-answer" className="mt-1.5">
                      <SelectValue placeholder="Correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Option A</SelectItem>
                      <SelectItem value="1">Option B</SelectItem>
                      <SelectItem value="2">Option C</SelectItem>
                      <SelectItem value="3">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {form.options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(index, event.target.value)
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  placeholder="Explain the solution..."
                  className="mt-1.5"
                  rows={3}
                  value={form.explanation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      explanation: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="marks">Marks</Label>
                  <Input
                    id="marks"
                    className="mt-1.5"
                    type="number"
                    step="1"
                    min="1"
                    value={form.marks}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        marks: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="negative-marks">Negative Marks</Label>
                  <Input
                    id="negative-marks"
                    className="mt-1.5"
                    type="number"
                    step="1"
                    min="0"
                    value={form.negativeMarks}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        negativeMarks: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="time-limit">Time Limit</Label>
                  <Input
                    id="time-limit"
                    className="mt-1.5"
                    type="number"
                    min="15"
                    value={form.timeLimitSeconds}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        timeLimitSeconds: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddSheet(false)}>
                Cancel
              </Button>
              <Button onClick={saveQuestion} disabled={saving}>
                {saving
                  ? "Saving..."
                  : selectedQuestion
                    ? "Update Question"
                    : "Create Question"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={selectedQuestion !== null && !showAddSheet && !showDeleteDialog}
        onOpenChange={(open) => !open && setSelectedQuestion(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Question #{selectedQuestion?._id.slice(-6)}
            </DialogTitle>
            <div>
              <span className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {getName(selectedQuestion?.categoryId)}
                </Badge>
                <Badge variant="outline">
                  {getName(selectedQuestion?.subcategoryId)}
                </Badge>
                {getDifficultyBadge(
                  selectedQuestion?.difficultyLevel || "medium"
                )}
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-lg font-medium">
              {selectedQuestion?.questionText}
            </p>

            <div className="space-y-2">
              {selectedQuestion?.options
                ?.sort((a, b) => a.order - b.order)
                .map((option, index) => (
                  <div
                    key={`${option.order}-${option.text}`}
                    className={`rounded-lg border p-3 ${
                      option.isCorrect
                        ? "border-emerald-600 bg-emerald-600/10"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        {String.fromCharCode(65 + index)}. {option.text}
                      </span>
                      {option.isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                  </div>
                ))}
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-sm font-medium">Explanation:</p>
              <p className="text-sm text-muted-foreground">
                {selectedQuestion?.explanation || "No explanation added."}
              </p>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">
                  {formatDate(selectedQuestion?.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <span className="ml-2 font-medium">
                  {selectedQuestion?.timeLimitSeconds}s
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() =>
                selectedQuestion && handleDuplicate(selectedQuestion)
              }
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() =>
                selectedQuestion && handleToggleActive(selectedQuestion)
              }
            >
              {selectedQuestion?.isActive ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => selectedQuestion && handleEdit(selectedQuestion)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <div>
              Are you sure you want to delete question{" "}
              <span className="font-medium">
                #{selectedQuestion?._id.slice(-6)}
              </span>
              ? This will mark it inactive.
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
