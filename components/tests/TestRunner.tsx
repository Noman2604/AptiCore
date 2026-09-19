"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import {
  TOTAL_SECONDS_KEY,
  isQuestionAnswered,
  type TestQuestion,
  type TestRunnerProps,
  type TestRunnerSubmitPayload,
  ProctorStrip,
  TestHeader,
  TestProgressBar,
  TestSectionRail,
  QuestionCard,
  QuestionPalette,
  MobileBottomBar,
  SubmitConfirmModal,
  WarningModal,
  TestToast,
} from "./runner"

export type { TestQuestion, TestRunnerProps }

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
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  const questionEnteredAt = useRef(Date.now())
  const toastTimer = useRef<number | null>(null)
  const lastWarnedStrike = useRef<number>(0)

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  // Fetch existing bookmarks for the current user
  useEffect(() => {
    let isMounted = true
    const loadUserBookmarks = async () => {
      try {
        const res = await axios.get("/api/bookmarks?limit=1000", {
          withCredentials: true,
        })
        if (isMounted && res.data?.success && Array.isArray(res.data.data)) {
          const ids = new Set<string>()
          res.data.data.forEach((b: { questionId?: { _id?: string } | string }) => {
            const qId =
              typeof b.questionId === "object" && b.questionId !== null
                ? b.questionId._id
                : b.questionId
            if (qId) ids.add(String(qId))
          })
          setBookmarkedQuestions(ids)
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err)
      }
    }

    loadUserBookmarks()
    return () => {
      isMounted = false
    }
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
  }, [
    selectedAnswers,
    questions,
    onProgressChange,
    totalSeconds,
    remainingSeconds,
  ])

  const skippedCount = questions.length - answeredCount
  const reviewCount = markedForReview.size
  const progressPct =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0

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

  const buildSubmitPayload = useCallback((): TestRunnerSubmitPayload => {
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
    negativeMarking,
    questionTimeSpent,
    questions,
    remainingSeconds,
    selectedAnswers,
    test.totalMarks,
    totalSeconds,
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

  // Auto-submit when timer hits zero
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
        setTabSwitches((count) => count + 1)
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [submitted])

  useEffect(() => {
    if (submitted || tabSwitches === 0) return

    if (lastWarnedStrike.current === tabSwitches) return
    lastWarnedStrike.current = tabSwitches

    if (tabSwitches === 1) {
      setWarningMessage(
        "Tab switching is not allowed. Further violations will result in automatic submission."
      )
      setShowWarningModal(true)
    } else if (tabSwitches === 2) {
      setWarningMessage(
        "FINAL WARNING: If you switch tabs one more time, your test will be automatically submitted."
      )
      setShowWarningModal(true)
    } else if (tabSwitches >= 3) {
      finalizeSubmit()
      showToast("Test automatically submitted due to repeated tab switching.")
    }
  }, [tabSwitches, submitted, finalizeSubmit, showToast])

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

  const toggleBookmark = async (questionId: string) => {
    if (submitted) return
    const wasBookmarked = bookmarkedQuestions.has(questionId)

    // Optimistic local state update
    setBookmarkedQuestions((prev) => {
      const updated = new Set(prev)
      if (wasBookmarked) updated.delete(questionId)
      else updated.add(questionId)
      return updated
    })

    try {
      if (wasBookmarked) {
        await axios.delete(`/api/bookmarks?questionId=${questionId}`, {
          withCredentials: true,
        })
        showToast("Bookmark removed")
      } else {
        await axios.post(
          "/api/bookmarks",
          {
            questionId,
            notes: `Saved during test: ${test.title}`,
          },
          { withCredentials: true }
        )
        showToast("Question added to bookmarks ★")
      }
    } catch (error) {
      console.error("Bookmark sync error:", error)
      // Revert optimistic update
      setBookmarkedQuestions((prev) => {
        const reverted = new Set(prev)
        if (wasBookmarked) reverted.add(questionId)
        else reverted.delete(questionId)
        return reverted
      })
      showToast("Failed to update bookmark")
    }
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
    showWarningModal,
  ])

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0a0e14] font-[Inter,sans-serif] text-slate-900 dark:text-[#e7ecf3]">
        No questions available for this test.
      </div>
    )
  }

  const currentAnswer = selectedAnswers[currentQuestion._id]
  const sectionText =
    sectionLabel?.toUpperCase() ||
    test.description?.toUpperCase() ||
    "PRACTICE TEST"

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0a0e14] font-[Inter,sans-serif] text-slate-900 dark:text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      {/* Integrity strip */}
      <ProctorStrip
        tabSwitches={tabSwitches}
        sectionText={sectionText}
        negativeMarking={negativeMarking}
      />

      {/* Header */}
      <TestHeader test={test} questionCount={questions.length} />

      {/* Progress bar */}
      <TestProgressBar progressPct={progressPct} />

      {/* Main layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[64px_1fr_300px]">
        {/* Left rail (desktop only) */}
        <TestSectionRail sectionText={sectionText} />

        {/* Center question panel */}
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          negativeMarking={negativeMarking}
          currentAnswer={currentAnswer}
          isBookmarked={bookmarkedQuestions.has(currentQuestion._id)}
          isMarkedForReview={markedForReview.has(currentQuestion._id)}
          submitted={submitted}
          onOptionChange={handleOptionChange}
          onToggleBookmark={toggleBookmark}
          onToggleMarkForReview={toggleMarkForReview}
          onPrev={goPrev}
          onNext={goNext}
        />

        {/* Sidebar palette */}
        <QuestionPalette
          questions={questions}
          currentIndex={currentIndex}
          selectedAnswers={selectedAnswers}
          bookmarkedQuestions={bookmarkedQuestions}
          markedForReview={markedForReview}
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          answeredCount={answeredCount}
          reviewCount={reviewCount}
          skippedCount={skippedCount}
          submitted={submitted}
          isPaletteOpen={isPaletteOpen}
          onClosePalette={() => setIsPaletteOpen(false)}
          onSelectQuestion={goToQuestion}
          onRequestSubmit={requestSubmit}
        />
      </div>

      {/* Mobile bottom bar */}
      <MobileBottomBar
        remainingSeconds={remainingSeconds}
        totalSeconds={totalSeconds}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        submitted={submitted}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onRequestSubmit={requestSubmit}
      />

      {/* Submit confirmation modal */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        answeredCount={answeredCount}
        reviewCount={reviewCount}
        skippedCount={skippedCount}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={finalizeSubmit}
      />

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        warningMessage={warningMessage}
        onClose={() => setShowWarningModal(false)}
      />

      {/* Toast notification */}
      <TestToast message={toast} />
    </div>
  )
}
