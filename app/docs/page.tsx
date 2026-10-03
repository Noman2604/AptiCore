"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BlurFade } from "@/components/magicui/blur-fade"
import { toast } from "sonner"
import {
  BookOpen,
  Search,
  Code,
  Terminal,
  Database,
  Shield,
  Settings,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  ExternalLink,
  Menu,
  X,
  Zap,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Info,
  Compass,
  FileCode,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DocItem {
  id: string
  label: string
  icon: any
  category: string
  badge?: string
}

interface SidebarSection {
  title: string
  items: DocItem[]
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction", icon: BookOpen, category: "Getting Started" },
      { id: "quick-start", label: "Quick Start Guide", icon: Terminal, category: "Getting Started", badge: "Popular" },
      { id: "account-setup", label: "Account & College Setup", icon: Settings, category: "Getting Started" },
    ],
  },
  {
    title: "Core Features",
    items: [
      { id: "practice-tests", label: "Practice Tests & Simulator", icon: Clock, category: "Core Features", badge: "Core" },
      { id: "categories-syllabus", label: "Categories & Question Bank", icon: Database, category: "Core Features" },
      { id: "leaderboard-xp", label: "Leaderboard, XP & Streaks", icon: Award, category: "Core Features" },
      { id: "analytics", label: "Performance Analytics", icon: TrendingUp, category: "Core Features" },
    ],
  },
  {
    title: "Company Patterns",
    items: [
      { id: "company-patterns", label: "TCS, Infosys & Wipro Drives", icon: Building2, category: "Company Patterns", badge: "Updated" },
    ],
  },
  {
    title: "Developer & API",
    items: [
      { id: "api-authentication", label: "Authentication & Headers", icon: Shield, category: "Developer & API" },
      { id: "api-endpoints", label: "REST Endpoints", icon: Code, category: "Developer & API" },
      { id: "api-rate-limits", label: "Rate Limits & Error Codes", icon: Lock, category: "Developer & API" },
    ],
  },
]

interface DocContentData {
  title: string
  category: string
  badge?: string
  lastUpdated: string
  readTime: string
  description: string
  sections: {
    heading?: string
    paragraphs?: string[]
    bulletPoints?: string[]
    callout?: {
      type: "tip" | "info" | "warning"
      title: string
      message: string
    }
    table?: {
      headers: string[]
      rows: string[][]
    }
    codeBlock?: {
      language: string
      code: string
    }
  }[]
}

