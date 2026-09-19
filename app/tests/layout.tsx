import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Practice Tests & Company Mock Exams",
  description:
    "Full-length placement mock tests tailored for TCS, Infosys, Wipro, Accenture, Cognizant, Google, Amazon, and more.",
}

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
