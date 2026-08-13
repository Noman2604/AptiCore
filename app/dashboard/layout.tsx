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
      <div
        className="flex min-h-screen items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
        }}
      >
        <div className="flex items-center gap-2.5 font-[JetBrains_Mono,monospace] text-sm text-[#8a96a8]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
          Loading...
        </div>
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
