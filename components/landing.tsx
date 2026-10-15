"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Timer,
  BookOpen,
  ChevronRight,
  RotateCcw,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  isActive?: boolean
  subcategories?: { _id: string; name: string }[]
  questionCount?: number
}

// Concrete company test specifications
const COMPANY_BLUEPRINTS = [
  {
    id: "tcs",
    name: "TCS NQT",
    tier: "Ninja & Digital Tracks",
    totalTime: "80 minutes",
    totalQuestions: "65 questions",
    timePerQ: "48–72 seconds",
    negativeMarking: "No negative marking",
    sectionalLock: "Strict sectional time cap (no jumping back)",
    adaptive: "Non-adaptive linear progression",
    weedoutTopic: "Advanced Quantitative & Reasoning Logic",
    cutoffBenchmark: "68% overall, min 60% per section",
    sampleCompanyTopics: [
      "Percentages & Partnerships",
      "Data Sufficiency",
      "Formal Logic & Syllogisms",
      "Flowchart & Pseudo-code Analysis",
    ],
  },
  {
    id: "infosys",
    name: "Infosys SP / DSE",
    tier: "System Engineer & Specialist Programmer",
    totalTime: "100 minutes",
    totalQuestions: "54 questions",
    timePerQ: "65–110 seconds",
    negativeMarking: "No negative marking",
    sectionalLock: "Sequential section locking",
    adaptive: "Fixed question pool",
    weedoutTopic: "Mathematical Critical Thinking & Verbal Reasoning",
    cutoffBenchmark: "70% overall, strict sectional cutoffs",
    sampleCompanyTopics: [
      "Cryptarithmetic & Permutations",
      "Seating & Arrangement Puzzles",
      "Sentence Correction & Reading",
      "Data Interpretation Tables",
    ],
  },
  {
    id: "cognizant",
    name: "Cognizant GenC",
    tier: "GenC & GenC Next",
    totalTime: "90 minutes",
    totalQuestions: "70 questions",
    timePerQ: "60 seconds average",
    negativeMarking: "-0.25 on advanced tracks",
    sectionalLock: "Timed sectional boundaries",
    adaptive: "Non-adaptive",
    weedoutTopic: "Automata Fix & Quantitative Ability",
    cutoffBenchmark: "65% composite threshold",
    sampleCompanyTopics: [
      "Time, Speed & Distance",
      "Direction Sense & Coding-Decoding",
      "Bitwise Operators & C Pointers",
      "Debugging & Error Identification",
    ],
  },
  {
    id: "accenture",
    name: "Accenture ASE",
    tier: "Associate Software Engineer",
    totalTime: "90 minutes",
    totalQuestions: "90 questions",
    timePerQ: "60 seconds flat",
    negativeMarking: "No negative marking",
    sectionalLock: "Cognitive assessment precedes technical test",
    adaptive: "Tiered qualifying gate",
    weedoutTopic: "Abstract Reasoning & Pseudo-code",
    cutoffBenchmark: "Elimination after Cognitive Stage (65% cutoff)",
    sampleCompanyTopics: [
      "Visual & Abstract Reasoning",
      "Common Applications & MS Office Tech",
      "Pseudo-code Loop Invariants",
      "Network Security Basics",
    ],
  },
  {
    id: "amazon",
    name: "Amazon SDE-1 OA",
    tier: "Campus Internship & Full-time",
    totalTime: "70 minutes (Part 1)",
    totalQuestions: "28 MCQs + 2 Code Tasks",
    timePerQ: "90 seconds (MCQ segment)",
    negativeMarking: "No negative marking",
    sectionalLock: "Independent section countdowns",
    adaptive: "Difficulty scales with correct answers",
    weedoutTopic: "Data Structures, Complexity & OS Concurrency",
    cutoffBenchmark: "Top 15% percentile pool required",
    sampleCompanyTopics: [
      "Big-O Recurrence Relations",
      "Pointer Arithmetic & Memory Leaks",
      "Tree Traversals & Graph Shortest Path",
      "Workstyles & Leadership Principles",
    ],
  },
]

