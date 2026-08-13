"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheck,
  Ban,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type UserRole = "user" | "admin" | "super_admin"

type UserProfile = {
  totalXP?: number
  level?: number
  currentStreak?: number
  longestStreak?: number
  college?: string
  location?: string
  phone?: string
}

type AdminUser = {
  _id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt?: string
  profile?: UserProfile | null
}

type UserForm = {
  name: string
  email: string
  password: string
  role: UserRole
  isActive: string
  totalXP: string
  level: string
  currentStreak: string
  longestStreak: string
  college: string
  location: string
  phone: string
}

const blankForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
  isActive: "true",
  totalXP: "0",
  level: "1",
  currentStreak: "0",
  longestStreak: "0",
  college: "",
  location: "",
  phone: "",
}

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "user", label: "Users" },
  { value: "admin", label: "Admins" },
  { value: "super_admin", label: "Super Admins" },
]

const formatDate = (value?: string) => {
  if (!value) return "Not available"
  return new Date(value).toLocaleDateString()
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<UserForm>(blankForm)
  const [showUserSheet, setShowUserSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/admin/users?limit=300")
      const json = await response.json()

      if (!json.success) throw new Error(json.error || "Failed to fetch users")

      setUsers(json.data ?? [])
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadUsers)
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.profile?.college?.toLowerCase().includes(normalizedSearch) ||
        user.profile?.location?.toLowerCase().includes(normalizedSearch)
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [roleFilter, searchQuery, statusFilter, users])

  const activeCount = users.filter((user) => user.isActive).length
  const adminCount = users.filter(
    (user) => user.role === "admin" || user.role === "super_admin"
  ).length
  const totalXP = users.reduce(
    (sum, user) => sum + (user.profile?.totalXP ?? 0),
    0
  )

  const roleBadge = (role: UserRole) => {
    if (role === "super_admin")
      return <Badge className="bg-purple-600 text-white">Super Admin</Badge>
    if (role === "admin")
      return <Badge className="bg-blue-600 text-white">Admin</Badge>
    return <Badge variant="secondary">User</Badge>
  }

  const openCreateSheet = () => {
    setSelectedUser(null)
    setForm(blankForm)
    setShowUserSheet(true)
  }

  const makeFormFromUser = (user: AdminUser): UserForm => ({
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    isActive: String(user.isActive),
    totalXP: String(user.profile?.totalXP ?? 0),
    level: String(user.profile?.level ?? 1),
    currentStreak: String(user.profile?.currentStreak ?? 0),
    longestStreak: String(user.profile?.longestStreak ?? 0),
    college: user.profile?.college ?? "",
    location: user.profile?.location ?? "",
    phone: user.profile?.phone ?? "",
  })

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user)
    setForm(makeFormFromUser(user))
    setShowUserSheet(true)
  }

  const saveUser = async () => {
    try {
      if (!form.name.trim() || !form.email.trim()) {
        toast.error("Name and email are required")
        return
      }

      if (!selectedUser && form.password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }

      setSaving(true)

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        isActive: form.isActive === "true",
        profile: {
          totalXP: Number(form.totalXP || 0),
          level: Number(form.level || 1),
          currentStreak: Number(form.currentStreak || 0),
          longestStreak: Number(form.longestStreak || 0),
          college: form.college.trim(),
          location: form.location.trim(),
          phone: form.phone.trim(),
        },
      }

      const response = await fetch(
        selectedUser
          ? `/api/admin/users/${selectedUser._id}`
          : "/api/admin/users",
        {
          method: selectedUser ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      const json = await response.json()

      if (!json.success) throw new Error(json.error || "Failed to save user")

      toast.success(selectedUser ? "User updated" : "User created")
      setShowUserSheet(false)
      setSelectedUser(null)
      await loadUsers()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save user"
      )
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    try {
      setSaving(true)

      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "DELETE",
      })
      const json = await response.json()

      if (!json.success)
        throw new Error(json.error || "Failed to deactivate user")

      toast.success("User deactivated")
      setShowDeleteDialog(false)
      setSelectedUser(null)
      await loadUsers()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to deactivate user"
      )
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (user: AdminUser) => {
    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      })
      const json = await response.json()

      if (!json.success)
        throw new Error(json.error || "Failed to update status")

      toast.success(`User is now ${user.isActive ? "inactive" : "active"}`)
      setSelectedUser(null)
      await loadUsers()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      )
    }
  }

  return (
    <div className="mt-10 space-y-6 p-6 sm:mt-2 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">User Management</h1>
          <p className="text-muted-foreground">
            Manage accounts, roles, status, and profile progress
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Inactive</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {users.length - activeCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Admins</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{adminCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users, email, college, location..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Level</TableHead>
                  <TableHead className="hidden xl:table-cell">XP</TableHead>
                  <TableHead className="hidden xl:table-cell">Streak</TableHead>
                  <TableHead className="hidden xl:table-cell">Joined</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{user.name}</p>
                            <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {roleBadge(user.role)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.isActive ? (
                          <Badge className="bg-emerald-600 text-white">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.profile?.level ?? 1}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {(user.profile?.totalXP ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {user.profile?.currentStreak ?? 0} days
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                            aria-label="View user"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            aria-label="Edit user"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeleteDialog(true)
                            }}
                            aria-label="Deactivate user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Sheet open={showUserSheet} onOpenChange={setShowUserSheet}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update account details, access role, and profile progress.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  className="mt-1.5"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className="mt-1.5"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value: UserRole) =>
                    setForm((current) => ({ ...current, role: value }))
                  }
                >
                  <SelectTrigger id="role" className="mt-1.5">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.isActive}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, isActive: value }))
                  }
                >
                  <SelectTrigger id="status" className="mt-1.5">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  className="mt-1.5"
                  type="number"
                  min="1"
                  value={form.level}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      level: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="xp">Total XP</Label>
                <Input
                  id="xp"
                  className="mt-1.5"
                  type="number"
                  min="0"
                  value={form.totalXP}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalXP: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="current-streak">Streak</Label>
                <Input
                  id="current-streak"
                  className="mt-1.5"
                  type="number"
                  min="0"
                  value={form.currentStreak}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      currentStreak: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="longest-streak">Best Streak</Label>
                <Input
                  id="longest-streak"
                  className="mt-1.5"
                  type="number"
                  min="0"
                  value={form.longestStreak}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      longestStreak: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  className="mt-1.5"
                  value={form.college}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      college: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  className="mt-1.5"
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  className="mt-1.5"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUserSheet(false)}>
                Cancel
              </Button>
              <Button onClick={saveUser} disabled={saving}>
                {saving ? "Saving..." : "Update User"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={selectedUser !== null && !showUserSheet && !showDeleteDialog}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}</DialogTitle>
            <div>
              <span className="mt-2 flex flex-wrap items-center gap-2">
                {selectedUser && roleBadge(selectedUser.role)}
                {selectedUser?.isActive ? (
                  <Badge className="bg-emerald-600 text-white">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">{selectedUser?.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">User ID:</span>
                <span className="ml-2 font-mono text-xs">
                  {selectedUser?._id}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Joined:</span>
                <span className="ml-2">
                  {formatDate(selectedUser?.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">College:</span>
                <span className="ml-2">
                  {selectedUser?.profile?.college || "Not added"}
                </span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-lg font-bold">
                  {selectedUser?.profile?.level ?? 1}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">XP</p>
                <p className="text-lg font-bold">
                  {(selectedUser?.profile?.totalXP ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-lg font-bold">
                  {selectedUser?.profile?.currentStreak ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Best</p>
                <p className="text-lg font-bold">
                  {selectedUser?.profile?.longestStreak ?? 0}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => selectedUser && toggleStatus(selectedUser)}
            >
              {selectedUser?.isActive ? (
                <Ban className="h-4 w-4" />
              ) : (
                <BadgeCheck className="h-4 w-4" />
              )}
              {selectedUser?.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => selectedUser && handleEdit(selectedUser)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <div>
              Deactivate{" "}
              <span className="font-medium">{selectedUser?.name}</span>? Their
              account will remain in the database but they will be marked
              inactive.
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={saving}
            >
              {saving ? "Deactivating..." : "Deactivate User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
