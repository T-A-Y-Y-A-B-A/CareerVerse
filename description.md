# CareerVerse
### "Level Up Your Career Like a Video Game."

**CareerVerse** is an AI-powered, gamified career simulation platform designed for students and early-career professionals who want more than generic advice. It treats your career like an RPG character — you have a level, a skill tree, strengths and weaknesses, and a roadmap to your next milestone. Instead of staring at a blank CV wondering what to do next, you get a living, intelligent system that tells you exactly where you stand, what you're missing, and how to get where you want to go.

---

## The Problem

Most students enter the job market without a clear picture of their competitive position. They don't know which skills matter for the roles they want, how their CV reads to an ATS system, which companies they're actually ready for, or what a realistic path to their dream job looks like. Career advice online is generic. University guidance is outdated. And nobody tells you that the gap between where you are and where you want to be is actually bridgeable — if you know what to do next.

CareerVerse solves this by turning the ambiguity of career planning into a structured, interactive, AI-driven experience. It's not a job board. It's not a course platform. It's a system that meets you where you are, analyzes what you bring, and builds a personalized game plan — just for you.

---

## Core Concept

Your career is your character.

When you join CareerVerse, you upload your CV, connect your GitHub, and optionally paste your LinkedIn profile. The system builds your **Career Twin** — a live digital profile that scores your skills, experience, and project strength, and assigns you a career level and role path. From there, every action you take — completing a project, unlocking a skill, finishing a roadmap milestone — earns you XP and pushes you closer to the next level.

It feels like a game. But the outcomes are real.

---

## Features

### 1. AI Career Twin

The Career Twin is the heart of CareerVerse. Upload your CV and the AI analyzes it to construct a complete professional profile — not just a list of bullet points, but a scored breakdown of who you are as a candidate right now.

Your profile includes a **Career Level** (e.g. Level 12 — AI Engineer), an **Experience Score** based on the quality and relevance of your work history, a **Project Score** reflecting the depth and technical variety of what you've built, a **Skill Score** measuring breadth and depth across relevant domains, and an **Industry Readiness Score** showing how close you are to being hireable in your target field.

The twin also surfaces your top strengths and your most critical weaknesses — not vague feedback like "improve your communication skills," but specific gaps like "you have no cloud experience" or "your projects lack any deployment work," with direct links to the roadmap that can close those gaps.

---

### 2. RPG Skill Tree

Visualized as an interactive branching tree, the skill system lets you see every skill relevant to your chosen path — and your current progress toward mastering each one.

Skill trees are organized by role path. An AI Engineer path includes branches for Python, Machine Learning, Deep Learning, MLOps, and LLM Engineering. A Full Stack path branches into React, Next.js, Node.js, and databases. Each node in the tree represents a skill. Nodes are locked until you demonstrate the prerequisite, then unlocked when you complete an associated project or mark the skill as learned.

Completing projects earns XP. Enough XP pushes you to the next career level. The tree is not decorative — it's a live map of your professional development, updated as you grow.

---

### 3. Resume Analyzer

Upload any version of your CV and the analyzer runs it through a multi-layer evaluation.

The **ATS Score** tells you what percentage of your resume would survive automated screening for your target role — based on keyword density, formatting structure, and section completeness. The **Missing Skills** section lists the technical keywords and competencies that appear in real job descriptions for your target role but are absent from your CV. The **Weak Sections** audit flags areas like a generic summary, project descriptions without metrics, or an experience section that lists responsibilities instead of achievements.

The output isn't a score and a shrug. It's an action list: add these keywords, rewrite this bullet with a number, restructure this section. You leave knowing exactly what to fix before you send the next application.

---

### 4. Learning Roadmap Generator

Tell the system your goal — "Become an AI Engineer," "Get an internship at a product company," "Break into DevOps" — and it generates a structured, month-by-month roadmap built specifically for your current profile.

Because the roadmap is generated from your Career Twin, it doesn't recommend things you already know. It starts from your actual position and builds the shortest, most direct path to your goal. Month one might be filling your cloud gap with AWS fundamentals. Month two might be a deployed ML project. Month three might be contributing to an open-source repo.

Each milestone is concrete and completable. You can mark milestones done, track your progress, and watch the estimated completion date update in real time.

---

### 5. Interview Simulator

The Interview Simulator puts you in a mock interview tailored to your actual profile and target role. The AI acts as an interviewer who has read your CV — so questions are personal, not generic.

It runs three modes: **HR questions** ("Walk me through your background," "Why this company?"), **technical questions** calibrated to your skill level and target role, and **project deep-dives** where the AI asks you to explain a specific project on your CV and then probes for depth ("What would you change now?" / "How did you handle failure X?").

After each answer, the system scores your response on confidence, completeness, and technical depth, and provides specific written feedback. Repeat until you can answer every question without hesitation.

---

### 6. Internship Predictor

Enter your current skills, GPA, and a list of your projects. The system predicts your match percentage against a database of Pakistani and regional tech companies — Arbisoft, Systems Limited, Devsinc, 10Pearls, and others.

