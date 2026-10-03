"use client"

import { useEffect, useId, useState, type RefObject } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  routing?: "orthogonal" | "curved"
  connection?: "bottom-to-top" | "side-to-side"
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  repeat?: number
  repeatDelay?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
  showVias?: boolean
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  routing = "orthogonal",
  connection = "bottom-to-top",
  curvature = 0,
  reverse = false,
  duration = 3.2,
  delay = 0,
  pathColor = "currentColor",
  pathWidth = 2,
  pathOpacity = 0.15,
  gradientStartColor = "#6ee7c9",
  gradientStopColor = "#8b7cf6",
  repeat = Infinity,
  repeatDelay = 0.2,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  showVias = true,
}) => {
  const id = useId()
  const [pathD, setPathD] = useState("")
  const [points, setPoints] = useState({ startX: 0, startY: 0, endX: 0, endY: 0, midX: 0, midY: 0 })
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        let startX = 0
        let startY = 0
        let endX = 0
        let endY = 0
        let d = ""

        if (connection === "bottom-to-top") {
          // Bottom center of Card A -> Top center of Card B
          startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
          startY = rectA.bottom - containerRect.top + startYOffset

          endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
          endY = rectB.top - containerRect.top + endYOffset

          const midY = (startY + endY) / 2
          setPoints({ startX, startY, endX, endY, midX: (startX + endX) / 2, midY })

          if (routing === "orthogonal") {
            const radius = Math.min(16, Math.max(6, Math.abs(midY - startY) / 2, Math.abs(endX - startX) / 4))

            if (startX <= endX) {
              // Drops down from A bottom -> turns right -> runs horizontal -> turns down -> enters B top
              d = `M ${startX},${startY} V ${midY - radius} Q ${startX},${midY} ${startX + radius},${midY} H ${endX - radius} Q ${endX},${midY} ${endX},${midY + radius} V ${endY}`
            } else {
              // Drops down from A bottom -> turns left -> runs horizontal -> turns down -> enters B top
              d = `M ${startX},${startY} V ${midY - radius} Q ${startX},${midY} ${startX - radius},${midY} H ${endX + radius} Q ${endX},${midY} ${endX},${midY + radius} V ${endY}`
            }
          } else {
            // Smooth vertical S-Curve
            d = `M ${startX},${startY} C ${startX},${midY} ${endX},${midY} ${endX},${endY}`
          }
        } else {
          // Side-to-side connection
          startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset
          endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset

          if (rectA.right <= rectB.left) {
            startX = rectA.right - containerRect.left + startXOffset
            endX = rectB.left - containerRect.left + endXOffset
          } else if (rectA.left >= rectB.right) {
            startX = rectA.left - containerRect.left + startXOffset
            endX = rectB.right - containerRect.left + endXOffset
          } else {
            startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
            endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
          }

          const midX = (startX + endX) / 2
          setPoints({ startX, startY, endX, endY, midX, midY: (startY + endY) / 2 })

          if (routing === "orthogonal") {
            const radius = Math.min(16, Math.abs(endY - startY) / 3, Math.abs(endX - startX) / 3)
            if (startX <= endX) {
              d = `M ${startX},${startY} H ${midX - radius} Q ${midX},${startY} ${midX},${startY + radius} V ${endY - radius} Q ${midX},${endY} ${midX + radius},${endY} H ${endX}`
            } else {
              d = `M ${startX},${startY} H ${midX + radius} Q ${midX},${startY} ${midX},${startY + radius} V ${endY - radius} Q ${midX},${endY} ${midX - radius},${endY} H ${endX}`
            }
          } else if (curvature === 0) {
            d = `M ${startX},${startY} C ${midX},${startY} ${midX},${endY} ${endX},${endY}`
          } else {
            const controlY = startY - curvature
            d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
          }
        }

        setPathD(d)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    updatePath()

    return () => {
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    routing,
    connection,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <defs>
        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={points.startX}
          y1={points.startY}
          x2={points.endX}
          y2={points.endY}
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0.1" />
          <stop offset="45%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* ── 1. Static PCB Motherboard Trace ──────────────────────── */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      {/* ── 2. Animated Glowing Laser Pulse (Next.js Style) ──────── */}
      <motion.path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth + 1.5}
        strokeLinecap="round"
        filter={`url(#glow-${id})`}
        initial={{
          pathOffset: reverse ? 1 : 0,
          pathLength: 0.28,
          opacity: 0,
        }}
        animate={{
          pathOffset: reverse ? [1, 0] : [0, 1],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          delay,
          duration,
          ease: "easeInOut",
          repeat,
          repeatDelay,
        }}
      />

      {/* ── 3. Terminal Vias & Routing Nodes ─────────────────────── */}
      {showVias && points.startX > 0 && (
        <>
          {/* Start terminal via at bottom center of Card A */}
          <circle
            cx={points.startX}
            cy={points.startY}
            r="5"
            fill="currentColor"
            className="text-background dark:text-[#0c1017]"
            stroke={gradientStartColor}
            strokeWidth="2"
          />
          <circle
            cx={points.startX}
            cy={points.startY}
            r="2"
            fill={gradientStartColor}
          />

          {/* Intermediate PCB routing via */}
          <circle
            cx={points.midX}
            cy={points.midY}
            r="3"
            className="fill-border stroke-muted-foreground/30 dark:fill-[#1b2333] dark:stroke-white/20"
            strokeWidth="1"
          />
          <circle
            cx={points.midX}
            cy={points.midY}
            r="1"
            className="fill-muted-foreground/60 dark:fill-white/40"
          />

          {/* End terminal via at top center of Card B */}
          <circle
            cx={points.endX}
            cy={points.endY}
            r="5"
            fill="currentColor"
            className="text-background dark:text-[#0c1017]"
            stroke={gradientStopColor}
            strokeWidth="2"
          />
          <circle
            cx={points.endX}
            cy={points.endY}
            r="2"
            fill={gradientStopColor}
          />
        </>
      )}
    </svg>
  )
}
