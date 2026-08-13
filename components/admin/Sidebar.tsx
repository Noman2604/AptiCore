"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  CheckCircle,
  ClipboardList,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  Flag,
  Medal,
  Award,
  X,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type NavItemProps = {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  onNavigate?: () => void
}

function NavItem({ label, icon, href, active, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition",
        active
          ? " border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.1)] text-[#6ee7c9]"
          : " text-[#8a96a8] hover:bg-[#141b25] hover:text-[#e7ecf3]"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6ee7c9]" />
      )}
    </Link>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="px-3 font-[JetBrains_Mono,monospace] text-[10px] font-semibold tracking-[0.2em] text-[#5b6577] uppercase">
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onNavigate,
  onRequestLogout,
}: {
  pathname: string
  onNavigate?: () => void
  onRequestLogout: () => void
}) {
  const isActive = (path: string) => pathname === path

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
        <div>
          <div className="font-[Space_Grotesk,sans-serif] text-[15px] font-bold text-[#e7ecf3]">
            AptiCore
          </div>
          <div className="font-[JetBrains_Mono,monospace] text-[10px] tracking-[0.15em] text-[#5b6577]">
            ADMIN PANEL
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 scrollbar-none space-y-5 overflow-y-auto px-3 py-4">
        <Section title="Overview">
          <NavItem
            label="Dashboard"
            href="/admin"
            icon={<LayoutDashboard size={18} />}
            active={isActive("/admin")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Analytics"
            href="/admin/analytics"
            icon={<BarChart3 size={18} />}
            active={isActive("/admin/analytics")}
            onNavigate={onNavigate}
          />
        </Section>

        <Section title="Content">
          <NavItem
            label="Users"
            href="/admin/users"
            icon={<Users size={18} />}
            active={isActive("/admin/users")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Questions"
            href="/admin/questions"
            icon={<FileText size={18} />}
            active={isActive("/admin/questions")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Tests"
            href="/admin/tests"
            icon={<ClipboardList size={18} />}
            active={isActive("/admin/tests")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Categories"
            href="/admin/categories"
            icon={<Layers size={18} />}
            active={isActive("/admin/categories")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Achievements"
            href="/admin/achievements"
            icon={<Award size={18} />}
            active={isActive("/admin/achievements")}
            onNavigate={onNavigate}
          />
        </Section>

        <Section title="Manage">
          <NavItem
            label="Results"
            href="/admin/results"
            icon={<CheckCircle size={18} />}
            active={isActive("/admin/results")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Reports"
            href="/admin/reports"
            icon={<Flag size={18} />}
            active={isActive("/admin/reports")}
            onNavigate={onNavigate}
          />
          <NavItem
            label="Leaderboard"
            href="/admin/leaderboard"
            icon={<Medal size={18} />}
            active={isActive("/admin/leaderboard")}
            onNavigate={onNavigate}
          />
        </Section>

        <Section title="System">
          <NavItem
            label="Settings"
            href="/admin/settings"
            icon={<Settings size={18} />}
            active={isActive("/admin/settings")}
            onNavigate={onNavigate}
          />
        </Section>
      </nav>

      {/* Logout */}
      <div className="border-t border-[#212a37] p-3">
        <button
          onClick={onRequestLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-[#f2555a]/75 transition hover:bg-[rgba(242,85,90,0.1)] hover:text-[#f2555a]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/login")
    } finally {
      setLoggingOut(false)
      setLogoutConfirmOpen(false)
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r border-[#212a37] bg-[#0a0e14] lg:flex">
        <SidebarContent
          pathname={pathname}
          onRequestLogout={() => setLogoutConfirmOpen(true)}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-[#212a37] bg-[#0a0e14] px-4 py-3.5 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
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
          <span className="font-[Space_Grotesk,sans-serif] text-[15px] font-bold text-[#e7ecf3]">
            AptiCore <span className="text-[#5b6577]">Admin</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className=" p-2 text-[#e7ecf3] transition hover:bg-[#141b25]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 h-screen w-72 overflow-y-auto border-r border-[#212a37] bg-[#0a0e14] shadow-2xl lg:hidden">
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onRequestLogout={() => setLogoutConfirmOpen(true)}
            />
          </aside>
        </>
      )}

      {/* Logout confirm modal */}
      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-70 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => !loggingOut && setLogoutConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-120 sm:max-w-100 rounded-t-2xl border-[#212a37] bg-[#10151d] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:rounded-2xl"
          >
            <h3 className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#e7ecf3]">
              Sign out?
            </h3>
            <p className="mt-1.5 text-[13px] leading-6 text-[#8a96a8]">
              Are you sure you want to sign out of the admin panel?
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={loggingOut}
                className="flex-1 rounded-lg border border-[#212a37] bg-transparent py-2.5 text-[13.5px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 rounded-lg bg-linear-to-br from-[#f2555a] to-[#d43f44] py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-105 disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
