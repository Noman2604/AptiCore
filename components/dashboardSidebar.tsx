"use client"

import { useEffect, useState } from "react"
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
import Image from "next/image"
import { cn, getInitials } from "@/lib/utils"

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
  { label: "Feedback", href: "/dashboard/feedback", icon: BookOpen },
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

interface SidebarProps {
  user?: SidebarUser
}

interface SidebarContentProps {
  user?: SidebarUser
  pathname: string
  loading: boolean
  onLogout: () => void
  onNavigate?: () => void
  onRequestLogout: () => void
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: value > 9999 ? "compact" : "standard",
  }).format(value)

function SidebarContent({
  user,
  pathname,
  loading,
  onNavigate,
  onRequestLogout,
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
    <div className="flex h-full flex-col bg-[#0a0e14]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-[#212a37] px-4 py-5">
        <div className="">
          <Image
            loading="lazy"
            src="/logo.png"
            alt="AptiCore Logo"
            width={32}
            height={32}
            className="h-10 w-10 rounded-full object-cover sm:h-10 sm:w-10"
          />
        </div>
        <div className="min-w-0">
          <span className="block font-[Space_Grotesk,sans-serif] text-[15px] leading-5 font-bold text-[#e7ecf3]">
            AptiCore
          </span>
          <span className="font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
            Practice hub
          </span>
        </div>
      </div>

      {/* User / XP card */}
      {user && (
        <div className="px-3 py-4">
          <div className="rounded-[14px] border border-[#212a37] bg-[#10151d] p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] font-[Space_Grotesk,sans-serif] text-[13px] font-bold text-[#08110d]">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
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
                <div className="truncate text-[13.5px] font-semibold text-[#e7ecf3]">
                  {user.name}
                </div>
                <div className="truncate font-[JetBrains_Mono,monospace] text-[10.5px] text-[#5b6577]">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-[10px] bg-[#141b25] p-2.5">
              <div className="mb-2 flex items-center justify-between font-[JetBrains_Mono,monospace] text-[11px]">
                <span className="font-semibold text-[#8b7cf6]">
                  Lv. {level}
                </span>
                <span className="text-[#f5a623]">
                  {formatNumber(totalXP)} XP
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#212a37]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#8b7cf6] to-[#6ee7c9] transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              {streak > 0 && (
                <p className="mt-2 font-[JetBrains_Mono,monospace] text-[10px] text-[#f2896b]">
                  🔥 {streak} day streak
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 scrollbar-none space-y-1 overflow-y-auto px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                active
                  ? "border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] text-[#6ee7c9]"
                  : "text-[#8a96a8] hover:bg-[#141b25] hover:text-[#e7ecf3]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  active ? "text-[#6ee7c9]" : "group-hover:text-[#e7ecf3]"
                )}
              />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6ee7c9]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom items + logout */}
      <div className="space-y-1 border-t border-[#212a37] px-2 pt-3 pb-4">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all",
                  active
                    ? "bg-[#141b25] text-[#e7ecf3]"
                    : "text-[#8a96a8] hover:bg-[#141b25] hover:text-[#e7ecf3]"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}

        <button
          disabled={loading}
          onClick={onRequestLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-[#f2555a]/75 transition-all hover:bg-[rgba(242,85,90,0.1)] hover:text-[#f2555a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>{loading ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
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
    } finally {
      setLogoutConfirmOpen(false)
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden h-full w-64 flex-col border-r border-[#212a37] bg-[#0a0e14] shadow-xl shadow-black/20 lg:flex">
        <SidebarContent
          user={sidebarUser}
          pathname={pathname}
          loading={loading}
          onLogout={handleLogout}
          onRequestLogout={() => setLogoutConfirmOpen(true)}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-[#212a37] bg-[#0a0e14] px-4 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="">
            <Image
              loading="lazy"
              src="/logo.png"
              alt="AptiCore Logo"
              width={32}
              height={32}
              className="h-10 w-10 rounded-full object-cover sm:h-10 sm:w-10"
            />
          </div>
          <span className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold text-[#e7ecf3]">
            AptiCore
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className=" p-2 text-[#e7ecf3] transition-500 hover:bg-[#141b25] hover:text-[#6ee7c9]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 z-50 w-72 overflow-y-auto border-r border-[#212a37] bg-[#0a0e14] shadow-2xl lg:hidden">
            <SidebarContent
              user={sidebarUser}
              pathname={pathname}
              loading={loading}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
              onRequestLogout={() => setLogoutConfirmOpen(true)}
            />
          </div>
        </>
      )}

      {/* Logout confirm modal */}
      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-70 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => !loading && setLogoutConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-120 sm:max-w-90 rounded-t-2xl border-[#212a37] bg-[#10151d] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:rounded-2xl"
          >
            <h3 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#e7ecf3]">
              Logout?
            </h3>
            <p className="mt-1.5 text-[13px] leading-6 text-[#8a96a8]">
              Are you sure you want to logout?
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={loading}
                className="flex-1 rounded-lg border border-[#212a37] bg-transparent py-2.5 text-[13.5px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 rounded-lg bg-linear-to-br from-[#f2555a] to-[#d43f44] py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-105 disabled:opacity-60"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
