import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the terms of service, platform rules, academic integrity policies, and usage conditions for AptiCore.",
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
