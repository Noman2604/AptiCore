"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react"
import TestRunner from "@/components/tests/TestRunner"
import { resolveCategorySlug, isValidCategorySlug } from "@/lib/category-utils"

const CELEBRATION_EVENT = "apticore:celebrate"

interface Question {
  _id: string
  questionText: string
  difficultyLevel: string
  questionType: string
  marks: number
  timeLimitSeconds: number
  options?: { text: string; order: number }[]
  subcategoryId?: { _id: string; name: string; slug: string }
}

function RunnerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawCategory = searchParams.get("category")
  const rawSubcategory =
    searchParams.get("subcategory") || searchParams.get("subSlug")

  const categorySlug = resolveCategorySlug(rawCategory)
  const subcategorySlug = rawSubcategory ? rawSubcategory.trim().toLowerCase() : ""

  const [category, setCategory] = useState<any>(null)
  const [subcategory, setSubcategory] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [testStartedAt, setTestStartedAt] = useState<Date | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<
    "in-progress" | "completed" | "abandoned"
  >("in-progress")
  const [currentAttemptId] = useState<string>(
    () => `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  )
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<any>(null)

  useEffect(() => {
    async function loadQuestions() {
      if (!categorySlug) {
        setErrorMsg("No category specified. Please select a practice test category.")
        setLoading(false)
        return
      }

      if (!isValidCategorySlug(categorySlug)) {
        setErrorMsg(`"${rawCategory}" is not a recognized category.`)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setErrorMsg(null)

        const questionsUrl = subcategorySlug
          ? `/api/questions?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(subcategorySlug)}&limit=1000&random=true`
          : `/api/questions?category=${encodeURIComponent(categorySlug)}&limit=1000&random=true`

        const [categoryRes, questionRes] = await Promise.all([
          axios.get(`/api/categories/${encodeURIComponent(categorySlug)}`),
          axios.get(questionsUrl),
        ])

        const catData = categoryRes.data?.data
        setCategory(catData)

        let matchingSub: any = null
        if (subcategorySlug && catData?.subcategories?.length) {
          matchingSub = catData.subcategories.find(
            (sub: any) =>
              sub.slug?.toLowerCase() === subcategorySlug.toLowerCase() ||
              sub.name?.toLowerCase().replace(/\s+/g, "-") === subcategorySlug.toLowerCase()
          )
        }
        setSubcategory(matchingSub)

        const fetchedQuestions = questionRes.data?.data || []
        setQuestions(fetchedQuestions)

        if (fetchedQuestions.length === 0) {
          setErrorMsg("No active questions found for this topic yet. Please try another test.")
        } else {
          setTestStartedAt(new Date())
          setTestStatus("in-progress")
        }
      } catch (err: any) {
        console.error("Failed to load test questions:", err)
        setErrorMsg(
          err?.response?.data?.error ||
            "Unable to load questions for this test. Please try again."
        )
      } finally {
        setLoading(false)
      }
    }

    void loadQuestions()
  }, [categorySlug, subcategorySlug, rawCategory])

  // Auto-save test progress periodically
  useEffect(() => {
    if (
      !testStartedAt ||
      !category ||
      testStatus !== "in-progress" ||
      !hasUnsavedProgress ||
      !currentProgress
    ) {
      return
    }

    const autoSaveTimer = setInterval(async () => {
      try {
        await fetch("/api/results/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId: currentAttemptId,
            categoryId: category._id,
            subcategoryId: subcategory?._id || null,
            testStatus: "in-progress",
            progress: currentProgress,
            startedAt: testStartedAt,
          }),
        })
      } catch (error) {
        console.error("Auto-save failed:", error)
      }
    }, 30000)

    return () => clearInterval(autoSaveTimer)
  }, [
    testStartedAt,
    category,
    subcategory,
    testStatus,
    currentAttemptId,
    hasUnsavedProgress,
    currentProgress,
  ])

  // Warn user before leaving mid-test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testStatus === "in-progress" && hasUnsavedProgress) {
        e.preventDefault()
        e.returnValue =
          "You have an in-progress test. Are you sure you want to leave?"
        return "You have an in-progress test. Are you sure you want to leave?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [testStatus, hasUnsavedProgress])

  // Mark test as abandoned when component unmounts mid-test
  useEffect(() => {
    return () => {
      if (
        testStatus === "in-progress" &&
        testStartedAt &&
        category &&
        Boolean(currentProgress?.attemptedQuestions && currentProgress.attemptedQuestions > 0)
      ) {
        fetch("/api/results/mark-abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId: currentAttemptId,
            categoryId: category._id,
            subcategoryId: subcategory?._id || null,
            testStatus: "abandoned",
            startedAt: testStartedAt,
            attemptedQuestions: currentProgress?.attemptedQuestions || 0,
          }),
        }).catch((error) =>
          console.error("Failed to mark test as abandoned:", error)
        )
      }
    }
  }, [testStatus, testStartedAt, category, subcategory, currentProgress, currentAttemptId])

  const test = useMemo(
    () => ({
      title: subcategory?.name
        ? `${subcategory.name} — Mock Test`
        : category?.name
        ? `${category.name} — Practice Session`
        : "Practice Test Session",
      description:
        subcategory?.description ||
        category?.description ||
        "Practice test session with real-time timer and negative marking simulation.",
      totalQuestions: questions.length,
      totalMarks: questions.reduce(
        (sum, question) => sum + (question.marks || 4),
        0
      ),
      durationMinutes: Math.ceil((questions.length || 10) * 1.5) || 10,
    }),
    [category, subcategory, questions]
  )

  const handleSubmit = async (payload: {
    answers: any[]
    attemptedQuestions: number
    skippedQuestions: number
    correctAnswers: number
    accuracy: number
    totalQuestions: number
    totalMarks: number
    timeSpentSeconds: number
    marksObtained: number
  }) => {
    if (!testStartedAt || !category || submitLoading) return

    setSubmitLoading(true)
    setTestStatus("completed")

    try {
      const body = {
        attemptId: currentAttemptId,
        testId: null,
        categoryId: category._id,
        subcategoryId: subcategory?._id || null,
        testName: test.title,
        totalQuestions: payload.totalQuestions,
        attemptedQuestions: payload.attemptedQuestions,
        correctAnswers: payload.correctAnswers,
        accuracy: payload.accuracy,
        skippedQuestions: payload.skippedQuestions,
        marksObtained: payload.marksObtained,
        totalMarks: payload.totalMarks,
        durationMinutes: test.durationMinutes,
        timeSpentSeconds: payload.timeSpentSeconds,
        answers: payload.answers,
        startedAt: testStartedAt,
        sessionType: subcategory ? "subcategory" : "category",
        testStatus: "completed",
      }

      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit test")
      }

      const resultId = json?.data?._id
      const isPerfect = payload.accuracy === 100
      const nextLevel = (json?.meta?.nextLevel ?? 0) as number | undefined
      const unlockedAchievements = Array.isArray(json?.meta?.unlockedAchievements)
        ? json.meta.unlockedAchievements
        : []

      if (isPerfect || nextLevel || unlockedAchievements.length) {
        window.dispatchEvent(
          new CustomEvent(CELEBRATION_EVENT, {
            detail: {
              perfectScore: isPerfect,
              levelUp: Boolean(nextLevel),
              newLevel: nextLevel,
              unlockedAchievements,
            },
          })
        )
      }

      setHasUnsavedProgress(false)
      toast.success("Test submitted successfully!")
      router.push(resultId ? `/results?resultId=${resultId}` : `/results`)
    } catch (error) {
      console.error(error)
      setTestStatus("in-progress")
      toast.error(
        error instanceof Error ? error.message : "Failed to submit test. Please try again."
      )
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleProgressChange = useCallback((progress: any) => {
    setCurrentProgress(progress)
    setHasUnsavedProgress(
      Boolean(progress?.attemptedQuestions && progress.attemptedQuestions > 0)
    )
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background font-[Inter,sans-serif] text-foreground">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
          <span>Loading practice test engine...</span>
        </div>
      </div>
    )
  }

  if (errorMsg || !category || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background font-[Inter,sans-serif] p-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold font-[Space_Grotesk,sans-serif] text-foreground">
            Unable to Start Test
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {errorMsg || "We could not find active questions for this practice test."}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {categorySlug && (
              <Link
                href={`/dashboard/tests?category=${categorySlug}`}
                className="w-full sm:w-auto rounded-xl border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition"
              >
                View Category Topics
              </Link>
            )}
            <Link
              href="/dashboard/tests"
              className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:brightness-105 transition"
            >
              Browse All Tests
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TestRunner
      test={test}
      questions={questions as unknown as any}
      sectionLabel={subcategory?.name || category?.name}
      onProgressChange={handleProgressChange}
      onSubmit={handleSubmit}
    />
  )
}

export default function TestRunnerPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background font-[Inter,sans-serif] text-foreground">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
            <span>Loading test runner...</span>
          </div>
        </div>
      }
    >
      <RunnerContent />
    </Suspense>
  )
}
