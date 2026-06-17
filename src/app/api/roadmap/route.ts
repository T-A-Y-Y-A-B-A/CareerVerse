import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, careerProfiles, roadmaps } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function buildPrompt(goal: string, duration: number, existingSkills: string[], gaps: string[]): string {
  return `You are an expert career coach and curriculum designer.

A student wants to: "${goal}"
Timeline: ${duration} months
Skills they already have: ${existingSkills.length ? existingSkills.join(', ') : 'none listed'}
Known skill gaps: ${gaps.length ? gaps.join(', ') : 'none listed'}

Create a personalized month-by-month learning roadmap. Do NOT include skills they already have.
Start from their current level and build toward their goal.

Return ONLY valid JSON — no markdown, no backticks, no text outside the JSON.

{
  "targetRole": "<inferred target role from the goal>",
  "months": [
    {
      "month": 1,
      "title": "<theme for this month, e.g. 'Python Foundations'>",
      "topics": ["topic1", "topic2", "topic3"],
      "project": "<one concrete project to build this month>",
      "milestone": "<one measurable achievement to hit by end of month>"
    }
  ]
}

Rules:
- Generate exactly ${duration} month objects
- Each month builds on the previous one
- topics: 2–4 specific things to learn (not vague like 'learn Python' — specific like 'list comprehensions, decorators, async/await')
- project: one real, buildable project (e.g. 'Build a sentiment analysis CLI tool')
- milestone: one concrete, measurable goal (e.g. 'Complete 3 Kaggle notebooks with >80% accuracy')
- Progression must be logical — no jumping from beginner to advanced in one month
`
}

// POST — generate new roadmap
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { goal, duration = 4 } = await req.json()
    if (!goal?.trim()) return NextResponse.json({ error: 'Goal is required' }, { status: 400 })
    if (duration < 1 || duration > 12) return NextResponse.json({ error: 'Duration must be 1–12 months' }, { status: 400 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Pull existing skills and gaps from career profile
    const [profile] = await db
      .select({ topSkills: careerProfiles.topSkills, weaknesses: careerProfiles.weaknesses })
      .from(careerProfiles)
      .where(eq(careerProfiles.userId, user.id))

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: buildPrompt(
          goal,
          duration,
          profile?.topSkills ?? [],
          profile?.weaknesses ?? []
        ),
      }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const raw    = completion.choices[0]?.message?.content || '{}'
    const clean  = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    const [saved] = await db
      .insert(roadmaps)
      .values({
        userId:     user.id,
        goal:       goal.trim(),
        targetRole: parsed.targetRole ?? null,
        duration,
        months:     parsed.months ?? [],
      })
      .returning()

    return NextResponse.json({ roadmap: saved })
  } catch (err) {
    console.error('Roadmap generation error:', err)
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}

// GET — fetch most recent roadmap
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ roadmap: null })

    const [latest] = await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.userId, user.id))
      .orderBy(desc(roadmaps.createdAt))
      .limit(1)

    return NextResponse.json({ roadmap: latest ?? null })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 })
  }
}
