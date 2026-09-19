import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weekly Aptitude Contests & Live Battles",
  description:
    "Participate in timed weekly aptitude contests, benchmark your speed against thousands of placement aspirants, and earn badges.",
}

export default function ContestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
