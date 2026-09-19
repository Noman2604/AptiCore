"use client"

import { useEffect, useState, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { GA_TRACKING_ID, pageview, hasAnalyticsConsent } from "@/lib/analytics"

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

export default function Analytics() { 
  const [consentGranted, setConsentGranted] = useState(false)

  useEffect(() => {
    setConsentGranted(hasAnalyticsConsent())

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ consent: string }>
      setConsentGranted(customEvent.detail?.consent === "all")
    }

    window.addEventListener("apticore-cookie-consent", handleConsentChange)
    return () => {
      window.removeEventListener(
        "apticore-cookie-consent",
        handleConsentChange
      )
    }
  }, [])

  if (!GA_TRACKING_ID || !consentGranted) {
    return (
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    )
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  )
}
