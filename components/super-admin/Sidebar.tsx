"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Shield,
  KeyRound,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import Image from "next/image"

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

interface NavItemProps {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  collapsed?: boolean
}

function NavItem({
  label,
  icon,
  href,
  active,
  collapsed,
  onNavigate,
}: NavItemProps & { onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`mt-2 flex items-center justify-between rounded-lg px-3 py-2 transition ${
        active
          ? "bg-amber-500/10 text-amber-500 font-semibold border-l-2 border-amber-500"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {!collapsed && <span className="text-sm">{label}</span>}
      </div>
    </Link>
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
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            height={24}
            width={24}
            className="h-8 w-8"
          />
          <div>
            <div className="font-bold tracking-wider text-amber-500 text-sm">APTICORE</div>
            <div className="text-[10px] text-slate-400 font-medium">SUPER ADMIN</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-3">
          Overview
        </div>
        <NavItem
          label="Dashboard"
          href="/super-admin"
          icon={<LayoutDashboard size={18} />}
          active={isActive("/super-admin")}
          onNavigate={onNavigate}
        />
        <NavItem
          label="Analytics"
          href="/super-admin/analytics"
          icon={<BarChart3 size={18} />}
          active={isActive("/super-admin/analytics")}
          onNavigate={onNavigate}
        />


        <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-3 pt-4">
          Management
        </div>
        <NavItem
          label="Admins"
          href="/super-admin/admins"
          icon={<Shield size={18} />}
          active={isActive("/super-admin/admins")}
          onNavigate={onNavigate}
        />
        <NavItem
          label="Users"
          href="/super-admin/users"
          icon={<Users size={18} />}
          active={isActive("/super-admin/users")}
          onNavigate={onNavigate}
        />

        <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-3 pt-4">
          Security & Rules
        </div>
        <NavItem
          label="Audit Logs"
          href="/super-admin/logs"
          icon={<FileText size={18} />}
          active={isActive("/super-admin/logs")}
          onNavigate={onNavigate}
        />
        <NavItem
          label="Access Matrix"
          href="/super-admin/access"
          icon={<KeyRound size={18} />}
          active={isActive("/super-admin/access")}
          onNavigate={onNavigate}
        />

        <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-3 pt-4">
          System
        </div>
        <NavItem
          label="Settings"
          href="/super-admin/settings"
          icon={<Settings size={18} />}
          active={isActive("/super-admin/settings")}
          onNavigate={onNavigate}
        />
      </nav>

      {/* FOOTER */}
      <div className="space-y-2 border-t border-slate-800 p-3">

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/20 transition">
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
              <AlertDialogAction onClick={onLogout} className="bg-rose-600 hover:bg-rose-700">
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
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 lg:flex dark:bg-black"
        )}
      >
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 lg:hidden dark:bg-black/60">
        <Link href="/super-admin" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            height={22}
            width={22}
            className="h-7 w-7"
          />
          <span className="font-bold text-amber-500 text-sm tracking-wider">APTICORE SA</span>
        </Link>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800 transition"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-72 overflow-y-auto border-r border-slate-850 bg-slate-900 shadow-2xl lg:hidden dark:bg-black">
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
