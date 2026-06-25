'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useState } from 'react'
import type { Skill, SkillStatus } from '@/lib/skills-data'
import { Lock, Crown, Star, Check, Terminal, Database, Cpu, BrainCircuit, Cloud, Code, Server, Zap, Layers, Box, GitBranch, Monitor } from 'lucide-react'

const ICON_MAP: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  BrainCircuit: <BrainCircuit className="w-6 h-6" />,
  Cloud: <Cloud className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  Box: <Box className="w-6 h-6" />,
  GitBranch: <GitBranch className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
}

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
  ai:        'border-purple-600 dark:border-purple-400 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-transparent',
  fullstack: 'border-blue-600   dark:border-blue-400   text-blue-700   dark:text-blue-400 bg-blue-50 dark:bg-transparent',
  devops:    'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-transparent',
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
      // Changed bg-background to empty to allow CATEGORY_AVAILABLE to apply bg color
      stateClass = `${CATEGORY_AVAILABLE[skill.category]} cursor-pointer hover:scale-105 skill-node-available`
    }
    animClass  = unlocking ? 'skill-node-unlocking' : ''
  } else if (status === 'needs-ascension') {
    if (isTier3) {
      stateClass = 'bg-white/80 dark:bg-muted/30 border-dashed border-purple-500/50 dark:border-purple-500/30 text-purple-600 dark:text-purple-500/40 opacity-90 dark:opacity-50 cursor-not-allowed backdrop-blur-sm'
    } else {
      stateClass = 'bg-white/80 dark:bg-muted/40 border-dashed border-amber-600/50 dark:border-amber-500/40 text-amber-600/80 dark:text-amber-500/50 opacity-90 dark:opacity-60 cursor-not-allowed backdrop-blur-sm'
    }
  } else {
    // locked
    stateClass = 'bg-slate-100/90 dark:bg-muted border-slate-300 dark:border-border text-slate-500 dark:text-muted-foreground opacity-90 dark:opacity-40 cursor-not-allowed backdrop-blur-sm'
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
          <span className="absolute top-1.5 right-1.5 opacity-60"><Lock className="w-3 h-3" /></span>
        )}

        {/* Ascension Lock overlay */}
        {status === 'needs-ascension' && (
          <span className="absolute top-1.5 right-1.5 opacity-80 flex items-center gap-0.5" title="Requires Path Ascension">
            {isTier3 ? <><Crown className="w-3 h-3" /><Lock className="w-3 h-3" /></> : <><Star className="w-3 h-3" /><Lock className="w-3 h-3" /></>}
          </span>
        )}

        {/* Checkmark for unlocked nodes */}
        {status === 'unlocked' && (
          <span className="absolute top-1.5 right-1.5"><Check className="w-3 h-3" /></span>
        )}

        {/* Icon */}
        <span className="mb-1 flex items-center justify-center" aria-hidden="true">
          {ICON_MAP[skill.icon] || <Code className="w-6 h-6" />}
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
              : 'text-muted-foreground opacity-90 dark:opacity-60'
          }`}
        >
          {status === 'unlocked' ? `+${skill.xpReward} XP` : `+${skill.xpReward} XP`}
        </span>

        {/* Click hint for available nodes */}
        {status === 'available' && !unlocking && (
          <span className="text-[9px] mt-0.5 opacity-100 dark:opacity-70 font-medium">
            {isTier3 ? 'tap to ascend' : isTier2 ? 'tap to master' : 'tap to unlock'}
          </span>
        )}

        {/* Toggle unmark hint for unlocked nodes */}
        {status === 'unlocked' && !unlocking && (
          <span className={`text-[9px] mt-0.5 opacity-80 dark:opacity-60 font-medium ${
            isTier3 ? 'text-purple-300' : isTier2 ? 'text-black/80' : 'text-white/80'
          }`}>
            tap to lock
          </span>
        )}

        {/* Needs Ascension hint */}
        {status === 'needs-ascension' && (
          <span className={`text-[8px] mt-0.5 font-bold opacity-100 dark:opacity-80 ${isTier3 ? 'text-purple-600 dark:text-purple-400' : 'text-amber-700 dark:text-amber-500'}`}>
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
