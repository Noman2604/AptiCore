"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ResultAnswer {
  questionId?: {
    _id: string
    questionText?: string
    correctAnswer?: string
    explanation?: string
    options?: { text: string; order: number }[]
  }
  userAnswer: string
  isCorrect: boolean
  isBookmarked?: boolean
  markedForReview?: boolean
  timeSpentSeconds?: number
}

interface ResultData {
  _id: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers: number
  skippedQuestions: number
  accuracy: number
  marksObtained: number
  totalMarks: number
  timeSpentSeconds: number
  answers: ResultAnswer[]
  submittedAt?: string
  testId?: {
    title?: string
    totalQuestions?: number
    totalMarks?: number
    durationMinutes?: number
    categoryId?: { slug?: string; name?: string }
  }
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export default function SubcategoryResultsPage() {
  const params = useParams<{ slug: string; subSlug: string }>()
  const searchParams = useSearchParams()
  const resultId = searchParams.get("resultId")

  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = resultId
          ? `/api/results/${resultId}`
          : "/api/results?limit=1"

        const response = await fetch(url, { credentials: "include" })
        const json = await response.json()

        if (!response.ok || !json.success) {
          throw new Error(json.error || "Unable to load your result")
        }

        const data = resultId ? json.data : json.data?.[0] || null
        setResult(data)
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Unable to load your result"
        )
      } finally {
        setLoading(false)
      }
    }

    void loadResult()
  }, [resultId])

  const reviewItems = useMemo(() => {
    if (!result?.answers?.length) return []

    return result.answers.map((answer, index) => {
      const isSkipped = !answer.userAnswer || answer.userAnswer.trim().length === 0
      return {
        ...answer,
        label: `Q${index + 1}`,
        questionText: answer.questionId?.questionText || "Question",
        correctAnswer: answer.questionId?.correctAnswer || "",
        explanation: answer.questionId?.explanation || "",
        isSkipped,
      }
    })
  }, [result])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Loading your result...
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background p-6 mt-12 sm:mt-2">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Result not available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>{error || "No result was found yet."}</p>
              <Button asChild>
                <Link href={`/dashboard/tests/${params?.slug || ""}`}>
                  Back to Subtopics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 mt-12 sm:mt-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Practice results</p>
            <h1 className="text-3xl font-semibold">
              {result.testId?.title || "Practice Session"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Submitted on{" "}
              {result.submittedAt
                ? new Date(result.submittedAt).toLocaleString()
                : "recently"}
            </p>
          </div>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href={`/dashboard/tests/${params?.slug || ""}`}>
              Back to Subtopics
            </Link>
          </Button>
        </div>

        <Card className="border">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score summary</p>
                <CardTitle className="text-2xl">
                  {result.accuracy}% accuracy
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {result.correctAnswers}/{result.totalQuestions} correct
                </Badge>
                <Badge variant="outline">{result.skippedQuestions} skipped</Badge>
                <Badge>{result.accuracy}% accuracy</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Accuracy
                </p>
                <p className="mt-2 text-2xl font-semibold">{result.accuracy}%</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Correct
                </p>
                <p className="mt-2 text-2xl font-semibold">{result.correctAnswers}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Skipped
                </p>
                <p className="mt-2 text-2xl font-semibold">{result.skippedQuestions}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Marks
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {result.marksObtained}/{result.totalMarks}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Attempted: {result.attemptedQuestions}</span>
              <span>Total questions: {result.totalQuestions}</span>
              <span>
                Time spent: {formatDuration(result.timeSpentSeconds || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Answer review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewItems.map((item, index) => {
              const statusLabel = item.isSkipped
                ? "Skipped"
                : item.isCorrect
                  ? "Correct"
                  : "Wrong"

              return (
                <div
                  key={`${item.questionId?._id || index}`}
                  className="rounded-2xl border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.label}</Badge>
                      <Badge
                        variant={
                          item.isSkipped
                            ? "secondary"
                            : item.isCorrect
                              ? "default"
                              : "destructive"
                        }
                      >
                        {statusLabel}
                      </Badge>
                      {item.isBookmarked ? (
                        <Badge variant="secondary">Bookmarked</Badge>
                      ) : null}
                      {item.markedForReview ? (
                        <Badge variant="secondary">Review</Badge>
                      ) : null}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.timeSpentSeconds ? `${item.timeSpentSeconds}s` : ""}
                    </span>
                  </div>

                  <p className="mt-3 font-medium">{item.questionText}</p>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold">Your answer</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.isSkipped
                          ? "Skipped"
                          : item.userAnswer || "No answer"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Correct answer</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.correctAnswer || "Not available"}
                      </p>
                    </div>
                  </div>

                  {item.explanation ? (
                    <div className="mt-3 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Explanation</p>
                      <p className="mt-1">{item.explanation}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

