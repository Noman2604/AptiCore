"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Flame,
  Inbox,
  MessageSquareText,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react"
import axios from "axios"
import { TestAttemptCard } from "@/components/history/TestAttemptCard"

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
  createdAt?: string
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
    rarity?: string
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

interface HistoryResponse {
  results: ResultHistoryItem[]
  xpHistory: XpHistoryItem[]
  achievements: AchievementHistoryItem[]
  feedback: FeedbackHistoryItem[]
  pagination?: {
    page: number
    limit: number
    totalResults: number
    totalXpEntries: number
    totalAchievements: number
    totalFeedback: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

type SectionKey = "tests" | "xp" | "achievements" | "feedback"

const SOURCE_LABELS: Record<
  string,
  { label: string; icon: typeof Zap; color: string; bg: string }
> = {
  achievement: {
    label: "Achievement",
    icon: Award,
    color: "#f5a623",
    bg: "rgba(245,166,35,0.1)",
  },
  test_completion: {
    label: "Test Completion",
    icon: BookOpen,
    color: "#3ecf8e",
    bg: "rgba(62,207,142,0.1)",
  },
  correct_answer: {
    label: "Correct Answer",
    icon: CheckCircle2,
    color: "#6ee7c9",
    bg: "rgba(110,231,201,0.1)",
  },
  streak: {
    label: "Streak Bonus",
    icon: Flame,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
  bonus: {
    label: "Bonus XP",
    icon: Zap,
    color: "#8b7cf6",
    bg: "rgba(139,124,246,0.1)",
  },
}

const FEEDBACK_STATUS_STYLES: Record<
  FeedbackHistoryItem["status"],
  { color: string; bg: string; border: string; label: string }
> = {
  pending: {
    color: "#f5a623",
    bg: "rgba(245,166,35,0.1)",
    border: "rgba(245,166,35,0.3)",
    label: "Pending Review",
  },
  resolved: {
    color: "#3ecf8e",
    bg: "rgba(62,207,142,0.1)",
    border: "rgba(62,207,142,0.3)",
    label: "Resolved",
  },
  hidden: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.3)",
    label: "Archived",
  },
  published: {
    color: "#3ecf8e",
    bg: "rgba(62,207,142,0.1)",
    border: "rgba(62,207,142,0.3)",
    label: "Published",
  },
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

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "< 1 min"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs}s`
}

export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSection = (searchParams.get("tab") as SectionKey) || "tests"

  const [section, setSection] = useState<SectionKey>(initialSection)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [results, setResults] = useState<ResultHistoryItem[]>([])
  const [xpHistory, setXpHistory] = useState<XpHistoryItem[]>([])
  const [achievements, setAchievements] = useState<AchievementHistoryItem[]>([])
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistoryItem[]>(
    []
  )

  const [testPage, setTestPage] = useState(1)
  const [xpPage, setXpPage] = useState(1)
  const [achievementPage, setAchievementPage] = useState(1)
  const [feedbackPage, setFeedbackPage] = useState(1)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data } = await axios.get("/api/dashboard/history?limit=100", {
          withCredentials: true,
        })

        if (!data.success) {
          throw new Error(data.error || "Failed to load history")
        }

        const history: HistoryResponse = data.data || {}
        // Filter only valid completed results with marks
        const validResults = (history.results || []).filter(
          (r) =>
            r.status === "completed" && (r.totalMarks ? r.totalMarks > 0 : true)
        )

        setResults(validResults)
        setXpHistory(history.xpHistory || [])
        setAchievements(history.achievements || [])
        setFeedbackHistory(history.feedback || [])
      } catch (err) {
        console.error("Failed to load history:", err)
        setError(err instanceof Error ? err.message : "Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    void loadHistory()
  }, [])

  // Derived summaries
  const totalXPEarned = useMemo(
    () =>
      xpHistory
        .filter((item) => item.xpPoints > 0)
        .reduce((sum, item) => sum + item.xpPoints, 0),
    [xpHistory]
  )

  const averageAccuracy = useMemo(() => {
    if (results.length === 0) return 0
    return Math.round(
      results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / results.length
    )
  }, [results])

  // Pagination slicing
  const paginatedTests = useMemo(() => {
    const start = (testPage - 1) * ITEMS_PER_PAGE
    return results.slice(start, start + ITEMS_PER_PAGE)
  }, [results, testPage])
  const totalTestPages = Math.ceil(results.length / ITEMS_PER_PAGE)

  const paginatedXP = useMemo(() => {
    const start = (xpPage - 1) * ITEMS_PER_PAGE
    return xpHistory.slice(start, start + ITEMS_PER_PAGE)
  }, [xpHistory, xpPage])
  const totalXpPages = Math.ceil(xpHistory.length / ITEMS_PER_PAGE)

  const paginatedAchievements = useMemo(() => {
    const start = (achievementPage - 1) * ITEMS_PER_PAGE
    return achievements.slice(start, start + ITEMS_PER_PAGE)
  }, [achievements, achievementPage])
  const totalAchievementPages = Math.ceil(achievements.length / ITEMS_PER_PAGE)

  const paginatedFeedback = useMemo(() => {
    const start = (feedbackPage - 1) * ITEMS_PER_PAGE
    return feedbackHistory.slice(start, start + ITEMS_PER_PAGE)
  }, [feedbackHistory, feedbackPage])
  const totalFeedbackPages = Math.ceil(feedbackHistory.length / ITEMS_PER_PAGE)

  const sections: {
    key: SectionKey
    label: string
    icon: typeof FileText
    count: number
  }[] = [
    {
      key: "tests",
      label: "Test Attempts",
      icon: FileText,
      count: results.length,
    },
    { key: "xp", label: "XP Velocity", icon: Zap, count: xpHistory.length },
    {
      key: "achievements",
      label: "Badges Earned",
      icon: Award,
      count: achievements.length,
    },
    {
      key: "feedback",
      label: "Feedback & Notes",
      icon: MessageSquareText,
      count: feedbackHistory.length,
    },
  ]

  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ================= HERO BANNER ================= */}
        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-linear-to-br from-teal-500/10 via-purple-500/5 to-amber-500/10 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-white/10">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300">
                <Activity className="h-3.5 w-3.5" />
                <span>Performance Ledger</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold tracking-tight text-[--ac-text] sm:text-4xl">
                Activity & Test History
              </h1>
              <p className="text-sm leading-relaxed text-[--ac-text-3]">
                Inspect your complete evaluation audit log, question precision
                breakdowns, accumulated XP points, and unlocked milestones.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/tests">
                <button className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-black shadow-sm transition hover:bg-teal-400">
                  Take Practice Test →
                </button>
              </Link>
              <Link href="/dashboard/analytics">
                <button className="cursor-pointer rounded-lg border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-[--ac-text] transition hover:border-black/25 dark:border-white/10 dark:bg-[#10151d] dark:hover:border-white/25">
                  Analytics Hub
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= 4 KEY KPI METRICS ================= */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: Completed Tests */}
          <div className="rounded-xl border border-black/10 bg-white p-4.5 shadow-sm transition hover:border-teal-500/40 dark:border-white/10 dark:bg-[#10151d]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Total Tests Evaluated
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[--ac-text] sm:text-3xl">
              {results.length}
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              Full syllabus tests submitted
            </p>
          </div>

          {/* Card 2: Average Accuracy */}
          <div className="rounded-xl border border-black/10 bg-white p-4.5 shadow-sm transition hover:border-emerald-500/40 dark:border-white/10 dark:bg-[#10151d]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Lifetime Accuracy
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-emerald-600 sm:text-3xl dark:text-emerald-400">
              {averageAccuracy}%
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              Across all completed sessions
            </p>
          </div>

          {/* Card 3: Total XP */}
          <div className="rounded-xl border border-black/10 bg-white p-4.5 shadow-sm transition hover:border-purple-500/40 dark:border-white/10 dark:bg-[#10151d]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Total XP Earned
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-purple-600 sm:text-3xl dark:text-purple-300">
              +{totalXPEarned.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              From tests, streaks, and bonuses
            </p>
          </div>

          {/* Card 4: Milestones */}
          <div className="rounded-xl border border-black/10 bg-white p-4.5 shadow-sm transition hover:border-amber-500/40 dark:border-white/10 dark:bg-[#10151d]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[--ac-text-3]">
                Badges Unlocked
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-amber-600 sm:text-3xl dark:text-amber-400">
              {achievements.length}
            </div>
            <p className="mt-1 text-[11px] text-[--ac-text-3]">
              Recognized placement achievements
            </p>
          </div>
        </div>

        {/* ================= SECTION TABS ================= */}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-black/10 bg-white p-1.5 shadow-sm sm:grid-cols-4 dark:border-white/10 dark:bg-[#10151d]">
          {sections.map((s) => {
            const active = section === s.key
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? "border border-teal-500/30 bg-teal-500/15 text-teal-600 shadow-xs dark:text-teal-300"
                    : "border border-transparent text-[--ac-text-3] hover:bg-slate-100 hover:text-[--ac-text] dark:hover:bg-white/5"
                }`}
              >
                <s.icon className="h-4 w-4 shrink-0" />
                <span>{s.label}</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? "bg-teal-500/25 text-teal-700 dark:text-teal-200"
                      : "bg-slate-200 text-[--ac-text-3] dark:bg-white/10"
                  }`}
                >
                  {s.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ================= CONTENT PANEL ================= */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-[#10151d]">
          {loading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex animate-pulse items-center justify-between rounded-xl border border-black/5 p-4 dark:border-white/5"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-48 rounded bg-slate-200 dark:bg-white/10" />
                    <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-white/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          ) : (
            <>
              {/* ---------- TAB 1: TESTS ---------- */}
              {section === "tests" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text] sm:text-lg">
                        Completed Test Sessions
                      </h2>
                      <p className="text-xs text-[--ac-text-3]">
                        Detailed record of your aptitude test evaluations
                      </p>
                    </div>
                    <span className="text-xs text-[--ac-text-3]">
                      Showing {paginatedTests.length} of {results.length}{" "}
                      attempts
                    </span>
                  </div>

                  {paginatedTests.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                      <FileText className="mx-auto mb-3 h-10 w-10 text-[--ac-text-3]" />
                      <h3 className="font-semibold text-[--ac-text]">
                        No test attempts recorded yet
                      </h3>
                      <p className="mt-1 text-xs text-[--ac-text-3]">
                        Attempt your first timed aptitude mock test to track
                        your performance trajectory.
                      </p>
                      <Link href="/dashboard/tests">
                        <button className="mt-4 cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-teal-400">
                          Browse Practice Tests
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paginatedTests.map((item) => (
                        <TestAttemptCard key={item._id} item={item} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalTestPages > 1 && (
                    <div className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                      <span className="text-xs text-[--ac-text-3]">
                        Page {testPage} of {totalTestPages}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={testPage === 1}
                          onClick={() => setTestPage((p) => Math.max(1, p - 1))}
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          disabled={testPage === totalTestPages}
                          onClick={() =>
                            setTestPage((p) => Math.min(totalTestPages, p + 1))
                          }
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------- TAB 2: XP TIMELINE ---------- */}
              {section === "xp" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text] sm:text-lg">
                        XP Reward Velocity
                      </h2>
                      <p className="text-xs text-[--ac-text-3]">
                        Chronological stream of experience points gained across
                        activities
                      </p>
                    </div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                      +{totalXPEarned.toLocaleString()} Lifetime XP
                    </span>
                  </div>

                  {paginatedXP.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                      <Zap className="mx-auto mb-3 h-10 w-10 text-[--ac-text-3]" />
                      <h3 className="font-semibold text-[--ac-text]">
                        No XP events recorded
                      </h3>
                      <p className="mt-1 text-xs text-[--ac-text-3]">
                        Answer test questions and complete practice sessions to
                        earn XP.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {paginatedXP.map((item) => {
                        const meta = SOURCE_LABELS[item.sourceType] || {
                          label: item.sourceType.replace(/_/g, " "),
                          icon: Zap,
                          color: "#8b7cf6",
                          bg: "rgba(139,124,246,0.1)",
                        }
                        const Icon = meta.icon

                        return (
                          <div
                            key={item._id}
                            className="flex items-center justify-between rounded-xl border border-black/5 bg-slate-50/70 p-3.5 transition hover:border-black/15 dark:border-white/5 dark:bg-white/2 dark:hover:border-white/15"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg"
                                style={{
                                  backgroundColor: meta.bg,
                                  color: meta.color,
                                }}
                              >
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[--ac-text] capitalize sm:text-sm">
                                  {meta.label}
                                </p>
                                <p className="text-[11px] text-[--ac-text-3]">
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                            </div>

                            <span className="font-[JetBrains_Mono,monospace] text-sm font-bold text-purple-600 dark:text-purple-300">
                              +{item.xpPoints} XP
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalXpPages > 1 && (
                    <div className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                      <span className="text-xs text-[--ac-text-3]">
                        Page {xpPage} of {totalXpPages}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={xpPage === 1}
                          onClick={() => setXpPage((p) => Math.max(1, p - 1))}
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          disabled={xpPage === totalXpPages}
                          onClick={() =>
                            setXpPage((p) => Math.min(totalXpPages, p + 1))
                          }
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------- TAB 3: ACHIEVEMENTS ---------- */}
              {section === "achievements" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text] sm:text-lg">
                        Unlocked Milestones & Badges
                      </h2>
                      <p className="text-xs text-[--ac-text-3]">
                        Honors you have achieved during your preparation
                      </p>
                    </div>
                    <Link
                      href="/dashboard/achievements"
                      className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-300"
                    >
                      All Badges <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  {paginatedAchievements.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                      <Award className="mx-auto mb-3 h-10 w-10 text-[--ac-text-3]" />
                      <h3 className="font-semibold text-[--ac-text]">
                        No achievements unlocked yet
                      </h3>
                      <p className="mt-1 text-xs text-[--ac-text-3]">
                        Complete mock tests and build streaks to unlock
                        achievements.
                      </p>
                      <Link href="/dashboard/achievements">
                        <button className="mt-4 cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-teal-400">
                          View Available Badges
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {paginatedAchievements.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between rounded-xl border border-black/5 bg-slate-50/70 p-4 transition hover:border-black/15 dark:border-white/5 dark:bg-white/2 dark:hover:border-white/15"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
                              <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-[--ac-text] sm:text-sm">
                                {item.achievementId?.name || "Milestone"}
                              </h4>
                              <p className="text-[11px] text-[--ac-text-3]">
                                {formatDate(item.unlockedAt)}
                              </p>
                            </div>
                          </div>

                          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-xs font-bold text-purple-600 dark:text-purple-300">
                            +{item.achievementId?.pointsReward || 0} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalAchievementPages > 1 && (
                    <div className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                      <span className="text-xs text-[--ac-text-3]">
                        Page {achievementPage} of {totalAchievementPages}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={achievementPage === 1}
                          onClick={() =>
                            setAchievementPage((p) => Math.max(1, p - 1))
                          }
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          disabled={achievementPage === totalAchievementPages}
                          onClick={() =>
                            setAchievementPage((p) =>
                              Math.min(totalAchievementPages, p + 1)
                            )
                          }
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------- TAB 4: FEEDBACK ---------- */}
              {section === "feedback" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text] sm:text-lg">
                        Submitted Feedback & Reports
                      </h2>
                      <p className="text-xs text-[--ac-text-3]">
                        Status of questions reported and platform improvement
                        suggestions
                      </p>
                    </div>
                  </div>

                  {paginatedFeedback.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/10 p-12 text-center dark:border-white/10">
                      <MessageSquareText className="mx-auto mb-3 h-10 w-10 text-[--ac-text-3]" />
                      <h3 className="font-semibold text-[--ac-text]">
                        No feedback entries found
                      </h3>
                      <p className="mt-1 text-xs text-[--ac-text-3]">
                        You haven't submitted any question queries or platform
                        feedback yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paginatedFeedback.map((item) => {
                        const style =
                          FEEDBACK_STATUS_STYLES[item.status] ||
                          FEEDBACK_STATUS_STYLES.pending

                        return (
                          <div
                            key={item._id}
                            className="rounded-xl border border-black/5 bg-slate-50/70 p-4 transition hover:border-black/15 dark:border-white/5 dark:bg-white/2 dark:hover:border-white/15"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[--ac-text] capitalize">
                                    {item.title || `${item.targetType} inquiry`}
                                  </span>
                                  <span
                                    className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                                    style={{
                                      color: style.color,
                                      borderColor: style.border,
                                      backgroundColor: style.bg,
                                    }}
                                  >
                                    {style.label}
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed text-[--ac-text-3]">
                                  {item.content}
                                </p>
                              </div>

                              <span className="shrink-0 text-[11px] text-[--ac-text-3]">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalFeedbackPages > 1 && (
                    <div className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                      <span className="text-xs text-[--ac-text-3]">
                        Page {feedbackPage} of {totalFeedbackPages}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={feedbackPage === 1}
                          onClick={() =>
                            setFeedbackPage((p) => Math.max(1, p - 1))
                          }
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          disabled={feedbackPage === totalFeedbackPages}
                          onClick={() =>
                            setFeedbackPage((p) =>
                              Math.min(totalFeedbackPages, p + 1)
                            )
                          }
                          className="rounded-md border border-black/10 p-1.5 text-xs disabled:opacity-40 dark:border-white/10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
