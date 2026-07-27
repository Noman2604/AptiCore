"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trophy, FileText, Star, ChevronLeft, ChevronRight } from "lucide-react"
interface ResultHistoryItem {
  _id: string
  testName: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers: number
  skippedQuestions: number
  accuracy: number
  marksObtained: number
  totalMarks: number
  status: string
  submittedAt?: string
}

interface AchievementHistoryItem {
  _id: string
  achievementId: {
    _id: string
    name: string
    pointsReward: number
  }
  unlockedAt?: string
}

interface XpHistoryItem {
  _id: string
  xpPoints: number
  sourceType: string
  sourceId?: string
  createdAt?: string
}

const sourceLabels: Record<string, string> = {
  achievement: "Achievement",
  test_completion: "Test Completion",
  correct_answer: "Correct Answer",
  streak: "Streak Bonus",
  bonus: "Bonus",
}

function formatDate(value?: string) {
  if (!value) return "Recent"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export default function HistoryPage() {
  const [results, setResults] = useState<ResultHistoryItem[]>([])
  const [achievements, setAchievements] = useState<AchievementHistoryItem[]>([])
  const [xpHistory, setXpHistory] = useState<XpHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 10

  const [testPage, setTestPage] = useState(1)
  const [xpPage, setXpPage] = useState(1)
  const [achievementPage, setAchievementPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      try {
        setLoading(true)
        setError(null)

        const [resultsRes, achievementsRes, xpRes] = await Promise.all([
          fetch("/api/results?limit=10", { credentials: "include" }),
          fetch("/api/achievements/user", { credentials: "include" }),
          fetch("/api/xp-history", { credentials: "include" }),
        ])

        const resultsJson = await resultsRes.json()
        const achievementsJson = await achievementsRes.json()
        const xpJson = await xpRes.json()

        if (!resultsRes.ok || !resultsJson.success) {
          throw new Error(resultsJson.error || "Failed to load results")
        }

        if (!achievementsRes.ok || !achievementsJson.success) {
          throw new Error(
            achievementsJson.error || "Failed to load achievements history"
          )
        }

        if (!xpRes.ok || !xpJson.success) {
          throw new Error(xpJson.error || "Failed to load XP history")
        }

        if (isMounted) {
          setResults(resultsJson.data || [])
          setAchievements(achievementsJson.data || [])
          setXpHistory(xpJson.data || [])
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load history"
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadHistory()
    return () => {
      isMounted = false
    }
  }, [])

  const paginatedTests = useMemo(() => {
    const start = (testPage - 1) * ITEMS_PER_PAGE
    return results.slice(start, start + ITEMS_PER_PAGE)
  }, [results, testPage])

  const totalTestPages = Math.ceil(results.length / ITEMS_PER_PAGE)

  const paginatedAchievements = useMemo(() => {
    const start = (achievementPage - 1) * ITEMS_PER_PAGE
    return achievements.slice(start, start + ITEMS_PER_PAGE)
  }, [achievements, achievementPage])

  const totalAchievementPages = Math.ceil(achievements.length / ITEMS_PER_PAGE)

  const paginatedXP = useMemo(() => {
    const start = (xpPage - 1) * ITEMS_PER_PAGE
    return xpHistory.slice(start, start + ITEMS_PER_PAGE)
  }, [xpHistory, xpPage])

  const totalXpPages = Math.ceil(xpHistory.length / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen mt-18 sm:mt-2 bg-background p-2 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-col md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl dark:text-slate-200">
            Activity History
          </h1>
          <p className="mt-2 text-sm  text-muted-foreground">
            Review your recent test performance, earned achievements, 
            and XP history.
          </p>
        </div>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList className="inline-flex w-max min-w-full md:grid md:grid-cols-3">
          <TabsTrigger
            value="tests"
            className="flex min-w-25 items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Tests
          </TabsTrigger>

          <TabsTrigger value="xp" className="flex min-w-25 items-center gap-2">
            <Star className="h-4 w-4" />
            XP
          </TabsTrigger>

          <TabsTrigger
            value="achievements"
            className="flex min-w-35 items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Test History */}
        <TabsContent value="tests" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
            </CardHeader>

            <CardContent className=" overflow-x">
              <Table>
                <TableHeader >
                  <TableRow >
                    <TableHead>Test</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:block">Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No test history found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTests.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-sm text-[10px]">{item.testName}</TableCell>
                        <TableCell className="font-sm text-[10px]">
                          {item.marksObtained}/{item.totalMarks}
                        </TableCell >
                        <TableCell className="font-sm text-[10px]">{item.accuracy}%</TableCell>
                        <TableCell className="font-sm ">
                          <Badge className="text-[10px]">{item.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:block">{formatDate(item.submittedAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <Pagination
              currentPage={testPage}
              totalPages={totalTestPages}
              onPageChange={setTestPage}
            />
          </Card>
        </TabsContent>

        {/* XP History */}
        <TabsContent value="xp" >
          <Card>
            <CardHeader>
              <CardTitle>XP History</CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedXP.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No XP history found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedXP.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>

                        <TableCell>
                          {item.xpPoints > 0
                            ? `+${item.xpPoints}`
                            : item.xpPoints}
                        </TableCell>

                        <TableCell>
                          {sourceLabels[item.sourceType] || item.sourceType}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <Pagination
              currentPage={xpPage}
              totalPages={totalXpPages}
              onPageChange={setXpPage}
            />
          </Card>
        </TabsContent>

        {/* Achievement History */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievement History</CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Achievement</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Unlocked</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedAchievements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No achievements found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAchievements.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.achievementId.name}</TableCell>

                        <TableCell>
                          +{item.achievementId.pointsReward}
                        </TableCell>

                        <TableCell>{formatDate(item.unlockedAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <Pagination
              currentPage={achievementPage}
              totalPages={totalAchievementPages}
              onPageChange={setAchievementPage}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages: number[] = []

    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)

    if (currentPage <= 3) {
      end = Math.min(5, totalPages)
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="mx-5 my-6 flex sm:flex-row justify-between">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </p>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPages().map((page) => (
          <Button
            key={page}
            size="icon"
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
