'use client'

import { useState } from 'react'
import { Button }   from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const PRESET_GOALS = [
  { label: 'AI Engineer',       goal: 'Become an AI Engineer specializing in LLMs and production ML systems' },
  { label: 'Full Stack Dev',    goal: 'Become a Full Stack Developer with React, Next.js, and Node.js' },
  { label: 'DevOps Engineer',   goal: 'Become a DevOps Engineer with Docker, Kubernetes, and AWS' },
  { label: 'Data Scientist',    goal: 'Become a Data Scientist with Python, SQL, and machine learning' },
  { label: 'Mobile Dev',        goal: 'Become a Mobile Developer with React Native and TypeScript' },
  { label: 'Get an Internship', goal: 'Land a software engineering internship at a top tech company' },
]

const DURATION_OPTIONS = [2, 3, 4, 6, 8, 12]

interface GoalInputProps {
  onSubmit:  (goal: string, duration: number) => Promise<void>
  isLoading: boolean
}

export function GoalInput({ onSubmit, isLoading }: GoalInputProps) {
  const [goal,     setGoal]     = useState('')
  const [duration, setDuration] = useState(4)

  return (
    <div className="space-y-6">

      {/* Preset goals */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Quick start with a preset goal:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_GOALS.map((p) => (
            <button
              key={p.label}
              onClick={() => setGoal(p.goal)}
              className="text-xs px-3 py-1.5 rounded-full border border-border
                         bg-background hover:bg-secondary hover:border-primary
                         transition-colors font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="goal-input">
          Your Career Goal
        </label>
        <Textarea
          id="goal-input"
          placeholder="e.g. Become an AI Engineer, Land a frontend internship, Break into DevOps..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="min-h-[100px] resize-none text-sm"
        />
      </div>

      {/* Duration selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Timeline</label>
        <div className="flex gap-2 flex-wrap">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                duration === d
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {d} {d === 1 ? 'month' : 'months'}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onSubmit(goal, duration)}
        disabled={!goal.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Building your personalized roadmap…
          </span>
        ) : (
          'Generate Roadmap'
        )}
      </Button>
    </div>
  )
}
