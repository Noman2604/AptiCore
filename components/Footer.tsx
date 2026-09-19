"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Mail, Sparkles, Zap } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Practice Tests", href: "/tests" },
    { label: "Categories", href: "/categories" },
    { label: "Contests", href: "/contest" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  Resources: [
    { label: "Docs", href: "/docs" },
    { label: "Guides", href: "/guides" },
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.9 9.9 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.149a4.822 4.822 0 001.527 6.574 4.9 4.9 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.936 4.936 0 004.604 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.014-.633A10.012 10.012 0 0024 4.59z" />
    </svg>
  )
}

const socials = [
  { icon: GithubIcon, href: "#", label: "GitHub" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
]

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-[#212a37] bg-[#0a0e14]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,231,201,0.1),transparent_30%),radial-gradient(circle_at_top_right,rgba(139,124,246,0.1),transparent_28%),linear-gradient(to_bottom,transparent,rgba(10,14,20,0.4))]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-4 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-2 px-3 py-2">
              <Image
                src="/logo.png"
                alt="AptiCore Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="bg-linear-to-r from-[#6ee7c9] to-[#8b7cf6] bg-clip-text font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight text-transparent">
                AptiCore
              </span>
            </Link>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#8a96a8] sm:text-base">
              India&apos;s most advanced platform for placement preparation and
              aptitude mastery. Build confidence, improve faster, and track
              every milestone in one place.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] px-4 py-2 text-sm font-medium text-[#6ee7c9]">
                <Sparkles className="h-4 w-4" />
                Built for serious learners
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(62,207,142,0.3)] bg-[rgba(62,207,142,0.1)] px-4 py-2 text-sm font-medium text-[#3ecf8e]">
                <Zap className="h-4 w-4" />
                Practice. Improve. Repeat.
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-[#212a37] bg-[#10151d] text-[#8a96a8] transition-all hover:-translate-y-0.5 hover:border-[rgba(110,231,201,0.4)] hover:bg-[rgba(110,231,201,0.1)] hover:text-[#e7ecf3]"
                >
                  <s.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-[JetBrains_Mono,monospace] text-[11px] font-semibold tracking-[0.2em] text-[#e7ecf3] uppercase">
                  {section}
                </h4>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-[#8a96a8] transition-colors hover:text-[#e7ecf3]"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#6ee7c9] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#212a37] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#8a96a8]">
            © {new Date().getFullYear()} AptiCore. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#8a96a8]">
            <a
              href="mailto:support@apticore.in"
              className="inline-flex items-center gap-2 hover:text-[#6ee7c9] transition-colors"
            >
              <Mail className="h-4 w-4 text-[#6ee7c9]" />
              support@apticore.in
            </a>
            <span className="hidden h-1 w-1 rounded-full bg-[#212a37] sm:inline-flex" />
            <span>BKC, Mumbai, India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}