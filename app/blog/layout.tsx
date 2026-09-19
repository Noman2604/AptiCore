import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog & Placement Preparation Articles",
  description:
    "Expert tips, shortcuts, syllabus breakdowns, and career advice for cracking campus recruitment drives.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
