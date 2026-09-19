interface TestToastProps {
  message: string | null
}

export function TestToast({ message }: TestToastProps) {
  return (
    <div
      className={`pointer-events-none fixed bottom-20 left-1/2 z-60 -translate-x-1/2 rounded-[9px] border border-slate-200 dark:border-[#212a37] bg-slate-800 dark:bg-[#131a24] px-4.5 py-2.75 font-[JetBrains_Mono,monospace] text-[12.5px] text-slate-900 dark:text-[#e7ecf3] shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-250 lg:bottom-5 ${
        message ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      {message}
    </div>
  )
}
