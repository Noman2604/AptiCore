"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  MessageSquare,
  FileText,
  User,
  CreditCard,
  Monitor,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const faqCategories = [
  {
    icon: User,
    title: "Account & Profile",
    color: "text-sky-400 bg-sky-500/10",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click on 'Get Started' in the top right corner. You can sign up using your email address or Google account. Fill in your basic details and you're ready to go.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can delete your account from the Settings page. This will permanently remove all your data, including test history and progress.",
      },
      {
        q: "How do I update my profile?",
        a: "Go to your Profile page from the dashboard. You can update your name, email, college details, and profile picture there.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click on 'Forgot Password' on the login page. Enter your registered email, and we'll send you a password reset link.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Tests & Practice",
    color: "text-emerald-400 bg-emerald-500/10",
    questions: [
      {
        q: "How do I start a practice test?",
        a: "Navigate to the Tests page, choose a category and subcategory, then click 'Start Test'. You can select between timed and untimed modes.",
      },
      {
        q: "Can I retake a test?",
        a: "Yes, you can retake any test multiple times. Your best score will be recorded, and you can track improvement over time.",
      },
      {
        q: "Are the tests based on actual placement exams?",
        a: "Yes, our question bank is curated based on patterns from TCS, Infosys, Wipro, Accenture, and other major recruiters.",
      },
      {
        q: "How are scores calculated?",
        a: "Each correct answer awards points based on difficulty. Wrong answers do not carry negative marks unless specified. Detailed score breakdowns are available after each test.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Subscription & Payments",
    color: "text-amber-400 bg-amber-500/10",
    questions: [
      {
        q: "Is AptiCore free to use?",
        a: "We offer a free tier with access to basic tests and limited analytics. Premium subscription unlocks the full question bank, advanced analytics, and priority support.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, debit/credit cards, net banking, and popular wallets. All payments are processed securely through our payment gateway.",
      },
      {
        q: "Can I get a refund?",
        a: "We offer a 7-day money-back guarantee on all paid subscriptions. Contact our support team to initiate the refund process.",
      },
    ],
  },
  {
    icon: Monitor,
    title: "Technical Issues",
    color: "text-purple-400 bg-purple-500/10",
    questions: [
      {
        q: "The platform is loading slowly. What should I do?",
        a: "Try clearing your browser cache, disabling extensions, or switching to a stable internet connection. We recommend using the latest version of Chrome or Firefox.",
      },
      {
        q: "My test got interrupted. Will my progress be saved?",
        a: "Yes, your answers are auto-saved periodically. If you get disconnected, simply log back in and resume the test from where you left off.",
      },
      {
        q: "Which browsers are supported?",
        a: "AptiCore works best on the latest versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.",
      },
    ],
  },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({})

  const toggleFaq = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenFaqs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const allQuestions = faqCategories.flatMap((cat, ci) =>
    cat.questions.map((q, qi) => ({ ...q, category: cat.title, ci, qi }))
  )

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-400">
            <HelpCircle className="h-3.5 w-3.5" /> Support
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Help <span className="gradient-text">Center</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search */}
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-4 pl-12 pr-4 text-base transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h3 className="font-display mb-4 text-lg font-semibold">
              Search Results ({filteredQuestions.length})
            </h3>
            {filteredQuestions.length > 0 ? (
              <div className="space-y-3">
                {filteredQuestions.map((q) => (
                  <div
                    key={`${q.ci}-${q.qi}`}
                    className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4"
                  >
                    <div className="mb-1 text-xs font-medium text-sky-400">
                      {q.category}
                    </div>
                    <h4 className="mb-1 font-medium">{q.q}</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {q.a}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No results found. Try different keywords or contact support.
              </p>
            )}
          </div>
        )}

        {/* FAQ Categories */}
        {!searchQuery && (
          <div className="space-y-8">
            {faqCategories.map((category, ci) => (
              <div
                key={category.title}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden"
              >
                <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] p-5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.color}`}
                  >
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-lg font-semibold">
                    {category.title}
                  </h2>
                </div>
                <div className="divide-y divide-[hsl(var(--border))]">
                  {category.questions.map((faq, qi) => {
                    const key = `${ci}-${qi}`
                    const isOpen = openFaqs[key]
                    return (
                      <div key={qi}>
                        <button
                          onClick={() => toggleFaq(ci, qi)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[hsl(var(--surface-hover))]"
                        >
                          <span className="pr-4 text-sm font-medium">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4">
                            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="font-display mb-2 text-2xl font-bold">
            Still Need Help?
          </h2>
          <p className="mb-6 text-[hsl(var(--muted-foreground))]">
            Our support team typically responds within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              <Mail className="h-4 w-4" /> Contact Support
            </Link>
            <a
              href="mailto:support@apticore.com"
              className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium transition-all hover:bg-[hsl(var(--surface-hover))]"
            >
              <ExternalLink className="h-4 w-4" /> support@apticore.com
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
