"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

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
  sectionLabel?: string
  negativeMarking?: number
  onProgressChange?: (progress: { answers: Record<string, string | string[]>; attemptedQuestions: number; skippedQuestions: number; correctAnswers: number; accuracy: number; timeSpentSeconds: number }) => void
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
const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"]
const RING_CIRCUMFERENCE = 169.6
const TOTAL_SECONDS_KEY = (minutes: number) => minutes * 60

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = String(seconds % 60).padStart(2, "0")
  return `${String(minutes).padStart(2, "0")}:${remainingSeconds}`
}

function isQuestionAnswered(answer: string | string[] | undefined): boolean {
  if (answer === undefined) return false
  if (Array.isArray(answer)) return answer.length > 0
  return String(answer).trim().length > 0
}

function difficultyPillClass(level: TestQuestion["difficultyLevel"]) {
  if (level === "easy") return "text-[#3ecf8e] border-[rgba(62,207,142,0.35)]"
  if (level === "hard") return "text-[#f2555a] border-[rgba(242,85,90,0.35)]"
  return "text-[#f5a623] border-[rgba(245,166,35,0.35)]"
}

export default function TestRunner({
  test,
  questions,
  sectionLabel,
  negativeMarking = 1,
  onProgressChange,
  onSubmit,
}: TestRunnerProps) {
  const totalSeconds = TOTAL_SECONDS_KEY(test.durationMinutes)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string | string[]>
  >({})
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds)
  const [submitted, setSubmitted] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(
    new Set()
  )
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [questionTimeSpent, setQuestionTimeSpent] = useState<
    Record<string, number>
  >({})
  const [tabSwitches, setTabSwitches] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const questionEnteredAt = useRef(Date.now())
  const toastTimer = useRef<number | null>(null)
  const lastProgressUpdateRef = useRef<number>(0)

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  const currentQuestion = questions[currentIndex]

  const answeredCount = useMemo(() => {
    return questions.filter((question) =>
      isQuestionAnswered(selectedAnswers[question._id])
    ).length
  }, [questions, selectedAnswers])

  // Call onProgressChange when answers change
  useEffect(() => {
    if (!onProgressChange) return

    const answers = questions.map((question) => ({
      questionId: question._id,
      userAnswer: selectedAnswers[question._id],
    }))

    const attemptedQuestions = answers.filter((a) =>
      isQuestionAnswered(a.userAnswer)
    ).length
    const skippedQuestions = questions.length - attemptedQuestions

    const correctAnswers = answers.filter((answer) => {
      const question = questions.find((q) => q._id === answer.questionId)
      if (!question) return false
      const userAnswer = answer.userAnswer
      const correctAnswer = question.correctAnswer

      if (question.questionType === "msq")
        return (
          Array.isArray(userAnswer) &&
          Array.isArray(correctAnswer) &&
          userAnswer.join(",") === correctAnswer.join(",")
        )
      return String(userAnswer) === String(correctAnswer)
    }).length

    const accuracy =
      attemptedQuestions > 0
        ? Math.round((correctAnswers / questions.length) * 100)
        : 0

    onProgressChange({
      answers: selectedAnswers,
      attemptedQuestions,
      skippedQuestions,
      correctAnswers,
      accuracy,
      timeSpentSeconds: totalSeconds - remainingSeconds,
    })
  }, [selectedAnswers, questions, onProgressChange, totalSeconds, remainingSeconds])

  const skippedCount = questions.length - answeredCount
  const reviewCount = markedForReview.size
  const progressPct =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0

  const timerPct = remainingSeconds / totalSeconds
  const ringOffset = RING_CIRCUMFERENCE * (1 - timerPct)
  const ringColor =
    remainingSeconds < 60
      ? "#f2555a"
      : remainingSeconds < 5 * 60
        ? "#f5a623"
        : "#6ee7c9"

  const isAnswerCorrect = useCallback(
    (question: TestQuestion, userAnswer: string): boolean => {
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
    },
    []
  )

  const buildSubmitPayload = useCallback(() => {
    const totalTimeSpentSeconds = totalSeconds - remainingSeconds

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
      const hasAnswer = String(answer.userAnswer || "").trim().length > 0

      if (!hasAnswer) return total
      if (answer.isCorrect) return total + question.marks

      return total - negativeMarking
    }, 0)

    return {
      answers,
      attemptedQuestions: attempted,
      skippedQuestions: skipped,
      correctAnswers,
      accuracy,
      totalQuestions: questions.length,
      totalMarks: test.totalMarks,
      timeSpentSeconds: totalTimeSpentSeconds,
      marksObtained,
    }
  }, [
    answeredCount,
    bookmarkedQuestions,
    isAnswerCorrect,
    markedForReview,
    questionTimeSpent,
    questions,
    remainingSeconds,
    selectedAnswers,
    test.totalMarks,
    totalSeconds,
    negativeMarking,
  ])

  const finalizeSubmit = useCallback(() => {
    if (submitted) return
    onSubmit?.(buildSubmitPayload())
    setSubmitted(true)
    setShowSubmitModal(false)
    setIsPaletteOpen(false)
    showToast("Test submitted successfully ✓")
  }, [buildSubmitPayload, onSubmit, showToast, submitted])

  const requestSubmit = useCallback(() => {
    if (submitted) return
    setShowSubmitModal(true)
  }, [submitted])

  // Auto-submit when timer hits zero — no confirmation needed
  useEffect(() => {
    if (submitted) return
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [submitted])

  useEffect(() => {
    if (remainingSeconds === 0 && !submitted) {
      finalizeSubmit()
    }
  }, [finalizeSubmit, remainingSeconds, submitted])

  useEffect(() => {
    if (!currentQuestion) return
    questionEnteredAt.current = Date.now()

    return () => {
      const elapsed = Math.round(
        (Date.now() - questionEnteredAt.current) / 1000
      )
      if (elapsed <= 0) return
      setQuestionTimeSpent((prev) => ({
        ...prev,
        [currentQuestion._id]: (prev[currentQuestion._id] || 0) + elapsed,
      }))
    }
  }, [currentIndex, currentQuestion])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && !submitted) {
        setTabSwitches((count) => {
          const next = count + 1
          if (next >= 1) {
            showToast("⚠ Tab switch detected — flagged for review")
          }
          return next
        })
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [showToast, submitted])

  const handleOptionChange = (
    questionId: string,
    optionValue: string,
    multiple = false
  ) => {
    if (submitted) return
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
    if (submitted) return
    setBookmarkedQuestions((prev) => {
      const updated = new Set(prev)
      if (updated.has(questionId)) updated.delete(questionId)
      else updated.add(questionId)
      return updated
    })
  }

  const toggleMarkForReview = (questionId: string) => {
    if (submitted) return
    setMarkedForReview((prev) => {
      const updated = new Set(prev)
      if (updated.has(questionId)) updated.delete(questionId)
      else updated.add(questionId)
      return updated
    })
  }

  const goToQuestion = (index: number) => {
    if (submitted) return
    setCurrentIndex(index)
    setIsPaletteOpen(false)
  }

  const goNext = () => {
    if (submitted) return
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1)
    } else {
      showToast(
        "You have reached the last question — review before submitting."
      )
    }
  }

  const goPrev = () => {
    if (submitted) return
    setCurrentIndex((current) => Math.max(current - 1, 0))
  }

  useEffect(() => {
    if (submitted) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (showSubmitModal) {
        if (event.key === "Escape") setShowSubmitModal(false)
        return
      }
      if (!currentQuestion) return

      const options = currentQuestion.options?.length
        ? currentQuestion.options
        : currentQuestion.questionType === "true_false"
          ? [
              { order: 1, text: "True" },
              { order: 2, text: "False" },
            ]
          : []

      if (["1", "2", "3", "4", "5", "6"].includes(event.key)) {
        const idx = parseInt(event.key, 10) - 1
        const option = options[idx]
        if (option) {
          handleOptionChange(
            currentQuestion._id,
            String(option.text),
            currentQuestion.questionType === "msq"
          )
        }
      }

      if (event.key === "ArrowRight") goNext()
      if (event.key === "ArrowLeft") goPrev()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [
    currentQuestion,
    currentIndex,
    questions.length,
    submitted,
    showSubmitModal,
  ])

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]">
        No questions available for this test.
      </div>
    )
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

  const needsTextInput = ["fill_blank", "numerical", "coding"].includes(
    currentQuestion.questionType
  )

  const sectionText =
    sectionLabel?.toUpperCase() ||
    test.description?.toUpperCase() ||
    "PRACTICE TEST"

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      {/* Integrity strip */}
      <div className="flex h-8.5 shrink-0 scrollbar-none items-center gap-0 overflow-x-auto overflow-y-hidden border-b border-[#212a37] bg-[#070a0f] px-3 font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wide whitespace-nowrap text-[#5b6577] sm:px-4 sm:text-[11px]">
        <div className="flex h-full shrink-0 items-center gap-1.5 border-r border-[#1a212b] pr-3.5">
          <span
            className={`h-1.5 w-1.5 animate-pulse rounded-full ${tabSwitches >= 1 ? "bg-[#f5a623] shadow-[0_0_8px_#f5a623]" : "bg-[#3ecf8e] shadow-[0_0_8px_#3ecf8e]"}`}
          />
          PROCTOR: ACTIVE
        </div>
        <div className="flex h-full shrink-0 items-center border-r border-[#1a212b] px-3.5">
          TAB SWITCHES: {tabSwitches}
        </div>
        <div className="hidden h-full shrink-0 items-center border-r border-[#1a212b] px-3.5 sm:flex">
          FULLSCREEN: LOCKED
        </div>
        <div className="hidden h-full shrink-0 items-center border-r border-[#1a212b] px-3.5 md:flex">
          SECTION: {sectionText}
        </div>
        <div className="flex h-full shrink-0 items-center px-3.5">
          NEGATIVE MARKING: − {negativeMarking} / WRONG
        </div>
      </div>

      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#212a37] bg-linear-to-b from-[#0c1119] to-[#0a0e14] px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="min-w-0">
            <Image
              loading="lazy"
              src="/logo.png"
              alt="AptiCore Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            />
          </div>
          <div className="min-w-0">
            <div className="truncate font-[Space_Grotesk,sans-serif] text-[14px] font-bold tracking-wide sm:text-[15px]">
              AptiCore
            </div>
            <div className="hidden font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577] sm:block">
              campus placement engine
            </div>
          </div>
        </div>
        <div className="min-w-0 text-right">
          <div className="truncate font-[Space_Grotesk,sans-serif] text-[13px] font-semibold sm:text-sm">
            {test.title}
          </div>
          <div className="hidden font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577] sm:block">
            {questions.length} Qs · {test.totalMarks} marks ·{" "}
            {test.durationMinutes} min · Attempt 1 of 1
          </div>
          <div className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577] sm:hidden">
            {questions.length} Qs · {test.durationMinutes} min
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative h-1 w-full shrink-0 bg-[#151b24]">
        <div
          className="h-full bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
        <span className="absolute top-1.5 right-3 hidden font-[JetBrains_Mono,monospace] text-[10px] text-[#5b6577] sm:block">
          {progressPct}% complete
        </span>
      </div>

      {/* Main layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[64px_1fr_300px]">
        {/* Left rail (desktop only) */}
        <div className="hidden flex-col items-center gap-1.5 border-r border-[#212a37] bg-[#10151d] py-4 lg:flex">
          <button
            type="button"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-[9px] border border-[rgba(110,231,201,0.35)] bg-[rgba(110,231,201,0.12)] text-base text-[#6ee7c9]"
            title={sectionText}
          >
            {sectionText.charAt(0)}
          </button>
          <div className="flex-1" />
          <div className="mt-2 font-[JetBrains_Mono,monospace] text-[9px] tracking-[0.15em] text-[#5b6577] [writing-mode:vertical-rl]">
            SECTION 1 / 1
          </div>
        </div>

        {/* Center panel */}
        <div className="overflow-y-auto px-4 py-5 pb-28 sm:px-6 sm:py-7 lg:px-10 lg:pb-24">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577] sm:gap-2.5 sm:text-xs">
              <span>
                QUESTION{" "}
                <b className="text-[#e7ecf3]">
                  {String(currentIndex + 1).padStart(2, "0")}
                </b>{" "}
                / {questions.length}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider uppercase ${difficultyPillClass(currentQuestion.difficultyLevel)}`}
              >
                {currentQuestion.difficultyLevel}
              </span>
              <span className="rounded-full border border-[rgba(139,124,246,0.35)] px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider text-[#8b7cf6] uppercase">
                +{currentQuestion.marks} mark
                {currentQuestion.marks === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {negativeMarking > 0 && (
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(242,85,90,0.25)] bg-[rgba(242,85,90,0.08)] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#f2555a]">
              ⚠ Wrong answer deducts {negativeMarking} marks
            </div>
          )}

          <h2 className="mb-6 max-w-160 font-[Space_Grotesk,sans-serif] text-[18px] leading-normal font-semibold sm:text-[21px]">
            {currentIndex + 1}. {currentQuestion.questionText}
          </h2>

          <div className="flex max-w-155 flex-col gap-2.5">
            {defaultOptions.length > 0 ? (
              defaultOptions.map((option, index) => {
                const value = String(option.text)
                const checked = Array.isArray(currentAnswer)
                  ? currentAnswer.includes(value)
                  : currentAnswer === value

                return (
                  <label
                    key={`${currentQuestion._id}-${option.order}`}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-4 py-3.75 transition-all duration-150 ${
                      checked
                        ? "border-[#6ee7c9] bg-[rgba(110,231,201,0.07)]"
                        : "border-[#212a37] bg-[#10151d] hover:border-[#37465a] hover:bg-[#141b25]"
                    } ${submitted ? "pointer-events-none opacity-70" : ""}`}
                  >
                    <span
                      className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[7px] border font-[JetBrains_Mono,monospace] text-[11px] ${
                        checked
                          ? "border-[#6ee7c9] bg-[rgba(110,231,201,0.12)] text-[#6ee7c9]"
                          : "border-[#212a37] text-[#5b6577]"
                      }`}
                    >
                      {OPTION_KEYS[index] || "?"}
                    </span>
                    <span className="text-[14.5px]">{option.text}</span>
                    <input
                      type={isMultiple ? "checkbox" : "radio"}
                      name={`question-${currentQuestion._id}`}
                      checked={checked}
                      value={value}
                      onChange={() =>
                        handleOptionChange(
                          currentQuestion._id,
                          value,
                          isMultiple
                        )
                      }
                      className="sr-only"
                    />
                  </label>
                )
              })
            ) : needsTextInput ? (
              <textarea
                value={typeof currentAnswer === "string" ? currentAnswer : ""}
                onChange={(event) =>
                  handleOptionChange(
                    currentQuestion._id,
                    event.target.value,
                    false
                  )
                }
                disabled={submitted}
                placeholder="Type your answer here..."
                rows={4}
                className="w-full resize-y rounded-[10px] border border-[#212a37] bg-[#10151d] px-4 py-3 text-sm text-[#e7ecf3] transition outline-none focus:border-[#6ee7c9] disabled:opacity-60"
              />
            ) : (
              <div className="rounded-[10px] border border-dashed border-[#212a37] bg-[#10151d] p-4 text-sm text-[#8a96a8]">
                This question type requires a written response.
              </div>
            )}
          </div>

          <div className="mt-7 flex max-w-155 flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => toggleBookmark(currentQuestion._id)}
              disabled={submitted}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold transition disabled:opacity-35 sm:px-4 sm:text-[13px] ${
                bookmarkedQuestions.has(currentQuestion._id)
                  ? "border-[rgba(245,166,35,0.4)] bg-[rgba(245,166,35,0.08)] text-[#f5a623]"
                  : "border-[#212a37] bg-[#10151d] text-[#8a96a8] hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
              }`}
            >
              {bookmarkedQuestions.has(currentQuestion._id)
                ? "★ Bookmarked"
                : "☆ Bookmark"}
            </button>
            <button
              type="button"
              onClick={() => toggleMarkForReview(currentQuestion._id)}
              disabled={submitted}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold transition disabled:opacity-35 sm:px-4 sm:text-[13px] ${
                markedForReview.has(currentQuestion._id)
                  ? "border-[rgba(139,124,246,0.4)] bg-[rgba(139,124,246,0.08)] text-[#8b7cf6]"
                  : "border-[#212a37] bg-[#10151d] text-[#8a96a8] hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
              }`}
            >
              {markedForReview.has(currentQuestion._id)
                ? "✓ Marked for Review"
                : "Mark for Review"}
            </button>
            <div className="hidden flex-1 sm:block" />
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0 || submitted}
              className="rounded-lg border border-[#212a37] bg-transparent px-3.5 py-2.5 text-[12.5px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3] disabled:cursor-not-allowed disabled:opacity-35 sm:px-4 sm:text-[13px]"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={submitted}
              className="rounded-lg border border-[#6ee7c9] bg-[#6ee7c9] px-3.5 py-2.5 text-[12.5px] font-semibold text-[#08150f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 sm:px-4 sm:text-[13px]"
            >
              {currentIndex === questions.length - 1 ? "Finish →" : "Next →"}
            </button>
          </div>

          {submitted && currentQuestion.explanation && (
            <div className="mt-8 max-w-155 rounded-[10px] border border-[#212a37] bg-[#10151d] p-5">
              <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-base font-semibold">
                Explanation
              </h3>
              <p className="text-sm leading-7 text-[#8a96a8]">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar (desktop: static column, mobile: slide-up drawer) */}
        <aside
          className={`fixed inset-x-0 bottom-0 z-40 flex max-h-[80vh] flex-col overflow-hidden rounded-t-2xl border-t border-[#212a37] bg-[#10151d] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:max-h-none lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-none ${
            isPaletteOpen
              ? "translate-y-0"
              : "translate-y-full lg:translate-y-0"
          }`}
        >
          {/* Mobile drag handle */}
          <button
            type="button"
            onClick={() => setIsPaletteOpen(false)}
            className="flex h-6 shrink-0 items-center justify-center lg:hidden"
            aria-label="Close palette"
          >
            <span className="h-1 w-10 rounded-full bg-[#2a3444]" />
          </button>

          <div className="flex items-center gap-4 border-b border-[#212a37] p-4 sm:p-5">
            <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 64 64"
                className="-rotate-90"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke="#212a37"
                  strokeWidth="5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  className="transition-[stroke-dashoffset,stroke] duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-[JetBrains_Mono,monospace] text-[9px] text-[#5b6577]">
                MIN
              </div>
            </div>
            <div>
              <div className="font-[JetBrains_Mono,monospace] text-xl font-bold tracking-tight sm:text-2xl">
                {formatTimer(remainingSeconds)}
              </div>
              <div className="mt-0.5 text-[11px] text-[#5b6577]">
                time remaining
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 border-b border-[#212a37] px-4 py-4 sm:px-5">
            <div className="flex-1">
              <div className="font-[Space_Grotesk,sans-serif] text-[18px] font-bold text-[#3ecf8e] sm:text-[19px]">
                {answeredCount}
              </div>
              <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                Answered
              </div>
            </div>
            <div className="flex-1">
              <div className="font-[Space_Grotesk,sans-serif] text-[18px] font-bold text-[#8b7cf6] sm:text-[19px]">
                {reviewCount}
              </div>
              <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                Review
              </div>
            </div>
            <div className="flex-1">
              <div className="font-[Space_Grotesk,sans-serif] text-[18px] font-bold text-[#8a96a8] sm:text-[19px]">
                {skippedCount}
              </div>
              <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                Skipped
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-[JetBrains_Mono,monospace] text-[11px] tracking-wider text-[#5b6577] uppercase">
                Question Palette
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.75 sm:grid-cols-5">
              {questions.map((question, index) => {
                const answered = isQuestionAnswered(
                  selectedAnswers[question._id]
                )
                const isCurrent = currentIndex === index
                const isReview = markedForReview.has(question._id)
                const isBookmarked = bookmarkedQuestions.has(question._id)

                return (
                  <button
                    key={question._id}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    className={`relative flex aspect-square items-center justify-center rounded-[7px] border font-[JetBrains_Mono,monospace] text-[11px] transition ${
                      isCurrent
                        ? "border-[#e7ecf3] text-[#e7ecf3] shadow-[inset_0_0_0_1px_#e7ecf3]"
                        : answered
                          ? "border-[rgba(62,207,142,0.4)] bg-[rgba(62,207,142,0.1)] text-[#3ecf8e]"
                          : isReview
                            ? "border-[rgba(139,124,246,0.4)] bg-[rgba(139,124,246,0.1)] text-[#8b7cf6]"
                            : "border-[#212a37] bg-[#141b25] text-[#8a96a8]"
                    } ${isReview && !isCurrent ? "after:absolute after:-top-0.75 after:-right-0.75 after:h-2 after:w-2 after:rounded-full after:border-[1.5px] after:border-[#10151d] after:bg-[#8b7cf6]" : ""} ${isBookmarked ? "before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:text-[8px] before:text-[#f5a623] before:content-['★']" : ""}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2.5 font-[JetBrains_Mono,monospace] text-[10px] text-[#5b6577]">
              <span className="flex items-center gap-1.5">
                <i className="inline-block h-2 w-2 rounded-sm bg-[rgba(62,207,142,0.4)]" />
                Answered
              </span>
              <span className="flex items-center gap-1.5">
                <i className="inline-block h-2 w-2 rounded-sm bg-[rgba(139,124,246,0.4)]" />
                For Review
              </span>
              <span className="flex items-center gap-1.5">
                <i className="inline-block h-2 w-2 rounded-sm border border-[#212a37] bg-[#141b25]" />
                Skipped
              </span>
            </div>
          </div>

          <div className="border-t border-[#212a37] p-4 sm:p-4.5">
            <button
              type="button"
              onClick={requestSubmit}
              disabled={submitted}
              className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-3 font-[Space_Grotesk,sans-serif] text-sm font-bold text-[#06120d] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitted ? "Submitted ✓" : "Submit Test →"}
            </button>
            <p className="mt-2 text-center font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
              {submitted
                ? `${answeredCount} of ${questions.length} questions answered`
                : "You can still edit answers until you submit"}
            </p>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isPaletteOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsPaletteOpen(false)}
          />
        )}
      </div>

      {/* Mobile bottom bar */}
      <div className="flex shrink-0 items-center gap-2.5 border-t border-[#212a37] bg-[#0c1119] px-4 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setIsPaletteOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-[#212a37] bg-[#10151d] px-3 py-2 font-[JetBrains_Mono,monospace] text-[12px] text-[#e7ecf3]"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: ringColor }}
          />
          {formatTimer(remainingSeconds)}
        </button>
        <button
          type="button"
          onClick={() => setIsPaletteOpen(true)}
          className="flex-1 rounded-lg border border-[#212a37] bg-[#10151d] px-3 py-2 text-center font-[JetBrains_Mono,monospace] text-[12px] text-[#8a96a8]"
        >
          {answeredCount}/{questions.length} answered · Palette
        </button>
        <button
          type="button"
          onClick={requestSubmit}
          disabled={submitted}
          className="rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2 font-[Space_Grotesk,sans-serif] text-[12.5px] font-bold text-[#06120d] disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-70 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-100 rounded-t-2xl border border-[#212a37] bg-[#10151d] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:p-6"
          >
            <h3 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#e7ecf3]">
              Submit test?
            </h3>
            <p className="mt-1.5 text-[13px] leading-6 text-[#8a96a8]">
              Once submitted, you won't be able to change your answers. Please
              review your summary below.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-2.5 text-center">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#3ecf8e]">
                  {answeredCount}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Answered
                </div>
              </div>
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-2.5 text-center">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#8b7cf6]">
                  {reviewCount}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Review
                </div>
              </div>
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-2.5 text-center">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#f2555a]">
                  {skippedCount}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Skipped
                </div>
              </div>
            </div>

            {skippedCount > 0 && (
              <div className="mt-3.5 rounded-[9px] border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.08)] px-3 py-2 text-[12px] text-[#f5a623]">
                ⚠ You still have {skippedCount} unanswered question
                {skippedCount > 1 ? "s" : ""}.
              </div>
            )}

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-lg border border-[#212a37] bg-transparent py-2.75 text-[13.5px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={finalizeSubmit}
                className="flex-1 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-2.75 text-[13.5px] font-bold text-[#06120d] transition hover:brightness-105"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`pointer-events-none fixed bottom-20 left-1/2 z-60 -translate-x-1/2 rounded-[9px] border border-[#212a37] bg-[#131a24] px-4.5 py-2.75 font-[JetBrains_Mono,monospace] text-[12.5px] text-[#e7ecf3] shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-250 lg:bottom-5 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        {toast}
      </div>
    </div>
  )
}
