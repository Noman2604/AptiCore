"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "@/components/dashboardSidebar"

interface User {
  name: string
  email: string
  role: string
  xp: number
  level: number
  streak: number
  avatar?: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me", {
          withCredentials: true,
        })

        setUser(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user!} />

      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
