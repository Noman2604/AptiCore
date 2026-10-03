"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DeprecatedSubSlugTestRedirect({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>
}) {
  const { slug, subSlug } = use(params)
  const router = useRouter()

  useEffect(() => {
    // Safely redirect old pathname /dashboard/tests/{category}/{subcategory}
    // to the unified query-parameter runner URL: /dashboard/tests/runner?category={category}&subcategory={subcategory}
    router.replace(
      `/dashboard/tests/runner?category=${encodeURIComponent(slug)}&subcategory=${encodeURIComponent(subSlug)}`
    )
  }, [slug, subSlug, router])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background font-[Inter,sans-serif] text-foreground">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
        <span>Redirecting to test session...</span>
      </div>
    </div>
  )
}
