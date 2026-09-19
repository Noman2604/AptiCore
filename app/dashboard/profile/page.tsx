"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Phone,
  MapPin,
  Link as LinkIcon,
  FileText,
  Flame,
  Cake,
  Trophy,
  Camera,
  Loader2,
  Award,
  Medal,
  CalendarDays,
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowUpRight,
  Mail,
  Check,
  X,
  UserCheck,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
} from "lucide-react"
import axios from "axios"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"
import { cn, formatNumber, getInitials } from "@/lib/utils"
import {
  AvatarFrame,
  AvatarBorderModal,
  resolveAvatarBorder,
  type AvatarBorderStyle,
} from "@/components/ui/game-avatar"

type EducationLevel =
  | "SSC"
  | "HSC"
  | "Diploma"
  | "Graduation"
  | "Post Graduation"
  | "PhD"
  | "Certification"

type EducationStatus = "Pursuing" | "Completed" | "Dropped"

interface IEducation {
  level: EducationLevel
  status: EducationStatus
  institutionName: string
  universityOrBoard?: string
  degree?: string
  specialization?: string
  stream?: string
  medium?: string
  cgpa?: number
  percentage?: number
  startYear?: number
  endYear?: number
  passingYear?: number
  currentlyStudying?: boolean
}

interface EducationFormEntry {
  _key: string
  level: EducationLevel
  status: EducationStatus
  institutionName: string
  universityOrBoard: string
  degree: string
  specialization: string
  stream: string
  medium: string
  cgpa: string
  percentage: string
  startYear: string
  endYear: string
  passingYear: string
  currentlyStudying: boolean
}

interface UserData {
  id?: string
  name?: string
  email?: string
  role?: string
  createdAt?: string
}

interface ProfileData {
  bio?: string
  avatarUrl?: string
  avatarBorder?: AvatarBorderStyle
  phone?: string
  dateOfBirth?: string
  location?: string
  resumeUrl?: string
  linkedinUrl?: string
  education?: IEducation[]
  totalXP?: number
  level?: number
  currentStreak?: number
  longestStreak?: number
}

interface ProfileForm {
  bio: string
  phone: string
  location: string
  linkedinUrl: string
  resumeUrl: string
  dateOfBirth: string
  avatarBorder?: AvatarBorderStyle
  education: EducationFormEntry[]
}

const EMPTY_FORM: ProfileForm = {
  bio: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  resumeUrl: "",
  dateOfBirth: "",
  avatarBorder: "basic",
  education: [],
}

const EDUCATION_LEVELS: EducationLevel[] = [
  "SSC",
  "HSC",
  "Diploma",
  "Graduation",
  "Post Graduation",
  "PhD",
  "Certification",
]

const EDUCATION_STATUSES: EducationStatus[] = ["Pursuing", "Completed", "Dropped"]

const MEDIUM_OPTIONS = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Urdu",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Other",
]

const XP_PER_LEVEL = 500

function makeBlankEducation(): EducationFormEntry {
  return {
    _key: Math.random().toString(36).slice(2),
    level: "Graduation",
    status: "Pursuing",
    institutionName: "",
    universityOrBoard: "",
    degree: "",
    specialization: "",
    stream: "",
    medium: "",
    cgpa: "",
    percentage: "",
    startYear: "",
    endYear: "",
    passingYear: "",
    currentlyStudying: false,
  }
}

function toFormEntry(edu: IEducation): EducationFormEntry {
  return {
    _key: Math.random().toString(36).slice(2),
    level: edu.level,
    status: edu.status,
    institutionName: edu.institutionName || "",
    universityOrBoard: edu.universityOrBoard || "",
    degree: edu.degree || "",
    specialization: edu.specialization || "",
    stream: edu.stream || "",
    medium: edu.medium || "",
    cgpa: edu.cgpa !== undefined ? String(edu.cgpa) : "",
    percentage: edu.percentage !== undefined ? String(edu.percentage) : "",
    startYear: edu.startYear !== undefined ? String(edu.startYear) : "",
    endYear: edu.endYear !== undefined ? String(edu.endYear) : "",
    passingYear: edu.passingYear !== undefined ? String(edu.passingYear) : "",
    currentlyStudying: !!edu.currentlyStudying,
  }
}

