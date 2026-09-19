// Client-side analytics helper

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false
  const consent = localStorage.getItem("apticore_cookie_consent")
  return consent === "all"
}

export function pageview(url: string) {
  if (typeof window === "undefined") return
  if (!hasAnalyticsConsent()) return

  if (GA_TRACKING_ID && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export function trackEvent({
  action,
  category,
  label,
  value,
}: {
  action: string
  category?: string
  label?: string
  value?: number
}) {
  if (typeof window === "undefined") return
  if (!hasAnalyticsConsent()) return

  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