const docsData: Record<string, DocContentData> = {
  introduction: {
    title: "Introduction to AptiCore",
    category: "Getting Started",
    badge: "v2.4",
    lastUpdated: "September 2026",
    readTime: "3 min read",
    description:
      "AptiCore is an open-access campus recruitment and aptitude acceleration platform designed specifically for engineering students across India.",
    sections: [
      {
        heading: "Platform Overview",
        paragraphs: [
          "Campus recruitment examinations demand high-velocity numerical agility, logical deduction, and verbal pattern recognition. However, engineering curriculums typically focus on academic theory rather than speed-based competitive screening.",
          "AptiCore bridges this gap by offering over 24,600 verified practice questions, full-screen timed exam simulators, section-wise negative marking schemes, and diagnostic peer analytics — completely free without paywalls or subscriptions.",
        ],
      },
      {
        heading: "Core Architecture & Capabilities",
        bulletPoints: [
          "Over 24,600+ questions across 20+ specialized quantitative, logical, verbal, and technical coding categories.",
          "Sectional Countdown Simulators calibrated to actual IT hiring drives (TCS NQT, Infosys DSE, Wipro Elite, Cognizant, Accenture).",
          "Comprehensive Diagnostic Reports mapping speed per question, topic mastery percentage, and weak area alerts.",
          "Real-time National & College Leaderboards with XP scoring and active preparation streaks.",
          "Sub-second test rendering with full light/dark theme adaptation for late-night study sessions.",
        ],
        callout: {
          type: "tip",
          title: "Pro-Tip for Freshers",
          message:
            "Start by taking a 15-minute diagnostic test in Quantitative Aptitude to establish your baseline speed and accuracy benchmark.",
        },
      },
      {
        heading: "Who Is AptiCore Built For?",
        paragraphs: [
          "AptiCore is engineered for pre-final and final-year B.Tech, B.E., MCA, and BCA students preparing for on-campus drives, off-campus hiring, and competitive engineering recruitment tests.",
        ],
      },
    ],
  },

  "quick-start": {
    title: "Quick Start Guide",
    category: "Getting Started",
    badge: "Essential",
    lastUpdated: "September 2026",
    readTime: "4 min read",
    description:
      "Follow this streamlined 4-step walkthrough to create your free account, take your first mock exam, and analyze your diagnostic performance.",
    sections: [
      {
        heading: "Step 1: Create Your Free Account",
        paragraphs: [
          "Visit the Registration page to create your student account. Enter your full name, university email, and a secure password. You'll receive a 6-digit verification code to confirm your email.",
        ],
        bulletPoints: [
          "No credit card or payment information required.",
          "Instant access to all question categories and full-length tests upon email verification.",
        ],
      },
      {
        heading: "Step 2: Explore Categories & Practice Sets",
        paragraphs: [
          "Navigate to the Practice Tests section. Filter by category: Quantitative, Logical Reasoning, Verbal Ability, or Core CS. Select your difficulty level (Beginner, Intermediate, Advanced) or target company pattern.",
        ],
        callout: {
          type: "info",
          title: "Diagnostic Mode",
          message:
            "Untimed practice mode lets you inspect step-by-step explanations immediately after submitting an answer.",
        },
      },
      {
        heading: "Step 3: Launch a Timed Exam",
        paragraphs: [
          "When you are ready for exam conditions, launch a Timed Mock Test. The interface switches to full-screen mode with an active countdown timer, question navigation palette, and review flags.",
        ],
        table: {
          headers: ["Mode", "Timer", "Review Screen", "Negative Marking"],
          rows: [
            ["Practice Mode", "Optional", "Instant Solution", "Configurable"],
            ["Timed Test", "Strict Countdown", "Post-Submission", "Company Calibrated"],
            ["Live Contest", "Global Synchronous", "Leaderboard Reveal", "Strict -0.25"],
          ],
        },
      },
      {
        heading: "Step 4: Review Your Analytics",
        paragraphs: [
          "Upon test submission, inspect your comprehensive performance breakdown: overall score, accuracy percentage, time spent per question, and recommended focus topics.",
        ],
      },
    ],
  },

  "account-setup": {
    title: "Account & College Setup",
    category: "Getting Started",
    badge: "Settings",
    lastUpdated: "September 2026",
    readTime: "3 min read",
    description:
      "Configure your student profile, associate your institution for college leaderboards, and customize target recruitment drive preferences.",
    sections: [
      {
        heading: "Setting Up Your Profile",
        paragraphs: [
          "Your profile settings help AptiCore tailor test recommendations and align your ranking on regional university leaderboards.",
        ],
        bulletPoints: [
          "College Name & University: Links your profile to your campus cohort and department leaderboard.",
          "Target Companies: Prioritizes questions matching your shortlisted companies (e.g., TCS, Infosys, Capgemini).",
          "Graduation Year: Customizes test recommendations based on upcoming campus drive schedules.",
        ],
      },
      {
        heading: "Email Verification & Account Recovery",
        paragraphs: [
          "A verified email ensures your streak records, test history, and certificates are securely backed up. If you ever lose access to your account, you can reset your credentials via one-time magic links.",
        ],
        callout: {
          type: "warning",
          title: "Institutional Domains",
          message:
            "If your college provides a .edu or institutional email, we recommend using it to automatically unlock verified campus leaderboards.",
        },
      },
    ],
  },

  "practice-tests": {
    title: "Practice Tests & Exam Simulator",
    category: "Core Features",
    badge: "Interactive",
    lastUpdated: "September 2026",
    readTime: "5 min read",
    description:
      "Understand the mechanics of AptiCore's timed test engine, anti-cheat features, question palette, and negative marking calibration.",
    sections: [
      {
        heading: "The Exam Simulator Interface",
        paragraphs: [
          "AptiCore's exam interface is modeled after the software used in actual IT recruitment drives (e.g., TCS iON, Infosys Assessment Platform).",
        ],
        bulletPoints: [
          "Full-screen lock: Minimizes accidental tab switching and replicates real exam pressure.",
          "Question Palette: Color-coded status dots indicate Answered (Green), Unanswered (Red), Marked for Review (Purple), and Not Visited (Gray).",
          "Sectional Countdown Timers: Enforces strict time budgets per section with auto-advance upon expiry.",
        ],
      },
      {
        heading: "Scoring & Marking Schemes",
        paragraphs: [
          "Different recruitment drives employ varying evaluation models. AptiCore allows you to toggle between standard marking formats:",
        ],
        table: {
          headers: ["Drive / Standard", "Correct", "Incorrect", "Notes"],
          rows: [
            ["Standard Practice", "+1.00", "0.00", "No penalty for incorrect answers"],
            ["TCS NQT Pattern", "+1.00 or +2.00", "-0.25 to -0.50", "Negative marking on select sections"],
            ["Infosys Assessment", "+1.00", "0.00", "Sectional cutoffs mandatory"],
            ["Cognizant GenC", "+1.00", "0.00", "Automated adaptive difficulty progression"],
          ],
        },
      },
      {
        heading: "Submission & Auto-Evaluation",
        paragraphs: [
          "When the exam timer expires, your test is automatically evaluated by the server. Your percentile rank and XP rewards are computed in real time.",
        ],
      },
    ],
  },

  "categories-syllabus": {
    title: "Categories & Question Bank",
    category: "Core Features",
    badge: "24.6K+ MCQs",
    lastUpdated: "September 2026",
    readTime: "4 min read",
    description:
      "A complete guide to AptiCore's topic classification across Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Core Computer Science.",
    sections: [
      {
        heading: "1. Quantitative Aptitude",
        paragraphs: [
          "Focuses on arithmetic, algebra, geometry, and data interpretation with time-saving mathematical shortcuts.",
        ],
        bulletPoints: [
          "Arithmetic: Percentages, Profit & Loss, Simple & Compound Interest, Ratio & Proportion.",
          "Time & Work: Pipes & Cisterns, Work Efficiency, Alternate Days.",
          "Speed, Time & Distance: Trains, Boats & Streams, Relative Velocity.",
          "Modern Math: Permutation & Combination, Probability, Progressions (AP/GP).",
        ],
      },
      {
        heading: "2. Logical & Analytical Reasoning",
        paragraphs: [
          "Tests structural deduction, pattern inference, and spatial arrangement under strict time conditions.",
        ],
        bulletPoints: [
          "Deductive Logic: Syllogisms, Blood Relations, Direction Sense.",
          "Arrangements: Linear, Circular, Floor Puzzles, and Matrix Grids.",
          "Series & Coding: Alpha-numeric series, Coding-Decoding, Odd One Out.",
        ],
      },
      {
        heading: "3. Verbal Ability & Reading Comprehension",
        paragraphs: [
          "Assesses grammatical precision, vocabulary in context, reading speed, and paragraph reconstruction.",
        ],
        bulletPoints: [
          "Grammar: Sentence Correction, Spotting Errors, Active/Passive Voice.",
          "Vocabulary: Synonyms, Antonyms, Idioms, Contextual Fillers.",
          "Reading Comprehension: Tone deduction, Central Theme, Fact-based questions.",
        ],
      },
      {
        heading: "4. Core CS & Technical MCQs",
        paragraphs: [
          "Crucial for software engineering and developer roles at product and services companies.",
        ],
        bulletPoints: [
          "Data Structures & Algorithms: Arrays, Linked Lists, Trees, Graphs, Sorting & Searching.",
          "Core Subjects: Operating Systems, DBMS (SQL queries & normalization), Computer Networks, OOPs.",
        ],
      },
    ],
  },

  "leaderboard-xp": {
    title: "Leaderboard, XP & Streaks",
    category: "Core Features",
    badge: "Gamification",
    lastUpdated: "September 2026",
    readTime: "3 min read",
    description:
      "Learn how XP points are calculated, how active daily streaks multiply your score, and how college leaderboards foster healthy competition.",
    sections: [
      {
        heading: "Experience Points (XP) Engine",
        paragraphs: [
          "Every practice session and completed test awards XP based on question difficulty, test duration, and overall accuracy:",
        ],
        table: {
          headers: ["Action", "XP Awarded", "Multiplier Bonus"],
          rows: [
            ["Correct Question (Easy)", "+10 XP", "1.0x Base"],
            ["Correct Question (Medium)", "+15 XP", "1.2x on 7+ Streak"],
            ["Correct Question (Hard)", "+25 XP", "1.5x on 14+ Streak"],
            ["Full Mock Test Completed (>80% Accuracy)", "+100 XP", "Top 10% Milestone Bonus"],
            ["Daily Practice Streak Bonus", "+30 XP / day", "Scales with consecutive days"],
          ],
        },
      },
      {
        heading: "Global vs College Leaderboards",
        paragraphs: [
          "AptiCore supports both a National Global Leaderboard and a Campus-Specific Leaderboard. The campus leaderboard lets you compete directly against peers in your university or department.",
        ],
        callout: {
          type: "tip",
          title: "Streak Protection",
          message:
            "Completing at least one 5-minute micro practice quiz each day keeps your streak badge active and preserves your multiplier.",
        },
      },
    ],
  },

  analytics: {
    title: "Performance Analytics",
    category: "Core Features",
    badge: "Diagnostics",
    lastUpdated: "September 2026",
    readTime: "4 min read",
    description:
      "Deep dive into AptiCore's diagnostic analytics: accuracy trends, speed vs precision graphs, and automated weak area recommendations.",
    sections: [
      {
        heading: "Understanding Your Metrics",
        paragraphs: [
          "Scoring high in aptitude requires balancing speed and accuracy. AptiCore graphs your performance along two critical axes:",
        ],
        bulletPoints: [
          "Accuracy Rate (%): Percentage of attempted questions answered correctly.",
          "Average Pace (Seconds / Question): Time taken on correct vs incorrect attempts.",
          "Negative Penalty Drag: Points lost due to hurried, incorrect guesses.",
        ],
      },
      {
        heading: "Automated Weak-Area Recommendations",
        paragraphs: [
          "If our engine notices your accuracy drops below 60% in specific topics (e.g., Permutations or Syllogisms), your dashboard highlights targeted micro-practice drills to reinforce the foundational formulas.",
        ],
      },
    ],
  },

  "company-patterns": {
    title: "TCS, Infosys & Wipro Drives",
    category: "Company Patterns",
    badge: "Updated 2026",
    lastUpdated: "September 2026",
    readTime: "5 min read",
    description:
      "Detailed syllabus mapping, section-wise timing limits, and question distribution for India's major mass and premium recruitment drives.",
    sections: [
      {
        heading: "TCS NQT (National Qualifier Test)",
        paragraphs: [
          "TCS NQT evaluates candidates through a two-stage cognitive and technical test. AptiCore's TCS track mirrors this exact structure:",
        ],
        table: {
          headers: ["Section", "Questions", "Duration", "Cutoff Focus"],
          rows: [
            ["Numerical Ability", "26 Qs", "40 mins", "High arithmetic weightage"],
            ["Verbal Ability", "24 Qs", "30 mins", "Error spotting & passage completion"],
            ["Reasoning Ability", "30 Qs", "50 mins", "Puzzles, data sufficiency & logic"],
            ["Hands-on Coding", "2 Problems", "45 mins", "Array & string manipulation"],
          ],
        },
      },
      {
        heading: "Infosys Assessment Pattern",
        paragraphs: [
          "Infosys tests have stringent section-level timing with no option to toggle between sections once completed:",
        ],
        bulletPoints: [
          "Mathematical Thinking (10 Qs, 35 mins) — Advanced word problems.",
          "Logical Reasoning (15 Qs, 25 mins) — Seating arrangements and direction grids.",
          "Verbal Ability (20 Qs, 20 mins) — Fast reading comprehension.",
          "Pseudocode & Technical (5 Qs, 10 mins) — Code dry-running and recursion trace.",
        ],
      },
      {
        heading: "Wipro Elite & Cognizant GenC",
        paragraphs: [
          "Wipro and Cognizant emphasize quantitative basics and communication skills. Practice with AptiCore's curated company tracks to master their recurring question formats.",
        ],
      },
    ],
  },

  "api-authentication": {
    title: "Authentication & Headers",
    category: "Developer & API",
    badge: "REST API",
    lastUpdated: "September 2026",
    readTime: "3 min read",
    description:
      "Learn how to authenticate requests with AptiCore API using JSON Web Tokens (JWT) and required authorization headers.",
    sections: [
      {
        heading: "Bearer Token Authentication",
        paragraphs: [
          "All private requests to AptiCore's REST API must include a valid JWT token in the Authorization header. You receive this token upon logging in via the /api/auth/login endpoint.",
        ],
        codeBlock: {
          language: "http",
          code: `GET /api/results HTTP/1.1
Host: apticore.in
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json`,
        },
      },
      {
        heading: "Token Expiry & Refresh",
        paragraphs: [
          "Access tokens are valid for 7 days. If a request returns HTTP 401 Unauthorized, re-authenticate using the login endpoint to obtain a fresh token.",
        ],
        callout: {
          type: "warning",
          title: "Security Best Practice",
          message:
            "Never expose your JWT token in client-side public GitHub repositories or unauthenticated web hooks.",
        },
      },
    ],
  },

  "api-endpoints": {
    title: "REST Endpoints",
    category: "Developer & API",
    badge: "v1.0",
    lastUpdated: "September 2026",
    readTime: "5 min read",
    description:
      "Comprehensive reference for core API routes handling tests, submissions, categories, and leaderboard data.",
    sections: [
      {
        heading: "1. Fetch Available Categories",
        paragraphs: [
          "Retrieve all active test categories, subcategories, and question counts.",
        ],
        codeBlock: {
          language: "bash",
          code: `curl -X GET "https://apticore.in/api/categories" \\
  -H "Accept: application/json"`,
        },
      },
      {
        heading: "2. Submit Test Results",
        paragraphs: [
          "Record a completed test attempt with user answers, score, accuracy, and elapsed duration.",
        ],
        codeBlock: {
          language: "json",
          code: `// POST /api/results
{
  "testId": "651f8a92b3c4...",
  "attemptId": "att_9823412",
  "totalQuestions": 25,
  "attemptedQuestions": 24,
  "correctAnswers": 21,
  "timeSpentSeconds": 1120,
  "answers": [
    { "questionId": "q_101", "selectedOption": 2, "isCorrect": true }
  ]
}`,
        },
      },
      {
        heading: "3. Query Global Leaderboard",
        paragraphs: [
          "Fetches top ranked students sorted by XP and overall accuracy.",
        ],
        codeBlock: {
          language: "bash",
          code: `curl -X GET "https://apticore.in/api/leaderboard?limit=10" \\
  -H "Accept: application/json"`,
        },
      },
    ],
  },

  "api-rate-limits": {
    title: "Rate Limits & Error Codes",
    category: "Developer & API",
    badge: "Policies",
    lastUpdated: "September 2026",
    readTime: "3 min read",
    description:
      "Standard HTTP status codes, rate limiting policies, and JSON error response structures returned by the AptiCore API.",
    sections: [
      {
        heading: "Rate Limiting Thresholds",
        paragraphs: [
          "To guarantee system stability during nationwide placement test windows, API requests are rate-limited per IP address:",
        ],
        table: {
          headers: ["Endpoint Tier", "Limit", "Window", "Action on Breach"],
          rows: [
            ["Public GET endpoints", "120 requests", "1 minute", "HTTP 429 Too Many Requests"],
            ["Test Submission (POST)", "30 requests", "1 minute", "Temporary 30s backoff cooldown"],
            ["Auth Endpoints (Login/Register)", "10 requests", "1 minute", "Exponential delay"],
          ],
        },
      },
      {
        heading: "Standard Error Responses",
        paragraphs: [
          "All API error responses return standard JSON objects with an explicit error description and status code:",
        ],
        codeBlock: {
          language: "json",
          code: `// HTTP 400 Bad Request Example
{
  "success": false,
  "error": "Password must be at least 8 characters long."
}`,
        },
      },
    ],
  },
}

