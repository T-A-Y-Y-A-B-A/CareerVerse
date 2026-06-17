'use client'

import { useState, useEffect } from 'react'
import { GoalInput }        from '@/components/roadmap/goal-input'
import { RoadmapTimeline }  from '@/components/roadmap/roadmap-timeline'

export default function RoadmapPage() {
  const [roadmap,  setRoadmap]  = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    fetch('/api/roadmap')
      .then((r) => r.json())
      .then((d) => { setRoadmap(d.roadmap); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleGenerate = async (goal: string, duration: number) => {
    setError('')
    setLoading(true)
    const res  = await fetch('/api/roadmap', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ goal, duration }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Generation failed'); setLoading(false); return }
    setRoadmap(data.roadmap)
    setLoading(false)
  }

  if (loading && !error && !roadmap) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Learning Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          Set a goal. Get a personalized month-by-month plan built around what you already know.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {roadmap ? (
        <RoadmapTimeline roadmap={roadmap} onNewRoadmap={() => setRoadmap(null)} />
      ) : (
        <GoalInput onSubmit={handleGenerate} isLoading={loading} />
      )}
    </div>
  )
}
