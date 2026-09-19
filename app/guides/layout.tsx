import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Placement Preparation Guides",
  description:
    "Curated study roadmaps, company-specific syllabus breakdowns, and time-management strategies for IT and core placements.",
}

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
