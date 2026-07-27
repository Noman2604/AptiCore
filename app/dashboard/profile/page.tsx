"use client"

import { useEffect, useState } from "react"
import {
  User,
  Phone,
  BookOpen,
  MapPin,
  GraduationCap,
  Building,
} from "lucide-react"

import { getInitials } from "@/lib/utils"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const profileFields = [
  {
    label: "Phone",
    field: "phone",
    icon: Phone,
  },
  {
    label: "College",
    field: "college",
    icon: BookOpen,
  },
  {
    label: "Degree",
    field: "degree",
    icon: BookOpen,
  },
  {
    label: "Specialization",
    field: "specialization",
    icon: BookOpen,
  },
  {
    label: "Location",
    field: "location",
    icon: User,
  },
]

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userdata, setUserData] = useState<any>(null)
  const [form, setForm] = useState({
    bio: "",
    phone: "",
    college: "",
    degree: "",
    specialization: "",
    location: "",
    linkedinUrl: "",
    dateOfBirth: "",
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  const handleEdit = () => {
    setForm({
      bio: user?.bio || "",
      phone: user?.phone || "",
      college: user?.college || "",
      degree: user?.degree || "",
      specialization: user?.specialization || "",
      location: user?.location || "",
      linkedinUrl: user?.linkedinUrl || "",

      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    })

    setEditing(true)
  }
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

        const userData = data.data
        console.log(userData)
        setUser(userData)

        setForm({
          bio: userData.bio || "",
          phone: userData.phone || "",
          college: userData.college || "",
          degree: userData.degree || "",
          specialization: userData.specialization || "",
          location: userData.location || "",
          linkedinUrl: userData.linkedinUrl || "",
          dateOfBirth: userData.dateOfBirth
            ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
            : "",
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)

      const { data } = await axios.patch(`/api/profile`, form)

      setUser(data.data)

      setEditing(false)
      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 3000)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-4 max-w-4xl space-y-6 sm:mx-auto md:mt-4 md:mb-4">
      <Card className="mt-20 md:mt-2">
        <CardContent className="pt-5">
          <div className="">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-22 w-22 items-center justify-center rounded-full bg-blue-900 text-4xl font-bold text-blue-400">
                    {getInitials(userdata?.name || "U")}
                  </div>
                </div>

                <div>
                  <h1 className="text-xl sm:text-3xl font-bold">{userdata?.name}</h1>

                  <p className="mt-1 text-xs text-slate-400">{userdata?.email}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded bg-blue-500/20 px-2 py-1 text-sm text-blue-400">
                      Level {user?.level || 1}
                    </span>

                    <span className="rounded bg-amber-500/20 px-2 py-1 text-sm text-amber-400">
                      {user?.totalXP || 0} XP
                    </span>

                    <span className="rounded bg-purple-500/20 px-2 py-1 text-sm text-purple-400">
                      {userdata?.role}
                    </span>
                  </div>
                </div>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl border px-5 py-2"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-xl border px-5 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={3}
              value={form.bio}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Mumbai, India"
                  value={form.location}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Your educational background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="college">College/University</Label>
            <div className="relative">
              <Building className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="college"
                placeholder="IIT Delhi"
                value={form.college}
                disabled={!editing}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <div className="relative">
                <GraduationCap className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="degree"
                  placeholder="B.Tech"
                  value={form.degree}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="Computer Science"
                value={form.specialization}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Social Profiles</CardTitle>
          <CardDescription>Link your professional profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <div className="relative">
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/johndoe"
                value={form.linkedinUrl || " "}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, linkedinUrl: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
