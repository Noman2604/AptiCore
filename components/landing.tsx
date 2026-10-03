"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Play,
  Shield,
  BarChart2,
  Brain,
  Code2,
  MessageSquare,
  Cpu,
  Flame,
  Globe,
  Lock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Check,
  UserPlus,
  LayoutGrid,
  BarChart3,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import AnimatedCounter from "@/components/AnimatedCounter"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import { AnimatedBeam } from "@/components/magicui/animated-beam"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getCategoryColor } from "@/lib/category-utils"
import axios from "axios"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  isActive?: boolean
  subcategories?: { _id: string; name: string }[]
  questionCount?: number
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    desc: "Get personalized weak area analysis and improvement suggestions powered by AI",
    color: "#8b7cf6",
  },
  {
    icon: Trophy,
    title: "Weekly Contests",
    desc: "Compete globally in timed contests, climb leaderboards and earn rewards",
    color: "#f5a623",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    desc: "Full-screen exam mode with proctoring ensures fair competition",
    color: "#6ee7c9",
  },
  {
    icon: Flame,
    title: "Streak System",
    desc: "Maintain daily streaks to earn XP multipliers and exclusive badges",
    color: "#f2896b",
  },
  {
    icon: Globe,
    title: "Multi-language",
    desc: "Practice in English, Hindi, and regional languages",
    color: "#3ecf8e",
  },
  {
    icon: Lock,
    title: "Detailed Solutions",
    desc: "Every question comes with step-by-step text explanations",
    color: "#f2555a",
  },
]

