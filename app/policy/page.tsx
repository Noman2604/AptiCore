"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Shield,
  Lock,
  Database,
  Cookie,
  UserCheck,
  Mail,
  FileText,
  AlertTriangle,
  Fingerprint,
  Globe,
} from "lucide-react"

const sections = [
  {
    icon: Shield,
    title: "Information We Collect",
    content:
      "We collect information you provide directly when you create an account, take tests, upload a profile picture, or contact us. This includes your name, email address, college name, and academic details. We also collect information automatically, such as your IP address, browser type, device information, and usage patterns when you interact with our platform.",
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content:
      "Your information is used to personalise your learning experience, track your progress, generate performance analytics, improve our content, send important account updates, and provide customer support. We also use aggregated, anonymised data for research and product improvement purposes.",
  },
  {
    icon: UserCheck,
    title: "Data Sharing & Disclosure",
    content:
      "We do not sell your personal data to third parties. We may share anonymised aggregate data with educational institutions or partners for reporting purposes. We may disclose your information if required by law, to enforce our terms, or to protect the rights and safety of our users and platform.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content:
      "We use cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and understand where our users come from. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the platform.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "We implement industry-standard security measures including encryption in transit and at rest, secure authentication protocols, and regular security audits. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security of your data.",
  },
  {
    icon: Fingerprint,
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal data at any time through your account settings. You can request a copy of your data, object to processing, or withdraw consent where applicable. To exercise these rights, contact us at support@apticore.com.",
  },
  {
    icon: Globe,
    title: "Third-Party Services",
    content:
      "Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We recommend reviewing their privacy policies before providing any personal information.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy or our data practices, please reach out to us at support@apticore.com or write to us at AptiCore, Mumbai, Maharashtra, India.",
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-400">
            <Shield className="h-3.5 w-3.5" /> Legal
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Your privacy matters to us. Learn how AptiCore collects, uses, and
            protects your personal data.
          </p>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="card-hover rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display mb-2 text-lg font-semibold">
                    {index + 1}. {section.title}
                  </h2>
                  <p className="leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

