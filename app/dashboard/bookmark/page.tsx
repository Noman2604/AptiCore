"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Pencil,
  Save,
  Clock,
  Filter,
  Eye,
  EyeOff,
  Layers,
  AlertCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface QuestionOption {
  text: string
  order?: number
  isCorrect?: boolean
}

interface QuestionData {
  _id: string
  questionText: string
  options?: QuestionOption[]
  correctAnswer?: string
  explanation?: string
  difficultyLevel?: "easy" | "medium" | "hard"
  categoryId?: {
    _id?: string
    name?: string
    slug?: string
  }
}

interface BookmarkItem {
  _id: string
  notes?: string
  createdAt: string
  questionId: QuestionData | null
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  medium: {
    label: "Medium",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  hard: {
    label: "Hard",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
}

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Interactive state per question
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({})
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<string, number>>({})
  const [editingNotes, setEditingNotes] = useState<Record<string, boolean>>({})
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({})
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/bookmarks", { withCredentials: true })
      if (res.data?.success) {
        const validBookmarks = (res.data.data || []).filter(
          (b: BookmarkItem) => b.questionId !== null
        )
        setBookmarks(validBookmarks)
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error)
      toast.error("Failed to load bookmarked questions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  // Categories extracted from loaded bookmarks
  const categories = useMemo(() => {
    const map = new Map<string, string>()
    bookmarks.forEach((b) => {
      const cat = b.questionId?.categoryId
      if (cat?._id && cat?.name) {
        map.set(cat.slug || cat._id, cat.name)
      }
    })
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }))
  }, [bookmarks])

  // Filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const q = b.questionId
      if (!q) return false

      // Difficulty filter
      if (selectedDifficulty !== "all" && q.difficultyLevel !== selectedDifficulty) {
        return false
      }

      // Category filter
      if (selectedCategory !== "all") {
        const catSlug = q.categoryId?.slug || q.categoryId?._id
        if (catSlug !== selectedCategory) return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const textMatch = q.questionText?.toLowerCase().includes(query)
        const notesMatch = b.notes?.toLowerCase().includes(query)
        const catMatch = q.categoryId?.name?.toLowerCase().includes(query)
        const explanationMatch = q.explanation?.toLowerCase().includes(query)
        if (!textMatch && !notesMatch && !catMatch && !explanationMatch) {
          return false
        }
      }

      return true
    })
  }, [bookmarks, searchQuery, selectedDifficulty, selectedCategory])

  // Count by difficulty
  const counts = useMemo(() => {
    let easy = 0
    let medium = 0
    let hard = 0
    let withNotes = 0
    bookmarks.forEach((b) => {
      const diff = b.questionId?.difficultyLevel
      if (diff === "easy") easy++
      else if (diff === "medium") medium++
      else if (diff === "hard") hard++
      if (b.notes && b.notes.trim()) withNotes++
    })
    return { total: bookmarks.length, easy, medium, hard, withNotes }
  }, [bookmarks])

  // Remove Bookmark
  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      setDeletingId(bookmarkId)
      const res = await axios.delete(`/api/bookmarks/${bookmarkId}`, {
        withCredentials: true,
      })
      if (res.data?.success) {
        setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId))
        toast.success("Bookmark removed successfully")
      } else {
        toast.error(res.data?.error || "Failed to remove bookmark")
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
      toast.error("Network error removing bookmark")
    } finally {
      setDeletingId(null)
    }
  }

  // Save Note
  const handleSaveNote = async (bookmarkId: string) => {
    try {
      setSavingNotes((prev) => ({ ...prev, [bookmarkId]: true }))
      const noteText = notesDrafts[bookmarkId] ?? ""
      const res = await axios.put(
        `/api/bookmarks/${bookmarkId}`,
        { notes: noteText },
        { withCredentials: true }
      )
      if (res.data?.success) {
        setBookmarks((prev) =>
          prev.map((b) => (b._id === bookmarkId ? { ...b, notes: noteText } : b))
        )
        setEditingNotes((prev) => ({ ...prev, [bookmarkId]: false }))
        toast.success("Revision note saved")
      } else {
        toast.error(res.data?.error || "Failed to save note")
      }
    } catch (error) {
      console.error("Error saving note:", error)
      toast.error("Failed to update note")
    } finally {
      setSavingNotes((prev) => ({ ...prev, [bookmarkId]: false }))
    }
  }

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
    // Auto reveal upon selection
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }))
  }

  const toggleAllAnswers = (reveal: boolean) => {
    const updated: Record<string, boolean> = {}
    filteredBookmarks.forEach((b) => {
      if (b.questionId?._id) {
        updated[b.questionId._id] = reveal
      }
    })
    setRevealedAnswers(updated)
  }

  return (
    <div className="min-h-screen bg-[--ac-bg] text-[--ac-text] transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* ================= HEADER HERO BANNER ================= */}
        <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-linear-to-br from-amber-500/10 via-purple-500/5 to-teal-500/10 p-5 sm:p-7 backdrop-blur-sm shadow-sm">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/2 h-56 w-56 rounded-full bg-teal-400/15 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Bookmark className="h-3.5 w-3.5 fill-current" />
                <span>Personal Study Deck</span>
              </div>
              <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-[--ac-text]">
                Saved Bookmarks
              </h1>
              <p className="text-xs sm:text-sm text-[--ac-text-2] max-w-xl">
                Revisit questions you flagged during mock tests. Self-test your knowledge, review explanations, and add personal study notes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/tests">
                <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#06120d] shadow-sm shadow-teal-500/20 transition hover:brightness-105 active:scale-98 cursor-pointer">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Practice Tests</span>
                </button>
              </Link>
            </div>
          </div>

          {/* KPI Summary Bar */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="rounded-xl border border-black/5 dark:border-white/5 bg-white/70 dark:bg-white/3 p-3 backdrop-blur-md">
              <span className="text-[11px] font-medium text-[--ac-text-3] uppercase tracking-wider">Total Saved</span>
              <p className="text-xl font-bold text-[--ac-text]">{counts.total}</p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 backdrop-blur-md">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Easy</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{counts.easy}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 backdrop-blur-md">
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Medium</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{counts.medium}</p>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 backdrop-blur-md">
              <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">Hard</span>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{counts.hard}</p>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & FILTER BAR ================= */}
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--ac-text-3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question text, notes, or topic..."
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/2 py-2 pl-9 pr-4 text-xs sm:text-sm text-[--ac-text] placeholder:text-[--ac-text-3] focus:border-teal-500 focus:outline-none transition"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Tabs */}
            <div className="flex rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/2 p-1">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                    selectedDifficulty === diff
                      ? "bg-white dark:bg-[#1b2330] text-[--ac-text] shadow-xs"
                      : "text-[--ac-text-3] hover:text-[--ac-text]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Category Dropdown if available */}
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/2 px-3 py-2 text-xs font-semibold text-[--ac-text] focus:outline-none cursor-pointer"
              >
                <option value="all">All Topics</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {/* Reveal / Hide All Answers Toggle */}
            <button
              onClick={() => {
                const someRevealed = Object.values(revealedAnswers).some(Boolean)
                toggleAllAnswers(!someRevealed)
              }}
              className="flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/2 px-3 py-2 text-xs font-semibold text-[--ac-text-2] hover:text-[--ac-text] hover:bg-[--ac-hover] transition cursor-pointer"
              title="Toggle answers visibility"
            >
              {Object.values(revealedAnswers).some(Boolean) ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Hide Answers</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-teal-500" />
                  <span className="hidden sm:inline">Show All Answers</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= QUESTIONS LIST ================= */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <div className="space-y-5">
            {filteredBookmarks.map((bookmark, idx) => {
              const q = bookmark.questionId
              if (!q) return null

              const isRevealed = revealedAnswers[q._id] || false
              const selectedOptIdx = userSelectedOptions[q._id]
              const diffConfig = q.difficultyLevel
                ? DIFFICULTY_CONFIG[q.difficultyLevel]
                : DIFFICULTY_CONFIG.medium

              const isEditingNote = editingNotes[bookmark._id] || false
              const draftNote = notesDrafts[bookmark._id] ?? (bookmark.notes || "")
              const isSavingNote = savingNotes[bookmark._id] || false

              return (
                <div
                  key={bookmark._id}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-5 sm:p-6 shadow-sm transition hover:border-black/15 dark:hover:border-white/20 space-y-4"
                >
                  {/* Card Header: Badges & Actions */}
                  <div className="flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-[Space_Grotesk,sans-serif] text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400">
                        Question #{idx + 1}
                      </span>

                      {/* Topic Badge */}
                      {q.categoryId?.name && (
                        <span className="rounded-full border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-white/3 px-2.5 py-0.5 text-[10.5px] font-medium text-[--ac-text-2]">
                          {q.categoryId.name}
                        </span>
                      )}

                      {/* Difficulty Badge */}
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold ${diffConfig.badge}`}
                      >
                        {diffConfig.label}
                      </span>

                      {/* Date Added */}
                      <span className="hidden sm:inline text-[11px] text-[--ac-text-3]">
                        Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* Toggle Solution */}
                      <button
                        onClick={() => toggleReveal(q._id)}
                        className="flex items-center gap-1 rounded-xl border border-black/10 dark:border-white/10 px-2.5 py-1 text-xs font-semibold text-[--ac-text-2] hover:bg-[--ac-hover] hover:text-[--ac-text] transition cursor-pointer"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Hide Answer</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 text-teal-500" />
                            <span className="hidden sm:inline">Reveal Answer</span>
                          </>
                        )}
                      </button>

                      {/* Delete Bookmark */}
                      <button
                        onClick={() => handleRemoveBookmark(bookmark._id)}
                        disabled={deletingId === bookmark._id}
                        title="Remove bookmark"
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2">
                    <p className="font-[Space_Grotesk,sans-serif] text-sm sm:text-base font-semibold text-[--ac-text] leading-relaxed">
                      {q.questionText}
                    </p>
                  </div>

                  {/* Options List */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const optionLetter = String.fromCharCode(65 + optIdx)
                        const isSelected = selectedOptIdx === optIdx
                        const isCorrectAnswer =
                          opt.isCorrect ||
                          q.correctAnswer?.trim().toLowerCase() === opt.text?.trim().toLowerCase() ||
                          q.correctAnswer?.trim().toUpperCase() === optionLetter

                        let optionStyle =
                          "border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/2 text-[--ac-text] hover:bg-slate-100 dark:hover:bg-white/[0.05]"

                        if (isRevealed) {
                          if (isCorrectAnswer) {
                            optionStyle =
                              "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                          } else if (isSelected && !isCorrectAnswer) {
                            optionStyle =
                              "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300 line-through"
                          }
                        } else if (isSelected) {
                          optionStyle =
                            "border-teal-500/50 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold"
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q._id, optIdx)}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-xs sm:text-sm transition cursor-pointer select-none ${optionStyle}`}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-current font-bold text-xs">
                              {optionLetter}
                            </span>
                            <span className="min-w-0 flex-1">{opt.text}</span>
                            {isRevealed && isCorrectAnswer && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                            )}
                            {isRevealed && isSelected && !isCorrectAnswer && (
                              <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Solution & Explanation Box (Visible when revealed) */}
                  {isRevealed && (
                    <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300">
                        <CheckCircle2 className="h-4 w-4 text-teal-500" />
                        <span>Correct Answer: {q.correctAnswer || "Refer to options"}</span>
                      </div>
                      {q.explanation ? (
                        <div className="text-xs sm:text-[13px] text-[--ac-text-2] leading-relaxed pt-1">
                          <span className="font-semibold text-[--ac-text]">Explanation: </span>
                          {q.explanation}
                        </div>
                      ) : (
                        <p className="text-xs text-[--ac-text-3] italic">
                          No detailed explanation available for this question.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Personal Revision Notes Section */}
                  <div className="rounded-xl border border-black/5 dark:border-white/5 bg-slate-50/70 dark:bg-white/1.5 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[--ac-text-2]">
                        <Pencil className="h-3.5 w-3.5 text-amber-500" />
                        <span>Revision Notes</span>
                      </div>

                      {!isEditingNote ? (
                        <button
                          onClick={() => {
                            setNotesDrafts((prev) => ({
                              ...prev,
                              [bookmark._id]: bookmark.notes || "",
                            }))
                            setEditingNotes((prev) => ({ ...prev, [bookmark._id]: true }))
                          }}
                          className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                        >
                          {bookmark.notes ? "Edit Note" : "+ Add Note"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setEditingNotes((prev) => ({ ...prev, [bookmark._id]: false }))
                            }
                            className="text-[11px] text-[--ac-text-3] hover:text-[--ac-text]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(bookmark._id)}
                            disabled={isSavingNote}
                            className="flex items-center gap-1 rounded-lg bg-teal-500 px-2 py-0.5 text-[11px] font-bold text-black hover:bg-teal-400 transition cursor-pointer disabled:opacity-50"
                          >
                            <Save className="h-3 w-3" />
                            <span>{isSavingNote ? "Saving..." : "Save"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditingNote ? (
                      <textarea
                        value={draftNote}
                        onChange={(e) =>
                          setNotesDrafts((prev) => ({
                            ...prev,
                            [bookmark._id]: e.target.value,
                          }))
                        }
                        placeholder="Write personal formulas, shortcuts, or key concepts to remember..."
                        rows={2}
                        className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#141b25] p-2.5 text-xs text-[--ac-text] placeholder:text-[--ac-text-3] focus:border-teal-500 focus:outline-none transition resize-none"
                      />
                    ) : bookmark.notes ? (
                      <p className="text-xs text-[--ac-text-2] italic bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
                        "{bookmark.notes}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-[--ac-text-3]">
                        No personal notes yet. Click "+ Add Note" to jot down memory aids or formulas.
                      </p>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-card dark:bg-[#10151d] p-10 sm:p-14 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Bookmark className="h-8 w-8" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="font-[Space_Grotesk,sans-serif] text-lg sm:text-xl font-bold text-[--ac-text]">
                {searchQuery || selectedDifficulty !== "all" || selectedCategory !== "all"
                  ? "No matching bookmarked questions"
                  : "Your Bookmark Deck is Empty"}
              </h3>
              <p className="text-xs sm:text-sm text-[--ac-text-2] leading-relaxed">
                {searchQuery || selectedDifficulty !== "all" || selectedCategory !== "all"
                  ? "Try adjusting your search query or difficulty filters to see your saved questions."
                  : "While taking mock tests or reviewing your test results, click the Bookmark icon on any tricky question to save it here for targeted revision."}
              </p>
            </div>

            {searchQuery || selectedDifficulty !== "all" || selectedCategory !== "all" ? (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedDifficulty("all")
                  setSelectedCategory("all")
                }}
                className="rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-semibold text-[--ac-text] hover:bg-[--ac-hover] transition cursor-pointer"
              >
                Clear all filters
              </button>
            ) : (
              <Link href="/dashboard/tests">
                <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#6ee7c9] to-[#3ecf8e] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#06120d] shadow-sm shadow-teal-500/20 transition hover:brightness-105 active:scale-98 cursor-pointer">
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Practice Tests</span>
                </button>
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
