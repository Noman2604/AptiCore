"use client"
import { useEffect, useState } from "react"
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
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Animated background */}
        <div
          className="animate-pulse-slow absolute top-1/4 -left-64 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(110,231,201,0.14)" }}
        />
        <div
          className="animate-pulse-slow absolute -right-64 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(139,124,246,0.14)", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(110,231,201,0.04)" }}
        />

        <div className="max-w-9xl relative mx-auto grid items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] px-4 py-2 font-[JetBrains_Mono,monospace] text-[12.5px] font-medium text-[#6ee7c9]">
              <Sparkles className="h-4 w-4" />
              <span>India's #1 Aptitude Platform</span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
            </div>

            <h1 className="mb-6 font-[Space_Grotesk,sans-serif] text-5xl leading-[1.05] font-extrabold sm:text-6xl lg:text-7xl">
              <span className="text-[#e7ecf3]">Crack Your</span>
              <br />
              <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
                Placement
              </span>
              <br />
              <span className="text-[#e7ecf3]">With Confidence</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#8a96a8]">
              Master quantitative aptitude, logical reasoning, coding MCQs and
              more with
              <strong className="text-[#e7ecf3]"> 24,600+ questions</strong>,
              real-time leaderboards, and AI-powered analytics.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
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

            {/* Mini stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { v: "128K+", label: "Students" },
                { v: "2840+", label: "Tests" },
                { v: "85+", label: "Companies" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-lg font-bold text-transparent">
                    {s.v}
                  </div>
                  <div className="font-[JetBrains_Mono,monospace] text-xs text-[#5b6577]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="animate-slide-up relative hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="rounded-3xl border border-[#212a37] bg-[#10151d] p-6 shadow-2xl">
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
                  <div className="rounded-xl border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.08)] p-3">
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
                              ? "border-[#6ee7c9] bg-[rgba(110,231,201,0.15)] text-[#6ee7c9]"
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

              {/* Floating cards */}
              <div className="animate-float absolute -top-6 -right-6 rounded-2xl border border-[#212a37] bg-[#10151d] p-4 shadow-xl">
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
                className="animate-float absolute -bottom-6 -left-6 rounded-2xl border border-[#212a37] bg-[#10151d] p-4 shadow-xl"
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
          </div>
        </div>
      </section>

      {/* Company Logos ticker */}
      <section className="overflow-hidden border-y border-[#212a37] bg-[#10151d] py-12">
        <div className="mb-6 text-center">
          <p className="font-[JetBrains_Mono,monospace] text-[12.5px] text-[#5b6577]">
            Questions from top company placement drives
          </p>
        </div>
        <div
          className="flex gap-8"
          style={{ animation: "ticker 25s linear infinite" }}
        >
          {[...companies, ...companies].map((c, i) => (
            <div
              key={i}
              className="shrink-0 cursor-default rounded-lg border border-[#212a37] bg-[#141b25] px-6 py-2 text-sm font-semibold whitespace-nowrap text-[#8a96a8] transition-colors hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
            >
              {c}
            </div>
          ))}
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-4xl font-bold">
                Explore{" "}
                <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
                  Categories
                </span>
              </h2>
              <p className="mx-auto max-w-xl text-[#8a96a8] sm:mx-0">
                Pick a category and start practicing from thousands of curated
                questions across every placement topic.
              </p>
            </div>
            <Link
              href="/categories"
              className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#6ee7c9] transition-colors hover:text-[#8ef2d6] sm:flex"
            >
              View all
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

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
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="group rounded-2xl border border-[#212a37] bg-[#10151d] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#3a4a5e] hover:shadow-lg"
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110"
                      style={{
                        borderColor: `${style.color}40`,
                        backgroundColor: `${style.color}14`,
                        color: style.color,
                      }}
                    >
                      <style.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-1.5 flex items-center gap-1.5 font-[Space_Grotesk,sans-serif] font-semibold">
                      {category.name}
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-[#6ee7c9] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[#8a96a8]">
                      {category.description ||
                        "Practice curated questions on this topic."}
                    </p>
                    {subCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#212a37] bg-[#141b25] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] text-[#8a96a8]">
                        {subCount} subtopic{subCount === 1 ? "" : "s"}
                      </span>
                    )}
                  </Link>
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

      {/* Features Grid */}
      <section className="border-y border-[#212a37] bg-[#10151d] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-4xl font-bold">
              Built for{" "}
              <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text text-transparent">
                Serious Learners
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-[#8a96a8]">
              Every feature designed to maximize your preparation efficiency and
              keep you motivated.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-[#212a37] bg-[#0a0e14] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#3a4a5e] hover:shadow-lg"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110"
                  style={{
                    borderColor: `${f.color}40`,
                    backgroundColor: `${f.color}14`,
                    color: f.color,
                  }}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-[Space_Grotesk,sans-serif] font-semibold">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#8a96a8]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border p-12 text-center"
          style={{
            borderColor: "rgba(110,231,201,0.25)",
            background: "linear-gradient(135deg, rgba(16,26,25,0.9), rgba(30,20,45,0.9))",
          }}
        >
          <div
            className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(110,231,201,0.18)" }}
          />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-[JetBrains_Mono,monospace] text-xs font-medium text-white/80">
              <Zap className="h-3.5 w-3.5 text-[#6ee7c9]" />
              Free to start, forever
            </div>
            <h2 className="mb-4 font-[Space_Grotesk,sans-serif] text-2xl font-extrabold text-white md:text-5xl">
              Ready to ace your next placement?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/70">
              Join thousands of students preparing smarter with AptiCore.
              Start free today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register"
                className="flex items-center gap-2 rounded-xl bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-8 py-4 text-sm font-bold text-[#06120d] shadow-[0_0_28px_rgba(110,231,201,0.3)] transition-all hover:-translate-y-1 hover:brightness-105"
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              {[
                "No credit card required",
                "Free forever plan",
                "Instant results",
              ].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#3ecf8e]" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}