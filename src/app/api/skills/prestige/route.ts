import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userSkills } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { SKILLS } from '@/lib/skills-data'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { category } = await req.json()
    if (!category || !['ai', 'fullstack', 'devops'].includes(category)) {
      return NextResponse.json({ error: 'Invalid or missing category' }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Determine current prestige level
    let currentPrestige = 0
    if (category === 'ai') currentPrestige = user.prestigeAi ?? 0
    else if (category === 'fullstack') currentPrestige = user.prestigeFullstack ?? 0
    else if (category === 'devops') currentPrestige = user.prestigeDevops ?? 0

    // Only allow ascending to Tier 2 (level 1) or Tier 3 (level 2)
    if (currentPrestige >= 2) {
      return NextResponse.json({ error: 'You have already reached the final tier for this path.' }, { status: 400 })
    }

    const nextPrestige = currentPrestige + 1

    // Validate that all skills of the target tier's prerequisite levels are unlocked
    // To reach Tier 2 (prestige 1), all Tier 1 skills must be unlocked.
    // To reach Tier 3 (prestige 2), all Tier 2 skills must be unlocked.
    const requiredSkills = SKILLS.filter(
      (s) =>
        s.category === category &&
        (nextPrestige === 1 ? s.tier !== 2 && s.tier !== 3 : s.tier === 2)
    )
    const requiredIds = requiredSkills.map((s) => s.id)

    // Get user's current unlocked skills
    const existingUnlocks = await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, user.id))
    
    const unlockedIds = new Set(existingUnlocks.map((r) => r.skillId))

    const allUnlocked = requiredIds.every((id) => unlockedIds.has(id))
    if (!allUnlocked) {
      const currentTierText = nextPrestige === 1 ? 'Tier 1' : 'Tier 2'
      return NextResponse.json({ 
        error: `All ${currentTierText} skills in the ${category} path must be unlocked before ascending.` 
      }, { status: 400 })
    }

    const xpReward = nextPrestige === 1 ? 500 : 1000
    const newXP = (user.xp ?? 0) + xpReward

    // Update database
    const updateData: Record<string, any> = { xp: newXP }
    if (category === 'ai') updateData.prestigeAi = nextPrestige
    else if (category === 'fullstack') updateData.prestigeFullstack = nextPrestige
    else if (category === 'devops') updateData.prestigeDevops = nextPrestige

    await db.update(users).set(updateData).where(eq(users.clerkId, userId))

    const updatedPrestigeLevels = {
      ai: category === 'ai' ? nextPrestige : (user.prestigeAi ?? 0),
      fullstack: category === 'fullstack' ? nextPrestige : (user.prestigeFullstack ?? 0),
      devops: category === 'devops' ? nextPrestige : (user.prestigeDevops ?? 0),
    }

    return NextResponse.json({ 
      success: true, 
      prestigeLevels: updatedPrestigeLevels, 
      xpGained: xpReward, 
      totalXP: newXP 
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to ascend path' }, { status: 500 })
  }
}
