"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BlurFade } from "@/components/magicui/blur-fade"
import {
  Target,
  Users,
  Award,
  Globe,
  Zap,
  Heart,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Code2,
  Trophy,
  Compass,
  GraduationCap,
  Building2,
  Clock,
  Layers,
} from "lucide-react"

const stats = [
  { value: "128,000+", label: "Active Aspirants", icon: Users, accent: "text-emerald-600 dark:text-[#6ee7c9]" },
  { value: "24,600+", label: "Placement MCQs", icon: BookOpen, accent: "text-indigo-600 dark:text-[#8b7cf6]" },
  { value: "85+", label: "Company Patterns", icon: Building2, accent: "text-amber-600 dark:text-[#f5a623]" },
  { value: "94.2%", label: "Readiness Rate", icon: Award, accent: "text-emerald-600 dark:text-[#3ecf8e]" },
]

const values = [
  {
    icon: Target,
    title: "100% Free & Accessible",
    desc: "Zero paywalls, zero locked modules. High-quality placement preparation should be a right for every engineering student, not a luxury.",
    color: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Company-Calibrated Tests",
    desc: "Every test series is modeled directly on recent hiring patterns from TCS NQT, Infosys DSE, Wipro Elite, Accenture, and Cognizant.",
    color: "indigo",
  },
  {
    icon: TrendingUp,
    title: "Precision Analytics",
    desc: "Detailed breakdowns of speed per question, topic mastery, and weak-area alerts so you spend study hours where they count most.",
    color: "amber",
  },
  {
    icon: Trophy,
    title: "Healthy Competition",
    desc: "National and college-level leaderboards, streak badges, and XP turn stressful revision into an engaging daily habit.",
    color: "purple",
  },
  {
    icon: Layers,
    title: "Step-by-Step Solutions",
    desc: "Clear explanations and shortcut formulas for every single question, helping you understand the underlying concepts quickly.",
    color: "sky",
  },
  {
    icon: Heart,
    title: "Student-Driven Evolution",
    desc: "We continuously update questions, test patterns, and platform tooling based directly on student feedback from real recruitment rounds.",
    color: "rose",
  },
]

