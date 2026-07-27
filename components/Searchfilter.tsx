"use client"
import { useState, useRef, useEffect } from "react"
import { Search, X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (val: string) => void
  className?: string
}
export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("group relative", className)}>
      <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-sky-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-9 pl-10 text-sm transition-all outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

interface FilterOption {
  label: string
  value: string
}
interface SelectFilterProps {
  label: string
  options: FilterOption[]
  value: string
  onChange: (val: string) => void
}
export function SelectFilter({
  label,
  options,
  value,
  onChange,
}: SelectFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all",
          value
            ? "border-sky-500/50 bg-sky-500/10 text-sky-400"
            : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-sky-500/30 hover:text-[hsl(var(--foreground))]"
        )}
      >
        {selected?.label || label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="animate-fade-in absolute top-full left-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2.5 text-sm transition-colors hover:bg-[hsl(var(--surface-hover))]",
                value === opt.value
                  ? "text-sky-400"
                  : "text-[hsl(var(--foreground))]"
              )}
            >
              {opt.label}
              {value === opt.value && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (p: number) => void
}
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1
    if (page <= 3) return i + 1
    if (page >= totalPages - 2) return totalPages - 4 + i
    return page - 2 + i
  })

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="h-8 rounded-lg border border-[hsl(var(--border))] px-3 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--surface-hover))] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "h-8 w-8 rounded-lg text-xs font-medium transition-all",
            p === page
              ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
              : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--surface-hover))]"
          )}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="h-8 rounded-lg border border-[hsl(var(--border))] px-3 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--surface-hover))] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
