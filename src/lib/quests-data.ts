export interface UserStats {
  hasProfile:           boolean
  skillsUnlocked:       number
  resumeAnalysesCount:  number
  bestAtsScore:         number | null
  roadmapsCount:        number
  roadmapMonthsDone:    number
  interviewsCompleted:  number
  bestInterviewScore:   number | null
  internshipChecks:     number
  simulationsCount:     number
}

export interface Quest {
  id:          string
  title:       string
  description: string
  xpReward:    number
  category:    'onboarding' | 'growth' | 'mastery'
  icon:        string
  href:        string
  isComplete:  (stats: UserStats) => boolean
  progress:    (stats: UserStats) => { current: number; target: number }
}

export const QUESTS: Quest[] = [
  // ── Onboarding ──────────────────────────────────────────────────────────
  {
    id: 'build-career-twin',
    title: 'Build Your Career Twin',
    description: 'Upload your CV and let AI build your career profile',
    xpReward: 50,
    category: 'onboarding',
    icon: 'Dna',
    href: '/dashboard/career-twin',
    isComplete: (s) => s.hasProfile,
    progress: (s) => ({ current: s.hasProfile ? 1 : 0, target: 1 }),
  },
  {
    id: 'unlock-first-skill',
    title: 'Unlock Your First Skill',
    description: 'Open the Skill Tree and unlock a starting skill',
    xpReward: 30,
    category: 'onboarding',
    icon: 'Network',
    href: '/dashboard/skill-tree',
    isComplete: (s) => s.skillsUnlocked >= 1,
    progress: (s) => ({ current: Math.min(s.skillsUnlocked, 1), target: 1 }),
  },
  {
    id: 'analyze-resume',
    title: 'Optimize Your Resume',
    description: 'Run your CV through the Resume Analyzer against a real job',
    xpReward: 40,
    category: 'onboarding',
    icon: 'FileText',
    href: '/dashboard/resume',
    isComplete: (s) => s.resumeAnalysesCount >= 1,
    progress: (s) => ({ current: Math.min(s.resumeAnalysesCount, 1), target: 1 }),
  },
  {
    id: 'set-goal',
    title: 'Set a Career Goal',
    description: 'Generate a personalized learning roadmap',
    xpReward: 40,
    category: 'onboarding',
    icon: 'Map',
    href: '/dashboard/roadmap',
    isComplete: (s) => s.roadmapsCount >= 1,
    progress: (s) => ({ current: Math.min(s.roadmapsCount, 1), target: 1 }),
  },

  // ── Growth ──────────────────────────────────────────────────────────────
  {
    id: 'first-interview',
    title: 'Ace a Mock Interview',
    description: 'Complete a full interview simulation session',
    xpReward: 60,
    category: 'growth',
    icon: 'Mic',
    href: '/dashboard/interview',
    isComplete: (s) => s.interviewsCompleted >= 1,
    progress: (s) => ({ current: Math.min(s.interviewsCompleted, 1), target: 1 }),
  },
  {
    id: 'check-internships',
    title: 'Check Your Internship Odds',
    description: 'See your match percentage against real companies',
    xpReward: 30,
    category: 'growth',
    icon: 'Building2',
    href: '/dashboard/internship-predictor',
    isComplete: (s) => s.internshipChecks >= 1,
    progress: (s) => ({ current: Math.min(s.internshipChecks, 1), target: 1 }),
  },
  {
    id: 'compare-paths',
    title: 'Compare Two Career Paths',
    description: 'Simulate two 5-year career trajectories side by side',
    xpReward: 40,
    category: 'growth',
    icon: 'Compass',
    href: '/dashboard/simulator',
    isComplete: (s) => s.simulationsCount >= 1,
    progress: (s) => ({ current: Math.min(s.simulationsCount, 1), target: 1 }),
  },

  // ── Mastery ─────────────────────────────────────────────────────────────
  {
    id: 'skill-collector',
    title: 'Unlock 5 Skills',
    description: 'Build real depth in your skill tree',
    xpReward: 80,
    category: 'mastery',
    icon: 'Zap',
    href: '/dashboard/skill-tree',
    isComplete: (s) => s.skillsUnlocked >= 5,
    progress: (s) => ({ current: Math.min(s.skillsUnlocked, 5), target: 5 }),
  },
  {
    id: 'resume-90',
    title: 'Hit a 90+ ATS Score',
    description: 'Optimize your resume until it scores 90 or higher',
    xpReward: 100,
    category: 'mastery',
    icon: 'Target',
    href: '/dashboard/resume',
    isComplete: (s) => (s.bestAtsScore ?? 0) >= 90,
    progress: (s) => ({ current: Math.min(s.bestAtsScore ?? 0, 90), target: 90 }),
  },
  {
    id: 'interview-pro',
    title: 'Score 80+ in an Interview',
    description: 'Nail a mock interview with a strong overall score',
    xpReward: 100,
    category: 'mastery',
    icon: 'Trophy',
    href: '/dashboard/interview',
    isComplete: (s) => (s.bestInterviewScore ?? 0) >= 80,
    progress: (s) => ({ current: Math.min(s.bestInterviewScore ?? 0, 80), target: 80 }),
  },
]

/** Compute which quests are complete right now, for a given set of real stats */
export function computeQuestStatuses(stats: UserStats) {
  return QUESTS.map((quest) => ({
    quest,
    completed: quest.isComplete(stats),
    progress:  quest.progress(stats),
  }))
}
