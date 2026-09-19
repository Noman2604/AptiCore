interface SubmitConfirmModalProps {
  isOpen: boolean
  answeredCount: number
  reviewCount: number
  skippedCount: number
  onClose: () => void
  onConfirm: () => void
}

export function SubmitConfirmModal({
  isOpen,
  answeredCount,
  reviewCount,
  skippedCount,
  onClose,
  onConfirm,
}: SubmitConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-100 rounded-t-2xl border border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:p-6"
      >
        <h3 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-slate-900 dark:text-[#e7ecf3]">
          Submit test?
        </h3>
        <p className="mt-1.5 text-[13px] leading-6 text-slate-600 dark:text-[#8a96a8]">
          Once submitted, you won't be able to change your answers. Please review
          your summary below.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-[10px] border border-slate-200 dark:border-[#212a37] bg-slate-50 dark:bg-[#141b25] px-3 py-2.5 text-center">
            <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#3ecf8e]">
              {answeredCount}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
              Answered
            </div>
          </div>
          <div className="rounded-[10px] border border-slate-200 dark:border-[#212a37] bg-slate-50 dark:bg-[#141b25] px-3 py-2.5 text-center">
            <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#8b7cf6]">
              {reviewCount}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
              Review
            </div>
          </div>
          <div className="rounded-[10px] border border-slate-200 dark:border-[#212a37] bg-slate-50 dark:bg-[#141b25] px-3 py-2.5 text-center">
            <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#f2555a]">
              {skippedCount}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 dark:text-[#5b6577] uppercase">
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
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 dark:border-[#212a37] bg-transparent py-2.75 text-[13.5px] font-semibold text-slate-600 dark:text-[#8a96a8] transition hover:border-slate-300 hover:text-slate-900"
          >
            Keep Reviewing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-2.75 text-[13.5px] font-bold text-[#06120d] transition hover:brightness-105"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  )
}
