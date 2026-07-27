"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Settings } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Me = {
  _id: string
  name?: string
  email?: string
  role?: string
  avatar?: string
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/auth/me")
        const json = await res.json()

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load profile")
        }

        setMe(json.data ?? null)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  return (
    <div className="space-y-6 p-6 mt-12 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">Admin Settings</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Basic admin configuration and profile details.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Secure by auth cookie</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : me ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Signed in as</div>
                  <div className="text-lg font-semibold">{me.name ?? me.email ?? "Admin"}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{me.email ?? "—"}</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Role</div>
                  <div className="mt-2 text-sm font-semibold">{me.role ?? "—"}</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Access</div>
                  <div className="mt-2 text-sm font-semibold">Admin endpoints</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                If you want editable admin settings (feature toggles, thresholds, etc.),
                you’ll need matching backend endpoints.
              </div>
            </div>
          ) : (
            <div className="text-sm text-destructive">Not authorized.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            disabled
            title="Admin maintenance actions require backend endpoints"
          >
            Clear caches (coming soon)
          </Button>
          <Button
            variant="outline"
            disabled
            title="Admin maintenance actions require backend endpoints"
          >
            Recalculate leaderboard (coming soon)
          </Button>
          <div className="text-xs text-muted-foreground">
            Real settings writes are not implemented because the repo tree didn’t include
            admin settings APIs.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

