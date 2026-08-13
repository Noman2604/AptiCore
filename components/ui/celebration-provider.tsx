"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { toast } from "sonner"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"

type CelebrationDetail = {
  perfectScore?: boolean
  levelUp?: boolean
  newLevel?: number
  xpEarned?: number
  unlockedAchievements?: Array<{
    name: string
    description?: string
    pointsReward?: number
  }>
}

const CELEBRATION_EVENT = "apticore:celebrate"

export default function CelebrationProvider({
  children,
}: {
  children: ReactNode
}) {
  const confettiRef = useRef<ConfettiRef | null>(null)

  useEffect(() => {
    const handleCelebrate = (event: Event) => {
      const detail = (event as CustomEvent<CelebrationDetail>).detail
      if (!detail) return

      const particleCount = detail.perfectScore ? 120 : 80

      const commonOptions = {
        particleCount,
        spread: 75,
        startVelocity: 45,
        decay: 0.93,
        gravity: 0.9,
        scalar: 1,
        colors: ["#6ee7c9", "#8b7cf6", "#f5a623", "#f2555a"],
      }

      // 🎉 Left Corner
      void confettiRef.current?.fire({
        ...commonOptions,
        origin: { x: 0, y: 0.5 },
        angle: 60,
      })

      // 🎉 Right Corner
      setTimeout(() => {
        void confettiRef.current?.fire({
          ...commonOptions,
          origin: { x: 1, y: 0.5 },
          angle: 120,
        })
      }, 80)

      // ✨ Extra burst for perfect score
      if (detail.perfectScore) {
        setTimeout(() => {
          void confettiRef.current?.fire({
            particleCount: 180,
            spread: 120,
            startVelocity: 55,
            decay: 0.92,
            gravity: 0.8,
            scalar: 1.2,
            origin: { x: 0.5, y: 0.2 },
            colors: ["#6ee7c9", "#8b7cf6", "#f5a623", "#f2555a"],
          })
        }, 250)
      }

      // Toasts
      if (detail.perfectScore) {
        toast.success("Perfect Score! 🎉", {
          description: "You completed the test with 100% accuracy.",
        })
      }

      if (detail.levelUp) {
        toast.success("Level Up! 🚀", {
          description: `Congratulations! You reached Level ${detail.newLevel ?? 1}.`,
        })
      }

      if (detail.xpEarned) {
        toast.success(`+${detail.xpEarned} XP ⭐`, {
          description: "Great work! Keep practicing to earn more XP.",
        })
      }

      if (detail.unlockedAchievements?.length) {
        detail.unlockedAchievements.forEach((achievement, index) => {
          setTimeout(() => {
            toast.success(`🏅 ${achievement.name}`, {
              description:
                achievement.description ??
                `You earned ${achievement.pointsReward ?? 0} bonus XP.`,
            })
          }, index * 300)
        })
      }
    }

    window.addEventListener(
      CELEBRATION_EVENT,
      handleCelebrate as EventListener
    )

    return () => {
      window.removeEventListener(
        CELEBRATION_EVENT,
        handleCelebrate as EventListener
      )
    }
  }, [])

  return (
    <>
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-9999 h-screen w-screen"
      />
      {children}
    </>
  )
}