function toApiEducation(entry: EducationFormEntry): IEducation | null {
  if (!entry.institutionName.trim()) return null
  return {
    level: entry.level,
    status: entry.status,
    institutionName: entry.institutionName.trim(),
    universityOrBoard: entry.universityOrBoard.trim() || undefined,
    degree: entry.degree.trim() || undefined,
    specialization: entry.specialization.trim() || undefined,
    stream: entry.stream.trim() || undefined,
    medium: entry.medium || undefined,
    cgpa: entry.cgpa ? Number(entry.cgpa) : undefined,
    percentage: entry.percentage ? Number(entry.percentage) : undefined,
    startYear: entry.startYear ? Number(entry.startYear) : undefined,
    endYear: entry.endYear ? Number(entry.endYear) : undefined,
    passingYear: entry.passingYear ? Number(entry.passingYear) : undefined,
    currentlyStudying: entry.currentlyStudying,
  }
}

function educationSortKey(edu: IEducation) {
  return edu.endYear || edu.passingYear || edu.startYear || 0
}

function formatMemberSince(value?: string) {
  if (!value) return null
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

const STATUS_CONFIG: Record<EducationStatus, { label: string; badgeClass: string; nodeClass: string }> = {
  Completed: {
    label: "Completed",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    nodeClass: "bg-emerald-500 ring-emerald-500/30",
  },
  Pursuing: {
    label: "Pursuing",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    nodeClass: "bg-amber-500 ring-amber-500/30",
  },
  Dropped: {
    label: "Dropped",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    nodeClass: "bg-rose-500 ring-rose-500/30",
  },
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<ProfileData | null>(null)
  const [userdata, setUserData] = useState<UserData | null>(null)
  const [form, setForm] = useState<ProfileForm>(() => {
    const cachedBorder =
      typeof window !== "undefined"
        ? (localStorage.getItem("apticore_avatar_border") as AvatarBorderStyle) || "basic"
        : "basic"
    return {
      ...EMPTY_FORM,
      avatarBorder: cachedBorder,
    }
  })
  const [educationList, setEducationList] = useState<EducationFormEntry[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isBorderModalOpen, setIsBorderModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (!isPhotoModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPhotoModalOpen(false)
        setZoomLevel(1)
        setRotation(0)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPhotoModalOpen])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [meRes, profileRes] = await Promise.all([
          axios.get("/api/auth/me"),
          axios.get("/api/profile"),
        ])

        if (meRes.data?.data) {
          setUserData(meRes.data.data)
        }

        if (profileRes.data?.data) {
          const profileData = profileRes.data.data
          const savedBorder =
            (profileData.avatarBorder as AvatarBorderStyle) ||
            (typeof window !== "undefined"
              ? (localStorage.getItem("apticore_avatar_border") as AvatarBorderStyle) || "basic"
              : "basic")

          setUser({
            ...profileData,
            avatarBorder: savedBorder,
          })
          setForm({
            bio: profileData.bio || "",
            phone: profileData.phone || "",
            location: profileData.location || "",
            linkedinUrl: profileData.linkedinUrl || "",
            resumeUrl: profileData.resumeUrl || "",
            avatarBorder: savedBorder,
            education: (profileData.education || []).map((edu: IEducation) => toFormEntry(edu)),
            dateOfBirth: profileData.dateOfBirth
              ? new Date(profileData.dateOfBirth).toISOString().split("T")[0]
              : "",
          })
          setEducationList(
            (profileData.education || []).map((edu: IEducation) => toFormEntry(edu))
          )
          if (typeof window !== "undefined" && profileData.avatarBorder) {
            localStorage.setItem("apticore_avatar_border", profileData.avatarBorder)
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  const handleEdit = () => {
    setForm({
      bio: user?.bio || "",
      phone: user?.phone || "",
      location: user?.location || "",
      linkedinUrl: user?.linkedinUrl || "",
      resumeUrl: user?.resumeUrl || "",
      avatarBorder: user?.avatarBorder || "basic",
      education: (user?.education || []).map((edu) => toFormEntry(edu)),
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    })
    setEducationList((user?.education || []).map((edu) => toFormEntry(edu)))
    setEditing(true)
  }

  const addEducation = () => {
    setEducationList((list) => [...list, makeBlankEducation()])
  }

  const removeEducation = (key: string) => {
    setEducationList((list) => list.filter((e) => e._key !== key))
  }

  const updateEducation = (key: string, patch: Partial<EducationFormEntry>) => {
    setEducationList((list) =>
      list.map((e) => (e._key === key ? { ...e, ...patch } : e))
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const education = educationList
        .map(toApiEducation)
        .filter((e): e is IEducation => e !== null)

      const payload = {
        ...form,
        avatarUrl: user?.avatarUrl || "",
        avatarBorder: form.avatarBorder || user?.avatarBorder || "basic",
        education,
      }
      const { data } = await axios.patch("/api/profile", payload)
      if (data?.data) {
        setUser(data.data)
        if (data.data.avatarBorder && typeof window !== "undefined") {
          localStorage.setItem("apticore_avatar_border", data.data.avatarBorder)
          window.dispatchEvent(
            new CustomEvent("apticore_avatar_border_changed", { detail: data.data.avatarBorder })
          )
        }
      }
      setEducationList((data.data.education || []).map((edu: IEducation) => toFormEntry(edu)))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile. Please check your inputs.")
    } finally {
      setSaving(false)
    }
  }

  const level = user?.level || 1
  const activeBorder = resolveAvatarBorder(form.avatarBorder || user?.avatarBorder, level)

  const handleBorderSelect = async (border: AvatarBorderStyle) => {
    setForm((prev) => ({ ...prev, avatarBorder: border }))
    setUser((prev) => (prev ? { ...prev, avatarBorder: border } : prev))
    if (typeof window !== "undefined") {
      localStorage.setItem("apticore_avatar_border", border)
      window.dispatchEvent(
        new CustomEvent("apticore_avatar_border_changed", { detail: border })
      )
    }
    try {
      const { data } = await axios.patch("/api/profile", { avatarBorder: border })
      if (data?.data) {
        setUser(data.data)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Failed to update avatar border:", err)
    }
  }

  const totalXP = user?.totalXP || 0
  const xpIntoLevel = totalXP % XP_PER_LEVEL
  const xpProgressPct = Math.min(100, Math.round((xpIntoLevel / XP_PER_LEVEL) * 100))
  const nextLevelThreshold = (Math.floor(totalXP / XP_PER_LEVEL) + 1) * XP_PER_LEVEL
  const currentStreak = user?.currentStreak || 0
  const longestStreak = user?.longestStreak || 0
  const memberSince = formatMemberSince(userdata?.createdAt)

  const sortedEducation = useMemo(() => {
    return [...(user?.education || [])].sort(
      (a, b) => educationSortKey(b) - educationSortKey(a)
    )
  }, [user?.education])

  // Profile Completeness Calculation
  const completeness = useMemo(() => {
    let score = 0
    const missing: string[] = []

    if (userdata?.name) score += 20
    if (user?.avatarUrl) score += 20
    else missing.push("Upload profile avatar")

    if (user?.bio?.trim()) score += 15
    else missing.push("Add a personal bio")

    if (user?.location || user?.phone) score += 15
    else missing.push("Add location or contact info")

    if (user?.education && user.education.length > 0) score += 15
    else missing.push("Add education history")

    if (user?.resumeUrl || user?.linkedinUrl) score += 15
    else missing.push("Attach LinkedIn or Resume")

    return { score, missing }
  }, [userdata, user])

  const stats = [
    {
      label: "Current Streak",
      value: `${currentStreak} Days`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Best Streak",
      value: `${longestStreak} Days`,
      icon: Award,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Total XP",
      value: `${formatNumber(totalXP)} XP`,
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Level Tier",
      value: `Level ${level}`,
      icon: Medal,
      color: "text-teal-500",
      bg: "bg-teal-500/10 border-teal-500/20",
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-[--ac-bg] text-[--ac-text]">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-teal-400/20" />
          <Loader2 className="h-6 w-6 animate-spin text-teal-500 dark:text-teal-400" />
        </div>
        <p className="font-[Space_Grotesk,sans-serif] text-sm font-medium text-[--ac-text-3]">
          Loading profile...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--ac-bg] pb-24 text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ================= SAVED TOAST ALERT ================= */}
        {saved && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        {/* ================= HERO & COVER CARD ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#10151d]/80 backdrop-blur-md shadow-sm">
          {/* Cover Mesh Banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-linear-to-r from-teal-500/30 via-purple-500/25 to-amber-500/30 border-b border-black/10 dark:border-white/10">
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-teal-400/20 blur-2xl" />
            <div className="pointer-events-none absolute right-10 top-5 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute right-1/3 -bottom-10 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />

            {/* Subtle Tag in banner */}
            <div className="absolute right-4 top-4 hidden sm:flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/30 dark:bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>AptiCore Learner Profile</span>
            </div>
          </div>

          {/* Profile Header Body */}
          <div className="relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + Main Info */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar with Gaming Border & Camera Trigger */}
                <div className="relative -mt-16 sm:-mt-20 shrink-0 mx-auto sm:mx-0">
                  <AvatarFrame
                    border={activeBorder}
                    size="2xl"
                    shape="rounded"
                  >
                    <div
                      onClick={() => {
                        if (user?.avatarUrl) {
                          setIsPhotoModalOpen(true)
                        }
                      }}
                      title={user?.avatarUrl ? "Click to view full photo" : undefined}
                      className={cn(
                        "group relative h-full w-full overflow-hidden rounded-3xl border-4 border-white dark:border-[#10151d] bg-linear-to-tr from-teal-500/30 to-purple-500/30 shadow-xl transition-all duration-300",
                        user?.avatarUrl && "cursor-pointer hover:scale-[1.02]"
                      )}
                    >
                      {user?.avatarUrl ? (
                        <>
                          <Image
                            src={user.avatarUrl}
                            alt="Profile avatar"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {/* Hover Overlay Hint */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                            <Eye className="h-6 w-6 text-white drop-shadow-md transition-transform duration-200 group-hover:scale-110" />
                            <span className="mt-1 font-[JetBrains_Mono,monospace] text-[10px] font-bold text-white tracking-wider uppercase drop-shadow-md">
                              View Photo
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-[Space_Grotesk,sans-serif] text-3xl font-extrabold text-[--ac-text]">
                          {getInitials(userdata?.name || "Learner")}
                        </div>
                      )}
                    </div>
                  </AvatarFrame>

                  {/* Camera Upload Button */}
                  <CldUploadWidget
                    uploadPreset="apticore"
                    onSuccess={async (result: any) => {
                      const newAvatarUrl = result?.info?.secure_url
                      if (!newAvatarUrl) return
                      setUploadingImage(true)
                      try {
                        const { data: profileRes } = await axios.patch("/api/profile", {
                          avatarUrl: newAvatarUrl,
                        })
                        setUser(profileRes.data)
                        setSaved(true)
                        setTimeout(() => setSaved(false), 3000)
                      } catch (err) {
                        console.error("Avatar update error:", err)
                        alert("Failed to update profile avatar.")
                      } finally {
                        setUploadingImage(false)
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        disabled={uploadingImage}
                        title="Upload new avatar photo"
                        className="absolute bottom-0 right-0 z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-[#10151d] bg-teal-500 text-slate-950 shadow-xl transition-all hover:scale-110 hover:bg-teal-400 active:scale-95 disabled:opacity-70 cursor-pointer"
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>

                {/* Name & Role */}
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[--ac-text] sm:text-3xl">
                      {userdata?.name || "Learner"}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      <Zap className="h-3 w-3" />
                      Lvl {level}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[--ac-text-3]">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {userdata?.email}
                    </span>
                    {memberSince && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        Member since {memberSince}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBorderModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 px-3.5 py-2.5 text-xs font-bold text-sky-600 dark:text-sky-300 transition active:scale-95 shadow-xs"
                  title="Customize Game Avatar Border"
                >
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  <span>Avatar Border</span>
                </button>

                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/20 transition hover:opacity-90 active:scale-95"
                  >
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-xs font-semibold text-[--ac-text] transition hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-teal-400 disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-4">
              {editing ? (
                <div className="space-y-1.5">
                  <label className="font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold uppercase tracking-wider text-[--ac-text-3]">
                    Bio & Aspirations
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Introduce yourself, your target placements, and skills..."
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c1017] p-3.5 text-xs text-[--ac-text] placeholder:text-[--ac-text-3] focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-[--ac-text-2] sm:text-sm">
                  {user?.bio || "No bio added yet. Click 'Edit Profile' to share your goals and target companies."}
                </p>
              )}
            </div>

            {/* XP Progress Bar */}
            <div className="mt-5 space-y-2 rounded-2xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-[Space_Grotesk,sans-serif] font-bold text-[--ac-text]">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  {formatNumber(totalXP)} Total XP
                </span>
                <span className="font-[JetBrains_Mono,monospace] text-[11px] text-[--ac-text-3]">
                  Next Level: {formatNumber(nextLevelThreshold)} XP
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-teal-400 via-purple-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${xpProgressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between font-[JetBrains_Mono,monospace] text-[10.5px] text-[--ac-text-3]">
                <span>Level {level} Progress</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{xpProgressPct}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATS TILES GRID ================= */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-xs",
                s.bg
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-[#10151d]/90 shadow-xs",
                  s.color
                )}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-[JetBrains_Mono,monospace] text-[10px] font-bold uppercase tracking-wider text-[--ac-text-3]">
                  {s.label}
                </p>
                <p className="truncate font-[Space_Grotesk,sans-serif] text-base font-extrabold text-[--ac-text] sm:text-lg">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PROFILE COMPLETION PROGRESS ================= */}
        {completeness.score < 100 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-teal-500/20 bg-linear-to-r from-teal-500/10 via-purple-500/5 to-transparent p-4 sm:p-5 backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-teal-500" />
                <span className="font-[Space_Grotesk,sans-serif] text-sm font-bold text-[--ac-text]">
                  Profile Completeness: {completeness.score}%
                </span>
              </div>
              <p className="text-xs text-[--ac-text-3]">
                Tip: {completeness.missing[0] || "Fill in your background details for recruiters."}
              </p>
            </div>

            <div className="w-full sm:w-56 space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-teal-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${completeness.score}%` }}
                />
              </div>
              <p className="text-right font-[JetBrains_Mono,monospace] text-[10px] text-[--ac-text-3]">
                {100 - completeness.score}% remaining
              </p>
            </div>
          </div>
        )}

        {/* ================= MAIN CONTENT: 2-COLUMN GRID ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: Personal Info & Links (4 cols on lg) */}
          <div className="space-y-6 lg:col-span-5">
            {/* About / Personal Info Card */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#10151d]/80 p-6 backdrop-blur-md shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
                  Personal Info
                </h2>
                <MapPin className="h-4 w-4 text-teal-500" />
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-[JetBrains_Mono,monospace] text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
                      Location / City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, India"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0c1017] pl-9 pr-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-[JetBrains_Mono,monospace] text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
                      <input
                        type="text"
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0c1017] pl-9 pr-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-[JetBrains_Mono,monospace] text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Cake className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0c1017] pl-9 pr-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 text-xs text-[--ac-text-2]">
                  <div className="flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 p-3">
                    <MapPin className="h-4 w-4 shrink-0 text-teal-500" />
                    <span className="truncate">{user?.location || "No location added"}</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 p-3">
                    <Phone className="h-4 w-4 shrink-0 text-purple-500" />
                    <span className="truncate">{user?.phone || "No phone added"}</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 p-3">
                    <CalendarDays className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>
                      {user?.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Birthday not added"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Links & Portfolio Card */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#10151d]/80 p-6 backdrop-blur-md shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
                  Professional Links
                </h2>
                <LinkIcon className="h-4 w-4 text-purple-500" />
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-[JetBrains_Mono,monospace] text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
                      Resume / CV Link
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={form.resumeUrl}
                        onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                        className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0c1017] pl-9 pr-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-[JetBrains_Mono,monospace] text-[10.5px] uppercase tracking-wider text-[--ac-text-3]">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--ac-text-3]" />
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={form.linkedinUrl}
                        onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                        className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0c1017] pl-9 pr-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user?.resumeUrl ? (
                    <a
                      href={user.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-teal-500/30 bg-teal-500/10 p-3.5 text-xs font-semibold text-teal-700 dark:text-teal-300 transition hover:bg-teal-500/15"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span>View Resume / CV</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-3 text-center text-xs text-[--ac-text-3]">
                      No resume linked yet
                    </div>
                  )}

                  {user?.linkedinUrl ? (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3.5 text-xs font-semibold text-purple-700 dark:text-purple-300 transition hover:bg-purple-500/15"
                    >
                      <div className="flex items-center gap-2.5">
                        <LinkIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>LinkedIn Profile</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-3 text-center text-xs text-[--ac-text-3]">
                      No LinkedIn profile linked
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Education Journey (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#10151d]/80 p-6 sm:p-7 backdrop-blur-md shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[--ac-text]">
                      Education History
                    </h2>
                    <p className="text-xs text-[--ac-text-3]">
                      Academic background and credentials
                    </p>
                  </div>
                </div>

                {editing && (
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 font-[JetBrains_Mono,monospace] text-xs font-bold text-teal-600 dark:text-teal-400 transition hover:bg-teal-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Entry</span>
                  </button>
                )}
              </div>

              {/* Education Content */}
              {editing ? (
                <div className="space-y-5">
                  {educationList.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-8 text-center text-xs text-[--ac-text-3]">
                      No education entries. Click &ldquo;Add Entry&rdquo; to add your school, college, or degree.
                    </div>
                  )}

                  {educationList.map((entry) => (
                    <div
                      key={entry._key}
                      className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 p-4.5 sm:p-5"
                    >
                      {/* Header of Entry */}
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-[JetBrains_Mono,monospace] text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          {entry.level || "New Education Entry"}
                        </span>
                        <button
                          onClick={() => removeEducation(entry._key)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-500/10"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            Level
                          </label>
                          <select
                            value={entry.level}
                            onChange={(e) =>
                              updateEducation(entry._key, { level: e.target.value as EducationLevel })
                            }
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-2.5 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          >
                            {EDUCATION_LEVELS.map((lvl) => (
                              <option key={lvl} value={lvl} className="dark:bg-[#10151d]">
                                {lvl}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            Status
                          </label>
                          <select
                            value={entry.status}
                            onChange={(e) =>
                              updateEducation(entry._key, { status: e.target.value as EducationStatus })
                            }
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-2.5 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          >
                            {EDUCATION_STATUSES.map((st) => (
                              <option key={st} value={st} className="dark:bg-[#10151d]">
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                          Institution / College Name
                        </label>
                        <input
                          type="text"
                          value={entry.institutionName}
                          onChange={(e) => updateEducation(entry._key, { institutionName: e.target.value })}
                          placeholder="e.g. Indian Institute of Technology"
                          className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                        />
                      </div>

                      <div className="mt-3 space-y-1">
                        <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                          University / Board
                        </label>
                        <input
                          type="text"
                          value={entry.universityOrBoard}
                          onChange={(e) => updateEducation(entry._key, { universityOrBoard: e.target.value })}
                          placeholder="e.g. CBSE, Mumbai University"
                          className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                        />
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={entry.degree}
                            onChange={(e) => updateEducation(entry._key, { degree: e.target.value })}
                            placeholder="e.g. B.Tech, B.Sc"
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            Specialization / Major
                          </label>
                          <input
                            type="text"
                            value={entry.specialization}
                            onChange={(e) => updateEducation(entry._key, { specialization: e.target.value })}
                            placeholder="e.g. Computer Science"
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            CGPA (0-10)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={entry.cgpa}
                            onChange={(e) => updateEducation(entry._key, { cgpa: e.target.value })}
                            placeholder="8.5"
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            Percentage
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={entry.percentage}
                            onChange={(e) => updateEducation(entry._key, { percentage: e.target.value })}
                            placeholder="85%"
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            Start Year
                          </label>
                          <input
                            type="number"
                            value={entry.startYear}
                            onChange={(e) => updateEducation(entry._key, { startYear: e.target.value })}
                            placeholder="2021"
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-[JetBrains_Mono,monospace] text-[10px] uppercase text-[--ac-text-3]">
                            {entry.currentlyStudying ? "End Year" : "Passing Year"}
                          </label>
                          <input
                            type="number"
                            value={entry.currentlyStudying ? entry.endYear : entry.passingYear}
                            onChange={(e) =>
                              updateEducation(
                                entry._key,
                                entry.currentlyStudying
                                  ? { endYear: e.target.value }
                                  : { passingYear: e.target.value }
                              )
                            }
                            placeholder="2025"
                            className="h-9 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c1017] px-3 text-xs text-[--ac-text] focus:border-teal-500/50 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-[--ac-text-3]">
                        <input
                          type="checkbox"
                          checked={entry.currentlyStudying}
                          onChange={(e) =>
                            updateEducation(entry._key, { currentlyStudying: e.target.checked })
                          }
                          className="h-4 w-4 rounded-md border-black/20 accent-teal-500"
                        />
                        Currently studying here
                      </label>
                    </div>
                  ))}
                </div>
              ) : sortedEducation.length > 0 ? (
                <div className="relative pl-6 space-y-8 before:absolute before:-left-1 before:top-15 before:bottom-15 before:w-0.5 before:bg-linear-to-b before:from-teal-500 before:via-purple-500 before:to-amber-500">
                  {sortedEducation.map((edu, idx) => {
                    const statusConfig = STATUS_CONFIG[edu.status] || STATUS_CONFIG.Completed
                    const years =
                      edu.startYear && (edu.endYear || edu.passingYear)
                        ? `${edu.startYear} — ${edu.currentlyStudying ? "Present" : edu.endYear || edu.passingYear}`
                        : edu.passingYear
                        ? `Batch of ${edu.passingYear}`
                        : null

                    return (
                      <div key={idx} className="relative group">
                        {/* Milestone Indicator Node */}
                        <div
                          className={cn(
                            "absolute -left-8.5 top-15 h-3.5 w-3.5 rounded-full ring-4 bg-white dark:bg-[#10151d] transition-transform group-hover:scale-125",
                            statusConfig.nodeClass
                          )}
                        />

                        <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 p-4 transition-all hover:bg-black/4 dark:hover:bg-white/4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-[Space_Grotesk,sans-serif] text-sm font-bold text-[--ac-text]">
                              {edu.institutionName}
                            </h3>
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] font-bold uppercase",
                                statusConfig.badgeClass
                              )}
                            >
                              {edu.status}
                            </span>
                          </div>

                          {edu.universityOrBoard && (
                            <p className="mt-0.5 text-xs text-[--ac-text-3]">
                              {edu.universityOrBoard}
                            </p>
                          )}

                          {(edu.degree || edu.specialization || edu.level) && (
                            <p className="mt-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                              {[edu.degree, edu.specialization].filter(Boolean).join(" · ") || edu.level}
                            </p>
                          )}

                          {edu.stream && (
                            <p className="mt-0.5 text-xs text-[--ac-text-3]">{edu.stream}</p>
                          )}

                          {/* Chips for Year, CGPA, Percentage */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {years && (
                              <span className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold text-[--ac-text-2]">
                                {years}
                              </span>
                            )}
                            {typeof edu.cgpa === "number" && (
                              <span className="rounded-md border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold text-teal-600 dark:text-teal-400">
                                CGPA {edu.cgpa}
                              </span>
                            )}
                            {typeof edu.percentage === "number" && (
                              <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-bold text-purple-600 dark:text-purple-400">
                                {edu.percentage}%
                              </span>
                            )}
                            {edu.medium && (
                              <span className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[10.5px] font-medium text-[--ac-text-3]">
                                {edu.medium} Medium
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <GraduationCap className="h-10 w-10 text-[--ac-text-3] opacity-30 mb-2" />
                  <p className="font-[Space_Grotesk,sans-serif] text-sm font-semibold text-[--ac-text-2]">
                    No education history added yet
                  </p>
                  <p className="text-xs text-[--ac-text-3] mt-1 max-w-xs">
                    Click &ldquo;Edit Profile&rdquo; to showcase your academic degrees, CGPA, and colleges.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ENHANCED FULLSCREEN PHOTO LIGHTBOX ================= */}
      {isPhotoModalOpen && user?.avatarUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setIsPhotoModalOpen(false)
            setZoomLevel(1)
            setRotation(0)
          }}
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-teal-500/20 blur-3xl -top-10 -left-10" />
          <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-purple-500/20 blur-3xl -bottom-10 -right-10" />

          {/* Modal Card */}
          <div
            className="relative flex flex-col items-center w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0b0f16]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex w-full items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <AvatarFrame border={activeBorder} size="sm" shape="rounded">
                  <div className="flex h-full w-full items-center justify-center bg-teal-500/20 font-[JetBrains_Mono,monospace] font-bold text-teal-300">
                    {getInitials(userdata?.name || "User")}
                  </div>
                </AvatarFrame>
                <div>
                  <h3 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-white">
                    {userdata?.name || "Profile Photo"}
                  </h3>
                  <p className="font-[JetBrains_Mono,monospace] text-xs text-slate-400">
                    Level {level} · {formatNumber(totalXP)} XP
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                  title="Zoom In"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
                  title="Zoom Out"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  title="Rotate 90°"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <a
                  href={user.avatarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="profile-avatar.jpg"
                  title="Open / Download Full Resolution"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsPhotoModalOpen(false)
                    setZoomLevel(1)
                    setRotation(0)
                  }}
                  title="Close (Esc)"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-200 transition ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Photo Canvas Container */}
            <div className="relative flex items-center justify-center overflow-hidden w-full h-90 sm:h-105 rounded-2xl bg-black/50 border border-white/10">
              <img
                src={user.avatarUrl}
                alt={userdata?.name || "Profile Photo"}
                className="max-h-full max-w-full object-contain rounded-xl transition-transform duration-200 select-none shadow-2xl"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
                draggable={false}
              />
            </div>

            {/* Modal Bottom Footer */}
            <div className="flex flex-wrap w-full items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="font-[JetBrains_Mono,monospace] px-2 py-0.5 rounded-md bg-white/10 text-teal-300 hover:bg-white/20 transition"
                  >
                    Reset Zoom ({Math.round(zoomLevel * 100)}%)
                  </button>
                )}
                <span className="text-[11px] text-slate-400">
                  Click outside or press <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-200">Esc</kbd> to exit
                </span>
              </div>

              {/* Cloudinary Change Photo Trigger inside Lightbox */}
              <CldUploadWidget
                uploadPreset="apticore"
                onSuccess={async (result: any) => {
                  const newAvatarUrl = result?.info?.secure_url
                  if (!newAvatarUrl) return
                  setUploadingImage(true)
                  try {
                    const { data: profileRes } = await axios.patch("/api/profile", {
                      avatarUrl: newAvatarUrl,
                    })
                    setUser(profileRes.data)
                    setSaved(true)
                    setTimeout(() => setSaved(false), 3000)
                  } catch (err) {
                    console.error("Avatar update error:", err)
                    alert("Failed to update profile avatar.")
                  } finally {
                    setUploadingImage(false)
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition"
                  >
                    <Camera className="h-3.5 w-3.5 text-teal-400" />
                    <span>Change Photo</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>
      )}

      {/* ================= GAMING AVATAR BORDER SELECTOR MODAL ================= */}
      <AvatarBorderModal
        isOpen={isBorderModalOpen}
        currentBorder={activeBorder}
        userLevel={level}
        avatarUrl={user?.avatarUrl}
        userName={userdata?.name || "Learner"}
        onClose={() => setIsBorderModalOpen(false)}
        onSelect={handleBorderSelect}
      />
    </div>
  )
}