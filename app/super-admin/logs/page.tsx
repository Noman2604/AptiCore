"use client"

import React, { useEffect, useState } from "react"
import {
  FileText,
  Search,
  Filter,
  Eye,
  Calendar,
  User as UserIcon,
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

type AuditLogItem = {
  _id: string
  adminId: {
    _id: string
    name: string
    email: string
    role: string
  }
  actionType: "create" | "update" | "delete" | "ban" | "suspend"
  targetType: "user" | "question" | "test" | "category"
  targetId?: string
  changes?: Record<string, any>
  ipAddress?: string
  createdAt: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [targetFilter, setTargetFilter] = useState("all")
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/logs?limit=100")
        const json = await res.json()
        if (json.success) {
          setLogs(json.data)
          setFilteredLogs(json.data)
        } else {
          toast.error(json.error || "Failed to fetch audit logs")
        }
      } catch (err) {
        toast.error("Failed to load audit logs")
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  useEffect(() => {
    let result = logs

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.adminId?.name?.toLowerCase().includes(q) ||
          log.adminId?.email?.toLowerCase().includes(q) ||
          log.targetId?.toLowerCase().includes(q)
      )
    }

    if (actionFilter !== "all") {
      result = result.filter((log) => log.actionType === actionFilter)
    }

    if (targetFilter !== "all") {
      result = result.filter((log) => log.targetType === targetFilter)
    }

    setFilteredLogs(result)
  }, [searchQuery, actionFilter, targetFilter, logs])

  return (
    <div className="space-y-6 p-6 mt-10 sm:mt-2">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-amber-500" />
          Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Detailed trace of all admin actions, role modifications, and system updates.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <Card className="bg-card/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by admin name, email, or target ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="w-full md:w-48">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="ban">Ban</SelectItem>
                <SelectItem value="suspend">Suspend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select value={targetFilter} onValueChange={setTargetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Target Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AUDIT LOGS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading audit logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No audit logs matching filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4">Admin</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Target Entity</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((log) => {
                    const actionTone =
                      log.actionType === "create"
                        ? "text-emerald-500 bg-emerald-500/10"
                        : log.actionType === "delete"
                          ? "text-rose-500 bg-rose-500/10"
                          : log.actionType === "update"
                            ? "text-sky-500 bg-sky-500/10"
                            : "text-amber-500 bg-amber-500/10"

                    return (
                      <tr key={log._id} className="hover:bg-muted/20 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-slate-200 dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-400">
                              <UserIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                {log.adminId?.name || "Unknown"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {log.adminId?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${actionTone}`}>
                            {log.actionType}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold capitalize text-foreground">
                            {log.targetType}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            ID: {log.targetId ? log.targetId.substring(0, 12) + "..." : "N/A"}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-xs">
                          {log.ipAddress || "—"}
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(log.createdAt), "PPpp")}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Technical details and payload state parameters of the action event.
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-4 rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Action Performed By</div>
                  <div className="font-semibold mt-0.5">{selectedLog.adminId?.name || "N/A"}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{selectedLog.adminId?.email || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Event Timestamp</div>
                  <div className="font-semibold mt-0.5">{format(new Date(selectedLog.createdAt), "PPpp")}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">IP: {selectedLog.ipAddress || "Localhost"}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Affected State Parameter Changes</div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96 font-mono text-xs">
                  {selectedLog.changes ? (
                    <pre>{JSON.stringify(selectedLog.changes, null, 2)}</pre>
                  ) : (
                    <div className="text-slate-400 italic">No additional changes data available.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}