The prediction is not a black box. It explains why you match or don't: your Python skills are strong (Arbisoft +12%), but your lack of Docker experience drops your systems-role readiness (Systems −15%). The output gives you a prioritized list of companies ranked by your current fit, plus the specific changes that would push each match score higher.

This is the feature that makes students say "wait, I'm actually close."

---

### 7. Career Simulator

The most strategic feature on the platform. The Career Simulator lets you compare two or more career paths side by side and see where each one leads.

Choose Path A: AI Engineer. Choose Path B: Full Stack Engineer. The simulator projects forward five years on each path — salary progression, typical companies, required skill milestones, and realistic timelines to senior-level roles. It factors in current market data and your existing profile.

The output is not a generic salary chart. It's a personalized strategic comparison: given who you are today, here is what each path looks like for you specifically, what each one demands, and what each one returns. It gives students the information they need to make real decisions — not just follow the crowd into whatever field sounds exciting this semester.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Industry standard, fast, recruiter-recognized |
| Styling | Tailwind CSS + Shadcn UI | Rapid, polished UI without design from scratch |
| Authentication | Clerk | Production-ready auth in under an hour |
| Backend | FastAPI (Python) | Perfect for AI/ML integration, async-native |
| Database | PostgreSQL on Neon | Relational structure for user data, free hosted tier |
| AI / LLM | Ollama (Llama 3 / Mistral) | Fully local, zero API costs, privacy-respecting |
| Embeddings | Sentence Transformers | State-of-the-art semantic matching, open source |
| Vector Store | ChromaDB | Stores career data as embeddings for RAG retrieval |
| Deployment | Vercel (frontend) + Render (backend) | Both free tiers, zero infrastructure overhead |

---

## Architecture

```
User Browser (Next.js)
        │
        ▼
   Clerk Auth Layer
        │
        ▼
   FastAPI Backend
    ┌───┴───┐
    │       │
PostgreSQL  ChromaDB
(User data) (Embeddings)
        │
        ▼
      Ollama
  (Local LLM inference)
```

The system uses a Retrieval-Augmented Generation (RAG) architecture. When a user requests a roadmap or career analysis, their profile data is embedded via Sentence Transformers and stored in ChromaDB. The AI retrieves the most relevant context vectors and passes them as structured input to the local LLM via Ollama. This allows the LLM to give responses that are grounded in the user's specific situation — not generic text completions.

---

## What Makes It Different

Most career tools are either too generic (job boards, course marketplaces) or too passive (CV templates, LinkedIn profiles). CareerVerse is active and personalized — it meets you at your current level and builds forward from there.

The gamification is not a gimmick. Career development is genuinely non-linear, and the skill tree / XP system makes that visible. Students who can see their progress stay motivated. Students who can see their gaps take action on them. The RPG metaphor works because careers actually work that way: you level up by doing the work, not by hoping.

The use of local LLMs via Ollama is also a meaningful technical differentiator. It means the platform is free to run at scale, respects user privacy (no CV data sent to third-party APIs), and demonstrates understanding of the broader AI infrastructure ecosystem — not just "call ChatGPT."

---

## Differentiators at a Glance

- Personalized, not generic — every output is derived from your actual profile
- Gamified progression that makes career planning engaging and trackable
- ATS analysis that gives specific, actionable improvements instead of vague scores
- Interview simulation grounded in your real CV and real project history
- Career path comparison built on real market data and your personal starting point
- Fully open-source AI stack — no OpenAI dependency, no per-query costs
- Deployable for free — Vercel + Render + Neon + Ollama costs nothing

---

## Portfolio / CV Description

**CareerVerse — AI-Powered Career Simulation Platform**
*Next.js · FastAPI · PostgreSQL · ChromaDB · Ollama · RAG · Sentence Transformers*

- Built a full-stack gamified career platform that analyzes CV, GitHub, and LinkedIn data to generate personalized career profiles, skill trees, ATS scores, and learning roadmaps using a RAG architecture with local LLMs.
- Implemented an AI Career Twin system that scores user profiles across experience, skills, and project quality, assigning career levels and surfacing actionable gap analysis.
- Designed a visual RPG skill tree with interactive node-based progression, XP tracking, and level-up mechanics that reflect real career development milestones.
- Built a Resume Analyzer that scores ATS compatibility, identifies missing keywords against live job description patterns, and generates specific section-level improvement recommendations.
- Engineered a Learning Roadmap Generator that produces personalized month-by-month study plans using RAG retrieval over the user's career profile embeddings.
- Architected a production-ready system on a fully free infrastructure stack: Next.js on Vercel, FastAPI on Render, PostgreSQL on Neon, and Ollama for local LLM inference.

---

## Future Roadmap

- **Interview Simulator v2** — voice-mode interview practice with real-time transcription and tone analysis
- **Peer Benchmarking** — anonymized comparison of your profile against other students in your program or target company pool
- **Job Alert Integration** — auto-match your profile against scraped job listings and notify you when your readiness hits the threshold for a specific role
- **Mentor Matching** — connect students at Level 8–10 with mentors at Level 18–20 in the same role path
- **Team Mode** — build a career profile for a team and simulate co-founding or joining a startup together

---

*CareerVerse is built for students who are serious about where they're going — and want a system as ambitious as they are.*