"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Trophy,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Activity,
  Zap,
  Award,
  Inbox,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ResultHistoryItem {
  _id: string
  testName: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers: number
  skippedQuestions: number
  accuracy: number
  marksObtained: number
  totalMarks: number
  status: string
  submittedAt?: string
  timeSpentSeconds?: number
  testId?: {
    _id?: string
    title?: string
    totalQuestions?: number
    totalMarks?: number
    durationMinutes?: number
    categoryId?: { slug?: string; name?: string }
    subcategory?: { slug?: string; name?: string }
  }
}

interface AchievementHistoryItem {
  _id: string
  achievementId: {
    _id: string
    name: string
    pointsReward: number
  }
  unlockedAt?: string
}

interface XpHistoryItem {
  _id: string
  xpPoints: number
  sourceType: string
  sourceId?: string
  createdAt?: string
}

interface FeedbackHistoryItem {
  _id: string
  feedbackType: "feedback" | "comment"
  targetType: "question" | "test" | "result" | "page" | "platform"
  title?: string
  content: string
  status: "pending" | "published" | "hidden" | "resolved"
  rating?: number
  createdAt?: string
  resolvedAt?: string
}

type SectionKey = "tests" | "xp" | "achievements" | "feedback"

const sourceLabels: Record<string, string> = {
  achievement: "Achievement",
  test_completion: "Test Completion",
  correct_answer: "Correct Answer",
  streak: "Streak Bonus",
  bonus: "Bonus",
}

const FEEDBACK_STATUS_STYLES: Record<
  FeedbackHistoryItem["status"],
  { color: string; bg: string; border: string; label: string }
> = {
  pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", label: "Pending" },
  resolved: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", label: "Resolved" },
  hidden: { color: "var(--muted-foreground)", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)", label: "Hidden" },
  published: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", label: "Published" },
}

const TEST_STATUS_STYLES: Record<
  string,
  { color: string; bg: string; border: string; progress: string }
> = {
  completed: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", progress: "#10B981" },
  in_progress: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", progress: "#F59E0B" },
  abandoned: { color: "var(--muted-foreground)", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)", progress: "#94A3B8" },
}

const ITEMS_PER_PAGE = 10

function formatDate(value?: string) {
  if (!value) return "Recent"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}


