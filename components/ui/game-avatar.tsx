"use client"

import React, { useState } from "react"
import {
  Sparkles,
  Lock,
  Check,
  X,
  Shield,
  Trophy,
  Compass,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type AvatarBorderStyle =
  | "basic"
  | "elemental_fire_ice"
  | "valkyrie_wings"
  | "cyber_lotus"
  | "abyssal_shallows"
  | "solar_phoenix"
  | "mecha_sentinel"
  | "gladiator_legion"
  | "prismatic_crystal"
  | "golden_lion"

export interface AvatarBorderConfig {
  id: AvatarBorderStyle
  name: string
  category: "all" | "challenges" | "streak" | "level"
  description: string
  unlockText: string
  minLevel: number
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic"
  glowColor: string
}

export const AVATAR_BORDER_CONFIGS: Record<AvatarBorderStyle, AvatarBorderConfig> = {
  basic: {
    id: "basic",
    name: "Standard",
    category: "all",
    description: "Classic profile frame without gaming adornments.",
    unlockText: "Reach Level 1 in Aptitude",
    minLevel: 1,
    rarity: "common",
    glowColor: "#94a3b8",
  },
  elemental_fire_ice: {
    id: "elemental_fire_ice",
    name: "Frostfire Harmony",
    category: "streak",
    description: "Twin elements of blazing crimson flame and eternal glacial frost woven in gold.",
    unlockText: "Reach Level 3 in Aptitude",
    minLevel: 3,
    rarity: "epic",
    glowColor: "#f97316",
  },
  valkyrie_wings: {
    id: "valkyrie_wings",
    name: "Sovereign Valkyrie",
    category: "level",
    description: "Angelic silver & gold winged blades bearing a legendary sword and ruby crest.",
    unlockText: "Reach Level 5 in Aptitude",
    minLevel: 5,
    rarity: "legendary",
    glowColor: "#fbbf24",
  },
  cyber_lotus: {
    id: "cyber_lotus",
    name: "Apex Coder",
    category: "challenges",
    description: "Cyberpunk neon magenta dragon with glowing autumn leaf and developer crest.",
    unlockText: "Reach Level 4 in Aptitude",
    minLevel: 4,
    rarity: "epic",
    glowColor: "#d946ef",
  },
  abyssal_shallows: {
    id: "abyssal_shallows",
    name: "Voyager Oceanus",
    category: "challenges",
    description: "Carved golden ship helm, billowing sail, and crashing deep ocean waves.",
    unlockText: "Reach Level 6 in Aptitude",
    minLevel: 6,
    rarity: "mythic",
    glowColor: "#0284c7",
  },
  solar_phoenix: {
    id: "solar_phoenix",
    name: "Solar Phoenix",
    category: "streak",
    description: "A blazing coronal flare of rebirth for dedicated daily problem solvers.",
    unlockText: "Reach Level 8 in Aptitude",
    minLevel: 8,
    rarity: "legendary",
    glowColor: "#f59e0b",
  },
  mecha_sentinel: {
    id: "mecha_sentinel",
    name: "Mecha Sentinel",
    category: "level",
    description: "High-tech composite cyber plating engineered with cyan plasma energy vents.",
    unlockText: "Reach Level 7 in Aptitude",
    minLevel: 7,
    rarity: "rare",
    glowColor: "#06b6d4",
  },
  gladiator_legion: {
    id: "gladiator_legion",
    name: "Gladiator Legion",
    category: "challenges",
    description: "Honored Roman centurion helmet with victory stars and crimson ribbon.",
    unlockText: "Achieve Top 10 on the Global Leaderboard",
    minLevel: 10,
    rarity: "mythic",
    glowColor: "#ef4444",
  },
  prismatic_crystal: {
    id: "prismatic_crystal",
    name: "Prismatic Apex",
    category: "level",
    description: "Faceted tournament diamond geometry flashing with azure and coral crystal shards.",
    unlockText: "Reach Grandmaster Level 12",
    minLevel: 12,
    rarity: "mythic",
    glowColor: "#38bdf8",
  },
  golden_lion: {
    id: "golden_lion",
    name: "Campus Sovereign",
    category: "challenges",
    description: "Imperial gold beast guard with deep navy lacquer awarded to campus toppers.",
    unlockText: "Achieve Top Performer on the Global Leaderboard",
    minLevel: 9,
    rarity: "legendary",
    glowColor: "#eab308",
  },
}

export const AVATAR_BORDER_LIST: AvatarBorderConfig[] = Object.values(AVATAR_BORDER_CONFIGS)

export function resolveAvatarBorder(
  selectedBorder?: string | null,
  userLevel = 1
): AvatarBorderStyle {
  if (selectedBorder && selectedBorder in AVATAR_BORDER_CONFIGS) {
    return selectedBorder as AvatarBorderStyle
  }
  return "basic"
}


interface BorderGraphicProps {
  border: AvatarBorderStyle
}

function BorderGraphic({ border }: BorderGraphicProps) {
  switch (border) {
    case "abyssal_shallows":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="abyssalWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#034694" />
            </linearGradient>
            <linearGradient id="abyssalGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
          </defs>

          {/* Squircle Ocean Wave Outer Rim */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#abyssalWave)"
            strokeWidth="5"
          />

          {/* Rolling wave crest on bottom */}
          <path
            d="M 6 74 C 12 90, 26 96, 50 96 C 74 96, 88 90, 94 76 C 88 88, 68 92, 50 92 C 32 92, 14 86, 6 74 Z"
            fill="#38bdf8"
          />
          <path
            d="M 12 84 Q 24 94 44 92 Q 32 86 12 84 Z"
            fill="#e0f2fe"
          />

          {/* Left wave spray */}
          <path d="M 4 45 Q -2 60 8 72 Q 4 62 4 45 Z" fill="#0284c7" />

          {/* Top-Left: Golden Ship Helm Wheel */}
          <g transform="translate(1, 1)">
            <circle cx="11" cy="11" r="9" fill="#034694" stroke="url(#abyssalGold)" strokeWidth="2.2" />
            <circle cx="11" cy="11" r="3.5" fill="url(#abyssalGold)" />
            {/* Helm Handles */}
            <line x1="11" y1="0" x2="11" y2="22" stroke="url(#abyssalGold)" strokeWidth="1.8" />
            <line x1="0" y1="11" x2="22" y2="11" stroke="url(#abyssalGold)" strokeWidth="1.8" />
            <line x1="3" y1="3" x2="19" y2="19" stroke="url(#abyssalGold)" strokeWidth="1.8" />
            <line x1="19" y1="3" x2="3" y2="19" stroke="url(#abyssalGold)" strokeWidth="1.8" />
          </g>

          {/* Bottom-Right: Sailboat Sail & Rigging */}
          <g transform="translate(68, 64)">
            {/* Sail */}
            <path
              d="M 4 28 C 8 14, 18 6, 26 2 C 22 14, 20 22, 22 28 Z"
              fill="#ffffff"
              stroke="url(#abyssalWave)"
              strokeWidth="1.5"
            />
            {/* Mast */}
            <line x1="4" y1="2" x2="4" y2="28" stroke="url(#abyssalGold)" strokeWidth="2" />
            {/* Blue flag pennant on mast */}
            <polygon points="4,2 10,5 4,8" fill="#0284c7" />
          </g>
        </svg>
      )

    case "elemental_fire_ice":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="fireSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff1e00" />
              <stop offset="50%" stopColor="#ff7700" />
              <stop offset="100%" stopColor="#ffcc00" />
            </linearGradient>
            <linearGradient id="iceSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="40%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#0052cc" />
            </linearGradient>
            <linearGradient id="goldFil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff59d" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8c6d1f" />
            </linearGradient>
          </defs>

          {/* Left Half Fire Border */}
          <path
            d="M 50 6 L 24 6 C 14 6, 6 14, 6 24 L 6 76 C 6 86, 14 94, 24 94 L 50 94"
            fill="none"
            stroke="url(#fireSide)"
            strokeWidth="5"
          />

          {/* Right Half Ice Border */}
          <path
            d="M 50 6 L 76 6 C 86 6, 94 14, 94 24 L 94 76 C 94 86, 86 94, 76 94 L 50 94"
            fill="none"
            stroke="url(#iceSide)"
            strokeWidth="5"
          />

          {/* Fire flames on left */}
          <path d="M 6 36 Q -2 24 6 14 Q 4 26 12 30 Z" fill="#ff3d00" />
          <path d="M 4 60 Q -4 72 8 84 Q 4 72 10 68 Z" fill="#ff9100" />

          {/* Ice shards on right */}
          <polygon points="94,30 102,22 92,16" fill="#80d8ff" stroke="#fff" strokeWidth="0.5" />
          <polygon points="94,70 102,78 90,82" fill="#00b0ff" stroke="#fff" strokeWidth="0.5" />

          {/* Top Gold Interlocking Diadem */}
          <polygon points="50,1 42,9 58,9" fill="url(#goldFil)" stroke="#fff" strokeWidth="0.5" />
          <circle cx="50" cy="7" r="2.2" fill="#ff1744" />

          {/* Bottom Dual Jewels and Gold Leaves */}
          <rect x="42" y="90" width="16" height="7" rx="3" fill="url(#goldFil)" />
          <circle cx="46" cy="93.5" r="2.2" fill="#ff3d00" />
          <circle cx="54" cy="93.5" r="2.2" fill="#00b0ff" />
        </svg>
      )

    case "valkyrie_wings":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="valkGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff275" />
              <stop offset="50%" stopColor="#e5a93b" />
              <stop offset="100%" stopColor="#9e6e18" />
            </linearGradient>
          </defs>

          {/* Squircle Gold Frame */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#valkGold)"
            strokeWidth="4.5"
          />

          {/* Left Wing Blade */}
          <path d="M 6 36 C -4 18, 6 6, 22 10 C 14 16, 10 26, 8 36 Z" fill="#ffffff" stroke="url(#valkGold)" strokeWidth="1.2" />

          {/* Right Wing Blade */}
          <path d="M 94 36 C 104 18, 94 6, 78 10 C 86 16, 90 26, 92 36 Z" fill="#ffffff" stroke="url(#valkGold)" strokeWidth="1.2" />

          {/* Top-Left Sword Diagonally resting */}
          <g transform="translate(4, 2) rotate(-35)">
            <rect x="0" y="-8" width="3" height="26" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.5" />
            <rect x="-3" y="14" width="9" height="2.5" fill="url(#valkGold)" />
            <circle cx="1.5" cy="18" r="1.5" fill="url(#valkGold)" />
          </g>

          {/* Bottom Wing Bracket with Ruby */}
          <path d="M 32 90 Q 50 100 68 90 Q 50 95 32 90 Z" fill="url(#valkGold)" />
          <polygon points="50,91 46,96 54,96" fill="#f43f5e" stroke="#fff" strokeWidth="0.6" />
        </svg>
      )

    case "cyber_lotus":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="neonCyber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff007f" />
              <stop offset="50%" stopColor="#9d00ff" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff5e00" />
              <stop offset="100%" stopColor="#ffb700" />
            </linearGradient>
          </defs>

          {/* Squircle Neon Rim */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#neonCyber)"
            strokeWidth="4.5"
          />

          {/* Top-Right: DEV Plate Badge */}
          <g transform="translate(68, -2)">
            <polygon points="0,0 24,0 20,16 4,16" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="1.2" />
            <text x="12" y="11.5" textAnchor="middle" fill="#06b6d4" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              DEV
            </text>
          </g>

          {/* Left Dragon Body Curves */}
          <path
            d="M 6 22 C -2 38, 0 64, 8 78 C 6 64, 4 42, 12 30 Z"
            fill="#a21caf"
            stroke="#f43f5e"
            strokeWidth="1"
          />

          {/* Bottom Autumn Leaf / Lotus */}
          <g transform="translate(42, 85)">
            <path d="M 8 0 L 12 6 L 16 2 L 14 9 L 18 10 L 8 16 L -2 10 L 2 9 L 0 2 L 4 6 Z" fill="url(#leafGrad)" />
          </g>
        </svg>
      )

    case "golden_lion":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="lionGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>

          {/* Ornate Gold Beast Rim */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#lionGold)"
            strokeWidth="5"
          />

          {/* Top-Left: PRO Tournament Plate */}
          <g transform="translate(8, 0)">
            <polygon points="0,0 24,0 20,15 4,15" fill="#0f172a" stroke="url(#lionGold)" strokeWidth="1.2" />
            <text x="12" y="11" textAnchor="middle" fill="#eab308" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              PRO
            </text>
          </g>

          {/* Bottom Beast Paw & Lion Crest */}
          <g transform="translate(50, 90)">
            <polygon points="0,8 -10,-2 10,-2" fill="url(#lionGold)" stroke="#fff" strokeWidth="0.6" />
            <circle cx="0" cy="2.5" r="2.2" fill="#ef4444" />
            <path d="M -14 1 Q -22 6 -20 -2 Q -14 -4 -14 1 Z" fill="url(#lionGold)" />
            <path d="M 14 1 Q 22 6 20 -2 Q 14 -4 14 1 Z" fill="url(#lionGold)" />
          </g>
        </svg>
      )

    case "gladiator_legion":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="spartanBronze" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Bronze Rim */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#spartanBronze)"
            strokeWidth="4.5"
          />

          {/* Top Red Victory Ribbon & Gold Stars */}
          <path d="M 28 7 Q 50 1 72 7" fill="none" stroke="#ef4444" strokeWidth="3" />
          <polygon points="36,6 38,9 34,8" fill="#facc15" />
          <polygon points="50,2 52,5 48,4" fill="#facc15" />
          <polygon points="64,6 66,9 62,8" fill="#facc15" />

          {/* Bottom-Left: Spartan Centurion Helmet */}
          <g transform="translate(2, 66)">
            <path d="M 6 -4 Q 16 -10 22 2 Q 16 2 8 2 Z" fill="#dc2626" />
            <path d="M 4 4 C 4 -2, 18 -2, 18 4 L 18 14 L 12 18 L 4 14 Z" fill="url(#spartanBronze)" />
            <line x1="6" y1="8" x2="16" y2="8" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="11" y1="8" x2="11" y2="15" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          {/* Right Red Ribbon Flag */}
          <path d="M 94 24 C 98 42, 96 64, 92 80 L 86 78 C 90 64, 92 42, 88 26 Z" fill="#ef4444" />
        </svg>
      )

    case "solar_phoenix":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="solarGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="sunFlare" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Radiant Gold Squircle Rim */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#solarGold)"
            strokeWidth="4.5"
          />

          {/* Sweeping Dragon Horn on Right Edge */}
          <path
            d="M 50 4 C 74 2, 98 20, 96 52 C 94 72, 78 92, 50 94 C 68 88, 86 74, 88 50 C 90 30, 72 12, 50 4 Z"
            fill="url(#solarGold)"
          />
          {/* Top Horn Flare */}
          <path d="M 82 14 C 94 4, 100 1, 100 1 C 100 1, 92 14, 86 20 Z" fill="url(#sunFlare)" />

          {/* Bottom Left Flame Tongue */}
          <path d="M 8 68 Q -2 82 14 90 Q 12 78 20 72 Z" fill="url(#sunFlare)" />

          {/* Center Bottom Solar Sun Gem */}
          <circle cx="50" cy="94" r="3" fill="#f59e0b" stroke="#fff" strokeWidth="0.8" />
        </svg>
      )

    case "prismatic_crystal":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* Faceted Crystal Rim */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            fill="none"
            stroke="url(#prismGrad)"
            strokeWidth="4.5"
          />

          {/* Top Diamond Apex */}
          <polygon points="50,0 60,9 50,15 40,9" fill="#38bdf8" stroke="#fff" strokeWidth="0.8" />

          {/* Side Crystal Shards */}
          <polygon points="94,44 102,50 94,56" fill="#f472b6" stroke="#fff" strokeWidth="0.8" />
          <polygon points="6,44 -2,50 6,56" fill="#67e8f9" stroke="#fff" strokeWidth="0.8" />

          {/* Bottom Diamond Accent */}
          <polygon points="50,91 56,96 50,101 44,96" fill="#c084fc" stroke="#fff" strokeWidth="0.8" />
        </svg>
      )

    case "mecha_sentinel":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="mechaGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#422006" />
            </linearGradient>
          </defs>

          {/* Angular Tech Frame */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="16"
            fill="none"
            stroke="url(#mechaGold)"
            strokeWidth="4.5"
          />

          {/* 4 Corner Pauldrons */}
          <polygon points="4,14 18,4 22,10 8,18" fill="url(#mechaGold)" stroke="#06b6d4" strokeWidth="0.6" />
          <polygon points="96,14 82,4 78,10 92,18" fill="url(#mechaGold)" stroke="#06b6d4" strokeWidth="0.6" />
          <polygon points="4,86 18,96 22,90 8,82" fill="url(#mechaGold)" stroke="#06b6d4" strokeWidth="0.6" />
          <polygon points="96,86 82,96 78,90 92,82" fill="url(#mechaGold)" stroke="#06b6d4" strokeWidth="0.6" />

          {/* Cyan Energy Vents */}
          <circle cx="50" cy="6" r="2.5" fill="#06b6d4" stroke="#fff" strokeWidth="0.6" />
          <circle cx="50" cy="94" r="2.5" fill="#06b6d4" stroke="#fff" strokeWidth="0.6" />
        </svg>
      )

    case "basic":
    default:
      // When "basic" is selected: return null so standard avatars remain 100% clean with NO weird floating circles!
      return null
  }
}

