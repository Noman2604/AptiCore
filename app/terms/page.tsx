"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  FileText,
  UserPlus,
  LogIn,
  BookOpen,
  AlertCircle,
  Scale,
  Ban,
  Mail,
} from "lucide-react"

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By creating an account or using AptiCore in any way, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of the platform immediately. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.",
  },
  {
    icon: UserPlus,
    title: "Account Registration",
    content:
      "You must provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.",
  },
  {
    icon: LogIn,
    title: "User Conduct & Responsibilities",
    content:
      "You agree to use AptiCore only for lawful purposes and in a way that does not infringe the rights of others. Prohibited activities include cheating, exploiting platform vulnerabilities, impersonating others, uploading malicious content, spamming, and any form of academic dishonesty.",
  },
  {
    icon: BookOpen,
    title: "Intellectual Property",
    content:
      "All content on AptiCore — including questions, explanations, design, code, graphics, and branding — is the intellectual property of AptiCore unless otherwise stated. You may not reproduce, distribute, modify, or create derivative works without our explicit written consent.",
  },
  {
    icon: AlertCircle,
    title: "Test & Performance Rules",
    content:
      "Tests are provided for personal educational use only. You may not share test content, answers, or screenshots with others. Any attempt to manipulate scoring systems, use automated tools during tests, or engage in unfair practices may result in account suspension or permanent ban.",
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    content:
      "AptiCore is provided on an 'as is' and 'as available' basis. We make no warranties regarding uninterrupted access, accuracy of content, or fitness for a particular purpose. In no event shall AptiCore be liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
  },
  {
    icon: Ban,
    title: "Termination",
    content:
      "We reserve the right to suspend or terminate your account at our discretion, particularly for violations of these terms. Upon termination, your access to the platform will cease immediately. You may also delete your account at any time through your account settings.",
  },
  {
    icon: Mail,
    title: "Contact & Disputes",
    content:
      "For any questions or disputes regarding these terms, please contact us at support@apticore.com. These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
  },
]

export default function TermsPage() {
  return (
    <div className="dark min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
            <FileText className="h-3.5 w-3.5" /> Legal Agreement
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold sm:text-5xl">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Please read these terms carefully before using the AptiCore platform.
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
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

