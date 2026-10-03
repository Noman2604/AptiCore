"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Search,
  Building2,
  Clock,
  HelpCircle,
  Play,
  ArrowRight,
  Flame,
  CheckCircle2,
  Filter,
  Layers,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react"

interface CompanyMock {
  id: string
  company: string
  title: string
  category: string
  questions: number
  durationMinutes: number
  difficulty: "Easy" | "Medium" | "Hard"
  roles: string
  accent: string
  href: string
  featured?: boolean
}

const COMPANY_MOCKS: CompanyMock[] = [
  {
    id: "tcs-nqt-2026",
    company: "TCS",
    title: "TCS NQT Full-Length Mock Test",
    category: "National Qualifier Test",
    questions: 80,
    durationMinutes: 90,
    difficulty: "Medium",
    roles: "Ninja & Digital Packages",
    accent: "#38bdf8",
    href: "/dashboard/tests?category=quantitative",
    featured: true,
  },
  {
    id: "infosys-sp-2026",
    company: "Infosys",
    title: "Infosys Placement Assessment Mock",
    category: "Springboard Hiring",
    questions: 54,
    durationMinutes: 65,
    difficulty: "Medium",
    roles: "Systems Engineer & DSE",
    accent: "#a78bfa",
    href: "/dashboard/tests?category=logical-reasoning",
    featured: true,
  },
  {
    id: "wipro-nlth-2026",
    company: "Wipro",
    title: "Wipro Elite NLTH Aptitude Challenge",
    category: "Elite National Talent",
    questions: 60,
    durationMinutes: 60,
    difficulty: "Medium",
    roles: "Project Engineer",
    accent: "#10b981",
    href: "/dashboard/tests?category=quantitative",
    featured: true,
  },
  {
    id: "accenture-cog-2026",
    company: "Accenture",
    title: "Accenture Cognitive & Technical Mock",
    category: "Campus Assessment",
    questions: 90,
    durationMinutes: 90,
    difficulty: "Hard",
    roles: "ASE & FSE Roles",
    accent: "#f472b6",
    href: "/dashboard/tests?category=coding-mcqs",
  },
  {
    id: "cognizant-gen-2026",
    company: "Cognizant",
    title: "Cognizant GenC Elevate Assessment",
    category: "Campus Recruitment",
    questions: 75,
    durationMinutes: 80,
    difficulty: "Medium",
    roles: "GenC & GenC Next",
    accent: "#38bdf8",
    href: "/dashboard/tests?category=verbal-ability",
  },
  {
    id: "amazon-oa-2026",
    company: "Amazon",
    title: "Amazon SDE Online Assessment MCQs",
    category: "SDE Hiring Assessment",
    questions: 40,
    durationMinutes: 60,
    difficulty: "Hard",
    roles: "SDE-1 & Internships",
    accent: "#f5a623",
    href: "/dashboard/tests?category=coding-mcqs",
  },
]

interface CategoryModule {
  slug: string
  title: string
  subtitle: string
  icon: string
  questionCount: number
  testDuration: string
  href: string
}

const PRACTICE_TRACKS: CategoryModule[] = [
  {
    slug: "quantitative",
    title: "Quantitative Aptitude",
    subtitle: "Percentages, Profit & Loss, Time & Work, Speed & Distance, Probability",
    icon: "01",
    questionCount: 420,
    testDuration: "30-45 min",
    href: "/dashboard/tests?category=quantitative",
  },
  {
    slug: "logical-reasoning",
    title: "Logical Reasoning",
    subtitle: "Syllogisms, Seating Arrangements, Blood Relations, Coding-Decoding",
    icon: "02",
    questionCount: 380,
    testDuration: "30-40 min",
    href: "/dashboard/tests?category=logical-reasoning",
  },
  {
    slug: "verbal-ability",
    title: "Verbal Ability",
    subtitle: "Reading Comprehension, Sentence Correction, Para Jumbles, Vocabulary",
    icon: "03",
    questionCount: 310,
    testDuration: "25-35 min",
    href: "/dashboard/tests?category=verbal-ability",
  },
  {
    slug: "coding-mcqs",
    title: "Coding & Technical MCQs",
    subtitle: "Data Structures, Algorithms, OOPs, DBMS, Operating Systems, C/Java/Python",
    icon: "04",
    questionCount: 550,
    testDuration: "40-60 min",
    href: "/dashboard/tests?category=coding-mcqs",
  },
]

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"all" | "company" | "tracks">("all")

  const filteredCompanyMocks = useMemo(() => {
    return COMPANY_MOCKS.filter((mock) => {
      const matchSearch =
        mock.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mock.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mock.roles.toLowerCase().includes(searchQuery.toLowerCase())
      const matchDiff =
        selectedDifficulty === "all" ||
        mock.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      return matchSearch && matchDiff
    })
  }, [searchQuery, selectedDifficulty])

  const filteredTracks = useMemo(() => {
    return PRACTICE_TRACKS.filter((track) => {
      return (
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="mb-10 text-center">
          <div className="section-eyebrow mx-auto mb-3">
            <span className="section-eyebrow-dot" />
            <span>Placement Tests &amp; Company Mocks</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simulate Actual Campus Assessment Tests
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Practice full-length company recruitment mocks modeled directly after TCS, Infosys, Wipro, and Accenture patterns, or master modular aptitude sprints.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-3 shadow-xs">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === "all"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Tests ({COMPANY_MOCKS.length + PRACTICE_TRACKS.length})
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === "company"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-amber-500" />
              Company Mocks ({COMPANY_MOCKS.length})
            </button>
            <button
              onClick={() => setActiveTab("tracks")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === "tracks"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-500" />
              Curriculum Tracks ({PRACTICE_TRACKS.length})
            </button>
          </div>

          {/* Search & Difficulty Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tests or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-8.5 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* SECTION 1: Company Placement Mocks */}
        {(activeTab === "all" || activeTab === "company") && (
          <div className="mb-14">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase">
                  Company Placement Papers (2026 Pattern)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Exact timed mock assessments matching corporate recruitment patterns
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                Showing {filteredCompanyMocks.length} mock papers
              </span>
            </div>

            {filteredCompanyMocks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                No company mocks matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCompanyMocks.map((mock) => (
                  <div
                    key={mock.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-emerald-500/40"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className="rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider"
                          style={{
                            borderColor: `${mock.accent}40`,
                            backgroundColor: `${mock.accent}12`,
                            color: mock.accent,
                          }}
                        >
                          {mock.company}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            mock.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : mock.difficulty === "Medium"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {mock.difficulty}
                        </span>
                      </div>

                      {/* Title & Info */}
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                        {mock.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {mock.roles}
                      </p>

                      {/* Stats */}
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/80" />
                          <span className="font-mono">{mock.questions}</span> Questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/80" />
                          <span className="font-mono">{mock.durationMinutes}</span> Mins
                        </span>
                      </div>
                    </div>

                    <Link
                      href={mock.href}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500 hover:text-white"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Start Mock Exam</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: Topic Curriculum Tracks */}
        {(activeTab === "all" || activeTab === "tracks") && (
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase">
                Curriculum Topic Sprints
              </h2>
              <p className="text-xs text-muted-foreground">
                Targeted practice modules to strengthen specific aptitude domains
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredTracks.map((track) => (
                <Link
                  key={track.slug}
                  href={track.href}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-emerald-500/40"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {track.icon}
                      </span>
                      <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {track.testDuration}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                      {track.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {track.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="font-mono">{track.questionCount} Questions</span>
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <span>Practice</span>
                      <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
