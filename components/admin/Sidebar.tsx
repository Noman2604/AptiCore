"use client"

import { useState } from "react"
import Image from "next/image"
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
        "mt-2 flex items-center gap-3 rounded-lg border px-3 py-2 transition",
        active
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {active && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />}
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
    <div className="space-y-2">
      <div className="px-3 text-[10px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onLogout,
  onNavigate,
}: {
  pathname: string
  onLogout: () => void
  onNavigate?: () => void
}) {
  const isActive = (path: string) => pathname === path

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100 dark:bg-black">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="AptiCore Logo"
            height={24}
            width={24}
            className="h-8 w-8"
          />
          <div>
            <div className="font-bold tracking-wider text-emerald-400 text-sm">
              APTICORE
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              ADMIN PANEL
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <Section title="OVERVIEW">
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

        <Section title="CONTENT">
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

        <Section title="MANAGE">
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

        <Section title="SYSTEM">
          <NavItem
            label="Settings"
            href="/admin/settings"
            icon={<Settings size={18} />}
            active={isActive("/admin/settings")}
            onNavigate={onNavigate}
          />
        </Section>
      </nav>

      <div className="space-y-2 border-t border-slate-800 p-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 transition hover:bg-rose-950/20">
              <LogOut size={18} />
              Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onLogout}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })

    router.push("/auth/login")
  }

  return (
    <>
      <aside
        className={cn(
          "hidden h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 lg:flex dark:bg-black"
        )}
      >
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 lg:hidden dark:bg-black/60">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="AptiCore Logo"
            height={22}
            width={22}
            className="h-7 w-7"
          />
          <span className="font-bold text-emerald-400 text-sm tracking-wider">
            APTICORE
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-lg border border-slate-700 p-2 transition hover:bg-slate-800"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-72 overflow-y-auto border-r border-slate-800 bg-slate-900 shadow-2xl lg:hidden dark:bg-black">
            <SidebarContent
              pathname={pathname}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  )
}
