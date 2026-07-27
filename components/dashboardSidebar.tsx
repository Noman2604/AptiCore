"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Award,
  BarChart2,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Trophy,
  User,
  X,
  FileText,
} from "lucide-react"
import axios from "axios"

import { cn, getInitials } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "Practice Tests", href: "/dashboard/tests", icon: BookOpen },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Achievements", href: "/dashboard/achievements", icon: Award },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "History", href: "/dashboard/history", icon: FileText },
]

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
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

interface SidebarProps {
  user?: SidebarUser
}

interface SidebarContentProps {
  user?: SidebarUser
  pathname: string
  loading: boolean
  onLogout: () => void
  onNavigate?: () => void
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: value > 9999 ? "compact" : "standard",
  }).format(value)

function SidebarContent({
  user,
  pathname,
  loading,
  onLogout,
  onNavigate,
}: SidebarContentProps) {
  const level = user?.level || 1
  const totalXP = user?.totalXP ?? user?.xp ?? 0
  const streak = user?.currentStreak ?? user?.streak ?? 0
  const xpPerLevel = 500
  const levelProgress = Math.min(
    ((totalXP % xpPerLevel) / xpPerLevel) * 100,
    100
  )
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex h-full flex-col ">
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-4 py-5">
        <Image
          src="/logo.png"
          alt="AptiCore Logo"
          width={28}
          height={28}
          className="h-7 w-7 rounded-lg"
        />
        <div className="min-w-0">
          <span className="font-display gradient-text block text-lg leading-5 font-bold">
            AptiCore
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Practice hub
          </span>
        </div>
      </div>

      {user && (
        <div className="px-3 py-4">
          <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-linear-to-br from-slate-950/90 via-slate-900/95 to-slate-950/90 p-px shadow-[0_24px_80px_-40px_rgba(15,23,42,0.9)]">
            <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-r from-sky-400/20 via-cyan-400/20 to-fuchsia-500/20 blur-3xl" />
            <div className="rounded-[1 rem] relative bg-[hsl(var(--card))]/95 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-sky-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg ring-2 shadow-sky-500/20 ring-white/10">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-white">
                    {user.name}
                  </div>
                  <div className="truncate text-sm text-white ">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="mt-1 rounded-xl bg-[hsl(var(--background))]/70 p-2">
                <div className="mb-3 flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="font-medium text-white">
                    Lv. {level}
                  </span>
                  <span className="text-white">{formatNumber(totalXP)} XP</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-sky-400 to-fuchsia-500 transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "border border-sky-500/20 bg-sky-500/15 text-sky-400 shadow-sm"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  active
                    ? "text-sky-400"
                    : "group-hover:text-[hsl(var(--foreground))]"
                )}
              />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-[hsl(var(--border))] px-2 pt-3 pb-4">
        {bottomItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const active = isActive(item.href, item.href === "/admin")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[hsl(var(--surface-hover))] text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={loading}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onLogout} disabled={loading}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sidebarUser, setSidebarUser] = useState(user)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const loadProfileDetails = async () => {
      if (!user) {
        setSidebarUser(undefined)
        return
      }

      try {
        const [profileRes, authRes] = await Promise.all([
          axios
            .get("/api/profile", { withCredentials: true })
            .catch(() => ({ data: { data: null } })),
          axios
            .get("/api/auth/me", { withCredentials: true })
            .catch(() => ({ data: { data: null } })),
        ])

        if (!isMounted) return

        const profileData = profileRes?.data?.data || {}
        const authData = authRes?.data?.data || {}

        setSidebarUser({
          name: authData.name || user.name || "User",
          email: authData.email || user.email || "",
          role: authData.role || user.role || "user",
          avatar: profileData.avatarUrl || user.avatar,
          xp: profileData.totalXP ?? user.xp ?? 0,
          totalXP: profileData.totalXP ?? user.totalXP ?? user.xp ?? 0,
          level: profileData.level ?? user.level ?? 1,
          streak:
            profileData.currentStreak ?? user.currentStreak ?? user.streak ?? 0,
          currentStreak:
            profileData.currentStreak ?? user.currentStreak ?? user.streak ?? 0,
        })
      } catch (error) {
        console.error("Failed to load sidebar profile", error)
        if (isMounted) {
          setSidebarUser(user)
        }
      }
    }

    void loadProfileDetails()

    return () => {
      isMounted = false
    }
  }, [user])

  const handleLogout = async () => {
    try {
      setLoading(true)
      await axios.post("/api/auth/logout")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      setLoading(false)
    }
  }

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-full flex-col border-r border-[hsl(var(--border))]  shadow-xl shadow-black/5 transition-all duration-300 lg:flex",
          "w-64"
        )}
      >
        <SidebarContent
          user={sidebarUser}
          pathname={pathname}
          loading={loading}
          onLogout={handleLogout}
        />
      </aside>

      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-[hsl(var(--border))] bg-white dark:bg-black/90 px-4 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="AptiCore Logo"
            width={26}
            height={26}
            className="h-6.5 w-6.5 rounded-lg"
          />
          <span className="font-display gradient-text text-lg font-bold">
            AptiCore
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-[hsl(var(--border))] p-2 text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--surface-hover))]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-white dark:bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 z-50 w-72 overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden">
            <SidebarContent
              user={sidebarUser}
              pathname={pathname}
              loading={loading}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}
    </>
  )
}
