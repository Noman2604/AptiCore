import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In to Your Account",
  description:
    "Log in to AptiCore to resume your mock test practice, review diagnostic analytics, and check contest leaderboards.",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