/* ========================================================================= */
/* AVATAR FRAME WRAPPER COMPONENT                                            */
/* ========================================================================= */

export interface AvatarFrameProps {
  border?: AvatarBorderStyle
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  shape?: "circle" | "rounded"
  className?: string
  children: React.ReactNode
  showBadge?: boolean
  onClick?: () => void
}

const SIZE_MAP = {
  xs: "h-7 w-7",
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-24 w-24 sm:h-28 sm:w-28",
  "2xl": "h-28 w-28 sm:h-32 sm:w-32",
}

export function AvatarFrame({
  border = "basic",
  size = "md",
  shape = "rounded",
  className,
  children,
  onClick,
}: AvatarFrameProps) {
  const config = AVATAR_BORDER_CONFIGS[border] || AVATAR_BORDER_CONFIGS.basic
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md
  const isSpecialBorder = border !== "basic"

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative shrink-0 flex items-center justify-center select-none",
        sizeClass,
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Inner Avatar Content Container (Contoured cleanly to border geometry) */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden flex items-center justify-center [&_img]:rounded-none [&_img]:object-cover",
          isSpecialBorder
            ? "rounded-[25%]"
            : shape === "circle"
            ? "rounded-full"
            : "rounded-2xl"
        )}
      >
        {children}
      </div>

      {/* SVG Gaming Border Overlay Layer - Tightly hugs squircle edges! */}
      {isSpecialBorder && (
        <div
          className="pointer-events-none absolute inset-[-6%] z-10 flex items-center justify-center"
          style={{
            filter: `drop-shadow(0 0 6px ${config.glowColor}50)`,
          }}
        >
          <BorderGraphic border={border} />
        </div>
      )}
    </div>
  )
}

