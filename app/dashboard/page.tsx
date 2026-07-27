"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import {
  Flame,
  Play,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Zap,
  BookOpen,
  Award,
  ArrowRight,
  BarChart3,
  Users,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IResultDocument } from "@/lib/models/Result"
type LeaderboardEntry = {
  rank: number
  totalXP: number
  totalTestsTaken: number
  averageAccuracy: number
  level: number
  userId: {
    _id: string
    name?: string
    email?: string
  }
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning")
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [recentResults, setRecentResults] = useState<IResultDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const hour = new Date().getHours()
        if (hour >= 12 && hour < 17) {
          setGreeting("Good afternoon")
        } else if (hour >= 17) {
          setGreeting("Good evening")
        } else {
          setGreeting("Good morning")
        }

        const [
          { data: userData },
          { data: profileData },
          { data: achievementsData },
          { data: resultsData },
          { data: leaderboardData },
        ] = await Promise.all([
          axios.get("/api/auth/me"),
          axios.get("/api/profile"),
          axios.get("/api/achievements/user"),
          axios.get("/api/results?limit=5"),
          axios.get("/api/leaderboard"),
        ])
        setUserData(userData.data)
        setProfile(profileData.data)
        setAchievements(achievementsData.data || [])
        setRecentResults(resultsData.data || [])
        setEntries(leaderboardData.data || [])

      } catch (error) {
        console.error("Error loading dashboard data:", error)
        
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const myEntry = userData
    ? entries.find((entry) => String(entry.userId?._id) === String(userData.id))
    : null
  const testsCompleted = recentResults?.length || 0
  const accuracy = recentResults.reduce((sum, result) => sum + (result.accuracy || 0), 0) / Math.max(recentResults.length, 1)
  const totalXP = profile?.totalXP || 0
  const level = profile?.level || 1
  const streak = profile?.currentStreak || 0
  const questionsAttempted = profile?.questionsAttempted || 0
  const correctAnswers = profile?.correctAnswers || 0
  const xpPerLevel = 500
  const progress = ((totalXP % xpPerLevel) / xpPerLevel) * 100
  const nextLevelXP = xpPerLevel - (totalXP % xpPerLevel)

  if (!mounted || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold">
            Loading your dashboard...
          </div>
          <div className="text-sm text-muted-foreground">
            Please wait while we fetch your data
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-20 space-y-4 px-2 py-4 sm:mt-2">
      <div className="flex flex-row justify-between gap-1 sm:items-center">
        <div>
          <p className="mb-1 text-[hsl(var(--muted-foreground))]">
            {greeting},
          </p>
          <h1 className="font-display text-4xl font-bold lg:text-3xl">
            {userData?.name?.split(" ")[0] || "User"} 👋
          </h1>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex items-center gap-1 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3.5 py-2 text-sm font-normal text-orange-400">
            <Flame className="h-4 w-4" />
            <span>{streak} day streak</span>
          </div>
          <Link href="/dashboard/tests">
            <Button className="gap-2 bg-linear-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20 hover:opacity-90">
              <Play className="h-4 w-4 fill-current" />
              Start Test
            </Button>
          </Link>
        </div>
      </div>

      {/* ── XP / Level Progress Banner ─────────────────────────── */}
      <div className="rounded-2xl border border-sky-500/20 bg-linear-to-r from-sky-900/60 via-blue-900/60 to-purple-900/60 p-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="font-display flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-sky-500/30">
              {level}
            </div>

            <div>
              <div className="font-display text-lg font-bold text-white">
                Level {level}
              </div>
              <div className="text-sm text-white/60">
                {formatNumber(totalXP)} XP · {nextLevelXP} XP to next level
              </div>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <div className="mb-2 flex justify-between text-xs text-white/50">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-xl bg-white/10">
              <div
                className="h-full rounded-xl bg-linear-to-r from-sky-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-sky-500/20 bg-linear-to-br from-sky-500/10 to-blue-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tests Completed
              </p>
              <p className="text-3xl font-bold text-sky-400">
                {testsCompleted}
              </p>
            </div>
            <div className="rounded-lg bg-sky-500/20 p-3">
              <BookOpen className="h-6 w-6 text-sky-400" />
            </div>
          </div>
        </Card>

        <Card className="border-purple-500/20 bg-linear-to-br from-purple-500/10 to-pink-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Accuracy
              </p>
              <p className="text-3xl font-bold text-purple-400">{accuracy}%</p>
            </div>
            <div className="rounded-lg bg-purple-500/20 p-3">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="border-green-500/20 bg-linear-to-br from-green-500/10 to-emerald-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Global Rank
              </p>
              <p className="text-3xl font-bold text-green-400"> #{myEntry ? myEntry.rank : "-"}</p>
            </div>
            <div className="rounded-lg bg-green-500/20 p-3">
              <Trophy className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="border-orange-500/20 bg-linear-to-br from-orange-500/10 to-red-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total XP
              </p>
              <p className="text-3xl font-bold text-orange-400">
                {formatNumber(totalXP)}
              </p>
            </div>
            <div className="rounded-lg bg-orange-500/20 p-3">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Secondary Stats & Quick Links ──────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-500/20 bg-linear-to-br from-blue-500/10 to-cyan-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Questions Attempted
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-400">
                {questionsAttempted}
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-blue-400/60" />
          </div>
        </Card>

        <Card className="border-rose-500/20 bg-linear-to-br from-rose-500/10 to-red-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Correct Answers
              </p>
              <p className="mt-1 text-2xl font-bold text-rose-400">
                {correctAnswers}
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-rose-400/60" />
          </div>
        </Card>

        <Card className="border-indigo-500/20 bg-linear-to-br from-indigo-500/10 to-violet-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Streak
              </p>
              <p className="mt-1 text-2xl font-bold text-indigo-400">
                {streak} days
              </p>
            </div>
            <Clock className="h-5 w-5 text-indigo-400/60" />
          </div>
        </Card>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Results */}
        <div className="lg:col-span-2">
          <Card className="border-slate-500/20 p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-bold">Recent Results</h2>
              </div>
              <Link href="/dashboard/analytics">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sky-400 hover:text-sky-300"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentResults.length > 0 ? (
                recentResults.map((result, _id) => (
                  <div
                  key={_id}
                    className="flex items-center justify-between rounded-lg border border-slate-500/20 bg-slate-500/5 p-4 transition-all hover:bg-slate-500/10"
                  >
                    <div className="flex-1">
                      <p className="font-sm text-xs">{result.testName}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.marksObtained || 0}/{result.totalMarks || 100} marks
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-sky-400">
                        {result.accuracy || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-slate-500/20 bg-slate-500/5 p-8 text-center">
                  <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No results yet
                  </p>
                  <Link href="/dashboard/tests">
                    <Button size="sm" className="mt-3 gap-2" variant="outline">
                      <Play className="h-3 w-3" /> Start Your First Test
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <Card className="border-slate-500/20 p-4">
            <div className="mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <h2 className="text-lg font-bold">Recent Achievements</h2>
            </div>

            <div className="space-y-3">
              {achievements.length > 0 ? (
                achievements.slice(0, 4).map((achievement, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 transition-all hover:bg-yellow-500/10"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-yellow-300/20 text-sm">
                      <Award className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold">{achievement.achievementId.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {achievement.achievementId.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-400">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
                  <Award className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Complete tests to unlock achievements
                  </p>
                </div>
              )}

              {achievements.length > 4 && (
                <Link href="/dashboard/achievements">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Achievements
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>


      {/* ── Quick Action Buttons ──────────────────────────────── */}
      <div className="grid gap-3 md:grid-cols-4">
        <Link href="/dashboard/tests">
          <Button className="w-full gap-2 bg-sky-500/20 text-sky-400 hover:bg-sky-500/30">
            <Play className="h-4 w-4" />
            Take a Test
          </Button>
        </Link>
        <Link href="/dashboard/analytics">
          <Button className="w-full gap-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button className="w-full gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
            <Users className="h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button className="w-full gap-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
            <Zap className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
