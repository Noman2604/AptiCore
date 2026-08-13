"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import {
  Phone,
  MapPin,
  Link as LinkIcon,
  FileText,
  Flame,
  Cake,
  Trophy,
  CameraOff,
  Camera,
  Loader2,
  Award,
  Medal,
  CalendarDays,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react"
import axios from "axios"
import Image from "next/image"
import { getInitials } from "@/lib/utils"

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
  education: EducationFormEntry[]
}

interface LeaderboardEntry {
  rank: number
  totalXP: number
  totalTestsTaken: number
  averageAccuracy: number
  level: number
  userId: { _id: string; name?: string; email?: string }
}

const EMPTY_FORM: ProfileForm = {
  bio: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  resumeUrl: "",
  dateOfBirth: "",
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
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

const STATUS_STYLES: Record<EducationStatus, { color: string; bg: string; border: string }> = {
  Completed: { color: "#3ecf8e", bg: "rgba(62,207,142,0.1)", border: "rgba(62,207,142,0.35)" },
  Pursuing: { color: "#f5a623", bg: "rgba(245,166,35,0.1)", border: "rgba(245,166,35,0.35)" },
  Dropped: { color: "#f2555a", bg: "rgba(242,85,90,0.1)", border: "rgba(242,85,90,0.35)" },
}

function fieldInput(props: {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  placeholder: string
  value: string
  editing: boolean
  onChange: (value: string) => void
  type?: string
}) {
  const Icon = props.icon
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={props.id}
        className="font-[JetBrains_Mono,monospace] text-[10.5px] tracking-wider text-[#5b6577] uppercase"
      >
        {props.label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5b6577]" />
        )}
        <input
          id={props.id}
          type={props.type || "text"}
          placeholder={props.placeholder}
          value={props.value}
          disabled={!props.editing}
          onChange={(e) => props.onChange(e.target.value)}
          className={`w-full rounded-lg border border-[#212a37] bg-[#10151d] py-2.5 text-[13.5px] text-[#e7ecf3] outline-none transition placeholder:text-[#5b6577] focus:border-[#6ee7c9] disabled:opacity-60 ${
            Icon ? "pl-9 pr-3.5" : "px-3.5"
          }`}
        />
      </div>
    </div>
  )
}

function MiniField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="font-[JetBrains_Mono,monospace] text-[9.5px] tracking-wider text-[#5b6577] uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

const miniInputClass =
  "w-full rounded-md border border-[#212a37] bg-[#141b25] px-2.5 py-2 text-[12.5px] text-[#e7ecf3] outline-none transition placeholder:text-[#5b6577] focus:border-[#6ee7c9]"

