"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import {
  Zap,
  ArrowRight,
  Trophy,
  Target,
  Clock,
  Users,
  Star,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Play,
  Shield,
  Award,
  BarChart2,
  Brain,
  Code2,
  Database,
  FileText,
  MessageSquare,
  Cpu,
  Lightbulb,
  Flame,
  Globe,
  Lock,
  Sparkles,
  Medal,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import StickyMobileCTA from "@/components/StickyMobileCTA"
import ScrollReveal from "@/components/ScrollReveal"
import AnimatedCounter from "@/components/AnimatedCounter"
import { cn, formatNumber } from "@/lib/utils"
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

const companies = [
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Cognizant",
  "HCL",
  "Tech Mahindra",
  "Capgemini",
  "IBM",
  "Oracle",
  "Google",
  "Amazon",
  "Microsoft",
  "Deloitte",
  "KPMG",
]

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

// Rotated across categories so each card gets a distinct icon + accent
const CATEGORY_STYLES = [
  { icon: BookOpen, color: "#6ee7c9" },
  { icon: Code2, color: "#8b7cf6" },
  { icon: Database, color: "#3ecf8e" },
  { icon: Brain, color: "#f5a623" },
  { icon: Cpu, color: "#f2555a" },
  { icon: MessageSquare, color: "#f2896b" },
  { icon: FileText, color: "#6ee7c9" },
  { icon: Lightbulb, color: "#8b7cf6" },
  { icon: Target, color: "#3ecf8e" },
  { icon: BarChart2, color: "#f5a623" },
  { icon: Medal, color: "#f2555a" },
]

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  // 3D card tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 8, y: -y * 8 })
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
      className="min-h-screen bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
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
        className="fixed top-0 left-0 right-0 z-50 h-0.75 bg-linear-to-r from-[#6ee7c9] via-[#8b7cf6] to-[#f5a623] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Animated ambient background orbs */}
        <div
          className="animate-pulse-slow pointer-events-none absolute top-1/4 -left-64 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(110,231,201,0.14)" }}
        />
        <div
          className="animate-pulse-slow pointer-events-none absolute -right-64 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(139,124,246,0.14)",
            animationDelay: "1.2s",
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(110,231,201,0.04)" }}
        />

        <div className="max-w-9xl relative mx-auto grid items-center gap-10 px-4 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            {/* Badge */}
            <ScrollReveal direction="down" delay={100}>
              <div className="mb-5 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] px-4 py-2 font-[JetBrains_Mono,monospace] text-[12.5px] font-medium text-[#6ee7c9]">
                <Sparkles className="h-4 w-4" />
                <span>India's #1 Aptitude Platform</span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={200}>
              <h1 className="mb-4 sm:mb-6 font-[Space_Grotesk,sans-serif] text-4xl leading-[1.08] font-extrabold sm:text-6xl lg:text-7xl">
                <span className="text-[#e7ecf3]">Crack Your</span>
                <br />
                <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
                  Placement
                </span>
                <br />
                <span className="text-[#e7ecf3]">With Confidence</span>
              </h1>
            </ScrollReveal>

            {/* Subheading */}
            <ScrollReveal direction="up" delay={300}>
              <p className="mb-6 sm:mb-8 max-w-lg text-base sm:text-lg leading-relaxed text-[#8a96a8]">
                Master quantitative aptitude, logical reasoning, coding MCQs and
                more with{" "}
                <strong className="text-[#e7ecf3]">
                  <AnimatedCounter end={24600} suffix="+" /> questions
                </strong>
                , real-time leaderboards, and AI-powered analytics.
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal direction="up" delay={400}>
              <div className="mb-8 sm:mb-10 flex flex-wrap gap-4">
                <Link
                  href="/auth/register"
                  className="group flex items-center gap-2 rounded-xl bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-6 py-3.5 text-sm font-bold text-[#06120d] shadow-[0_0_24px_rgba(110,231,201,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-105"
                >
                  Start Practicing Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contest"
                  className="group flex items-center gap-2 rounded-xl border border-[#212a37] px-6 py-3.5 text-sm font-semibold text-[#e7ecf3] transition-all hover:bg-[#141b25]"
                >
                  <Play className="h-4 w-4 text-[#6ee7c9]" />
                  Watch Demo
                </Link>
              </div>
            </ScrollReveal>

            {/* Live Counter Mini stats */}
            <ScrollReveal direction="up" delay={500}>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold text-transparent">
                    <AnimatedCounter end={128} suffix="K+" />
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-xs text-[#5b6577]">
                    Students
                  </div>
                </div>

                <div>
                  <div className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold text-transparent">
                    <AnimatedCounter end={2840} suffix="+" />
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-xs text-[#5b6577]">
                    Mock Tests
                  </div>
                </div>

                <div>
                  <div className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold text-transparent">
                    <AnimatedCounter end={85} suffix="+" />
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-xs text-[#5b6577]">
                    Companies
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero Visual Card with Interactive 3D Tilt */}
          <ScrollReveal direction="left" delay={300} className="relative hidden lg:block">
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
              <div className="rounded-3xl border border-[#212a37] bg-[#10151d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#f2555a]" />
                    <div className="h-3 w-3 rounded-full bg-[#f5a623]" />
                    <div className="h-3 w-3 rounded-full bg-[#3ecf8e]" />
                  </div>
                  <span className="font-[JetBrains_Mono,monospace] text-xs text-[#5b6577]">
                    TCS NQT Mock · 47:32
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.08)] p-3.5">
                    <p className="mb-2 text-sm font-medium">
                      Q14. If 15% of x = 20% of y, then x:y = ?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {["3:4", "4:3", "5:4", "2:3"].map((opt, i) => (
                        <button
                          key={opt}
                          className={cn(
                            "rounded-lg border p-2 text-left font-[JetBrains_Mono,monospace] text-xs transition-all",
                            i === 1
                              ? "border-[#6ee7c9] bg-[rgba(110,231,201,0.15)] text-[#6ee7c9] shadow-[0_0_12px_rgba(110,231,201,0.2)]"
                              : "border-[#212a37] text-[#8a96a8] hover:border-[#3a4a5e]"
                          )}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-between font-[JetBrains_Mono,monospace] text-xs text-[#5b6577]">
                    <span>Progress: 14/30</span>
                    <span className="text-[#3ecf8e]">+4 correct</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#212a37]">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6]"
                      style={{ width: "47%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating micro-cards */}
              <div className="animate-float pointer-events-none absolute -top-6 -right-6 rounded-2xl border border-[#212a37] bg-[#10151d] p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#f5a623] to-[#e0901a] font-[Space_Grotesk,sans-serif] text-sm font-bold text-[#241503]">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Arjun Sharma</div>
                    <div className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
                      9840 XP · Top 0.1%
                    </div>
                  </div>
                  <Trophy className="h-4 w-4 text-[#f5a623]" />
                </div>
              </div>

              <div
                className="animate-float pointer-events-none absolute -bottom-6 -left-6 rounded-2xl border border-[#212a37] bg-[#10151d] p-4 shadow-xl"
                style={{ animationDelay: "2s" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3ecf8e]" />
                  <span className="text-xs font-semibold">Test Completed!</span>
                </div>
                <div className="flex items-center gap-4 font-[JetBrains_Mono,monospace] text-xs">
                  <div>
                    <div className="font-bold text-[#3ecf8e]">87%</div>
                    <div className="text-[#5b6577]">Score</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#6ee7c9]">#142</div>
                    <div className="text-[#5b6577]">Rank</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#8b7cf6]">+240</div>
                    <div className="text-[#5b6577]">XP</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Recruiter Company Logos Marquee ─────────────────────── */}
      <section className="overflow-hidden border-y border-[#212a37] bg-[#10151d] py-10">
        <ScrollReveal direction="up" threshold={0.1}>
          <div className="mb-5 text-center">
            <p className="font-[JetBrains_Mono,monospace] text-xs uppercase tracking-wider text-[#5b6577]">
              Trusted questions from recruitment drives of 85+ global companies
            </p>
          </div>
          <div
            className="group flex gap-6 hover:paused"
            style={{ animation: "ticker 26s linear infinite" }}
          >
            {[...companies, ...companies].map((c, i) => (
              <div
                key={i}
                className="shrink-0 cursor-default rounded-xl border border-[#212a37] bg-[#141b25] px-5 py-2.5 text-xs font-semibold whitespace-nowrap text-[#8a96a8] shadow-sm transition-all hover:border-[#6ee7c9]/40 hover:bg-[#192230] hover:text-[#e7ecf3]"
              >
                {c}
              </div>
            ))}
          </div>
        </ScrollReveal>
        <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </section>

      {/* ── Categories Section ──────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mb-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <h2 className="mb-3 font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl">
                  Explore{" "}
                  <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
                    Aptitude Categories
                  </span>
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#8a96a8] sm:mx-0 sm:text-base">
                  Pick a topic and start practicing from thousands of curated
                  questions across every campus placement requirement.
                </p>
              </div>
              <Link
                href="/categories"
                className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#6ee7c9] transition-colors hover:text-[#8ef2d6] sm:flex"
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
                  className="animate-pulse rounded-2xl border border-[#212a37] bg-[#10151d] p-6"
                >
                  <div className="mb-4 h-12 w-12 rounded-2xl bg-[#212a37]" />
                  <div className="mb-2 h-4 w-2/3 rounded bg-[#212a37]" />
                  <div className="h-3 w-full rounded bg-[#212a37]" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((category, i) => {
                const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length]
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
                      className="group flex h-full flex-col justify-between rounded-2xl border border-[#212a37] bg-[#10151d] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#6ee7c9]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
                    >
                      <div>
                        <div
                          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110"
                          style={{
                            borderColor: `${style.color}40`,
                            backgroundColor: `${style.color}14`,
                            color: style.color,
                          }}
                        >
                          <style.icon className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1.5 flex items-center gap-1.5 font-[Space_Grotesk,sans-serif] font-semibold text-[#e7ecf3]">
                          {category.name}
                          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-[#6ee7c9] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </h3>
                        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[#8a96a8]">
                          {category.description ||
                            "Practice curated questions on this topic."}
                        </p>
                      </div>

                      {subCount > 0 && (
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#212a37] bg-[#141b25] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#8a96a8]">
                            {subCount} subtopic{subCount === 1 ? "" : "s"}
                          </span>
                        </div>
                      )}
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#212a37] bg-[#10151d] p-12 text-center text-[#5b6577]">
              Categories are being added — check back soon.
            </div>
          )}

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/categories"
              className="group flex items-center gap-1.5 text-sm font-semibold text-[#6ee7c9] transition-colors hover:text-[#8ef2d6]"
            >
              View all categories
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────── */}
      <section className="border-y border-[#212a37] bg-[#10151d] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl">
                Built for{" "}
                <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
                  Serious Placement Aspirants
                </span>
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#8a96a8] sm:text-base">
                Every feature is engineered to accelerate your speed, pinpoint
                weak areas, and keep you confident on test day.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal
                key={f.title}
                direction="up"
                delay={i * 80}
                distance={28}
              >
                <div className="group h-full rounded-2xl border border-[#212a37] bg-[#0a0e14] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3a4a5e] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      borderColor: `${f.color}40`,
                      backgroundColor: `${f.color}14`,
                      color: f.color,
                    }}
                  >
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-[Space_Grotesk,sans-serif] font-semibold text-[#e7ecf3]">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#8a96a8]">
                    {f.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
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
      <StickyMobileCTA />
    </div>
  )
}