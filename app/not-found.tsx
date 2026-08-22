import Link from "next/link"
import { Compass, Home, LogIn } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function NotFound() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f8f9fb] px-4 font-[Inter,sans-serif] text-slate-900 transition-colors duration-300 dark:bg-[#141b25] dark:text-[#e7ecf3]"
    >
      <div className="w-full max-w-105 text-center flex flex-col items-center justify-center gap-2 sm:gap-3">

        <div className="">
          <Image
            loading="lazy"
            src="/logo.png"
            alt="AptiCore Logo"
            width={100}
            height={100}
            className="h-20 w-20 rounded-full object-cover sm:h-20 sm:w-20"
          />
        </div>

        {/* 404 */}
        <div className="relative mx-auto mb-2 inline-block">
          <span className="font-[Space_Grotesk,sans-serif] text-[96px] leading-none font-bold text-transparent [-webkit-text-stroke:1.5px_#cbd5e1] sm:text-[120px] dark:[-webkit-text-stroke:1.5px_#212a37]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-9 w-9 animate-pulse text-teal-500 sm:h-11 sm:w-11 dark:text-[#6ee7c9]" />
          </div>
        </div>

        <h1 className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-[13.5px] leading-6 text-slate-500 dark:text-[#8a96a8]">
          The page you're looking for doesn't exist, was moved, or the URL
          might be off by a letter.
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-5 py-2.5 text-[13px] font-bold text-[#06120d] transition hover:brightness-105"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-[#212a37] dark:text-[#8a96a8] dark:hover:border-[#3a4a5e] dark:hover:text-[#e7ecf3]"
          >
            <LogIn className="h-4 w-4" />
            Log in
          </Link>
        </div>

        <p className="mt-8 font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-slate-400 uppercase dark:text-[#5b6577]">
          AptiCore · campus placement engine
        </p>
      </div>
    </div>
  )
}