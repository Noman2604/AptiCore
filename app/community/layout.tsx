import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student & Aspirant Community",
  description:
    "Join the AptiCore student community. Discuss test questions, share interview experiences, and prepare with peers across India.",
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
