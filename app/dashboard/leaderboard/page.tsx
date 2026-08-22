"use client"
import { useEffect, useState } from "react"
import { Trophy, Search, Crown, Flame, ChevronRight, RefreshCw } from "lucide-react"

import { cn, formatNumber, getInitials } from "@/lib/utils"

type LeaderboardEntry = {
  rank: number
  totalXP: number
  avatarUrl?: string
  totalTestsTaken: number
  averageAccuracy: number
  level: number
  streak?: number
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

const PODIUM_STYLES = [
  {
    place: 1,
    ring: "border-amber-300 dark:border-amber-400/40",
    card: "border-amber-500 bg-amber-200 dark:border-amber-400/20 dark:bg-amber-400/20",
    badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/25",
    xp: "text-amber-600 dark:text-amber-400",
    avatarBg: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    avatarSize: "h-14 w-14 text-base",
    lift: "md:-mt-4",
    crown: true,
    shadow:"shadow-lg shadow-amber-300 shadow-amber-400 "
  },
  {
    place: 2,
    ring: "border-slate-200 dark:border-white/15",
    card: "border-slate-500 bg-slate-200 dark:border-white/10 dark:bg-white/20",
    badge: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:border-white/10",
    xp: "text-slate-800 dark:text-slate-400",
    avatarBg: "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-300",
    avatarSize: "h-12 w-12 text-sm",
    lift: "",
    crown: false,
    shadow:"shadow-lg shadow-slate-300  dark:shadow-slate-500"
  },
  {
    place: 3,
    ring: "border-orange-200 dark:border-orange-400/30 ",
    card: "border-orange-500 bg-orange-200 dark:border-orange-400/15 dark:bg-orange-400/20",
    badge: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-400/10 dark:text-orange-300 dark:border-orange-400/20",
    xp: "text-orange-600 dark:text-orange-400",
    avatarBg: "bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300",
    avatarSize: "h-12 w-12 text-sm",
    lift: "",
    crown: false,
    shadow:"shadow-lg shadow-orange-300 dark:shadow-orange-300 "
  },
]

export default function LeaderboardPage() {
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

  const podiumEntries = [filtered[0] ?? null, filtered[1] ?? null, filtered[2] ?? null]
  const restEntries = filtered.slice(3)
  const myEntry = me
    ? entries.find((entry) => String(entry.userId?._id) === String(me.id))
    : null

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f8f9fb] font-[Inter,sans-serif] text-sm text-slate-400 dark:bg-[#0a0e14] dark:text-slate-500">
        <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400 dark:bg-teal-400" />
        Loading leaderboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-[Inter,sans-serif] text-slate-900 transition-colors duration-300 dark:bg-[#16191f] dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 font-[JetBrains_Mono,monospace] text-[11px] font-semibold uppercase tracking-wide text-purple-500 dark:text-purple-400">
              <Trophy className="h-3 w-3" /> Global Rankings
            </div>
            <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Leaderboard
            </h1>
            <p className="mt-1 text-[13.5px] text-slate-500 dark:text-slate-400">
              See how you rank against the AptiCore community and climb higher.
            </p>
          </div>
        </div>

        {/* Top performers */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Top performers</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">The top three learners this period</p>
            </div>
          </div>

          <div className="flex items-end justify-center gap-3 sm:gap-4">
            {[1, 0, 2].map((slotIndex) => {
              const entry = podiumEntries[slotIndex]
              const style = PODIUM_STYLES[slotIndex]
              const name = entry
                ? (entry.userId?.name || entry.userId?.email || "User").split(" ")[0]
                : "—"

              return (
                <div
                  key={slotIndex}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:-translate-y-0.5",
                    style.card,
                    style.lift,
                    style.shadow,
                    !entry && "border-dashed"
                  )}
                >
                  {style.crown && entry && (
                    <Crown className="h-5 w-5 text-amber-500 dark:text-amber-400"    />
                  )}
                  <div
                    className={cn(
                      "flex items-center justify-center overflow-hidden rounded-full border-2 font-[Space_Grotesk,sans-serif] font-bold",
                      style.ring,
                      style.avatarBg,
                      style.avatarSize,
                      !entry && "border-dashed text-slate-300 dark:text-slate-600"
                    )}
                  >
                    {entry?.avatarUrl ? (
                      <img src={entry.avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : entry ? (
                      getInitials(name)
                    ) : (
                      "—"
                    )}
                  </div>
                  <div>
                    <p className="truncate text-[13.5px] font-semibold text-slate-800 dark:text-slate-100">
                      {entry ? entry.userId?.name || entry.userId?.email || "User" : "—"}
                    </p>
                    <p
                      className={cn(
                        "font-[JetBrains_Mono,monospace] text-[12px] font-semibold",
                        entry ? style.xp : "text-slate-300 dark:text-slate-600"
                      )}
                    >
                      {entry ? `${formatNumber(entry.totalXP)} XP` : "Unranked"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold",
                      style.badge
                    )}
                  >
                    {entry ? `#${style.place} · Level ${entry.level}` : "—"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-xs">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search learner..."
              className="h-10 w-full rounded-sm shadow shadow-slate-300 dark:shadow-slate-500 border border-slate-200 bg-white pr-4 pl-10 text-[13.5px] text-slate-700 outline-none transition placeholder:text-slate-400  focus:ring-2 focus:ring-slate-400 dark:border-white/10 dark:bg-white/3 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-teal-400/40 dark:focus:ring-teal-400/10"
            />
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Ranked list */}
        <div className="mb-4 overflow-hidden rounded-t-lg shadow shadow-slate-300 dark:shadow-slate-500 border border-slate-400 bg-slate-100 dark:border-white/10 dark:bg-white/2">
          <div className="border-b border-slate-500 dark:border-slate-400 px-5 pt-4 pb-3 bg-amber-200 dark:bg-slate-800">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-50">Ranked learners</h2>
            <p className="text-xs text-slate-800 dark:text-slate-200">Showing the strongest performers</p>
          </div>

          <div className="hidden grid-cols-12 gap-2 border-b border-slate-500 dark:border-slate-400 px-5 py-2.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold tracking-wide text-slate-400 uppercase sm:grid dark:text-slate-600">
            <div className="col-span-1 text-slate-800 dark:text-slate-50 text-center">Rank</div>
            <div className="col-span-4 text-slate-800 dark:text-slate-50">Learner</div>
            <div className="col-span-2 text-slate-800 dark:text-slate-50">Level</div>
            <div className="col-span-2 text-right text-slate-800 dark:text-slate-50">XP score</div>
            <div className="col-span-1 text-right text-slate-800 dark:text-slate-50">Streak</div>
            <div className="col-span-2 text-right text-slate-800 dark:text-slate-50">Accuracy</div>
          </div>

          {restEntries.length === 0 ? (
            <div className="p-10 text-center text-[13.5px] text-slate-400 dark:text-slate-500">
              No rankings yet — be the first to complete a test.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/6">
              {restEntries.map((entry) => {
                const isMe = me && String(entry.userId?._id) === String(me.id)
                const name = entry.userId?.name || entry.userId?.email || "Unknown"
                return (
                  <div
                    key={`${entry.rank}-${entry.userId?._id}`}
                    className={cn(
                      "flex flex-col gap-2.5 px-4 py-3 transition-colors sm:grid sm:grid-cols-12 sm:items-center sm:gap-2 sm:px-5 sm:py-3.5",
                      isMe
                        ? "bg-teal-50 dark:bg-teal-400/[0.07]"
                        : "hover:bg-slate-50 dark:hover:bg-white/3"
                    )}
                  >
                    {/* Row 1 (mobile): rank + avatar + name + XP. Becomes the grid row on sm+ */}
                    <div className="flex items-center gap-3 sm:contents">
                      <div className="w-6 shrink-0 text-center font-[JetBrains_Mono,monospace] text-[12px] font-semibold text-slate-400 sm:col-span-1 sm:w-auto sm:text-[12.5px] dark:text-slate-500">
                        #{entry.rank}
                      </div>

                      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:col-span-4 sm:gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold text-slate-500 sm:h-9 sm:w-9 sm:text-[11px] dark:bg-white/6 dark:text-slate-300">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            getInitials(name)
                          )}
                        </div>
                        <p className="truncate text-[13px] font-medium text-slate-800 sm:text-[13.5px] dark:text-slate-100">
                          {isMe ? `${name.split(" ")[0]} (You)` : name}
                        </p>
                      </div>

                      <div className="hidden text-[13px] text-slate-500 sm:col-span-2 sm:block dark:text-slate-400">
                        Level {entry.level}
                      </div>

                      <div className="shrink-0 text-right font-[JetBrains_Mono,monospace] text-[13px] font-bold text-teal-600 sm:col-span-2 sm:text-[13.5px] dark:text-teal-400">
                        {formatNumber(entry.totalXP)} XP
                      </div>

                      <div className="hidden items-center justify-end gap-1 font-[JetBrains_Mono,monospace] text-[12.5px] text-amber-600 sm:col-span-1 sm:flex dark:text-amber-400">
                        {typeof entry.streak === "number" ? (
                          <>
                            <Flame className="h-3 w-3 fill-amber-300 text-amber-500 dark:fill-amber-400/30 dark:text-amber-400" />
                            {entry.streak}d
                          </>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">—</span>
                        )}
                      </div>

                      <div className="hidden text-right font-[JetBrains_Mono,monospace] text-[13px] font-semibold text-slate-600 sm:col-span-2 sm:block dark:text-slate-300">
                        {Math.round(entry.averageAccuracy)}%
                      </div>
                    </div>

                    {/* Row 2 (mobile only): level, streak, accuracy as compact chips — hidden on sm+ since the grid above already shows them */}
                    <div className="flex items-center gap-1.5 pl-9 sm:hidden">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        Lvl {entry.level}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-medium text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                        <Flame className="h-2.5 w-2.5 fill-amber-300 text-amber-500 dark:fill-amber-400/30 dark:text-amber-400" />
                        {typeof entry.streak === "number" ? `${entry.streak}d` : "—"}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        {Math.round(entry.averageAccuracy)}% acc
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* My rank card */}
        {myEntry && (
          <div className="flex flex-col gap-3 rounded-sm shadow shadow-slate-300 dark:shadow-slate-500 border border-slate-600 bg-teal-200 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3 sm:px-5 dark:border-teal-400/20 dark:bg-teal-600/30">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 font-[JetBrains_Mono,monospace] text-[11px] font-bold text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                {getInitials(myEntry.userId?.name || me?.name || "You")}
              </div>
              <div className="min-w-0 flex-1 sm:flex-none">
                <p className="truncate text-[13.5px] font-semibold text-teal-800 dark:text-teal-300">
                  You · {myEntry.userId?.name || me?.name || "You"}
                </p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-600sm:hidden dark:text-teal-500" />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-teal-200/60 pt-3 sm:ml-auto sm:border-t-0 sm:pt-0 sm:gap-6 dark:border-teal-400/15">
              <div className="text-left sm:text-right">
                <p className="font-[JetBrains_Mono,monospace] text-[10px] text-teal-500 sm:text-[11px] dark:text-teal-500/80">
                  Rank
                </p>
                <p className="font-[Space_Grotesk,sans-serif] text-[13px] font-bold text-teal-800 sm:text-sm dark:text-teal-300">
                  #{myEntry.rank}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-[JetBrains_Mono,monospace] text-[10px] text-teal-500 sm:text-[11px] dark:text-teal-500/80">
                  Total XP
                </p>
                <p className="font-[Space_Grotesk,sans-serif] text-[13px] font-bold text-teal-800 sm:text-sm dark:text-teal-300">
                  {formatNumber(myEntry.totalXP)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-[JetBrains_Mono,monospace] text-[10px] text-teal-500 sm:text-[11px] dark:text-teal-500/80">
                  Accuracy
                </p>
                <p className="font-[Space_Grotesk,sans-serif] text-[13px] font-bold text-teal-800 sm:text-sm dark:text-teal-300">
                  {Math.round(myEntry.averageAccuracy)}%
                </p>
              </div>
              <ChevronRight className="hidden h-4 w-4 shrink-0 text-teal-400 sm:block dark:text-teal-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}