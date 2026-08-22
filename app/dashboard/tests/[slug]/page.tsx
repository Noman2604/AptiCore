"use client"

import { use, useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Question {
  _id: string
  subcategoryId?: string | { _id: string }
  difficultyLevel?: string
}

interface Subcategory {
  _id: string
  name: string
  slug: string
  description?: string
}

interface SubcategoryWithQuestions extends Subcategory {
  questionCount: number
  questions: Question[]
}

interface CategoryData {
  _id: string
  name: string
  slug: string
  description?: string
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

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const [category, setCategory] = useState<CategoryData | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [adminTests, setAdminTests] = useState<AdminTest[]>([])
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    subcategoriesCount: 0,
    accuracy: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [difficultyMenuOpen, setDifficultyMenuOpen] = useState(false)
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubcategoryWithQuestions[]
  >([])
  const [completedSubcategories, setCompletedSubcategories] = useState<
    string[]
  >([])
  const [mixedCompleted, setMixedCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCategoryData() {
      try {
        const [categoriesRes, questionsRes, resultsRes, adminTestsRes] =
          await Promise.all([
            axios.get("/api/categories"),
            axios.get(`/api/questions?category=${slug}&limit=1000`),
            axios
              .get("/api/results?limit=1000")
              .catch(() => ({ data: { data: [] } })),
            axios
              .get(`/api/tests?category=${slug}&adminOnly=true&limit=100`)
              .catch(() => ({ data: { data: [] } })),
          ])

        const filteredCategory = categoriesRes.data.data.find(
          (item: any) => item.slug === slug
        )

        const completedResults = (resultsRes?.data?.data || []).filter(
          (result: any) => result?.status === "completed"
        )

        const completedSubcategoryIds = new Set<string>()
        let hasMixedCompletion = false

        completedResults.forEach((result: any) => {
          const resultCategoryId =
            result?.testId?.categoryId?._id || result?.testId?.categoryId
          const isCurrentCategory =
            resultCategoryId?.toString() === filteredCategory?._id?.toString()

          if (!isCurrentCategory) return

          if (result?.testId?.sessionType === "mixed") {
            hasMixedCompletion = true
            return
          }

          const subcategoryId =
            result?.testId?.subcategory?._id || result?.testId?.subcategory
          if (subcategoryId) {
            completedSubcategoryIds.add(subcategoryId.toString())
          }
        })

        const completedCount =
          completedSubcategoryIds.size + (hasMixedCompletion ? 1 : 0)

        setCategory(filteredCategory || null)
        setQuestions(questionsRes.data.data || [])
        setAdminTests(adminTestsRes?.data?.data || [])
        setCompletedSubcategories(Array.from(completedSubcategoryIds))
        setMixedCompleted(hasMixedCompletion)
        setStats({
          totalQuestions: questionsRes.data.data?.length || 0,
          completedQuestions: completedCount,
          subcategoriesCount: filteredCategory?.subcategories?.length || 0,
          accuracy: 0,
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    void getCategoryData()
  }, [slug])

  useEffect(() => {
    if (!category) return

    const subcategoriesWithQuestions = (category.subcategories || []).map(
      (sub) => {
        const subQuestions = questions.filter((question) => {
          const currentSubcategoryId =
            (question.subcategoryId as any)?._id || question.subcategoryId
          return currentSubcategoryId === sub._id
        })

        return {
          ...sub,
          questionCount: subQuestions.length,
          questions: subQuestions,
        }
      }
    )

    let filtered = subcategoriesWithQuestions.filter(
      (sub) => sub.questionCount > 0
    )

    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((sub) =>
        sub.questions.some(
          (question) =>
            (question.difficultyLevel || "").toLowerCase() ===
            difficultyFilter
        )
      )
    }

    setFilteredSubcategories(filtered)
  }, [category, questions, searchTerm, difficultyFilter])

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background font-[Inter,sans-serif] text-[#e7ecf3] transition-colors duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <div className="flex items-center gap-2.5 font-[JetBrains_Mono,monospace] text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
          Loading...
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background font-[Inter,sans-serif] text-[#e7ecf3] transition-colors duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <p className="text-sm text-muted-foreground">Category not found</p>
      </div>
    )
  }

  const completionPercentage = stats.subcategoriesCount
    ? Math.min(
        100,
        (stats.completedQuestions / stats.subcategoriesCount) * 100
      )
    : 0

  return (
    <div
      className="min-h-screen bg-background dark:bg-[#16191f] font-[Inter,sans-serif] text-[#e7ecf3] transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-8 px-4 pt-20 pb-10 sm:px-6 sm:pt-5 lg:px-5">
        {/* Header */}
        <div className="space-y-5">
          <div>
            <h1 className="mt-1 font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-6 text-muted-foreground">
              {category.description}
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Total Questions
                  </p>
                  <p className="mt-2 font-[Space_Grotesk,sans-serif] text-[26px] font-bold">
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="rounded-lg border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] p-2.5 text-[#6ee7c9]">
                  <span className="text-lg">Σ</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                  Completed
                </p>
                <span className="text-[#3ecf8e]">✓</span>
              </div>
              <p className="mt-2 font-[Space_Grotesk,sans-serif] text-[26px] font-bold">
                {stats.completedQuestions}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#212a37]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] transition-[width] duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="mt-2 font-[JetBrains_Mono,monospace] text-[10.5px] text-muted-foreground">
                {completionPercentage.toFixed(1)}% complete
                {mixedCompleted ? " · mixed session done" : ""}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Subtopics
                  </p>
                  <p className="mt-2 font-[Space_Grotesk,sans-serif] text-[26px] font-bold">
                    {stats.subcategoriesCount}
                  </p>
                </div>
                <div className="rounded-lg border border-[rgba(139,124,246,0.3)] bg-[rgba(139,124,246,0.1)] p-2.5 text-[#8b7cf6]">
                  <span className="text-lg">▤</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin tests */}
        {adminTests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <h2 className="font-[Space_Grotesk,sans-serif] text-xl font-bold sm:text-2xl">
                Admin Tests
              </h2>
              <span className="rounded-full border border-[rgba(245,166,35,0.35)] bg-[rgba(245,166,35,0.1)] px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold text-[#f5a623]">
                {adminTests.length} tests
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {adminTests.map((test) => (
                <div
                  key={test._id}
                  className="flex flex-col rounded-2xl border border-[rgba(245,166,35,0.3)] bg-card p-5 transition hover:border-[rgba(245,166,35,0.55)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold">
                      {test.title}
                    </h3>
                    <span className="shrink-0 rounded-full border border-[rgba(245,166,35,0.35)] bg-[rgba(245,166,35,0.1)] px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] font-semibold tracking-wider text-[#f5a623] uppercase">
                      Admin
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-5.5 text-muted-foreground">
                    {test.description || "Admin-created test"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-[JetBrains_Mono,monospace] text-[11px] text-muted-foreground">
                    <span>Σ {test.totalQuestions} questions</span>
                    <span>⏱ {test.durationMinutes} min</span>
                    <span className="capitalize">⚡ {test.difficultyLevel}</span>
                  </div>
                  <p className="mt-2 font-[JetBrains_Mono,monospace] text-[10.5px] text-muted-foreground">
                    Created by{" "}
                    <span className="text-muted-foreground">
                      {test.createdBy?.name || "Admin"}
                    </span>
                  </p>
                  <div className="flex-1" />
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#f5a623] to-[#e0901a] py-2.5 text-[13px] font-bold text-[#241503] transition hover:brightness-105"
                  >
                    Start Test <span aria-hidden="true">→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore subtopics */}
        <div className="space-y-4">
          <h2 className="font-[Space_Grotesk,sans-serif] text-xl font-bold sm:text-2xl">
            Explore Subtopics
          </h2>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
                ⌕
              </span>
              <input
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pr-3.5 pl-9 text-[13.5px] text-[#e7ecf3] outline-none transition placeholder:text-muted-foreground focus:border-[#6ee7c9]"
              />
            </div>

            <div className="relative w-full md:w-52">
              <button
                type="button"
                onClick={() => setDifficultyMenuOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3.5 py-2.5 text-[13.5px] text-[#e7ecf3] transition hover:border-[#3a4a5e]"
              >
                {
                  DIFFICULTY_OPTIONS.find((o) => o.value === difficultyFilter)
                    ?.label
                }
                <span className="text-muted-foreground">▾</span>
              </button>
              {difficultyMenuOpen && (
                <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-muted shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setDifficultyFilter(option.value)
                        setDifficultyMenuOpen(false)
                      }}
                      className={`block w-full px-3.5 py-2.5 text-left text-[13px] transition hover:bg-[#1a212b] ${
                        difficultyFilter === option.value
                          ? "text-[#6ee7c9]"
                          : "text-[#c3cbd8]"
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

        {/* Subtopic grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubcategories.length > 0 ? (
            filteredSubcategories.map((sub) => {
              const isCompleted = completedSubcategories.includes(sub._id)
              return (
                <div
                  key={sub._id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-[#37465a]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold">
                      {sub.name}
                    </h3>
                    <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] text-muted-foreground">
                      {sub.slug}
                    </span>
                  </div>

                  <p className="mt-2 text-[13px] leading-5.5 text-muted-foreground">
                    {sub.description || "Master this topic through practice"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-[JetBrains_Mono,monospace] text-[11px] text-muted-foreground">
                    <span>▤ {sub.questionCount} questions</span>
                    <span>⚡ Practice</span>
                    <span>⏱ Timed</span>
                  </div>

                  <div className="flex-1" />

                  <Link
                    href={`/dashboard/tests/${slug}/${sub.slug}`}
                    className="mt-4"
                  >
                    <button
                      type="button"
                      disabled={isCompleted}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-bold transition ${
                        isCompleted
                          ? "cursor-not-allowed border border-border bg-muted text-muted-foreground"
                          : "bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] text-[#06120d] hover:brightness-105"
                      }`}
                    >
                      {isCompleted ? (
                        "Completed"
                      ) : (
                        <>
                          <span aria-hidden="true">▶</span> Start Test
                        </>
                      )}
                    </button>
                  </Link>
                </div>
              )
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-[13.5px] text-muted-foreground">
                No topics found matching your search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page