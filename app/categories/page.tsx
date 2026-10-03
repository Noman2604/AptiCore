"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getCategoryColor, resolveCategorySlug } from "@/lib/category-utils"
import { cn } from "@/lib/utils"
import {
  Search,
  BookOpen,
  Code2,
  Database,
  Brain,
  Cpu,
  MessageSquare,
  FileText,
  Lightbulb,
  Target,
  BarChart2,
  Medal,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Building2,
  Clock,
  ChevronRight,
  Layers,
  Flame,
  ArrowLeft,
  X,
  HelpCircle,
  GraduationCap,
  ShieldCheck,
} from "lucide-react"

interface Subcategory {
  _id: string
  name: string
  slug: string
  description?: string
  displayOrder?: number
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  colorCode?: string
  iconUrl?: string
  displayOrder?: number
  subcategories?: Subcategory[]
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  quantitative: BookOpen,
  "logical-reasoning": Brain,
  "verbal-ability": MessageSquare,
  "coding-mcqs": Code2,
  "data-interpretation": BarChart2,
  "object-oriented-programming": Cpu,
  "interview-preparation": Target,
}

const RECRUITER_COMPANIES = [
  "TCS",
  "Infosys",
  "Accenture",
  "Wipro",
  "Cognizant",
  "Capgemini",
  "Amazon",
  "Microsoft",
  "Deloitte",
  "IBM",
]

function CategoriesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawType = searchParams.get("type") || searchParams.get("category")
  const activeSlug = resolveCategorySlug(rawType)

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [subtopicSearch, setSubtopicSearch] = useState("")
  const [globalSearch, setGlobalSearch] = useState("")

  useEffect(() => {
    let isMounted = true
    async function fetchCategories() {
      try {
        setLoading(true)
        const res = await axios.get("/api/categories")
        if (res.data?.success && isMounted) {
          setCategories(res.data.data || [])
        }
      } catch (err) {
        console.error("Failed to load categories", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [])

  // Find active category if slug matches
  const activeCategory = useMemo(() => {
    if (!activeSlug || categories.length === 0) return null
    return (
      categories.find(
        (c) =>
          c.slug.toLowerCase() === activeSlug.toLowerCase() ||
          resolveCategorySlug(c.slug) === activeSlug
      ) || null
    )
  }, [activeSlug, categories])

  // Filter subtopics for active category
  const filteredSubtopics = useMemo(() => {
    if (!activeCategory?.subcategories) return []
    if (!subtopicSearch.trim()) return activeCategory.subcategories
    const q = subtopicSearch.toLowerCase().trim()
    return activeCategory.subcategories.filter(
      (sub) =>
        sub.name.toLowerCase().includes(q) ||
        (sub.description && sub.description.toLowerCase().includes(q))
    )
  }, [activeCategory, subtopicSearch])

  // Filter all categories for global view
  const filteredCategories = useMemo(() => {
    if (!globalSearch.trim()) return categories
    const q = globalSearch.toLowerCase().trim()
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q)) ||
        cat.subcategories?.some((s) => s.name.toLowerCase().includes(q))
    )
  }, [categories, globalSearch])

  const handleSelectCategory = (slug: string | null) => {
    setSubtopicSearch("")
    if (!slug) {
      router.push("/categories")
    } else {
      router.push(`/categories?type=${encodeURIComponent(slug)}`)
    }
  }

  const getCategoryTheme = (slug: string) => {
    const resolved = resolveCategorySlug(slug) || slug
    const icon = CATEGORY_ICON_MAP[resolved] || Layers
    const color = getCategoryColor(resolved)
    return { icon, color }
  }

  return (
    <div className="min-h-screen bg-[--ac-bg] font-[Inter,sans-serif] text-[--ac-text] selection:bg-[#6ee7c9]/20 selection:text-[--ac-text]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-28 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-[--ac-text-3]"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[--ac-text]"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <button
            onClick={() => handleSelectCategory(null)}
            className={cn(
              "transition-colors hover:text-[--ac-text]",
              !activeCategory && "font-semibold text-[#6ee7c9]"
            )}
          >
            Categories
          </button>
          {activeCategory && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-[#6ee7c9]">
                {activeCategory.name}
              </span>
            </>
          )}
        </nav>

        {/* ── Category Pill Selector Rail ────────────────────────────────────────── */}
        <div className="mb-8 border-b border-[--ac-border] pb-4 ">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleSelectCategory(null)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                !activeCategory
                  ? "bg-[#6ee7c9] text-[#06120d] shadow-sm shadow-[#6ee7c9]/20"
                  : "border border-[--ac-border] bg-[--ac-bg-elevated] text-[--ac-text-2] hover:border-[--ac-border-2] hover:text-[--ac-text]"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Tracks ({categories.length})</span>
            </button>

            {categories.map((cat) => {
              const isActive = activeCategory?._id === cat._id
              const { icon: CatIcon, color } = getCategoryTheme(cat.slug)

              return (
                <button
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={cn(
                    "inline-flex shrink-0 mt-1 items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all",
                    isActive
                      ? "bg-[#6ee7c9] text-[#06120d] shadow-sm shadow-[#6ee7c9]/20"
                      : "border border-[--ac-border] bg-[--ac-bg-elevated] text-[--ac-text-2] hover:border-[--ac-border-2] hover:text-[--ac-text]"
                  )}
                >
                  <CatIcon
                    className="h-3.5 w-3.5"
                    style={{ color: isActive ? color : undefined }}
                  />
                  <span>{cat.name}</span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <span className="rounded-full bg-[--ac-border] px-1.5 py-0.2 text-[10px] font-mono text-[--ac-text-3]">
                      {cat.subcategories.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        {loading ? (
          <div className="space-y-6">
            <div className="h-44 w-full animate-pulse rounded-2xl border border-[--ac-border] bg-[--ac-bg-elevated]" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-xl border border-[--ac-border] bg-[--ac-bg-elevated] p-5"
                />
              ))}
            </div>
          </div>
        ) : activeCategory ? (
          <div className="space-y-10">
            {/* Category Hero Banner */}
            {(() => {
              const { icon: HeroIcon, color } = getCategoryTheme(activeCategory.slug)
              const subCount = activeCategory.subcategories?.length || 0

              return (
                <div className="relative overflow-hidden rounded-2xl border border-[--ac-border] bg-[--ac-bg-elevated] p-6 sm:p-8 md:p-10 shadow-xs">
                  <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-8">
                      <div className="mb-4 flex flex-wrap items-center gap-2.5">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[--ac-border] bg-[--ac-surface] shadow-xs"
                        >
                          <HeroIcon className="h-5 w-5" style={{ color }} />
                        </div>
                        <span className="inline-flex items-center rounded-full border border-[--ac-border] bg-[--ac-surface] px-3 py-1 font-[JetBrains_Mono,monospace] text-xs text-[--ac-text-2]">
                          Placement Curriculum Track
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified Questions
                        </span>
                      </div>

                      <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight text-[--ac-text] sm:text-3xl md:text-4xl">
                        {activeCategory.name}
                      </h1>

                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[--ac-text-2] sm:text-base">
                        {activeCategory.description ||
                          `Master all essential topics and recurring assessment patterns in ${activeCategory.name}. Practice topic-by-topic or attempt timed, proctored mock assessments.`}
                      </p>

                      {/* Stat Badges */}
                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 rounded-lg border border-[--ac-border] bg-[--ac-surface] px-3 py-1.5 text-[--ac-text-2]">
                          <Layers className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-semibold text-[--ac-text]">{subCount}</span>
                          <span>Subtopics</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border border-[--ac-border] bg-[--ac-surface] px-3 py-1.5 text-[--ac-text-2]">
                          <Clock className="h-3.5 w-3.5 text-amber-400" />
                          <span>Timed Proctored Tests</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border border-[--ac-border] bg-[--ac-surface] px-3 py-1.5 text-[--ac-text-2]">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Detailed Solutions Included</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column Action Cards */}
                    <div className="flex flex-col gap-3 rounded-xl border border-[--ac-border] bg-[--ac-surface]/60 p-5 lg:col-span-4 backdrop-blur-xs">
                      <div className="text-xs font-semibold text-[--ac-text] uppercase tracking-wider">
                        Practice Assessment
                      </div>
                      <p className="text-xs text-[--ac-text-2]">
                        Launch a full assessment covering randomized questions across all {subCount} {activeCategory.name} subtopics.
                      </p>
                      <Link
                        href={`/dashboard/tests/runner?category=${encodeURIComponent(activeCategory.slug)}`}
                        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6ee7c9] to-[#57c9a8] py-3 text-xs font-bold text-[#06120d] shadow-sm transition hover:brightness-105 active:scale-[0.99]"
                      >
                        <Play className="h-3.5 w-3.5 fill-[#06120d]" />
                        <span>Start Full Category Test</span>
                      </Link>

                      <Link
                        href={`/dashboard/tests?category=${encodeURIComponent(activeCategory.slug)}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[--ac-border] bg-[--ac-bg-elevated] py-2.5 text-xs font-medium text-[--ac-text] transition hover:bg-[--ac-surface] hover:border-[--ac-border-2]"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-[--ac-text-2]" />
                        <span>Browse in Test Bank</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Recruiter Hiring Alignment */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[--ac-border] bg-[--ac-bg-elevated] px-5 py-4">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[--ac-text]">
                <Building2 className="h-4 w-4 text-[#8b7cf6]" />
                <span>Companies Testing {activeCategory.name}:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {RECRUITER_COMPANIES.map((company, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-[--ac-border] bg-[--ac-surface] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[11px] text-[--ac-text-2]"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtopics Explorer Section */}
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-[--ac-text] sm:text-2xl">
                    Subtopics & Modules
                  </h2>
                  <p className="mt-1 text-xs text-[--ac-text-2]">
                    Select any specific module to focus your practice and analyze your strengths.
                  </p>
                </div>

                {/* Subtopic Search Filter */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
                  <input
                    type="text"
                    value={subtopicSearch}
                    onChange={(e) => setSubtopicSearch(e.target.value)}
                    placeholder={`Search in ${activeCategory.name}...`}
                    className="w-full rounded-xl border border-[--ac-border] bg-[--ac-bg-elevated] py-2 pr-8 pl-9 text-xs text-[--ac-text] placeholder:text-[--ac-text-3] focus:border-[#6ee7c9] focus:outline-none"
                  />
                  {subtopicSearch && (
                    <button
                      onClick={() => setSubtopicSearch("")}
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[--ac-text-3] hover:text-[--ac-text]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {filteredSubtopics.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSubtopics.map((sub, i) => (
                    <div
                      key={sub._id || sub.slug || i}
                      className="group flex flex-col justify-between rounded-xl border border-[--ac-border] bg-[--ac-bg-elevated] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[--ac-border-2] hover:shadow-md"
                    >
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-wider text-[--ac-text-3]">
                            Module {i + 1}
                          </span>
                          <span className="inline-flex items-center rounded-md border border-[--ac-border] bg-[--ac-surface] px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] text-[--ac-text-3]">
                            MCQ Assessment
                          </span>
                        </div>

                        <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-base font-semibold text-[--ac-text] transition-colors group-hover:text-[#6ee7c9]">
                          {sub.name}
                        </h3>

                        <p className="line-clamp-2 text-xs leading-relaxed text-[--ac-text-2]">
                          {sub.description ||
                            `Fundamental concepts, shortcuts, and practice questions for ${sub.name}.`}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-[--ac-border] pt-4">
                        <Link
                          href={`/dashboard/tests/runner?category=${encodeURIComponent(activeCategory.slug)}&subcategory=${encodeURIComponent(sub.slug)}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[--ac-surface] py-2 text-xs font-semibold text-[--ac-text] transition-all hover:bg-[#6ee7c9] hover:text-[#06120d]"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Practice Topic</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[--ac-border] bg-[--ac-bg-elevated] p-12 text-center">
                  <HelpCircle className="mx-auto mb-2 h-7 w-7 text-[--ac-text-3]" />
                  <p className="text-sm font-medium text-[--ac-text]">
                    No subtopics match &quot;{subtopicSearch}&quot;
                  </p>
                  <p className="mt-1 text-xs text-[--ac-text-3]">
                    Try clearing your search query to view all available modules.
                  </p>
                  <button
                    onClick={() => setSubtopicSearch("")}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[--ac-border] bg-[--ac-surface] px-3.5 py-1.5 text-xs text-[--ac-text] hover:border-[--ac-border-2]"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Preparation Strategy Card */}
            <div className="grid gap-6 rounded-2xl border border-[--ac-border] bg-[--ac-bg-elevated] p-6 sm:p-8 md:grid-cols-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[--ac-border] bg-[--ac-surface] text-[#6ee7c9]">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[--ac-text]">Concept Clarity First</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[--ac-text-2]">
                    Review fundamental formulas and core logic before jumping into timed assessments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[--ac-border] bg-[--ac-surface] text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[--ac-text]">Pacing & Time Budgeting</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[--ac-text-2]">
                    Aim for 45 to 60 seconds per question to build speed under proctored test constraints.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[--ac-border] bg-[--ac-surface] text-[#8b7cf6]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[--ac-text]">Error Analysis</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[--ac-text-2]">
                    Check detailed solutions immediately after submission to eliminate conceptual weak spots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : rawType && !activeCategory ? (
          /* Category Not Found View */
          <div className="rounded-2xl border border-[--ac-border] bg-[--ac-bg-elevated] p-12 text-center">
            <HelpCircle className="mx-auto mb-3 h-10 w-10 text-amber-400" />
            <h2 className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-[--ac-text]">
              Category &quot;{rawType}&quot; not found
            </h2>
            <p className="mt-2 text-xs text-[--ac-text-2]">
              The category you requested may have been renamed or moved. Browse our complete tracks below.
            </p>
            <button
              onClick={() => handleSelectCategory(null)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6ee7c9] px-5 py-2.5 text-xs font-semibold text-[#06120d] transition hover:brightness-105"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Browse All Categories</span>
            </button>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════════════
             ALL CATEGORIES DIRECTORY VIEW (When no ?type= is selected)
             ═══════════════════════════════════════════════════════════════════════ */
          <div className="space-y-8">
            {/* Header Hero */}
            <div className="text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[--ac-border] bg-[--ac-bg-elevated] px-3.5 py-1.5 text-xs text-[--ac-text-2]">
                <Flame className="h-3.5 w-3.5 text-[#f2896b]" />
                <span>Placement Assessment Curriculums</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-3xl font-bold tracking-tight text-[--ac-text] sm:text-4xl md:text-5xl">
                Explore Aptitude Tracks
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[--ac-text-2]">
                Structured practice tracks covering quantitative aptitude, logical reasoning, verbal comprehension, and core coding MCQs.
              </p>

              {/* Global Category Search */}
              <div className="relative mx-auto mt-6 max-w-md">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[--ac-text-3]" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search categories or subtopics..."
                  className="w-full rounded-xl border border-[--ac-border] bg-[--ac-bg-elevated] py-3 pr-9 pl-10 text-xs text-[--ac-text] placeholder:text-[--ac-text-3] focus:border-[#6ee7c9] focus:outline-none"
                />
                {globalSearch && (
                  <button
                    onClick={() => setGlobalSearch("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[--ac-text-3] hover:text-[--ac-text]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid of Categories */}
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map((category) => {
                  const { icon: CatIcon, color } = getCategoryTheme(category.slug)
                  const subCount = category.subcategories?.length || 0

                  return (
                    <div
                      key={category._id}
                      className="group flex flex-col justify-between rounded-2xl border border-[--ac-border] bg-[--ac-bg-elevated] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[--ac-border-2] hover:shadow-lg"
                    >
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[--ac-border] bg-[--ac-surface]">
                            <CatIcon className="h-5 w-5" style={{ color }} />
                          </div>
                          {subCount > 0 && (
                            <span className="rounded-full border border-[--ac-border] bg-[--ac-surface] px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[11px] text-[--ac-text-3]">
                              {subCount} Subtopics
                            </span>
                          )}
                        </div>

                        <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-lg font-bold text-[--ac-text] transition-colors group-hover:text-[#6ee7c9]">
                          {category.name}
                        </h3>

                        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[--ac-text-2]">
                          {category.description ||
                            `Comprehensive practice modules and proctored questions for ${category.name}.`}
                        </p>

                        {/* Subtopics preview chips */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-1.5">
                            {category.subcategories.slice(0, 3).map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="rounded-md bg-[--ac-surface] px-2 py-0.5 text-[10.5px] text-[--ac-text-3]"
                              >
                                {sub.name}
                              </span>
                            ))}
                            {category.subcategories.length > 3 && (
                              <span className="rounded-md bg-[--ac-surface] px-2 py-0.5 text-[10.5px] font-mono text-[--ac-text-3]">
                                +{category.subcategories.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-[--ac-border] pt-4">
                        <button
                          onClick={() => handleSelectCategory(category.slug)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[--ac-border] bg-[--ac-surface] py-2 text-xs font-semibold text-[--ac-text] transition hover:border-[--ac-border-2] hover:bg-[--ac-border]"
                        >
                          <span>Explore Track</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/dashboard/tests/runner?category=${encodeURIComponent(category.slug)}`}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#6ee7c9] py-2 text-xs font-bold text-[#06120d] transition hover:brightness-105"
                        >
                          <Play className="h-3 w-3 fill-[#06120d]" />
                          <span>Quick Test</span>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[--ac-border] bg-[--ac-bg-elevated] p-12 text-center">
                <HelpCircle className="mx-auto mb-2 h-7 w-7 text-[--ac-text-3]" />
                <p className="text-sm font-medium text-[--ac-text]">
                  No categories found matching &quot;{globalSearch}&quot;
                </p>
                <button
                  onClick={() => setGlobalSearch("")}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[--ac-border] bg-[--ac-surface] px-3.5 py-1.5 text-xs text-[--ac-text] hover:border-[--ac-border-2]"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="status-ping" />
            <span>Loading categories...</span>
          </div>
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  )
}
