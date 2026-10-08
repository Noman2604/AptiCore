"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { LogOut, User, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/dashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ThemeToggle from "@/components/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "next-themes"
import { toast } from "sonner"
import { getInitials } from "@/lib/utils"
import { AvatarFrame, resolveAvatarBorder } from "@/components/ui/game-avatar"
import NotificationBell from "@/components/notifications/NotificationBell"

type SidebarUser = {
  name: string
  email: string
  role: string
  avatar?: string
  avatarBorder?: string
  xp?: number
  totalXP?: number
  level?: number
  streak?: number
  currentStreak?: number
}

function ThemedToggler() {
  return (
    <ThemeToggle className="h-9 w-9 rounded-full" />
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState<SidebarUser | null>(null)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        const [profileRes, authRes] = await Promise.all([
          axios.get("/api/profile", { withCredentials: true }),
          axios.get("/api/auth/me", { withCredentials: true }),
        ])

        if (!isMounted) return

        const profileData = profileRes?.data?.data || {}
        const authData = authRes?.data?.data || {}

        setCurrentUser({
          name: authData.name || "",
          email: authData.email || "",
          role: authData.role || "",
          avatar: profileData.avatarUrl,
          avatarBorder: profileData.avatarBorder || "basic",
          xp: profileData.totalXP,
          totalXP: profileData.totalXP,
          level: profileData.level,
          streak: profileData.currentStreak,
          currentStreak: profileData.currentStreak,
        })
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    void loadUser()

    const handleBorderUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setCurrentUser((prev) => (prev ? { ...prev, avatarBorder: customEvent.detail } : prev))
      }
    }
    window.addEventListener("apticore_avatar_border_changed", handleBorderUpdate)
    return () => {
      isMounted = false
      window.removeEventListener("apticore_avatar_border_changed", handleBorderUpdate)
    }
  }, [])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await axios.post("/api/auth/logout")
      toast.success("Logged out successfully")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to log out. Please try again.")
    } finally {
      setLoggingOut(false)
      setLogoutConfirmOpen(false)
    }
  }

  const userRole = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : "Student"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className="flex min-h-screen">
        <AppSidebar user={currentUser || undefined} />

        <main className="flex min-h-svh w-full flex-col">
          {/* Top Navbar Header */}
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-3 sm:px-6">
            {/* Left: Sidebar toggle + Mobile Logo */}
            <div className="flex items-center gap-2.5">
              <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground transition cursor-pointer rounded-md" />
              
              {/* Mobile / Tablet Logo */}
              <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                <Image
                  src="/logo.png"
                  alt="AptiCore Platform Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
                  AptiCore
                </span>
              </Link>
            </div>

            {/* Right: Start Test, Notification, Theme, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <NotificationBell />

              {/* Theme Toggler */}
              <ThemedToggler />

              {/* User Profile Pill Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2.5 rounded-md border border-border/40 bg-card py-1 pl-1 pr-3 sm:pr-3.5 transition outline-none hover:border-border cursor-pointer select-none"
                  >
                    {/* Avatar with Game Border */}
                    <AvatarFrame
                      border={resolveAvatarBorder(currentUser?.avatarBorder, currentUser?.level)}
                      size="xs"
                      shape="rounded"
                    >
                      {currentUser?.avatar ? (
                        <Image
                          src={currentUser.avatar}
                          alt={currentUser.name || "User"}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {getInitials(currentUser?.name || "User")}
                        </div>
                      )}
                    </AvatarFrame>
                    <span className="hidden sm:inline-block text-xs font-medium text-foreground max-w-[100px] truncate">
                      {currentUser?.name?.split(" ")[0] || "Profile"}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 rounded-xl border border-border bg-card p-1.5 shadow-xl text-card-foreground"
                >
                  <DropdownMenuLabel className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <AvatarFrame
                        border={resolveAvatarBorder(currentUser?.avatarBorder, currentUser?.level)}
                        size="sm"
                        shape="rounded"
                      >
                        {currentUser?.avatar ? (
                          <Image
                            src={currentUser.avatar}
                            alt={currentUser.name || "User"}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {getInitials(currentUser?.name || "User")}
                          </div>
                        )}
                      </AvatarFrame>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-foreground">
                          {currentUser?.name || "User"}
                        </p>
                        <p className="truncate text-[11px] font-normal text-muted-foreground">
                          {currentUser?.email || ""}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {userRole}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent text-foreground"
                  >
                    <User className="h-4 w-4 text-emerald-500" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/history")}
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent text-foreground"
                  >
                    <FileText className="h-4 w-4 text-emerald-500" />
                    History
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    onClick={() => setLogoutConfirmOpen(true)}
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1">{children}</div>
        </main>
      </SidebarProvider>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] text-[--ac-text] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Confirm Logout</DialogTitle>
            <DialogDescription className="text-xs text-[--ac-text-3]">
              Are you sure you want to log out of your AptiCore account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              disabled={loggingOut}
              onClick={() => setLogoutConfirmOpen(false)}
              className="text-[--ac-text-2] hover:bg-[--ac-hover]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loggingOut}
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
