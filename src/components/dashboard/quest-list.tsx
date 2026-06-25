'use client'

import Link from 'next/link'
import { Dna, Network, FileText, Map, Mic, Building2, Compass, Zap, Target, Trophy, Rocket, LineChart, Crown } from 'lucide-react'

interface QuestProgress {
  current: number
  target:  number
}

interface QuestData {
  id:          string
  title:       string
  description: string
  icon:        string
  category:    string
  href:        string
  xpReward:    number
  completed:   boolean
  progress:    QuestProgress
}

interface Props {
  quests: QuestData[]
}

const CATEGORY_LABELS: Record<string, { label: string, icon: React.ReactNode }> = {
  onboarding: { label: 'Getting Started', icon: <Rocket className="w-4 h-4 mr-1.5 inline" /> },
  growth:     { label: 'Build Momentum', icon: <LineChart className="w-4 h-4 mr-1.5 inline" /> },
  mastery:    { label: 'Mastery', icon: <Crown className="w-4 h-4 mr-1.5 inline" /> },
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Dna': <Dna className="w-5 h-5 text-purple-400" />,
  'Network': <Network className="w-5 h-5 text-blue-400" />,
  'FileText': <FileText className="w-5 h-5 text-emerald-400" />,
  'Map': <Map className="w-5 h-5 text-orange-400" />,
  'Mic': <Mic className="w-5 h-5 text-pink-400" />,
  'Building2': <Building2 className="w-5 h-5 text-indigo-400" />,
  'Compass': <Compass className="w-5 h-5 text-rose-400" />,
  'Zap': <Zap className="w-5 h-5 text-yellow-400" />,
  'Target': <Target className="w-5 h-5 text-red-400" />,
  'Trophy': <Trophy className="w-5 h-5 text-amber-400" />,
}

export function QuestList({ quests }: Props) {
  const categories = ['onboarding', 'growth', 'mastery']
  const completedCount = quests.filter((q) => q.completed).length

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Quests</h3>
        <span className="text-xs text-muted-foreground font-medium bg-foreground/5 px-3 py-1 rounded-full">
          {completedCount} / {quests.length} complete
        </span>
      </div>

      {categories.map((cat) => {
        const categoryQuests = quests.filter((q) => q.category === cat)
        if (categoryQuests.length === 0) return null

        return (
          <div key={cat} className="space-y-2.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center mb-3">
              {CATEGORY_LABELS[cat]?.icon}
              {CATEGORY_LABELS[cat]?.label ?? cat}
            </p>
            <div className="space-y-2">
              {categoryQuests.map((q) => {
                const pct = q.progress.target > 0
                  ? Math.round((q.progress.current / q.progress.target) * 100)
                  : 0

                return (
                  <Link
                    key={q.id}
                    href={q.href}
                    className={`block rounded-xl border p-3.5 transition-all duration-300 ${
                      q.completed
                        ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-background border-border hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(147,51,234,0.08)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5">{ICON_MAP[q.icon]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-medium ${q.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {q.title}
                          </p>
                          <span className={`text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-md ${
                            q.completed
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-purple-400 bg-purple-500/10'
                          }`}>
                            {q.completed ? '✓ +' + q.xpReward + ' XP' : '+' + q.xpReward + ' XP'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{q.description}</p>

                        {!q.completed && q.progress.target > 1 && (
                          <div className="mt-2.5 space-y-1">
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground tabular-nums">
                              {q.progress.current} / {q.progress.target}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
