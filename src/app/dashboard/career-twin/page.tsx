'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { CvUploader } from '@/components/career-twin/cv-uploader'
import { CareerProfile } from '@/components/career-twin/career-profile'

function normalizeProfile(p: any) {
  if (!p) return null;
  const parseField = (f: any) => {
    if (typeof f === 'string') {
      try {
        return JSON.parse(f)
      } catch {
        return []
      }
    }
    return Array.isArray(f) ? f : []
  }

  return {
    careerLevel: p.careerLevel ?? p.career_level ?? 1,
    rolePath: p.rolePath ?? p.role_path ?? '',
    skillScore: p.skillScore ?? p.skill_score ?? 0,
    experienceScore: p.experienceScore ?? p.experience_score ?? 0,
    projectScore: p.projectScore ?? p.project_score ?? 0,
    industryReadiness: p.industryReadiness ?? p.industry_readiness ?? 0,
    xpGained: p.xpGained ?? p.xp_gained ?? 0,
    summary: p.summary ?? '',
    topSkills: parseField(p.topSkills ?? p.top_skills),
    strengths: parseField(p.strengths),
    weaknesses: parseField(p.weaknesses),
    recommendations: parseField(p.recommendations),
  }
}

export default function CareerTwinPage() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch existing profile on mount
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`/api/career-twin`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.profile === null || data.error) {
          setProfile(null)
        } else {
          setProfile(normalizeProfile(data.profile))
        }
        setLoading(false)
      })
      .catch((e) => {
        console.error("Error fetching profile:", e);
        setLoading(false)
      })
  }, [user, isLoaded])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-60px)] w-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Full-screen Background Image & Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/careertwin.png"
          alt="Career Twin Background"
          fill
          className="object-cover scale-105 hidden dark:block"
          priority
        />
        <Image
          src="/careertwin_light.png"
          alt="Career Twin Background"
          fill
          className="object-cover scale-105 dark:hidden"
          priority
        />
        {/* Soft dark overlay for readability */}
        <div className="absolute inset-0 bg-background/60 z-10 hidden dark:block" />
        <div className="absolute inset-0 bg-white/60 z-10 dark:hidden" />
        
        {/* Animated Particles / Rings Effect using CSS */}
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
      </div>

      <div className="relative z-30 w-full max-w-4xl mx-auto space-y-10">
        
        {profile ? (
          <div className="space-y-6 animate-in fade-in duration-500 bg-background backdrop-blur-md p-6 md:p-8 rounded-3xl border border-border shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight drop-shadow-lg">
                Your Career Twin
              </h1>
              <p className="text-muted-foreground mt-2 font-medium drop-shadow-sm text-lg">
                Interactive professional profile and AI recommendations.
              </p>
            </div>
            <CareerProfile
              profile={profile}
              onReUpload={() => setProfile(null)}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Heading */}
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight drop-shadow-2xl">
                Career Twin
              </h1>
              <p className="text-primary text-lg md:text-xl mt-4 font-semibold drop-shadow-md">
                AI Career Twin
              </p>
              <p className="text-muted-foreground mt-3 text-base md:text-lg font-medium drop-shadow-md leading-relaxed">
                Upload your CV to generate an interactive profile, calculate your industry readiness, and unlock your personalized roadmap.
              </p>
            </div>

            {/* Glass Upload Box */}
            <div className="w-full max-w-xl mb-12">
              <CvUploader onProfileReceived={(data) => setProfile(normalizeProfile(data))} />
            </div>

            {/* Benefits Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                { title: "Career Profile", desc: "Instantly digitize your professional journey." },
                { title: "Skill Analysis", desc: "Discover gaps in your technical stack." },
                { title: "Strength Detection", desc: "Identify your strongest selling points." },
                { title: "Career Path", desc: "Predict the best roles for your background." }
              ].map((benefit, i) => (
                <div key={i} className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-5 hover:bg-foreground/5 transition-colors group">
                  <h3 className="text-foreground font-bold text-base mb-1 group-hover:text-purple-400 transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
