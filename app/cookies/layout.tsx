import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy & Preferences",
  description:
    "Understand how AptiCore uses cookies and similar technologies to improve your experience and manage your preferences.",
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
