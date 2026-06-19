import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, careerProfiles, internshipPredictions } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// The companies we predict against — real Pakistani tech companies
const COMPANIES = [
  { name: 'Arbisoft',    type: 'Product + Services', known_for: 'Django, React, strong CS fundamentals, US clients' },
  { name: 'Systems Limited', type: 'Enterprise IT', known_for: 'Java, .NET, banking systems, ERP, enterprise clients' },
  { name: 'Devsinc',    type: 'Software Services', known_for: 'React, Node.js, mobile development, US/UK clients' },
  { name: '10Pearls',   type: 'Digital Product Studio', known_for: 'Full stack, cloud, product thinking, US clients' },
  { name: 'Netsol Technologies', type: 'Fintech', known_for: 'Java, .NET, leasing software, global clients' },
  { name: 'i2c Inc',   type: 'Fintech Product', known_for: 'Payment processing, C++, Java, high performance systems' },
  { name: 'Techlogix', type: 'Microsoft Partner', known_for: 'Azure, .NET, Power Platform, enterprise clients' },
  { name: 'Tkxel',     type: 'Software Services', known_for: 'React, Node, Python, US startup clients' },
]

function buildPrompt(
  targetRole: string,
  gpa: string,
  skills: string[],
  extraSkills: string[],
  projectScore: number,
  strengths: string[],
  weaknesses: string[]
): string {
  return `You are a senior HR director and hiring expert at a Pakistani tech company.

Evaluate this student's internship readiness against multiple companies.

STUDENT PROFILE:
- Target Role: ${targetRole}
- GPA: ${gpa || 'Not provided'}
- Core Skills: ${skills.join(', ') || 'None listed'}
- Additional Skills: ${extraSkills.join(', ') || 'None listed'}
- Project Score: ${projectScore}/100
- Strengths: ${strengths.join(', ') || 'None listed'}
- Weaknesses: ${weaknesses.join(', ') || 'None listed'}

COMPANIES TO EVALUATE:
${COMPANIES.map((c) => `- ${c.name} (${c.type}): Known for ${c.known_for}`).join('\n')}

Return ONLY valid JSON — no markdown, no backticks.

{
  "companies": [
    {
      "company": "<company name exactly as given>",
      "match": <integer 0–100>,
      "verdict": "<exactly one of: 'Strong Match', 'Possible', 'Reach'>",
      "reasons": ["reason1", "reason2"],
      "gaps": ["gap1", "gap2"],
      "tip": "<one specific, actionable thing to improve this match score>"
    }
  ]
}

Rules:
- verdict: 'Strong Match' = match ≥ 75, 'Possible' = 50–74, 'Reach' = < 50
- reasons: 2–3 specific reasons this student fits THIS company (reference the company's known tech/culture)
- gaps: 1–3 specific things missing for THIS company (be honest, name exact skills)
- tip: one concrete action — e.g. 'Build a Django REST API project and deploy it on Heroku'
- GPA matters for some companies (especially Arbisoft, 10Pearls) — factor it in
- Order companies by match score descending
- Be realistic — do not give everyone 80%+
`
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { gpa, targetRole, extraSkills = [] } = await req.json()
    if (!targetRole?.trim()) return NextResponse.json({ error: 'Target role is required' }, { status: 400 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const [profile] = await db
      .select()
      .from(careerProfiles)
      .where(eq(careerProfiles.userId, user.id))

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: buildPrompt(
          targetRole,
          gpa || '',
          profile?.topSkills ?? [],
          extraSkills,
          profile?.projectScore ?? 0,
          profile?.strengths ?? [],
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
      .insert(internshipPredictions)
      .values({
        userId:      user.id,
        gpa:         gpa || null,
        targetRole,
        extraSkills,
        companies:   parsed.companies ?? [],
      })
      .returning()

    return NextResponse.json({ prediction: saved })
  } catch (err) {
    console.error('Internship predictor error:', err)
    return NextResponse.json({ error: 'Prediction failed. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) return NextResponse.json({ prediction: null })

    const [latest] = await db
      .select()
      .from(internshipPredictions)
      .where(eq(internshipPredictions.userId, user.id))
      .orderBy(desc(internshipPredictions.createdAt))
      .limit(1)

    return NextResponse.json({ prediction: latest ?? null })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch prediction' }, { status: 500 })
  }
}
