import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Careers at AptiCore — Join Our Team",
  description:
    "Join our mission to revolutionize placement education. Explore engineering, content, and design roles at AptiCore.",
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