/* ========================================================================= */
/* AVATAR BORDER SELECTOR MODAL (Matching Reference Image Game UI)           */
/* ========================================================================= */

export interface AvatarBorderModalProps {
  isOpen: boolean
  currentBorder: AvatarBorderStyle
  userLevel?: number
  avatarUrl?: string
  userName?: string
  onClose: () => void
  onSelect: (border: AvatarBorderStyle) => void | Promise<void>
}

export function AvatarBorderModal({
  isOpen,
  currentBorder,
  userLevel = 1,
  avatarUrl,
  userName = "Learner",
  onClose,
  onSelect,
}: AvatarBorderModalProps) {
  const [selected, setSelected] = useState<AvatarBorderStyle>(currentBorder)
  const [activeTab, setActiveTab] = useState<"all" | "challenges" | "streak" | "level">("all")
  const [confirming, setConfirming] = useState(false)

  if (!isOpen) return null

  const selectedConfig = AVATAR_BORDER_CONFIGS[selected] || AVATAR_BORDER_CONFIGS.basic
  const isLocked = selectedConfig.minLevel > userLevel
  const isEquipped = currentBorder === selected

  const filteredBorders = AVATAR_BORDER_LIST.filter(
    (b) => activeTab === "all" || b.category === activeTab
  )

  const handleConfirm = async () => {
    if (isLocked || confirming) return
    try {
      setConfirming(true)
      await onSelect(selected)
      onClose()
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card (Matching Mobile Legends UI) */}
      <div
        className="relative flex flex-col w-full max-w-4xl rounded-3xl border border-sky-500/30 bg-[#101827]/98 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-[Space_Grotesk,sans-serif] text-base sm:text-lg font-bold">
              <span className="text-sky-300">Avatar Border</span>
            </div>
            <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 font-[JetBrains_Mono,monospace] text-[10px] font-bold text-sky-300 border border-sky-500/30">
              Lvl {userLevel}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body: Left Category Tabs + Right Border Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Category Tabs */}
          <div className="md:col-span-3 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: "all", label: "All Frames", icon: Compass },
              { id: "challenges", label: "Mock Challenges", icon: Trophy },
              { id: "streak", label: "Streak & Practice", icon: Flame },
              { id: "level", label: "Level Milestones", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition text-left",
                    isActive
                      ? "bg-linear-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-900/40 border border-sky-400/40"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Grid of Borders (Matching Reference Image Grid) */}
          <div className="md:col-span-9 grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-85 overflow-y-auto pr-1">
            {filteredBorders.map((b) => {
              const isItemLocked = b.minLevel > userLevel
              const isSelected = selected === b.id
              const isEquippedItem = currentBorder === b.id

              return (
                <div
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group",
                    isSelected
                      ? "bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/20"
                      : "bg-[#0b1320]/70 border-white/10 hover:border-sky-500/40 hover:bg-white/5"
                  )}
                >
                  {/* Squircle Avatar Frame Preview */}
                  <div className="my-2">
                    <AvatarFrame border={b.id} size="lg" shape="rounded">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="preview"
                          className="h-full w-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400 font-bold text-base rounded-2xl">
                          ?
                        </div>
                      )}
                    </AvatarFrame>
                  </div>

                  {/* Title */}
                  <p className="mt-1 w-full truncate text-center font-[Space_Grotesk,sans-serif] text-[11px] font-semibold text-slate-200">
                    {b.name}
                  </p>

                  {/* Lock / Equipped Badge */}
                  {isItemLocked && (
                    <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-amber-400">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                  {isEquippedItem && (
                    <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ================= BOTTOM SELECTED PREVIEW BAR (Matching Reference Image) ================= */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sky-500/25 bg-[#09101a]/95 p-4 sm:p-5">
          {/* Left: Preview Avatar with Selected Border */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <AvatarFrame border={selected} size="xl" shape="rounded">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-tr from-teal-500/20 to-purple-500/20 font-bold text-xl text-teal-300 rounded-2xl">
                  {userName.charAt(0)}
                </div>
              )}
            </AvatarFrame>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-[Space_Grotesk,sans-serif] text-base font-bold text-white">
                  {selectedConfig.name}
                </h4>
                <span
                  className="rounded-full px-2 py-0.5 font-[JetBrains_Mono,monospace] text-[9.5px] font-bold uppercase"
                  style={{
                    backgroundColor: `${selectedConfig.glowColor}25`,
                    color: selectedConfig.glowColor,
                  }}
                >
                  {selectedConfig.rarity}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md">
                {selectedConfig.description}
              </p>
              <p className="font-[JetBrains_Mono,monospace] text-[11px] text-sky-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                {selectedConfig.unlockText}
              </p>
            </div>
          </div>

          {/* Right: Confirm / Equip Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            {isLocked ? (
              <button
                disabled
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-800 border border-white/10 px-6 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Requires Level {selectedConfig.minLevel}</span>
              </button>
            ) : isEquipped ? (
              <button
                disabled
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-2.5 text-xs font-bold text-emerald-300 cursor-default"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Equipped</span>
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 via-amber-400 to-yellow-500 px-7 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:brightness-105 active:scale-95 disabled:opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
                <span>{confirming ? "Equipping..." : "Confirm & Equip"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
