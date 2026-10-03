"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Brain,
  Trophy,
  Shield,
  Flame,
  Globe,
  Lock,
  BookOpen,
  Code2,
  Database,
  Cpu,
  MessageSquare,
  FileText,
  Lightbulb,
  Target,
  BarChart2,
  Medal,
  type LucideIcon,
} from "lucide-react"

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  isActive?: boolean
  subcategories?: { _id: string; name: string }[]
  questionCount?: number
}

export interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  color: string
}

export interface CategoryStyle {
  icon: LucideIcon
  color: string
}

export const COMPANIES: string[] = [
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Cognizant",
  "HCL",
  "Tech Mahindra",
  "Capgemini",
  "IBM",
  "Oracle",
  "Google",
  "Amazon",
  "Microsoft",
  "Deloitte",
  "KPMG",
]

export const FEATURES: Feature[] = [
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    desc: "Get personalized weak area analysis and improvement suggestions powered by AI",
    color: "#8b7cf6",
  },
  {
    icon: Trophy,
    title: "Weekly Contests",
    desc: "Compete globally in timed contests, climb leaderboards and earn rewards",
    color: "#f5a623",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    desc: "Full-screen exam mode with proctoring ensures fair competition",
    color: "#6ee7c9",
  },
  {
    icon: Flame,
    title: "Streak System",
    desc: "Maintain daily streaks to earn XP multipliers and exclusive badges",
    color: "#f2896b",
  },
  {
    icon: Globe,
    title: "Multi-language",
    desc: "Practice in English, Hindi, and regional languages",
    color: "#3ecf8e",
  },
  {
    icon: Lock,
    title: "Detailed Solutions",
    desc: "Every question comes with step-by-step text explanations",
    color: "#f2555a",
  },
]

export const CATEGORY_STYLES: CategoryStyle[] = [
  { icon: BookOpen, color: "#6ee7c9" },
  { icon: Code2, color: "#8b7cf6" },
  { icon: Database, color: "#3ecf8e" },
  { icon: Brain, color: "#f5a623" },
  { icon: Cpu, color: "#f2555a" },
  { icon: MessageSquare, color: "#f2896b" },
  { icon: FileText, color: "#6ee7c9" },
  { icon: Lightbulb, color: "#8b7cf6" },
  { icon: Target, color: "#3ecf8e" },
  { icon: BarChart2, color: "#f5a623" },
  { icon: Medal, color: "#f2555a" },
]

export function getCategoryStyle(index: number): CategoryStyle {
  return CATEGORY_STYLES[index % CATEGORY_STYLES.length]
}

export function useLandingPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // 3D card tilt handlers (subtle, refined depth)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 3.5, y: -y * 3.5 })
  }

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Scroll progress for reading indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load active categories
  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const res = await axios.get("/api/categories")
        const data: Category[] = res.data?.data || []
        if (isMounted) {
          setCategories(data.filter((c) => c.isActive !== false))
        }
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        if (isMounted) {
          setCategoriesLoading(false)
        }
      }
    }

    void loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    categories,
    categoriesLoading,
    scrollProgress,
    tilt,
    handleCardMouseMove,
    handleCardMouseLeave,
    companies: COMPANIES,
    features: FEATURES,
    categoryStyles: CATEGORY_STYLES,
    getCategoryStyle,
  }
}
