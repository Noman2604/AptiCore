"use client"

import { use, useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const CELEBRATION_EVENT = "apticore:celebrate"
import TestRunner from "@/components/tests/TestRunner"

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

const SubcategoryTestPage = ({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>
}) => {
  const { slug, subSlug } = use(params)
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
  const [subcategory, setSubcategory] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [testStartedAt, setTestStartedAt] = useState<Date | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<
    "in-progress" | "completed" | "abandoned"
  >("in-progress")
  const [currentAttemptId, setCurrentAttemptId] = useState<string>(
    () => `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  )
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<any>(null)

  useEffect(() => {
    async function loadQuestions() {
      try {
        const [categoryRes, questionRes] = await Promise.all([
          axios.get(`/api/categories/${slug}`),
          axios.get(
            `/api/questions?category=${slug}&subcategory=${subSlug}&limit=1000&random=true`
          ),
        ])

        setCategory(categoryRes.data.data)
        setSubcategory(
          categoryRes.data.data.subcategories?.find(
            (sub: any) => sub.slug === subSlug
          ) || null
        )
        setQuestions(questionRes.data.data || [])
        setTestStartedAt(new Date())
        setTestStatus("in-progress")
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    void loadQuestions()
  }, [slug, subSlug])

  // Auto-save test progress periodically
  useEffect(() => {
    if (
      !testStartedAt ||
      !category ||
      !subcategory ||
      testStatus !== "in-progress" ||
      !hasUnsavedProgress ||
      !currentProgress
    ) {
      return
    }

    const autoSaveTimer = setInterval(async () => {
      try {
        console.log("Auto-saving test progress...", currentAttemptId)
        await fetch("/api/results/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId: currentAttemptId,
            categoryId: category._id,
            subcategoryId: subcategory._id,
            testStatus: "in-progress",
            progress: currentProgress,
            startedAt: testStartedAt,
          }),
        })
      } catch (error) {
        console.error("Auto-save failed:", error)
      }
    }, 30000) // Auto-save every 30 seconds

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

  // Mark test as abandoned when component unmounts
  useEffect(() => {
    return () => {
      if (
        testStatus === "in-progress" &&
        testStartedAt &&
        category &&
        subcategory &&
        Boolean(currentProgress?.attemptedQuestions && currentProgress.attemptedQuestions > 0)
      ) {
        // Mark test as abandoned
        fetch("/api/results/mark-abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId: currentAttemptId,
            categoryId: category._id,
            subcategoryId: subcategory._id,
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
        : "Subcategory Practice Session",
      description:
        subcategory?.description ||
        `Questions from ${subcategory?.name || "this subcategory"}`,
      totalQuestions: questions.length,
      totalMarks: questions.reduce(
        (sum, question) => sum + (question.marks || 4),
        0
      ),
      durationMinutes: Math.ceil((questions.length || 10) * 1.5) || 10,
    }),
    [subcategory, questions]
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
    if (!testStartedAt || !category || !subcategory || submitLoading) return

    setSubmitLoading(true)
    setTestStatus("completed")

    try {
      const body = {
        attemptId: currentAttemptId,
        testId: null,
        categoryId: category._id,
        subcategoryId: subcategory._id,
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
        sessionType: "subcategory",
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
      const unlockedAchievements = Array.isArray(
        json?.meta?.unlockedAchievements
      )
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
      router.push(resultId ? `/results?resultId=${resultId}` : `/results`)
    } catch (error) {
      console.error(error)
      setTestStatus("in-progress")
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background font-[Inter,sans-serif] text-slate-900 dark:text-[#e7ecf3]">
        <div className="inline-block animate-pulse font-[JetBrains_Mono,monospace] text-sm">
          Loading test...
        </div>
      </div>
    )
  }

  if (!category || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background font-[Inter,sans-serif] text-slate-900 dark:text-[#e7ecf3]">
        Test category or questions not found.
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

export default SubcategoryTestPage
