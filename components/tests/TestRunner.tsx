"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

type QuestionType =
  | "mcq"
  | "msq"
  | "true_false"
  | "fill_blank"
  | "numerical"
  | "coding"

interface QuestionOption {
  text: string
  order: number
}

export interface TestQuestion {
  _id: string
  questionText: string
  questionType: QuestionType
  difficultyLevel: "easy" | "medium" | "hard"
  marks: number
  timeLimitSeconds: number
  explanation?: string
  options?: QuestionOption[]
  correctAnswer?: string
}

interface TestRunnerProps {
  test: {
    title: string
    description?: string
    totalQuestions: number
    totalMarks: number
    durationMinutes: number
  }
  questions: TestQuestion[]
  onSubmit?: (payload: {
    answers: {
      questionId: string
      userAnswer: string
      isBookmarked: boolean
      markedForReview: boolean
      timeSpentSeconds: number
      isCorrect: boolean
    }[]
    attemptedQuestions: number
    skippedQuestions: number
    correctAnswers: number
    accuracy: number
    totalQuestions: number
    totalMarks: number
    timeSpentSeconds: number
    marksObtained: number
  }) => void
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = String(seconds % 60).padStart(2, "0")
  return `${minutes}:${remainingSeconds}`
}

export default function TestRunner({
  test,
  questions,
  onSubmit,
}: TestRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string | string[]>
  >({})
  const [remainingSeconds, setRemainingSeconds] = useState(
    test.durationMinutes * 60
  )
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(
    new Set()
  )
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [questionTimeSpent, setQuestionTimeSpent] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    if (submitted) return
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setSubmitted(true)
          window.clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [submitted])

  const currentQuestion = questions[currentIndex]

  const answeredCount = useMemo(() => {
    return questions.filter((question) => {
      const answer = selectedAnswers[question._id]
      if (answer === undefined) return false
      if (Array.isArray(answer)) return answer.length > 0
      return String(answer).trim().length > 0
    }).length
  }, [questions, selectedAnswers])

  const isAllAnswered =
    questions.length > 0 && answeredCount === questions.length
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100)
  const isSubmitDisabled = submitted || !isAllAnswered

  const handleOptionChange = (
    questionId: string,
    optionValue: string,
    multiple = false
  ) => {
    setSubmitError(null)
    setSelectedAnswers((current) => {
      const currentValue = current[questionId]
      if (!multiple) {
        return { ...current, [questionId]: optionValue }
      }

      const values = Array.isArray(currentValue) ? currentValue : []
      if (values.includes(optionValue)) {
        return {
          ...current,
          [questionId]: values.filter((value) => value !== optionValue),
        }
      }

      return { ...current, [questionId]: [...values, optionValue] }
    })
  }

  const toggleBookmark = (questionId: string) => {
    setBookmarkedQuestions((prev) => {
      const updated = new Set(prev)
      if (updated.has(questionId)) {
        updated.delete(questionId)
      } else {
        updated.add(questionId)
      }
      return updated
    })
  }

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => {
      const updated = new Set(prev)
      if (updated.has(questionId)) {
        updated.delete(questionId)
      } else {
        updated.add(questionId)
      }
      return updated
    })
  }

  const isAnswerCorrect = (
    question: TestQuestion,
    userAnswer: string
  ): boolean => {
    if (!question.correctAnswer) return false

    if (question.questionType === "msq") {
      const userAnswers = userAnswer
        .split(",")
        .map((a) => a.trim())
        .sort()
      const correctAnswers = question.correctAnswer
        .split(",")
        .map((a) => a.trim())
        .sort()
      return userAnswers.join(",") === correctAnswers.join(",")
    }

    return (
      userAnswer.toLowerCase().trim() ===
      question.correctAnswer.toLowerCase().trim()
    )
  }

  const handleSubmit = () => {
    if (!isAllAnswered) {
      setSubmitError("Please answer every question before submitting the test.")
      return
    }

    setSubmitError(null)
    const totalTimeSpentSeconds = test.durationMinutes * 60 - remainingSeconds

    const answers = questions.map((question) => {
      const answer = selectedAnswers[question._id]
      const userAnswer = Array.isArray(answer)
        ? answer.join(",")
        : String(answer || "")
      const isCorrect = isAnswerCorrect(question, userAnswer)
      const timeSpent = questionTimeSpent[question._id] || 0

      return {
        questionId: question._id,
        userAnswer,
        isBookmarked: bookmarkedQuestions.has(question._id),
        markedForReview: markedForReview.has(question._id),
        timeSpentSeconds: timeSpent,
        isCorrect,
      }
    })

    const attempted = answeredCount
    const skipped = questions.length - attempted
    const correctAnswers = answers.filter((a) => a.isCorrect).length
    const accuracy =
      questions.length > 0
        ? Math.round((correctAnswers / questions.length) * 100)
        : 0
    const marksObtained = answers.reduce((total, answer, index) => {
      const question = questions[index]
      return total + (answer.isCorrect ? question.marks : 0)
    }, 0)

    onSubmit?.({
      answers,
      attemptedQuestions: attempted,
      skippedQuestions: skipped,
      correctAnswers,
      accuracy,
      totalQuestions: questions.length,
      totalMarks: test.totalMarks,
      timeSpentSeconds: totalTimeSpentSeconds,
      marksObtained,
    })

    setSubmitted(true)
  }

  const currentAnswer = selectedAnswers[currentQuestion._id]
  const isMultiple = currentQuestion.questionType === "msq"
  const defaultOptions = currentQuestion.options?.length
    ? currentQuestion.options
    : currentQuestion.questionType === "true_false"
      ? [
          { order: 1, text: "True" },
          { order: 2, text: "False" },
        ]
      : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <Card className="border">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-xl">{test.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {test.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <Badge variant="secondary">
                  {formatTimer(remainingSeconds)} remaining
                </Badge>
                <Badge variant="outline">{questions.length} questions</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-xl border border-muted p-4">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Total marks
                </p>
                <p className="mt-2 text-lg font-semibold">{test.totalMarks}</p>
              </div>
              <div className="rounded-xl border border-muted p-4">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Duration
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {test.durationMinutes} min
                </p>
              </div>
              <div className="rounded-xl border border-muted p-4">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Answered
                </p>
                <p className="mt-2 text-lg font-semibold">{answeredCount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-muted p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase">
                      Question {currentIndex + 1}
                    </p>
                    <h2 className="text-lg font-semibold">
                      {currentQuestion.questionText}
                    </h2>
                  </div>
                  <Badge>
                    {currentQuestion.questionType
                      .replace("_", " ")
                      .toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {defaultOptions.length > 0 ? (
                    defaultOptions.map((option) => {
                      const value = String(option.text)
                      const checked = Array.isArray(currentAnswer)
                        ? currentAnswer.includes(value)
                        : currentAnswer === value

                      return (
                        <label
                          key={`${currentQuestion._id}-${option.order}`}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-muted px-4 py-3 transition hover:border-primary"
                        >
                          <input
                            type={isMultiple ? "checkbox" : "radio"}
                            name={`question-${currentQuestion._id}`}
                            checked={checked}
                            value={value}
                            required={!isMultiple}
                            onChange={() =>
                              handleOptionChange(
                                currentQuestion._id,
                                value,
                                isMultiple
                              )
                            }
                            className="h-4 w-4 cursor-pointer text-primary"
                          />
                          <span className="text-sm">{option.text}</span>
                        </label>
                      )
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-muted p-4 text-sm text-muted-foreground">
                      This question type requires a written response.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Difficulty: {currentQuestion.difficultyLevel}</p>
                  <p>Marks: {currentQuestion.marks}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      bookmarkedQuestions.has(currentQuestion._id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleBookmark(currentQuestion._id)}
                  >
                    {bookmarkedQuestions.has(currentQuestion._id)
                      ? "★ Bookmarked"
                      : "☆ Bookmark"}
                  </Button>
                  <Button
                    variant={
                      markedForReview.has(currentQuestion._id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleMarkForReview(currentQuestion._id)}
                  >
                    {markedForReview.has(currentQuestion._id)
                      ? "✓ Marked"
                      : "Mark Review"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentIndex((current) => Math.max(current - 1, 0))
                    }
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentIndex((current) =>
                        Math.min(current + 1, questions.length - 1)
                      )
                    }
                    disabled={currentIndex === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} className="h-3 rounded-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{progress}%</span>
                <span>{questions.length - currentIndex - 1} remaining</span>
              </div>
              <div className="grid gap-2">
                {questions.map((question, index) => {
                  const answered = selectedAnswers[question._id] !== undefined
                  return (
                    <button
                      key={question._id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                        currentIndex === index
                          ? "border-primary bg-primary/10"
                          : answered
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-muted bg-background"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant={answered ? "secondary" : "outline"}>
                          Q{index + 1}
                        </Badge>
                        <Badge variant={answered ? "secondary" : "outline"}>
                          {answered ? "Answered" : "Pending"}
                        </Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-slate-950/5">
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Time left</p>
                <p className="text-2xl font-semibold">
                  {formatTimer(remainingSeconds)}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                {submitted
                  ? "Submitted"
                  : isAllAnswered
                    ? "Submit Test"
                    : "Answer All Questions"}
              </Button>
              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
            </CardContent>
          </Card>

          {submitted && (
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  {answeredCount} of {questions.length} questions answered.
                </p>
                <p>Submit completed. Your answers are ready for review.</p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      {submitted && currentQuestion.explanation && (
        <Card className="border">
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
