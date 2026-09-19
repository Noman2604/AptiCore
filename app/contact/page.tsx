"use client"
import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
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
      errs.email = "Please enter a valid email address (e.g. name@example.com)"
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
      return
    }

    setIsLoading(true)
    // Simulate API dispatch with network latency
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    setSent(true)
  }

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))] font-[Inter,sans-serif] text-[hsl(var(--foreground))]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Campus Support & Inquiries</span>
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="mx-auto max-w-lg text-base text-[hsl(var(--muted-foreground))] sm:text-lg">
            Have questions about college partnerships, placement test modules, or
            technical support? We're here to help.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Details Column */}
          <div className="space-y-5">
            {[
              {
                icon: Mail,
                title: "Email Support",
                desc: "support@apticore.in",
                sub: "Response within 24 business hours",
                href: "mailto:support@apticore.in",
              },
              {
                icon: Phone,
                title: "Phone Helpline",
                desc: "+91 22 6985 4100",
                sub: "Direct line for institutional inquiries",
                href: "tel:+912269854100",
              },
              {
                icon: MapPin,
                title: "Corporate Headquarters",
                desc: "Platina Building, G-Block, BKC",
                sub: "Bandra East, Mumbai, Maharashtra 400051, India",
                href: "https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai",
              },
              {
                icon: Clock,
                title: "Working Hours",
                desc: "Monday to Saturday: 9:00 AM – 7:00 PM IST",
                sub: "Closed on National Holidays",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-colors hover:border-sky-500/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    {c.title}
                  </div>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="mt-0.5 block text-sm font-semibold text-[hsl(var(--foreground))] hover:text-sky-400 transition-colors"
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {c.desc}
                    </a>
                  ) : (
                    <div className="mt-0.5 text-sm font-semibold text-[hsl(var(--foreground))]">
                      {c.desc}
                    </div>
                  )}
                  <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                    {c.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Column */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-xl">
            {sent ? (
              <div className="py-10 text-center animate-in fade-in duration-300">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="font-display mb-2 text-2xl font-bold">
                  Message Sent Successfully!
                </h3>
                <p className="mx-auto max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
                  Thank you for reaching out. We will review your inquiry and respond
                  within 24 hours.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/thank-you"
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95"
                  >
                    View Confirmation Page <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => {
                      setSent(false)
                      setForm({ name: "", email: "", subject: "", message: "" })
                    }}
                    className="rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <h3 className="font-display mb-4 text-xl font-bold">
                  Send us a Message
                </h3>

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={form.name}
                    aria-invalid={!!errors.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none",
                      errors.name
                        ? "border-red-500/60 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--surface))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 animate-in fade-in duration-200">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    aria-invalid={!!errors.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none",
                      errors.email
                        ? "border-red-500/60 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--surface))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 animate-in fade-in duration-200">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="How can our placement mentors assist you?"
                    value={form.subject}
                    aria-invalid={!!errors.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none",
                      errors.subject
                        ? "border-red-500/60 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--surface))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    )}
                  />
                  {errors.subject && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 animate-in fade-in duration-200">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Describe your query or feedback in detail..."
                    value={form.message}
                    aria-invalid={!!errors.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={cn(
                      "w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none",
                      errors.message
                        ? "border-red-500/60 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--surface))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    )}
                  />
                  {errors.message && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 animate-in fade-in duration-200">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all shadow-md",
                    isLoading
                      ? "cursor-not-allowed bg-sky-500/50 text-white/70"
                      : "bg-linear-to-r from-sky-500 to-blue-600 text-white hover:opacity-95 active:scale-[0.99]"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
