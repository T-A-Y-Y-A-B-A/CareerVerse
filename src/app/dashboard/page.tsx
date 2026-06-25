'use client'

import { useState, useEffect } from 'react'
import { StatCard }  from '@/components/dashboard/stat-card'
import { QuestList } from '@/components/dashboard/quest-list'
import Link from 'next/link'
import { Target, UserRound, Network, FileText, Map, MessageSquare, Building2, TrendingUp, Search, Compass } from 'lucide-react'

interface DashboardData {
  user: {
    firstName: string | null
    level: number
    xp: number
    xpForNext: number
    totalXp: number
    rolePath: string | null
    xpJustGained: number
  }
  stats: {
    hasProfile: boolean
    skillsUnlocked: number
    totalSkillsAvailable: number
    resumeAnalysesCount: number
    bestAtsScore: number | null
    roadmapsCount: number
    interviewsCompleted: number
    bestInterviewScore: number | null
    internshipChecks: number
    simulationsCount: number
  }
  quickGlance: {
    latestRoadmapGoal: string | null
    latestRoadmapDuration: number | null
    latestInterviewRole: string | null
    latestInterviewScore: number | null
    latestSimulation: { pathA: string; pathB: string } | null
  }
  quests: any[]
}

export default function DashboardPage() {
  const [data,    setData]    = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [xpToast, setXpToast] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d: DashboardData) => {
        setData(d)
        if (d.user.xpJustGained > 0) setXpToast(d.user.xpJustGained)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-destructive">Failed to load dashboard.</p>
      </div>
    )
  }

  const { user, stats, quickGlance, quests } = data
  const xpPct = user.xpForNext > 0 ? Math.round((user.xp / user.xpForNext) * 100) : 100
  
  const features = [
    { title: "Career Twin", desc: "AI-powered career profile & skills assessment.", url: "/dashboard/career-twin", icon: UserRound, color: "text-purple-400" },
    { title: "Skill Tree", desc: "Unlock and track your technical competencies.", url: "/dashboard/skill-tree", icon: Network, color: "text-blue-400" },
    { title: "Resume Analyzer", desc: "Get an ATS score and actionable feedback.", url: "/dashboard/resume", icon: FileText, color: "text-emerald-400" },
    { title: "Learning Roadmap", desc: "Step-by-step guides tailored for you.", url: "/dashboard/roadmap", icon: Map, color: "text-orange-400" },
    { title: "Interview Simulator", desc: "Practice mock interviews with AI.", url: "/dashboard/interview", icon: MessageSquare, color: "text-pink-400" },
    { title: "Internship Predictor", desc: "Estimate your chances for top roles.", url: "/dashboard/internship-predictor", icon: Building2, color: "text-indigo-400" },
    { title: "Career Simulator", desc: "Simulate different career outcomes.", url: "/dashboard/simulator", icon: TrendingUp, color: "text-rose-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">

      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          Welcome back, {user.firstName || 'Adventurer'}
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Your career progression dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progress & Stats */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Level header */}
          <div className="flex items-center gap-4 bg-background border border-border p-5 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <span className="text-2xl font-bold text-white">{user.level}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Career Level
              </p>
              <h1 className="text-xl font-bold text-foreground">
                {user.rolePath ?? 'Set your path in Career Twin'}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-700"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap font-medium">
                  {user.xp} / {user.xpForNext} XP
                </span>
              </div>
            </div>
          </div>

          {/* Stat grid — every value is real */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Skills Unlocked"
              icon={<Network className="w-4 h-4" />}
              value={`${stats.skillsUnlocked} / ${stats.totalSkillsAvailable}`}
              isEmpty={stats.skillsUnlocked === 0}
              emptyHint="Visit the Skill Tree"
              href="/dashboard/skill-tree"
            />
            <StatCard
              label="Best ATS Score"
              icon={<FileText className="w-4 h-4" />}
              value={stats.bestAtsScore ?? 0}
              sublabel="out of 100"
              isEmpty={stats.bestAtsScore === null}
              emptyHint="Analyze your resume"
              href="/dashboard/resume"
            />
            <StatCard
              label="Interviews"
              icon={<MessageSquare className="w-4 h-4" />}
              value={stats.interviewsCompleted}
              sublabel={stats.bestInterviewScore ? `Best: ${stats.bestInterviewScore}/100` : undefined}
              isEmpty={stats.interviewsCompleted === 0}
              emptyHint="Try a mock interview"
              href="/dashboard/interview"
            />
            <StatCard
              label="Active Roadmaps"
              icon={<Map className="w-4 h-4" />}
              value={stats.roadmapsCount}
              sublabel={quickGlance.latestRoadmapGoal ?? undefined}
              isEmpty={stats.roadmapsCount === 0}
              emptyHint="Set a career goal"
              href="/dashboard/roadmap"
            />
            <StatCard
              label="Simulations"
              icon={<Compass className="w-4 h-4" />}
              value={stats.simulationsCount}
              sublabel={
                quickGlance.latestSimulation
                  ? `${quickGlance.latestSimulation.pathA} vs ${quickGlance.latestSimulation.pathB}`
                  : undefined
              }
              isEmpty={stats.simulationsCount === 0}
              emptyHint="Compare two paths"
              href="/dashboard/simulator"
            />
            <StatCard
              label="Internship Checks"
              icon={<Building2 className="w-4 h-4" />}
              value={stats.internshipChecks}
              isEmpty={stats.internshipChecks === 0}
              emptyHint="Check your odds"
              href="/dashboard/internship-predictor"
            />
            <StatCard
              label="Resume Analyses"
              icon={<Search className="w-4 h-4" />}
              value={stats.resumeAnalysesCount}
              isEmpty={stats.resumeAnalysesCount === 0}
              emptyHint="Run your first analysis"
              href="/dashboard/resume"
            />
            <StatCard
              label="Career Twin"
              icon={<UserRound className="w-4 h-4" />}
              value={stats.hasProfile ? 'Built' : 'Not Built'}
              isEmpty={!stats.hasProfile}
              emptyHint="Upload your CV"
              href="/dashboard/career-twin"
            />
          </div>
          
          {/* Interactive Feature Grid */}
          <section className="pt-4">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" /> Core Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <Link href={f.url} key={i}>
                  <div className="group relative bg-background border border-border rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] overflow-hidden h-full flex flex-col">
                    <div className={`w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center mb-3 ${f.color}`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Quests */}
        <div className="lg:col-span-4 bg-background border border-border rounded-2xl p-6 shadow-sm">
          {/* Real quest list */}
          <QuestList quests={quests} />
        </div>
      </div>

      {/* XP gained toast */}
      {xpToast !== null && (
        <div
          className="fixed bottom-8 right-8 z-50 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-400 border border-emerald-300 rounded-xl px-5 py-3 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300"
          onAnimationEnd={() => setTimeout(() => setXpToast(null), 4000)}
          style={{ animationFillMode: 'forwards' }}
        >
          +{xpToast} XP from completed quests!
        </div>
      )}
    </div>
  )
}