function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof FileText
  label: string
  value: string | number
  accent: string
}) {
  return (
    <Card
      className=" overflow-hidden  border hover:shadow-lg"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <CardContent className=" p-4 sm:p-5 flex items-center justify-center gap-1.5">
        <div className="flex items-center justify-center">
          <div
            className="flex sm:h-10 sm:w-10 h-8 w-8 items-center justify-center  rounded-sm border"
            style={{ borderColor: `${accent}40`, backgroundColor: `${accent}14`, color: accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="ml-3 flex flex-col items-start justify-center ">
          <p className="text-sm font-bold tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: typeof Inbox
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <div className="flex flex-col bg-[#f4f4f4] dark:bg-[#16191f] items-center justify-center rounded-2xl border border-dashed py-14 text-center" style={{ borderColor: "var(--border)" }}>
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {ctaLabel && ctaHref && (
        <Button asChild className="mt-5 gap-2 bg-[#10B981] text-[#09090B] hover:bg-[#10B981]/90">
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}

function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 bg-muted" />
            <Skeleton className="h-3 w-24 bg-muted" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-14 bg-muted" />
            <Skeleton className="h-8 w-16 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages: number[] = []
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)
    if (currentPage <= 3) end = Math.min(5, totalPages)
    if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const rangeStart = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

  return (
    <div
      className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-5 sm:flex-row"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-xs text-muted-foreground sm:text-sm">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {rangeStart}–{rangeEnd}
        </span>{" "}
        of <span className="font-semibold text-foreground">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 border-border bg-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPages().map((page) => (
          <Button
            key={page}
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-8 w-8 text-xs font-semibold",
              page === currentPage
                ? "bg-[#10B981] text-[#09090B] hover:bg-[#10B981]/90"
                : "border border-border bg-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
            )}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 border-border bg-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [section, setSection] = useState<SectionKey>("tests")
  const [results, setResults] = useState<ResultHistoryItem[]>([])
  const [achievements, setAchievements] = useState<AchievementHistoryItem[]>([])
  const [xpHistory, setXpHistory] = useState<XpHistoryItem[]>([])
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testPage, setTestPage] = useState(1)
  const [xpPage, setXpPage] = useState(1)
  const [achievementPage, setAchievementPage] = useState(1)
  const [feedbackPage, setFeedbackPage] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

 useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)

        const { data } = await axios.get(
          `/api/history?page=${page}&limit=10`,
          {
            withCredentials: true,
          }
        )

        if (!data.success) {
          throw new Error(
            data.error || "Failed to load history"
          )
        }

        setResults(data.data.results || [])

        setTotalPages(
          data.data.pagination?.totalPages || 1
        )
      } catch (error) {
        console.error(
          "Failed to load history:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    void loadHistory()
  }, [page])
  const paginatedTests = useMemo(() => {
    const start = (testPage - 1) * ITEMS_PER_PAGE
    return results.slice(start, start + ITEMS_PER_PAGE)
  }, [results, testPage])
  const totalTestPages = Math.ceil(results.length / ITEMS_PER_PAGE)

  const paginatedAchievements = useMemo(() => {
    const start = (achievementPage - 1) * ITEMS_PER_PAGE
    return achievements.slice(start, start + ITEMS_PER_PAGE)
  }, [achievements, achievementPage])
  const totalAchievementPages = Math.ceil(achievements.length / ITEMS_PER_PAGE)

  const paginatedXP = useMemo(() => {
    const start = (xpPage - 1) * ITEMS_PER_PAGE
    return xpHistory.slice(start, start + ITEMS_PER_PAGE)
  }, [xpHistory, xpPage])
  const totalXpPages = Math.ceil(xpHistory.length / ITEMS_PER_PAGE)

  const paginatedFeedback = useMemo(() => {
    const start = (feedbackPage - 1) * ITEMS_PER_PAGE
    return feedbackHistory.slice(start, start + ITEMS_PER_PAGE)
  }, [feedbackHistory, feedbackPage])
  const totalFeedbackPages = Math.ceil(feedbackHistory.length / ITEMS_PER_PAGE)

  // Hero stats — derived only, no logic change to underlying data
  const totalXPEarned = useMemo(
    () =>
      xpHistory
        .filter((item) => item.xpPoints > 0)
        .reduce((sum, item) => sum + item.xpPoints, 0),
    [xpHistory]
  )

  const sections: {
    key: SectionKey
    label: string
    icon: typeof FileText
    count: number
  }[] = [
    { key: "tests", label: "Tests", icon: FileText, count: results.length },
    { key: "xp", label: "XP", icon: Star, count: xpHistory.length },
    { key: "achievements", label: "Achievements", icon: Award, count: achievements.length },
    { key: "feedback", label: "Feedback", icon: MessageSquareText, count: feedbackHistory.length },
  ]

  const buildResultHref = (item: ResultHistoryItem) => {
    const slug = item.testId?.categoryId?.slug
    const subSlug = item.testId?.subcategory?.slug

    if (slug && subSlug) {
      return `/results?resultId=${item._id}`
    }

    return `/results?resultId=${item._id}`
  }

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-300" style={{ color: "var(--foreground)" }}>
      <div className="mx-auto max-w-6xl px-4 pt-2 pb-16 sm:px-6 md:pt-10 lg:px-8">
        {/* ============ HERO ============ */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl p-2 border"
              style={{ borderColor: "rgba(16,185,129,0.35)", backgroundColor: "rgba(16,185,129,0.1)" }}
            >
              <Activity className="h-5.5 w-5.5 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Activity History
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Review your recent test performance, earned achievements, and
                XP history.
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard icon={FileText} label="Total Tests complete" value={results.length} accent="#10B981" />
            <StatCard icon={Zap} label="Total XP Earned" value={totalXPEarned.toLocaleString()} accent="#8B5CF6" />
            <StatCard icon={Award} label="All Achievements" value={achievements.length} accent="#F59E0B" />
            <StatCard icon={MessageSquareText} label="Feedback Submitted" value={feedbackHistory.length} accent="#10B981" />
          </div>
        </div>

        {/* ============ SECTION NAV ============ */}
        <div className="scrollbar-none mb-6 grid grid-cols-2 lg:grid-cols-4 gap-2.5 overflow-x-auto pb-1 pt-1">
          {sections.map((s) => {
            const active = section === s.key
            return (
              <button 
                key={s.key}
                onClick={() => setSection(s.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl border px-2 py-3 text-xs lg:text-sm font-semibold transition-all duration-200",
                  active
                    ? "border-transparent bg-linear-to-br from-[#10B981] to-[#0d9c6f] text-[#09090B] shadow-lg shadow-emerald-500/20"
                    : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-border hover:text-foreground"
                )}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-black/15 text-[#09090B]" : "bg-muted text-muted-foreground"
                  )}
                >
                  {s.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ============ CONTENT ============ */}
        {loading ? (
          <SkeletonCards count={5} />
        ) : error ? (
          <div
            className="flex items-center gap-3 rounded-2xl border p-6"
            style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)" }}
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-[#EF4444]" />
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        ) : (
          <Card className="border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
            <CardContent className="p-4 sm:p-6">
              {/* ---------- TESTS ---------- */}
              {section === "tests" && (
                <>
                  <h2 className="mb-4 text-base font-bold sm:text-lg">Test History</h2>
                  {paginatedTests.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="No Tests Yet"
                      description="Take your first aptitude test to begin tracking your progress."
                      ctaLabel="Browse tests"
                      ctaHref="/dashboard/tests"
                    />
                  ) : (
                    <div className="space-y-3">
                      {paginatedTests.map((item) => {
                        const style = TEST_STATUS_STYLES[item.status] || TEST_STATUS_STYLES.abandoned
                        return (
                          <div
                            key={item._id}
                            className="group rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                                  {item.testName}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {formatDate(item.submittedAt)} · {item.attemptedQuestions}/
                                  {item.totalQuestions} attempted
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-5 sm:justify-end">
                                <div className="text-right">
                                  <div className="text-base font-bold sm:text-lg">
                                    {item.marksObtained}/{item.totalMarks}
                                  </div>
                                  <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                                    Score
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-base font-bold text-[#10B981] sm:text-lg">
                                    {item.accuracy}%
                                  </div>
                                  <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                                    Accuracy
                                  </div>
                                </div>
                                <Badge
                                  className="border font-semibold capitalize"
                                  style={{ color: style.color, borderColor: style.border, backgroundColor: style.bg }}
                                >
                                  {item.status.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <Button asChild className="bg-[#10B981] text-[#09090B] hover:bg-[#10B981]/90">
                                <Link href={buildResultHref(item)}>
                                  View result
                                </Link>
                              </Button>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full transition-[width] duration-700 ease-out"
                                style={{
                                  width: `${Math.min(100, Math.max(0, item.accuracy))}%`,
                                  backgroundColor: style.progress,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <Pagination
                    currentPage={testPage}
                    totalPages={totalTestPages}
                    totalItems={results.length}
                    onPageChange={setTestPage}
                  />
                </>
              )}

              {/* ---------- XP TIMELINE ---------- */}
              {section === "xp" && (
                <>
                  <h2 className="mb-4 text-base font-bold sm:text-lg">XP History</h2>
                  {paginatedXP.length === 0 ? (
                    <EmptyState
                      icon={Zap}
                      title="No XP Yet"
                      description="Complete tests and unlock achievements to start earning XP."
                    />
                  ) : (
                    <div className="relative space-y-0">
                      {paginatedXP.map((item, idx) => {
                        const positive = item.xpPoints > 0
                        const isLast = idx === paginatedXP.length - 1
                        return (
                          <div key={item._id} className="relative flex gap-4 pb-6 last:pb-0">
                            {/* Timeline rail */}
                            <div className="relative flex flex-col items-center">
                              <span
                                className="z-10 flex h-3 w-3 shrink-0 rounded-full ring-4"
                                style={{
                                  backgroundColor: positive ? "#10B981" : "#EF4444",
                                  boxShadow: `0 0 0 4px ${positive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}`,
                                }}
                              />
                              {!isLast && (
                                <span className="mt-1 w-px flex-1" style={{ backgroundColor: "#1F2937" }} />
                              )}
                            </div>

                            <div className="flex flex-1 items-center justify-between gap-3 pt-[-2px]">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {sourceLabels[item.sourceType] || item.sourceType}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                              <span
                                className="shrink-0 text-base font-bold"
                                style={{ color: positive ? "#10B981" : "#EF4444" }}
                              >
                                {positive ? `+${item.xpPoints}` : item.xpPoints} XP
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <Pagination
                    currentPage={xpPage}
                    totalPages={totalXpPages}
                    totalItems={xpHistory.length}
                    onPageChange={setXpPage}
                  />
                </>
              )}

              {/* ---------- ACHIEVEMENTS ---------- */}
              {section === "achievements" && (
                <>
                  <h2 className="mb-4 text-base font-bold sm:text-lg">Achievement History</h2>
                  {paginatedAchievements.length === 0 ? (
                    <EmptyState
                      icon={Trophy}
                      title="No Achievements Yet"
                      description="Keep practicing — achievements unlock automatically as you hit milestones."
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                      {paginatedAchievements.map((item) => (
                        <div
                          key={item._id}
                          className="group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                          style={{ borderColor: "rgba(245,158,11,0.25)", backgroundColor: "rgba(245,158,11,0.05)" }}
                        >
                          <div
                            className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-100"
                            style={{ backgroundColor: "rgba(245,158,11,0.25)" }}
                          />
                          <div className="relative flex items-start gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                              style={{ borderColor: "rgba(245,158,11,0.35)", backgroundColor: "rgba(245,158,11,0.12)" }}
                            >
                              <Trophy className="h-5 w-5 text-[#F59E0B]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {item.achievementId.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {formatDate(item.unlockedAt)}
                              </p>
                              <span className="mt-2 inline-block text-sm font-bold text-[#F59E0B]">
                                +{item.achievementId.pointsReward} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Pagination
                    currentPage={achievementPage}
                    totalPages={totalAchievementPages}
                    totalItems={achievements.length}
                    onPageChange={setAchievementPage}
                  />
                </>
              )}

              {/* ---------- FEEDBACK ---------- */}
              {section === "feedback" && (
                <>
                  <h2 className="mb-4 text-base font-bold sm:text-lg">Feedback History</h2>
                  {paginatedFeedback.length === 0 ? (
                    <EmptyState
                      icon={MessageSquareText}
                      title="No Feedback Yet"
                      description="Share your thoughts to help us improve AptiCore."
                      ctaLabel="Send feedback"
                      ctaHref="/dashboard/feedback"
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      {paginatedFeedback.map((item) => {
                        const style = FEEDBACK_STATUS_STYLES[item.status]
                        return (
                          <div
                            key={item._id}
                            className="flex flex-col rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3.5 w-3.5"
                                    style={{
                                      color: "#F59E0B",
                                      fill: item.rating && i < item.rating ? "#F59E0B" : "transparent",
                                    }}
                                  />
                                ))}
                              </div>
                              <Badge
                                className="border text-[10px] font-semibold tracking-wide uppercase"
                                style={{ color: style.color, borderColor: style.border, backgroundColor: style.bg }}
                              >
                                {style.label}
                              </Badge>
                            </div>

                            {item.title && (
                              <p className="mt-3 text-sm font-semibold text-foreground">
                                {item.title}
                              </p>
                            )}
                            <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-muted-foreground">
                              {item.content}
                            </p>

                            <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground" style={{ borderColor: "var(--border)" }}>
                              <span className="capitalize">{item.feedbackType} · {item.targetType}</span>
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <Pagination
                    currentPage={feedbackPage}
                    totalPages={totalFeedbackPages}
                    totalItems={feedbackHistory.length}
                    onPageChange={setFeedbackPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
