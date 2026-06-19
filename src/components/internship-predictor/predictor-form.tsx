'use client'

import { useState } from 'react'
import { Button }   from '@/components/ui/button'

const TARGET_ROLES = [
  'Software Engineer Intern',
  'Frontend Developer Intern',
  'Backend Developer Intern',
  'Full Stack Developer Intern',
  'AI/ML Engineer Intern',
  'Data Science Intern',
  'DevOps Engineer Intern',
  'Mobile Developer Intern',
]

interface PredictorFormProps {
  onSubmit:  (data: { gpa: string; targetRole: string; extraSkills: string[] }) => Promise<void>
  isLoading: boolean
}

export function PredictorForm({ onSubmit, isLoading }: PredictorFormProps) {
  const [gpa,         setGpa]         = useState('')
  const [targetRole,  setTargetRole]  = useState('')
  const [skillInput,  setSkillInput]  = useState('')
  const [extraSkills, setExtraSkills] = useState<string[]>([])

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !extraSkills.includes(trimmed)) {
      setExtraSkills((prev) => [...prev, trimmed])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setExtraSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill() }
  }

  return (
    <div className="space-y-6">

      {/* Target role */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Target Role</label>
        <div className="flex flex-wrap gap-2">
          {TARGET_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setTargetRole(role)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                targetRole === role
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {targetRole && (
          <p className="text-xs text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{targetRole}</span>
          </p>
        )}
      </div>

      {/* GPA */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="gpa-input">
          GPA <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="gpa-input"
          type="text"
          placeholder="e.g. 3.5 / 4.0 or 3.8"
          value={gpa}
          onChange={(e) => setGpa(e.target.value)}
          className="w-full max-w-[200px] px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Some companies (Arbisoft, 10Pearls) factor GPA into screening.
        </p>
      </div>

      {/* Extra skills */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Additional Skills{' '}
          <span className="text-muted-foreground font-normal">
            (skills not on your CV — courses, side projects, etc.)
          </span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Docker, Redis, GraphQL"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="outline" size="sm" onClick={addSkill}>
            Add
          </Button>
        </div>
        {extraSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {extraSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-muted-foreground hover:text-foreground leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={() => onSubmit({ gpa, targetRole, extraSkills })}
        disabled={!targetRole || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Predicting your internship matches…
          </span>
        ) : (
          'Predict My Matches'
        )}
      </Button>
    </div>
  )
}
