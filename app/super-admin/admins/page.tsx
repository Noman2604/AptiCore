"use client"

import React, { useEffect, useState } from "react"
import { Shield, Plus, Power, ArrowDown, UserPlus, Search } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type AdminUser = {
  _id: string
  name: string
  email: string
  role: "admin" | "super_admin"
  isActive: boolean
}

type UserSummaryItem = {
  _id: string
  name: string
  email: string
  role: string
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [allUsers, setAllUsers] = useState<UserSummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteOpen, setPromoteOpen] = useState(false)
  const [selectedUserToPromote, setSelectedUserToPromote] = useState("")
  const [promotionRole, setPromotionRole] = useState<"admin" | "super_admin">("admin")
  const [searchQuery, setSearchQuery] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      const [adminsRes, usersRes] = await Promise.all([
        fetch("/api/admin/admins"),
        fetch("/api/admin/users?limit=300"),
      ])
      const adminsJson = await adminsRes.json()
      const usersJson = await usersRes.json()

      if (adminsJson.success) setAdmins(adminsJson.data)
      if (usersJson.success) setAllUsers(usersJson.data)
    } catch (err) {
      toast.error("Failed to load administrators data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`User status updated successfully`)
        loadData()
      } else {
        toast.error(json.error || "Failed to update status")
      }
    } catch {
      toast.error("Failed to make request")
    }
  }

  const handleDemote = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "user" }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Administrator demoted to normal user")
        loadData()
      } else {
        toast.error(json.error || "Failed to demote user")
      }
    } catch {
      toast.error("Failed to make request")
    }
  }

  const handlePromote = async () => {
    if (!selectedUserToPromote) {
      toast.error("Please select a user to promote")
      return
    }

    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserToPromote, role: promotionRole }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("User promoted successfully")
        setPromoteOpen(false)
        setSelectedUserToPromote("")
        loadData()
      } else {
        toast.error(json.error || "Failed to promote user")
      }
    } catch {
      toast.error("Failed to make request")
    }
  }

  // Filter candidates for promotion (exclude current admins)
  const candidateUsers = allUsers.filter(
    (u) =>
      u.role === "user" &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-500" />
            Admin Management
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Add, configure, suspend, or demote administrator and super_admin permissions.
          </p>
        </div>

        <Dialog open={promoteOpen} onOpenChange={setPromoteOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Promote to Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote User to Admin Role</DialogTitle>
              <DialogDescription>
                Assign administrative permissions to an existing user account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 mb-2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Select User Account
                </label>
                <Select value={selectedUserToPromote} onValueChange={setSelectedUserToPromote}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {candidateUsers.length === 0 ? (
                      <div className="p-2 text-center text-xs text-muted-foreground">
                        No candidate users found
                      </div>
                    ) : (
                      candidateUsers.map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Assign Administrative Level
                </label>
                <Select
                  value={promotionRole}
                  onValueChange={(val: any) => setPromotionRole(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPromoteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePromote} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Grant Access
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ADMINS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Administrators</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading administrators data...</div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No administrators configured.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-muted/20 transition">
                      <td className="p-4 font-semibold text-foreground">{admin.name}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{admin.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            admin.role === "super_admin"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-sky-500/10 text-sky-500"
                          }`}
                        >
                          {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            admin.isActive ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${admin.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {admin.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(admin._id, admin.isActive)}
                          className="gap-1.5"
                          aria-label={`Toggle active state for ${admin.name}`}
                        >
                          <Power className="h-3.5 w-3.5" />
                          {admin.isActive ? "Suspend" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDemote(admin._id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1.5"
                          aria-label={`Demote ${admin.name} to user`}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                          Demote
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}