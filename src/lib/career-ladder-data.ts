export interface CareerStage {
  id: string
  role: string
  icon: string
  description: string
  salaryRange: string
  requiredSkills: string[]
  estimatedTimeline: string
  levelThreshold: number
  children: string[]          // IDs of stages this one leads to
}

export const CAREER_STAGES: CareerStage[] = [
  {
    id: 'junior',
    role: 'Junior Engineer',
    icon: 'Leaf',
    description: 'Build your foundation. Learn core programming, version control, and debugging to ship your first features.',
    salaryRange: '$70k – $100k',
    requiredSkills: ['Core Programming', 'Git / Version Control', 'Basic Debugging', 'Code Reading'],
    estimatedTimeline: '0 – 2 years',
    levelThreshold: 1,
    children: ['engineer'],
  },
  {
    id: 'engineer',
    role: 'Engineer',
    icon: 'Cog',
    description: 'Own features end-to-end. Design systems, write production code, and participate in code reviews.',
    salaryRange: '$100k – $150k',
    requiredSkills: ['System Design Basics', 'CI/CD Pipelines', 'Code Reviewing', 'Testing Strategies'],
    estimatedTimeline: '2 – 4 years',
    levelThreshold: 5,
    children: ['senior'],
  },
  {
    id: 'senior',
    role: 'Senior Engineer',
    icon: 'Diamond',
    description: 'Lead complex projects. Architect scalable solutions, mentor juniors, and optimize performance at scale.',
    salaryRange: '$140k – $200k+',
    requiredSkills: ['Advanced Architecture', 'Mentorship', 'Performance Optimization', 'Cross-team Collaboration'],
    estimatedTimeline: '5 – 8 years',
    levelThreshold: 10,
    children: ['staff'],
  },
  {
    id: 'staff',
    role: 'Staff Engineer',
    icon: 'Landmark',
    description: 'Set technical direction across teams. Drive platform strategy and influence engineering culture.',
    salaryRange: '$180k – $250k+',
    requiredSkills: ['Cross-team Leadership', 'Strategic Technical Vision', 'Scaling Systems', 'Tech Debt Strategy'],
    estimatedTimeline: '8 – 12 years',
    levelThreshold: 15,
    children: ['cto'],
  },
  {
    id: 'cto',
    role: 'CTO',
    icon: 'Crown',
    description: 'Lead the entire engineering organization. Shape business strategy through technology and build world-class teams.',
    salaryRange: '$250k – $400k+',
    requiredSkills: ['Executive Leadership', 'Business Strategy', 'Org Building', 'Board-level Communication'],
    estimatedTimeline: '12+ years',
    levelThreshold: 20,
    children: [],
  },
]

/**
 * Given a user level, determine which stage they are currently at.
 * Returns the index into CAREER_STAGES (0-based).
 */
export function getCurrentStageIndex(userLevel: number): number {
  let current = 0
  for (let i = CAREER_STAGES.length - 1; i >= 0; i--) {
    if (userLevel >= CAREER_STAGES[i].levelThreshold) {
      current = i
      break
    }
  }
  return current
}

export type StageStatus = 'completed' | 'current' | 'next' | 'locked'

/**
 * Compute the visual status for each stage based on the user's current level.
 */
export function getStageStatuses(userLevel: number): Record<string, StageStatus> {
  const currentIdx = getCurrentStageIndex(userLevel)
  const result: Record<string, StageStatus> = {}

  for (let i = 0; i < CAREER_STAGES.length; i++) {
    const stage = CAREER_STAGES[i]
    if (i < currentIdx) {
      result[stage.id] = 'completed'
    } else if (i === currentIdx) {
      result[stage.id] = 'current'
    } else if (i === currentIdx + 1) {
      result[stage.id] = 'next'
    } else {
      result[stage.id] = 'locked'
    }
  }
  return result
}
