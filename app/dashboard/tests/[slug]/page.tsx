"use client"

import { use, useEffect, useState } from "react"
import axios from "axios"
import {
  Calculator,
  CheckCircle2,
  Play,
  Search,
  BookOpen,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const [category, setCategory] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [adminTests, setAdminTests] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    subcategoriesCount: 0,
    accuracy: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([])
  const [completedSubcategories, setCompletedSubcategories] = useState<
    string[]
  >([])
  const [mixedCompleted, setMixedCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCategoryData() {
      try {
        const [categoriesRes, questionsRes, resultsRes, adminTestsRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get(`/api/questions?category=${slug}&limit=1000`),
          axios
            .get("/api/results?limit=1000")
            .catch(() => ({ data: { data: [] } })),
          axios.get(`/api/tests?category=${slug}&adminOnly=true&limit=100`)
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
      (sub: any) => {
        const subQuestions = questions.filter((question: any) => {
          const currentSubcategoryId =
            question.subcategoryId?._id || question.subcategoryId
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
      (sub: any) => sub.questionCount > 0
    )

    if (searchTerm) {
      filtered = filtered.filter(
        (sub: any) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((sub: any) =>
        sub.questions.some(
          (question: any) =>
            (question.difficultyLevel || "").toLowerCase() === difficultyFilter
        )
      )
    }

    setFilteredSubcategories(filtered)
  }, [category, questions, searchTerm, difficultyFilter])

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block animate-spin">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return <div className="p-10">Category not found</div>
  }

  const completionPercentage = stats.subcategoriesCount
    ? Math.min(100, (stats.completedQuestions / stats.subcategoriesCount) * 100)
    : 0

  return (
    <div className="min-h-screen space-y-8 p-6 mt-12 sm:mt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {category.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {stats.completedQuestions}
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {completionPercentage.toFixed(1)}% Complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Subtopics
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {stats.subcategoriesCount}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {adminTests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Admin Tests</h2>
            <Badge className="bg-amber-500/20 text-amber-700">{adminTests.length} Tests</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {adminTests.map((test: any) => (
              <Card key={test._id} className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg border-amber-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <Badge className="bg-amber-500/20 text-amber-700 text-xs">Admin</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {test.description || "Admin-created test"}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calculator className="h-3 w-3" />
                      <span>{test.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{test.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span className="capitalize">{test.difficultyLevel}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created by: <span className="font-medium">{test.createdBy?.name || 'Admin'}</span>
                  </p>
                  <Button className="w-full" size="sm">
                    Start Test <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Explore Subtopics</h2>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubcategories.length > 0 ? (
          filteredSubcategories.map((sub: any) => (
            <Card
              key={sub._id}
              className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{sub.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {sub.slug}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {sub.description || "Master this topic through practice"}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{sub.questionCount} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>Practice</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Timed</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/tests/${slug}/${sub.slug}`}
                    className="flex-1"
                  >
                    <Button
                      variant={
                        completedSubcategories.includes(sub._id)
                          ? "secondary"
                          : "default"
                      }
                      size="sm"
                      className="w-full"
                      disabled={completedSubcategories.includes(sub._id)}
                    >
                      {completedSubcategories.includes(sub._id) ? (
                        "Completed"
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start Test
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
            <p className="text-muted-foreground">
              No topics found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
