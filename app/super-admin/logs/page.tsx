"use client"

import React, { useEffect, useState } from "react"
import {
  FileText,
  Search,
  Filter,
  Eye,
  Calendar,
  User as UserIcon,
  Server,
  Shield,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ActivityLogItem = {
  _id: string
  actorId?: {
    _id: string
    name: string
    email: string
    role: string
  }
  actorRole: "user" | "admin" | "super_admin" | "system" | "guest"
  actorName?: string
  actorEmail?: string
  action: string
  module: string
  status: "success" | "failure"
  targetType?: string
  targetId?: string
  targetLabel?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actorRoleFilter, setActorRoleFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ limit: "100" })
        if (actorRoleFilter !== "all") params.append("actorRole", actorRoleFilter)
        if (moduleFilter !== "all") params.append("module", moduleFilter)
        if (statusFilter !== "all") params.append("status", statusFilter)

        const res = await fetch(`/api/admin/logs?${params.toString()}`)
        const json = await res.json()
        if (json.success) {
          setLogs(json.data)
          setFilteredLogs(json.data)
        } else {
          toast.error(json.error || "Failed to fetch activity logs")
        }
      } catch (err) {
        toast.error("Failed to load activity logs")
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [actorRoleFilter, moduleFilter, statusFilter])

  useEffect(() => {
    let result = logs

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.actorName?.toLowerCase().includes(q) ||
          log.actorId?.name?.toLowerCase().includes(q) ||
          log.actorEmail?.toLowerCase().includes(q) ||
          log.actorId?.email?.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.targetLabel?.toLowerCase().includes(q) ||
          log.targetId?.toLowerCase().includes(q)
      )
    }

    setFilteredLogs(result)
  }, [searchQuery, logs])

  const getActorIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <ShieldAlert className="h-4 w-4 text-rose-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-sky-500" />
      case "system":
        return <Server className="h-4 w-4 text-amber-500" />
      default:
        return <UserIcon className="h-4 w-4 text-slate-500" />
    }
  }

  const getModuleBadge = (mod: string) => {
    switch (mod) {
      case "auth":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "result":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "test":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "question":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      case "bookmark":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "category":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
      case "user":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-amber-500" />
          Activity & Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Detailed trace of all system, user, and admin events across the platform.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <Card className="bg-card/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="flex-1 relative min-w-[250px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, action, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="w-full md:w-40">
            <Select value={actorRoleFilter} onValueChange={setActorRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-44">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="auth">Auth & Registration</SelectItem>
                <SelectItem value="result">Test Submissions</SelectItem>
                <SelectItem value="test">Tests</SelectItem>
                <SelectItem value="question">Questions</SelectItem>
                <SelectItem value="bookmark">Bookmarks</SelectItem>
                <SelectItem value="category">Categories</SelectItem>
                <SelectItem value="user">Users & Profile</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AUDIT LOGS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading activity logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No logs matching filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Event & Module</th>
                    <th className="p-4">Target Entity</th>
                    <th className="p-4">Status & IP</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((log) => {
                    const statusColor = log.status === "success" ? "text-emerald-500" : "text-rose-500"
                    const StatusIcon = log.status === "success" ? CheckCircle2 : AlertCircle

                    return (
                      <tr key={log._id} className="hover:bg-muted/20 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-1.5">
                              {getActorIcon(log.actorRole)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground flex items-center gap-1.5">
                                {log.actorId?.name || log.actorName || "System / Guest"}
                                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                                  {log.actorRole.replace("_", " ")}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {log.actorId?.email || log.actorEmail || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-foreground">
                            {log.action}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium border capitalize ${getModuleBadge(
                                log.module
                              )}`}
                            >
                              {log.module === "result" ? "test result" : log.module}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {log.targetType || log.targetId || log.targetLabel ? (
                            <>
                              <div className="font-medium capitalize text-foreground truncate max-w-[150px]">
                                {log.targetLabel || log.targetType}
                              </div>
                              {log.targetId && (
                                <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                                  {log.targetId}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-1 font-medium text-xs ${statusColor} uppercase`}>
                            <StatusIcon className="h-3 w-3" />
                            {log.status}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground mt-1">
                            {log.ipAddress || "Internal"}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedLog(log)}
                            aria-label="View log details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* INSPECT LOG DIALOG */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Event Details</DialogTitle>
            <DialogDescription>
              Technical details, state parameters, and payload data for the selected event.
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/40 p-4 rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Action</div>
                  <div className="font-semibold mt-0.5">{selectedLog.action}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Module</div>
                  <div className="font-semibold mt-0.5 capitalize">{selectedLog.module}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className={`font-semibold mt-0.5 uppercase ${selectedLog.status === "success" ? "text-emerald-500" : "text-rose-500"}`}>
                    {selectedLog.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Timestamp</div>
                  <div className="font-semibold mt-0.5">{format(new Date(selectedLog.createdAt), "PPpp")}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2 mb-2">
                    <UserIcon className="h-4 w-4" /> Actor Information
                  </h3>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Name:</span> {selectedLog.actorId?.name || selectedLog.actorName || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {selectedLog.actorId?.email || selectedLog.actorEmail || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Role:</span> <span className="uppercase text-xs font-semibold px-1 py-0.5 bg-muted rounded">{selectedLog.actorRole}</span>
                  </div>
                  <div className="text-sm font-mono text-xs break-all">
                    <span className="text-muted-foreground font-sans text-sm">ID:</span> {selectedLog.actorId?._id || "N/A"}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2 mb-2">
                    <Server className="h-4 w-4" /> Network & Target
                  </h3>
                  <div className="text-sm">
                    <span className="text-muted-foreground">IP Address:</span> <span className="font-mono text-xs">{selectedLog.ipAddress || "N/A"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">User Agent:</span> <span className="text-xs">{selectedLog.userAgent || "N/A"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Target Type:</span> {selectedLog.targetType || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Target ID:</span> <span className="font-mono text-xs break-all">{selectedLog.targetId || "N/A"}</span>
                  </div>
                </div>
              </div>

              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Event Data & Changes
                  </div>
                  {selectedLog.details.before || selectedLog.details.after ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto font-mono text-xs">
                        <div className="text-rose-400 mb-2 font-sans font-semibold border-b border-slate-700 pb-1">Before</div>
                        <pre>{JSON.stringify(selectedLog.details.before, null, 2)}</pre>
                      </div>
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto font-mono text-xs">
                        <div className="text-emerald-400 mb-2 font-sans font-semibold border-b border-slate-700 pb-1">After</div>
                        <pre>{JSON.stringify(selectedLog.details.after, null, 2)}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96 font-mono text-xs">
                      <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}