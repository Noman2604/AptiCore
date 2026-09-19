interface ProctorStripProps {
  tabSwitches: number
  sectionText: string
  negativeMarking: number
}

export function ProctorStrip({
  tabSwitches,
  sectionText,
  negativeMarking,
}: ProctorStripProps) {
  return (
    <div className="flex h-8.5 shrink-0 scrollbar-none items-center gap-0 overflow-x-auto overflow-y-hidden border-b border-slate-200 dark:border-[#212a37] bg-slate-100 dark:bg-[#070a0f] px-3 font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wide whitespace-nowrap text-slate-500 dark:text-[#5b6577] sm:px-4 sm:text-[11px]">
      <div className="flex h-full shrink-0 items-center gap-1.5 border-r border-slate-200 dark:border-[#1a212b] pr-3.5">
        <span
          className={`h-1.5 w-1.5 animate-pulse rounded-full ${
            tabSwitches >= 1
              ? "bg-[#f5a623] shadow-[0_0_8px_#f5a623]"
              : "bg-[#3ecf8e] shadow-[0_0_8px_#3ecf8e]"
          }`}
        />
        PROCTOR: ACTIVE
      </div>
      <div className="flex h-full shrink-0 items-center border-r border-slate-200 dark:border-[#1a212b] px-3.5">
        TAB SWITCHES: {tabSwitches}
      </div>
      <div className="hidden h-full shrink-0 items-center border-r border-slate-200 dark:border-[#1a212b] px-3.5 sm:flex">
        FULLSCREEN: LOCKED
      </div>
      <div className="hidden h-full shrink-0 items-center border-r border-slate-200 dark:border-[#1a212b] px-3.5 md:flex">
        SECTION: {sectionText}
      </div>
      <div className="flex h-full shrink-0 items-center px-3.5">
        NEGATIVE MARKING: − {negativeMarking} / WRONG
      </div>
    </div>
  )
}
