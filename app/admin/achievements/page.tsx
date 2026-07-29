"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  Award,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type CriteriaType =
  | "score"
  | "streak"
  | "test_count"
  | "accuracy"
  | "time_spent"
type Rarity = "common" | "rare" | "epic" | "legendary"

type Achievement = {
  _id: string
  name: string
  description?: string
  iconUrl?: string
  criteriaType: CriteriaType
  criteriaValue: number
  pointsReward: number
  rarity: Rarity
  isActive: boolean
  createdAt?: string
}

const criteriaOptions: { value: CriteriaType; label: string }[] = [
  { value: "score", label: "Score" },
  { value: "streak", label: "Streak" },
  { value: "test_count", label: "Test Count" },
  { value: "accuracy", label: "Accuracy" },
  { value: "time_spent", label: "Time Spent" },
]

const rarityOptions: { value: Rarity; label: string }[] = [
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
]

function formatRequirement(item: Achievement) {
  if (item.criteriaType === "accuracy" || item.criteriaType === "score") {
    return `${item.criteriaValue}%`
  }

  if (item.criteriaType === "time_spent") {
    return `${item.criteriaValue} min`
  }

  return item.criteriaValue.toLocaleString()
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [criteriaType, setCriteriaType] = useState<CriteriaType>("score")
  const [criteriaValue, setCriteriaValue] = useState<number | "">(0)
  const [pointsReward, setPointsReward] = useState<number | "">(0)
  const [rarity, setRarity] = useState<Rarity>("common")
  const [isActive, setIsActive] = useState(true)

  const loadAchievements = async () => {
    const res = await fetch("/api/admin/achievements", {
      credentials: "include",
    })
    const json = await res.json()

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to fetch achievements")
    }

    setAchievements(json.data ?? [])
  }

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        await loadAchievements()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load achievements"
        )
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  const stats = useMemo(() => {
    return {
      total: achievements.length,
      active: achievements.filter((item) => item.isActive).length,
      inactive: achievements.filter((item) => !item.isActive).length,
    }
  }, [achievements])

  const resetForm = () => {
    setName("")
    setDescription("")
    setIconUrl("")
    setCriteriaType("score")
    setCriteriaValue(0)
    setPointsReward(0)
    setRarity("common")
    setIsActive(true)
  }

  const openCreateSheet = () => {
    resetForm()
    setSheetOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return toast.error("Achievement name is required")
    if (criteriaValue === "" || Number(criteriaValue) < 0)
      return toast.error("Criteria value must be a valid number")
    if (pointsReward === "" || Number(pointsReward) < 0)
      return toast.error("Points reward must be a valid number")

    try {
      setSaving(true)
      const res = await fetch("/api/admin/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          iconUrl: iconUrl.trim() || undefined,
          criteriaType,
          criteriaValue: Number(criteriaValue),
          pointsReward: Number(pointsReward),
          rarity,
          isActive,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create achievement")
      }

      toast.success("Achievement created")
      setSheetOpen(false)
      await loadAchievements()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create achievement"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-12 space-y-6 p-6 sm:mt-2 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">
                Achievements
              </CardTitle>
              <CardDescription className="mt-2">
                View all achievements and add a new one from this page.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              
              <div className="flex flex-wrap items-center gap-2">
                {" "}
                <Button onClick={openCreateSheet}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Achievement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void loadAchievements()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Total: {stats.total}</Badge>
                <Badge>Active: {stats.active}</Badge>
                <Badge variant="outline">Inactive: {stats.inactive}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              All achievements
            </div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Active
            </div>
            <div className="text-3xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              Rarity spread
            </div>
            <div className="text-3xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
          <CardDescription>
            These are the achievements saved in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              Loading...
            </div>
          ) : achievements.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No achievements yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Click Add Achievement to create the first one.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {achievements.map((achievement) => (
                <div key={achievement._id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <Badge
                          variant={
                            achievement.isActive ? "default" : "secondary"
                          }
                        >
                          {achievement.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-muted-foreground">Criteria</span>
                      <div className="font-medium capitalize">
                        {achievement.criteriaType}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Requirement</span>
                      <div className="font-medium">
                        {formatRequirement(achievement)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Points</span>
                      <div className="font-medium">
                        {achievement.pointsReward}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Icon</span>
                      <div className="font-medium break-all">
                        {achievement.iconUrl || "No icon URL"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Achievement</SheetTitle>
            <SheetDescription>
              Create a new achievement, then it will appear in the list above.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Speed Runner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Achievement description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconUrl">Icon URL</Label>
              <Input
                id="iconUrl"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Criteria Type</Label>
              <Select
                value={criteriaType}
                onValueChange={(v) => setCriteriaType(v as CriteriaType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select criteria type" />
                </SelectTrigger>
                <SelectContent>
                  {criteriaOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="criteriaValue">Criteria Value</Label>
              <Input
                id="criteriaValue"
                type="number"
                min={0}
                value={String(criteriaValue)}
                onChange={(e) =>
                  setCriteriaValue(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsReward">Points Reward</Label>
              <Input
                id="pointsReward"
                type="number"
                min={0}
                value={String(pointsReward)}
                onChange={(e) =>
                  setPointsReward(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Rarity</Label>
              <Select
                value={rarity}
                onValueChange={(v) => setRarity(v as Rarity)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  {rarityOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="text-sm font-medium">Active</div>
                <div className="text-xs text-muted-foreground">
                  Turn off if you want to keep it hidden.
                </div>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Achievement"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSheetOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