const CHART_TOOLTIP_STYLE = {
  background: "#141b25",
  border: "1px solid #212a37",
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "JetBrains Mono, monospace",
  color: "#e7ecf3",
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<ProfileData | null>(null)
  const [userdata, setUserData] = useState<UserData | null>(null)
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM)
  const [educationList, setEducationList] = useState<EducationFormEntry[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  useEffect(() => {
    const getuserdata = async () => {
      try {
        const { data } = await axios.get("/api/auth/me")
        setUserData(data.data)
      } catch (error) {
        console.error(error)
      }
    }
    getuserdata()
  }, [])

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get("/api/profile")
        const profileData = data.data
        setUser(profileData)

        setForm({
          bio: profileData.bio || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          linkedinUrl: profileData.linkedinUrl || "",
          resumeUrl: profileData.resumeUrl || "",
          education: (profileData.education || []).map((edu: IEducation) => toFormEntry(edu)),
          dateOfBirth: profileData.dateOfBirth
            ? new Date(profileData.dateOfBirth).toISOString().split("T")[0]
            : "",
        })

        setEducationList(
          (profileData.education || []).map((edu: IEducation) => toFormEntry(edu))
        )
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  const handleEdit = () => {
    setForm({
      bio: user?.bio || "",
      phone: user?.phone || "",
      location: user?.location || "",
      linkedinUrl: user?.linkedinUrl || "",
      resumeUrl: user?.resumeUrl || "",
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

  const updateEducation = (
    key: string,
    patch: Partial<EducationFormEntry>
  ) => {
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
        education,
      }
      const { data } = await axios.patch(`/api/profile`, payload)
      setUser(data.data)
      setEducationList((data.data.education || []).map((edu: IEducation) => toFormEntry(edu)))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, or WEBP).")
      return
    }

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append("file", file)

      const { data } = await axios.post("/api/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const avatarUrl = data?.data?.avatarUrl
      if (!avatarUrl) throw new Error("No avatar URL returned")

      const { data: profileData } = await axios.patch("/api/profile", {
        avatarUrl,
      })

      setUser(profileData.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error(error)
      alert("Failed to upload profile image. Please try again.")
    } finally {
      setUploadingImage(false)
      event.target.value = ""
    }
  }

  const level = user?.level || 1
  const totalXP = user?.totalXP || 0
  const xpIntoLevel = totalXP % XP_PER_LEVEL
  const xpProgressPct = Math.min(100, (xpIntoLevel / XP_PER_LEVEL) * 100)
  const nextLevelThreshold = (Math.floor(totalXP / XP_PER_LEVEL) + 1) * XP_PER_LEVEL
  const currentStreak = user?.currentStreak || 0
  const longestStreak = user?.longestStreak || 0
  const memberSince = formatMemberSince(userdata?.createdAt)

  const sortedEducation = useMemo(() => {
    return [...(user?.education || [])].sort(
      (a, b) => educationSortKey(b) - educationSortKey(a)
    )
  }, [user?.education])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e14] font-[Inter,sans-serif] text-sm text-[#8a96a8]">
        <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ee7c9]" />
        Loading profile...
      </div>
    )
  }

  const stats = [
    { label: "Current Streak", value: `${currentStreak} Days`, icon: Flame, color: "#f2896b" },
    { label: "Best Streak", value: `${longestStreak} Days`, icon: Award, color: "#8b7cf6" },
    { label: "Total XP", value: `${totalXP.toLocaleString()} XP`, icon: Trophy, color: "#f5a623" },
    { label: "Level", value: `${level}`, icon: Medal, color: "#3ecf8e" },
  ]

  return (
    <div
      className="min-h-full bg-[#0a0e14] font-[Inter,sans-serif] text-[#e7ecf3]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(139,124,246,0.06), transparent 40%), radial-gradient(circle at 85% 10%, rgba(110,231,201,0.05), transparent 40%)",
      }}
    >
      <div className="mx-auto max-w-5xl space-y-5 px-4 pt-20 pb-12 sm:px-6 md:pt-8">
        {showAvatarModal && user?.avatarUrl && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowAvatarModal(false)}
          >
            <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-3 right-3 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-sm text-white"
              >
                ✕
              </button>
              <Image
                src={user.avatarUrl}
                alt="Profile preview"
                className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
                width={800}
                height={800}
              />
            </div>
          </div>
        )}

        {saved && (
          <div className="rounded-lg border border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.1)] px-4 py-2.5 font-[JetBrains_Mono,monospace] text-[12.5px] text-[#3ecf8e]">
            ✓ Profile updated
          </div>
        )}

        {/* ============ HERO ============ */}
        <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative mx-auto shrink-0 sm:mx-0">
                {user?.avatarUrl ? (
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="overflow-hidden rounded-full"
                  >
                    <Image
                      src={user.avatarUrl}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                      width={112}
                      height={112}
                    />
                  </button>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#6ee7c9] to-[#8b7cf6] font-[Space_Grotesk,sans-serif] text-3xl font-bold text-[#08110d] sm:h-28 sm:w-28">
                    {getInitials(userdata?.name || "U")}
                  </div>
                )}

                <span className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#10151d] bg-linear-to-br font-[Space_Grotesk,sans-serif] text-[11px] font-bold text-[#0d0819]">
                  <label className="absolute flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#212a37] bg-[#141b25] text-[#6ee7c9] shadow-[0_0_0_3px_#10151d] hover:bg-[#1a212b]">
                  {editing ? (
                    uploadingImage ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )
                  ) : (
                    <CameraOff className="h-3.5 w-3.5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={!editing || uploadingImage}
                  />
                </label>
                </span>

                
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold sm:text-3xl">
                  {userdata?.name}
                </h1>

                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={2}
                    placeholder="Tell us about yourself..."
                    className="mt-2 w-full resize-y rounded-lg border border-[#212a37] bg-[#141b25] px-3 py-2 text-[13.5px] text-[#e7ecf3] outline-none placeholder:text-[#5b6577] focus:border-[#6ee7c9]"
                  />
                ) : (
                  <p className="mt-1.5 max-w-xl text-[13.5px] leading-6 text-[#8a96a8]">
                    {user?.bio || "No bio added yet."}
                  </p>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center justify-center gap-1.5 font-[Space_Grotesk,sans-serif] text-base font-bold sm:justify-start">
                    <Trophy className="h-4 w-4 text-[#f5a623]" />
                    {totalXP.toLocaleString()} XP
                  </span>
                  <span className="font-[JetBrains_Mono,monospace] text-[11.5px] text-[#5b6577]">
                    Next Level: {nextLevelThreshold.toLocaleString()} XP
                  </span>
                </div>

                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#212a37]">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#8b7cf6] to-[#6ee7c9] transition-[width] duration-500"
                      style={{ width: `${xpProgressPct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 font-[JetBrains_Mono,monospace] text-[11px] text-[#6ee7c9]">
                    {Math.round(xpProgressPct)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-center gap-2.5 sm:justify-start">
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="rounded-lg border border-[#212a37] bg-transparent px-5 py-2.5 text-[13px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-[#212a37] bg-transparent px-5 py-2.5 text-[13px] font-semibold text-[#8a96a8] transition hover:border-[#3a4a5e] hover:text-[#e7ecf3]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-linear-to-br from-[#6ee7c9] to-[#57c9a8] px-5 py-2.5 text-[13px] font-bold text-[#06120d] transition hover:brightness-105 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#212a37] pt-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-xl border p-3.5"
                style={{ borderColor: `${s.color}30`, backgroundColor: `${s.color}0d` }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${s.color}1a`, color: s.color }}
                >
                  <s.icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p
                    className="truncate font-[JetBrains_Mono,monospace] text-[9.5px] font-semibold tracking-wider uppercase"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </p>
                  <p className="font-[Space_Grotesk,sans-serif] text-base font-bold text-[#e7ecf3]">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ ABOUT / LINKS + EDUCATION ============ */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
          {/* Left column */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5">
              <h2 className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold">About</h2>

              {editing ? (
                <div className="mt-4 space-y-3.5">
                  {fieldInput({
                    id: "location",
                    label: "Location",
                    icon: MapPin,
                    placeholder: "Mumbai, India",
                    value: form.location,
                    editing,
                    onChange: (v) => setForm({ ...form, location: v }),
                  })}
                  {fieldInput({
                    id: "phone",
                    label: "Phone",
                    icon: Phone,
                    placeholder: "+91 98765 43210",
                    value: form.phone,
                    editing,
                    onChange: (v) => setForm({ ...form, phone: v }),
                  })}
                  {fieldInput({
                    id: "dateOfBirth",
                    label: "Date of birth",
                    icon: Cake,
                    placeholder: "",
                    value: form.dateOfBirth,
                    editing,
                    onChange: (v) => setForm({ ...form, dateOfBirth: v }),
                    type: "date",
                  })}
                </div>
              ) : (
                <div className="mt-4 space-y-3 text-[13.5px]">
                  <div className="flex items-center gap-2.5 text-[#c3cbd8]">
                    <MapPin className="h-4 w-4 shrink-0 text-[#5b6577]" />
                    {user?.location || "Not added"}
                  </div>
                  <div className="flex items-center gap-2.5 text-[#c3cbd8]">
                    <Phone className="h-4 w-4 shrink-0 text-[#5b6577]" />
                    {user?.phone || "Not added"}
                  </div>
                  <div className="flex items-center gap-2.5 text-[#c3cbd8]">
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#5b6577]" />
                    {user?.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not added"}
                  </div>
                </div>
              )}

              {memberSince && (
                <p className="mt-4 border-t border-[#212a37] pt-3.5 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577]">
                  Member since {memberSince}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5">
              <h2 className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold">Links</h2>

              {editing ? (
                <div className="mt-4 space-y-3.5">
                  {fieldInput({
                    id: "resume",
                    label: "Resume URL",
                    icon: FileText,
                    placeholder: "https://drive.google.com/...",
                    value: form.resumeUrl,
                    editing,
                    onChange: (v) => setForm({ ...form, resumeUrl: v }),
                  })}
                  {fieldInput({
                    id: "linkedin",
                    label: "LinkedIn URL",
                    icon: LinkIcon,
                    placeholder: "https://linkedin.com/in/johndoe",
                    value: form.linkedinUrl,
                    editing,
                    onChange: (v) => setForm({ ...form, linkedinUrl: v }),
                  })}
                </div>
              ) : (
                <div className="mt-4 space-y-2.5">
                  {user?.resumeUrl ? (
                    <a
                      href={user.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg bg-[#141b25] px-4 py-2.5 text-[13.5px] font-semibold text-[#e7ecf3] transition hover:bg-[#1a212b]"
                    >
                      <FileText className="h-4 w-4 text-[#8a96a8]" />
                      View Resume
                    </a>
                  ) : (
                    <p className="rounded-lg border border-dashed border-[#212a37] px-4 py-2.5 text-[13px] text-[#5b6577]">
                      No resume added
                    </p>
                  )}
                  {user?.linkedinUrl ? (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.08)] px-4 py-2.5 text-[13.5px] font-semibold text-[#6ee7c9] transition hover:bg-[rgba(110,231,201,0.14)]"
                    >
                      <LinkIcon className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
                  ) : (
                    <p className="rounded-lg border border-dashed border-[#212a37] px-4 py-2.5 text-[13px] text-[#5b6577]">
                      No LinkedIn added
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column — Education */}
          <div className="rounded-2xl border border-[#212a37] bg-[#10151d] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#8b7cf6]" />
                <h2 className="font-[Space_Grotesk,sans-serif] text-[16px] font-bold">
                  Education
                </h2>
              </div>
              {editing && (
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1.5 rounded-lg border border-[rgba(110,231,201,0.3)] bg-[rgba(110,231,201,0.08)] px-3 py-1.5 font-[JetBrains_Mono,monospace] text-[11px] font-semibold text-[#6ee7c9] transition hover:bg-[rgba(110,231,201,0.14)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              )}
            </div>

            {editing ? (
              <div className="mt-4 space-y-4">
                {educationList.length === 0 && (
                  <p className="text-[13px] text-[#5b6577]">
                    No education entries yet. Click "Add" to create one.
                  </p>
                )}

                {educationList.map((entry) => (
                  <div
                    key={entry._key}
                    className="rounded-xl border border-[#212a37] bg-[#141b25] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-[JetBrains_Mono,monospace] text-[10.5px] font-semibold tracking-wider text-[#8b7cf6] uppercase">
                        {entry.level || "New entry"}
                      </span>
                      <button
                        onClick={() => removeEducation(entry._key)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#f2555a]/70 transition hover:bg-[rgba(242,85,90,0.1)] hover:text-[#f2555a]"
                        aria-label="Remove education entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <MiniField label="Level">
                        <select
                          value={entry.level}
                          onChange={(e) =>
                            updateEducation(entry._key, { level: e.target.value as EducationLevel })
                          }
                          className={miniInputClass}
                        >
                          {EDUCATION_LEVELS.map((l) => (
                            <option key={l} value={l} className="bg-[#141b25]">
                              {l}
                            </option>
                          ))}
                        </select>
                      </MiniField>
                      <MiniField label="Status">
                        <select
                          value={entry.status}
                          onChange={(e) =>
                            updateEducation(entry._key, { status: e.target.value as EducationStatus })
                          }
                          className={miniInputClass}
                        >
                          {EDUCATION_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#141b25]">
                              {s}
                            </option>
                          ))}
                        </select>
                      </MiniField>
                    </div>

                    <div className="mt-3">
                      <MiniField label="Institution Name">
                        <input
                          value={entry.institutionName}
                          onChange={(e) =>
                            updateEducation(entry._key, { institutionName: e.target.value })
                          }
                          placeholder="IIT Delhi"
                          className={miniInputClass}
                        />
                      </MiniField>
                    </div>

                    <div className="mt-3">
                      <MiniField label="University / Board">
                        <input
                          value={entry.universityOrBoard}
                          onChange={(e) =>
                            updateEducation(entry._key, { universityOrBoard: e.target.value })
                          }
                          placeholder="e.g. CBSE, Anna University"
                          className={miniInputClass}
                        />
                      </MiniField>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <MiniField label="Degree">
                        <input
                          value={entry.degree}
                          onChange={(e) => updateEducation(entry._key, { degree: e.target.value })}
                          placeholder="B.Tech"
                          className={miniInputClass}
                        />
                      </MiniField>
                      <MiniField label="Specialization">
                        <input
                          value={entry.specialization}
                          onChange={(e) =>
                            updateEducation(entry._key, { specialization: e.target.value })
                          }
                          placeholder="Computer Science"
                          className={miniInputClass}
                        />
                      </MiniField>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <MiniField label="Stream">
                        <input
                          value={entry.stream}
                          onChange={(e) => updateEducation(entry._key, { stream: e.target.value })}
                          placeholder="Science / Commerce"
                          className={miniInputClass}
                        />
                      </MiniField>
                      <MiniField label="Medium">
                        <select
                          value={entry.medium}
                          onChange={(e) => updateEducation(entry._key, { medium: e.target.value })}
                          className={miniInputClass}
                        >
                          <option value="" className="bg-[#141b25]">
                            Not specified
                          </option>
                          {MEDIUM_OPTIONS.map((m) => (
                            <option key={m} value={m} className="bg-[#141b25]">
                              {m}
                            </option>
                          ))}
                        </select>
                      </MiniField>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <MiniField label="CGPA">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={entry.cgpa}
                          onChange={(e) => updateEducation(entry._key, { cgpa: e.target.value })}
                          placeholder="8.5"
                          className={miniInputClass}
                        />
                      </MiniField>
                      <MiniField label="Percentage">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={entry.percentage}
                          onChange={(e) => updateEducation(entry._key, { percentage: e.target.value })}
                          placeholder="85"
                          className={miniInputClass}
                        />
                      </MiniField>
                      <MiniField label="Start Year">
                        <input
                          type="number"
                          min="1950"
                          value={entry.startYear}
                          onChange={(e) => updateEducation(entry._key, { startYear: e.target.value })}
                          placeholder="2021"
                          className={miniInputClass}
                        />
                      </MiniField>
                      <MiniField label={entry.currentlyStudying ? "End Year" : "Passing Year"}>
                        <input
                          type="number"
                          min="1950"
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
                          className={miniInputClass}
                        />
                      </MiniField>
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12px] text-[#8a96a8]">
                      <input
                        type="checkbox"
                        checked={entry.currentlyStudying}
                        onChange={(e) =>
                          updateEducation(entry._key, { currentlyStudying: e.target.checked })
                        }
                        className="h-3.5 w-3.5 rounded border-[#212a37] bg-[#141b25] accent-[#6ee7c9]"
                      />
                      Currently studying here
                    </label>
                  </div>
                ))}
              </div>
            ) : sortedEducation.length > 0 ? (
              <div className="mt-5 space-y-6">
                {sortedEducation.map((edu, idx) => {
                  const statusStyle = STATUS_STYLES[edu.status]
                  const isLast = idx === sortedEducation.length - 1
                  const years =
                    edu.startYear && (edu.endYear || edu.passingYear)
                      ? `${edu.startYear} — ${edu.currentlyStudying ? "Present" : edu.endYear || edu.passingYear}`
                      : edu.passingYear
                        ? `Passed ${edu.passingYear}`
                        : null

                  return (
                    <div key={idx} className="relative pl-6">
                      <span className="absolute top-1 left-0 h-3 w-3 rounded-full border-2 border-[#6456d4] bg-[#1e2e47]" />
                      {!isLast && (
                        <span className="absolute top-4 left-[4.5px] h-[calc(100%+12px)] w-0.5 bg-linear-to-r from-[#5a49d7] to-[#6ee7c9]" />
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-semibold text-[#e7ecf3]">
                          {edu.institutionName}
                        </p>
                        <span
                          className="rounded-full border px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] font-semibold"
                          style={{
                            color: statusStyle.color,
                            backgroundColor: statusStyle.bg,
                            borderColor: statusStyle.border,
                          }}
                        >
                          {edu.status}
                        </span>
                      </div>

                      {edu.universityOrBoard && (
                        <p className="mt-0.5 text-[12px] text-[#5b6577]">{edu.universityOrBoard}</p>
                      )}

                      {(edu.degree || edu.specialization || edu.level) && (
                        <p className="mt-1 text-[13.5px] font-medium text-[#6ee7c9]">
                          {[edu.degree, edu.specialization].filter(Boolean).join(" · ") || edu.level}
                        </p>
                      )}

                      {edu.stream && (
                        <p className="mt-0.5 text-[13px] text-[#8a96a8]">{edu.stream}</p>
                      )}

                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-[JetBrains_Mono,monospace] text-[11px] text-[#5b6577]">
                        {years && <span>{years}</span>}
                        {typeof edu.cgpa === "number" && <span>CGPA {edu.cgpa}</span>}
                        {typeof edu.percentage === "number" && <span>{edu.percentage}%</span>}
                        {edu.medium && <span>{edu.medium} medium</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-[13px] text-[#5b6577]">
                No education details added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}