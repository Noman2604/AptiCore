"use client"
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
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: Trophy,
    title: "Weekly Contests",
    desc: "Compete globally in timed contests, climb leaderboards and earn rewards",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    desc: "Full-screen exam mode with proctoring ensures fair competition",
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    icon: Flame,
    title: "Streak System",
    desc: "Maintain daily streaks to earn XP multipliers and exclusive badges",
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: Globe,
    title: "Multi-language",
    desc: "Practice in English, Hindi, and regional languages",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Lock,
    title: "Detailed Solutions",
    desc: "Every question comes with step-by-step text explanations",
    color: "text-red-500 bg-red-500/10",
  },
]

export default function LandingPage() {
 


  return (
    <div className=" min-h-screen bg-[hsl(var(--background))]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="animate-pulse-slow absolute top-1/4 -left-64 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div
          className="animate-pulse-slow absolute -right-64 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="max-w-9xl relative mx-auto grid items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-400">
              <Sparkles className="h-4 w-4" />
              <span>India's #1 Aptitude Platform</span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            </div>

            <h1 className="font-display mb-6 text-5xl leading-[1.05] font-extrabold sm:text-6xl lg:text-7xl">
              <span className="text-[hsl(var(--foreground))]">Crack Your</span>
              <br />
              <span className="gradient-text">Placement</span>
              <br />
              <span className="text-[hsl(var(--foreground))]">
                With Confidence
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              Master quantitative aptitude, logical reasoning, coding MCQs and
              more with
              <strong className="text-[hsl(var(--foreground))]">
                {" "}
                24,600+ questions
              </strong>
              , real-time leaderboards, and AI-powered analytics.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <Link
                href="/auth/register"
                className="group shadow-glow-brand flex items-center gap-2 rounded-xl bg-linear-to-br from-sky-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
              >
                Start Practicing Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contest"
                className="group flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-6 py-3.5 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--surface-hover))]"
              >
                <Play className="h-4 w-4 text-sky-400" />
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
                  <div className="font-display gradient-text text-lg font-bold">
                    {s.v}
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
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
              <div className="glass rounded-3xl border border-white/10 p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
                    TCS NQT Mock · 47:32
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
                    <p className="mb-2 text-sm font-medium">
                      Q14. If 15% of x = 20% of y, then x:y = ?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {["3:4", "4:3", "5:4", "2:3"].map((opt, i) => (
                        <button
                          key={opt}
                          className={cn(
                            "rounded-lg border p-2 text-left text-xs transition-all",
                            i === 1
                              ? "border-sky-500 bg-sky-500/20 text-sky-300"
                              : "border-white/10 hover:border-white/20"
                          )}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                    <span>Progress: 14/30</span>
                    <span className="text-emerald-400">+4 correct</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-linear-to-br from-sky-500 to-blue-600"
                      style={{ width: "47%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="glass animate-float absolute -top-6 -right-6 rounded-2xl border border-white/10 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Arjun Sharma</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      9840 XP · Top 0.1%
                    </div>
                  </div>
                  <Trophy className="h-4 w-4 text-amber-400" />
                </div>
              </div>

              <div
                className="glass animate-float absolute -bottom-6 -left-6 rounded-2xl border border-white/10 p-4 shadow-xl"
                style={{ animationDelay: "2s" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Test Completed!</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <div className="font-bold text-emerald-400">87%</div>
                    <div className="text-[hsl(var(--muted-foreground))]">
                      Score
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sky-400">#142</div>
                    <div className="text-[hsl(var(--muted-foreground))]">
                      Rank
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-400">+240</div>
                    <div className="text-[hsl(var(--muted-foreground))]">
                      XP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos ticker */}
      <section className="overflow-hidden border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-12">
        <div className="mb-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Questions from top company placement drives
          </p>
        </div>
        <div
          className="flex animate-[slide_25s_linear_infinite] gap-8"
          style={{
            animation: "ticker 25s linear infinite",
          }}
        >
          {[...companies, ...companies].map((c, i) => (
            <div
              key={i}
              className="glass shrink-0 cursor-default rounded-lg border border-white/5 px-6 py-2 text-sm font-semibold whitespace-nowrap text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              {c}
            </div>
          ))}
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </section>

      {/* Features Grid */}
      <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display mb-4 text-4xl font-bold">
              Built for <span className="gradient-text">Serious Learners</span>
            </h2>
            <p className="mx-auto max-w-xl text-[hsl(var(--muted-foreground))]">
              Every feature designed to maximize your preparation efficiency and
              keep you motivated.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card-hover group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
              >
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
                    f.color
                  )}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-linear-to-br from-sky-900/50 to-purple-900/50 p-12 text-center">
          <div className="grid-bg absolute inset-0 opacity-30" />
          <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80">
              <Zap className="h-3.5 w-3.5 text-sky-400" />
              Free to start, forever
            </div>
            <h2 className="font-display mb-4 text-2xl font-extrabold text-white md:text-5xl">
              Ready to ace your next placement?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/70">
              Join thousands of students preparing smarter with AptiCore. Start
              free today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register"
                className="shadow-glow-brand flex items-center gap-2 rounded-xl bg-linear-to-br from-sky-500 to-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:opacity-90"
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
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
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
