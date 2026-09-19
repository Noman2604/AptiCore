import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about how AptiCore collects, protects, and handles your personal information, test scores, and learning progress.",
}

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
