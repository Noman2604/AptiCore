"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Users,
  GraduationCap,
  Coffee,
  Gift,
  Globe,
  ArrowRight,
  Star,
  Search,
} from "lucide-react"
import Link from "next/link"

const jobs = [
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹20L – ₹35L",
    featured: true,
    tags: ["React", "Next.js", "Node.js", "MongoDB"],
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹12L – ₹20L",
    featured: false,
    tags: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Content & Curriculum Lead",
    department: "Content",
    location: "Remote",
    type: "Full-time",
    salary: "₹10L – ₹18L",
    featured: false,
    tags: ["Aptitude", "Curriculum Design", "Quality"],
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹15L – ₹25L",
    featured: false,
    tags: ["Figma", "UI/UX", "Design Systems"],
  },
  {
    title: "Growth Marketing Lead",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "₹12L – ₹22L",
    featured: false,
    tags: ["SEO", "Campaigns", "Analytics"],
  },
  {
    title: "QA Engineer",
    department: "Engineering",
    location: "Mumbai, India",
    type: "Contract",
    salary: "₹8L – ₹12L",
    featured: false,
    tags: ["Testing", "Automation", "Cypress"],
  },
]

const perks = [
  { icon: Zap, title: "High Impact", desc: "Work on a product used by thousands of students daily" },
  { icon: Heart, title: "Health Insurance", desc: "Comprehensive coverage for you and your family" },
  { icon: GraduationCap, title: "Learning Budget", desc: "₹1L annual budget for courses and conferences" },
  { icon: Coffee, title: "Fuel & Food", desc: "Office meals, snacks, and unlimited coffee" },
  { icon: Gift, title: "Stock Options", desc: "ESOPs for all full-time employees" },
  { icon: Globe, title: "Remote Friendly", desc: "Flexible work from anywhere in India" },
]

export default function CareersPage() {
  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
            <Briefcase className="h-3.5 w-3.5" /> Join Our Team
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Shape the Future of <span className="gradient-text">Learning</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Help us build India&apos;s most advanced placement preparation platform.
            We&apos;re looking for passionate people who want to make a real impact.
          </p>
        </div>

        {/* Perks */}
        <div className="mb-16">
          <h2 className="font-display mb-8 text-center text-2xl font-bold">
            Why Join <span className="gradient-text">AptiCore</span>?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="card-hover rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <perk.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display mb-1 font-semibold">{perk.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">
              Open Positions <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">({jobs.length} roles)</span>
            </h2>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search roles..."
                className="w-56 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-2 pl-10 pr-4 text-sm transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.title}
                className="card-hover group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all"
              >
                {job.featured && (
                  <div className="absolute -top-2.5 right-6 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    <Star className="h-3 w-3" /> Featured
                  </div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="font-display mb-2 text-lg font-semibold">
                      {job.title}
                    </h3>
                    <div className="mb-3 flex flex-wrap gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" /> {job.salary}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--muted-foreground))]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Don&apos;t see a role that fits?{" "}
              <a
                href="mailto:careers@apticore.com"
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Send us your resume
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
