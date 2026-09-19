import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center & FAQs",
  description:
    "Find answers to frequently asked questions about account settings, test submissions, scoring, and proctoring on AptiCore.",
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
