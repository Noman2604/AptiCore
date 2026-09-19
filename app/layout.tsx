import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import NetworkStatus from "@/components/NetworkStatus"
import CelebrationProvider from "@/components/ui/celebration-provider"
import { Toaster } from "@/components/ui/sonner"
import CookieBanner from "@/components/CookieBanner"
import Analytics from "@/components/Analytics"

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.APP_URL ? process.env.APP_URL : "https://apticore.in")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AptiCore — Master Your Placement Prep",
    template: "%s | AptiCore",
  },
  description:
    "India's most advanced aptitude test platform for placement preparation. Practice quantitative aptitude, logical reasoning, coding MCQs and company mocks with 24,600+ questions.",
  keywords: [
    "aptitude test",
    "placement preparation",
    "coding MCQ",
    "logical reasoning",
    "quantitative aptitude",
    "campus recruitment",
    "TCS NQT mock test",
    "Infosys mock test",
    "mock tests India",
  ],
  authors: [{ name: "AptiCore", url: siteUrl }],
  creator: "AptiCore",
  publisher: "AptiCore Technologies",
  openGraph: {
    title: "AptiCore — Master Your Placement Prep",
    description:
      "Master quantitative aptitude, logical reasoning, coding MCQs and company mocks with 24,600+ questions, real-time leaderboards, and AI analytics.",
    url: siteUrl,
    siteName: "AptiCore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AptiCore — Placement Preparation Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AptiCore — Master Your Placement Prep",
    description:
      "India's most advanced aptitude test platform. Practice with 24,600+ questions and AI analytics.",
    images: ["/og-image.png"],
    creator: "@apticore",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  themeColor: "#0a0e14",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-[--ac-bg] text-[--ac-text] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NetworkStatus>
            <CelebrationProvider>
              <div id="root">{children}</div>
              <Toaster richColors position="top-right" />
              <CookieBanner />
              <Analytics />
            </CelebrationProvider>
          </NetworkStatus>
        </ThemeProvider>
      </body>
    </html>
  )
}