const milestones = [
  {
    year: "2024",
    phase: "Phase 01",
    tag: "The Genesis",
    title: "The Dorm Room Prototype",
    subtitle: "Built out of personal placement frustration",
    desc: "Started in an engineering hostel room by batchmates who saw friends getting eliminated in round-1 aptitude drives. We built a minimal practice tool with 500 hand-verified TCS & Infosys questions so our batch could prepare without paying ₹15,000 to commercial coaching centers.",
    stat: "500 Test Takers",
    statSub: "Initial 3 Colleges",
    accentBorder: "border-emerald-500/40 hover:border-emerald-500/70",
    accentBadge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-[#6ee7c9]",
    accentGlow: "via-emerald-500 dark:via-[#6ee7c9]",
    accentDot: "bg-emerald-500",
    achievements: [
      "Cataloged first 500 company-verified Quant & Logic questions",
      "Conducted manual timed tests in dorm study sessions",
      "Spread organically across 3 regional engineering campuses via WhatsApp",
    ],
  },
  {
    year: "2025",
    phase: "Phase 02",
    tag: "Exponential Scaling",
    title: "100K+ Students Across 450+ Colleges",
    subtitle: "Viral adoption across Indian university communities",
    desc: "Word spread through college Telegram and Discord groups during placement season. AptiCore expanded from a local study tool into a national open-access platform, cataloging exact recruitment drive patterns for 85+ IT and product companies.",
    stat: "100,000+ Students",
    statSub: "450+ Colleges Nationwide",
    accentBorder: "border-indigo-500/40 hover:border-indigo-500/70",
    accentBadge: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-[#8b7cf6]",
    accentGlow: "via-indigo-500 dark:via-[#8b7cf6]",
    accentDot: "bg-indigo-500",
    achievements: [
      "Expanded question bank to 20,000+ categorized MCQs with formulas",
      "Curated dedicated mock tracks for TCS NQT, Infosys, and Cognizant",
      "Processed over 500,000 practice test submissions with instant scoring",
    ],
  },
  {
    year: "2026",
    phase: "Phase 03",
    tag: "Current Horizon",
    title: "The Real-Time Placement Simulation Engine",
    subtitle: "Full-screen exam conditions, live contests, and analytics",
    desc: "AptiCore evolved into a production-grade testing suite with strict anti-cheat full-screen timing conditions, live weekend campus contests, topic speed vs accuracy diagnostics, and seamless dark/light mode for late-night preparation.",
    stat: "128,000+ Aspirants",
    statSub: "94.2% Placement Readiness Rate",
    accentBorder: "border-amber-500/40 hover:border-amber-500/70",
    accentBadge: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-[#f5a623]",
    accentGlow: "via-amber-500 dark:via-[#f5a623]",
    accentDot: "bg-amber-500",
    achievements: [
      "Full-screen timed test simulator replicating actual company test screens",
      "Live global & college leaderboards with XP, ranks, and streak badges",
      "Sub-second test rendering and mobile-optimized question solving",
    ],
  },
]

const team = [
  {
    name: "Noman Patel",
    role: "CEO & Co-founder",
    avatar: "NP",
    bio: "Passionate about building scalable education tools that give tier-2 and tier-3 college students an equal opportunity.",
    bg: "from-emerald-500 to-teal-600",
  },
  {
    name: "Mrunal Waghare",
    role: "Chief Technology Officer",
    avatar: "MW",
    bio: "Architecting ultra-low latency exam timers, real-time leaderboard sync, and modern serverless infrastructures.",
    bg: "from-indigo-500 to-purple-600",
  },
  {
    name: "Shubham Kasare",
    role: "Head of Content & Curriculum",
    avatar: "SK",
    bio: "Curating and verifying thousands of company-accurate Quantitative, Logical, and Verbal questions with proven shortcut tricks.",
    bg: "from-amber-500 to-orange-600",
  },
  {
    name: "Aman Sharma",
    role: "Head of Product Design",
    avatar: "AS",
    bio: "Obsessed with intuitive, distraction-free interfaces that keep students focused during intense timed exam practice.",
    bg: "from-sky-500 to-blue-600",
  },
]


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Subtle decorative glow in background */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(110,231,201,0.06)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute top-2/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl dark:bg-[#8b7cf6]/5" />

        {/* ── 1. Hero Section ───────────────────────────────────────── */}
        <section className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-emerald-600 dark:text-[#6ee7c9]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              About AptiCore • Empowering 128,000+ Students
            </div>

            <h1 className="mb-6 font-[Space_Grotesk,sans-serif] text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.12]">
              Democratizing Campus Placements for{" "}
              <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                Every Student
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              AptiCore was created to eliminate the unfair advantage of expensive coaching centers. We provide free, company-calibrated aptitude practice, authentic timed exam simulations, and actionable analytics so every ambitious student can land their dream campus placement.
            </p>
          </BlurFade>
        </section>

        {/* ── 2. The Problem & Our Solution ─────────────────────────── */}
        <section className="relative mx-auto mt-20 max-w-5xl px-4 sm:mt-28 sm:px-6 lg:px-8">
          <BlurFade delay={0.15} inView>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Problem */}
              <div className="rounded-3xl border border-red-500/20 bg-linear-to-b from-red-500/5 to-transparent p-7 sm:p-9">
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1 font-[Space_Grotesk,sans-serif] text-xs font-bold text-red-600 dark:text-red-400">
                  The Placement Dilemma
                </div>
                <h3 className="mb-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-foreground">
                  Why students struggle with campus tests
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  Every year, over 1.5 million engineering students across India sit for recruitment drives. Yet over 70% get screened out in the very first round — not because they can&apos;t code, but because aptitude tests demand speed and pattern familiarity that college curricula never teach.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>Commercial test series charge exorbitant fees with outdated, recycled questions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>No real exam pressure simulation or section-wise timing constraints.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>Lack of diagnostic insights into whether speed or accuracy is dragging down scores.</span>
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div className="rounded-3xl border border-emerald-500/25 bg-linear-to-b from-emerald-500/5 to-transparent p-7 sm:p-9">
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1 font-[Space_Grotesk,sans-serif] text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  The AptiCore Solution
                </div>
                <h3 className="mb-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-foreground">
                  A level playing field for every aspirant
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  AptiCore provides an authentic, high-velocity testing environment that bridges the gap between campus preparation and actual hiring rounds. We offer exact pattern replicates, strict time limits, and national peer ranking — totally free of cost.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Free forever — no subscriptions, no paywalled question banks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Full-screen exam interface calibrated to exact company countdown timers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Instant accuracy analytics and step-by-step mathematical shortcut explanations.</span>
                  </li>
                </ul>
              </div>
            </div>
          </BlurFade>
        </section>

        {/* ── 3. Core Values ────────────────────────────────────────── */}
        <section className="relative mx-auto mt-20 max-w-5xl px-4 sm:mt-28 sm:px-6 lg:px-8">
          <BlurFade delay={0.2} inView>
            <div className="mb-12 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-indigo-600 dark:text-[#8b7cf6]">
                <Sparkles className="h-3.5 w-3.5" /> What Drives Us
              </div>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl text-foreground">
                Our Core Principles
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-muted-foreground">
                The standards and philosophy that shape every question, feature, and update we ship.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-md dark:border-[#212a37] dark:bg-[#0c1017]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-surface text-foreground shadow-inner transition-transform group-hover:scale-105">
                    <v.icon className="h-5 w-5 text-emerald-600 dark:text-[#6ee7c9]" />
                  </div>
                  <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-lg font-bold text-foreground">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </BlurFade>
        </section>

        {/* ── 5. Platform Timeline ──────────────────────────────────── */}
        <section className="relative mx-auto mt-20 max-w-5xl px-4 sm:mt-28 sm:px-6 lg:px-8">
          <BlurFade delay={0.3} inView>
            <div className="mb-14 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-amber-600 dark:text-[#f5a623]">
                <Clock className="h-3.5 w-3.5" /> Our Journey &amp; Milestones
              </div>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl font-extrabold sm:text-4xl text-foreground">
                From Dorm Room Idea to{" "}
                <span className="bg-linear-to-r from-emerald-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:via-[#8b7cf6] dark:to-[#f5a623]">
                  128K+ Students
                </span>
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">
                How an internal practice tool built by college batchmates transformed into a nationwide campus placement platform.
              </p>
            </div>

            {/* Alternating Interactive Roadmap Deck */}
            <div className="relative">
              {/* Desktop Central Glowing Spine */}
              <div className="pointer-events-none absolute left-1/2 top-4 bottom-4 hidden w-[2px] -translate-x-1/2 bg-linear-to-b from-emerald-500 via-indigo-500 to-amber-500 opacity-40 shadow-[0_0_12px_rgba(110,231,201,0.5)] sm:block dark:opacity-60" />

              {/* Mobile Left Glowing Spine */}
              <div className="pointer-events-none absolute left-3.5 top-4 bottom-4 block w-[2px] bg-linear-to-b from-emerald-500 via-indigo-500 to-amber-500 opacity-40 sm:hidden dark:opacity-60" />

              <div className="space-y-10 sm:space-y-14">
                {milestones.map((m, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div
                      key={m.year}
                      className="relative flex flex-col items-center pl-8 sm:pl-0"
                    >
                      {/* Desktop Center Year Hub Node */}
                      <div className="pointer-events-none absolute left-1/2 top-4 z-20 hidden -translate-x-1/2 items-center justify-center sm:flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border/80 bg-background font-[Space_Grotesk,sans-serif] text-xs font-bold text-foreground shadow-md transition-transform group-hover:scale-110">
                          {m.year}
                        </div>
                      </div>

                      {/* Mobile Left Node */}
                      <div className="pointer-events-none absolute -left-[7px] top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-xs sm:hidden">
                        <div className={m.accentDot + " h-2.5 w-2.5 rounded-full"} />
                      </div>

                      {/* Alternating Card Wrapper */}
                      <div
                        className={`w-full ${
                          isEven
                            ? "sm:w-[46%] sm:mr-auto sm:pr-4"
                            : "sm:w-[46%] sm:ml-auto sm:pl-4"
                        }`}
                      >
                        <div
                          className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#212a37] dark:bg-[#0c1017] ${m.accentBorder}`}
                        >
                          {/* Next.js style illuminated top glow line */}
                          <div
                            className={`pointer-events-none absolute top-0 left-1/2 h-[2px] w-36 -translate-x-1/2 bg-linear-to-r from-transparent ${m.accentGlow} to-transparent`}
                          />

                          {/* Phase Header */}
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-md border px-2.5 py-0.5 font-[Space_Grotesk,sans-serif] text-[11px] font-bold tracking-wider uppercase ${m.accentBadge}`}
                              >
                                {m.phase}
                              </span>
                              <span className="font-[Space_Grotesk,sans-serif] text-xs font-semibold text-muted-foreground">
                                {m.tag}
                              </span>
                            </div>
                            <span className="sm:hidden font-[Space_Grotesk,sans-serif] text-xs font-bold text-muted-foreground/80">
                              {m.year}
                            </span>
                          </div>

                          {/* Card Title & Subtitle */}
                          <h3 className="mb-1 font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                            {m.title}
                          </h3>
                          <p className="mb-3 text-xs font-medium text-emerald-600 dark:text-[#6ee7c9]">
                            {m.subtitle}
                          </p>

                          {/* Metric Pill Ribbon */}
                          <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-surface px-3 py-1.5 text-xs shadow-2xs">
                            <span className="font-[Space_Grotesk,sans-serif] font-bold text-foreground">
                              {m.stat}
                            </span>
                            <span className="text-muted-foreground/60">•</span>
                            <span className="text-muted-foreground">
                              {m.statSub}
                            </span>
                          </div>

                          {/* Narrative Description */}
                          <p className="mb-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                            {m.desc}
                          </p>

                          {/* Achievement Checklist */}
                          <div className="space-y-2 border-t border-border/60 pt-3">
                            {m.achievements.map((item) => (
                              <div key={item} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-[#6ee7c9]" />
                                <span className="text-xs text-foreground/85 leading-normal">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </BlurFade>
        </section>

        {/* ── 6. Meet the Team ──────────────────────────────────────── */}
        <section className="relative mx-auto mt-20 max-w-5xl px-4 sm:mt-28 sm:px-6 lg:px-8">
          <BlurFade delay={0.35} inView>
            <div className="mb-12 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3.5 py-1 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-sky-600 dark:text-sky-400">
                <Users className="h-3.5 w-3.5" /> The Team
              </div>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold sm:text-4xl text-foreground">
                Meet the Builders Behind AptiCore
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-muted-foreground">
                Engineers, designers, and educators working together to reshape placement preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <div
                  key={m.name}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 text-center shadow-xs backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-md dark:border-[#212a37] dark:bg-[#0c1017]"
                >
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${m.bg} font-[Space_Grotesk,sans-serif] text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105`}
                  >
                    {m.avatar}
                  </div>
                  <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground">
                    {m.name}
                  </h3>
                  <div className="mt-0.5 text-xs font-medium text-emerald-600 dark:text-[#6ee7c9]">
                    {m.role}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {m.bio}
                  </p>
                </div>
              ))}
            </div>
          </BlurFade>
        </section>
      </main>
      <Footer />
    </div>
  )
}
