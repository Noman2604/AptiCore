import Image from "next/image"
import type { TestSummary } from "./types"

interface TestHeaderProps {
  test: TestSummary
  questionCount: number
}

export function TestHeader({ test, questionCount }: TestHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 dark:border-[#212a37] bg-linear-to-b from-white to-slate-50 dark:from-[#0c1119] dark:to-[#0a0e14] px-4 py-3 sm:px-6 sm:py-3.5">
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
          <div className="hidden font-[JetBrains_Mono,monospace] text-[11px] text-slate-500 dark:text-[#5b6577] sm:block">
            campus placement engine
          </div>
        </div>
      </div>
      <div className="min-w-0 text-right">
        <div className="truncate font-[Space_Grotesk,sans-serif] text-[13px] font-semibold sm:text-sm">
          {test.title}
        </div>
        <div className="hidden font-[JetBrains_Mono,monospace] text-[11px] text-slate-500 dark:text-[#5b6577] sm:block">
          {questionCount} Qs · {test.totalMarks} marks · {test.durationMinutes} min · Attempt 1 of 1
        </div>
        <div className="font-[JetBrains_Mono,monospace] text-[10.5px] text-slate-500 dark:text-[#5b6577] sm:hidden">
          {questionCount} Qs · {test.durationMinutes} min
        </div>
      </div>
    </header>
  )
}
