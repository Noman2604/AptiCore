"use client"

import { useState } from "react"
import axios from "axios"
import { CheckCircle2, Star, XCircle } from "lucide-react"
import { Label } from "./ui/label"
type FeedbackType = "feedback" | "comment"
type TargetType = "question" | "test" | "result" | "page" | "platform"

interface FeedbackFormProps {
  targetType?: TargetType
  targetId?: string
  feedbackType?: FeedbackType
  titleLabel?: string
  description?: string
  onSubmitted?: () => void
}

const RATING_OPTIONS = [
  { value: "", label: "No rating" },
  { value: "1", label: "1 - Poor" },
  { value: "2", label: "2 - Fair" },
  { value: "3", label: "3 - Okay" },
  { value: "4", label: "4 - Good" },
  { value: "5", label: "5 - Excellent" },
]

export default function FeedbackForm({
  targetType = "platform",
  targetId,
  feedbackType = "feedback",
  titleLabel = "Share your feedback",
  description = "Tell us what is working well and what should improve.",
  onSubmitted,
}: FeedbackFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState<number | "">("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await axios.post("/api/feedback", {
        feedbackType,
        targetType,
        targetId,
        title: title.trim() || undefined,
        content: content.trim(),
        rating: rating === "" ? undefined : rating,
        isAnonymous,
        isPublic,
      })

      setTitle("")
      setContent("")
      setRating("")
      setIsAnonymous(false)
      setIsPublic(true)
      setSuccess("Thanks. Your feedback was submitted successfully.")
      onSubmitted?.()
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || "Failed to submit feedback"
        : "Failed to submit feedback"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label
          htmlFor="feedback-title"
          className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase"
        >
          Title
        </label>
        <input
          id="feedback-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Optional short title"
          maxLength={120}
          className="w-full rounded-lg border border-[#212a37] bg-[#141b25] px-3.5 py-2.5 text-[13.5px] text-[#e7ecf3] transition outline-none placeholder:text-[#5b6577] focus:border-[#6ee7c9]"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="feedback-content"
          className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase"
        >
          Message
        </label>
        <textarea
          id="feedback-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Describe the issue, suggestion, or comment"
          rows={6}
          maxLength={2000}
          required
          className="w-full resize-y rounded-lg border border-[#212a37] bg-[#141b25] px-3.5 py-2.5 text-[13.5px] text-[#e7ecf3] transition outline-none placeholder:text-[#5b6577] focus:border-[#6ee7c9]"
        />
        <div className="text-right font-[JetBrains_Mono,monospace] text-[10px] text-[#5b6577]">
          {content.length}/2000
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2 ">
          <Label>Rating</Label> 

          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    typeof rating === "number" && rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {rating ? `${rating} / 5` : "Click a star to rate"}
          </p>
        </div>

        <div className="space-y-2">
          <span className="block font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase">
            Visibility
          </span>
          <div className="flex justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#c3cbd8]">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
                className="h-4 w-4 rounded border-[#212a37] bg-[#141b25] accent-[#6ee7c9]"
              />
              Submit anonymously
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#c3cbd8]">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
                className="h-4 w-4 rounded border-[#212a37] bg-[#141b25] accent-[#6ee7c9]"
              />
              Make public
            </label>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-[rgba(62,207,142,0.3)] bg-[rgba(62,207,142,0.1)] px-3.5 py-2.5 text-[13px] text-[#3ecf8e]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[rgba(242,85,90,0.3)] bg-[rgba(242,85,90,0.1)] px-3.5 py-2.5 text-[13px] text-[#f2555a]">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-2.75 text-[13.5px] font-bold text-[#06120d] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit feedback"}
      </button>
    </form>
  )
}
