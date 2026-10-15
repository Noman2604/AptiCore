import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NetworkStatus from "@/components/NetworkStatus"
import CelebrationProvider from "@/components/ui/celebration-provider"
import { Toaster } from "@/components/ui/sonner"
import Analytics from "@/components/Analytics"
import QueryProvider from "@/components/providers/QueryProvider"
import { env } from "@/lib/env"
import CookieBanner from "@/components/CookieBanner"

const siteUrl = env.NEXT_PUBLIC_BASE_URL

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e14" },
  ],
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
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen max-w-full bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <NetworkStatus>
              <CelebrationProvider>
                <div id="root" className="max-w-full overflow-x-hidden">{children}</div>
                <Toaster richColors position="top-right" />
                <CookieBanner />
                <Analytics />
              </CelebrationProvider>
            </NetworkStatus>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}