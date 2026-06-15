import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userSkills } from '@/lib/schema'
import { eq, inArray, and } from 'drizzle-orm'
import { SKILLS, computeStatuses } from '@/lib/skills-data'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { skillId } = await req.json()
    if (!skillId) return NextResponse.json({ error: 'skillId required' }, { status: 400 })

    const skill = SKILLS.find((s) => s.id === skillId)
    if (!skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Fetch existing unlocks
    const existingUnlocks = await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, user.id))

    const unlockedIds = new Set(existingUnlocks.map((r) => r.skillId))

    // TOGGLE ACTION: If skill is already unlocked, we LOCK/UNMARK it (and cascade lock any dependent skills)
    if (unlockedIds.has(skillId)) {
      // Find descendants in the unlocked tree that require this skill
      const toCheck = [skillId]
      const descendants = new Set<string>()
      while (toCheck.length > 0) {
        const current = toCheck.shift()!
        for (const s of SKILLS) {
          if (unlockedIds.has(s.id) && s.requires.includes(current) && !descendants.has(s.id)) {
            descendants.add(s.id)
            toCheck.push(s.id)
          }
        }
      }

      const skillsToLock = [skillId, ...Array.from(descendants)]

      // Calculate XP to deduct
      let xpToDeduct = 0
      for (const id of skillsToLock) {
        const sObj = SKILLS.find((s) => s.id === id)
        if (sObj) xpToDeduct += sObj.xpReward
      }

      // Delete the skill unlocks from database
      await db
        .delete(userSkills)
        .where(
          and(
            eq(userSkills.userId, user.id),
            inArray(userSkills.skillId, skillsToLock)
          )
        )

      // Update user XP (keep XP >= 0)
      const newXP = Math.max(0, (user.xp ?? 0) - xpToDeduct)
      await db.update(users).set({ xp: newXP }).where(eq(users.clerkId, userId))

      return NextResponse.json({ 
        success: true, 
        xpGained: -xpToDeduct, 
        totalXP: newXP,
        action: 'locked',
        skillsLocked: skillsToLock
      })
    }

    // UNLOCK ACTION: If skill is not unlocked, we UNLOCK it
    const prestigeLevels = {
      ai: user.prestigeAi ?? 0,
      fullstack: user.prestigeFullstack ?? 0,
      devops: user.prestigeDevops ?? 0,
    }
    const statuses = computeStatuses(SKILLS, unlockedIds, prestigeLevels)
    if (statuses[skillId] !== 'available') {
      return NextResponse.json({ error: 'Prerequisites not met' }, { status: 403 })
    }

    // Insert unlock record
    await db.insert(userSkills).values({ userId: user.id, skillId })

    // Add XP to user
    const newXP = (user.xp ?? 0) + skill.xpReward
    await db.update(users).set({ xp: newXP }).where(eq(users.clerkId, userId))

    return NextResponse.json({ 
      success: true, 
      xpGained: skill.xpReward, 
      totalXP: newXP,
      action: 'unlocked'
    })
  } catch (err: any) {
    if (err?.code === '23505') {
      return NextResponse.json({ error: 'Skill already unlocked' }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Failed to toggle skill' }, { status: 500 })
  }
}
