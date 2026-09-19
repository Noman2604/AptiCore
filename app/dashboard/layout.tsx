"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { LogOut, User, FileText, Play, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/dashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ThemeProvider, useTheme } from "next-themes"
import { getInitials } from "@/lib/utils"
import { AvatarFrame, resolveAvatarBorder } from "@/components/ui/game-avatar"

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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <div className="h-4 w-4 rounded-full border border-[#8a96a8]" />
      </div>
    )
  }

  const currentTheme = theme === "dark" ? "dark" : "light"

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  return (
    <AnimatedThemeToggler
      theme={currentTheme}
      onThemeChange={toggleTheme}
      variant="circle"
      className="flex h-9 w-9 items-center justify-center rounded-full text-[--ac-text-2] transition-colors hover:bg-[--ac-hover] hover:text-[--ac-text] cursor-pointer outline-none"
    />
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState<SidebarUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      setLoadingUser(true)

      const [profileRes, authRes] = await Promise.all([
        axios.get("/api/profile", { withCredentials: true }),
        axios.get("/api/auth/me", { withCredentials: true }),
      ])

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
    } finally {
      setLoadingUser(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await axios.post("/api/auth/logout")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoggingOut(false)
      setLogoutConfirmOpen(false)
    }
  }

  useEffect(() => {
    fetchUser()

    const handleBorderUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setCurrentUser((prev) => (prev ? { ...prev, avatarBorder: customEvent.detail } : prev))
      }
    }
    window.addEventListener("apticore_avatar_border_changed", handleBorderUpdate)
    return () => window.removeEventListener("apticore_avatar_border_changed", handleBorderUpdate)
  }, [])

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
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-black/10 dark:border-white/10 bg-slate-100 dark:bg-[#0a0e14] px-3 sm:px-4">
            {/* Left: Sidebar toggle + Mobile Logo */}
            <div className="flex items-center gap-2.5">
              <SidebarTrigger className="h-8 w-8 text-[--ac-text-2] hover:bg-[--ac-hover] hover:text-[--ac-text] transition cursor-pointer" />
              
              {/* Mobile / Tablet Logo */}
              <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                <Image
                  src="/logo.png"
                  alt="AptiCore Platform Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="font-[Space_Grotesk,sans-serif] text-[15px] font-bold text-[--ac-text]">
                  AptiCore
                </span>
              </Link>
            </div>

            {/* Right: Start Test, Notification, Theme, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    title="Notifications"
                    className="relative flex h-9 w-9 items-center justify-center  text-[--ac-text-2] transition-colors hover:bg-[--ac-hover] hover:text-[--ac-text] outline-none cursor-pointer"
                  >
                    <Bell className="h-4.5 w-4.5" />
                  </button>
                </PopoverTrigger>
              </Popover>

              {/* Theme Toggler */}
              <ThemedToggler />

              {/* User Profile Pill Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2.5 rounded-sm border-black/10 dark:border-white/15 bg-transparent py-1 pl-1 pr-3 sm:pr-4 transition outline-none hover:bg-[--ac-hover] cursor-pointer select-none"
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
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] text-xs font-bold text-[#08110d]">
                          {getInitials(currentUser?.name || "User")}
                        </div>
                      )}
                    </AvatarFrame>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#10151d] p-1.5 shadow-xl text-[--ac-text]"
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
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] text-xs font-bold text-[#08110d]">
                            {getInitials(currentUser?.name || "User")}
                          </div>
                        )}
                      </AvatarFrame>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[--ac-text]">
                          {currentUser?.name || "User"}
                        </p>
                        <p className="truncate text-[11px] font-normal text-[--ac-text-3]">
                          {currentUser?.email || ""}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                 <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-[--ac-hover]"
                  >
                    <User className="h-4 w-4 text-[--ac-teal]" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/history")}
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-[--ac-hover]"
                  >
                    <FileText className="h-4 w-4 text-[--ac-teal]" />
                    History
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

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
