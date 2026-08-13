"use client"
import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Users,
  MessageCircle,
  Trophy,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  Star,
  Quote,
  Globe,
  Heart,
  Share2,
  ThumbsUp,
  Eye,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { icon: Users, label: "Active Members", value: "12,500+", suffix: "+" },
  { icon: MessageCircle, label: "Discussions", value: "2,800+", suffix: "+" },
  { icon: Trophy, label: "Tests Completed", value: "85K+", suffix: "+" },
  { icon: BookOpen, label: "Study Resources", value: "500+", suffix: "+" },
]

const forumCategories = [
  {
    icon: BookOpen,
    title: "Quantitative Aptitude",
    desc: "Discuss formulas, shortcuts, and problem-solving strategies",
    topics: "1,240",
    posts: "4,800",
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    icon: Lightbulb,
    title: "Logical Reasoning",
    desc: "Puzzles, syllogisms, and reasoning techniques",
    topics: "890",
    posts: "3,200",
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Verbal Ability",
    desc: "Grammar, vocabulary, and reading comprehension",
    topics: "560",
    posts: "2,100",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: Code,
    title: "Coding MCQs",
    desc: "Programming concepts, output questions, and debugging",
    topics: "720",
    posts: "2,600",
    color: "text-sky-400 bg-sky-500/10",
  },
  {
    icon: Users,
    title: "Placement Talks",
    desc: "Interview experiences, company discussions, and tips",
    topics: "1,100",
    posts: "4,200",
    color: "text-rose-400 bg-rose-500/10",
  },
  {
    icon: Heart,
    title: "Motivation & Support",
    desc: "Stay motivated, share progress, and encourage others",
    topics: "430",
    posts: "1,900",
    color: "text-pink-400 bg-pink-500/10",
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Computer Science, VIT",
    avatar: "PS",
    gradient: "from-sky-500 to-blue-600",
    text: "The community discussions helped me understand complex concepts that I was struggling with. The study group feature is amazing!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "IT, NIT Trichy",
    avatar: "RV",
    gradient: "from-purple-500 to-pink-600",
    text: "I placed at TCS with a 9 LPA offer thanks to AptiCore. The mock tests and community feedback were game-changers.",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    role: "ECE, DTU",
    avatar: "AG",
    gradient: "from-emerald-500 to-teal-600",
    text: "AptiCore's community is incredibly supportive. I've made study partners and friends while preparing for placements.",
    rating: 5,
  },
]

const topDiscussions = [
  {
    title: "How to solve data sufficiency questions quickly?",
    author: "AmitK",
    replies: 23,
    views: 456,
    likes: 34,
    category: "Quantitative Aptitude",
    time: "2 hours ago",
  },
  {
    title: "TCS NQT 2025 experience and tips",
    author: "SnehaR",
    replies: 45,
    views: 892,
    likes: 67,
    category: "Placement Talks",
    time: "5 hours ago",
  },
  {
    title: "Best resources for verbal ability preparation",
    author: "VikramS",
    replies: 18,
    views: 324,
    likes: 28,
    category: "Verbal Ability",
    time: "1 day ago",
  },
  {
    title: "Doubt: Clock and calendar problems",
    author: "NehaP",
    replies: 12,
    views: 198,
    likes: 19,
    category: "Logical Reasoning",
    time: "1 day ago",
  },
]

function Lightbulb({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function Code({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export default function CommunityPage() {
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0))
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          stats.forEach((stat, idx) => {
            const target = parseInt(stat.value.replace(/[^0-9]/g, ""))
            let current = 0
            const step = Math.ceil(target / 60)
            const interval = setInterval(() => {
              current += step
              if (current >= target) {
                current = target
                clearInterval(interval)
              }
              setAnimatedStats((prev) => {
                const next = [...prev]
                next[idx] = current
                return next
              })
            }, 25)
          })
        }
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-400">
            <Users className="h-3.5 w-3.5" /> Community
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Learn Together, Grow <span className="gradient-text">Together</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Join thousands of students collaborating, sharing knowledge, and
            motivating each other to succeed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Join the Discussion
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium transition-all hover:bg-[hsl(var(--surface-hover))]"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-3xl font-bold">
                {animatedStats[idx].toLocaleString()}
                {stat.suffix}
              </div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Forum Categories */}
        <div className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">
              Forum <span className="gradient-text">Categories</span>
            </h2>
            <Link
              href="#"
              className="hidden items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300 sm:inline-flex"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {forumCategories.map((cat) => (
              <div
                key={cat.title}
                className="card-hover group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}
                  >
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <h3 className="font-display mb-1 font-semibold">{cat.title}</h3>
                <p className="mb-3 text-sm text-[hsl(var(--muted-foreground))]">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                  <span>{cat.topics} topics</span>
                  <span>{cat.posts} posts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Discussions */}
        <div className="mb-16">
          <h2 className="font-display mb-6 text-2xl font-bold">
            Hot <span className="gradient-text">Discussions</span>
          </h2>
          <div className="space-y-3">
            {topDiscussions.map((discussion) => (
              <div
                key={discussion.title}
                className="card-hover flex flex-col gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--surface))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                    {discussion.category}
                  </div>
                  <h3 className="font-display font-medium leading-snug">
                    {discussion.title}
                  </h3>
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                    by {discussion.author} &middot; {discussion.time}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />{" "}
                    {discussion.replies}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {discussion.views}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {discussion.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="font-display mb-8 text-center text-2xl font-bold">
            What Our Members <span className="gradient-text">Say</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="card-hover rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
              >
                <Quote className="mb-3 h-6 w-6 text-sky-400/40" />
                <p className="mb-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${t.gradient} text-sm font-bold text-white`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="font-display mb-3 text-2xl font-bold sm:text-3xl">
              Ready to Join the Community?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-[hsl(var(--muted-foreground))]">
              Connect with peers, share knowledge, and accelerate your placement
              preparation journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <Zap className="h-4 w-4" /> Join Free
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium transition-all hover:bg-[hsl(var(--surface-hover))]"
              >
                <Globe className="h-4 w-4" /> Explore Forums
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
