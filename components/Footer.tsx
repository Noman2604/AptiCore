"use client"
import Link from "next/link"
import { Zap, PlayCircle, Mail } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  Product: [
    { label: "Practice Tests", href: "/tests" },
    { label: "Categories", href: "/categories" },
    { label: "Contests", href: "/contest" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  Resources: [
    { label: "Docs", href: "/docs",},
    { label: "Guides", href: "/guides"},
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
    <footer className="mt-24 border-t border-[hsl(var(--border))]">
      <div className="max-w-8xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="AptiCore Logo"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="font-display gradient-text text-xl font-bold">
                AptiCore
              </span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              India's most advanced platform for placement preparation and
              aptitude mastery.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition-all hover:border-sky-500 hover:bg-sky-500/10 hover:text-[hsl(var(--foreground))]"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-4 text-xl font-semibold text-[hsl(var(--foreground))]">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-[hsl(var(--foreground))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[hsl(var(--border))] pt-8 sm:flex-row">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © {new Date().getFullYear()} AptiCore. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
            <span>Biuld for placement success</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
