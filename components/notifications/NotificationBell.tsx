"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Trophy,
  Flame,
  BookOpen,
  Info,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Check,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type NotificationItem = {
  _id: string
  title: string
  message: string
  type:
    | "info"
    | "success"
    | "warning"
    | "achievement"
    | "contest"
    | "streak"
    | "test"
    | "system"
  link?: string | null
  isRead: boolean
  createdAt: string
}

function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date().getTime()
    const past = new Date(dateString).getTime()
    const diffMs = Math.max(0, now - past)
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Recently"
  }
}

function getNotificationVisuals(type: NotificationItem["type"]) {
  switch (type) {
    case "streak":
      return {
        icon: Flame,
        bgClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        badge: "Streak",
      }
    case "achievement":
      return {
        icon: Trophy,
        bgClass: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        badge: "Achievement",
      }
    case "contest":
      return {
        icon: Sparkles,
        bgClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        badge: "Contest",
      }
    case "test":
      return {
        icon: BookOpen,
        bgClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        badge: "Test",
      }
    case "warning":
      return {
        icon: AlertTriangle,
        bgClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        badge: "Notice",
      }
    case "success":
      return {
        icon: Check,
        bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        badge: "Success",
      }
    default:
      return {
        icon: Info,
        bgClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        badge: "Update",
      }
  }
}

export function NotificationBell({ className }: { className?: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get("/api/notifications?limit=30", {
        withCredentials: true,
      })
      if (res.data?.success) {
        setNotifications(res.data.data || [])
        setUnreadCount(res.data.unreadCount ?? 0)
      }
    } catch {
      // Quiet fail if not logged in
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadInitial = async () => {
      try {
        const res = await axios.get("/api/notifications?limit=30", {
          withCredentials: true,
        })
        if (active && res.data?.success) {
          setNotifications(res.data.data || [])
          setUnreadCount(res.data.unreadCount ?? 0)
        }
      } catch {
        // Quiet fail if not logged in
      }
    }

    void loadInitial()

    // Poll every 40s to keep notifications fresh
    const interval = setInterval(() => {
      void loadInitial()
    }, 40000)

    const handleFocus = () => {
      void loadInitial()
    }
    window.addEventListener("focus", handleFocus)

    const handleCustomTrigger = () => {
      void loadInitial()
    }
    window.addEventListener("apticore_notification_refresh", handleCustomTrigger)

    return () => {
      active = false
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener(
        "apticore_notification_refresh",
        handleCustomTrigger
      )
    }
  }, [])

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))

      await axios.patch("/api/notifications", { id }, { withCredentials: true })
    } catch (err) {
      console.error("Failed to mark notification as read", err)
      fetchNotifications()
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)

      await axios.patch(
        "/api/notifications",
        { markAllRead: true },
        { withCredentials: true }
      )
      toast.success("All notifications marked as read")
    } catch (err) {
      console.error("Failed to mark all as read", err)
      fetchNotifications()
    }
  }

  const deleteNotification = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      const target = notifications.find((n) => n._id === id)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      if (target && !target.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1))
      }

      await axios.delete(`/api/notifications?id=${id}`, {
        withCredentials: true,
      })
    } catch (err) {
      console.error("Failed to delete notification", err)
      fetchNotifications()
    }
  }

  const clearReadNotifications = async () => {
    try {
      setNotifications((prev) => prev.filter((n) => !n.isRead))
      await axios.delete("/api/notifications?clearAllRead=true", {
        withCredentials: true,
      })
      toast.success("Read notifications cleared")
    } catch (err) {
      console.error("Failed to clear read notifications", err)
      fetchNotifications()
    }
  }

  const handleNotificationClick = (n: NotificationItem) => {
    if (!n.isRead) {
      markAsRead(n._id)
    }
    if (n.link) {
      setIsOpen(false)
      router.push(n.link)
    }
  }

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  )

  const hasReadItems = notifications.some((n) => n.isRead)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Notifications"
          aria-label={`Notifications (${unreadCount} unread)`}
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-md border border-border/40 text-muted-foreground transition-all outline-none cursor-pointer hover:bg-accent hover:text-foreground",
            unreadCount > 0 && "text-foreground border-emerald-500/30",
            className
          )}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4 text-emerald-500 animate-in fade-in" />
          ) : (
            <Bell className="h-4 w-4" />
          )}

          {/* Unread Badge Counter */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-1 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] ring-2 ring-background animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[400px] p-0 shadow-2xl border-border/60 bg-popover/95 backdrop-blur-md rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[11px] font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filters Tabs */}
        <div className="flex items-center gap-1 border-b border-border/40 px-3 py-1.5 bg-background/50 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
              filter === "all"
                ? "bg-accent text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
              filter === "unread"
                ? "bg-accent text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/30">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-2">
                <Bell className="h-5 w-5 opacity-60" />
              </div>
              <p className="text-xs font-medium text-foreground">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "No notifications yet"}
              </p>
              <p className="text-[11px] text-muted-foreground max-w-[220px] mt-0.5">
                {filter === "unread"
                  ? "All notifications have been reviewed."
                  : "Important updates, test results, and streaks will show up here."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const visuals = getNotificationVisuals(item.type)
              const VisualIcon = visuals.icon

              return (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    "group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-accent/50",
                    !item.isRead && "bg-emerald-500/5 dark:bg-emerald-500/[0.04]"
                  )}
                >
                  {/* Category Icon */}
                  <div
                    className={cn(
                      "shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border",
                      visuals.bgClass
                    )}
                  >
                    <VisualIcon className="h-4 w-4" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </span>
                      {item.link && (
                        <ExternalLink className="h-2.5 w-2.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-muted-foreground/80">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 border border-border/40 px-1 py-0.2 rounded">
                        {visuals.badge}
                      </span>
                    </div>
                  </div>

                  {/* Unread Dot & Actions */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                    )}

                    {/* Delete button (shows on hover) */}
                    <button
                      type="button"
                      title="Delete notification"
                      onClick={(e) => deleteNotification(item._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-500 rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Actions */}
        {hasReadItems && (
          <div className="border-t border-border/40 px-3 py-2 bg-muted/20 flex justify-end">
            <button
              type="button"
              onClick={clearReadNotifications}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear read notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default NotificationBell
