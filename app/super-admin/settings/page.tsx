"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Settings,
  ShieldCheck,
  Save,
  Loader2,
  Activity,
  ToggleLeft,
  Shield,
  RotateCcw,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type SystemSettings = {
  maintenanceMode: boolean
  signupAllowed: boolean
  leaderboardVisible: boolean
  xpMultiplier: number
  platformName: string
  defaultPassingScore: number
}

export default function SuperAdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    signupAllowed: true,
    leaderboardVisible: true,
    xpMultiplier: 1.0,
    platformName: "AptiCore",
    defaultPassingScore: 50,
  })

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/settings")
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load system settings")
        }
        setSettings(json.data)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  const onToggle = (key: keyof Pick<SystemSettings, "maintenanceMode" | "signupAllowed" | "leaderboardVisible">) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const onChangeNumber = (key: keyof Pick<SystemSettings, "xpMultiplier" | "defaultPassingScore">, v: string) => {
    const num = Number(v)
    setSettings((prev) => ({
      ...prev,
      [key]: Number.isFinite(num) ? num : prev[key],
    }))
  }

  const onSave = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenanceMode: settings.maintenanceMode,
          signupAllowed: settings.signupAllowed,
          leaderboardVisible: settings.leaderboardVisible,
          xpMultiplier: settings.xpMultiplier,
          platformName: settings.platformName,
          defaultPassingScore: settings.defaultPassingScore,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update settings")
      }
      toast.success("System settings updated")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
            <Settings className="h-7 w-7 text-amber-500" />
            Super Admin Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure platform-wide system toggles and baseline scoring parameters.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secured by super_admin token
          </Badge>
        </div>
      </div>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Runtime toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-semibold">Maintenance mode</div>
              <div className="text-sm text-muted-foreground">Restrict gameplay during maintenance windows.</div>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={() => onToggle("maintenanceMode")}
              aria-label="Maintenance mode"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-semibold">Signup allowed</div>
              <div className="text-sm text-muted-foreground">Enable or disable new registrations.</div>
            </div>
            <Switch
              checked={settings.signupAllowed}
              onCheckedChange={() => onToggle("signupAllowed")}
              aria-label="Signup allowed"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-semibold">Leaderboard visibility</div>
              <div className="text-sm text-muted-foreground">Show/hide the public leaderboard.</div>
            </div>
            <Switch
              checked={settings.leaderboardVisible}
              onCheckedChange={() => onToggle("leaderboardVisible")}
              aria-label="Leaderboard visibility"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Scoring defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">XP multiplier</div>
              <Input
                type="number"
                step="0.1"
                value={settings.xpMultiplier}
                onChange={(e) => onChangeNumber("xpMultiplier", e.target.value)}
                className="mt-2"
                disabled={loading || saving}
              />
              <div className="mt-1 text-xs text-muted-foreground">Applied to XP earning calculations.</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Default passing score</div>
              <Input
                type="number"
                value={settings.defaultPassingScore}
                onChange={(e) => onChangeNumber("defaultPassingScore", e.target.value)}
                className="mt-2"
                disabled={loading || saving}
              />
              <div className="mt-1 text-xs text-muted-foreground">Used as baseline for pass/fail.</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Platform name</div>
            <Input
              value={settings.platformName}
              onChange={(e) => setSettings((prev) => ({ ...prev, platformName: e.target.value }))}
              className="mt-2"
              disabled={loading || saving}
            />
            <div className="mt-1 text-xs text-muted-foreground">Displayed across admin + user surfaces.</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Apply changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Updates are persisted via <span className="font-mono">POST /api/admin/settings</span>.
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onSave}
                disabled={loading || saving}
                className="gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save changes"}
              </Button>

              <Button
                variant="outline"
                disabled={loading || saving}
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
              <Shield className="h-4 w-4 text-amber-500" />
              <div>
                <div className="font-semibold">Safety note</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Use maintenance mode for deployments. XP multipliers and passing score affect future evaluations.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Current status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Maintenance</span>
              <Badge variant={settings.maintenanceMode ? "destructive" : "secondary"}>
                {settings.maintenanceMode ? "ON" : "OFF"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Signup</span>
              <Badge variant={settings.signupAllowed ? "secondary" : "destructive"}>
                {settings.signupAllowed ? "Allowed" : "Blocked"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Leaderboard</span>
              <Badge variant={settings.leaderboardVisible ? "secondary" : "destructive"}>
                {settings.leaderboardVisible ? "Visible" : "Hidden"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

