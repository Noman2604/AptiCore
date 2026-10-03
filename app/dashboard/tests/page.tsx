"use client"

import { Suspense, useEffect, useState, useMemo } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  BookOpen,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Zap,
  Timer,
  Play,
  ChevronDown,
  AlertCircle,
  Clock,
} from "lucide-react"
import {
  resolveCategorySlug,
  isValidCategorySlug,
  buildTestUrl,
  getCategoryColor,
} from "@/lib/category-utils"

interface Subcategory {
  _id: string
  name: string
  slug: string
  description?: string
}

interface SubcategoryWithQuestions extends Subcategory {
  questionCount: number
  questions: any[]
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  subcategories?: Subcategory[]
}

interface AdminTest {
  _id: string
  title: string
  description?: string
  totalQuestions: number
  durationMinutes: number
  difficultyLevel?: string
  createdBy?: { name?: string }
}

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]


function DashboardTestsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawCategoryParam = searchParams.get("category")
  const selectedCategorySlug = resolveCategorySlug(rawCategoryParam)

  // Overview state
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [overviewSearch, setOverviewSearch] = useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    "all" | "active"
  >("all")

  // Selected Category Detail state
  const [detailCategory, setDetailCategory] = useState<Category | null>(null)
  const [detailQuestions, setDetailQuestions] = useState<any[]>([])
  const [adminTests, setAdminTests] = useState<AdminTest[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailSearch, setDetailSearch] = useState("")
  const [detailDifficulty, setDetailDifficulty] = useState("all")
  const [difficultyMenuOpen, setDifficultyMenuOpen] = useState(false)
  const [completedSubcategories, setCompletedSubcategories] = useState<
    string[]
  >([])
  const [mixedCompleted, setMixedCompleted] = useState(false)

  // Fetch all categories once
  useEffect(() => {
    async function loadAllCategories() {
      try {
        setCategoriesLoading(true)
        const res = await axios.get("/api/categories")
        setCategories(res.data.data || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadAllCategories()
  }, [])

  // If a category query param is present, fetch its detailed questions & completed status
  useEffect(() => {
    if (!selectedCategorySlug) {
      setDetailCategory(null)
      return
    }

    const currentSlug = selectedCategorySlug

    async function loadCategoryDetails() {
      try {
        setDetailLoading(true)
        const [categoriesRes, questionsRes, resultsRes, adminTestsRes] =
          await Promise.all([
            axios.get("/api/categories"),
            axios.get(
              `/api/questions?category=${encodeURIComponent(currentSlug)}&limit=1000`
            ),
            axios
              .get("/api/results?limit=1000")
              .catch(() => ({ data: { data: [] } })),
            axios
              .get(
                `/api/tests?category=${encodeURIComponent(currentSlug)}&adminOnly=true&limit=100`
              )
              .catch(() => ({ data: { data: [] } })),
          ])

        const allCats: Category[] = categoriesRes.data?.data || []
        setCategories(allCats)

        const matched = allCats.find(
          (c) => c.slug.toLowerCase() === currentSlug.toLowerCase()
        )
        setDetailCategory(matched || null)
        setDetailQuestions(questionsRes.data?.data || [])
        setAdminTests(adminTestsRes?.data?.data || [])

        // Completed subcategories
        const completedResults = (resultsRes?.data?.data || []).filter(
          (r: any) => r?.status === "completed"
        )
        const completedSubIds = new Set<string>()
        let hasMixed = false

        completedResults.forEach((result: any) => {
          const resCatId =
            result?.testId?.categoryId?._id || result?.testId?.categoryId
          if (matched && resCatId?.toString() === matched._id?.toString()) {
            if (result?.testId?.sessionType === "mixed") {
              hasMixed = true
            } else {
              const subId =
                result?.testId?.subcategory?._id || result?.testId?.subcategory
              if (subId) completedSubIds.add(subId.toString())
            }
          }
        })

        setCompletedSubcategories(Array.from(completedSubIds))
        setMixedCompleted(hasMixed)
      } catch (err) {
        console.error("Failed to load category details:", err)
      } finally {
        setDetailLoading(false)
      }
    }

    void loadCategoryDetails()
  }, [selectedCategorySlug])

  const totalSubtopicsCount = useMemo(() => {
    return categories.reduce(
      (acc, cat) => acc + (cat.subcategories?.length || 0),
      0
    )
  }, [categories])

  // Filtered categories for overview view
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (selectedStatusFilter === "active" && !cat.isActive) return false
      if (!overviewSearch) return true

      const query = overviewSearch.toLowerCase()
      const matchName = cat.name.toLowerCase().includes(query)
      const matchDesc = cat.description?.toLowerCase().includes(query)
      const matchSubs = cat.subcategories?.some((s) =>
        s.name.toLowerCase().includes(query)
      )
      return matchName || matchDesc || matchSubs
    })
  }, [categories, overviewSearch, selectedStatusFilter])

  // Filtered subcategories for category detail view
  const filteredSubcategories = useMemo(() => {
    if (!detailCategory) return []

    const subsWithCounts: SubcategoryWithQuestions[] = (
      detailCategory.subcategories || []
    ).map((sub) => {
      const subQuestions = detailQuestions.filter((q) => {
        const currentSubId = (q.subcategoryId as any)?._id || q.subcategoryId
        return currentSubId === sub._id
      })
      return {
        ...sub,
        questionCount: subQuestions.length,
        questions: subQuestions,
      }
    })

    let filtered = subsWithCounts

    if (detailSearch) {
      const q = detailSearch.toLowerCase()
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          sub.description?.toLowerCase().includes(q)
      )
    }

    if (detailDifficulty !== "all") {
      filtered = filtered.filter((sub) =>
        sub.questions.some(
          (question) =>
            (question.difficultyLevel || "").toLowerCase() ===
            detailDifficulty.toLowerCase()
        )
      )
    }

    return filtered
  }, [detailCategory, detailQuestions, detailSearch, detailDifficulty])

  // ==========================================
  // VIEW 1: CATEGORY DETAIL VIEW (?category=...)
  // ==========================================
  if (selectedCategorySlug) {
    if (detailLoading) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center font-[Inter,sans-serif]">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
            Loading category practice tests...
          </div>
        </div>
      )
    }

    if (!detailCategory) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-[Inter,sans-serif]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-foreground">
            Category Not Found
          </h2>
          <p className="mt-1 max-w-md text-xs text-muted-foreground sm:text-sm">
            &ldquo;{rawCategoryParam}&rdquo; does not match any active practice
            category.
          </p>
          <Link
            href="/dashboard/tests"
            className="mt-5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:brightness-105"
          >
            ← View All Categories
          </Link>
        </div>
      )
    }

    const subCount = detailCategory.subcategories?.length || 0
    const completedCount =
      completedSubcategories.length + (mixedCompleted ? 1 : 0)
    const completionPercentage = subCount
      ? Math.min(100, (completedCount / subCount) * 100)
      : 0

    return (
      <div
        className="min-h-screen bg-[--ac-bg] pb-16 font-[Inter,sans-serif] text-[--ac-text] transition-colors duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <div className="mx-auto max-w-7xl space-y-8 px-4 pt-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div>
            <Link
              href="/dashboard/tests"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to All Categories</span>
            </Link>
          </div>

          {/* Category Header */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#6ee7c9]/30 bg-[#6ee7c9]/10 px-3 py-1 text-xs font-semibold text-[#6ee7c9]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Syllabus Bank</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {detailCategory.name}
              </h1>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {detailCategory.description ||
                  "Practice topic-wise questions with real-time test timers and detailed answers."}
              </p>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-xs backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Total Questions
                    </p>
                    <p className="mt-1 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-foreground">
                      {detailQuestions.length}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Available across subtopics
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#6ee7c9]/30 bg-[#6ee7c9]/10 p-2.5 text-[#6ee7c9]">
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-xs backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Completed Topics
                    </p>
                    <p className="mt-1 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[#3ecf8e]">
                      {completedCount}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {completionPercentage.toFixed(0)}% syllabus completed
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#3ecf8e]/30 bg-[#3ecf8e]/10 p-2.5 text-[#3ecf8e]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-xs backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Subtopics Available
                    </p>
                    <p className="mt-1 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[#8b7cf6]">
                      {subCount}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Individual test modules
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#8b7cf6]/30 bg-[#8b7cf6]/10 p-2.5 text-[#8b7cf6]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Tests Section if available */}
          {adminTests.length > 0 && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center gap-2.5">
                <h2 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-foreground sm:text-xl">
                  Featured Custom Tests
                </h2>
                <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 text-[10.5px] font-semibold text-amber-400">
                  {adminTests.length} tests
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {adminTests.map((test) => (
                  <div
                    key={test._id}
                    className="flex flex-col rounded-2xl border border-amber-500/30 bg-card/80 p-5 shadow-xs backdrop-blur-sm transition hover:border-amber-500/60 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground">
                        {test.title}
                      </h3>
                      <span className="shrink-0 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[9.5px] font-semibold tracking-wider text-amber-400 uppercase">
                        Admin Test
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {test.description || "Curated placement assessment test"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{test.totalQuestions} questions</span>
                      <span>·</span>
                      <span>{test.durationMinutes} min</span>
                      <span>·</span>
                      <span className="capitalize">{test.difficultyLevel}</span>
                    </div>
                    <div className="flex-1" />
                    <Link
                      href={`/dashboard/tests/runner?category=${encodeURIComponent(detailCategory.slug)}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 py-2.5 text-xs font-bold text-black transition hover:brightness-105"
                    >
                      <Play className="h-3.5 w-3.5 fill-black" />
                      <span>Start Test</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtopics Explorer Header & Search/Filter */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground sm:text-2xl">
                  Explore Subtopics
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select a topic to launch a targeted practice session with live
                  timers.
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    placeholder="Search subtopics..."
                    value={detailSearch}
                    onChange={(e) => setDetailSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card/80 py-2 pr-3 pl-9 text-xs text-foreground transition outline-none placeholder:text-muted-foreground focus:border-[#6ee7c9] sm:text-sm"
                  />
                  {detailSearch && (
                    <button
                      onClick={() => setDetailSearch("")}
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="relative w-full sm:w-44">
                  <button
                    type="button"
                    onClick={() => setDifficultyMenuOpen((open) => !open)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-card/80 px-3.5 py-2 text-xs text-foreground transition hover:border-[#6ee7c9]"
                  >
                    <span>
                      {
                        DIFFICULTY_OPTIONS.find(
                          (o) => o.value === detailDifficulty
                        )?.label
                      }
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  {difficultyMenuOpen && (
                    <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setDetailDifficulty(option.value)
                            setDifficultyMenuOpen(false)
                          }}
                          className={`block w-full px-3.5 py-2 text-left text-xs transition ${
                            detailDifficulty === option.value
                              ? "bg-primary/10 font-semibold text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subtopics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubcategories.length > 0 ? (
                filteredSubcategories.map((sub) => {
                  const isCompleted = completedSubcategories.includes(sub._id)
                  const runnerUrl = buildTestUrl(detailCategory.slug, sub.slug)

                  return (
                    <div
                      key={sub._id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card/80 p-5 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground transition-colors group-hover:text-primary">
                            {sub.name}
                          </h3>
                          {isCompleted ? (
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                              <CheckCircle2 className="h-3 w-3" /> Done
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                              {sub.slug}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {sub.description ||
                            "Master this topic with practice questions and step-by-step solutions."}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {sub.questionCount > 0
                                ? `${sub.questionCount} Questions`
                                : "Practice Mode"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Timed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                            <span>Earn XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link href={runnerUrl} className="block w-full">
                          <button
                            type="button"
                            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold shadow-xs transition ${
                              isCompleted
                                ? "border border-border bg-muted text-foreground hover:bg-muted/80"
                                : "bg-linear-to-br from-[#6ee7c9] to-[#3ecf8e] text-[#06120d] hover:brightness-105"
                            }`}
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>
                              {isCompleted ? "Practice Again" : "Start Test"}
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
                  <BookOpen className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-foreground">
                    No subtopics found matching your filter
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try clearing the search query or selecting &ldquo;All
                    Difficulties&rdquo;.
                  </p>
                  {detailSearch && (
                    <button
                      onClick={() => setDetailSearch("")}
                      className="mt-3 text-xs font-semibold text-[#6ee7c9] hover:underline"
                    >
                      Clear search filter
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW 2: ALL CATEGORIES OVERVIEW (No category param)
  // ==========================================
  return (
    <div
      className="min-h-screen bg-[--ac-bg] font-[Inter,sans-serif] text-[--ac-text] transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Practice Test Portal</span>
            </div>
            <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Choose a Category to Begin
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Explore subject-wise practice tests built from the question bank,
              test your skills with adaptive timed sessions, and prepare for
              placement interviews.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-center backdrop-blur-xs sm:text-left">
              <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Categories
              </p>
              <p className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                {categories.length}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-center backdrop-blur-xs sm:text-left">
              <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Total Topics
              </p>
              <p className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-[#6ee7c9]">
                {totalSubtopicsCount}+
              </p>
            </div>
          </div>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={overviewSearch}
              onChange={(e) => setOverviewSearch(e.target.value)}
              placeholder="Search category or topic (e.g. Percentage, SQL)..."
              className="w-full rounded-xl border border-border bg-card/80 py-2.5 pr-4 pl-9 text-xs text-foreground shadow-xs transition placeholder:text-muted-foreground focus:border-[#6ee7c9] focus:outline-none sm:text-sm"
            />
            {overviewSearch && (
              <button
                onClick={() => setOverviewSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-start text-xs sm:self-auto">
            <button
              onClick={() => setSelectedStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                selectedStatusFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              All Categories ({categories.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("active")}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                selectedStatusFilter === "active"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Only
            </button>
          </div>
        </div>

        {/* Loading State */}
        {categoriesLoading && (
          <div className="mt-12 flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
            Loading category banks...
          </div>
        )}

        {/* Empty State */}
        {!categoriesLoading && filteredCategories.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-sm text-muted-foreground">
            <BookOpen className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No categories found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {overviewSearch
                ? `No categories match "${overviewSearch}". Try resetting your search.`
                : "No categories have been seeded yet."}
            </p>
            {overviewSearch && (
              <button
                onClick={() => setOverviewSearch("")}
                className="mt-3 text-xs font-semibold text-[#6ee7c9] hover:underline"
              >
                Clear search filter
              </button>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => {
            const accent = getCategoryColor(category.slug)
            const subs = category.subcategories || []
            const categoryUrl = buildTestUrl(category.slug)

            return (
              <div
                key={category._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/25"
              >
                {/* Accent top stripe */}
                <div
                  className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                  style={{ backgroundColor: accent }}
                />

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Category Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                      {category.name}
                    </h2>
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                      style={
                        category.isActive
                          ? {
                              color: "#3ecf8e",
                              borderColor: "rgba(62,207,142,0.35)",
                              backgroundColor: "rgba(62,207,142,0.1)",
                            }
                          : {
                              color: "#f2555a",
                              borderColor: "rgba(242,85,90,0.35)",
                              backgroundColor: "rgba(242,85,90,0.1)",
                            }
                      }
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {category.description ||
                      "Comprehensive questions to test your proficiency."}
                  </p>

                  {/* Subcategories list */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Subtopics ({subs.length})
                      </p>
                      <Link
                        href={categoryUrl}
                        className="text-[11px] text-[#6ee7c9] hover:underline"
                      >
                        All →
                      </Link>
                    </div>

                    <div className="flex max-h-21.25 flex-wrap gap-1.5 overflow-hidden">
                      {subs.length ? (
                        subs.slice(0, 5).map((sub) => {
                          const subRunnerUrl = buildTestUrl(
                            category.slug,
                            sub.slug
                          )
                          return (
                            <Link
                              key={sub._id}
                              href={subRunnerUrl}
                              className="rounded-lg border border-border bg-muted/60 px-2 py-1 text-[10.5px] text-muted-foreground transition hover:border-[#6ee7c9] hover:bg-card hover:text-foreground"
                            >
                              {sub.name}
                            </Link>
                          )
                        })
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No subcategories
                        </span>
                      )}
                      {subs.length > 5 && (
                        <Link
                          href={categoryUrl}
                          className="rounded-lg border border-border bg-muted/30 px-2 py-1 text-[10.5px] font-medium text-muted-foreground hover:bg-muted"
                        >
                          +{subs.length - 5} more
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex-1" />

                  {/* CTA Button */}
                  <Link
                    href={categoryUrl}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-black shadow-xs transition hover:brightness-105"
                    style={{
                      background: `linear-gradient(135deg, ${accent}, #ffffffcc)`,
                    }}
                  >
                    <span>View All {subs.length} Subtopics & Tests</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DashboardTestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center font-[Inter,sans-serif]">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
            Loading practice tests...
          </div>
        </div>
      }
    >
      <DashboardTestsContent />
    </Suspense>
  )
}
