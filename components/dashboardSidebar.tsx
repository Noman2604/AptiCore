"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"
import {
  Award,
  BarChart2,
  BookOpen,
  Bookmark,
  FileText,
  LayoutDashboard,
  LogOut,
  Trophy,
} from "lucide-react"

import { cn, getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

interface AppSidebarProps {
  user?: SidebarUser
}

const navGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "LEARNING",
    items: [
      {
        label: "Practice Tests",
        href: "/dashboard/tests",
        icon: BookOpen,
      },
      {
        label: "Bookmarks",
        href: "/dashboard/bookmark",
        icon: Bookmark,
      },
      {
        label: "History",
        href: "/dashboard/history",
        icon: FileText,
      },
    ],
  },
  {
    title: "PROGRESS",
    items: [
      {
        label: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Trophy,
      },
      {
        label: "Achievements & Badges",
        href: "/dashboard/achievements",
        icon: Award,
      },
    ],
  },
]

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const sidebarUser = user

  const handleLogout = async () => {
    try {
      setLoading(true)
      await axios.post("/api/auth/logout")
      toast.success("Logged out successfully")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to log out. Please try again.")
      setLoading(false)
    } finally {
      setLogoutConfirmOpen(false)
    }
  }

  const displayName = sidebarUser?.name || "Noman Patel"
  const displayRole = (sidebarUser?.role || "STUDENT").toUpperCase()

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false
    if (exact) {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        {/* Compact Header */}
        <SidebarHeader className="h-14 border-b border-sidebar-border px-3.5 py-0 flex flex-row items-center justify-between group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center">
          {/* Expanded Logo and Title */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 min-w-0 outline-hidden group-data-[collapsible=icon]:hidden select-none"
          >
            <Image
              src="/logo.png"
              alt="AptiCore Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover shrink-0"
              priority
            />
            <span className="font-sans text-[15px] font-bold tracking-tight text-sidebar-foreground truncate">
              AptiCore
            </span>
          </Link>

          {/* Desktop Collapsed Mode: Clickable Logo to Expand/Navigate */}
          <div className="hidden w-full items-center justify-center group-data-[collapsible=icon]:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label="Expand sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                >
                  <Image
                    src="/logo.png"
                    alt="AptiCore Logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                    priority
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarHeader>

        {/* Navigation Content */}
        <SidebarContent className="gap-0 bg-sidebar px-2 py-3 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
          {navGroups.map((group, groupIdx) => (
            <SidebarGroup
              key={group.title}
              className={cn(
                "p-0 group-data-[collapsible=icon]:p-0",
                groupIdx > 0 && "mt-5 group-data-[collapsible=icon]:mt-3"
              )}
            >
              <SidebarGroupLabel className="h-6 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 select-none group-data-[collapsible=icon]:hidden">
                {group.title}
              </SidebarGroupLabel>

              <SidebarGroupContent className="mt-1">
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href, item.exact)
                    return (
                      <SidebarMenuItem
                        key={item.href}
                        className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={cn(
                            "relative h-10 w-full rounded-lg px-3 text-sm transition-all select-none",
                            "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!",
                            active
                              ? "bg-linear-to-br from-emerald-500 to-emerald-600 font-semibold text-white shadow-xs hover:from-emerald-600 hover:to-emerald-700 data-[active=true]:bg-linear-to-br data-[active=true]:from-emerald-500 data-[active=true]:to-emerald-600 data-[active=true]:text-white dark:from-[#6ee7c9] dark:to-[#57c9a8] dark:text-[#06120d] dark:hover:from-[#65dcbe] dark:hover:to-[#4fc09f] dark:data-[active=true]:from-[#6ee7c9] dark:data-[active=true]:to-[#57c9a8] dark:data-[active=true]:text-[#06120d]"
                              : "border border-transparent font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Link
                            href={item.href}
                            className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center"
                            aria-current={active ? "page" : undefined}
                          >
                            <item.icon
                              className={cn(
                                "h-[18px] w-[18px] min-w-[18px] shrink-0",
                                active
                                  ? "stroke-[2] text-white dark:text-[#06120d]"
                                  : "stroke-[1.75] text-muted-foreground group-hover/menu-button:text-sidebar-accent-foreground"
                              )}
                            />
                            <span
                              className={cn(
                                "truncate font-sans group-data-[collapsible=icon]:hidden",
                                active
                                  ? "font-semibold text-white dark:text-[#06120d]"
                                  : "font-medium"
                              )}
                            >
                              {item.label}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* User Profile Section with Direct Profile Link & Logout Button */}
        <SidebarFooter className="mt-auto border-t border-sidebar-border bg-sidebar p-2.5">
          {/* Expanded Profile Card with direct Profile link & Logout button */}
          <div className="flex items-center justify-between gap-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-1.5 transition-colors hover:border-sidebar-border group-data-[collapsible=icon]:hidden">
            <Link
              href="/dashboard/profile"
              title="View Profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 rounded-lg p-1 -m-1 transition-colors hover:bg-sidebar-accent/60 outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring group/profile"
            >
              {/* Avatar with subtle online indicator */}
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sidebar-border bg-primary/10 text-xs font-semibold text-primary">
                {sidebarUser?.avatar ? (
                  <Image
                    src={sidebarUser.avatar}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{getInitials(displayName)}</span>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-sidebar" />
              </div>

              {/* Name & Role */}
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-xs font-semibold text-sidebar-foreground group-hover/profile:text-primary transition-colors">
                  {displayName}
                </span>
                <span className="truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  {displayRole}
                </span>
              </div>
            </Link>

            {/* Direct Logout Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(true)}
                  disabled={loading}
                  aria-label="Log out"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-hidden cursor-pointer"
                >
                  <LogOut className="h-4 w-4 stroke-[1.75]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Log out
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Collapsed Mode: Stacked Avatar Profile Link & Logout Button */}
          <div className="hidden flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/profile"
                  aria-label="View profile"
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sidebar-border bg-primary/10 text-xs font-semibold text-primary">
                    {sidebarUser?.avatar ? (
                      <Image
                        src={sidebarUser.avatar}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(displayName)}</span>
                    )}
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-sidebar" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {displayName} (Profile)
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(true)}
                  disabled={loading}
                  aria-label="Log out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 stroke-[1.75]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Log out
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Clean Modern Logout Confirmation Modal */}
      <Dialog
        open={logoutConfirmOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setLogoutConfirmOpen(open)
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-xl border border-sidebar-border bg-card p-5 text-card-foreground shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Log out of AptiCore
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Are you sure you want to log out? You will need to sign in again
              to access your dashboard.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutConfirmOpen(false)}
              disabled={loading}
              className="flex-1 rounded-lg text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
              className="flex-1 cursor-pointer rounded-lg text-xs font-medium"
            >
              {loading ? "Logging out..." : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
