'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useState } from 'react'
import type { Skill, SkillStatus } from '@/lib/skills-data'

export interface SkillNodeData extends Record<string, unknown> {
  skill:    Skill
  status:   SkillStatus
  onUnlock: (skillId: string) => Promise<void>
}

const CATEGORY_COLORS: Record<string, string> = {
  ai:        'bg-purple-600 border-purple-400 text-white',
  fullstack: 'bg-blue-600   border-blue-400   text-white',
  devops:    'bg-emerald-600 border-emerald-400 text-white',
}

const CATEGORY_AVAILABLE: Record<string, string> = {
  ai:        'border-purple-400 text-purple-400',
  fullstack: 'border-blue-400   text-blue-400',
  devops:    'border-emerald-400 text-emerald-400',
}

export function SkillTreeNode({ data }: NodeProps) {
  const { skill, status, onUnlock } = data as SkillNodeData
  const [unlocking, setUnlocking] = useState(false)

  const handleClick = async () => {
    if (unlocking) return
    if (status !== 'available' && status !== 'unlocked') return
    setUnlocking(true)
    try {
      await onUnlock(skill.id)
    } finally {
      setUnlocking(false)
    }
  }

  const baseClass = [
    'relative flex flex-col items-center justify-center',
    'w-[130px] min-h-[80px] rounded-xl border-2 p-3',
    'select-none transition-all duration-300',
  ].join(' ')

  let stateClass = ''
  let animClass  = ''
  const isTier2 = skill.tier === 2
  const isTier3 = skill.tier === 3

  if (status === 'unlocked') {
    if (isTier3) {
      stateClass = 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.7)] font-black border-double border-4'
    } else if (isTier2) {
      stateClass = 'bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 border-yellow-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)] font-bold'
    } else {
      stateClass = CATEGORY_COLORS[skill.category]
    }
  } else if (status === 'available') {
    if (isTier3) {
      stateClass = 'bg-black/95 border-purple-500 text-purple-400 cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.25)] hover:shadow-[0_0_18px_rgba(168,85,247,0.6)] hover:scale-105'
    } else if (isTier2) {
      stateClass = 'bg-black/85 border-amber-500 text-amber-400 hover:scale-105 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]'
    } else {
      stateClass = `bg-background ${CATEGORY_AVAILABLE[skill.category]} cursor-pointer hover:scale-105 skill-node-available`
    }
    animClass  = unlocking ? 'skill-node-unlocking' : ''
  } else if (status === 'needs-ascension') {
    if (isTier3) {
      stateClass = 'bg-muted/30 border-dashed border-purple-500/30 text-purple-500/40 opacity-50 cursor-not-allowed'
    } else {
      stateClass = 'bg-muted/40 border-dashed border-amber-500/40 text-amber-500/50 opacity-60 cursor-not-allowed'
    }
  } else {
    // locked
    stateClass = 'bg-muted border-border text-muted-foreground opacity-40 cursor-not-allowed'
  }

  return (
    <>
      {/* React Flow handles (connection points) */}
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div
        className={`${baseClass} ${stateClass} ${animClass}`}
        onClick={handleClick}
        title={status === 'locked' ? `Requires: ${skill.requires.join(', ')}` : skill.description}
      >
        {/* Lock overlay for locked nodes */}
        {status === 'locked' && (
          <span className="absolute top-1.5 right-1.5 text-xs opacity-60">🔒</span>
        )}

        {/* Ascension Lock overlay */}
        {status === 'needs-ascension' && (
          <span className="absolute top-1.5 right-1.5 text-xs opacity-80" title="Requires Path Ascension">
            {isTier3 ? '👑🔒' : '⭐🔒'}
          </span>
        )}

        {/* Checkmark for unlocked nodes */}
        {status === 'unlocked' && (
          <span className="absolute top-1.5 right-1.5 text-xs">✓</span>
        )}

        {/* Icon */}
        <span className="text-2xl mb-1 leading-none" aria-hidden="true">
          {skill.icon}
        </span>

        {/* Label */}
        <span className="text-xs font-semibold text-center leading-tight">
          {skill.label}
        </span>

        {/* XP reward */}
        <span
          className={`text-[10px] mt-1 font-medium ${
            status === 'unlocked'
              ? isTier3
                ? 'text-purple-200/90'
                : isTier2
                ? 'text-black/80'
                : 'text-white/70'
              : 'text-muted-foreground'
          }`}
        >
          {status === 'unlocked' ? `+${skill.xpReward} XP ✓` : `+${skill.xpReward} XP`}
        </span>

        {/* Click hint for available nodes */}
        {status === 'available' && !unlocking && (
          <span className="text-[9px] mt-0.5 opacity-70">
            {isTier3 ? 'tap to ascend' : isTier2 ? 'tap to master' : 'tap to unlock'}
          </span>
        )}

        {/* Toggle unmark hint for unlocked nodes */}
        {status === 'unlocked' && !unlocking && (
          <span className={`text-[9px] mt-0.5 opacity-60 ${
            isTier3 ? 'text-purple-300/80' : isTier2 ? 'text-black/60' : 'text-white/60'
          }`}>
            tap to lock
          </span>
        )}

        {/* Needs Ascension hint */}
        {status === 'needs-ascension' && (
          <span className={`text-[8px] mt-0.5 font-bold ${isTier3 ? 'text-purple-400' : 'text-amber-500/80'}`}>
            {isTier3 ? 'mastery required' : 'ascension required'}
          </span>
        )}

        {/* Loading spinner while unlocking */}
        {unlocking && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </>
  )
}
