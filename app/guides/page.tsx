"use client"

import { useState, useEffect, useMemo } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import {
  Compass,
  Search,
  ArrowRight,
  BookOpen,
  BarChart3,
  Lightbulb,
  Target,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  X,
  Sparkles,
  Zap,
  Building2,
  HelpCircle,
  FileText,
  RotateCcw,
  Check,
  ChevronRight,
  Calculator,
  BrainCircuit,
  MessageSquareQuote,
  ShieldCheck,
  ExternalLink,
} from "lucide-react"

// Types
interface GuideStep {
  title: string
  desc: string
  tips?: string
  pitfall?: string
}

interface FormulaItem {
  name: string
  formula: string
  example?: string
}

interface GuideItem {
  id: string
  title: string
  desc: string
  category: "Company Specific" | "Quantitative Aptitude" | "Logical Reasoning" | "Verbal Ability" | "Strategy & Mocks"
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  time: string
  icon: any
  badgeColor: string
  tags: string[]
  highlight?: boolean
  practiceUrl: string
  overview: string
  steps: GuideStep[]
  formulas?: FormulaItem[]
  keyTakeaways: string[]
}

const CATEGORIES = [
  "All",
  "Company Specific",
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  "Strategy & Mocks",
] as const

const GUIDES_DATA: GuideItem[] = [
  {
    id: "campus-placement-blueprint-2026",
    title: "2026 Campus Placement Blueprint: 30-Day Action Sprint",
    desc: "A battle-tested 4-week preparation timeline covering company assessment patterns, section quotas, and interview readiness.",
    category: "Strategy & Mocks",
    difficulty: "All Levels",
    time: "25 min read",
    icon: Compass,
    badgeColor: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    tags: ["Roadmap", "All Companies", "30-Day Plan"],
    highlight: true,
    practiceUrl: "/tests",
    overview:
      "This 30-day accelerated framework is engineered for engineering and BCA/MCA candidates appearing for mass recruiters (TCS, Infosys, Cognizant, Accenture) as well as product tier-2 organizations. Follow the weekly cadence strictly to maximize score trajectory.",
    keyTakeaways: [
      "Week 1: Quantitative Arithmetic & Speed Calculations",
      "Week 2: Analytical Seating Arrangements & Blood Relations",
      "Week 3: Advanced Verbal, Grammar Rules & Technical MCQs",
      "Week 4: Timed Full-Length Mocks & Error Log Auditing",
    ],
    steps: [
      {
        title: "Week 1: Foundations & Speed Arithmetic",
        desc: "Master high-frequency quant topics: Percentages, Profit & Loss, Ratios, and Time & Work. Commit 1/2 to 1/20 fraction conversions to memory for rapid mental math.",
        tips: "Avoid manual long-division; use digital root and Vedic cross-multiplication shortcuts to solve questions in under 45 seconds.",
        pitfall: "Do not attempt complex geometry or permutation questions until basic arithmetic accuracy hits 90%.",
      },
      {
        title: "Week 2: Logical Schematics & Puzzles",
        desc: "Transition to Linear/Circular seating arrangements, Syllogisms, and Direction Sense. Practice drawing 2-3 simultaneous possibilities when conditions are ambiguous.",
        tips: "In seating puzzles, always anchor individuals whose definite absolute positions are given (e.g., 'sitting at the extreme left').",
        pitfall: "Spending more than 4 minutes on a single puzzle case during a timed test will ruin sectional cutoffs.",
      },
      {
        title: "Week 3: Verbal Precision & Core CS MCQs",
        desc: "Study the top 10 Subject-Verb Agreement rules, Sentence Correction patterns, and para-jumble transition keywords. Dedicate 2 hours daily to DBMS, OS, and OOP basics.",
        tips: "For Reading Comprehension, read the questions first to identify target keywords before diving into the passage.",
      },
      {
        title: "Week 4: Exam Simulation & Error Log Audit",
        desc: "Take one full-length simulated test daily on AptiCore under strictly timed constraints. Categorize every mistake into: Silly Calculation, Formula Gap, or Time Exhaustion.",
        tips: "Spend 2x the test duration reviewing your analytics and practicing the specific question archetypes you missed.",
      },
    ],
    formulas: [
      {
        name: "Speed Math Reciprocal",
        formula: "1/7 ≈ 14.28% | 1/8 = 12.5% | 1/12 = 8.33% | 1/16 = 6.25%",
        example: "Finding 37.5% of 640 = 3 × (1/8 of 640) = 3 × 80 = 240",
      },
      {
        name: "Time & Work Golden Equation",
        formula: "Work = Efficiency × Time | (M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2",
        example: "If 12 men finish a task in 8 days, 16 men will complete it in (12 × 8) / 16 = 6 days.",
      },
    ],
  },
  {
    id: "tcs-nqt-strategy-2026",
    title: "TCS NQT 2026: Complete Sectional Strategy & Syllabus",
    desc: "Detailed blueprint for TCS National Qualifier Test: Cognitive skills, Advanced Quantitative, and Coding section time allocation.",
    category: "Company Specific",
    difficulty: "Advanced",
    time: "20 min read",
    icon: Building2,
    badgeColor: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
    tags: ["TCS NQT", "Ninja vs Prime", "Pattern"],
    practiceUrl: "/tests?category=Quantitative%20Aptitude",
    overview:
      "TCS NQT evaluates candidates for Ninja, Digital, and Prime bands. The cognitive section contains non-negative marking questions, but strict sectional timers prohibit jumping between sections.",
    keyTakeaways: [
      "Sectional cutoff must be cleared across all 3 cognitive tracks",
      "No inter-sectional navigation is permitted on TCS iON platform",
      "Prime shortlist depends heavily on Advanced Quant & Coding test cases",
    ],
    steps: [
      {
        title: "Conquer Numerical Ability (65-75% accuracy required)",
        desc: "Focus on Number Systems (HCF/LCM, Remainder Theorems), Statistics (Mean, Median, Standard Deviation), and Work & Time.",
        tips: "Use the on-screen TCS calculator only when decimal precision is mandatory; otherwise mental approximations save crucial seconds.",
      },
      {
        title: "Master Reasoning Ability (High Scoring)",
        desc: "Expect heavy weightage on Data Sufficiency, Syllogisms, Pattern Series, and Visual Venn representations.",
        tips: "In Data Sufficiency, do not solve the full numerical problem—only verify if the given statements provide sufficient unique constraints.",
      },
      {
        title: "Verbal Ability & Grammar Filters",
        desc: "TCS emphasizes Cloze Tests (fill in blanks within paragraph context), Sentence Completion, and Error Identification.",
        tips: "Look for transitional conjunctions (however, although, consequently) to determine whether the clause requires a positive or negative tone.",
      },
      {
        title: "Advanced Coding & Edge Cases",
        desc: "Practice array manipulations, string hashing, and recursion. Ensure your code handles edge cases like 0, negative inputs, and large constraint sizes.",
      },
    ],
    formulas: [
      {
        name: "Standard Deviation (Discrete Series)",
        formula: "σ = √[ Σ(x - μ)² / N ]",
        example: "Calculate mean μ first, find squared deviations from μ, sum and divide by total elements.",
      },
      {
        name: "TCS Remainder Theorem (Euler Totient)",
        formula: "If gcd(a, m) = 1, then a^φ(m) ≡ 1 (mod m)",
        example: "Simplifies huge exponential remainders in TCS Advanced Quant.",
      },
    ],
  },
  {
    id: "accenture-critical-reasoning-pseudocode",
    title: "Accenture: Critical Reasoning & Pseudo-Code Blueprint",
    desc: "Master pseudo-code tracing, bitwise operations, abstract reasoning matrices, and critical argument identification.",
    category: "Company Specific",
    difficulty: "Intermediate",
    time: "18 min read",
    icon: BrainCircuit,
    badgeColor: "from-purple-500/20 to-violet-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
    tags: ["Accenture", "Pseudo-code", "Critical Reasoning"],
    practiceUrl: "/tests?category=Logical%20Reasoning",
    overview:
      "Accenture's assessment includes a unique Pseudo-Code and Common Applications & MS Office section alongside Critical Reasoning. Mastering loop dry-runs and bitwise XOR logic guarantees high placement percentiles.",
    keyTakeaways: [
      "Pseudo-code tests variable scoping, bitwise XOR, and nested loops",
      "Critical reasoning tests strong vs weak arguments and implicit assumptions",
      "Abstract reasoning tests 2D rotation, dot placements, and grid symmetries",
    ],
    steps: [
      {
        title: "Decode Bitwise Operators in Pseudo-Code",
        desc: "Accenture heavily features bitwise XOR (^), AND (&), and OR (|) mixed with increment and ternary expressions.",
        tips: "Remember: a ^ a = 0, and a ^ 0 = a. Any even number XOR with 1 yields number + 1.",
      },
      {
        title: "Dry-Run Loop Exit Conditions",
        desc: "Trace 3-iteration table columns for variables: i, j, sum. Watch out for 1-based vs 0-based array indexing used in Accenture pseudo-code.",
        pitfall: "Do not rush into calculation before checking if the loop terminating condition is '<' or '<='.",
      },
      {
        title: "Differentiate Assumptions vs Inferences",
        desc: "An assumption is unstated and must be true for the argument to hold. An inference is a factual deduction derived strictly from given statements.",
      },
    ],
    formulas: [
      {
        name: "Bitwise Identities Cheat Sheet",
        formula: "A ^ A = 0 | A ^ 0 = A | A & (A - 1) removes lowest set bit",
        example: "If x = 12 (1100 in binary), x & (x - 1) = 12 & 11 = 8 (1000 in binary).",
      },
    ],
  },
  {
    id: "quant-speed-math-shortcuts",
    title: "Speed Math & Vedic Calculation Shortcuts",
    desc: "Calculate multiplications, square roots, cubes, and fraction percentages mentally in under 15 seconds.",
    category: "Quantitative Aptitude",
    difficulty: "Beginner",
    time: "15 min read",
    icon: Zap,
    badgeColor: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    tags: ["Mental Math", "Calculation Tricks", "Speed Boost"],
    practiceUrl: "/tests?category=Quantitative%20Aptitude",
    overview:
      "Aptitude tests are won on calculation speed. While peers waste 90 seconds carrying numbers on scratch paper, these Vedic multiplication and squaring rules allow instantaneous answers.",
    keyTakeaways: [
      "Multiply two 2-digit numbers mentally in 1 step via Criss-Cross Vedic method",
      "Find squares of numbers ending in 5 in under 3 seconds",
      "Use base 100/1000 multiplication techniques for massive numbers",
    ],
    steps: [
      {
        title: "Squaring Numbers Ending in 5",
        desc: "Multiply the leading tens digit by (tens digit + 1), and suffix '25' at the end.",
        tips: "Example: 65² → 6 × 7 = 42, append 25 → 4225. 115² → 11 × 12 = 132, append 25 → 13225.",
      },
      {
        title: "Vedic Vertically & Crosswise (2-Digit × 2-Digit)",
        desc: "For ab × cd: 1. (b × d) [carry if any], 2. (a × d + b × c + carry), 3. (a × c + carry).",
        tips: "With practice, this single-line calculation takes under 8 seconds without paper clutter.",
      },
      {
        title: "Multiplication by 11 and 99",
        desc: "To multiply by 11: Write outer digits, and insert sum of adjacent digits in middle. To multiply by 99: Multiply by 100 and subtract original number.",
      },
    ],
    formulas: [
      {
        name: "Near Base 100 Multiplication",
        formula: "(100 + a)(100 + b) = 100(100 + a + b) + (a × b)",
        example: "104 × 107 → (104 + 7 = 111) and (4 × 7 = 28) → 11,128.",
      },
    ],
  },
  {
    id: "logical-reasoning-seating-syllogisms",
    title: "Mastering Seating Arrangements & Syllogism Venns",
    desc: "Foolproof methods to untangle linear rows, circular tables with inward/outward facing individuals, and complex syllogism statements.",
    category: "Logical Reasoning",
    difficulty: "Intermediate",
    time: "22 min read",
    icon: Lightbulb,
    badgeColor: "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30",
    tags: ["Puzzles", "Circular Seating", "Venn Diagrams"],
    practiceUrl: "/tests?category=Logical%20Reasoning",
    overview:
      "Seating arrangements carry 5-question clusters in placement exams. Solving 1 arrangement correctly unlocks 5 straightforward marks. This guide teaches structured constraint charting.",
    keyTakeaways: [
      "Rule of Left & Right when individuals face inward vs outward",
      "Venn diagram rules for 'Some', 'All', 'No', and 'Some Not'",
      "Handling 'Either / Or' complementary pairs in Syllogisms",
    ],
    steps: [
      {
        title: "Clockwise vs Anti-Clockwise in Circular Tables",
        desc: "Facing Center: Left is Clockwise, Right is Anti-Clockwise. Facing Outward: Left is Anti-Clockwise, Right is Clockwise.",
        tips: "Always draw a circle with 8 equidistant tick marks before placing any person.",
      },
      {
        title: "Drafting Multiple Parallel Cases",
        desc: "Whenever a clue offers 2 possibilities (e.g., 'A sits either 2nd to the left or 2nd to the right of B'), draw Case 1 and Case 2 side-by-side immediately.",
        tips: "Never guess. A negative clue later in the paragraph will naturally invalidate one case.",
      },
      {
        title: "Syllogisms: The 100% Guaranteed Venn Technique",
        desc: "Draw the minimal overlap Venn diagram for given statements. To verify a 'Possibility' conclusion, check if ANY valid diagram can support it.",
      },
    ],
    formulas: [
      {
        name: "Syllogism Complementary Pairs (Either-Or Rule)",
        formula: "1. Both conclusions must be false in basic diagram.\n2. One must be affirmative, one negative.\n3. Subject and predicate must match.",
        example: "Pairs: 'Some A are B' + 'No A is B', OR 'All A are B' + 'Some A are not B'.",
      },
    ],
  },
  {
    id: "verbal-ability-reading-comprehension",
    title: "Verbal Ability & Reading Comprehension Playbook",
    desc: "Rapid passage skimming, identifying author tone, spotting subject-verb agreement traps, and ordering para-jumbles.",
    category: "Verbal Ability",
    difficulty: "Beginner",
    time: "16 min read",
    icon: BookOpen,
    badgeColor: "from-pink-500/20 to-rose-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30",
    tags: ["Grammar Rules", "RC Passages", "Para-Jumbles"],
    practiceUrl: "/tests?category=Verbal%20Ability",
    overview:
      "Verbal ability is frequently the tie-breaker in competitive shortlisting. Rather than reading passages word-for-word, apply scanning strategies and core grammatical axioms to speed up.",
    keyTakeaways: [
      "The 'Question-First' approach to Reading Comprehension",
      "The Top 5 Subject-Verb Agreement pitfalls tested in placement exams",
      "Chronology and pronoun linking techniques for Para-Jumbles",
    ],
    steps: [
      {
        title: "Targeted Passage Scanning (The 2-Minute Scan)",
        desc: "Read the first sentence of each paragraph thoroughly to grasp the central thesis. Scan internal sentences only for proper nouns, years, and pivotal transitions.",
      },
      {
        title: "Subject-Verb Agreement: Neither/Nor & Intervening Clauses",
        desc: "Phrases like 'along with', 'as well as', and 'in addition to' do not change the number of the subject. Verb matches the original subject.",
        tips: "'Neither of the candidates HAS (not have) cleared the round.'",
      },
      {
        title: "Para-Jumbles: Identify Independent Openers",
        desc: "Sentences starting with 'He', 'They', 'However', 'Therefore' cannot be the first sentence. Look for full nouns establishing the context.",
      },
    ],
    formulas: [
      {
        name: "Grammar Anchor: Correlative Conjunctions",
        formula: "Neither... nor | Either... or | Not only... but also",
        example: "The verb agrees with the NEAREST subject: 'Neither the manager nor the engineers WERE available.'",
      },
    ],
  },
  {
    id: "infosys-puzzle-reasoning-roadmap",
    title: "Infosys Campus Recruitment: Puzzles & Cryptarithmetic",
    desc: "Unravel verbal cryptarithmetic letter-digit substitutions, deductive puzzles, and high-difficulty mathematical reasoning.",
    category: "Company Specific",
    difficulty: "Advanced",
    time: "24 min read",
    icon: Target,
    badgeColor: "from-sky-500/20 to-cyan-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30",
    tags: ["Infosys", "Cryptarithmetic", "Deduction"],
    practiceUrl: "/tests?category=Logical%20Reasoning",
    overview:
      "Infosys tests include specialized cryptarithmetic questions where letters represent distinct single digits (0-9). Understanding leading digit constraints and carryover rules lets you crack them fast.",
    keyTakeaways: [
      "Carryover from summing two single digits is always strictly 1",
      "Leading letter of any multi-digit number can never be zero",
      "Mathematical reasoning focuses on Permutations and Mensuration",
    ],
    steps: [
      {
        title: "Rule of Carryover in Cryptarithmetic Addition",
        desc: "When adding two numbers: (Letter1 + Letter2) + carry ≤ 9 + 9 + 1 = 19. Therefore, any carry generated into an extra column MUST be 1.",
        tips: "In SEND + MORE = MONEY, the letter M is the carry into the 5th column, so M must immediately equal 1!",
      },
      {
        title: "Even/Odd Parity Verification",
        desc: "Even + Even = Even | Odd + Odd = Even | Even + Odd = Odd. Use parity to eliminate impossible digit candidates quickly.",
      },
      {
        title: "Mathematical Ability: P&C and Probability",
        desc: "Brush up circular permutations (n-1)! and arrangements with identical objects (n! / (p! × q!)).",
      },
    ],
    formulas: [
      {
        name: "Arrangements with Duplicates",
        formula: "Total Permutations = N! / (n1! × n2! × ... × nk!)",
        example: "Permutations of 'STATISTICS' = 10! / (3! × 3! × 1! × 2! × 1!) = 50,400.",
      },
    ],
  },
  {
    id: "mock-test-analysis-score-maximizer",
    title: "Mock Test Post-Mortem & Score Maximization Guide",
    desc: "How to extract maximum score improvements from every test attempt using the 3-Pass Method and Error Categorization.",
    category: "Strategy & Mocks",
    difficulty: "All Levels",
    time: "14 min read",
    icon: BarChart3,
    badgeColor: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    tags: ["Strategy", "Mock Analysis", "Score Boost"],
    practiceUrl: "/tests",
    overview:
      "Taking 50 mock tests without analyzing them is futile. The highest-performing candidates spend twice as much time performing post-test audits as they do taking the test itself.",
    keyTakeaways: [
      "The 3-Pass test execution method (Easy first, Moderate second, Skip hard)",
      "How to keep an 'Error Log Diary' that prevents repeating mistakes",
      "Tackling negative marking with the Elimination Confidence Index",
    ],
    steps: [
      {
        title: "The 3-Pass Rule During the Test",
        desc: "Pass 1 (0-15 min): Solve instant 30-second questions. Pass 2 (15-40 min): Solve questions you know the method for. Pass 3: Review flagged and time-consuming problems.",
        tips: "Never let ego hold you hostage on question #1. If it looks tedious, skip immediately.",
      },
      {
        title: "Post-Test Error Categorization",
        desc: "Label every wrong answer into one of 3 buckets: 1. Silly Arithmetic error, 2. Conceptual lack of formula, 3. Misread question statement.",
      },
      {
        title: "Weekly Topic Weak-Spot Elimination",
        desc: "Take topic-specific mini tests on AptiCore for whichever category generated the highest percentage of errors in your weekly mock.",
      },
    ],
    formulas: [
      {
        name: "Test Efficiency Metric (Target > 85%)",
        formula: "Efficiency = (Correct Answers × Marks) / (Attempted Questions × Marks)",
        example: "If you attempt 40 questions and 36 are correct, Efficiency = 90%. Focus on accuracy before increasing raw attempt volume.",
      },
    ],
  },
]

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({})
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false)
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null)
  const [readerTab, setReaderTab] = useState<"steps" | "formulas" | "practice">("steps")

  // Load bookmarks and completed steps from localStorage
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("apticore_guide_bookmarks")
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks))

      const savedSteps = localStorage.getItem("apticore_guide_completed_steps")
      if (savedSteps) setCompletedSteps(JSON.parse(savedSteps))
    } catch {
      // LocalStorage not available or blocked
    }
  }, [])

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedGuide) {
        setSelectedGuide(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedGuide])

  // Prevent background scrolling when reader modal is open
  useEffect(() => {
    if (selectedGuide) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedGuide])

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id]

    setBookmarkedIds(updated)
    try {
      localStorage.setItem("apticore_guide_bookmarks", JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const toggleStepCompleted = (guideId: string, stepIndex: number) => {
    const current = completedSteps[guideId] || []
    const updated = current.includes(stepIndex)
      ? current.filter((idx) => idx !== stepIndex)
      : [...current, stepIndex]

    const nextState = { ...completedSteps, [guideId]: updated }
    setCompletedSteps(nextState)
    try {
      localStorage.setItem("apticore_guide_completed_steps", JSON.stringify(nextState))
    } catch {
      // ignore
    }
  }

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: GUIDES_DATA.length }
    GUIDES_DATA.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1
    })
    return counts
  }, [])

  // Filtered guides
  const filteredGuides = useMemo(() => {
    return GUIDES_DATA.filter((guide) => {
      const matchesCategory = activeCategory === "All" || guide.category === activeCategory
      const matchesDifficulty = selectedDifficulty === "All" || guide.difficulty === selectedDifficulty
      const matchesBookmarks = !showOnlyBookmarks || bookmarkedIds.includes(guide.id)
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.desc.toLowerCase().includes(q) ||
        guide.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        guide.category.toLowerCase().includes(q)

      return matchesCategory && matchesDifficulty && matchesBookmarks && matchesSearch
    })
  }, [activeCategory, selectedDifficulty, showOnlyBookmarks, bookmarkedIds, searchQuery])

  // Featured Hero Guide (30-day blueprint)
  const featuredGuide = GUIDES_DATA[0]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="relative mb-12 text-center">
          <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Placement Preparation Playbooks
          </div>

          <h1 className="font-[Space_Grotesk,sans-serif] mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Guides & <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">Roadmaps</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Company-specific recruitment breakdowns, speed math formulas, and actionable step-by-step roadmaps to land your dream offer.
          </p>
        </div>

        {/* Featured Spotlight Roadmap Card */}
        {featuredGuide && (
          <div className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/5 via-card to-background p-6 shadow-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Compass className="h-3.5 w-3.5" /> Featured Master Roadmap
                  </span>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                    {featuredGuide.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {featuredGuide.time}
                  </span>
                </div>

                <h2 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                  {featuredGuide.title}
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {featuredGuide.desc}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                  {featuredGuide.keyTakeaways.map((takeaway, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/80 bg-surface/80 p-3 text-xs text-foreground backdrop-blur-xs"
                    >
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                        Phase {i + 1}
                      </span>
                      <p className="line-clamp-2 text-muted-foreground">{takeaway.split(": ")[1] || takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-3 shrink-0 items-stretch sm:items-center lg:items-end justify-start">
                <button
                  onClick={() => {
                    setSelectedGuide(featuredGuide)
                    setReaderTab("steps")
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 hover:shadow-emerald-500/20 active:scale-98"
                >
                  <BookOpen className="h-4 w-4" /> Open Full Blueprint
                </button>

                <button
                  onClick={(e) => toggleBookmark(featuredGuide.id, e)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    bookmarkedIds.includes(featuredGuide.id)
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
                  title="Bookmark Guide"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarkedIds.includes(featuredGuide.id) ? "fill-current" : ""}`} />
                  <span className="hidden sm:inline">
                    {bookmarkedIds.includes(featuredGuide.id) ? "Saved" : "Save"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter, Search & Controls Ribbon */}
        <div className="mb-8 space-y-4">
          {/* Categories Tab Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0
              const isActive = activeCategory === cat && !showOnlyBookmarks

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setShowOnlyBookmarks(false)
                  }}
                  className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "border border-border bg-card/60 text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {cat}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-surface text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}

            {/* Saved Bookmarks Filter */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                showOnlyBookmarks
                  ? "border border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "border border-border bg-card/60 text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${showOnlyBookmarks ? "fill-current" : ""}`} />
              Saved Guides
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  showOnlyBookmarks
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                {bookmarkedIds.length}
              </span>
            </button>
          </div>

          {/* Search & Difficulty Filter Sub-bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search topics, companies (TCS, Accenture, Speed Math)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-muted-foreground shrink-0">
                Difficulty:
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-500 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>

              {(searchQuery || selectedDifficulty !== "All" || showOnlyBookmarks || activeCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDifficulty("All")
                    setShowOnlyBookmarks(false)
                    setActiveCategory("All")
                  }}
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => {
            const Icon = guide.icon
            const isBookmarked = bookmarkedIds.includes(guide.id)
            const completedCount = (completedSteps[guide.id] || []).length
            const totalSteps = guide.steps.length
            const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

            return (
              <div
                key={guide.id}
                onClick={() => {
                  setSelectedGuide(guide)
                  setReaderTab("steps")
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg cursor-pointer"
              >
                {/* Top Row: Icon + Badge + Bookmark */}
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-xs group-hover:border-emerald-500/40 group-hover:text-emerald-500 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {guide.category}
                        </span>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span
                            className={`font-medium ${
                              guide.difficulty === "Beginner"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : guide.difficulty === "Intermediate"
                                ? "text-amber-600 dark:text-amber-400"
                                : guide.difficulty === "Advanced"
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-sky-600 dark:text-sky-400"
                            }`}
                          >
                            {guide.difficulty}
                          </span>
                          <span>•</span>
                          <span>{guide.time}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(guide.id, e)}
                      className={`rounded-lg p-2 transition-colors ${
                        isBookmarked
                          ? "text-amber-500 bg-amber-500/10"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Save Guide"}
                      aria-label="Bookmark"
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-[Space_Grotesk,sans-serif] mb-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {guide.title}
                  </h3>

                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {guide.desc}
                  </p>

                  {/* Key Takeaways list */}
                  <div className="mb-4 space-y-1.5 border-t border-border pt-3">
                    {guide.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Steps Progress + Action */}
                <div className="border-t border-border pt-4">
                  {completedCount > 0 ? (
                    <div className="mb-3 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                        <span>Progress</span>
                        <span>{progressPercent}% completed</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {guide.steps.length} Steps
                      </span>
                      {guide.formulas && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Calculator className="h-3.5 w-3.5" />
                          {guide.formulas.length} Formulas
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredGuides.length === 0 && (
          <div className="my-16 rounded-2xl border border-dashed border-border p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-foreground">
              No matching guides found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search terms, difficulty, or category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedDifficulty("All")
                setActiveCategory("All")
                setShowOnlyBookmarks(false)
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear All Filters
            </button>
          </div>
        )}

        {/* Bottom CTA / Knowledge Banner */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />
          <h2 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Ready to test what you've learned?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Put these strategies into practice with our full-length mock tests and topic-wise diagnostic quizzes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95"
            >
              Start Free Practice Test <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              Request a Specific Company Guide
            </Link>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* INTERACTIVE GUIDE READER MODAL                                            */}
      {/* ========================================================================= */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-emerald-500">
                  <selectedGuide.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                      {selectedGuide.category}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {selectedGuide.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">• {selectedGuide.time}</span>
                  </div>
                  <h2 className="font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold text-foreground line-clamp-1">
                    {selectedGuide.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(selectedGuide.id)}
                  className={`rounded-lg p-2 transition-colors ${
                    bookmarkedIds.includes(selectedGuide.id)
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarkedIds.includes(selectedGuide.id) ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-border bg-surface/50 px-6">
              <button
                onClick={() => setReaderTab("steps")}
                className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-all ${
                  readerTab === "steps"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Roadmap & Action Steps ({selectedGuide.steps.length})
              </button>

              {selectedGuide.formulas && selectedGuide.formulas.length > 0 && (
                <button
                  onClick={() => setReaderTab("formulas")}
                  className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-all ${
                    readerTab === "formulas"
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Calculator className="h-4 w-4" />
                  Formulas & Cheat Sheet ({selectedGuide.formulas.length})
                </button>
              )}

              <button
                onClick={() => setReaderTab("practice")}
                className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-all ${
                  readerTab === "practice"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Target className="h-4 w-4" />
                Recommended Practice Tests
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Overview Callout */}
              <div className="rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Executive Summary
                </h4>
                <p className="text-sm leading-relaxed text-foreground">
                  {selectedGuide.overview}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedGuide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-background border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* TAB 1: STEPS */}
              {readerTab === "steps" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground">
                      Step-by-Step Curriculum
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Click the circle to mark a step completed
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedGuide.steps.map((step, idx) => {
                      const isCompleted = (completedSteps[selectedGuide.id] || []).includes(idx)

                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border transition-all p-5 ${
                            isCompleted
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : "border-border bg-card"
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <button
                              onClick={() => toggleStepCompleted(selectedGuide.id, idx)}
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                isCompleted
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-border bg-surface hover:border-emerald-500"
                              }`}
                              aria-label="Toggle step complete"
                            >
                              {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </button>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`text-sm sm:text-base font-bold ${
                                    isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                                  }`}
                                >
                                  {step.title}
                                </h4>
                                <span className="text-xs font-semibold text-muted-foreground">
                                  Step {idx + 1}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                                {step.desc}
                              </p>

                              {step.tips && (
                                <div className="mt-2 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                                  <Lightbulb className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                  <div>
                                    <span className="font-semibold">Pro Tip: </span>
                                    {step.tips}
                                  </div>
                                </div>
                              )}

                              {step.pitfall && (
                                <div className="mt-2 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-800 dark:text-rose-300">
                                  <HelpCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                                  <div>
                                    <span className="font-semibold">Common Pitfall: </span>
                                    {step.pitfall}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: FORMULAS */}
              {readerTab === "formulas" && selectedGuide.formulas && (
                <div className="space-y-4">
                  <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground">
                    Formulas, Shortcuts & Rule Sets
                  </h3>
                  <div className="grid gap-4">
                    {selectedGuide.formulas.map((f, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border bg-card p-5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {f.name}
                          </span>
                        </div>
                        <div className="rounded-xl border border-border bg-surface p-3.5 font-mono text-xs sm:text-sm text-foreground overflow-x-auto whitespace-pre-line">
                          {f.formula}
                        </div>
                        {f.example && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Practical Example: </span>
                            {f.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PRACTICE */}
              {readerTab === "practice" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-foreground">
                      Apply Your Learnings Now
                    </h3>
                    <p className="mx-auto max-w-md text-xs sm:text-sm text-muted-foreground">
                      Real test simulations cement memory and improve pacing. Practice questions aligned to this guide right now.
                    </p>
                    <div className="pt-2">
                      <Link
                        href={selectedGuide.practiceUrl}
                        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95"
                      >
                        Launch Practice Session <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h4 className="text-sm font-bold text-foreground mb-2">
                      Suggested Practice Routine:
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        Complete at least 15 timed questions on this topic.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        Target an accuracy rate of 80% or higher before moving forward.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        Re-read this guide's formulas if you miss more than 3 consecutive questions.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-card px-6 py-4 gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verified for 2026 Campus Recruitment Cycles
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Link
                  href={selectedGuide.practiceUrl}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  <Target className="h-4 w-4" /> Practice This Topic
                </Link>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
