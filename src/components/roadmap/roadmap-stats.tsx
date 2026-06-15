'use client'

import { useState, useEffect } from 'react'
import { CAREER_STAGES, getCurrentStageIndex } from '@/lib/career-ladder-data'
import { getLevelInfo } from '@/lib/skills-data'

interface RoadmapStatsProps {
  userLevel: number
  totalXP: number
}

function ProgressRing({ value, size = 80, strokeWidth = 6 }: {
  value: number; size?: number; strokeWidth?: number
}) {
  const [animVal, setAnimVal] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animVal / 100) * circumference

  useEffect(() => {
    const t = setTimeout(() => setAnimVal(value), 400)
    return () => clearTimeout(t)
  }, [value])

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="url(#roadmap-ring-grad)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
          filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.5))',
        }}
      />
      <defs>
        <linearGradient id="roadmap-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function RoadmapStats({ userLevel, totalXP }: RoadmapStatsProps) {
  const { level, currentXP, xpForNext } = getLevelInfo(totalXP)
  const xpPercent = xpForNext > 0 ? Math.round((currentXP / xpForNext) * 100) : 100

  const currentIdx = getCurrentStageIndex(userLevel)
  const currentStage = CAREER_STAGES[currentIdx]
  const careerProgress = Math.round(((currentIdx + 1) / CAREER_STAGES.length) * 100)
  const nextStage = CAREER_STAGES[currentIdx + 1]

  return (
    <div className="flex flex-col gap-4">

      {/* Current Role Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg">
            {currentStage.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400/70">Current Role</p>
            <h3 className="text-sm font-bold text-white leading-tight">{currentStage.role}</h3>
          </div>
        </div>

        {/* Level + XP Ring */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProgressRing value={xpPercent} size={72} strokeWidth={5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-extrabold text-white">{level}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Level {level}</span>
              <span className="text-gray-500 tabular-nums font-semibold">{currentXP}/{xpForNext} XP</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 roadmap-progress"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Career Progress */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Career Progress</p>

        <div className="flex items-end gap-2">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">
            {careerProgress}%
          </span>
          <span className="text-xs text-gray-500 mb-1 font-medium">
            ({currentIdx + 1} / {CAREER_STAGES.length} stages)
          </span>
        </div>

        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 roadmap-progress"
            style={{ width: `${careerProgress}%` }}
          />
        </div>

        {/* Stage dots */}
        <div className="flex items-center justify-between pt-1">
          {CAREER_STAGES.map((stage, i) => (
            <div key={stage.id} className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  i < currentIdx
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                    : i === currentIdx
                    ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.7)] roadmap-pulse'
                    : 'bg-white/10'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone */}
      {nextStage && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Next Milestone</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-base opacity-60">
              {nextStage.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-300">{nextStage.role}</h4>
              <p className="text-xs text-gray-500">Requires Level {nextStage.levelThreshold}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500/50" />
            {nextStage.levelThreshold - level} levels to go
          </div>
        </div>
      )}
    </div>
  )
}
