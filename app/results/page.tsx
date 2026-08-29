"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Flag } from "lucide-react"
import { toast } from "sonner"

import image from "next/image"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

type FilterKey = "all" | "correct" | "incorrect" | "skipped" | "review"
type ReportReason =
  | "wrong_answer"
  | "incorrect_question"
  | "typo"
  | "duplicate"
  | "outdated"
  | "other"

const reportReasons: { value: ReportReason; label: string }[] = [
  { value: "wrong_answer", label: "Wrong answer" },
  { value: "incorrect_question", label: "Incorrect question" },
  { value: "typo", label: "Typo" },
  { value: "duplicate", label: "Duplicate" },
  { value: "outdated", label: "Outdated" },
  { value: "other", label: "Other" },
]

const RING_CIRCUMFERENCE = 251.2 // r=40

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function scoreGrade(pct: number) {
  if (pct >= 90) return { label: "Outstanding", color: "#6ee7c9" }
  if (pct >= 75) return { label: "Excellent", color: "#3ecf8e" }
  if (pct >= 55) return { label: "Good", color: "#f5a623" }
  if (pct >= 35) return { label: "Needs Practice", color: "#f2896b" }
  return { label: "Keep Practicing", color: "#f2555a" }
}

export default function SubcategoryResultsPage() {
  const params = useParams<{ slug: string; subSlug: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resultId = searchParams.get("resultId")

  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterKey>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportingQuestion, setReportingQuestion] = useState<ResultAnswer["questionId"] | null>(null)
  const [reportReason, setReportReason] = useState<ReportReason>("wrong_answer")
  const [reportMessage, setReportMessage] = useState("")
  const [submittingReport, setSubmittingReport] = useState(false)

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
      const isSkipped =
        !answer.userAnswer || answer.userAnswer.trim().length === 0
      return {
        ...answer,
        id: answer.questionId?._id || String(index),
        label: index + 1,
        questionText: answer.questionId?.questionText || "Question",
        correctAnswer: answer.questionId?.correctAnswer || "",
        explanation: answer.questionId?.explanation || "",
        options: answer.questionId?.options || [],
        isSkipped,
      }
    })
  }, [result])

  const filteredItems = useMemo(() => {
    return reviewItems.filter((item) => {
      if (filter === "all") return true
      if (filter === "correct") return !item.isSkipped && item.isCorrect
      if (filter === "incorrect") return !item.isSkipped && !item.isCorrect
      if (filter === "skipped") return item.isSkipped
      if (filter === "review") return !!item.markedForReview
      return true
    })
  }, [reviewItems, filter])

  const incorrectCount = reviewItems.filter(
    (item) => !item.isSkipped && !item.isCorrect
  ).length
  const reviewCount = reviewItems.filter((item) => item.markedForReview).length

  const filterCounts: Record<FilterKey, number> = {
    all: reviewItems.length,
    correct: result?.correctAnswers || 0,
    incorrect: incorrectCount,
    skipped: result?.skippedQuestions || 0,
    review: reviewCount,
  }

  const filterTabs: { key: FilterKey; label: string; color: string }[] = [
    { key: "all", label: "All", color: "#e7ecf3" },
    { key: "correct", label: "Correct", color: "#3ecf8e" },
    { key: "incorrect", label: "Incorrect", color: "#f2555a" },
    { key: "skipped", label: "Skipped", color: "#8a96a8" },
    { key: "review", label: "Flagged", color: "#8b7cf6" },
  ]

  const backHref = `/dashboard/tests/${params?.slug || ""}`

  const handleBack = () => {
    if (typeof window !== "undefined") {
      const hasSameOriginReferrer =
        document.referrer.length > 0 &&
        new URL(document.referrer).origin === window.location.origin

      if (window.history.length > 1 && hasSameOriginReferrer) {
        router.back()
        return
      }
    }

    router.push(backHref)
  }

  const scorePct =
    result && result.totalMarks > 0
      ? Math.round((result.marksObtained / result.totalMarks) * 100)
      : 0
  const grade = scoreGrade(scorePct)
  const ringOffset = RING_CIRCUMFERENCE * (1 - Math.max(scorePct, 0) / 100)

  const openReportDialog = (question: ResultAnswer["questionId"]) => {
    if (!question?._id) return
    setReportingQuestion(question)
    setReportReason("wrong_answer")
    setReportMessage("")
    setReportOpen(true)
  }

  const submitReport = async () => {
    if (!reportingQuestion?._id) return
    if (!reportMessage.trim()) {
      toast.error("Please add a report message")
      return
    }

    try {
      setSubmittingReport(true)
      const response = await fetch(
        `/api/questions/${reportingQuestion._id}/reports`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            reason: reportReason,
            message: reportMessage.trim(),
          }),
        }
      )
      const json = await response.json()

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to submit report")
      }

      toast.success("Question reported")
      setReportOpen(false)
      setReportingQuestion(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit report")
    } finally {
      setSubmittingReport(false)
    }
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <div className="flex items-center gap-2.5 font-[JetBrains_Mono,monospace] text-sm text-[#8a96a8]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
          Loading your result...
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0a0e14] px-4 font-[Inter,sans-serif] text-[#e7ecf3]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <div className="w-full max-w-100 rounded-2xl border border-[#212a37] bg-[#10151d] p-6 text-center">
          <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
            Result not available
          </h2>
          <p className="mt-2 text-[13px] text-[#8a96a8]">
            {error || "No result was found yet."}
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-block rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2.5 text-[13px] font-bold text-[#06120d] transition hover:brightness-105"
          >
            Back to Tests
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-[#212a37] bg-linear-to-b from-[#0c1119] to-[#0a0e14] px-4 py-3 sm:px-6 sm:py-3.5">
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
            {result.testId?.title || "Practice Session"}
          </div>
          <div className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577] sm:text-[11px]">
            Submitted{" "}
            {result.submittedAt
              ? new Date(result.submittedAt).toLocaleDateString()
              : "recently"}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-260 px-4 py-6 sm:px-6 sm:py-9 lg:px-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-[JetBrains_Mono,monospace] text-[11px] tracking-wider text-[#5b6577] uppercase">
              Practice results
            </p>
            <h1 className="mt-0.5 font-[Space_Grotesk,sans-serif] text-xl font-bold sm:text-2xl">
              {result.testId?.title || "Practice Session"}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-[#212a37] bg-transparent px-4 py-2.5 text-center text-[13px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
          >
            Back
          </button>
        </div>

        {/* Hero score card */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
          <div className="mx-auto flex flex-col items-center lg:mx-0">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 96 96"
                className="-rotate-90"
              >
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#212a37"
                  strokeWidth="7"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={grade.color}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  className="transition-[stroke-dashoffset] duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-[Space_Grotesk,sans-serif] text-3xl font-bold">
                  {result.accuracy}%
                </span>
                <span className="font-[JetBrains_Mono,monospace] text-[10px] text-[#5b6577]">
                  ACCURACY
                </span>
              </div>
            </div>
            <span
              className="mt-3 rounded-full border px-3 py-1 font-[JetBrains_Mono,monospace] text-[11px] font-semibold tracking-wide uppercase"
              style={{ color: grade.color, borderColor: `${grade.color}55` }}
            >
              {grade.label}
            </span>
          </div>

          <div>
            <h2 className="font-[Space_Grotesk,sans-serif] text-xl font-bold sm:text-2xl">
              {result.marksObtained} / {result.totalMarks} marks
            </h2>
            <p className="mt-1 text-[13px] text-[#8a96a8]">
              {result.correctAnswers}/{result.totalQuestions} correct ·
              attempted {result.attemptedQuestions} of {result.totalQuestions}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-3">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#3ecf8e]">
                  {result.correctAnswers}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Correct
                </div>
              </div>
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-3">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#f2555a]">
                  {incorrectCount}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Incorrect
                </div>
              </div>
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-3">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#8a96a8]">
                  {result.skippedQuestions}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Skipped
                </div>
              </div>
              <div className="rounded-[10px] border border-[#212a37] bg-[#141b25] px-3 py-3">
                <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#8b7cf6]">
                  {result.accuracy}%
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-[#5b6577] uppercase">
                  Accuracy
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-[JetBrains_Mono,monospace] text-[11.5px] text-[#5b6577]">
              <span>
                ⏱ {formatDuration(result.timeSpentSeconds || 0)} taken
              </span>
              <span>📝 {result.totalQuestions} total questions</span>
            </div>
          </div>
        </div>

        {/* Question review */}
        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold">
              Answer Review
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-full border px-3 py-1.5 font-[JetBrains_Mono,monospace] text-[11px] font-semibold tracking-wide uppercase transition ${
                    filter === tab.key
                      ? "border-current bg-[rgba(255,255,255,0.06)]"
                      : "border-[#212a37] text-[#5b6577] hover:text-[#e7ecf3]"
                  }`}
                  style={filter === tab.key ? { color: tab.color } : undefined}
                >
                  {tab.label} · {filterCounts[tab.key]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredItems.length === 0 && (
              <div className="rounded-[10px] border border-dashed border-[#212a37] bg-[#10151d] p-6 text-center text-sm text-[#5b6577]">
                No questions in this filter.
              </div>
            )}

            {filteredItems.map((item) => {
              const statusColor = item.isSkipped
                ? "#8a96a8"
                : item.isCorrect
                  ? "#3ecf8e"
                  : "#f2555a"
              const statusLabel = item.isSkipped
                ? "Skipped"
                : item.isCorrect
                  ? "Correct"
                  : "Incorrect"
              const isExpanded = expandedId === item.id

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[10px] border border-[#212a37] bg-[#10151d]"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex w-full items-start gap-3 px-4 py-3.5 text-left sm:items-center"
                  >
                    <span
                      className="mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[7px] border font-[JetBrains_Mono,monospace] text-[11px] sm:mt-0"
                      style={{
                        borderColor: `${statusColor}55`,
                        color: statusColor,
                        backgroundColor: `${statusColor}14`,
                      }}
                    >
                      {item.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13.5px] leading-6 text-[#e7ecf3] sm:line-clamp-1">
                        {item.questionText}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className="rounded-full border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] font-semibold tracking-wider uppercase"
                          style={{
                            color: statusColor,
                            borderColor: `${statusColor}55`,
                          }}
                        >
                          {statusLabel}
                        </span>
                        {item.markedForReview && (
                          <span className="rounded-full border border-[rgba(139,124,246,0.4)] px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] tracking-wider text-[#8b7cf6] uppercase">
                            Flagged
                          </span>
                        )}
                        {item.isBookmarked && (
                          <span className="text-[10px] text-[#f5a623]">★</span>
                        )}
                        {typeof item.timeSpentSeconds === "number" &&
                          item.timeSpentSeconds > 0 && (
                            <span className="font-[JetBrains_Mono,monospace] text-[9.5px] text-[#5b6577]">
                              {item.timeSpentSeconds}s
                            </span>
                          )}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#212a37] px-4 py-4">
                      {item.options.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {item.options.map((option) => {
                            const value = String(option.text)
                            const userPicked = item.userAnswer
                              ?.split(",")
                              .map((v) => v.trim())
                              .includes(value)
                            const isRight = item.correctAnswer
                              ?.split(",")
                              .map((v) => v.trim())
                              .includes(value)

                            let style =
                              "border-[#212a37] bg-[#141b25] text-[#8a96a8]"
                            if (isRight)
                              style =
                                "border-[rgba(62,207,142,0.4)] bg-[rgba(62,207,142,0.08)] text-[#3ecf8e]"
                            else if (userPicked && !isRight)
                              style =
                                "border-[rgba(242,85,90,0.4)] bg-[rgba(242,85,90,0.08)] text-[#f2555a]"

                            return (
                              <div
                                key={option.order}
                                className={`flex items-center gap-2.5 rounded-[8px] border px-3 py-2 text-[13px] ${style}`}
                              >
                                <span className="flex-1">{option.text}</span>
                                {isRight && (
                                  <span className="text-[11px]">✓ correct</span>
                                )}
                                {userPicked && !isRight && (
                                  <span className="text-[11px]">
                                    ✕ your pick
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="rounded-[8px] border border-[#212a37] bg-[#141b25] p-3 text-[13px] text-[#8a96a8]">
                          <div>
                            <span className="text-[#5b6577]">
                              Your answer:{" "}
                            </span>
                            {item.isSkipped
                              ? "Skipped"
                              : item.userAnswer || "No answer"}
                          </div>
                          <div className="mt-1.5">
                            <span className="text-[#5b6577]">
                              Correct answer:{" "}
                            </span>
                            <span className="text-[#3ecf8e]">
                              {item.correctAnswer || "Not available"}
                            </span>
                          </div>
                        </div>
                      )}

                      {item.explanation && (
                        <div className="mt-3 rounded-[8px] border border-[#212a37] bg-[#141b25] p-3">
                          <p className="mb-1 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider text-[#5b6577] uppercase">
                            Explanation
                          </p>
                          <p className="text-[13px] leading-6 text-[#8a96a8]">
                            {item.explanation}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 border-[#212a37] bg-transparent text-[#8a96a8] hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
                          onClick={() => openReportDialog(item.questionId)}
                          disabled={!item.questionId?._id}
                        >
                          <Flag className="h-4 w-4" />
                          Report question
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report question</DialogTitle>
            <DialogDescription>
              Tell us what is wrong with this question so we can review it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                {reportingQuestion?.questionText || "Question"}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="report-reason">Reason</Label>
              <Select
                value={reportReason}
                onValueChange={(value) => setReportReason(value as ReportReason)}
              >
                <SelectTrigger id="report-reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="report-message">Details</Label>
              <Textarea
                id="report-message"
                rows={4}
                value={reportMessage}
                onChange={(event) => setReportMessage(event.target.value)}
                placeholder="Explain the issue in detail..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportOpen(false)}
              disabled={submittingReport}
            >
              Cancel
            </Button>
            <Button onClick={submitReport} disabled={submittingReport}>
              {submittingReport ? "Submitting..." : "Submit report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
