'use client'
import { Check, PartyPopper } from 'lucide-react';

import { useState, useEffect, useCallback } from 'react'
import type { RoadmapMonth } from '@/lib/schema'

interface Roadmap {
  id:         number
  goal:       string
  targetRole: string | null
  duration:   number
  months:     RoadmapMonth[]
}

interface Props {
  roadmap:     Roadmap
  onNewRoadmap: () => void
}

export function RoadmapTimeline({ roadmap, onNewRoadmap }: Props) {
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [toggling,  setToggling]  = useState<number | null>(null)

  // Load progress on mount
  useEffect(() => {
    fetch(`/api/roadmap/progress?roadmapId=${roadmap.id}`)
      .then((r) => r.json())
      .then((d) => setCompleted(new Set(d.completed ?? [])))
      .catch(() => {})
  }, [roadmap.id])

  const toggleMonth = useCallback(async (monthIndex: number) => {
    if (toggling !== null) return
    setToggling(monthIndex)

    // Optimistic update
    setCompleted((prev) => {
      const next = new Set(prev)
      next.has(monthIndex) ? next.delete(monthIndex) : next.add(monthIndex)
      return next
    })

    try {
      await fetch('/api/roadmap/progress', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ roadmapId: roadmap.id, monthIndex }),
      })
    } catch {
      // Revert on failure
      setCompleted((prev) => {
        const next = new Set(prev)
        next.has(monthIndex) ? next.delete(monthIndex) : next.add(monthIndex)
        return next
      })
    } finally {
      setToggling(null)
    }
  }, [roadmap.id, toggling])

  const completedCount = completed.size
  const totalMonths    = roadmap.months.length
  const progressPct    = totalMonths > 0 ? Math.round((completedCount / totalMonths) * 100) : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Roadmap
          </p>
          <h2 className="text-xl font-bold mt-0.5">{roadmap.goal}</h2>
          {roadmap.targetRole && (
            <p className="text-sm text-muted-foreground">Target: {roadmap.targetRole}</p>
          )}
        </div>
        <button
          onClick={onNewRoadmap}
          className="text-xs text-muted-foreground hover:text-foreground underline flex-shrink-0"
        >
          New roadmap →
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completedCount} of {totalMonths} months complete</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {roadmap.months.map((month, i) => {
            const isDone      = completed.has(i)
            const isToggling  = toggling === i
            const isAvailable = i === 0 || completed.has(i - 1)

            return (
              <div key={i} className="relative flex gap-4">

                {/* Circle on the timeline */}
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isAvailable
                      ? 'bg-background border-primary text-primary'
                      : 'bg-background border-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{month.month}</span>
                  )}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-xl border p-4 transition-all duration-200 ${
                    isDone
                      ? 'bg-primary/5 border-primary/30'
                      : isAvailable
                      ? 'bg-card border-border'
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Month {month.month}
                        </span>
                        {isDone && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                            Complete <Check className="w-4 h-4 inline ml-1" />
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-3">{month.title}</h3>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {month.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Project */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Project
                        </p>
                        <p className="text-xs text-foreground">{month.project}</p>
                      </div>

                      {/* Milestone */}
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Milestone
                        </p>
                        <p className="text-xs text-foreground">{month.milestone}</p>
                      </div>
                    </div>

                    {/* Complete button */}
                    {isAvailable && (
                      <button
                        onClick={() => toggleMonth(i)}
                        disabled={isToggling}
                        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          isDone
                            ? 'bg-primary/10 border-primary/30 text-primary hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive'
                            : 'bg-background border-border hover:bg-primary hover:text-primary-foreground hover:border-primary'
                        }`}
                      >
                        {isToggling ? (
                          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                        ) : isDone ? (
                          'Undo'
                        ) : (
                          'Mark Done'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completion celebration */}
      {completedCount === totalMonths && totalMonths > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center space-y-2">
          <PartyPopper className="w-8 h-8 text-foreground" />
          <p className="font-bold">Roadmap Complete!</p>
          <p className="text-sm text-muted-foreground">
            You've finished every milestone. Time to set a new goal.
          </p>
          <button
            onClick={onNewRoadmap}
            className="mt-2 text-sm underline text-primary hover:text-primary/80"
          >
            Generate a new roadmap →
          </button>
        </div>
      )}
    </div>
  )
}
