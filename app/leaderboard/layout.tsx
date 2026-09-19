import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Global Leaderboard — Top Aptitude Performers",
  description:
    "See who is leading the national placement prep ranks. Check top scores, XP streaks, and highest accuracy across colleges.",
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
