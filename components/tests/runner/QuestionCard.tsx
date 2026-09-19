import {
  OPTION_KEYS,
  difficultyPillClass,
  type TestQuestion,
} from "./types"

interface QuestionCardProps {
  question: TestQuestion
  currentIndex: number
  totalQuestions: number
  negativeMarking: number
  currentAnswer: string | string[] | undefined
  isBookmarked: boolean
  isMarkedForReview: boolean
  submitted: boolean
  onOptionChange: (
    questionId: string,
    optionValue: string,
    multiple?: boolean
  ) => void
  onToggleBookmark: (questionId: string) => void
  onToggleMarkForReview: (questionId: string) => void
  onPrev: () => void
  onNext: () => void
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  negativeMarking,
  currentAnswer,
  isBookmarked,
  isMarkedForReview,
  submitted,
  onOptionChange,
  onToggleBookmark,
  onToggleMarkForReview,
  onPrev,
  onNext,
}: QuestionCardProps) {
  const isMultiple = question.questionType === "msq"
  const defaultOptions = question.options?.length
    ? question.options
    : question.questionType === "true_false"
      ? [
          { order: 1, text: "True" },
          { order: 2, text: "False" },
        ]
      : []

  const needsTextInput = ["fill_blank", "numerical", "coding"].includes(
    question.questionType
  )

  return (
    <div className="overflow-y-auto px-4 py-5 pb-28 sm:px-6 sm:py-7 lg:px-10 lg:pb-24">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2 font-[JetBrains_Mono,monospace] text-[11px] text-slate-500 dark:text-[#5b6577] sm:gap-2.5 sm:text-xs">
          <span>
            QUESTION{" "}
            <b className="text-slate-900 dark:text-[#e7ecf3]">
              {String(currentIndex + 1).padStart(2, "0")}
            </b>{" "}
            / {totalQuestions}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider uppercase ${difficultyPillClass(
              question.difficultyLevel
            )}`}
          >
            {question.difficultyLevel}
          </span>
          <span className="rounded-full border border-[rgba(139,124,246,0.35)] px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider text-[#8b7cf6] uppercase">
            +{question.marks} mark{question.marks === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {negativeMarking > 0 && (
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(242,85,90,0.25)] bg-[rgba(242,85,90,0.08)] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#f2555a]">
          ⚠ Wrong answer deducts {negativeMarking} marks
        </div>
      )}

      <h2 className="mb-6 max-w-160 font-[Space_Grotesk,sans-serif] text-[18px] leading-normal font-semibold sm:text-[21px]">
        {currentIndex + 1}. {question.questionText}
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
                key={`${question._id}-${option.order}`}
                className={`flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-4 py-3.75 transition-all duration-150 ${
                  checked
                    ? "border-[#6ee7c9] bg-[rgba(110,231,201,0.07)]"
                    : "border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] hover:border-slate-300 hover:bg-slate-50"
                } ${submitted ? "pointer-events-none opacity-70" : ""}`}
              >
                <span
                  className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[7px] border font-[JetBrains_Mono,monospace] text-[11px] ${
                    checked
                      ? "border-[#6ee7c9] bg-[rgba(110,231,201,0.12)] text-[#6ee7c9]"
                      : "border-slate-200 dark:border-[#212a37] text-slate-500 dark:text-[#5b6577]"
                  }`}
                >
                  {OPTION_KEYS[index] || "?"}
                </span>
                <span className="text-[14.5px]">{option.text}</span>
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={`question-${question._id}`}
                  checked={checked}
                  value={value}
                  onChange={() =>
                    onOptionChange(question._id, value, isMultiple)
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
              onOptionChange(question._id, event.target.value, false)
            }
            disabled={submitted}
            placeholder="Type your answer here..."
            rows={4}
            className="w-full resize-y rounded-[10px] border border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] px-4 py-3 text-sm text-slate-900 dark:text-[#e7ecf3] transition outline-none focus:border-[#6ee7c9] disabled:opacity-60"
          />
        ) : (
          <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] p-4 text-sm text-slate-600 dark:text-[#8a96a8]">
            This question type requires a written response.
          </div>
        )}
      </div>

      <div className="mt-7 flex max-w-155 flex-wrap items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => onToggleBookmark(question._id)}
          disabled={submitted}
          className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold transition disabled:opacity-35 sm:px-4 sm:text-[13px] ${
            isBookmarked
              ? "border-[rgba(245,166,35,0.4)] bg-[rgba(245,166,35,0.08)] text-[#f5a623]"
              : "border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] text-slate-600 dark:text-[#8a96a8] hover:border-slate-300 hover:text-slate-900"
          }`}
        >
          {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
        <button
          type="button"
          onClick={() => onToggleMarkForReview(question._id)}
          disabled={submitted}
          className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold transition disabled:opacity-35 sm:px-4 sm:text-[13px] ${
            isMarkedForReview
              ? "border-[rgba(139,124,246,0.4)] bg-[rgba(139,124,246,0.08)] text-[#8b7cf6]"
              : "border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] text-slate-600 dark:text-[#8a96a8] hover:border-slate-300 hover:text-slate-900"
          }`}
        >
          {isMarkedForReview ? "✓ Marked for Review" : "Mark for Review"}
        </button>
        <div className="hidden flex-1 sm:block" />
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0 || submitted}
          className="rounded-lg border border-slate-200 dark:border-[#212a37] bg-transparent px-3.5 py-2.5 text-[12.5px] font-semibold text-slate-600 dark:text-[#8a96a8] transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 sm:px-4 sm:text-[13px]"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={submitted}
          className="rounded-lg border border-[#6ee7c9] bg-[#6ee7c9] px-3.5 py-2.5 text-[12.5px] font-semibold text-[#08150f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 sm:px-4 sm:text-[13px]"
        >
          {currentIndex === totalQuestions - 1 ? "Finish →" : "Next →"}
        </button>
      </div>

      {submitted && question.explanation && (
        <div className="mt-8 max-w-155 rounded-[10px] border border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] p-5">
          <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-base font-semibold">
            Explanation
          </h3>
          <p className="text-sm leading-7 text-slate-600 dark:text-[#8a96a8]">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
