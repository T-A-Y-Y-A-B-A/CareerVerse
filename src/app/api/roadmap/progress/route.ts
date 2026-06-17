import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, roadmapProgress } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'

// POST — mark a month as complete or incomplete (toggle)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { roadmapId, monthIndex } = await req.json()
    if (roadmapId == null || monthIndex == null) {
      return NextResponse.json({ error: 'roadmapId and monthIndex required' }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Check if already marked complete
    const [existing] = await db
      .select()
      .from(roadmapProgress)
      .where(
        and(
          eq(roadmapProgress.roadmapId, roadmapId),
          eq(roadmapProgress.monthIndex, monthIndex),
          eq(roadmapProgress.userId, user.id)
        )
      )

    if (existing) {
      // Toggle off — delete the record
      await db
        .delete(roadmapProgress)
        .where(eq(roadmapProgress.id, existing.id))
      return NextResponse.json({ completed: false })
    } else {
      // Mark complete
      await db.insert(roadmapProgress).values({
        roadmapId,
        monthIndex,
        userId: user.id,
      })
      return NextResponse.json({ completed: true })
    }
  } catch (err: any) {
    if (err?.code === '23505') return NextResponse.json({ completed: true }) // already exists, treat as success
    console.error(err)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

// GET — fetch completed month indices for a roadmap
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roadmapId = req.nextUrl.searchParams.get('roadmapId')
    if (!roadmapId) return NextResponse.json({ error: 'roadmapId required' }, { status: 400 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ completed: [] })

    const rows = await db
      .select({ monthIndex: roadmapProgress.monthIndex })
      .from(roadmapProgress)
      .where(
        and(
          eq(roadmapProgress.roadmapId, parseInt(roadmapId)),
          eq(roadmapProgress.userId, user.id)
        )
      )

    return NextResponse.json({ completed: rows.map((r) => r.monthIndex) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
