interface TestSectionRailProps {
  sectionText: string
}

export function TestSectionRail({ sectionText }: TestSectionRailProps) {
  return (
    <div className="hidden flex-col items-center gap-1.5 border-r border-slate-200 dark:border-[#212a37] bg-white dark:bg-[#10151d] py-4 lg:flex">
      <button
        type="button"
        className="flex h-9.5 w-9.5 items-center justify-center rounded-[9px] border border-[rgba(110,231,201,0.35)] bg-[rgba(110,231,201,0.12)] text-base text-[#6ee7c9]"
        title={sectionText}
      >
        {sectionText.charAt(0)}
      </button>
      <div className="flex-1" />
      <div className="mt-2 font-[JetBrains_Mono,monospace] text-[9px] tracking-[0.15em] text-slate-500 dark:text-[#5b6577] [writing-mode:vertical-rl]">
        SECTION 1 / 1
      </div>
    </div>
  )
}
