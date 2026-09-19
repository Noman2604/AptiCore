import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation & Platform Guide",
  description:
    "Learn how to navigate AptiCore, start mock tests, review detailed step-by-step solutions, and analyze your diagnostic performance.",
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
