"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const Page = () => {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function getAllCategories() {
      try {
        const res = await axios.get("/api/categories")
        setCategories(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllCategories()
  }, [])

  return (
    <div className="m-2 mt-20 sm:m-2 sm:p-6">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Choose a category to begin
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Browse category-based tests built from MongoDB content, then drill
          down into subcategories and live test questions.
        </p>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category._id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <Badge variant={category.isActive ? "default" : "destructive"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{category.description || "No description"}</p>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Sub Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.subcategories?.length > 0 ? (
                    category.subcategories.map((sub: any) => (
                      <Badge key={sub._id} variant="secondary">
                        {sub.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">No Subcategory</span>
                  )}
                </div>
              </div>

              {/* Go To Subcategory Button */}

              <Link
                href={`/dashboard/tests/${category.slug}`}
                className="block"
              >
                <Button className="w-full">
                  View Subcategories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
