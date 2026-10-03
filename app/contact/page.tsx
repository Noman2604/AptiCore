"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BlurFade } from "@/components/magicui/blur-fade"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Building2,
  GraduationCap,
  Send,
  BookOpen,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const contactChannels = [
  {
    icon: Mail,
    title: "Student Support",
    email: "support@apticore.in",
    desc: "For questions about tests, scoring, account access, or proctoring.",
    sub: "Average response: under 24 hours",
    href: "mailto:support@apticore.in",
    badge: "Fast Response",
    color: "emerald",
  },
  {
    icon: Phone,
    title: "Telephone Helpline",
    email: "+91 00 0000 0000",
    desc: "Direct support line for urgent assistance during live placement contests.",
    sub: "Mon – Sat: 9:00 AM – 7:00 PM IST",
    href: "tel:+910000000000",
    badge: "Direct Line",
    color: "amber",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    email: "Mumbai, Maharashtra",
    desc: "Vikhroli West, Mumbai 400079, India.",
    sub: "Open for scheduled institutional visits",
    href: "",
    badge: "HQ",
    color: "sky",
  },
]

const faqs = [
  {
    id: "faq-1",
    question: "Is AptiCore completely free to use?",
    answer:
      "Yes, AptiCore offers an entirely free tier with unlimited access to all core aptitude test modules (Quantitative, Logical Reasoning, Verbal Ability), step-by-step mathematical explanations, diagnostic analytics, and weekly community contests without requiring any credit card or subscription.",
  },
  {
    id: "faq-2",
    question: "Does AptiCore cover technical and coding rounds?",
    answer:
      "Absolutely. In addition to general aptitude, AptiCore includes extensive Core Computer Science and Coding MCQ modules covering Data Structures, Algorithms, OOPs (C++, Java, Python), DBMS, Operating Systems, Computer Networks, and company-specific technical rounds.",
  },
  {
    id: "faq-3",
    question: "How is negative marking handled during practice tests?",
    answer:
      "You can configure mock exams to mirror the exact negative marking rules of your target companies (such as TCS NQT negative deductions, Infosys section criteria, or standard -0.25 penalties). This builds authentic exam risk-calibration and pacing skills before test day.",
  },
  {
    id: "faq-4",
    question: "Can colleges or Training & Placement (TPO) cells partner with AptiCore?",
    answer:
      "Yes! We partner with university TPO cells and engineering colleges across India to conduct department-wide aptitude screening, mock recruitment drives, and benchmark student cohort preparedness. Email us at partnerships@apticore.in for institutional onboarding.",
  },
  {
    id: "faq-5",
    question: "How are the questions and explanations verified?",
    answer:
      "Every question on AptiCore is curated and verified by subject matter experts and placement mentors who analyze actual question patterns from recent recruitment cycles (TCS, Infosys, Wipro, Accenture, Cognizant). Each question includes detailed written step-by-step logic and mathematical shortcuts.",
  },
  {
    id: "faq-6",
    question: "Can I track my speed and topic-wise accuracy over time?",
    answer:
      "Yes. The AptiCore personal analytics dashboard tracks your average time spent per question, topic-wise accuracy percentages, percentile ranking against peers nationwide, XP streaks, and provides targeted recommendations on your weakest areas.",
  },
  {
    id: "faq-7",
    question: "How does AptiCore simulate real exam conditions?",
    answer:
      "Our timed test engine operates in strict full-screen mode with section-level countdown timers, question palettes, mark-for-review tags, and auto-submission upon timer expiry, accurately replicating the exam interfaces used in actual campus recruitment drives.",
  },
  {
    id: "faq-8",
    question: "How quickly does your support team respond to inquiries?",
    answer:
      "Our student support desk typically replies within 12 to 24 hours on business days. For urgent institutional inquiries or active contest issues, you can also call our direct phone helpline during operating hours (Mon–Sat: 9:00 AM – 7:00 PM IST).",
  },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "General Support",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}

    if (!form.name.trim()) {
      errs.name = "Please enter your full name"
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters"
    }

    if (!form.email.trim()) {
      errs.email = "Please enter your email address"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@university.edu)"
    }

    if (!form.subject.trim()) {
      errs.subject = "Please enter a subject"
    } else if (form.subject.trim().length < 3) {
      errs.subject = "Subject must be at least 3 characters"
    }

    if (!form.message.trim()) {
      errs.message = "Please describe your query"
    } else if (form.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters long"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error("Please fill in all required fields correctly.")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setSent(true)
    toast.success("Message sent! Our support team will get back to you shortly.")
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Decorative background ambient glows */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(110,231,201,0.06)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute top-2/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl dark:bg-[#8b7cf6]/5" />

        {/* ── 1. Hero Header ────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-emerald-600 dark:text-[#6ee7c9]">
              <Headphones className="h-3.5 w-3.5" />
              <span>Campus Support &amp; Inquiries</span>
            </div>

            <h1 className="mb-4 font-[Space_Grotesk,sans-serif] text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.14]">
              We&apos;re Here to Help You{" "}
              <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                Succeed
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Have questions about placement tests, company syllabi, campus partnerships, or platform features? Reach out to our team or explore our answers below.
            </p>
          </BlurFade>
        </section>

        {/* ── 2. Support Channels Row ──────────────────────────────── */}
        <section className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.15} inView>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contactChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md dark:border-[#212a37] dark:bg-[#0c1017]"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-surface text-emerald-600 dark:text-[#6ee7c9] shadow-2xs transition-transform group-hover:scale-105">
                        <channel.icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-border/70 bg-surface px-2 py-0.5 font-[Space_Grotesk,sans-serif] text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {channel.badge}
                      </span>
                    </div>

                    <h3 className="mb-1 font-[Space_Grotesk,sans-serif] text-base font-bold text-foreground">
                      {channel.title}
                    </h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                      {channel.desc}
                    </p>
                  </div>

                  <div className="border-t border-border/60 pt-3">
                    <a
                      href={channel.href}
                      className="block truncate font-[Space_Grotesk,sans-serif] text-xs font-bold text-foreground transition-colors hover:text-emerald-600 dark:hover:text-[#6ee7c9]"
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {channel.email}
                    </a>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {channel.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BlurFade>
        </section>

        {/* ── 3. Contact Form & Quick Help ──────────────────────────── */}
        <section className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6 lg:px-8">
          <BlurFade delay={0.2} inView>
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column: Context & Guidelines (4 cols) */}
              <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                <div className="rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-xs backdrop-blur-md dark:border-[#212a37] dark:bg-[#0c1017]">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1 font-[Space_Grotesk,sans-serif] text-xs font-bold text-emerald-600 dark:text-[#6ee7c9]">
                    <MessageSquare className="h-3.5 w-3.5" /> Direct Inquiry
                  </div>
                  <h2 className="mb-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-foreground">
                    Send Us a Message
                  </h2>
                  <p className="mb-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    Whether you are an engineering student preparing for campus recruitment, a college TPO requesting batch tests, or a recruiter inquiring about question design — our team is ready to connect.
                  </p>

                  <div className="space-y-4 border-t border-border/60 pt-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-[#6ee7c9]">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-[Space_Grotesk,sans-serif] text-xs font-bold text-foreground">
                          Quick Response SLA
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          All submitted inquiries are assigned a support ticket within 24 hours.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-[#8b7cf6]">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-[Space_Grotesk,sans-serif] text-xs font-bold text-foreground">
                          College Ambassador Program
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Interested in leading AptiCore prep groups in your campus? Mention it in your message.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-[#f5a623]">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-[Space_Grotesk,sans-serif] text-xs font-bold text-foreground">
                          Comprehensive Question Library
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Access over 24,600 verified aptitude and technical questions completely free.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-9 shadow-sm backdrop-blur-md dark:border-[#212a37] dark:bg-[#0c1017]">
                  {sent ? (
                    <div className="py-12 text-center animate-in fade-in duration-300">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-[#6ee7c9]">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-foreground">
                        Message Sent Successfully!
                      </h3>
                      <p className="mx-auto max-w-sm text-xs sm:text-sm text-muted-foreground">
                        Thank you for reaching out to AptiCore. Our team will review your inquiry and follow up within 24 hours.
                      </p>

                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                          onClick={() => {
                            setSent(false)
                            setForm({
                              name: "",
                              email: "",
                              category: "General Support",
                              subject: "",
                              message: "",
                            })
                          }}
                          className="rounded-xl border border-border/80 bg-surface px-4 py-2.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-foreground shadow-2xs hover:bg-muted/80 transition-all active:scale-95"
                        >
                          Send Another Message
                        </button>
                        <Link
                          href="/tests"
                          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-indigo-600 px-5 py-2.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:opacity-95 dark:from-[#6ee7c9] dark:to-[#8b7cf6] dark:text-[#06120d]"
                        >
                          Explore Practice Tests <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      <div className="mb-2">
                        <h3 className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-foreground">
                          Leave Us a Message
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Fill in your details and we will get back to you shortly.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Full Name */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul Verma"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={cn(
                              "h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
                              errors.name && "border-red-500/50 bg-red-500/5 focus:border-red-500"
                            )}
                          />
                          {errors.name && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="you@university.edu"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className={cn(
                              "h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
                              errors.email && "border-red-500/50 bg-red-500/5 focus:border-red-500"
                            )}
                          />
                          {errors.email && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              <span>{errors.email}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Inquiry Category */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Inquiry Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => handleChange("category", e.target.value)}
                          className="h-11 w-full rounded-xl border border-input bg-surface px-3 text-sm text-foreground transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        >
                          <option value="General Support">General Practice Test Support</option>
                          <option value="Institutional Inquiry">College / TPO Partnership</option>
                          <option value="Question Bug / Feedback">Report a Question or Answer Issue</option>
                          <option value="Campus Ambassador">Campus Ambassador Application</option>
                          <option value="Other">Other Inquiry</option>
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="How can our placement mentors assist you?"
                          value={form.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          className={cn(
                            "h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
                            errors.subject && "border-red-500/50 bg-red-500/5 focus:border-red-500"
                          )}
                        />
                        {errors.subject && (
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>{errors.subject}</span>
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Describe your query or feedback in detail..."
                          value={form.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          className={cn(
                            "w-full resize-none rounded-xl border border-input bg-surface p-3.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
                            errors.message && "border-red-500/50 bg-red-500/5 focus:border-red-500"
                          )}
                        />
                        {errors.message && (
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>{errors.message}</span>
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "flex h-11 w-full items-center justify-center gap-2 rounded-xl font-[Space_Grotesk,sans-serif] text-sm font-semibold transition-all duration-200 active:scale-98 shadow-md",
                          isLoading
                            ? "cursor-not-allowed bg-emerald-500/50 text-white"
                            : "bg-linear-to-r from-emerald-600 to-indigo-600 text-white shadow-emerald-500/20 hover:opacity-95 hover:shadow-emerald-500/30 dark:from-[#6ee7c9] dark:to-[#8b7cf6] dark:text-[#06120d] dark:font-bold"
                        )}
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </BlurFade>
        </section>

        {/* ── 4. Frequently Asked Questions (Moved from Landing) ───── */}
        <section className="relative mx-auto mt-24 max-w-4xl px-4 sm:mt-32 sm:px-6 lg:px-8">
          <BlurFade delay={0.25} inView>
            <div className="mb-12 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 font-[Space_Grotesk,sans-serif] text-xs font-semibold text-emerald-600 dark:text-[#6ee7c9]">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl font-extrabold sm:text-4xl text-foreground">
                Got Questions?{" "}
                <span className="bg-linear-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#6ee7c9] dark:to-[#8b7cf6]">
                  We Have Answers
                </span>
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-muted-foreground">
                Find quick answers to common questions about aptitude practice, company syllabus mapping, and test proctoring.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3.5">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-border/80 bg-card/90 px-6 py-1 shadow-xs backdrop-blur-md transition-colors hover:border-emerald-500/40 dark:border-[#212a37] dark:bg-[#0c1017]"
                >
                  <AccordionTrigger className="text-left font-[Space_Grotesk,sans-serif] text-base font-semibold text-foreground transition-colors hover:text-emerald-600 hover:no-underline dark:hover:text-[#6ee7c9]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </BlurFade>
        </section>
      </main>
      <Footer />
    </div>
  )
}
