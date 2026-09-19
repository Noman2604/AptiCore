import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Have questions or need assistance with your placement preparation? Reach out to our campus support team at AptiCore.",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
