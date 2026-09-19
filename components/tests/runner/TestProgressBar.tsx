interface TestProgressBarProps {
  progressPct: number
}

export function TestProgressBar({ progressPct }: TestProgressBarProps) {
  return (
    <div className="relative h-1 w-full shrink-0 bg-slate-200 dark:bg-[#151b24]">
      <div
        className="h-full bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] transition-[width] duration-500 ease-out"
        style={{ width: `${progressPct}%` }}
      />
      <span className="absolute top-1.5 right-3 hidden font-[JetBrains_Mono,monospace] text-[10px] text-slate-500 dark:text-[#5b6577] sm:block">
        {progressPct}% complete
      </span>
    </div>
  )
}
