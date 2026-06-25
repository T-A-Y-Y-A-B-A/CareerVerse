'use client'
import { Plus, Minus, Lightbulb } from 'lucide-react';

import type { CompanyPrediction } from '@/lib/schema'

interface Prediction {
  gpa:        string | null
  targetRole: string
  companies:  CompanyPrediction[]
  createdAt:  string
}

interface Props {
  prediction:   Prediction
  onRepredict:  () => void
}

const VERDICT_STYLES: Record<string, string> = {
  'Strong Match': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Possible':     'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Reach':        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const MATCH_COLOR = (score: number) =>
  score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

function MatchBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: MATCH_COLOR(score) }}
        />
      </div>
      <span
        className="text-sm font-bold tabular-nums w-10 text-right"
        style={{ color: MATCH_COLOR(score) }}
      >
        {score}%
      </span>
    </div>
  )
}

export function CompanyCards({ prediction, onRepredict }: Props) {
  const topMatch = prediction.companies[0]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">Internship Readiness</h2>
          <p className="text-sm text-muted-foreground">
            {prediction.targetRole}
            {prediction.gpa && ` · GPA ${prediction.gpa}`}
          </p>
        </div>
        <button
          onClick={onRepredict}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          Re-predict →
        </button>
      </div>

      {/* Top match highlight */}
      {topMatch && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
            Best Match
          </p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">{topMatch.company}</p>
            <span className="text-2xl font-bold" style={{ color: MATCH_COLOR(topMatch.match) }}>
              {topMatch.match}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{topMatch.tip}</p>
        </div>
      )}

      {/* All companies */}
      <div className="space-y-3">
        {prediction.companies.map((c) => (
          <div key={c.company} className="rounded-xl border bg-card overflow-hidden">

            {/* Company header */}
            <div className="px-4 pt-4 pb-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{c.company}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${VERDICT_STYLES[c.verdict] ?? ''}`}>
                  {c.verdict}
                </span>
              </div>
              <MatchBar score={c.match} />
            </div>

            {/* Expandable details */}
            <details className="group">
              <summary className="px-4 py-2.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground border-t flex items-center gap-1 select-none list-none">
                <span className="group-open:hidden">▶ Show breakdown</span>
                <span className="hidden group-open:inline">▼ Hide breakdown</span>
              </summary>
              <div className="px-4 pb-4 space-y-3 border-t bg-muted/20">
                {/* Why you match */}
                {c.reasons.length > 0 && (
                  <div className="pt-3 space-y-1.5">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                      <Plus className="w-4 h-4 inline mr-1" /> Why you match
                    </p>
                    {c.reasons.map((r, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span>·</span><span>{r}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Gaps */}
                {c.gaps.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                      <Minus className="w-4 h-4 inline mr-1" /> What's holding you back
                    </p>
                    {c.gaps.map((g, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span>·</span><span>{g}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Tip */}
                <div className="rounded-lg bg-background border p-3">
                  <p className="text-xs font-semibold text-primary mb-1"><Lightbulb className="w-4 h-4 inline mr-1" /> Tip</p>
                  <p className="text-xs">{c.tip}</p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