export default function DocsPage() {
  const [activeDocId, setActiveDocId] = useState("introduction")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const activeDoc = docsData[activeDocId] || docsData.introduction

  // Flattened list of all items for Previous / Next navigation
  const allDocItems = useMemo(() => {
    return sidebarSections.flatMap((s) => s.items)
  }, [])

  const currentIndex = allDocItems.findIndex((item) => item.id === activeDocId)
  const prevDoc = currentIndex > 0 ? allDocItems[currentIndex - 1] : null
  const nextDoc = currentIndex < allDocItems.length - 1 ? allDocItems[currentIndex + 1] : null

  // Filtered sidebar items based on live search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sidebarSections

    const q = searchQuery.toLowerCase()
    return sidebarSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.items.length > 0)
  }, [searchQuery])

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Code snippet copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Subtle decorative glow in background */}
        <div className="pointer-events-none absolute top-20 left-1/2 h-[350px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(110,231,201,0.05)_0%,transparent_70%)]" />

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <BlurFade delay={0.1} inView>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-emerald-600 dark:text-[#6ee7c9]">
              <BookOpen className="h-3.5 w-3.5" />
              <span>AptiCore Knowledge Base &amp; Documentation</span>
            </div>

            <h1 className="mb-3 font-[Space_Grotesk,sans-serif] text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Documentation &amp;{" "}
              <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                Guides
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Everything you need to master AptiCore — exam simulator mechanics, company drive syllabi, diagnostic analytics, and developer APIs.
            </p>
          </BlurFade>
        </div>

        {/* ── Main Docs Layout (Sidebar + Content) ──────────────────── */}
        <div className="relative flex flex-col gap-8 lg:flex-row">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg lg:hidden active:scale-95"
            aria-label="Toggle docs navigation"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* ── Left Sidebar ─────────────────────────────────────────── */}
          <aside
            className={cn(
              "w-full shrink-0 lg:w-72",
              sidebarOpen
                ? "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl p-6 pt-24 overflow-y-auto lg:static lg:p-0 lg:bg-transparent"
                : "hidden lg:block"
            )}
          >
            <div className="sticky top-28 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-surface pl-10 pr-4 text-xs sm:text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Navigation Sections */}
              <div className="space-y-6">
                {filteredSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-2 px-3 font-[Space_Grotesk,sans-serif] text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = activeDocId === item.id
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveDocId(item.id)
                              setSidebarOpen(false)
                              window.scrollTo({ top: 180, behavior: "smooth" })
                            }}
                            className={cn(
                              "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 text-left",
                              isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-[#6ee7c9] shadow-2xs font-semibold"
                                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <item.icon
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  isActive
                                    ? "text-emerald-600 dark:text-[#6ee7c9]"
                                    : "text-muted-foreground group-hover:text-foreground"
                                )}
                              />
                              <span className="truncate">{item.label}</span>
                            </div>

                            {item.badge && (
                              <span
                                className={cn(
                                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                  isActive
                                    ? "bg-emerald-500/20 text-emerald-600 dark:text-[#6ee7c9]"
                                    : "bg-surface border border-border/80 text-muted-foreground/80"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {filteredSections.length === 0 && (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No documentation matched &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ── Main Documentation Content Area ─────────────────────── */}
          <div className="min-w-0 flex-1">
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-10 shadow-sm backdrop-blur-md dark:border-[#212a37] dark:bg-[#0c1017]">
              {/* Illuminated Top Bar */}
              <div className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-48 -translate-x-1/2 bg-linear-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(110,231,201,0.5)]" />

              {/* Breadcrumb & Metadata Strip */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Docs</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-medium text-foreground">{activeDoc.category}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-semibold text-emerald-600 dark:text-[#6ee7c9]">
                    {activeDoc.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {activeDoc.readTime}
                  </span>
                  <span>•</span>
                  <span>Updated {activeDoc.lastUpdated}</span>
                </div>
              </div>

              {/* Main Document Title */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2.5">
                  <h2 className="font-[Space_Grotesk,sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {activeDoc.title}
                  </h2>
                  {activeDoc.badge && (
                    <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-[Space_Grotesk,sans-serif] text-[11px] font-bold text-emerald-600 dark:text-[#6ee7c9]">
                      {activeDoc.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeDoc.description}
                </p>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-8">
                {activeDoc.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3.5">
                    {sec.heading && (
                      <h3 className="font-[Space_Grotesk,sans-serif] text-lg sm:text-xl font-bold text-foreground pt-2">
                        {sec.heading}
                      </h3>
                    )}

                    {sec.paragraphs?.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-xs sm:text-sm leading-relaxed text-muted-foreground"
                      >
                        {p}
                      </p>
                    ))}

                    {/* Bullet Points */}
                    {sec.bulletPoints && (
                      <ul className="space-y-2 border-l-2 border-emerald-500/30 pl-4 my-2">
                        {sec.bulletPoints.map((item, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-foreground/85 leading-relaxed"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-[#6ee7c9]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Callout Alert Box */}
                    {sec.callout && (
                      <div
                        className={cn(
                          "rounded-2xl border p-4 text-xs sm:text-sm my-3",
                          sec.callout.type === "tip" &&
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
                          sec.callout.type === "info" &&
                            "border-indigo-500/30 bg-indigo-500/10 text-indigo-800 dark:text-indigo-300",
                          sec.callout.type === "warning" &&
                            "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                        )}
                      >
                        <div className="flex items-center gap-2 font-[Space_Grotesk,sans-serif] font-bold mb-1">
                          {sec.callout.type === "tip" && <Sparkles className="h-4 w-4" />}
                          {sec.callout.type === "info" && <Info className="h-4 w-4" />}
                          {sec.callout.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                          <span>{sec.callout.title}</span>
                        </div>
                        <p className="leading-relaxed opacity-90">{sec.callout.message}</p>
                      </div>
                    )}

                    {/* Structured Data Table */}
                    {sec.table && (
                      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface/60 my-4 shadow-2xs">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-border/80 bg-muted/60 font-[Space_Grotesk,sans-serif] font-bold text-foreground">
                            <tr>
                              {sec.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="px-4 py-3">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {sec.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="transition-colors hover:bg-muted/30"
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={cn(
                                      "px-4 py-3 leading-relaxed",
                                      cIdx === 0
                                        ? "font-semibold text-foreground"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Syntax Code Block */}
                    {sec.codeBlock && (
                      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted/40 my-4 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-border/70 bg-surface/80 px-4 py-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 font-mono font-medium">
                            <FileCode className="h-3.5 w-3.5 text-emerald-600 dark:text-[#6ee7c9]" />
                            <span>{sec.codeBlock.language.toUpperCase()}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(sec.codeBlock!.code)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-all active:scale-95"
                          >
                            {copied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-4 font-mono text-xs text-foreground/90 leading-relaxed">
                          <code>{sec.codeBlock.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Previous / Next Navigation Footer ─────────────────── */}
              <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
                {prevDoc ? (
                  <button
                    onClick={() => {
                      setActiveDocId(prevDoc.id)
                      window.scrollTo({ top: 180, behavior: "smooth" })
                    }}
                    className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground shadow-2xs hover:border-border hover:bg-muted/80 hover:text-foreground transition-all"
                  >
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <div className="text-left">
                      <div className="text-[10px] text-muted-foreground/60 uppercase">Previous</div>
                      <div className="font-semibold text-foreground">{prevDoc.label}</div>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextDoc ? (
                  <button
                    onClick={() => {
                      setActiveDocId(nextDoc.id)
                      window.scrollTo({ top: 180, behavior: "smooth" })
                    }}
                    className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground shadow-2xs hover:border-border hover:bg-muted/80 hover:text-foreground transition-all sm:ml-auto"
                  >
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground/60 uppercase">Next</div>
                      <div className="font-semibold text-foreground">{nextDoc.label}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
