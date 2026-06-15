import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { careerProfiles, users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import Groq from 'groq-sdk'
import { getLevelInfo, getXpForLevel } from '@/lib/skills-data'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ── The prompt that drives everything ──────────────────────────────────────
const PROMPT = `You are an expert career analyst AI. Analyze the CV below and return ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON.

{
  "careerLevel": <integer 1–20>,
  "rolePath": "<primary role e.g. 'AI Engineer', 'Full Stack Developer', 'Data Scientist'>",
  "skillScore": <integer 0–100>,
  "experienceScore": <integer 0–100>,
  "projectScore": <integer 0–100>,
  "industryReadiness": <integer 0–100>,
  "xpGained": <integer 50–500>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["gap1", "gap2", "gap3"],
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "summary": "<2–3 sentence honest but encouraging professional assessment>",
  "recommendations": ["specific action 1", "specific action 2", "specific action 3"]
}

Scoring guide:
- careerLevel 1–6 = Junior Engineer, 7-13 = Engineer,
  14–20 = Senior Engineer, 21–27 = Staff Engineer, 28 = CTO
- skillScore: technical depth and breadth across relevant domains
- experienceScore: quality and relevance of internships/jobs
- projectScore: complexity, impact, and variety of projects built
- industryReadiness: overall readiness to be hired in their target field
- xpGained: reward for uploading this profile (stronger profile = more XP, max 500)

Be specific. Weaknesses should name concrete missing skills, not vague advice.

CV TEXT:
`

// ── POST — upload CV, analyze, save ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('cv') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Extract text from PDF or plain text using unpdf
    let cvText = ''
    if (file.type === 'application/pdf') {
      const { extractText } = await import('unpdf')
      const arrayBuffer = await file.arrayBuffer()
      const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true })
      cvText = text
    } else {
      cvText = await file.text()
    }

    if (!cvText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 })
    }

    // Call Groq (Llama 3.3 70B) for CV analysis
    let profile: any
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: PROMPT + cvText.slice(0, 8000)
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    // Normalize keys to support both camelCase and snake_case from LLM response
    profile = {
      careerLevel: Number(parsed.careerLevel ?? parsed.career_level ?? 1),
      rolePath: String(parsed.rolePath ?? parsed.role_path ?? ''),
      skillScore: Number(parsed.skillScore ?? parsed.skill_score ?? 0),
      experienceScore: Number(parsed.experienceScore ?? parsed.experience_score ?? 0),
      projectScore: Number(parsed.projectScore ?? parsed.project_score ?? 0),
      industryReadiness: Number(parsed.industryReadiness ?? parsed.industry_readiness ?? 0),
      xpGained: Number(parsed.xpGained ?? parsed.xp_gained ?? 0),
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      topSkills: parsed.topSkills ?? parsed.top_skills ?? [],
      recommendations: parsed.recommendations ?? [],
      summary: String(parsed.summary ?? ''),
    }

    // ── Apply Phase 3 NLP Section Presence & Metrics Audit ─────────────────────
    const textLower = cvText.toLowerCase()
    let scoreModifiers = 0
    const atsRecommendations = [...(profile.recommendations || [])]

    const sections = {
      objective: ['objective', 'summary', 'professional profile'],
      education: ['education', 'qualification', 'academic'],
      projects: ['projects', 'academic projects', 'personal projects'],
      experience: ['experience', 'work history', 'employment']
    }

    for (const [section, keywords] of Object.entries(sections)) {
      if (keywords.some(kw => textLower.includes(kw))) {
        scoreModifiers += 15
      } else {
        atsRecommendations.push(`Add a clear '${section.charAt(0).toUpperCase() + section.slice(1)}' section to pass automated ATS filters.`)
      }
    }

    // Metric / Quantification audit
    const hasMetrics = /%|\b(improved|increased|decreased|reduced|saved|optimized)\b.*\b\d+\b/gi.test(cvText)
    if (hasMetrics) {
      scoreModifiers += 20
    } else {
      atsRecommendations.push('Quantify your project achievements (e.g., "Improved response latency by 20%").')
    }

    // Update readiness score and recommendations with audited values
    profile.industryReadiness = Math.max(10, Math.min(100, (profile.industryReadiness || 50) + scoreModifiers - 40))
    profile.recommendations = atsRecommendations

    // Look up the internal user row (Clerk userId → our DB id)
    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Upsert: create on first upload, update on re-upload
    const [saved] = await db
      .insert(careerProfiles)
      .values({ userId: user.id, rawCvText: cvText.slice(0, 10000), ...profile })
      .onConflictDoUpdate({
        target: careerProfiles.userId,
        set: { ...profile, rawCvText: cvText.slice(0, 10000), updatedAt: new Date() },
      })
      .returning()

    // Sync level + XP back to the users table (for the sidebar display)
    // We want the user's XP to at least match the career level the AI evaluated them at
    const evaluatedXp = getXpForLevel(profile.careerLevel) + profile.xpGained;
    const accumulatedXp = Math.max(user.xp ?? 0, evaluatedXp);
    const finalLevel = getLevelInfo(accumulatedXp).level;

    await db
      .update(users)
      .set({ careerLevel: finalLevel, xp: accumulatedXp })
      .where(eq(users.clerkId, userId))

    return NextResponse.json({ profile: saved })
  } catch (err: any) {
    console.error('Career twin error:', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

// ── GET — fetch existing profile ────────────────────────────────────────────
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ profile: null })

    const [profile] = await db
      .select()
      .from(careerProfiles)
      .where(eq(careerProfiles.userId, user.id))

    return NextResponse.json({ profile: profile ?? null })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
