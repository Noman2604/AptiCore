import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: {
    default: "AptiCore — Master Your Placement Prep",
    template: "%s | AptiCore",
  },
  description:
    "India's most advanced aptitude test platform for placement preparation. Practice quantitative aptitude, logical reasoning, coding MCQs and more.",
  keywords: [
    "aptitude test",
    "placement preparation",
    "TCS",
    "Infosys",
    "Wipro",
    "coding MCQ",
    "logical reasoning",
  ],
  authors: [{ name: "AptiCore" }],
  openGraph: {
    title: "AptiCore — Master Your Placement Prep",
    description: "India's most advanced aptitude test platform",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
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
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div id="root">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
