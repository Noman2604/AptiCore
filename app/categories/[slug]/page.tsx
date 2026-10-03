"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CategoryPathRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      router.replace(`/categories?type=${encodeURIComponent(slug)}`)
    } else {
      router.replace("/categories")
    }
  }, [slug, router])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[--ac-bg] font-[Inter,sans-serif] text-[--ac-text]">
      <div className="flex items-center gap-2.5 text-sm text-[--ac-text-2]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#6ee7c9]" />
        <span>Loading category...</span>
      </div>
    </div>
  )
}
