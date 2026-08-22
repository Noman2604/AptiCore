"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Award,
  BarChart2,
  BookOpen,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Trophy,
  UserRound,
  FileText,
} from "lucide-react"
import axios from "axios"
import Image from "next/image"
import { getInitials } from "@/lib/utils"
import { Button } from "./ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

// Profile, History, and Feedback have been removed from nav items
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Practice Tests", href: "/dashboard/tests", icon: BookOpen },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { label: "Achievements", href: "/dashboard/achievements", icon: Award },
]

const bottomItems = [
  { label: "Admin Panel", href: "/admin", icon: Shield, adminOnly: true },
]

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

interface AppSidebarProps {
  user?: SidebarUser
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: value > 9999 ? "compact" : "standard",
  }).format(value)

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [sidebarUser, setSidebarUser] = useState(user)

  // Sync parent prop into local state after async fetch completes
  useEffect(() => {
    setSidebarUser(user)
  }, [user])

  const handleLogout = async () => {
    try {
      setLoading(true)
      await axios.post("/api/auth/logout")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      setLoading(false)
    } finally {
      setLogoutConfirmOpen(false)
    }
  }
  const name = sidebarUser?.name || "User"
  const level = sidebarUser?.level || 1
  const totalXP = sidebarUser?.totalXP ?? sidebarUser?.xp ?? 0
  const streak = sidebarUser?.currentStreak ?? sidebarUser?.streak ?? 0
  const xpPerLevel = 500
  const levelProgress = Math.min(
    ((totalXP % xpPerLevel) / xpPerLevel) * 100,
    100
  )
  const isAdmin =
    sidebarUser?.role === "admin" || sidebarUser?.role === "super_admin"

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        className="border-[--ac-border] bg-[--ac-bg] text-[--ac-text]"
      >
        {/* Brand */}
        <SidebarHeader className="border-b border-[--ac-border] bg-[--ac-bg] px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              loading="lazy"
              src="/logo.ico"
              alt="AptiCore Logo"
              width={32}
              height={32}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <span className="block font-[Space_Grotesk,sans-serif] text-[15px] leading-5 font-bold text-[--ac-text]">
                AptiCore
              </span>
            </div>
          </Link>
        </SidebarHeader>

        {/* Nav */}
        <SidebarContent className="bg-[--ac-bg] px-2 py-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const active = isActive(item.href, item.exact)
                  return (
                    <SidebarMenuItem key={item.href} className="mb-4">
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={
                          active
                            ? "border border-[--ac-teal-border] bg-[--ac-teal-muted] text-[--ac-teal] hover:bg-[--ac-teal-muted] hover:text-[--ac-teal]"
                            : "text-[--ac-text-2] hover:bg-[--ac-hover] hover:text-[--ac-text]"
                        }
                      >
                        <Link href={item.href} className="text-6 font-medium">
                          <item.icon
                            className={` ${active ? "text-[--ac-teal]" : "text-[--ac-text-2]"}`}
                          />
                          <span>{item.label}</span>
                          {active && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[--ac-teal]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Bottom items + logout */}
        <SidebarFooter className="border-t border-[--ac-border] bg-[--ac-bg] px-2 pt-3 pb-4">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className=" flex gap-2 text-[--ac-text] hover:bg-[--ac-hover] data-[state=open]:bg-[--ac-hover]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] font-[Space_Grotesk,sans-serif] text-[12px] font-bold text-[#08110d]">
                    {sidebarUser?.avatar ? (
                      <img
                        src={sidebarUser?.avatar}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    ) : (
                      getInitials(name)
                    )}
                  </div>
                  <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-[13px] font-semibold text-[--ac-text]">
                      {sidebarUser?.name}
                    </span>
                    <span className="flex items-center gap-1.5 truncate font-[JetBrains_Mono,monospace] text-[10.5px] text-[--ac-text-3]">
                      {sidebarUser?.role.toUpperCase()}
                    </span>
                  </div>
                  <button
                    disabled={loading}
                    onClick={() => setLogoutConfirmOpen(true)}
                    className="cursor-pointer text-[13.5px] p-2 flex items-center justify-center rounded-sm dark:hover:bg-red-300/30 bg-transparent hover:bg-slate-300 text-[#f2555a]/90 focus:text-[#ea0910]"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                  </button>
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Logout confirm modal */}
      {logoutConfirmOpen && (
        <Dialog
          open={logoutConfirmOpen}
          onOpenChange={(open) => {
            if (!loading) {
              setLogoutConfirmOpen(open)
            }
          }}
        >
          <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-2xl text-[--ac-text] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <DialogHeader>
              <DialogTitle className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[--ac-text]">
                Logout?
              </DialogTitle>

              <DialogDescription className="mt-1.5 text-[13px] leading-6 text-[--ac-text-2]">
                Are you sure you want to logout?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-3 flex flex-row gap-2.5 sm:justify-end">
              <Button
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={loading}
                className="flex-1 rounded-sm border border-[--ac-border] bg-transparent hover:bg-slate-300 py-2.5 text-[13.5px] font-semibold text-slate-900 dark:text-slate-100 transition duration-300 ease-in-out dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 rounded-sm border border-[#920a0e] bg-linear-to-br from-[#f13339] to-[#d43f44] dark:hover:from-[#cb191f] dark:hover:to-[#920a0e] cursor-pointer  py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>  
        </Dialog>
      )}
    </>
  )
}
