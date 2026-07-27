"use client"

import React, { useEffect, useState } from "react"
import { KeyRound, ShieldCheck, Check, X, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type AccessPolicyItem = {
  _id: string
  role: "user" | "admin" | "super_admin"
  permissions: string[]
}

const permissionLabels: Record<string, string> = {
  take_tests: "Take / Attempt Tests",
  view_leaderboard: "View Platform Leaderboard",
  view_achievements: "View Badges & Achievements",
  manage_questions: "Manage Questions Database (CRUD)",
  manage_tests: "Create & Publish Mock Tests",
  manage_categories: "Manage System Categories",
  view_reports: "View User-flagged Reports",
  view_results: "Access Platform Test Results",
  manage_admins: "Create, Modify, & Suspend Admins",
  view_logs: "Read Administrative Audit Trail Logs",
  configure_system: "Adjust Core App / Server Settings",
  manage_roles: "Modify Roles Permission Matrix",
}

export default function AccessMatrixPage() {
  const [policies, setPolicies] = useState<AccessPolicyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchPolicies = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/access")
      const json = await res.json()
      if (json.success) {
        setPolicies(json.data)
      } else {
        toast.error(json.error || "Failed to fetch access matrix")
      }
    } catch {
      toast.error("Failed to load permission matrix")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicies()
  }, [])

  const handleTogglePermission = (role: string, permission: string) => {
    setPolicies((prevPolicies) =>
      prevPolicies.map((policy) => {
        if (policy.role === role) {
          const hasPermission = policy.permissions.includes(permission)
          const newPermissions = hasPermission
            ? policy.permissions.filter((p) => p !== permission)
            : [...policy.permissions, permission]
          return {
            ...policy,
            permissions: newPermissions,
          }
        }
        return policy
      })
    )
  }

  const handleSaveChanges = async (role: string) => {
    const policy = policies.find((p) => p.role === role)
    if (!policy) return

    try {
      setSaving(true)
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: policy.role,
          permissions: policy.permissions,
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Access policy for ${role} updated successfully`)
        fetchPolicies()
      } else {
        toast.error(json.error || "Failed to save policy changes")
      }
    } catch {
      toast.error("Network error saving access configuration")
    } finally {
      setSaving(false)
    }
  }

  const getPolicyByRole = (roleName: string) => {
    return policies.find((p) => p.role === roleName)
  }

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-amber-500" />
          Access Roles Matrix
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Configure what actions users, admins, and super admins are allowed to execute on the platform.
        </p>
      </div>

      {/* MATRIX TABLE CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permission Settings Grid</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading permission matrices...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4 w-87.5">Capability / Feature Target</th>
                    <th className="p-4 text-center">User</th>
                    <th className="p-4 text-center">Admin</th>
                    <th className="p-4 text-center">Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.keys(permissionLabels).map((permKey) => {
                    const label = permissionLabels[permKey]

                    const hasUser = getPolicyByRole("user")?.permissions.includes(permKey) ?? false
                    const hasAdmin = getPolicyByRole("admin")?.permissions.includes(permKey) ?? false
                    const hasSuper = getPolicyByRole("super_admin")?.permissions.includes(permKey) ?? false

                    return (
                      <tr key={permKey} className="hover:bg-muted/20 transition">
                        <td className="p-4 font-medium text-foreground">{label}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleTogglePermission("user", permKey)}
                            className={`p-1.5 rounded transition ${
                              hasUser
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                            aria-label={`Toggle user permission ${label}`}
                          >
                            {hasUser ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleTogglePermission("admin", permKey)}
                            className={`p-1.5 rounded transition ${
                              hasAdmin
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                            aria-label={`Toggle admin permission ${label}`}
                          >
                            {hasAdmin ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleTogglePermission("super_admin", permKey)}
                            className={`p-1.5 rounded transition ${
                              hasSuper
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                            aria-label={`Toggle super_admin permission ${label}`}
                          >
                            {hasSuper ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ACTION SAVE BUTTONS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 dark:bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Save User Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">
              Update general access capabilities assigned to student accounts.
            </p>
            <Button
              size="sm"
              disabled={saving}
              onClick={() => handleSaveChanges("user")}
              className="bg-emerald-600 hover:bg-emerald-700 mt-2 text-white"
            >
              Apply User Policy
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 dark:bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-500" />
              Save Admin Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">
              Update permissions available for Content Creator & Quiz Admin accounts.
            </p>
            <Button
              size="sm"
              disabled={saving}
              onClick={() => handleSaveChanges("admin")}
              className="bg-sky-600 hover:bg-sky-700 mt-2 text-white"
            >
              Apply Admin Policy
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 dark:bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Save Super Admin Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">
              Update administrative rights on configurations and security logs.
            </p>
            <Button
              size="sm"
              disabled={saving}
              onClick={() => handleSaveChanges("super_admin")}
              className="bg-amber-600 hover:bg-amber-700 mt-2 text-white"
            >
              Apply Super Admin Policy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
