"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DeprecatedCategoryRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  useEffect(() => {
    // Safely redirect old pathname /dashboard/tests/{category}
    // to query-param URL: /dashboard/tests?category={category}
    if (slug === "runner") {
      router.replace("/dashboard/tests/runner")
    } else {
      router.replace(`/dashboard/tests?category=${encodeURIComponent(slug)}`)
    }
  }, [slug, router])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background font-[Inter,sans-serif] text-foreground">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
        <span>Redirecting to category practice tests...</span>
      </div>
    </div>
  )
}