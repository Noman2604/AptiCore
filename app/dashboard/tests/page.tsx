"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Subcategory {
  _id: string
  name: string
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  subcategories?: Subcategory[]
}

const CATEGORY_ACCENTS = ["#6ee7c9", "#8b7cf6", "#f5a623", "#f2555a", "#3ecf8e"]

function accentFor(index: number) {
  return CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length]
}

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getAllCategories() {
      try {
        setLoading(true)
        const res = await axios.get("/api/categories")
        setCategories(res.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getAllCategories()
  }, [])

  return (
    <div
      className="min-h-screen bg-[#f4f4f4] dark:bg-[#16191f] font-[Inter,sans-serif] dark:text-[#e7ecf3] text-[#2e2e2e] transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-2 pb-10 sm:px-6 sm:pt-5 lg:px-5">
        <div className="max-w-2xl">
          <h1 className="mt-1 font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl">
            Choose a category to begin
          </h1>
          <p className="mt-2.5 text-[14.5px] leading-6 text-muted-foreground sm:text-[15px]">
            Browse category-based tests built from your question bank, then
            drill down into subcategories and live test questions.
          </p>
        </div>

        {loading && (
          <div className="mt-10 flex items-center gap-2.5 font-[JetBrains_Mono,monospace] text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
            Loading categories...
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No categories found yet.
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const accent = accentFor(index)
            return (
              <div
                key={category._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-[#37465a]"
              >
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-[Space_Grotesk,sans-serif] text-[17px] font-bold">
                      {category.name}
                    </h2>
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10px] font-semibold tracking-wider uppercase"
                      style={
                        category.isActive
                          ? {
                              color: "#3ecf8e",
                              borderColor: "rgba(62,207,142,0.35)",
                              backgroundColor: "rgba(62,207,142,0.08)",
                            }
                          : {
                              color: "#f2555a",
                              borderColor: "rgba(242,85,90,0.35)",
                              backgroundColor: "rgba(242,85,90,0.08)",
                            }
                      }
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Description
                    </p>
                    <p className="mt-1 text-[13.5px] leading-6 dark:text-[#c3cbd8]  text-[#2e2e2e]">
                      {category.description || "No description"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Sub Categories
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.subcategories?.length ? (
                        category.subcategories.map((sub) => (
                          <span
                            key={sub._id}
                            className="rounded-full border border-border bg-muted px-2.5 py-1 font-[JetBrains_Mono,monospace] text-[10.5px] text-muted-foreground"
                          >
                            {sub.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[12.5px] text-muted-foreground">
                          No subcategory
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1" />

                  <Link
                    href={`/dashboard/tests/${category.slug}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] py-2.75 text-[13.5px] font-bold text-[#06120d] transition hover:brightness-105"
                  >
                    View Subcategories
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Page