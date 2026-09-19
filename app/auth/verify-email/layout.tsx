import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Your Email",
  description:
    "Verify your email address to activate your AptiCore account and start preparing for campus recruitment.",
}

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
