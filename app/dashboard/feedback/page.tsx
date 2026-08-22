"use client"

import { MessageSquareHeart, Sparkles } from "lucide-react"

import FeedbackForm from "@/components/feedbackForm"

export default function DashboardFeedbackPage() {
  return (
    <div
      className="min-h-screen bg-[#f4f4f4] dark:bg-[#16191f] font-[Inter,sans-serif] text-foreground transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-2 pb-12 sm:px-6 md:pt-8 lg:px-8">
        {/* Header */}
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(139,124,246,0.3)] bg-[rgba(139,124,246,0.1)] px-3.5 py-1.5 font-[JetBrains_Mono,monospace] text-[11px] font-semibold tracking-wide text-[#8b7cf6] uppercase">
            <MessageSquareHeart className="h-3.5 w-3.5" />
            We're listening
          </div>
          <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl">
            Feedback
          </h1>
          <p className="mt-2 text-[13.5px] leading-6 text-muted-foreground">
            Share suggestions, report issues, or leave comments about
            AptiCore.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 transition-colors duration-300">
          <div className="mb-5 flex items-start gap-3 border-b border-border pb-5">
            <div className="rounded-lg border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] p-2.5 text-[#6ee7c9]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold">
                Send platform feedback
              </h2>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                This is visible to the AptiCore team and helps us improve the
                product.
              </p>
            </div>
          </div>

          <FeedbackForm
            targetType="platform"
            feedbackType="feedback"
            titleLabel="Send platform feedback"
            description="This is visible to the AptiCore team and helps us improve the product."
          />
        </div>
      </div>
    </div>
  )
}