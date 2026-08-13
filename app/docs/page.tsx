"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  BookOpen,
  Search,
  Code,
  Terminal,
  Database,
  Shield,
  Settings,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarSections = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", icon: BookOpen },
      { label: "Quick Start", icon: Terminal },
      { label: "Account Setup", icon: Settings },
    ],
  },
  {
    title: "Core Features",
    items: [
      { label: "Practice Tests", icon: BookOpen },
      { label: "Categories", icon: Database },
      { label: "Leaderboard", icon: Shield },
      { label: "Analytics", icon: Code },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "Authentication", icon: Shield },
      { label: "Endpoints", icon: Code },
      { label: "Rate Limits", icon: Settings },
    ],
  },
]

const docContent = {
  Introduction: {
    title: "Introduction to AptiCore",
    content: [
      {
        type: "paragraph",
        text: "AptiCore is India's most advanced aptitude test platform designed for placement preparation. It provides a comprehensive suite of practice tests, performance analytics, and learning tools to help engineering students ace their placement exams.",
      },
      {
        type: "heading",
        text: "What is AptiCore?",
      },
      {
        type: "paragraph",
        text: "AptiCore offers a structured approach to aptitude preparation with thousands of curated questions across quantitative aptitude, logical reasoning, verbal ability, and coding MCQs. Our platform uses AI-powered analytics to identify your weak areas and track your progress over time.",
      },
      {
        type: "heading",
        text: "Key Features",
      },
      {
        type: "list",
        items: [
          "5000+ practice questions across 20+ categories",
          "AI-powered performance analytics and insights",
          "Real-time leaderboard and peer comparison",
          "Custom test creation and timed practice sessions",
          "Detailed solutions and step-by-step explanations",
          "Progress tracking with visual charts and reports",
        ],
      },
      {
        type: "heading",
        text: "Who Is It For?",
      },
      {
        type: "paragraph",
        text: "AptiCore is built for engineering students and graduates preparing for campus placements, off-campus recruitment drives, and competitive exams. Whether you are targeting TCS, Infosys, Wipro, Accenture, or any other top recruiter, AptiCore has the resources you need.",
      },
    ],
  },
  "Quick Start": {
    title: "Quick Start Guide",
    content: [
      {
        type: "paragraph",
        text: "Get started with AptiCore in just a few minutes. Follow these steps to begin your preparation journey.",
      },
      {
        type: "heading",
        text: "Step 1: Create an Account",
      },
      {
        type: "paragraph",
        text: "Sign up using your email address or Google account. Fill in your academic details to personalise your experience.",
      },
      {
        type: "heading",
        text: "Step 2: Choose a Category",
      },
      {
        type: "paragraph",
        text: "Browse through our categories covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, and more. Each category has multiple subcategories with questions of varying difficulty levels.",
      },
      {
        type: "heading",
        text: "Step 3: Take a Test",
      },
      {
        type: "paragraph",
        text: "Select a test and start practicing. You can choose between timed and untimed modes. Each question includes detailed explanations to help you learn.",
      },
      {
        type: "heading",
        text: "Step 4: Track Your Progress",
      },
      {
        type: "paragraph",
        text: "Use the Analytics dashboard to track your performance, identify weak areas, and monitor improvement over time.",
      },
    ],
  },
}

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState("Introduction")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentDoc = docContent[activeDoc as keyof typeof docContent] || docContent.Introduction

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "list"; items: string[] }

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-400">
            <BookOpen className="h-3.5 w-3.5" /> Documentation
          </div>
          <h1 className="font-display mb-2 text-4xl font-bold sm:text-5xl">
            Developer <span className="gradient-text">Docs</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Everything you need to integrate, use, and master AptiCore.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Sidebar */}
          <aside
            className={cn(
              "w-64 shrink-0",
              sidebarOpen
                ? "fixed inset-0 z-30 bg-[hsl(var(--background))] p-4 pt-20 lg:static lg:block lg:p-0"
                : "hidden lg:block"
            )}
          >
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-2.5 pl-10 pr-4 text-sm transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>
              {sidebarSections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setActiveDoc(item.label)
                          setSidebarOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          activeDoc === item.label
                            ? "bg-purple-500/10 text-purple-400"
                            : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 lg:p-10">
              <h1 className="font-display mb-1 text-3xl font-bold">
                {currentDoc.title}
              </h1>
              <div className="mt-8 space-y-6">
                {currentDoc.content.map((block: ContentBlock, idx) => {
                  switch (block.type) {
                    case "heading":
                      return (
                        <h2
                          key={idx}
                          className="font-display pt-4 text-xl font-semibold"
                        >
                          {block.text}
                        </h2>
                      )
                    case "paragraph":
                      return (
                        <p
                          key={idx}
                          className="leading-relaxed text-[hsl(var(--muted-foreground))]"
                        >
                          {block.text}
                        </p>
                      )
                    case "list":
                      return (
                        <ul
                          key={idx}
                          className="space-y-2 text-[hsl(var(--muted-foreground))]"
                        >
                          {block.items?.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )
                    default:
                      return null
                  }
                })}
              </div>

              {/* Code Block Example */}
              <div className="mt-10 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                    <Terminal className="h-3.5 w-3.5" /> JavaScript
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 text-sm text-[hsl(var(--muted-foreground))]">
                  <code>{`// Example: Fetching user performance data
const response = await fetch('https://api.apricore.com/v1/analytics', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.performance);`}</code>
                </pre>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-[hsl(var(--border))] pt-6">
                <button className="inline-flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-sky-400">
                  <ChevronRight className="h-4 w-4 rotate-180" /> Previous
                </button>
                <button className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
