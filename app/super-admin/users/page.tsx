"use client"

import React, { useEffect, useState } from "react"
import { Users, Search, Power, Edit3, ShieldAlert, Award, Star } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type UserProfileType = {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  college?: string
  location?: string
  phone?: string
}

type UserAccount = {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  profile?: UserProfileType | null
}

export default function UsersOverviewPage() {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editUser, setEditUser] = useState<UserAccount | null>(null)

  // Edit form state fields
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editXP, setEditXP] = useState(0)
  const [editLevel, setEditLevel] = useState(1)
  const [editCollege, setEditCollege] = useState("")
  const [editLocation, setEditLocation] = useState("")

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/users?limit=300")
      const json = await res.json()
      if (json.success) {
        setUsers(json.data)
        setFilteredUsers(json.data)
      } else {
        toast.error(json.error || "Failed to fetch users")
      }
    } catch {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.profile?.college?.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, users])

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`User status updated successfully`)
        fetchUsers()
      } else {
        toast.error(json.error || "Failed to update user")
      }
    } catch {
      toast.error("Network error modifying user status")
    }
  }

  const handleOpenEdit = (user: UserAccount) => {
    setEditUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditXP(user.profile?.totalXP ?? 0)
    setEditLevel(user.profile?.level ?? 1)
    setEditCollege(user.profile?.college ?? "")
    setEditLocation(user.profile?.location ?? "")
  }

  const handleSaveEdit = async () => {
    if (!editUser) return

    try {
      const res = await fetch(`/api/admin/users/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          profile: {
            totalXP: Number(editXP),
            level: Number(editLevel),
            college: editCollege,
            location: editLocation,
          },
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("User profile updated successfully")
        setEditUser(null)
        fetchUsers()
      } else {
        toast.error(json.error || "Failed to update profile")
      }
    } catch {
      toast.error("Network error saving profile changes")
    }
  }

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
          <Users className="h-6 w-6 text-amber-500" />
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Browse user accounts, monitor XP progress, suspend accounts, and edit profile data.
        </p>
      </div>

      {/* SEARCH BAR */}
      <Card className="bg-card/50">
        <CardContent className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* USERS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading user accounts data...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No user accounts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4">Name & College</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">XP & Level</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/20 transition">
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-50">
                          {user.profile?.college || "College not set"}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{user.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">{user.profile?.totalXP ?? 0} XP</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Star className="h-3 w-3 text-sky-500" />
                          Level {user.profile?.level ?? 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.role === "user" ? "outline" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            user.isActive ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {user.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(user)}
                          className="gap-1 text-slate-600 dark:text-slate-300"
                          aria-label={`Edit profile for ${user.name}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(user._id, user.isActive)}
                          className={user.isActive ? "text-rose-500 hover:text-rose-600 border-rose-200 dark:border-rose-950" : "text-emerald-500 hover:text-emerald-600 border-emerald-200 dark:border-emerald-950"}
                          aria-label={`Toggle active state for ${user.name}`}
                        >
                          <Power className="h-3.5 w-3.5" />
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

      {/* EDIT USER PROFILE DIALOG */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Modify basic account configurations and gaming stats for this user.
            </DialogDescription>
          </DialogHeader>

          {editUser && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Display Name
                  </label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    XP Points
                  </label>
                  <Input
                    type="number"
                    value={editXP}
                    onChange={(e) => setEditXP(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Current Level
                  </label>
                  <Input
                    type="number"
                    value={editLevel}
                    onChange={(e) => setEditLevel(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  College / Institution
                </label>
                <Input value={editCollege} onChange={(e) => setEditCollege(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Location (City, Country)
                </label>
                <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditUser(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}