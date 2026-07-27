"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setSent(true)
  }

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="font-display mb-4 text-5xl font-bold">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))]">
            Have questions? We'd love to hear from you.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {[
              {
                icon: Mail,
                title: "Email Us",
                desc: "support@apticore.in",
                sub: "Response within 24 hours",
              },
              {
                icon: Phone,
                title: "Call Us",
                desc: "+91 9321xxxxxx",
                sub: "Business hours only",
              },
              {
                icon: MapPin,
                title: "Office",
                desc: "Mumbai, Maharashtra",
                sub: "India 400001",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="mb-0.5 text-sm font-semibold">{c.title}</div>
                  <div className="text-sm text-[hsl(var(--foreground))]">
                    {c.desc}
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {c.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8">
            {sent ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
                <h3 className="font-display mb-2 text-xl font-bold">
                  Message Sent!
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display mb-6 text-xl font-bold">
                  Send a message
                </h3>
                {[
                  {
                    field: "name",
                    label: "Name",
                    type: "text",
                    placeholder: "Your name",
                  },
                  {
                    field: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "you@example.com",
                  },
                  {
                    field: "subject",
                    label: "Subject",
                    type: "text",
                    placeholder: "How can we help?",
                  },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="mb-1.5 block text-sm font-medium">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      required
                      value={(form as any)[f.field]}
                      onChange={(e) =>
                        setForm({ ...form, [f.field]: e.target.value })
                      }
                      className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your query..."
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
                    isLoading
                      ? "cursor-not-allowed bg-sky-500/50 text-white/70"
                      : "shadow-glow-brand bg-linear-to-r from-sky-500 to-blue-600 text-white hover:opacity-90"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight className="h-4 w-4" />
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