const CATEGORY_ICONS = {
  quantitative: BookOpen,
  "logical-reasoning": Brain,
  "verbal-ability": MessageSquare,
  "coding-mcqs": Code2,
  "data-interpretation": BarChart2,
  "object-oriented-programming": Cpu,
  "interview-preparation": Target,
}

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  // 3D card tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // How It Works section refs for Antigravity Flow Layout
  const howItWorksContainerRef = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 20, y: -y * 20 })
  }

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Track scroll progress for the top reading indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await axios.get("/api/categories")
        const data: Category[] = res.data?.data || []
        setCategories(data.filter((c) => c.isActive !== false))
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    void loadCategories()
  }, [])

  return (
    <div
      className="min-h-screen bg-background font-[Inter,sans-serif] text-foreground transition-colors duration-200 selection:bg-emerald-500/20 selection:text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      {/* ── Scroll Progress Line ──────────────────────────────── */}
      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 right-0 left-0 z-50 h-0.75 bg-linear-to-r from-[#6ee7c9] via-[#8b7cf6] to-[#f5a623] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Animated ambient background orbs */}
        <div
          className="animate-pulse-slow pointer-events-none absolute top-1/4 -left-64 h-96 w-96 rounded-full opacity-70 blur-3xl dark:opacity-100"
          style={{ backgroundColor: "rgba(110,231,201,0.12)" }}
        />
        <div
          className="animate-pulse-slow pointer-events-none absolute -right-64 bottom-1/4 h-96 w-96 rounded-full opacity-70 blur-3xl dark:opacity-100"
          style={{
            backgroundColor: "rgba(139,124,246,0.12)",
            animationDelay: "1.2s",
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{ backgroundColor: "rgba(110,231,201,0.03)" }}
        />

        {/* Magic UI Animated Grid Pattern Background */}
        <AnimatedGridPattern
          numSquares={45}
          maxOpacity={0.5}
          duration={3}
          repeatDelay={0.6}
          className={cn(
            "[mask-image:radial-gradient(1100px_circle_at_center,white,transparent)]",
            "stroke-emerald-950/15 dark:stroke-white/[0.07]",
            "fill-emerald-500/10 dark:fill-emerald-400/5",
            "text-emerald-500/30 dark:text-[#6ee7c9]/35"
          )}
        />

        <div className="max-w-9xl relative mx-auto grid items-center gap-8 px-4 py-8 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div>
            {/* Badge */}
            <ScrollReveal direction="down" delay={100}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-[JetBrains_Mono,monospace] text-[12.5px] font-medium text-emerald-700 sm:mb-6 dark:text-[#6ee7c9]">
                <Sparkles className="h-4 w-4" />
                <span>India's #1 Aptitude Platform</span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-[#6ee7c9]" />
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={200}>
              <h1 className="mb-3.5 font-[Space_Grotesk,sans-serif] text-4xl leading-[1.08] font-extrabold sm:mb-5 sm:text-6xl lg:text-7xl">
                <span className="text-foreground">Crack Your</span>
                <br />
                <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                  Placement
                </span>
                <br />
                <span className="text-foreground">With Confidence</span>
              </h1>
            </ScrollReveal>

            {/* Subheading */}
            <ScrollReveal direction="up" delay={300}>
              <p className="mb-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:mb-6 sm:text-lg">
                Master quantitative aptitude, logical reasoning, coding MCQs and
                more with{" "}
                <strong className="text-foreground">
                  <AnimatedCounter end={24600} suffix="+" /> questions
                </strong>
                , real-time leaderboards.
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal direction="up" delay={400}>
              <div className="mb-6 flex flex-wrap gap-4 sm:mb-8">
                <Link
                  href="/auth/register"
                  className="group flex items-center gap-2 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:brightness-105 dark:from-[#6ee7c9] dark:to-[#57c9a8] dark:text-[#06120d] dark:shadow-[0_0_24px_rgba(110,231,201,0.25)]"
                >
                  Start Practicing Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contest"
                  className="group flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted dark:border-[#212a37] dark:bg-[#141b25] dark:text-[#e7ecf3]"
                >
                  <Play className="h-4 w-4 text-emerald-600 dark:text-[#6ee7c9]" />
                  Watch Demo
                </Link>
              </div>
            </ScrollReveal>

            {/* Live Counter Mini stats */}
            <ScrollReveal direction="up" delay={500}>
              <div className="inline-flex items-center gap-4 rounded-2xl border border-border/70 bg-card/60 px-5 py-3 shadow-xs backdrop-blur-md sm:gap-6 sm:px-6 dark:border-white/[0.08] dark:bg-[#10151d]/60">
                <div className="flex flex-col">
                  <div className="bg-linear-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl dark:from-[#6ee7c9] dark:via-[#7ef0d5] dark:to-[#8b7cf6]">
                    <AnimatedCounter end={128} suffix="K+" />
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[11px]">
                    Students
                  </div>
                </div>

                <Separator
                  orientation="vertical"
                  className="h-8 w-px bg-border/80 dark:bg-white/15"
                />

                <div className="flex flex-col">
                  <div className="bg-linear-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl dark:from-[#6ee7c9] dark:via-[#7ef0d5] dark:to-[#8b7cf6]">
                    <AnimatedCounter end={2840} suffix="+" />
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[11px]">
                    Mock Tests
                  </div>
                </div>

                <Separator
                  orientation="vertical"
                  className="h-8 w-px bg-border/80 dark:bg-white/15"
                />

                <div className="flex flex-col">
                  <div className="bg-linear-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl dark:from-[#6ee7c9] dark:via-[#7ef0d5] dark:to-[#8b7cf6]">
                    <AnimatedCounter end={85} suffix="+" />
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[11px]">
                    Companies
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero Visual Card with Interactive 3D Tilt */}
          <ScrollReveal
            direction="left"
            delay={300}
            className="relative hidden lg:block"
          >
            <div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transition: "transform 0.15s ease-out",
              }}
              className="relative transition-transform will-change-transform"
            >
              {/* Main test simulator card */}
              <div className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur-xl dark:border-[#212a37]/90 dark:bg-[#10151d]/95 dark:shadow-[0_24px_64px_rgba(225,225,225,0.25)] dark:ring-white/5">
                {/* Window Header */}
                <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 dark:border-[#212a37]/60">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#f2555a] shadow-[0_0_8px_rgba(242,85,90,0.4)]" />
                    <div className="h-3 w-3 rounded-full bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
                    <div className="h-3 w-3 rounded-full bg-[#3ecf8e] shadow-[0_0_8px_rgba(62,207,142,0.4)]" />
                    <span className="ml-2 font-[JetBrains_Mono,monospace] text-xs text-muted-foreground">
                      TCS NQT Mock · 47:32
                    </span>
                  </div>

                  {/* System Active Badge (AutoWhat Console Indicator) */}
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold text-emerald-700 dark:text-[#6ee7c9]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 dark:bg-[#6ee7c9]" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-[#6ee7c9]" />
                    </span>
                    <span>SYSTEM ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 dark:bg-[rgba(110,231,201,0.08)]">
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Q14. If 15% of x = 20% of y, then x:y = ?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {["3:4", "4:3", "5:4", "2:3"].map((opt, i) => (
                        <button
                          key={opt}
                          className={cn(
                            "rounded-lg border p-2 text-left font-[JetBrains_Mono,monospace] text-xs transition-all",
                            i === 1
                              ? "border-emerald-500 bg-emerald-500/15 font-semibold text-emerald-700 shadow-xs dark:border-[#6ee7c9] dark:bg-[rgba(110,231,201,0.15)] dark:text-[#6ee7c9] dark:shadow-[0_0_12px_rgba(110,231,201,0.2)]"
                              : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground dark:border-[#212a37] dark:text-[#8a96a8] dark:hover:border-[#3a4a5e]"
                          )}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-between font-[JetBrains_Mono,monospace] text-xs text-muted-foreground">
                    <span>Progress: 14/30</span>
                    <span className="font-semibold text-emerald-600 dark:text-[#3ecf8e]">
                      +4 correct
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-[#212a37]">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-500 to-indigo-500 dark:from-[#6ee7c9] dark:to-[#8b7cf6]"
                      style={{ width: "47%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating micro-card: Top Right (Leaderboard Badge) */}
              <div className="animate-float pointer-events-none absolute -top-9 -right-2 rounded-2xl border border-border bg-card/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-md sm:-right-4 dark:border-[#212a37] dark:bg-[#10151d]/95 dark:shadow-[0_12px_32px_rgba(255,255,255,0.25)] dark:ring-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#f5a623] to-[#e0901a] font-[Space_Grotesk,sans-serif] text-sm font-bold text-[#241503] shadow-[0_0_12px_rgba(245,166,35,0.4)]">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <span>Arjun Sharma</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-[#6ee7c9]" />
                    </div>
                    <div className="font-[JetBrains_Mono,monospace] text-[10.5px] text-muted-foreground">
                      9840 XP · Top 0.1%
                    </div>
                  </div>
                  <Trophy className="h-4 w-4 text-[#f5a623]" />
                </div>
              </div>

              {/* Floating micro-card: Bottom Left (Test Completed Badge) */}
              <div
                className="animate-float pointer-events-none absolute -bottom-6 -left-6 rounded-2xl border border-border bg-card/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-md dark:border-[#212a37] dark:bg-[#10151d]/95 dark:shadow-[0_12px_32px_rgba(255,255,255,0.25)] dark:ring-white/5"
                style={{ animationDelay: "2s" }}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#3ecf8e]" />
                    <span className="text-xs font-semibold text-foreground">
                      Test Completed!
                    </span>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-[#3ecf8e]" />
                </div>
                <div className="flex items-center gap-4 font-[JetBrains_Mono,monospace] text-xs">
                  <div>
                    <div className="font-bold text-emerald-600 dark:text-[#3ecf8e]">
                      87%
                    </div>
                    <div className="text-muted-foreground">Score</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-600 dark:text-[#6ee7c9]">
                      #142
                    </div>
                    <div className="text-muted-foreground">Rank</div>
                  </div>
                  <div>
                    <div className="font-bold text-indigo-600 dark:text-[#8b7cf6]">
                      +240
                    </div>
                    <div className="text-muted-foreground">XP</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Categories Section ──────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mb-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <h2 className="mb-3 font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl">
                  Explore{" "}
                  <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                    Aptitude Categories
                  </span>
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:mx-0 sm:text-base">
                  Pick a topic and start practicing from thousands of curated
                  questions across every campus placement requirement.
                </p>
              </div>
              <Link
                href="/categories"
                className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 sm:flex dark:text-[#6ee7c9] dark:hover:text-[#8ef2d6]"
              >
                View all categories
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-border bg-card p-6 dark:border-[#212a37] dark:bg-[#10151d]"
                >
                  <div className="mb-4 h-12 w-12 rounded-2xl bg-muted dark:bg-[#212a37]" />
                  <div className="mb-2 h-4 w-2/3 rounded bg-muted dark:bg-[#212a37]" />
                  <div className="h-3 w-full rounded bg-muted dark:bg-[#212a37]" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((category, i) => {
                const CategoryIcon =
                  CATEGORY_ICONS[
                    category.slug as keyof typeof CATEGORY_ICONS
                  ] || BookOpen
                const iconColor = getCategoryColor(category.slug)
                const subCount = category.subcategories?.length || 0

                return (
                  <ScrollReveal
                    key={category._id}
                    direction="up"
                    delay={i * 65}
                    distance={24}
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="group flex h-full min-h-56 flex-col rounded-xl border border-border/60 shadow-sm bg-card p-5 transition-colors hover:border-foreground/20 dark:border-[#212a37] dark:bg-[#10151d] dark:hover:border-[#3a4a5e]"
                    >
                      <div className="flex flex-1 flex-col">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground dark:border-[#212a37] dark:bg-[#141b25]">
                          <CategoryIcon
                            className="h-4.5 w-4.5"
                            style={iconColor ? { color: iconColor } : undefined}
                          />
                        </div>
                        <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-base font-semibold text-foreground">
                          {category.name}
                        </h3>
                        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                          {category.description ||
                            "Practice curated questions on this topic."}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5 text-sm dark:border-[#212a37]">
                        <span className="text-muted-foreground">
                          {subCount} subtopic{subCount === 1 ? "" : "s"}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground dark:border-[#212a37] dark:bg-[#10151d]">
              Categories are being added — check back soon.
            </div>
          )}

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/categories"
              className="group flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-[#6ee7c9] dark:hover:text-[#8ef2d6]"
            >
              View all categories
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border/70 py-24 dark:border-[#212a37]">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
            <div className="mb-16 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-[#6ee7c9]">
                <Sparkles className="h-3.5 w-3.5" />
                How It Works
              </div>
              <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl text-foreground">
                From Sign Up to{" "}
                <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                  Placement Ready
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Four simple steps to transform your aptitude preparation and land top campus offers.
              </p>
            </div>
          </BlurFade>

          <div
            ref={howItWorksContainerRef}
            className="relative mx-auto max-w-4xl py-6"
          >
            {/* Animated Orthogonal PCB Circuit Beams (desktop only: sm and up) */}
            <div className="pointer-events-none hidden sm:block">
              {/* Beam 1: Card 1 Bottom (Sign Up) -> Card 2 Top (Pick a Category) */}
              <AnimatedBeam
                containerRef={howItWorksContainerRef}
                fromRef={card1Ref}
                toRef={card2Ref}
                connection="bottom-to-top"
                routing="orthogonal"
                delay={0}
                duration={3}
                gradientStartColor="#10b981"
                gradientStopColor="#6366f1"
                className="text-border dark:text-zinc-800"
                pathWidth={2}
                pathOpacity={0.65}
              />
              {/* Beam 2: Card 2 Bottom (Pick a Category) -> Card 3 Top (Take a Timed Test) */}
              <AnimatedBeam
                containerRef={howItWorksContainerRef}
                fromRef={card2Ref}
                toRef={card3Ref}
                connection="bottom-to-top"
                routing="orthogonal"
                delay={0.8}
                duration={3}
                gradientStartColor="#6366f1"
                gradientStopColor="#f59e0b"
                className="text-border dark:text-zinc-800"
                pathWidth={2}
                pathOpacity={0.65}
              />
              {/* Beam 3: Card 3 Bottom (Take a Timed Test) -> Card 4 Top (Track Progress) */}
              <AnimatedBeam
                containerRef={howItWorksContainerRef}
                fromRef={card3Ref}
                toRef={card4Ref}
                connection="bottom-to-top"
                routing="orthogonal"
                delay={1.6}
                duration={3}
                gradientStartColor="#f59e0b"
                gradientStopColor="#14b8a6"
                className="text-border dark:text-zinc-800"
                pathWidth={2}
                pathOpacity={0.65}
              />
            </div>

            {/* Alternating Step Cards: Left -> Right -> Left -> Right */}
            <div className="space-y-14 sm:space-y-20">
              {/* Step 1: Left */}
              <div className="flex justify-start">
                <div ref={card1Ref} className="w-full sm:w-[45%]">
                  <BlurFade delay={0.1} direction="right" inView>
                    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(110,231,201,0.12)] dark:border-[#212a37] dark:bg-[#0c1017]">
                      {/* Top border beam glow indicator (Next.js style) */}
                      <div className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-linear-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(110,231,201,0.6)] dark:via-[#6ee7c9]" />

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-[#6ee7c9] shadow-inner transition-transform group-hover:scale-105">
                          <UserPlus className="h-5 w-5" />
                        </div>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 font-[Space_Grotesk,sans-serif] text-xs font-bold text-emerald-600 dark:text-[#6ee7c9]">
                          1
                        </span>
                      </div>
                      <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                        Sign Up
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Create your free account in seconds with your university or personal email.
                      </p>
                    </div>
                  </BlurFade>
                </div>
              </div>

              {/* Step 2: Right */}
              <div className="flex justify-end">
                <div ref={card2Ref} className="w-full sm:w-[45%]">
                  <BlurFade delay={0.2} direction="left" inView>
                    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_10px_30px_rgba(139,124,246,0.12)] dark:border-[#212a37] dark:bg-[#0c1017]">
                      {/* Top border beam glow indicator (Next.js style) */}
                      <div className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_rgba(139,124,246,0.6)] dark:via-[#8b7cf6]" />

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-600 dark:text-[#8b7cf6] shadow-inner transition-transform group-hover:scale-105">
                          <LayoutGrid className="h-5 w-5" />
                        </div>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 font-[Space_Grotesk,sans-serif] text-xs font-bold text-indigo-600 dark:text-[#8b7cf6]">
                          2
                        </span>
                      </div>
                      <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                        Pick a Category
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Choose from Quantitative, Logical, Verbal, or Coding MCQs curated for placements.
                      </p>
                    </div>
                  </BlurFade>
                </div>
              </div>

              {/* Step 3: Left */}
              <div className="flex justify-start">
                <div ref={card3Ref} className="w-full sm:w-[45%]">
                  <BlurFade delay={0.3} direction="right" inView>
                    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_10px_30px_rgba(245,166,35,0.12)] dark:border-[#212a37] dark:bg-[#0c1017]">
                      {/* Top border beam glow indicator (Next.js style) */}
                      <div className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-linear-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_12px_rgba(245,166,35,0.6)] dark:via-[#f5a623]" />

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-[#f5a623] shadow-inner transition-transform group-hover:scale-105">
                          <Clock className="h-5 w-5" />
                        </div>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 font-[Space_Grotesk,sans-serif] text-xs font-bold text-amber-600 dark:text-[#f5a623]">
                          3
                        </span>
                      </div>
                      <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                        Take a Timed Test
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Simulate actual campus recruitment exams with strict full-screen timer conditions.
                      </p>
                    </div>
                  </BlurFade>
                </div>
              </div>

              {/* Step 4: Right */}
              <div className="flex justify-end">
                <div ref={card4Ref} className="w-full sm:w-[45%]">
                  <BlurFade delay={0.4} direction="left" inView>
                    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(62,207,142,0.12)] dark:border-[#212a37] dark:bg-[#0c1017]">
                      {/* Top border beam glow indicator (Next.js style) */}
                      <div className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-28 -translate-x-1/2 bg-linear-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_12px_rgba(62,207,142,0.6)] dark:via-[#3ecf8e]" />

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-[#3ecf8e] shadow-inner transition-transform group-hover:scale-105">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 font-[Space_Grotesk,sans-serif] text-xs font-bold text-emerald-600 dark:text-[#3ecf8e]">
                          4
                        </span>
                      </div>
                      <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                        Track Progress
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Review detailed speed metrics, accuracy analytics, and step-by-step solutions.
                      </p>
                    </div>
                  </BlurFade>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 py-24 dark:border-[#212a37] dark:bg-[#10151d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl">
                Built for{" "}
                <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                  Serious Placement Aspirants
                </span>
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every feature is engineered to accelerate your speed, pinpoint
                weak areas, and keep you confident on test day.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Asymmetric Bento Grid Layout ──────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Card 1: Weekly Contests (7 cols) */}
            <ScrollReveal direction="up" delay={0} distance={24} className="lg:col-span-7">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg dark:border-[#212a37] dark:bg-[#0c1017] dark:hover:border-amber-500/30 dark:hover:shadow-[0_12px_32px_rgba(245,166,35,0.08)]">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-500 shadow-inner">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Live Every Sunday
                    </span>
                  </div>

                  <h3 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                    Weekly Contests
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Compete globally in timed contests, climb national leaderboards, and earn verified placement rewards.
                  </p>
                </div>

                {/* Mini Leaderboard preview */}
                <div className="mt-6 space-y-2 rounded-xl border border-border/70 bg-muted/40 p-3.5 dark:border-[#1d2532] dark:bg-[#101620]">
                  {/* #1 Row */}
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-background/60 dark:hover:bg-[#141b25]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10.5px] font-bold text-amber-600 dark:text-amber-400">
                        #1
                      </span>
                      <span className="font-semibold text-foreground whitespace-nowrap">Aarav S.</span>
                    </div>
                    <span className="font-[JetBrains_Mono,monospace] font-medium tabular-nums text-muted-foreground whitespace-nowrap">
                      2,840 XP
                    </span>
                  </div>

                  {/* #2 Row */}
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-background/60 dark:hover:bg-[#141b25]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-500/20 text-[10.5px] font-bold text-slate-400">
                        #2
                      </span>
                      <span className="font-semibold text-foreground whitespace-nowrap">Priya M.</span>
                    </div>
                    <span className="font-[JetBrains_Mono,monospace] font-medium tabular-nums text-muted-foreground whitespace-nowrap">
                      2,715 XP
                    </span>
                  </div>

                  {/* #3 Row (You) */}
                  <div className="flex items-center justify-between rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2.5 text-xs font-semibold text-foreground shadow-xs dark:bg-amber-500/15">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10.5px] font-bold text-[#241503]">
                        #3
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground whitespace-nowrap">You</span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-2.5 w-2.5" /> +2
                        </span>
                      </div>
                    </div>
                    <span className="font-[JetBrains_Mono,monospace] font-bold tabular-nums text-amber-600 dark:text-[#f5a623] whitespace-nowrap">
                      2,690 XP
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Anti-Cheat Protection (5 cols) */}
            <ScrollReveal direction="up" delay={80} distance={24} className="lg:col-span-5">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg dark:border-[#212a37] dark:bg-[#0c1017] dark:hover:border-emerald-500/30 dark:hover:shadow-[0_12px_32px_rgba(62,207,142,0.08)]">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-500 shadow-inner">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-[#6ee7c9]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      Proctoring Active
                    </div>
                  </div>

                  <h3 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                    Anti-Cheat System
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Full-screen exam lockdown with multi-tab detection guarantees fair assessment across all test-takers.
                  </p>
                </div>

                {/* Proctoring HUD Grid */}
                <div className="mt-6 space-y-2.5 rounded-xl border border-border/70 bg-muted/40 p-3.5 dark:border-[#1d2532] dark:bg-[#101620]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Integrity Monitor</span>
                    <span className="font-[JetBrains_Mono,monospace] text-[11px] text-emerald-600 dark:text-[#3ecf8e]">
                      0 Violations
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-[JetBrains_Mono,monospace] text-[11px]">
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2 text-foreground dark:border-[#212a37] dark:bg-[#141b25]">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">Full-screen</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2 text-foreground dark:border-[#212a37] dark:bg-[#141b25]">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">Tab alerts</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2 text-foreground dark:border-[#212a37] dark:bg-[#141b25]">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">DevTools lock</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2 text-foreground dark:border-[#212a37] dark:bg-[#141b25]">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">Focus track</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Streak System (5 cols) */}
            <ScrollReveal direction="up" delay={120} distance={24} className="lg:col-span-5">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-orange-500/40 hover:shadow-lg dark:border-[#212a37] dark:bg-[#0c1017] dark:hover:border-orange-500/30 dark:hover:shadow-[0_12px_32px_rgba(242,137,107,0.08)]">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-500 shadow-inner">
                      <Flame className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      ⚡ 1.5x XP Multiplier
                    </span>
                  </div>

                  <h3 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                    Streak System
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Maintain daily practice streaks to multiply your XP gains and unlock exclusive achievement badges.
                  </p>
                </div>

                {/* Streak Days Visual */}
                <div className="mt-6 space-y-3 rounded-xl border border-border/70 bg-muted/40 p-3.5 dark:border-[#1d2532] dark:bg-[#101620]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-orange-600 dark:text-orange-400">
                      <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                      4-Day Streak Active
                    </span>
                    <span className="text-[11px] text-muted-foreground">Goal: 7 Days</span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {[
                      { day: "M", done: true },
                      { day: "T", done: true },
                      { day: "W", done: true },
                      { day: "T", done: true, current: true },
                      { day: "F", done: false },
                      { day: "S", done: false },
                      { day: "S", done: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-transform duration-200 group-hover:scale-105",
                            item.current
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/40 ring-2 ring-orange-500/50"
                              : item.done
                                ? "border border-orange-500/40 bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                : "border border-border/80 text-muted-foreground/40 dark:border-[#212a37]"
                          )}
                        >
                          {item.done ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4: Detailed Solutions (7 cols) */}
            <ScrollReveal direction="up" delay={160} distance={24} className="lg:col-span-7">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg dark:border-[#212a37] dark:bg-[#0c1017] dark:hover:border-[#6ee7c9]/30 dark:hover:shadow-[0_12px_32px_rgba(110,231,201,0.08)]">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-500 shadow-inner">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[11px] font-semibold text-cyan-600 dark:text-[#6ee7c9]">
                      Step-by-Step Logic
                    </span>
                  </div>

                  <h3 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                    Detailed Solutions & Tricks
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Master tough aptitude questions with clear mathematical steps, formula breakdowns, and shortcut speed hacks.
                  </p>
                </div>

                {/* Step-by-Step Math Preview */}
                <div className="mt-6 space-y-2 rounded-xl border border-border/70 bg-muted/40 p-3.5 dark:border-[#1d2532] dark:bg-[#101620]">
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs transition-colors hover:bg-background dark:border-[#212a37] dark:bg-[#141b25]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10.5px] font-bold text-emerald-600 dark:text-[#3ecf8e]">
                      1
                    </span>
                    <span className="font-[JetBrains_Mono,monospace] text-foreground">
                      Identify ratio: A : B = 3 : 5
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs transition-colors hover:bg-background dark:border-[#212a37] dark:bg-[#141b25]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10.5px] font-bold text-emerald-600 dark:text-[#3ecf8e]">
                      2
                    </span>
                    <span className="font-[JetBrains_Mono,monospace] text-foreground">
                      Total parts = 3 + 5 = 8 parts
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs transition-colors hover:bg-background dark:border-[#212a37] dark:bg-[#141b25]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10.5px] font-bold text-emerald-600 dark:text-[#3ecf8e]">
                      3
                    </span>
                    <span className="font-[JetBrains_Mono,monospace] text-foreground">
                      A&apos;s share = (3 / 8) × ₹240 = <span className="font-bold text-emerald-600 dark:text-[#6ee7c9]">₹90</span>
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" threshold={0.2}>
          <div
            className="relative overflow-hidden rounded-3xl border p-8 text-center sm:p-14"
            style={{
              borderColor: "rgba(110,231,201,0.25)",
              background:
                "linear-gradient(135deg, rgba(16,26,25,0.95), rgba(30,20,45,0.95))",
            }}
          >
            {/* Ambient pulsating glow */}
            <div
              className="animate-pulse-slow pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
              style={{ backgroundColor: "rgba(110,231,201,0.2)" }}
            />

            {/* Magic UI Animated Grid Pattern Background in CTA */}
            <AnimatedGridPattern
              numSquares={24}
              maxOpacity={0.3}
              duration={3.5}
              repeatDelay={0.8}
              className={cn(
                "[mask-image:radial-gradient(550px_circle_at_center,white,transparent)]",
                "stroke-white/[0.08]",
                "text-[#6ee7c9]/30"
              )}
            />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-[JetBrains_Mono,monospace] text-xs font-medium text-white/80">
                <Zap className="h-3.5 w-3.5 text-[#6ee7c9]" />
                <span>Free to start, forever</span>
              </div>

              <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                Ready to ace your next placement?
              </h2>

              <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Join over 128,000 students preparing smarter with AptiCore. Take
                your first diagnostic test in seconds.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 rounded-xl bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-8 py-4 text-sm font-bold text-[#06120d] shadow-[0_0_28px_rgba(110,231,201,0.35)] transition-all hover:-translate-y-1 hover:brightness-105"
                >
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
                {[
                  "No credit card required",
                  "Free forever plan",
                  "Instant detailed solutions",
                ].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#3ecf8e]" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
