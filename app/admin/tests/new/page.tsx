"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminCreateTestPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("all")
  const [difficulty, setDifficulty] = useState("medium")
  const [duration, setDuration] = useState<number | "">(30)
  const [totalQuestions, setTotalQuestions] = useState<number | "">(10)
  const [totalMarks, setTotalMarks] = useState<number | "">(100)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

  const difficultyDefaults: Record<
    string,
    { totalQuestions: number; totalMarks: number; duration: number }
  > = {
    easy: { totalQuestions: 0, totalMarks: 0, duration: 0 },
    medium: { totalQuestions: 0, totalMarks: 0, duration: 0 },
    hard: { totalQuestions: 0, totalMarks: 0, duration: 0 },
  }

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value)

    const defaults = difficultyDefaults[value]
    if (defaults) {
      setTotalQuestions(defaults.totalQuestions)
      setTotalMarks(defaults.totalMarks)
      setDuration(defaults.duration)
    }
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    setSubcategoryId("all") // Reset subcategory when category changes
  }

  const [categories, setCategories] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories")
        const json = await res.json()
        if (res.ok && json.success) setCategories(json.data || [])
      } catch (err) {
        console.error(err)
      }
    }

    async function loadQuestions() {
      try {
        const res = await fetch("/api/questions?limit=1000")
        const json = await res.json()
        if (res.ok && json.success) setQuestions(json.data || [])
      } catch (err) {
        console.error(err)
      }
    }

    void loadCategories()
    void loadQuestions()
  }, [])

  const availableSubcategories = useMemo(() => {
    return categories.find((c) => c._id === categoryId)?.subcategories || []
  }, [categories, categoryId])

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    const selected = questions.filter((q: any) =>
      selectedQuestionIds.includes(q._id)
    )
    const questionCount = selected.length
    const markSum = selected.reduce(
      (sum, q: any) => sum + Number(q.marks || 0),
      0
    )
    const totalSeconds = selected.reduce(
      (sum, q: any) => sum + Number(q.timeLimitSeconds || 0),
      0
    )
    const durationMinutes = totalSeconds ? Math.ceil(totalSeconds / 60) : ""

    setTotalQuestions(questionCount > 0 ? questionCount : "")
    setTotalMarks(markSum > 0 ? markSum : "")
    setDuration(durationMinutes || "")
  }, [questions, selectedQuestionIds])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return toast.error("Title is required")
    if (!categoryId) return toast.error("Category is required")
    if (!totalQuestions || !totalMarks || !duration)
      return toast.error("Fill numeric fields")

    setLoading(true)
    try {
      const questionPayload = selectedQuestionIds.map((id, index) => {
        const question = questions.find((q: any) => q._id === id)
        return {
          questionId: id,
          sectionNumber: 1,
          questionOrder: index + 1,
          marks: Number(question?.marks || 1),
        }
      })

      const body = {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        subcategoryId,
        questionIds: questionPayload,
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        durationMinutes: Number(duration),
        difficultyLevel: difficulty,
      }

      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const json = await res.json()
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to create test")

      toast.success("Test created successfully")
      router.push("/admin/tests")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create test")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 mt-10 sm:mt-2 lg:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create New Test</h1>
        <p className="text-sm text-muted-foreground">
          Add a new test and assign questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 md:col-span-1">
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <Input
                value={title}
                required={true}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <Textarea
                value={description}
                required={true}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <Select
                value={categoryId}
                required={true}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {categoryId && availableSubcategories.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Subcategory (Optional)
                </label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {availableSubcategories.map((s: any) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Questions
                </label>
                <Input
                  type="number"
                  value={String(totalQuestions)}
                  onChange={(e) =>
                    setTotalQuestions(Number(e.target.value) || "")
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Marks</label>
                <Input
                  type="number"
                  value={String(totalMarks)}
                  onChange={(e) => setTotalMarks(Number(e.target.value) || "")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Duration (min)
                </label>
                <Input
                  type="number"
                  value={String(duration)}
                  onChange={(e) => setDuration(Number(e.target.value) || "")}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create Test"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 md:col-span-1">
          <CardContent>
            <h3 className="mb-3 text-lg font-medium">Select Questions</h3>
            <div className="max-h-105 space-y-2 overflow-y-auto">
              {questions
                .filter((q: any) => {
                  // filter by category if selected
                  if (categoryId) {
                    if (q.categoryId && q.categoryId._id) {
                      if (q.categoryId._id !== categoryId) return false
                    } else {
                      return false
                    }
                  }

                  // filter by subcategory if selected
                  if (subcategoryId && subcategoryId !== "all") {
                    if (q.subcategoryId && q.subcategoryId._id) {
                      if (q.subcategoryId._id !== subcategoryId) return false
                    } else {
                      return false
                    }
                  }

                  // filter by difficulty if selected (easy/medium/hard)
                  if (difficulty) {
                    const qDiff = (q.difficultyLevel || "")
                      .toString()
                      .toLowerCase()
                    if (qDiff && qDiff !== difficulty) return false
                  }

                  return true
                })
                .map((q: any) => (
                  <label
                    key={q._id}
                    className="flex cursor-pointer items-start gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.includes(q._id)}
                      onChange={() => handleToggleQuestion(q._id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">
                        {q.questionText?.slice(0, 120) || "Question"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {q.difficultyLevel || ""}
                      </div>
                    </div>
                  </label>
                ))}

              {questions.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No questions available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
