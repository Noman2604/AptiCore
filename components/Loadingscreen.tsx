"use client"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex items-center justify-center bg-slate-50 font-[Inter,sans-serif] text-slate-900 transition-colors duration-300 dark:bg-[#0a0e14] dark:text-[#e7ecf3] ${
        fullScreen ? "min-h-screen" : "min-h-[40vh]"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.08), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.07), transparent 40%)",
      }}
    >
      <div className="flex items-center gap-2.5 font-[JetBrains_Mono,monospace] text-sm text-slate-500 dark:text-[#8a96a8]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 dark:bg-[#6ee7c9]" />
        {message}
      </div>
    </div>
  )
}