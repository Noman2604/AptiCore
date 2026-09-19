import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aptitude Categories — Quantitative, Logical & Coding",
  description:
    "Explore comprehensive aptitude test categories: Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Core Technical MCQs.",
}

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
