import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us — Our Mission & Story",
  description:
    "Learn about AptiCore, our mission to democratize campus placement preparation across India, and the team behind the platform.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
