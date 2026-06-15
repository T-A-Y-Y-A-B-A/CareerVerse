'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSounds } from '@/hooks/useSounds'

// ── Types ────────────────────────────────────────────────────────────────────
interface Analysis {
  overallMatch: number
  atsScore: number
  keywordMatch: number
  experienceRelevance: number
  skillsAlignment: number
  matchedKeywords: string[]
  missingKeywords: string[]
  strongPoints: string[]
  weakPoints: string[]
  suggestions: string[]
  rewrittenSummary: string
  fitVerdict: string
  verdictExplanation: string
}

// ── Animated Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ value, label, size = 110, strokeWidth = 8 }: {
  value: number; label: string; size?: number; strokeWidth?: number
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300)
    return () => clearTimeout(timer)
  }, [value])

  const color =
    value >= 80 ? '#22c55e' :
    value >= 60 ? '#eab308' :
    value >= 40 ? '#f97316' : '#ef4444'

  const bgGlow =
    value >= 80 ? 'rgba(34,197,94,0.15)' :
    value >= 60 ? 'rgba(234,179,8,0.15)' :
    value >= 40 ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl font-extrabold tabular-nums"
            style={{ color, textShadow: `0 0 20px ${bgGlow}` }}
          >
            {animatedValue}
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center leading-tight">
        {label}
      </span>
    </div>
  )
}

// ── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 200 + delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  const color =
    value >= 80 ? 'bg-emerald-500' :
    value >= 60 ? 'bg-yellow-500' :
    value >= 40 ? 'bg-orange-500' : 'bg-red-500'

  const glow =
    value >= 80 ? 'shadow-[0_0_12px_rgba(34,197,94,0.4)]' :
    value >= 60 ? 'shadow-[0_0_12px_rgba(234,179,8,0.4)]' :
    value >= 40 ? 'shadow-[0_0_12px_rgba(249,115,22,0.4)]' : 'shadow-[0_0_12px_rgba(239,68,68,0.4)]'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="font-bold tabular-nums text-white">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden backdrop-blur-sm">
        <div
          className={`h-full rounded-full transition-all duration-[1.5s] ease-out ${color} ${glow}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

// ── Verdict Badge ────────────────────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict: string }) {
  const config: Record<string, { bg: string; text: string; border: string; glow: string; icon: string }> = {
    'Strong Fit': {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
      icon: '🎯',
    },
    'Moderate Fit': {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]',
      icon: '⚡',
    },
    'Weak Fit': {
      bg: 'bg-orange-500/15',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]',
      icon: '⚠️',
    },
    'Poor Fit': {
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
      icon: '❌',
    },
  }

  const c = config[verdict] || config['Weak Fit']

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${c.bg} ${c.border} ${c.glow} backdrop-blur-sm`}>
      <span className="text-lg">{c.icon}</span>
      <span className={`font-bold text-sm uppercase tracking-wider ${c.text}`}>{verdict}</span>
    </div>
  )
}

// ── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 md:p-6 ${className}`}>
      {children}
    </div>
  )
}

// ── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
      <span className="text-base">{icon}</span>
      {children}
    </h3>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ResumeAnalyzerPage() {
  const { user, isLoaded } = useUser()
  const { play } = useSounds()
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  // Check if user has uploaded a CV
  useEffect(() => {
    if (!isLoaded || !user) return
    fetch('/api/career-twin')
      .then(r => r.json())
      .then(data => {
        setHasProfile(!!(data.profile && data.profile.rawCvText))
      })
      .catch(() => setHasProfile(false))
  }, [user, isLoaded])

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please paste a job description with at least 20 characters.')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const res = await fetch('/api/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data.analysis)
    } catch (err) {
      play('error')
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || hasProfile === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-60px)] w-full flex flex-col items-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-600/[0.06] rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-pink-500/[0.04] rounded-full blur-[80px] animate-float" style={{ animationDelay: '6s' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Resume <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Paste a job description and our AI will analyze how well your resume matches — with ATS scoring, keyword gaps, and tailored improvement suggestions.
          </p>
        </div>

        {/* No Profile Warning */}
        {!hasProfile && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="border-amber-500/20 bg-amber-500/[0.05]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-sm">Resume Required</h3>
                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                    You haven&apos;t uploaded your CV yet. Please visit the{' '}
                    <a href="/dashboard/career-twin" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 font-semibold transition-colors">
                      Career Twin
                    </a>{' '}
                    page first to upload your resume, then come back here.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Job Description Input */}
        {hasProfile && !analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '100ms' }}>
            <GlassCard className="space-y-5">
              <SectionTitle icon="📋">Paste the Job Description</SectionTitle>
              <div className="relative group">
                <textarea
                  id="resume-jd-input"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here... Include responsibilities, requirements, qualifications, and preferred skills for the best analysis."
                  rows={10}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300 leading-relaxed"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-600 tabular-nums">
                  {jobDescription.length} chars
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                id="resume-analyze-btn"
                onClick={() => { play('snap'); handleAnalyze(); }}
                disabled={loading || !jobDescription.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Analyzing your resume against this job...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze Resume Match
                  </span>
                )}
              </button>
            </GlassCard>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Verdict + Overall Score */}
            <GlassCard className="text-center space-y-5">
              <VerdictBadge verdict={analysis.fitVerdict} />
              <div className="flex justify-center">
                <ScoreRing value={analysis.overallMatch} label="Overall Match" size={140} strokeWidth={10} />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto">
                {analysis.verdictExplanation}
              </p>
            </GlassCard>

            {/* Detailed Score Breakdown */}
            <GlassCard>
              <SectionTitle icon="📊">Score Breakdown</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <ScoreRing value={analysis.atsScore} label="ATS Score" />
                <ScoreRing value={analysis.keywordMatch} label="Keywords" />
                <ScoreRing value={analysis.experienceRelevance} label="Experience" />
                <ScoreRing value={analysis.skillsAlignment} label="Skills" />
              </div>
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <ScoreBar label="ATS Compatibility" value={analysis.atsScore} delay={0} />
                <ScoreBar label="Keyword Match" value={analysis.keywordMatch} delay={100} />
                <ScoreBar label="Experience Relevance" value={analysis.experienceRelevance} delay={200} />
                <ScoreBar label="Skills Alignment" value={analysis.skillsAlignment} delay={300} />
              </div>
            </GlassCard>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard>
                <SectionTitle icon="✅">Matched Keywords</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <SectionTitle icon="❌">Missing Keywords</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-semibold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Strengths + Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard>
                <SectionTitle icon="💪">Strengths for This Role</SectionTitle>
                <div className="space-y-2.5">
                  {analysis.strongPoints.map((point, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-[10px] font-black">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <SectionTitle icon="🔻">Areas to Improve</SectionTitle>
                <div className="space-y-2.5">
                  {analysis.weakPoints.map((point, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-[10px] font-black">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Rewritten Summary */}
            {analysis.rewrittenSummary && (
              <GlassCard>
                <SectionTitle icon="✍️">Optimized Professional Summary</SectionTitle>
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-5">
                    <p className="text-sm text-gray-200 leading-relaxed italic">
                      &ldquo;{analysis.rewrittenSummary}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => { play('snap'); navigator.clipboard.writeText(analysis.rewrittenSummary); }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    title="Copy to clipboard"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </GlassCard>
            )}

            {/* Action Suggestions */}
            <GlassCard>
              <SectionTitle icon="🚀">Action Plan</SectionTitle>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-purple-500/20 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400 text-xs font-black">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Try Another Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                id="resume-try-another-btn"
                onClick={() => {
                  play('snap');
                  setAnalysis(null)
                  setJobDescription('')
                  setError('')
                }}
                className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-white/[0.05] border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)]"
              >
                ← Analyze Another Job
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
