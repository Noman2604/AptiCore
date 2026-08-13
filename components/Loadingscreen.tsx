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
      className={`flex items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3] ${
        fullScreen ? "min-h-screen" : "min-h-[40vh]"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="flex items-center gap-2.5 font-[JetBrains_Mono,monospace] text-sm text-[#8a96a8]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6ee7c9] border-t-transparent mx-auto mb-4"></div>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
        {message}
      </div>
    </div>
  )
}