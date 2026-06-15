import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userSkills } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { SKILLS, computeStatuses, getLevelInfo } from '@/lib/skills-data'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const unlocked = await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, user.id))

    const unlockedIds  = new Set(unlocked.map((r) => r.skillId))
    const prestigeLevels = {
      ai: user.prestigeAi ?? 0,
      fullstack: user.prestigeFullstack ?? 0,
      devops: user.prestigeDevops ?? 0,
    }
    const statuses     = computeStatuses(SKILLS, unlockedIds, prestigeLevels)
    const levelInfo    = getLevelInfo(user.xp ?? 0)

    return NextResponse.json({
      statuses,
      levelInfo,
      skills: SKILLS,
      prestige: prestigeLevels,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 })
  }
}
