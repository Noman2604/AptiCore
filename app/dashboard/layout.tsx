"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { LogOut, User, FileText } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
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
import { ThemeProvider, useTheme } from "next-themes"
type SidebarUser = {
  name: string
  email: string
  role: string
  avatar?: string
  xp?: number
  totalXP?: number
  level?: number
  streak?: number
  currentStreak?: number
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
function ThemedToggler() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-8 w-8 items-center justify-center">
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
      className="flex h-8 w-8 items-center justify-center rounded-md text-[--ac-text-2] transition-colors hover:bg-[--ac-hover] hover:text-[--ac-teal]"
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
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const breadcrumbItems = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, segments) => {
      const href = "/" + segments.slice(0, index + 1).join("/")

      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())

      return {
        label,
        href,
        isCurrent: index === segments.length - 1,
      }
    })

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

  useEffect(() => {
    fetchUser()
    setMounted(true)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className="flex min-h-screen ">
        <AppSidebar user={currentUser || undefined} />

        <main className="flex min-h-svh w-full flex-col">
          {/* Mobile Header */}
          <div className="sticky top-0 z-50 flex items-center bg-slate-100 dark:bg-[#0a0e14] justify-between gap-3 border-b border-black/10 dark:border-white/20 px-0 py-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="border-none text-[--ac-text] hover:bg-[--ac-hover] hover:text-[--ac-teal]" />
              <Breadcrumb className="min-w-0">
                <BreadcrumbList className="flex-nowrap text-xs sm:text-sm">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className="text-[--ac-text-2] hover:text-[--ac-teal]"
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {breadcrumbItems
                    .filter((item) => item.label !== "Dashboard")
                    .map((item) => (
                      <div
                        key={item.href}
                        className="flex min-w-0 items-center"
                      >
                        <BreadcrumbSeparator className="mx-2 text-[--ac-border-2]" />

                        <BreadcrumbItem className="min-w-0">
                          {item.isCurrent ? (
                            <BreadcrumbPage className="truncate font-semibold text-[--ac-text]">
                              {item.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={item.href}
                              className="truncate text-[--ac-text-2] hover:text-[--ac-teal]"
                            >
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center justify-end gap-2">
              <ThemedToggler />
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xs px-2 py-1.5 transition outline-none hover:bg-[--ac-hover]"
                    >
                      {/* Name */}
                      <div className="hidden max-w-32 text-left sm:block">
                        <p className="truncate text-[13px] font-semibold text-[--ac-text]">
                          {loadingUser
                            ? "Loading..."
                            : currentUser?.name || "User"}
                        </p>

                        <p className="truncate text-[11px] text-[--ac-text-3]">
                          {currentUser?.email || ""}
                        </p>
                      </div>
                      {/* Avatar */}
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[--ac-border-2] bg-[--ac-surface]">
                        {currentUser?.avatar ? (
                          <Image
                            src={currentUser.avatar}
                            alt={currentUser.name || "User"}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[--ac-teal]">
                            {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="border-[--ac-border]x w-64 p-1.5 text-[--ac-text]"
                  >
                    <DropdownMenuLabel className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[--ac-border-2]">
                          {currentUser?.avatar ? (
                            <Image
                              src={currentUser.avatar}
                              alt={currentUser.name || "User"}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-[--ac-teal]">
                              {currentUser?.name?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold">
                            {currentUser?.name || "User"}
                          </p>

                          <p className="truncate text-[11px] font-normal text-[--ac-text-3]">
                            {currentUser?.email || ""}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/profile")}
                      className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    >
                      <User className="h-4 w-4 text-[#6ee7c9]" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/history")}
                      className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    >
                      <FileText className="h-4 w-4 text-[#6ee7c9]" />
                      History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}
