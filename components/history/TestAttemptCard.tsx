import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Target,
} from "lucide-react"

export interface TestAttemptItem {
  _id: string
  testName: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers?: number
  skippedQuestions?: number
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

interface TestAttemptCardProps {
  item: TestAttemptItem
}

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

export function TestAttemptCard({ item }: TestAttemptCardProps) {
  const acc = Math.round(item.accuracy || 0)

  // Color schemes based on score performance
  const isHigh = acc >= 75
  const isMedium = acc >= 50

  const accBadgeClass = isHigh
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
    : isMedium
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"

  const progressGradient = isHigh
    ? "from-[#6ee7c9] to-[#3ecf8e]"
    : isMedium
      ? "from-[#f5a623] to-[#eab308]"
      : "from-[#f2555a] to-[#e11d48]"

  const resultHref = `/results?resultId=${item._id}`
  const categoryName =
    item.testId?.subcategory?.name ||
    item.testId?.categoryId?.name ||
    "Practice Test"

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-4.5 sm:p-5.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-md">
      {/* Top row: Category tag + status indicator */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-teal-500/10 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold text-teal-600 dark:text-teal-300">
          <FileCheck className="h-3 w-3" />
          {categoryName}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      </div>

      {/* Main Title & timestamp */}
      <div className="mt-3">
        <h3 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-[--ac-text] leading-snug">
          {item.testName || "Comprehensive Aptitude Test"}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[--ac-text-3]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(item.submittedAt || item.createdAt)}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(item.timeSpentSeconds)}
          </span>
        </div>
      </div>

      {/* ================= MOBILE-FIRST METRICS TILES ================= */}
      <div className="mt-3.5 grid grid-cols-3 gap-2 rounded-xl border border-black/5 dark:border-white/5 bg-slate-50/70 dark:bg-white/2 p-2.5 sm:hidden">
        {/* Metric 1: Score */}
        <div className="text-center">
          <div className="text-[10px] uppercase font-semibold text-[--ac-text-3]">
            Score
          </div>
          <div className="mt-0.5 font-[Space_Grotesk,sans-serif] text-sm font-bold text-[--ac-text]">
            {item.marksObtained}
            <span className="text-[10px] font-normal text-[--ac-text-3]">
              /{item.totalMarks}
            </span>
          </div>
        </div>

        {/* Metric 2: Accuracy */}
        <div className="text-center border-x border-black/5 dark:border-white/5">
          <div className="text-[10px] uppercase font-semibold text-[--ac-text-3]">
            Accuracy
          </div>
          <div
            className={`mt-0.5 inline-block rounded-full px-2 py-0.2 font-[JetBrains_Mono,monospace] text-xs font-bold ${accBadgeClass}`}
          >
            {acc}%
          </div>
        </div>

        {/* Metric 3: Answered */}
        <div className="text-center">
          <div className="text-[10px] uppercase font-semibold text-[--ac-text-3]">
            Answered
          </div>
          <div className="mt-0.5 font-[Space_Grotesk,sans-serif] text-sm font-bold text-[--ac-text]">
            {item.attemptedQuestions}
            <span className="text-[10px] font-normal text-[--ac-text-3]">
              /{item.totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP INLINE METRICS ROW ================= */}
      <div className="mt-4 hidden items-center justify-between sm:flex border-t border-black/5 dark:border-white/5 pt-3">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
              Score
            </div>
            <div className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
              {item.marksObtained}
              <span className="text-xs font-normal text-[--ac-text-3]">
                /{item.totalMarks} marks
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
              Accuracy
            </div>
            <div
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-xs font-bold ${accBadgeClass}`}
            >
              <Target className="h-3 w-3" />
              {acc}%
            </div>
          </div>

          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
              Coverage
            </div>
            <div className="font-[Space_Grotesk,sans-serif] text-sm font-semibold text-[--ac-text]">
              {item.attemptedQuestions} of {item.totalQuestions} questions
            </div>
          </div>
        </div>

        <Link href={resultHref}>
          <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-bold text-teal-600 dark:text-teal-300 transition hover:bg-teal-500 hover:text-black">
            <span>Review Answers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        <div
          className={`h-full rounded-full bg-linear-to-r ${progressGradient} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, acc))}%` }}
        />
      </div>

      {/* ================= MOBILE BOTTOM ACTION BUTTON ================= */}
      <div className="mt-3.5 sm:hidden">
        <Link href={resultHref} className="block w-full">
          <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-500/10 border border-teal-500/30 py-2.5 text-xs font-bold text-teal-600 dark:text-teal-300 transition hover:bg-teal-500 hover:text-black">
            <span>Review Test & Solutions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    </div>
  )
}
