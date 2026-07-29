"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Target, Users, Award, Globe, Zap, Heart } from "lucide-react"

const team = [
  {
    name: "Noman Patel",
    role: "CEO & Co-founder",
    avatar: "NP",
    bg: "from-sky-500 to-blue-600",
  },
  {
    name: "Mrunal Waghare",
    role: "CTO",
    avatar: "MW",
    bg: "from-purple-500 to-pink-600",
  },
  {
    name: "Shubham Kasare",
    role: "Head of Content",
    avatar: "SK",
    bg: "from-amber-500 to-orange-600",
  },
  {
    name: "Aman Sharma",
    role: "Head of Design",
    avatar: "AS",
    bg: "from-emerald-500 to-teal-600",
  },
]

export default function AboutPage() {
  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-400">
            <Zap className="h-3.5 w-3.5" /> Our Mission
          </div>
          <h1 className="font-display mb-6 text-5xl font-bold">
            Built for India's <span className="gradient-text">Dreamers</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
            AptitudeX was founded with a simple belief: every engineering
            student deserves access to world-class placement preparation,
            regardless of their college or location.
          </p>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Democratize placement preparation with high-quality, affordable aptitude practice tools",
              color: "text-sky-400 bg-sky-500/10",
            },
            {
              icon: Heart,
              title: "Our Values",
              desc: "Quality content, student success, continuous improvement, and community first",
              color: "text-red-400 bg-red-500/10",
            },
            {
              icon: Globe,
              title: "Our Vision",
              desc: "Become the go-to platform for every engineering student preparing for their career",
              color: "text-emerald-400 bg-emerald-500/10",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center"
            >
              <div
                className={`h-12 w-12 rounded-2xl ${v.color} mx-auto mb-4 flex items-center justify-center`}
              >
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display mb-2 font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="font-display mb-8 text-center text-3xl font-bold">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {team.map((m) => (
              <div
                key={m.name}
                className="card-hover rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center"
              >
                <div
                  className={`h-16 w-16 rounded-2xl bg-linear-to-br ${m.bg} mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white`}
                >
                  {m.avatar}
                </div>
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
