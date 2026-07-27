"use client"
import { useEffect, useState } from "react"
import { Trophy, Flame, Search, Crown } from "lucide-react"

import { cn, formatNumber, getInitials } from "@/lib/utils"

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

type UserInfo = {
  id: string
  name: string
}

const tabs = [
  { label: "Global Rank", value: "global" },
  { label: "This Week", value: "weekly" },
  { label: "This Month", value: "monthly" },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("global")
  const [search, setSearch] = useState("")
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [me, setMe] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)

        const [leaderboardRes, meRes] = await Promise.all([
          fetch("/api/leaderboard"),
          fetch("/api/auth/me"),
        ])

        if (leaderboardRes.ok) {
          const json = await leaderboardRes.json()
          if (json.success && Array.isArray(json.data)) {
            setEntries(json.data)
          }
        }

        if (meRes.ok) {
          const json = await meRes.json()
          if (json.success && json.data) {
            setMe({ id: json.data.id, name: json.data.name })
          }
        }
      } catch (error) {
        console.error("Failed to load leaderboard", error)
      } finally {
        setLoading(false)
      }
    }

    void loadLeaderboard()
  }, [])

  const filtered = entries.filter((entry) => {
    const name = entry.userId?.name || entry.userId?.email || "Unknown"
    return !search || name.toLowerCase().includes(search.toLowerCase())
  })

  const podium = filtered.slice(0, 3)
  const rest = filtered.slice(3)
  const myEntry = me
    ? entries.find((entry) => String(entry.userId?._id) === String(me.id))
    : null

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
        Loading leaderboard...
      </div>
    )
  }

  return (
    <div>
      <div className="mx-auto mt-15 sm:mt-2 max-w-5xl p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-400">
            <Trophy className="h-3.5 w-3.5" /> Live Rankings
          </div>
          <h1 className="font-display mb-2 text-3xl font-bold lg:text-4xl">
            Global Leaderboard
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Compete with the top learners and climb the ranks.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={cn(
                "rounded-xl border px-5 py-2 text-sm font-medium transition-all",
                activeTab === t.value
                  ? "border-sky-500/30 bg-sky-500/15 text-sky-400"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-sky-500/20"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Podium — top 3 */}
        <div className="mb-10 flex items-end justify-center gap-4">
          {podium[1] && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-400/40 bg-[hsl(var(--surface))] text-xl font-bold text-white">
                  {getInitials(
                    podium[1].userId?.name || podium[1].userId?.email || "U"
                  )}
                </div>
                <span className="absolute -right-2 -bottom-2 text-xl">🥈</span>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">
                  {(podium[1].userId?.name || "User").split(" ")[0]}
                </div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                  {formatNumber(podium[1].totalXP)} XP
                </div>
              </div>
              <div className="font-display flex h-24 w-20 items-center justify-center rounded-t-xl border border-slate-400/20 bg-[hsl(var(--surface))] text-2xl font-bold text-slate-400">
                2
              </div>
            </div>
          )}

          {podium[0] && (
            <div className="-mt-6 flex flex-col items-center gap-3">
              <Crown className="animate-bounce-soft h-7 w-7 text-amber-400" />
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-amber-400/50 bg-[hsl(var(--surface))] text-2xl font-bold text-white shadow-lg shadow-amber-500/20">
                  {getInitials(podium[0].userId?.name || "U")}
                </div>
                <span className="absolute -right-2 -bottom-2 text-2xl">🥇</span>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold">
                  {(podium[0].userId?.name || "User").split(" ")[0]}
                </div>
                <div className="text-xs text-amber-400">
                  {formatNumber(podium[0].totalXP)} XP
                </div>
              </div>
              <div className="font-display flex h-32 w-24 items-center justify-center rounded-t-xl border border-amber-500/20 bg-[hsl(var(--surface))] text-3xl font-bold text-amber-400">
                1
              </div>
            </div>
          )}

          {podium[2] && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-orange-600/40 bg-[hsl(var(--surface))] text-xl font-bold text-white">
                  {getInitials(podium[2].userId?.name || "U")}
                </div>
                <span className="absolute -right-2 -bottom-2 text-xl">🥉</span>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">
                  {(podium[2].userId?.name || "User").split(" ")[0]}
                </div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                  {formatNumber(podium[2].totalXP)} XP
                </div>
              </div>
              <div className="font-display flex h-20 w-20 items-center justify-center rounded-t-xl border border-orange-600/20 bg-[hsl(var(--surface))] text-2xl font-bold text-orange-500">
                3
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="h-10 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-4 pl-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">
              Your rank:
            </span>
            <span className="font-display font-bold text-sky-400">
              #{myEntry ? myEntry.rank : "-"}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          {/* Header */}
          <div className="grid grid-cols-12 items-center border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-hover))] px-4 py-3 text-xs font-semibold tracking-wider text-[hsl(var(--muted-foreground))] uppercase">
            <div className="col-span-2 text-center sm:col-span-1">Rank</div>

            <div className="col-span-6 sm:col-span-7 md:col-span-5">
              Student
            </div>

            <div className="col-span-4 text-right sm:col-span-2">XP</div>

            <div className="hidden text-right sm:col-span-2 sm:block">
              Accuracy
            </div>

            <div className="hidden text-right md:col-span-2 md:block">
              Tests
            </div>
          </div>

          {/* Leaderboard */}
          <div className="divide-y divide-[hsl(var(--border))]">
            {rest.map((entry) => (
              <div
                key={`${entry.rank}-${entry.userId?._id}`}
                className="grid grid-cols-12 items-center px-4 py-3 transition-colors hover:bg-[hsl(var(--surface-hover))]"
              >
                {/* Rank */}
                <div className="col-span-2 flex justify-center sm:col-span-1">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      entry.rank <= 3
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    {entry.rank}
                  </div>
                </div>

                {/* Student */}
                <div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-7 md:col-span-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--surface))] text-xs font-bold text-white">
                    {getInitials(
                      entry.userId?.name || entry.userId?.email || "U"
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {entry.userId?.name || entry.userId?.email || "Unknown"}
                    </p>

                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Lv.{entry.level}
                    </p>
                  </div>
                </div>

                {/* XP */}
                <div className="col-span-4 text-right sm:col-span-2">
                  <span className="font-display text-sm font-bold text-sky-400">
                    {formatNumber(entry.totalXP)}
                  </span>
                </div>

                {/* Accuracy */}
                <div className="hidden text-right sm:col-span-2 sm:block">
                  <span className="text-sm font-semibold text-sky-400">
                    {Math.round(entry.averageAccuracy)}%
                  </span>
                </div>

                {/* Tests */}
                <div className="hidden text-right text-sm text-[hsl(var(--muted-foreground))] md:col-span-2 md:block">
                  {entry.totalTestsTaken}
                </div>
              </div>
            ))}
          </div>

          {/* Current User */}
          <div className="grid grid-cols-12 items-center border-t-2 border-sky-500/30 bg-sky-500/10 px-4 py-3">
            {/* Rank */}
            <div className="col-span-2 flex justify-center sm:col-span-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">
                {myEntry ? myEntry.rank : "-"}
              </div>
            </div>

            {/* Student */}
            <div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-7 md:col-span-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--surface))] text-xs font-bold text-sky-400">
                {getInitials(myEntry?.userId?.name || me?.name || "Y")}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-sky-400">
                  {myEntry
                    ? `You (${(myEntry.userId?.name || me?.name || "You").split(" ")[0]})`
                    : "Your Rank"}
                </p>

                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {myEntry ? `Lv.${myEntry.level}` : "Not ranked yet"}
                </p>
              </div>
            </div>

            {/* XP */}
            <div className="col-span-4 text-right sm:col-span-2">
              <span className="font-display text-sm font-bold text-sky-400">
                {myEntry ? formatNumber(myEntry.totalXP) : "-"}
              </span>
            </div>

            {/* Accuracy */}
            <div className="hidden text-right sm:col-span-2 sm:block">
              <span className="text-sm font-semibold text-sky-400">
                {myEntry ? `${Math.round(myEntry.averageAccuracy)}%` : "-"}
              </span>
            </div>

            {/* Tests */}
            <div className="hidden text-right text-sm text-[hsl(var(--muted-foreground))] md:col-span-2 md:block">
              {myEntry ? myEntry.totalTestsTaken : "-"}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[hsl(var(--muted-foreground))]">
          Rankings update every 5 minutes ·{" "}
          <span className="text-sky-400">
            Complete more tests to climb higher
          </span>
        </p>
      </div>
    </div>
  )
}
