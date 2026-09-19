import {
  RING_CIRCUMFERENCE,
  formatTimer,
  isQuestionAnswered,
  type TestQuestion,
} from "./types"

interface QuestionPaletteProps {
  questions: TestQuestion[]
  currentIndex: number
  selectedAnswers: Record<string, string | string[]>
  bookmarkedQuestions: Set<string>
  markedForReview: Set<string>
  remainingSeconds: number
  totalSeconds: number
  answeredCount: number
  reviewCount: number
  skippedCount: number
  submitted: boolean
  isPaletteOpen: boolean
  onClosePalette: () => void
  onSelectQuestion: (index: number) => void
  onRequestSubmit: () => void
}

export function QuestionPalette({
  questions,
  currentIndex,
  selectedAnswers,
  bookmarkedQuestions,
  markedForReview,
  remainingSeconds,
  totalSeconds,
  answeredCount,
  reviewCount,
  skippedCount,
  submitted,
  isPaletteOpen,
  onClosePalette,
  onSelectQuestion,
  onRequestSubmit,
}: QuestionPaletteProps) {
  const timerPct = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0
  const ringOffset = RING_CIRCUMFERENCE * (1 - timerPct)
  const ringColor =
    remainingSeconds < 60
      ? "#f2555a"
      : remainingSeconds < 5 * 60
        ? "#f5a623"
        : "#6ee7c9"

  return (
    <>
      {/* Sidebar (desktop: static column, mobile: slide-up drawer) */}
      <aside
        className={`fixed inset-x-0 bottom-0 z-40 flex max-h-[80vh] flex-col overflow-hidden rounded-t-2xl border-t border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:max-h-none lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-none ${
          isPaletteOpen
            ? "translate-y-0"
            : "translate-y-full lg:translate-y-0"
        }`}
      >
        {/* Mobile drag handle */}
        <button
          type="button"
          onClick={onClosePalette}
          className="flex h-6 shrink-0 items-center justify-center lg:hidden"
          aria-label="Close palette"
        >
          <span className="h-1 w-10 rounded-full bg-slate-300 dark:bg-[#2a3444]" />
        </button>

        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-[#212a37] p-4 sm:p-5">
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
            <div className="absolute inset-0 flex items-center justify-center font-[JetBrains_Mono,monospace] text-[9px] text-slate-500 dark:text-[#5b6577]">
              MIN
            </div>
          </div>
          <div>
            <div className="font-[JetBrains_Mono,monospace] text-xl font-bold tracking-tight sm:text-2xl">
              {formatTimer(remainingSeconds)}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-[#5b6577]">
              time remaining
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 border-b border-slate-200 dark:border-[#212a37] px-4 py-4 sm:px-5">
          <div className="flex-1">
            <div className="font-[Space_Grotesk,sans-serif] text-[18px] font-bold text-[#3ecf8e] sm:text-[19px]">
              {answeredCount}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
              Answered
            </div>
          </div>
          <div className="flex-1">
            <div className="font-[Space_Grotesk,sans-serif] text-[18px] font-bold text-[#8b7cf6] sm:text-[19px]">
              {reviewCount}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
              Review
            </div>
          </div>
          <div className="flex-1">
            <div className="font-[Space_Grotesk,sans-serif] text-[18px] font-bold text-slate-600 dark:text-[#8a96a8] sm:text-[19px]">
              {skippedCount}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
              Skipped
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-[JetBrains_Mono,monospace] text-[11px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
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
                  onClick={() => onSelectQuestion(index)}
                  className={`relative flex aspect-square items-center justify-center rounded-[7px] border font-[JetBrains_Mono,monospace] text-[11px] transition ${
                    isCurrent
                      ? "border-[#e7ecf3] text-slate-900 dark:text-[#e7ecf3] shadow-[inset_0_0_0_1px_#e7ecf3]"
                      : answered
                        ? "border-[rgba(62,207,142,0.4)] bg-[rgba(62,207,142,0.1)] text-[#3ecf8e]"
                        : isReview
                          ? "border-[rgba(139,124,246,0.4)] bg-[rgba(139,124,246,0.1)] text-[#8b7cf6]"
                          : "border-slate-200 dark:border-[#212a37] bg-slate-50 dark:bg-[#141b25] text-slate-600 dark:text-[#8a96a8]"
                  } ${
                    isReview && !isCurrent
                      ? "after:absolute after:-top-0.75 after:-right-0.75 after:h-2 after:w-2 after:rounded-full after:border-[1.5px] after:border-[#10151d] after:bg-[#8b7cf6]"
                      : ""
                  } ${
                    isBookmarked
                      ? "before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:text-[8px] before:text-[#f5a623] before:content-['★']"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2.5 font-[JetBrains_Mono,monospace] text-[10px] text-slate-500 dark:text-[#5b6577]">
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-sm bg-[rgba(62,207,142,0.4)]" />
              Answered
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-sm bg-[rgba(139,124,246,0.4)]" />
              For Review
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-sm border border-slate-200 dark:border-[#212a37] bg-slate-50 dark:bg-[#141b25]" />
              Skipped
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-[#212a37] p-4 sm:p-4.5">
          <button
            type="button"
            onClick={onRequestSubmit}
            disabled={submitted}
            className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-3 font-[Space_Grotesk,sans-serif] text-sm font-bold text-[#06120d] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitted ? "Submitted ✓" : "Submit Test →"}
          </button>
          <p className="mt-2 text-center font-[JetBrains_Mono,monospace] text-[10.5px] text-slate-500 dark:text-[#5b6577]">
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
          onClick={onClosePalette}
        />
      )}
    </>
  )
}
