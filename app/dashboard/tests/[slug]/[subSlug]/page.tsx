"use client"

import { use, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    void loadQuestions()
  }, [slug, subSlug])

  const test = useMemo(
    () => ({
      title: subcategory?.name
        ? `${subcategory.name} Practice Session`
        : "Subcategory Practice Session",
      description:
        subcategory?.description ||
        `Questions from ${subcategory?.name || "this subcategory"}`,
      totalQuestions: questions.length,
      totalMarks: questions.reduce(
        (sum, question) => sum + (question.marks || 1),
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
    if (!testStartedAt || !category || !subcategory) return

    setSubmitLoading(true)

    try {
      const body = {
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
      router.push(
        resultId
          ? `/dashboard/tests/${slug}/${subSlug}/results?resultId=${resultId}`
          : `/dashboard/tests/${slug}/${subSlug}/results`
      )
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block animate-spin">Loading...</div>
      </div>
    )
  }
  if (!category) {
    return <div className="p-10">Test category or subcategory not found.</div>
  }

  return (
    <div className="min-h-screen p-6 mt-12 sm:mt-2">
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Practice Session</p>
            <h1 className="text-3xl font-semibold">{test.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question 1 of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase">Timer</p>
            <p className="text-xl font-semibold">
              {Math.max(test.durationMinutes, 8)}:00
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{questions.length} questions</span>
          <span>{subcategory.name}</span>
          <span>{category.name}</span>
        </div>
      </div>

      <TestRunner
        test={test}
        questions={questions as unknown as any}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default SubcategoryTestPage
