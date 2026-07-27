import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("shimmer rounded-lg", className)} />
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

export function TestCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="space-y-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
