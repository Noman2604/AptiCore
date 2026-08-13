"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Compass,
  Search,
  ArrowRight,
  BookOpen,
  BarChart3,
  Lightbulb,
  Target,
  Clock,
  Star,
  Users,
  Layers,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

const categories = ["All", "Getting Started", "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Test Strategy"]

const guides = [
  {
    title: "Getting Started with AptiCore",
    desc: "Learn how to set up your profile, navigate the dashboard, and take your first practice test.",
    category: "Getting Started",
    steps: 4,
    time: "10 min",
    icon: Compass,
    gradient: "from-sky-500 to-blue-600",
    difficulty: "Beginner",
  },
  {
    title: "Quantitative Aptitude Roadmap",
    desc: "A comprehensive guide covering all quantitative aptitude topics with practice strategies.",
    category: "Quantitative Aptitude",
    steps: 12,
    time: "45 min",
    icon: BarChart3,
    gradient: "from-emerald-500 to-teal-600",
    difficulty: "Intermediate",
  },
  {
    title: "Master Logical Reasoning Puzzles",
    desc: "Step-by-step techniques to solve seating arrangement, syllogisms, and blood relation questions.",
    category: "Logical Reasoning",
    steps: 8,
    time: "30 min",
    icon: Lightbulb,
    gradient: "from-purple-500 to-pink-600",
    difficulty: "Intermediate",
  },
  {
    title: "Verbal Ability for Placements",
    desc: "Improve your reading comprehension, grammar, and vocabulary with targeted practice exercises.",
    category: "Verbal Ability",
    steps: 6,
    time: "25 min",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-600",
    difficulty: "Beginner",
  },
  {
    title: "Test Strategy: Time Management",
    desc: "Learn how to allocate time effectively across different sections and question types.",
    category: "Test Strategy",
    steps: 5,
    time: "15 min",
    icon: Clock,
    gradient: "from-rose-500 to-red-600",
    difficulty: "All Levels",
  },
  {
    title: "Advanced Problem Solving Techniques",
    desc: "Deep dive into shortcut methods, approximation tricks, and elimination strategies.",
    category: "Quantitative Aptitude",
    steps: 10,
    time: "35 min",
    icon: Target,
    gradient: "from-cyan-500 to-blue-600",
    difficulty: "Advanced",
  },
  {
    title: "Data Interpretation Mastery",
    desc: "Learn to analyse tables, graphs, and charts quickly and accurately for placement tests.",
    category: "Quantitative Aptitude",
    steps: 7,
    time: "20 min",
    icon: Layers,
    gradient: "from-violet-500 to-purple-600",
    difficulty: "Intermediate",
  },
  {
    title: "Mock Test Analysis Guide",
    desc: "How to analyse your mock test results effectively and create an improvement plan.",
    category: "Test Strategy",
    steps: 4,
    time: "12 min",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-green-600",
    difficulty: "All Levels",
  },
]

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGuides = guides.filter((guide) => {
    const matchesCategory = activeCategory === "All" || guide.category === activeCategory
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
            <Compass className="h-3.5 w-3.5" /> Step-by-Step
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Guides & <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Follow structured guides to master every aspect of aptitude preparation.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-2.5 pl-10 pr-4 text-sm transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <div
              key={guide.title}
              className="card-hover group flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden"
            >
              <div
                className={`flex h-36 items-center justify-center bg-linear-to-br ${guide.gradient}`}
              >
                <guide.icon className="h-14 w-14 text-white/70" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[hsl(var(--surface))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    {guide.category}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      guide.difficulty === "Beginner"
                        ? "text-emerald-400"
                        : guide.difficulty === "Intermediate"
                          ? "text-amber-400"
                          : guide.difficulty === "Advanced"
                            ? "text-red-400"
                            : "text-sky-400"
                    }`}
                  >
                    {guide.difficulty}
                  </span>
                </div>
                <h3 className="font-display mb-2 font-semibold leading-snug group-hover:text-emerald-400 transition-colors">
                  {guide.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {guide.desc}
                </p>
                <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-3">
                  <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" /> {guide.steps} steps
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {guide.time}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              No guides found matching your criteria.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
