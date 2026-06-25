import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import {
  users,
  careerProfiles,
  userSkills,
  resumeAnalyses,
  roadmaps,
  roadmapProgress,
  internshipPredictions,
  interviewSessions,
  careerSimulations,
  questCompletions,
} from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { computeQuestStatuses, type UserStats } from '@/lib/quests-data'
import { getLevelInfo, SKILLS } from '@/lib/skills-data'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // ── Pull real counts for every feature, in parallel ──────────────────
    const [
      profileRows,
      skillRows,
      resumeRows,
      roadmapRows,
      roadmapProgressRows,
      internshipRows,
      interviewRows,
      simulationRows,
    ] = await Promise.all([
      db.select().from(careerProfiles).where(eq(careerProfiles.userId, user.id)),
      db.select().from(userSkills).where(eq(userSkills.userId, user.id)),
      db.select().from(resumeAnalyses).where(eq(resumeAnalyses.userId, user.id)),
      db.select().from(roadmaps).where(eq(roadmaps.userId, user.id)),
      db.select().from(roadmapProgress).where(eq(roadmapProgress.userId, user.id)),
      db.select().from(internshipPredictions).where(eq(internshipPredictions.userId, user.id)),
      db.select().from(interviewSessions).where(eq(interviewSessions.userId, user.id)),
      db.select().from(careerSimulations).where(eq(careerSimulations.userId, user.id)),
    ])

    const profile              = profileRows[0] ?? null
    const completedInterviews  = interviewRows.filter((r) => r.completed)
    const bestAtsScore         = resumeRows.length ? Math.max(...resumeRows.map((r) => r.atsScore)) : null
    const bestInterviewScore   = completedInterviews.length ? Math.max(...completedInterviews.map((r) => r.avgScore ?? 0)) : null

    // ── Build the stats object used for quest computation ────────────────
    const stats: UserStats = {
      hasProfile:          !!profile,
      skillsUnlocked:      skillRows.length,
      resumeAnalysesCount: resumeRows.length,
      bestAtsScore,
      roadmapsCount:       roadmapRows.length,
      roadmapMonthsDone:   roadmapProgressRows.length,
      interviewsCompleted: completedInterviews.length,
      bestInterviewScore,
      internshipChecks:    internshipRows.length,
      simulationsCount:    simulationRows.length,
    }

    // ── Compute quest statuses ────────────────────────────────────────────
    const questStatuses = computeQuestStatuses(stats)

    // ── Award XP for any quest that is now complete but hasn't paid out yet
    const existingCompletions = await db
      .select({ questId: questCompletions.questId })
      .from(questCompletions)
      .where(eq(questCompletions.userId, user.id))

    const alreadyAwarded = new Set(existingCompletions.map((r) => r.questId))
    const newlyCompleted = questStatuses.filter(
      (qs) => qs.completed && !alreadyAwarded.has(qs.quest.id)
    )

    let totalNewXp = 0
    for (const qs of newlyCompleted) {
      await db.insert(questCompletions).values({
        userId:    user.id,
        questId:   qs.quest.id,
        xpAwarded: qs.quest.xpReward,
      })
      totalNewXp += qs.quest.xpReward
    }

    let updatedXp = user.xp ?? 0
    if (totalNewXp > 0) {
      updatedXp = updatedXp + totalNewXp
      await db.update(users).set({ xp: updatedXp }).where(eq(users.clerkId, userId))
    }

    const levelInfo = getLevelInfo(updatedXp)

    // ── Latest items for quick-glance sublabels ──────────────────────────
    const latestRoadmap    = roadmapRows.sort((a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!))[0] ?? null
    const latestInterview  = completedInterviews.sort((a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!))[0] ?? null
    const latestSimulation = simulationRows.sort((a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!))[0] ?? null

    return NextResponse.json({
      user: {
        firstName:    user.firstName,
        level:        levelInfo.level,
        xp:           levelInfo.currentXP,
        xpForNext:    levelInfo.xpForNext,
        totalXp:      levelInfo.totalXP,
        rolePath:     profile?.rolePath ?? null,
        xpJustGained: totalNewXp,
      },
      stats: {
        ...stats,
        totalSkillsAvailable: SKILLS.length,
      },
      quickGlance: {
        latestRoadmapGoal:     latestRoadmap?.goal ?? null,
        latestRoadmapDuration: latestRoadmap?.duration ?? null,
        latestInterviewRole:   latestInterview?.targetRole ?? null,
        latestInterviewScore:  latestInterview?.avgScore ?? null,
        latestSimulation:      latestSimulation
          ? { pathA: (latestSimulation.pathA as any)?.role, pathB: (latestSimulation.pathB as any)?.role }
          : null,
      },
      quests: questStatuses.map((qs) => ({
        id:          qs.quest.id,
        title:       qs.quest.title,
        description: qs.quest.description,
        icon:        qs.quest.icon,
        category:    qs.quest.category,
        href:        qs.quest.href,
        xpReward:    qs.quest.xpReward,
        completed:   qs.completed,
        progress:    qs.progress,
      })),
    })
  } catch (err) {
    console.error('Dashboard aggregation error:', err)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
