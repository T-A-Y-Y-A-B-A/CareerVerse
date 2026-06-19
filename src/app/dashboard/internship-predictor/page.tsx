'use client'

import { useState, useEffect } from 'react'
import { PredictorForm } from '@/components/internship-predictor/predictor-form'
import { CompanyCards }  from '@/components/internship-predictor/company-cards'

export default function InternshipPredictorPage() {
  const [prediction, setPrediction] = useState<any>(null)
  const [loading,    setLoading]    = useState(true)
  const [analyzing,  setAnalyzing]  = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    fetch('/api/internship-predictor')
      .then((r) => r.json())
      .then((d) => { setPrediction(d.prediction); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (data: { gpa: string; targetRole: string; extraSkills: string[] }) => {
    setAnalyzing(true)
    setError('')
    try {
      const res  = await fetch('/api/internship-predictor', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Prediction failed'); return }
      setPrediction(json.prediction)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Internship Predictor</h1>
        <p className="text-muted-foreground mt-1">
          See how you stack up against real Pakistani tech companies — and exactly what would push each score higher.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {prediction && !analyzing ? (
        <CompanyCards prediction={prediction} onRepredict={() => setPrediction(null)} />
      ) : (
        <PredictorForm onSubmit={handleSubmit} isLoading={analyzing} />
      )}
    </div>
  )
}
