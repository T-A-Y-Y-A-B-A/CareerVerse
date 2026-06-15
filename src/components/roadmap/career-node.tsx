'use client'

import { useState } from 'react'
import type { CareerStage, StageStatus } from '@/lib/career-ladder-data'
import { Lock, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react'
import { useSounds } from "@/hooks/useSounds"

interface CareerNodeProps {
  stage: CareerStage
  status: StageStatus
  index: number
}

export function CareerNode({ stage, status, index }: CareerNodeProps) {
  const [expanded, setExpanded] = useState(false)
  const { play } = useSounds()

  // ── Visual config per status ──────────────────────────────────────────────
  const styles: Record<StageStatus, {
    border: string; bg: string; glow: string; opacity: string
    iconBg: string; iconBorder: string; titleColor: string
    badge: React.ReactNode
  }> = {
    completed: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/[0.06]',
      glow: 'shadow-[0_0_24px_rgba(52,211,153,0.15)]',
      opacity: 'opacity-100',
      iconBg: 'bg-emerald-500/20',
      iconBorder: 'border-emerald-500/30',
      titleColor: 'text-emerald-300',
      badge: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 roadmap-badge-pop">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Completed</span>
        </div>
      ),
    },
    current: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/[0.08]',
      glow: 'roadmap-pulse',
      opacity: 'opacity-100',
      iconBg: 'bg-purple-500/25',
      iconBorder: 'border-purple-500/40',
      titleColor: 'text-white',
      badge: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 roadmap-badge-pop">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Current</span>
        </div>
      ),
    },
    next: {
      border: 'border-white/[0.12]',
      bg: 'bg-white/[0.03]',
      glow: '',
      opacity: 'opacity-70',
      iconBg: 'bg-white/[0.06]',
      iconBorder: 'border-white/[0.1]',
      titleColor: 'text-gray-300',
      badge: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next</span>
        </div>
      ),
    },
    locked: {
      border: 'border-white/[0.06]',
      bg: 'bg-white/[0.015]',
      glow: '',
      opacity: 'opacity-40',
      iconBg: 'bg-white/[0.04]',
      iconBorder: 'border-white/[0.06]',
      titleColor: 'text-gray-500',
      badge: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Lock className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Locked</span>
        </div>
      ),
    },
  }

  const s = styles[status]

  return (
    <div
      className={`relative w-[280px] md:w-[300px] flex-shrink-0 select-none ${s.opacity}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Connection dot (top) */}
      <div className="flex justify-center mb-3">
        <div
          className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
            status === 'completed'
              ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
              : status === 'current'
              ? 'bg-purple-400 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)] roadmap-pulse'
              : 'bg-white/10 border-white/20'
          }`}
        />
      </div>

      {/* Card */}
      <button
        onClick={() => { play('snap'); setExpanded(!expanded) }}
        className={`w-full text-left rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${s.border} ${s.bg} ${s.glow}`}
      >
        {/* Collapsed view — always visible */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} border ${s.iconBorder} flex items-center justify-center text-lg transition-all duration-300`}>
                {status === 'locked' ? <Lock className="w-4 h-4 text-gray-600" /> : stage.icon}
              </div>
              <div>
                <h3 className={`font-bold text-sm leading-tight ${s.titleColor}`}>{stage.role}</h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">Level {stage.levelThreshold}+</p>
              </div>
            </div>
            {s.badge}
          </div>

          {/* Expand chevron */}
          <div className="flex items-center justify-center">
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Expanded view */}
        {expanded && (
          <div className="px-5 pb-5 roadmap-card-expand overflow-hidden">
            <div className="space-y-4 pt-3 border-t border-white/[0.06]">
              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed">{stage.description}</p>

              {/* Salary */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">💰 Salary Range</p>
                <p className="text-sm font-semibold text-gray-300">{stage.salaryRange}</p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">⏱️ Timeline</p>
                <p className="text-sm font-semibold text-gray-300">{stage.estimatedTimeline}</p>
              </div>

              {/* Skills */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">🛠️ Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {stage.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold ${
                        status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : status === 'current'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-white/[0.04] text-gray-500 border border-white/[0.06]'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </button>
    </div>
  )
}
