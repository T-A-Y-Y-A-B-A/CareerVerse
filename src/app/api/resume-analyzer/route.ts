import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { careerProfiles, users, resumeAnalyses } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const RESUME_ANALYZER_PROMPT = `You are a senior ATS (Applicant Tracking System) expert and resume consultant. Analyze the RESUME against the JOB DESCRIPTION below.

Return ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON.

{
  "overallMatch": <integer 0–100, how well the resume matches this specific job>,
  "atsScore": <integer 0–100, likelihood of passing automated ATS filters>,
  "keywordMatch": <integer 0–100, percentage of job keywords found in resume>,
  "experienceRelevance": <integer 0–100, how relevant the experience is to this role>,
  "skillsAlignment": <integer 0–100, alignment of candidate's skills with requirements>,
  "matchedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "missingKeywords": ["missing1", "missing2", "missing3", "missing4", "missing5"],
  "strongPoints": ["specific strength 1 for this job", "strength 2", "strength 3"],
  "weakPoints": ["specific weakness 1 for this job", "weakness 2", "weakness 3"],
  "suggestions": [
    "Specific, actionable suggestion 1 to improve resume for this job",
    "Suggestion 2",
    "Suggestion 3",
    "Suggestion 4",
    "Suggestion 5"
  ],
  "rewrittenSummary": "<A 2-3 sentence rewritten professional summary optimized for this specific job>",
  "fitVerdict": "<One of: 'Strong Fit', 'Moderate Fit', 'Weak Fit', 'Poor Fit'>",
  "verdictExplanation": "<2-3 sentence explanation of the verdict>"
}

Scoring guide:
- overallMatch: Weighted combination of all factors. 80+ = strong fit, 60-79 = moderate, 40-59 = weak, below 40 = poor
- atsScore: Check for proper formatting, section headers, keyword density, quantified achievements
- keywordMatch: Count how many hard skills, tools, and technologies from the JD appear in the resume
- experienceRelevance: How closely does the work history align with what the job needs
- skillsAlignment: Do the candidate's demonstrated skills match the required and preferred skills

Be brutally honest but constructive. Name specific technologies, tools, and skills. Don't be vague.

RESUME TEXT:
---
{RESUME}
---

JOB DESCRIPTION:
---
{JOB_DESCRIPTION}
---
`

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const jobDescription = body.jobDescription as string

    if (!jobDescription || jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide a meaningful job description (at least 20 characters).' },
        { status: 400 }
      )
    }

    // Look up the internal user row
    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch existing career profile to get rawCvText
    const [profile] = await db
      .select()
      .from(careerProfiles)
      .where(eq(careerProfiles.userId, user.id))

    if (!profile || !profile.rawCvText) {
      return NextResponse.json(
        { error: 'No resume found. Please upload your CV in the Career Twin page first.' },
        { status: 404 }
      )
    }

    // Build the prompt with resume and job description injected
    const filledPrompt = RESUME_ANALYZER_PROMPT
      .replace('{RESUME}', profile.rawCvText.slice(0, 6000))
      .replace('{JOB_DESCRIPTION}', jobDescription.slice(0, 4000))

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: filledPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    // Normalize the response
    const analysis = {
      overallMatch: Number(parsed.overallMatch ?? parsed.overall_match ?? 0),
      atsScore: Number(parsed.atsScore ?? parsed.ats_score ?? 0),
      keywordMatch: Number(parsed.keywordMatch ?? parsed.keyword_match ?? 0),
      experienceRelevance: Number(parsed.experienceRelevance ?? parsed.experience_relevance ?? 0),
      skillsAlignment: Number(parsed.skillsAlignment ?? parsed.skills_alignment ?? 0),
      matchedKeywords: parsed.matchedKeywords ?? parsed.matched_keywords ?? [],
      missingKeywords: parsed.missingKeywords ?? parsed.missing_keywords ?? [],
      strongPoints: parsed.strongPoints ?? parsed.strong_points ?? [],
      weakPoints: parsed.weakPoints ?? parsed.weak_points ?? [],
      suggestions: parsed.suggestions ?? [],
      rewrittenSummary: String(parsed.rewrittenSummary ?? parsed.rewritten_summary ?? ''),
      fitVerdict: String(parsed.fitVerdict ?? parsed.fit_verdict ?? 'Unknown'),
      verdictExplanation: String(parsed.verdictExplanation ?? parsed.verdict_explanation ?? ''),
    }

    // Save the analysis to the database
    await db.insert(resumeAnalyses).values({
      userId: user.id,
      targetRole: jobDescription.substring(0, 50), // Store a snippet of the JD or extract role if possible
      atsScore: analysis.atsScore,
    })

    return NextResponse.json({ analysis })
  } catch (err: any) {
    console.error('Resume analyzer error:', err)
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    )
  }
}
