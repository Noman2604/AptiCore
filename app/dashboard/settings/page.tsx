"use client"
import { useState } from "react"
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Trash2,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react"

import { cn } from "@/lib/utils"

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-all duration-200",
        value
          ? "bg-sky-500"
          : "border border-[hsl(var(--border))] bg-[hsl(var(--surface-hover))]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200",
          value ? "left-5" : "left-0.5"
        )}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [activeSection, setActiveSection] = useState("notifications")
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    testReminders: true,
    weeklyReport: true,
    contestAlerts: true,
    publicProfile: true,
    showRank: true,
    showStreak: true,
    darkMode: true,
    compactMode: false,
    language: "en",
  })

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sections = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Key },
  ]

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display mb-1 text-2xl font-bold lg:text-3xl">
            Settings
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Manage your account and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            saved
              ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
              : "bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 hover:opacity-90"
          )}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar nav */}
        <nav className="space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                activeSection === s.id
                  ? "border border-sky-500/20 bg-sky-500/15 text-sky-400"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-4 lg:col-span-3">
          {/* Notifications */}
          {activeSection === "notifications" && (
            <div className="space-y-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="font-display font-semibold">
                Notification Preferences
              </h3>
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  desc: "Receive general updates via email",
                },
                {
                  key: "testReminders",
                  label: "Test Reminders",
                  desc: "Get reminded about scheduled tests",
                },
                {
                  key: "weeklyReport",
                  label: "Weekly Performance Report",
                  desc: "Summary of your weekly progress",
                },
                {
                  key: "contestAlerts",
                  label: "Contest Alerts",
                  desc: "Notify me when new contests go live",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b border-[hsl(var(--border))] py-2 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {item.desc}
                    </div>
                  </div>
                  <Toggle
                    value={prefs[item.key as keyof typeof prefs] as boolean}
                    onChange={() => toggle(item.key as any)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Privacy */}
          {activeSection === "privacy" && (
            <div className="space-y-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="font-display font-semibold">Privacy Settings</h3>
              {[
                {
                  key: "publicProfile",
                  label: "Public Profile",
                  desc: "Allow others to view your profile and stats",
                },
                {
                  key: "showRank",
                  label: "Show My Rank",
                  desc: "Display your global rank on the leaderboard",
                },
                {
                  key: "showStreak",
                  label: "Show Streak",
                  desc: "Show your activity streak publicly",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b border-[hsl(var(--border))] py-2 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {item.desc}
                    </div>
                  </div>
                  <Toggle
                    value={prefs[item.key as keyof typeof prefs] as boolean}
                    onChange={() => toggle(item.key as any)}
                  />
                </div>
              ))}
              <div className="pt-2">
                <button className="flex items-center gap-2 text-sm font-medium text-red-400 transition-colors hover:text-red-300">
                  <Trash2 className="h-4 w-4" /> Delete Account
                </button>
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  This permanently deletes all your data.
                </p>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <div className="space-y-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="font-display font-semibold">Appearance</h3>
              <div className="flex items-center justify-between border-b border-[hsl(var(--border))] py-2">
                <div>
                  <div className="text-sm font-medium">Dark Mode</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    Use dark theme across the platform
                  </div>
                </div>
                <Toggle
                  value={prefs.darkMode}
                  onChange={() => toggle("darkMode")}
                />
              </div>
              <div className="flex items-center justify-between border-b border-[hsl(var(--border))] py-2">
                <div>
                  <div className="text-sm font-medium">Compact Mode</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    Reduce spacing for denser layout
                  </div>
                </div>
                <Toggle
                  value={prefs.compactMode}
                  onChange={() => toggle("compactMode")}
                />
              </div>
              <div className="py-2">
                <div className="mb-2 text-sm font-medium">Language</div>
                <select
                  value={prefs.language}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, language: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 text-sm transition-all outline-none focus:border-sky-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="space-y-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="font-display font-semibold">Change Password</h3>
              {[
                {
                  label: "Current Password",
                  show: showOldPass,
                  toggle: () => setShowOldPass(!showOldPass),
                  placeholder: "Enter current password",
                },
                {
                  label: "New Password",
                  show: showNewPass,
                  toggle: () => setShowNewPass(!showNewPass),
                  placeholder: "Min 8 characters",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-sm font-medium">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type={f.show ? "text" : "password"}
                      placeholder={f.placeholder}
                      className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 pr-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                    />
                    <button
                      type="button"
                      onClick={f.toggle}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
                    >
                      {f.show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleSave}
                className="rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                Update Password
              </button>

              <div className="border-t border-[hsl(var(--border))] pt-4">
                <h4 className="mb-3 text-sm font-semibold">Active Sessions</h4>
                {[
                  {
                    device: "Chrome · MacBook Pro",
                    loc: "Mumbai, India",
                    time: "Now",
                    current: true,
                  },
                  {
                    device: "Mobile · Android",
                    loc: "Bengaluru, India",
                    time: "2h ago",
                    current: false,
                  },
                ].map((s) => (
                  <div
                    key={s.device}
                    className="flex items-center justify-between border-b border-[hsl(var(--border))] py-2.5 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {s.device}
                        {s.current && (
                          <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-xs text-emerald-400">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">
                        {s.loc} · {s.time}
                      </div>
                    </div>
                    {!s.current && (
                      <button className="text-xs text-red-400 transition-colors hover:text-red-300">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
