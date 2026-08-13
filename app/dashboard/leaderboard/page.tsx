"use client"
import { useEffect, useState } from "react"
import { Trophy, Search, Crown } from "lucide-react"

import { cn, formatNumber, getInitials } from "@/lib/utils"

type LeaderboardEntry = {
  rank: number
  totalXP: number
  avatarUrl?: string
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

const PODIUM_STYLES = [
  {
    place: 1,
    medal: "🥇",
    ring: "border-[rgba(245,166,35,0.5)]",
    bar: "border-[rgba(245,166,35,0.3)] text-[#f5a623]",
    xpColor: "text-[#f5a623]",
    avatarSize: "h-20 w-20 text-2xl",
    barSize: "h-32 w-24 text-3xl",
    lift: "-mt-6",
  },
  {
    place: 2,
    medal: "🥈",
    ring: "border-[rgba(139,150,168,0.45)]",
    bar: "border-[rgba(139,150,168,0.25)] text-[#8a96a8]",
    xpColor: "text-[#8a96a8]",
    avatarSize: "h-16 w-16 text-xl",
    barSize: "h-24 w-20 text-2xl",
    lift: "",
  },
  {
    place: 3,
    medal: "🥉",
    ring: "border-[rgba(217,119,6,0.45)]",
    bar: "border-[rgba(217,119,6,0.25)] text-[#d97706]",
    xpColor: "text-[#d97706]",
    avatarSize: "h-16 w-16 text-xl",
    barSize: "h-20 w-20 text-2xl",
    lift: "",
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

  // Always reserve 3 podium slots — missing ranks render as placeholders
  const podiumEntries = [filtered[0] ?? null, filtered[1] ?? null, filtered[2] ?? null]
  const myEntry = me
    ? entries.find((entry) => String(entry.userId?._id) === String(me.id))
    : null

  if (loading) {
    return (
      <div
        className="flex h-full items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-sm text-[#8a96a8]"
      >
        <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
        Loading leaderboard...
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:px-6 sm:pt-20 lg:p-8 lg:pt-4">
        {/* Header */}
        <div className="mb-9 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.1)] px-3.5 py-1.5 font-[JetBrains_Mono,monospace] text-[11px] font-semibold tracking-wide text-[#f5a623] uppercase">
            <Trophy className="h-3.5 w-3.5" /> Live Rankings
          </div>
          <h1 className="mb-2 font-[Space_Grotesk,sans-serif] text-2xl font-bold sm:text-3xl lg:text-4xl">
            Global Leaderboard
          </h1>
          <p className="text-[13.5px] text-[#8a96a8]">
            Compete with the top learners and climb the ranks.
          </p>
        </div>

        {/* Podium — top 3, always 3 slots */}
        <div className="mb-10 flex items-end justify-center gap-3 sm:gap-4">
          {[1, 0, 2].map((slotIndex) => {
            const entry = podiumEntries[slotIndex]
            const style = PODIUM_STYLES[slotIndex]
            const name = entry
              ? (entry.userId?.name || entry.userId?.email || "User").split(" ")[0]
              : "—"

            return (
              <div
                key={slotIndex}
                className={cn("flex flex-col items-center gap-3", style.lift)}
              >
                {slotIndex === 0 && (
                  <Crown className="h-7 w-7 text-[#f5a623]" />
                )}
                <div className="relative">
                  <div
                    className={cn(
                      "flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-[#141b25] font-[Space_Grotesk,sans-serif] font-bold text-[#e7ecf3]",
                      style.ring,
                      style.avatarSize,
                      !entry && "border-dashed text-[#5b6577]"
                    )}
                  >
                    {entry?.avatarUrl ? (
                      <img
                        src={entry.avatarUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : entry ? (
                      getInitials(name)
                    ) : (
                      "—"
                    )}
                  </div>
                  {entry && (
                    <span className="absolute -right-2 -bottom-2 text-xl">
                      {style.medal}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-[13.5px] font-semibold">{name}</div>
                  <div
                    className={cn(
                      "font-[JetBrains_Mono,monospace] text-[11px]",
                      entry ? style.xpColor : "text-[#5b6577]"
                    )}
                  >
                    {entry ? `${formatNumber(entry.totalXP)} XP` : "Unranked"}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-t-xl border bg-[#10151d] font-[Space_Grotesk,sans-serif] font-bold",
                    style.bar,
                    style.barSize
                  )}
                >
                  {style.place}
                </div>
              </div>
            )
          })}
        </div>

        {/* Search + my rank */}
        <div className="mb-5 flex flex-col items-center justify-between gap-3.5 sm:flex-row">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5b6577]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="h-10 w-full rounded-lg border border-[#212a37] bg-[#10151d] pr-4 pl-10 text-[13.5px] text-[#e7ecf3] outline-none transition placeholder:text-[#5b6577] focus:border-[#6ee7c9]"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.08)] px-4 py-2 font-[JetBrains_Mono,monospace] text-[13px]">
            <span className="text-[#8a96a8]">Your rank:</span>
            <span className="font-bold text-[#6ee7c9]">
              #{myEntry ? myEntry.rank : "-"}
            </span>
          </div>
        </div>

        {/* Full ranking list — always shows every entry, 1 or more */}
        <div className="overflow-hidden rounded-2xl border border-[#212a37] bg-[#10151d]">
          <div className="grid grid-cols-12 items-center border-b border-[#212a37] bg-[#141b25] px-4 py-3 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold tracking-wider text-[#5b6577] uppercase">
            <div className="col-span-2 text-center sm:col-span-1">Rank</div>
            <div className="col-span-6 sm:col-span-7 md:col-span-5">Student</div>
            <div className="col-span-4 text-right sm:col-span-2">XP</div>
            <div className="hidden text-right sm:col-span-2 sm:block">Accuracy</div>
            <div className="hidden text-right md:col-span-2 md:block">Tests</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-[13.5px] text-[#5b6577]">
              No rankings yet — be the first to complete a test.
            </div>
          ) : (
            <div className="divide-y divide-[#212a37]">
              {filtered.map((entry) => {
                const isMe = me && String(entry.userId?._id) === String(me.id)
                return (
                  <div
                    key={`${entry.rank}-${entry.userId?._id}`}
                    className={cn(
                      "grid grid-cols-12 items-center px-4 py-3 transition-colors",
                      isMe
                        ? "border-l-2 border-[#6ee7c9] bg-[rgba(110,231,201,0.06)]"
                        : "hover:bg-[#141b25]"
                    )}
                  >
                    <div className="col-span-2 flex justify-center sm:col-span-1">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full font-[JetBrains_Mono,monospace] text-[11px] font-bold",
                          entry.rank <= 3
                            ? "bg-[rgba(245,166,35,0.12)] text-[#f5a623]"
                            : "bg-[#141b25] text-[#8a96a8]"
                        )}
                      >
                        {entry.rank}
                      </div>
                    </div>

                    <div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-7 md:col-span-5">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full font-[JetBrains_Mono,monospace] text-[11px] font-bold",
                          isMe
                            ? "bg-[rgba(110,231,201,0.15)] text-[#6ee7c9]"
                            : "bg-[#141b25] text-[#e7ecf3]"
                        )}
                      >
                        {entry.avatarUrl ? (
                          <img
                            src={entry.avatarUrl}
                            alt={entry.userId?.name || entry.userId?.email || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(
                            entry.userId?.name || entry.userId?.email || "U"
                          )
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "truncate text-[13.5px] font-semibold",
                            isMe && "text-[#6ee7c9]"
                          )}
                        >
                          {isMe
                            ? `You (${(entry.userId?.name || me?.name || "You").split(" ")[0]})`
                            : entry.userId?.name || entry.userId?.email || "Unknown"}
                        </p>
                        <p className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
                          Lv.{entry.level}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-4 text-right sm:col-span-2">
                      <span className="font-[Space_Grotesk,sans-serif] text-[13.5px] font-bold text-[#6ee7c9]">
                        {formatNumber(entry.totalXP)}
                      </span>
                    </div>

                    <div className="hidden text-right sm:col-span-2 sm:block">
                      <span className="font-[JetBrains_Mono,monospace] text-[13px] font-semibold text-[#8b7cf6]">
                        {Math.round(entry.averageAccuracy)}%
                      </span>
                    </div>

                    <div className="hidden text-right font-[JetBrains_Mono,monospace] text-[12.5px] text-[#5b6577] md:col-span-2 md:block">
                      {entry.totalTestsTaken}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-5 text-center font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577]">
          Rankings update every 5 minutes ·{" "}
          <span className="text-[#6ee7c9]">
            Complete more tests to climb higher
          </span>
        </p>
      </div>
    </div>
  )
}