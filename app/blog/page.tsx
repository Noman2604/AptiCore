"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Users,
  Code,
  Search,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

const categories = ["All", "Learning Tips", "Placement Prep", "Product Updates", "Industry Insights"]

const posts = [
  {
    title: "How to Crack Quantitative Aptitude in 30 Days",
    excerpt:
      "A structured 30-day roadmap to master quantitative aptitude for placement exams. Covering topics, practice strategies, and common pitfalls.",
    category: "Learning Tips",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    featured: true,
    image: "QT",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    title: "Top 10 Companies Hiring in 2025 – What to Expect",
    excerpt:
      "An overview of the top recruiters this year, their selection process, and how you can prepare for each stage effectively.",
    category: "Placement Prep",
    date: "Jan 12, 2025",
    readTime: "6 min read",
    featured: false,
    image: "HC",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "New Feature: AI-Powered Performance Insights",
    excerpt:
      "We're excited to launch our new AI analytics dashboard that helps you identify weak areas and track improvement over time.",
    category: "Product Updates",
    date: "Jan 10, 2025",
    readTime: "4 min read",
    featured: false,
    image: "AI",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Logical Reasoning: Common Patterns & How to Solve",
    excerpt:
      "Break down the most common logical reasoning question patterns and learn proven strategies to solve them quickly.",
    category: "Learning Tips",
    date: "Jan 8, 2025",
    readTime: "10 min read",
    featured: false,
    image: "LR",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "The State of Placement Preparation in India",
    excerpt:
      "A deep dive into how engineering students are preparing for placements, the challenges they face, and emerging trends.",
    category: "Industry Insights",
    date: "Jan 5, 2025",
    readTime: "7 min read",
    featured: false,
    image: "IN",
    gradient: "from-rose-500 to-red-600",
  },
  {
    title: "Mastering Coding MCQs: Tips from Top Performers",
    excerpt:
      "Learn from the highest scorers on AptiCore about how they approach coding MCQs and consistently score in the top percentile.",
    category: "Learning Tips",
    date: "Jan 3, 2025",
    readTime: "5 min read",
    featured: false,
    image: "CM",
    gradient: "from-cyan-500 to-blue-600",
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  const featuredPost = posts.find((p) => p.featured)

  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-400">
            <BookOpen className="h-3.5 w-3.5" /> Insights & Updates
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            AptiCore <span className="gradient-text">Blog</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Tips, guides, and updates to help you ace your placement preparation.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="card-hover mb-12 overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="grid md:grid-cols-2">
              <div
                className={`flex min-h-62.5 items-center justify-center bg-linear-to-br ${featuredPost.gradient} p-8`}
              >
                <span className="text-6xl font-bold text-white/80">
                  {featuredPost.image}
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
                  <TrendingUp className="h-3 w-3" /> Featured
                </div>
                <h2 className="font-display mb-3 text-2xl font-bold leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {featuredPost.excerpt}
                </p>
                <div className="mb-4 flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {featuredPost.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}
                  </span>
                </div>
                <Link
                  href="#"
                  className="inline-flex w-fit items-center gap-1.5 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  Read Article <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="relative ml-auto hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-2 pl-10 pr-4 text-sm transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts
            .filter((p) => !p.featured)
            .map((post) => (
              <div
                key={post.title}
                className="card-hover group flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden"
              >
                <div
                  className={`flex h-44 items-center justify-center bg-linear-to-br ${post.gradient}`}
                >
                  <span className="text-5xl font-bold text-white/70">
                    {post.image}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--surface))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    {post.category}
                  </div>
                  <h3 className="font-display mb-2 font-semibold leading-snug group-hover:text-sky-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-3">
                    <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {post.readTime}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-sky-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {filteredPosts.filter((p) => !p.featured).length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              No posts found in this category.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
