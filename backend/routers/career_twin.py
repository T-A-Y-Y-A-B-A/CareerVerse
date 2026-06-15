# routers/career_twin.py

import io
import json
import re
import httpx
import pdfplumber
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header
from datetime import datetime
from db import get_db

router = APIRouter(prefix="/api/career-twin", tags=["career-twin"])

# ─── Ollama prompt ────────────────────────────────────────────────────────────

ANALYSIS_PROMPT = """
You are a professional career analyst. Analyze the following CV text and return ONLY a valid JSON object — no explanation, no markdown, no code fences.

CV TEXT:
{cv_text}

Return this exact JSON structure:
{{
  "career_level": <integer 1-20>,
  "role_path": "<most fitting role e.g. AI Engineer, Full Stack Developer, DevOps Engineer>",
  "experience_score": <integer 0-100>,
  "skill_score": <integer 0-100>,
  "project_score": <integer 0-100>,
  "industry_readiness": <integer 0-100>,
  "xp_gained": <integer, calculated as average of all 4 scores>,
  "summary": "<2-3 sentence professional summary of this candidate>",
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific gap 1", "specific gap 2", "specific gap 3"],
  "recommendations": ["action item 1", "action item 2", "action item 3", "action item 4"]
}}

Rules:
- career_level: 1-5 = student/no experience, 6-10 = junior, 11-15 = mid, 16-20 = senior
- Be specific in weaknesses (e.g. "No Docker/containerization experience" not "improve skills")
- recommendations must be concrete next steps (e.g. "Build and deploy one ML project to AWS")
- Return ONLY the JSON. Nothing else.
"""

# ─── Helper: call Ollama ──────────────────────────────────────────────────────

async def analyze_cv_with_ollama(cv_text: str) -> dict:
    prompt = ANALYSIS_PROMPT.format(cv_text=cv_text[:4000])  # cap tokens

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",          # or "mistral" — whatever you have pulled
                "prompt": prompt,
                "stream": False
            }
        )

    if response.status_code != 200:
        raise HTTPException(500, f"Ollama error: {response.text}")

    raw = response.json().get("response", "")

    # Strip any accidental markdown fences the model adds
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()

    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        raise HTTPException(500, f"LLM returned invalid JSON: {raw[:300]}")


# ─── Helper: extract text from PDF ───────────────────────────────────────────

def extract_pdf_text(file_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)

    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise HTTPException(422, "Could not extract text from PDF. Make sure it's not a scanned image.")

    return full_text


# ─── Main endpoint ────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_cv(
    file: UploadFile = File(...),
    clerk_id: str = Header(None),  # expects X-Clerk-Id header
    db = Depends(get_db)
):
    # 1. Validate file type
    if file.content_type not in ["application/pdf", "application/octet-stream"]:
        raise HTTPException(400, "Only PDF files are accepted.")

    # 2. Read + extract text
    file_bytes = await file.read()
    cv_text = extract_pdf_text(file_bytes)

    # 3. Fetch user from DB using clerk_id
    user_row = await db.fetchrow("SELECT id FROM users WHERE clerk_id = $1", clerk_id)
    if not user_row:
        raise HTTPException(404, "User not found. Make sure the webhook registered this user.")
    user_id = user_row["id"]
    # 4. Send to Ollama for analysis
    analysis = await analyze_cv_with_ollama(cv_text)

    # 5. Upsert into career_profiles
    # Insert or upsert using asyncpg
    await db.execute(
        """
        INSERT INTO career_profiles (
            user_id, raw_cv_text, career_level, role_path,
            skill_score, experience_score, project_score, industry_readiness,
            xp_gained, summary, top_skills, strengths, weaknesses, recommendations,
            created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11::json, $12::json, $13::json, $14::json,
            NOW(), NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            raw_cv_text = EXCLUDED.raw_cv_text,
            career_level = EXCLUDED.career_level,
            role_path = EXCLUDED.role_path,
            skill_score = EXCLUDED.skill_score,
            experience_score = EXCLUDED.experience_score,
            project_score = EXCLUDED.project_score,
            industry_readiness = EXCLUDED.industry_readiness,
            xp_gained = EXCLUDED.xp_gained,
            summary = EXCLUDED.summary,
            top_skills = EXCLUDED.top_skills,
            strengths = EXCLUDED.strengths,
            weaknesses = EXCLUDED.weaknesses,
            recommendations = EXCLUDED.recommendations,
            updated_at = NOW();
        """,
        user_id,
        cv_text,
        analysis.get("career_level", 1),
        analysis.get("role_path", ""),
        analysis.get("skill_score", 0),
        analysis.get("experience_score", 0),
        analysis.get("project_score", 0),
        analysis.get("industry_readiness", 0),
        analysis.get("xp_gained", 0),
        analysis.get("summary", ""),
        json.dumps(analysis.get("top_skills", [])),
        json.dumps(analysis.get("strengths", [])),
        json.dumps(analysis.get("weaknesses", [])),
        json.dumps(analysis.get("recommendations", []))
    )

    # 6. Update users table — sync career_level and add XP
    await db.execute(
        """
        UPDATE users SET career_level = $1, xp = xp + $2, updated_at = NOW() WHERE id = $3;
        """,
        analysis.get("career_level", 1),
        analysis.get("xp_gained", 0),
        user_id
    )

    await db.commit()

    # 7. Return full analysis to frontend
    return {
        "status": "success",
        "career_level":       analysis.get("career_level"),
        "role_path":          analysis.get("role_path"),
        "experience_score":   analysis.get("experience_score"),
        "skill_score":        analysis.get("skill_score"),
        "project_score":      analysis.get("project_score"),
        "industry_readiness": analysis.get("industry_readiness"),
        "xp_gained":          analysis.get("xp_gained"),
        "summary":            analysis.get("summary"),
        "top_skills":         analysis.get("top_skills"),
        "strengths":          analysis.get("strengths"),
        "weaknesses":         analysis.get("weaknesses"),
        "recommendations":    analysis.get("recommendations"),
    }


# ─── GET endpoint — fetch existing profile ───────────────────────────────────

@router.get("/")
async def get_career_twin(clerk_id: str, db = Depends(get_db)):
    row = await db.fetchrow("""
        SELECT cp.* FROM career_profiles cp
        JOIN users u ON u.id = cp.user_id
        WHERE u.clerk_id = $1
    """, clerk_id)

    if not row:
        return {"status": "no_profile"}

    return dict(row)