"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Cookie,
  Info,
  BarChart3,
  Settings2,
  ShieldCheck,
  ExternalLink,
  Smartphone,
  Mail,
} from "lucide-react"

const cookieTypes = [
  {
    icon: Info,
    title: "Essential Cookies",
    desc: "Required for basic platform functionality including login sessions, security, and navigation.",
    example: "Session tokens, CSRF tokens",
    required: true,
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    desc: "Help us understand how users interact with our platform to improve content and user experience.",
    example: "Page views, feature usage, bounce rates",
    required: false,
  },
  {
    icon: Settings2,
    title: "Functional Cookies",
    desc: "Remember your preferences such as theme selection, font size, and test settings.",
    example: "Dark mode preference, language settings",
    required: false,
  },
  {
    icon: Smartphone,
    title: "Performance Cookies",
    desc: "Collect information about how you use the platform to optimise speed and reliability.",
    example: "Load times, error rates, device type",
    required: false,
  },
]

const thirdPartyCookies = [
  {
    name: "Google Analytics",
    purpose: "Track and report website traffic and user behaviour",
    link: "https://policies.google.com/privacy",
  },
  {
    name: "Vercel Analytics",
    purpose: "Platform performance monitoring and usage analytics",
    link: "https://vercel.com/legal/privacy-policy",
  },
]

export default function CookiesPage() {
  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-400">
            <Cookie className="h-3.5 w-3.5" /> Cookie Notice
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Cookie <span className="gradient-text">Policy</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Understand how and why AptiCore uses cookies to improve your
            experience.
          </p>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Last updated: January 2025
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
          <h2 className="font-display mb-3 text-xl font-semibold">
            What Are Cookies?
          </h2>
          <p className="leading-relaxed text-[hsl(var(--muted-foreground))]">
            Cookies are small text files stored on your device by your web
            browser. They help us remember your preferences, understand how you
            use our platform, and deliver a personalised experience. Some
            cookies are necessary for the platform to function, while others
            help us improve our services.
          </p>
        </div>

        <h2 className="font-display mb-6 text-2xl font-bold">
          Types of Cookies We Use
        </h2>

        <div className="mb-12 grid gap-6">
          {cookieTypes.map((cookie) => (
            <div
              key={cookie.title}
              className="card-hover rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <cookie.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-display font-semibold">
                      {cookie.title}
                    </h3>
                    {cookie.required && (
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="mb-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {cookie.desc}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Example:
                    </span>{" "}
                    {cookie.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display mb-6 text-2xl font-bold">
          Third-Party Cookies
        </h2>

        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {thirdPartyCookies.map((tpc) => (
            <div
              key={tpc.name}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-sky-400" />
                <h3 className="font-display font-semibold">{tpc.name}</h3>
              </div>
              <p className="mb-3 text-sm text-[hsl(var(--muted-foreground))]">
                {tpc.purpose}
              </p>
              <a
                href={tpc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                View Privacy Policy{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display mb-2 text-lg font-semibold">
                Managing Cookies
              </h2>
              <p className="leading-relaxed text-[hsl(var(--muted-foreground))]">
                Most browsers allow you to control cookies through their
                settings. You can choose to block all cookies, delete existing
                ones, or receive a notification when a cookie is set. Please
                note that disabling essential cookies may affect the
                functionality of our platform. For more information, visit your
                browser's help section.
              </p>
              <p className="mt-4 leading-relaxed text-[hsl(var(--muted-foreground))]">
                If you have questions about our cookie practices, contact us at{" "}
                <a
                  href="mailto:support@apticore.com"
                  className="text-sky-400 hover:text-sky-300"
                >
                  support@apticore.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

