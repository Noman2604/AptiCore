import Link from "next/link"
import { Compass, Home, LogIn } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0a0e14] px-4 font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
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
          <span className="font-[Space_Grotesk,sans-serif] text-[96px] leading-none font-bold text-transparent [-webkit-text-stroke:1.5px_#212a37] sm:text-[120px]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-9 w-9 animate-pulse text-[#6ee7c9] sm:h-11 sm:w-11" />
          </div>
        </div>

        <h1 className="font-[Space_Grotesk,sans-serif] text-xl font-bold sm:text-2xl">
          Page not found
        </h1>
        <p className="mt-2 text-[13.5px] leading-6 text-[#8a96a8]">
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
            className="flex items-center justify-center gap-2 rounded-lg border border-[#212a37] px-5 py-2.5 text-[13px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
          >
            <LogIn className="h-4 w-4" />
            Log in
          </Link>
        </div>

        <p className="mt-8 font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
          AptiCore · campus placement engine
        </p>
      </div>
    </div>
  )
}