// Real placement questions for the live interactive simulator
const SIMULATOR_QUESTIONS = [
  {
    category: "Quantitative Reasoning",
    testTag: "TCS NQT 2025 Standard Pattern",
    timeBudget: 50,
    question:
      "A train running at 54 km/h crosses an electric pole in 16 seconds and a railway platform in 32 seconds. What is the length of the railway platform?",
    options: [
      { id: "A", text: "200 meters", isCorrect: false },
      { id: "B", text: "240 meters", isCorrect: true },
      { id: "C", text: "280 meters", isCorrect: false },
      { id: "D", text: "320 meters", isCorrect: false },
    ],
    shortcutSteps: [
      "Convert speed to m/s: 54 × (5 / 18) = 15 m/s.",
      "Length of train = Speed × Pole crossing time = 15 m/s × 16 s = 240 m.",
      "Total distance across platform = 15 m/s × 32 s = 480 m.",
      "Platform length = 480 m - 240 m = 240 m.",
    ],
    mentalNote:
      "Speed conversion rule: Multiply km/h by 5/18 to get m/s instantly.",
  },
  {
    category: "Coding & Architecture MCQ",
    testTag: "Cognizant GenC / Infosys DSE",
    timeBudget: 45,
    question:
      'What is the output of the following C code snippet?\nint arr[] = {10, 20, 30, 40};\nint *ptr = arr;\nprintf("%d", *(ptr + 2) - *(ptr));',
    options: [
      { id: "A", text: "10", isCorrect: false },
      { id: "B", text: "20", isCorrect: true },
      { id: "C", text: "30", isCorrect: false },
      { id: "D", text: "Garbage value", isCorrect: false },
    ],
    shortcutSteps: [
      "*(ptr + 2) dereferences the element at index 2, which is 30.",
      "*(ptr) dereferences the element at index 0, which is 10.",
      "Result = 30 - 10 = 20.",
    ],
    mentalNote: "Pointer arithmetic *(ptr + k) evaluates directly to arr[k].",
  },
  {
    category: "Logical Deduction",
    testTag: "Wipro Elite / Accenture ASE",
    timeBudget: 40,
    question:
      "Statements: (1) All engineers are problem-solvers. (2) Some problem-solvers are chess players. Which conclusion logically follows?",
    options: [
      { id: "A", text: "All engineers are chess players.", isCorrect: false },
      { id: "B", text: "Some chess players are engineers.", isCorrect: false },
      { id: "C", text: "No conclusion follows necessarily.", isCorrect: true },
      {
        id: "D",
        text: "All chess players are problem-solvers.",
        isCorrect: false,
      },
    ],
    shortcutSteps: [
      "Premise 1: Universal affirmative (All A are B).",
      "Premise 2: Particular affirmative (Some B are C).",
      "The middle term 'problem-solvers' is undistributed in both premises.",
      "No valid deduction can be established between 'engineers' and 'chess players'.",
    ],
    mentalNote:
      "Undistributed middle term rule: If the connecting category is not distributed, no syllogism holds.",
  },
]

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([])

  // Interactive Question Simulator State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showScratchpad, setShowScratchpad] = useState(false)
  const [simSecondsElapsed, setSimSecondsElapsed] = useState(14)

  // Interactive Company Matrix State
  const [activeCompanyIndex, setActiveCompanyIndex] = useState(0)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await axios.get("/api/categories")
        const data: Category[] = res.data?.data || []
        setCategories(data.filter((c) => c.isActive !== false))
      } catch {
        setCategories([])
      }
    }
    void loadCategories()
  }, [])

  const currentQ = SIMULATOR_QUESTIONS[currentQuestionIndex]
  const isSelectedCorrect =
    selectedOption !== null &&
    currentQ.options.find((o) => o.id === selectedOption)?.isCorrect

  const handleSelectOption = (optId: string) => {
    setSelectedOption(optId)
    setShowExplanation(true)
  }

  const handleNextSimulatorQuestion = () => {
    const nextIdx = (currentQuestionIndex + 1) % SIMULATOR_QUESTIONS.length
    setCurrentQuestionIndex(nextIdx)
    setSelectedOption(null)
    setShowExplanation(false)
    setShowScratchpad(false)
    setSimSecondsElapsed(nextIdx === 0 ? 14 : nextIdx === 1 ? 19 : 12)
  }

  const activeCompany = COMPANY_BLUEPRINTS[activeCompanyIndex]

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-emerald-600 selection:text-white dark:selection:bg-emerald-500 dark:selection:text-neutral-950">

      <Navbar />

      {/* ── Hero Section (Asymmetric 7:5 Grid) ────────────────────── */}
      <section className="max-w-8xl relative mx-auto px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Editorial Thesis (7 cols) */}
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              <span className="h-1.5 w-1.5 bg-emerald-600 dark:bg-emerald-400" />
              <span>Diagnostic Test Platform // Placement 2025–2026</span>
            </div>

            <h1 className="font-serif text-4xl leading-[1.03] font-normal tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Placement tests cut 70% of engineering candidates{" "}
              <span className="text-emerald-600 italic dark:text-emerald-400">
                before anyone reads their resume.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              TCS NQT gives you 50 seconds per question. Infosys gives you 65.
              If you write out quadratic equations on scratch paper, you run out
              of time on question 18. AptiCore trains you against 24,600
              verified problems with the exact countdown timers and sectional
              lockout rules used by Indian campus recruiters.
            </p>

            {/* Asymmetric Action Cluster */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
              >
                <span>Take 20-min Diagnostic Test</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#company-blueprints"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>Inspect 85 Company Formats</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>

            {/* Concrete Data Strip */}
            <div className="mt-12 border-t border-border pt-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div>
                  <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                    24,600
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground uppercase">
                    Verified Questions
                  </div>
                </div>

                <div>
                  <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                    85
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground uppercase">
                    Company Blueprints
                  </div>
                </div>

                <div>
                  <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                    38 sec
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground uppercase">
                    Median Target Pace
                  </div>
                </div>

                <div>
                  <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                    128,400
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground uppercase">
                    Tests Administered
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Question Simulator (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-md border border-border bg-card p-5 shadow-xs sm:p-6">
              {/* Terminal Meta Header */}
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
                    {currentQ.testTag}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Timer className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Budget:{" "}
                    <strong className="text-foreground">
                      {currentQ.timeBudget}s
                    </strong>
                  </span>
                </div>
              </div>

              {/* Problem Prompt */}
              <div className="mt-4">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>Topic: {currentQ.category}</span>
                  <span>
                    Q {currentQuestionIndex + 1} of {SIMULATOR_QUESTIONS.length}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed font-medium whitespace-pre-line text-foreground">
                  {currentQ.question}
                </p>
              </div>

              {/* Interactive Options */}
              <div className="mt-4 space-y-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.id
                  const isThisCorrect = opt.isCorrect

                  let btnStyle =
                    "border-border bg-background hover:border-foreground/40 text-foreground"

                  if (selectedOption !== null) {
                    if (isThisCorrect) {
                      btnStyle =
                        "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 dark:border-emerald-500"
                    } else if (isSelected && !isThisCorrect) {
                      btnStyle =
                        "border-neutral-400 bg-neutral-200/50 dark:border-neutral-700 dark:bg-neutral-800 text-muted-foreground line-through"
                    } else {
                      btnStyle =
                        "border-border opacity-50 text-muted-foreground"
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex w-full items-center justify-between rounded-md border p-3 text-left font-mono text-xs transition-colors ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border text-[11px] font-semibold">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {selectedOption !== null && isThisCorrect && (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Live Solution Breakdown */}
              {showExplanation && (
                <div className="mt-4 rounded-md border border-emerald-600/30 bg-emerald-600/5 p-3.5 text-xs text-foreground dark:border-emerald-500/30 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-mono text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-300">
                      {isSelectedCorrect
                        ? "✓ Correct Logged"
                        : "— Solution Breakdown"}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Pace: {simSecondsElapsed}s / {currentQ.timeBudget}s budget
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1 font-mono text-[11.5px] text-muted-foreground">
                    {currentQ.shortcutSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex gap-2">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {sIdx + 1}.
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-border/40 pt-2 font-mono text-[11px] text-foreground">
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      Rule:
                    </strong>{" "}
                    {currentQ.mentalNote}
                  </div>
                </div>
              )}

              {/* Scratchpad Toggle Drawer */}
              {showScratchpad && (
                <div className="mt-3 rounded-md border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center justify-between pb-1.5 font-semibold text-foreground">
                    <span>Engineering Arithmetic Notes</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Standard Formulas
                    </span>
                  </div>
                  <ul className="mt-1 space-y-1 text-[11px]">
                    <li>
                      • Speed: x km/h × 5/18 = y m/s | y m/s × 18/5 = x km/h
                    </li>
                    <li>
                      • Relative Speed (Same Dir): S1 - S2 | (Opposite Dir): S1
                      + S2
                    </li>
                    <li>
                      • Work & Wages: (A × B) / (A + B) days for 2 workers
                    </li>
                  </ul>
                </div>
              )}

              {/* Action Bar */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {showScratchpad ? "Hide Scratchpad" : "View Formulas"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSimulatorQuestion}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>
                    Next Question (
                    {((currentQuestionIndex + 1) % SIMULATOR_QUESTIONS.length) +
                      1}
                    /{SIMULATOR_QUESTIONS.length})
                  </span>
                </button>
              </div>
            </div>

            {/* Micro Caption */}
            <p className="mt-2.5 text-center font-mono text-[11px] text-muted-foreground">
              Live simulator excerpt. Full exam engine includes 30-question
              sectional timer lockdown.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: The Placement Autopsy (Asymmetric 4:8 Split) ── */}
      <section className="border-t border-border py-24 sm:py-32">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left 4 cols: Manifesto thesis */}
            <div className="lg:col-span-4">
              <div className="mb-4 font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                [02 // TEST AUTOPSY]
              </div>

              <h2 className="font-serif text-3xl leading-tight font-normal text-foreground sm:text-4xl lg:text-5xl">
                The aptitude round is not an IQ test. It is a filter for{" "}
                <span className="text-emerald-600 italic dark:text-emerald-400">
                  arithmetic throughput under stress.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                90% of candidates who fail can solve every question given two
                hours at their desk. The cutoff exists because companies have
                40,000 applicants for 800 positions. Speed is the elimination
                mechanism.
              </p>

              <div className="mt-6">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <span>Build your timed speed baseline</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right 8 cols: 3 Concrete Breakdowns */}
            <div className="space-y-6 lg:col-span-8">
              <div className="rounded-md border border-border bg-card p-6">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    01 // THE SCRATCHPAD BOTTLENECK
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Time penalty: -45s per problem
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  Writing quadratic formulas burns 90 seconds on 45-second
                  questions.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  College math trains you to write down steps for partial
                  credit. Campus aptitude tests give zero credit for steps. If
                  you calculate percentages, time-and-work, or profit-loss by
                  writing out 5 lines on blank paper, you will never reach
                  question 20. AptiCore teaches mental ratio shortcuts so you
                  pick an option in under 35 seconds.
                </p>
              </div>

              <div className="rounded-md border border-border bg-card p-6">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    02 // THE SECTIONAL CUTOFF AMBUSH
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Elimination risk: Instant rejection
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  Scoring 98% in Quantitative Reasoning means nothing if Verbal
                  falls to 58%.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Recruiters like TCS and Infosys apply strict sectional cutoff
                  floors. Students who over-prepare mathematics and ignore
                  sentence correction or syllogisms are systematically
                  disqualified despite high composite scores. Our diagnostics
                  audit every section independently so your preparation is
                  balanced.
                </p>
              </div>

              <div className="rounded-md border border-border bg-card p-6">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    03 // INTERFACE DISORIENTATION
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Psychological factor: 22% score drop
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  Casual quiz apps look nothing like hostile proctored portals.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  When TCS iON or Mercer Mettl launches, your browser locks
                  full-screen, the back-button is disabled, and tab switches
                  trigger violation strikes. Candidates who practiced on
                  comfortable casual quiz apps panic under these unforgiving
                  constraints. AptiCore simulates the exact proctoring
                  conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Company Exam Blueprint Index (Memorable Detail #2) ── */}
      <section
        id="company-blueprints"
        className="border-t border-border py-24 sm:py-28"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                [03 // COMPANY BLUEPRINTS]
              </div>
              <h2 className="mt-2 font-serif text-3xl font-normal text-foreground sm:text-5xl">
                Actual Exam Specifications
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Never walk into a campus placement test guessing the format. Here
              is the exact architecture of India&apos;s primary recruitment
              tests.
            </p>
          </div>

          {/* Asymmetric 4:8 Selector & Matrix */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Company Tabs (4 cols) */}
            <div className="flex flex-col space-y-1.5 lg:col-span-4">
              {COMPANY_BLUEPRINTS.map((comp, idx) => (
                <button
                  key={comp.id}
                  onClick={() => setActiveCompanyIndex(idx)}
                  className={`flex flex-col rounded-md border p-4 text-left transition-colors ${
                    activeCompanyIndex === idx
                      ? "border-emerald-600 bg-emerald-600/5 text-foreground dark:border-emerald-500"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {comp.name}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {comp.totalTime}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {comp.tier}
                  </span>
                </button>
              ))}
            </div>

            {/* Technical Specification Inspector (8 cols) */}
            <div className="rounded-md border border-border bg-card p-6 sm:p-8 lg:col-span-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-foreground sm:text-3xl">
                    {activeCompany.name} Examination Protocol
                  </h3>
                  <div className="mt-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    Target Track: {activeCompany.tier}
                  </div>
                </div>

                <Link
                  href={`/tests?company=${activeCompany.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-1.5 font-mono text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950"
                >
                  <span>Launch {activeCompany.name} Mock</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Data Table */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-border/80 p-3.5">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    Duration & Volume
                  </span>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    {activeCompany.totalTime} // {activeCompany.totalQuestions}
                  </div>
                </div>

                <div className="rounded-md border border-border/80 p-3.5">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    Pace Budget
                  </span>
                  <div className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {activeCompany.timePerQ}
                  </div>
                </div>

                <div className="rounded-md border border-border/80 p-3.5">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    Negative Marking
                  </span>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    {activeCompany.negativeMarking}
                  </div>
                </div>

                <div className="rounded-md border border-border/80 p-3.5">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    Navigation Rule
                  </span>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    {activeCompany.sectionalLock}
                  </div>
                </div>

                <div className="rounded-md border border-border/80 p-3.5 sm:col-span-2">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    Primary Weed-out Section
                  </span>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    {activeCompany.weedoutTopic} (
                    {activeCompany.cutoffBenchmark})
                  </div>
                </div>
              </div>

              {/* Frequent topics strip */}
              <div className="mt-6 border-t border-border pt-4">
                <div className="font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                  High-Frequency Question Types in {activeCompany.name}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {activeCompany.sampleCompanyTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-xs text-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: 24,600 Question Repository Directory ──────── */}
      <section className="border-t border-border py-24 sm:py-28">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                [04 // PROBLEM REPOSITORY]
              </div>
              <h2 className="mt-2 font-serif text-3xl font-normal text-foreground sm:text-5xl">
                Structured Topic Syllabus
              </h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>Explore all subtopic modules</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 4 Core Pillars in Asymmetric Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-5">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-foreground">
                    QUANTITATIVE
                  </span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    8,420 Qs
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Time & Work, Permutations, Probability, Percentages, Mixtures,
                  Pipes & Cisterns, Simple & Compound Interest.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3">
                <Link
                  href="/categories/quantitative"
                  className="inline-flex items-center gap-1 font-mono text-xs font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span>Practice Quant Module</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-5">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-foreground">
                    LOGICAL REASONING
                  </span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    6,150 Qs
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Syllogisms, Seating Arrangement (Circular & Linear), Blood
                  Relations, Direction Sense, Coding-Decoding, Clocks &
                  Calendars.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3">
                <Link
                  href="/categories/logical-reasoning"
                  className="inline-flex items-center gap-1 font-mono text-xs font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span>Practice Reasoning Module</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-5">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-foreground">
                    CODING MCQS & DSA
                  </span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    5,800 Qs
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Pointer arithmetic in C/C++, Bitwise operations, Output
                  prediction, Time complexity calculations, OOP principles,
                  Recursion trees.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3">
                <Link
                  href="/categories/coding-mcqs"
                  className="inline-flex items-center gap-1 font-mono text-xs font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span>Practice Coding MCQs</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-5">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-foreground">
                    VERBAL ABILITY
                  </span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    4,230 Qs
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Sentence correction, Para jumbles, Reading comprehension,
                  Idioms & phrases, Critical reasoning, Subject-verb agreement.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3">
                <Link
                  href="/categories/verbal-ability"
                  className="inline-flex items-center gap-1 font-mono text-xs font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span>Practice Verbal Module</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Proctoring Telemetry Terminal ───────────────── */}
      <section className="border-t border-border py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
                  AptiCore Test Integrity Protocol // Hostile Exam Simulator
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                0 Strikes // Clean Session Log
              </span>
            </div>

            <div className="mt-4 grid gap-6 lg:grid-cols-12">
              <div className="space-y-2 font-mono text-xs text-muted-foreground lg:col-span-8">
                <div className="rounded-md border border-border/80 bg-background/50 p-3 font-mono text-[11.5px] leading-relaxed">
                  <div className="text-emerald-600 dark:text-emerald-400">
                    $ apticore --inspect-proctoring-runtime
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    [00:00:01] Fullscreen lock initiated
                    (document.requestFullscreen).
                  </div>
                  <div className="text-muted-foreground">
                    [00:00:01] Window visibility listener registered
                    (visibilitychange).
                  </div>
                  <div className="text-muted-foreground">
                    [00:00:02] Event hooks suppressed: [contextmenu, copy, cut,
                    paste, selectstart].
                  </div>
                  <div className="text-muted-foreground">
                    [00:00:02] Developer tool inspection detection active
                    (debugger trap).
                  </div>
                  <div className="text-muted-foreground">
                    [00:00:03] Section countdown synchronized with server
                    timestamp.
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between text-xs text-muted-foreground lg:col-span-4">
                <p className="leading-relaxed">
                  Most candidates lose focus during real TCS iON and Mercer
                  Mettl tests because the anti-cheat environment feels foreign.
                  We train you under the exact full-screen constraints so
                  nothing surprises you on test day.
                </p>
                <div className="mt-4 border-t border-border pt-3 font-mono text-[11px] text-foreground">
                  Proctoring compliance: 100% parity with Indian enterprise
                  assessment vendors.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Quiet, High-Conviction Call to Action ──────── */}
      <section className="border-t border-border py-24 sm:py-32">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                [05 // DIAGNOSTIC ENTRY]
              </div>
              <h2 className="mt-3 font-serif text-4xl leading-tight font-normal text-foreground sm:text-6xl">
                Find out your exact sectional percentile{" "}
                <span className="text-emerald-600 italic dark:text-emerald-400">
                  before campus drives begin.
                </span>
              </h2>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                Take a 20-minute diagnostic test. You will get an immediate
                audit of your speed per question, your weakest arithmetic
                categories, and your standing against 128,400 engineering
                students.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
                >
                  <span>Start Free 20-min Diagnostic</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <span className="font-mono text-xs text-muted-foreground">
                  No credit card required. Free tier forever.
                </span>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-6 lg:col-span-4">
              <div className="border-b border-border pb-2.5 font-mono text-xs font-semibold text-foreground uppercase">
                What Your Diagnostic Report Measures
              </div>
              <ul className="mt-3 space-y-2.5 font-mono text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    •
                  </span>
                  <span>Average solving time per question (vs 48s target)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    •
                  </span>
                  <span>
                    Sectional cutoff compliance for TCS, Infosys & Wipro
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    •
                  </span>
                  <span>
                    Top 3 time-drain topics to eliminate with shortcut math
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    •
                  </span>
                  <span>National engineering cohort percentile rank</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
