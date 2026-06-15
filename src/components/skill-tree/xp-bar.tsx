'use client'

import { getLevelInfo } from '@/lib/skills-data'

interface XPBarProps {
  totalXP: number
}

export function XPBar({ totalXP }: XPBarProps) {
  const { level, currentXP, xpForNext } = getLevelInfo(totalXP)
  const percent = xpForNext > 0 ? Math.round((currentXP / xpForNext) * 100) : 100

  return (
    <div className="flex items-center gap-3">
      {/* Level badge */}
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-sm font-bold text-primary-foreground">{level}</span>
      </div>

      <div className="flex flex-col gap-1 min-w-[140px]">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-medium text-muted-foreground">Level {level}</span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {currentXP} / {xpForNext} XP
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
