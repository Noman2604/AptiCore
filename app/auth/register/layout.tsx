import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Free Account",
  description:
    "Join over 128,000 students preparing for campus placements. Practice with 24,600+ questions and full mock tests for free.",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
