import { formatTimer } from "./types"

interface MobileBottomBarProps {
  remainingSeconds: number
  totalSeconds: number
  answeredCount: number
  totalQuestions: number
  submitted: boolean
  onOpenPalette: () => void
  onRequestSubmit: () => void
}

export function MobileBottomBar({
  remainingSeconds,
  totalSeconds,
  answeredCount,
  totalQuestions,
  submitted,
  onOpenPalette,
  onRequestSubmit,
}: MobileBottomBarProps) {
  const ringColor =
    remainingSeconds < 60
      ? "#f2555a"
      : remainingSeconds < 5 * 60
        ? "#f5a623"
        : "#6ee7c9"

  return (
    <div className="flex shrink-0 items-center gap-2.5 border-t border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#0c1119] px-4 py-2.5 lg:hidden">
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] px-3 py-2 font-[JetBrains_Mono,monospace] text-[12px] text-slate-900 dark:text-[#e7ecf3]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: ringColor }}
        />
        {formatTimer(remainingSeconds)}
      </button>
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex-1 rounded-lg border border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] px-3 py-2 text-center font-[JetBrains_Mono,monospace] text-[12px] text-slate-600 dark:text-[#8a96a8]"
      >
        {answeredCount}/{totalQuestions} answered · Palette
      </button>
      <button
        type="button"
        onClick={onRequestSubmit}
        disabled={submitted}
        className="rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-4 py-2 font-[Space_Grotesk,sans-serif] text-[12.5px] font-bold text-[#06120d] disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  )
}
