'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSounds } from '@/hooks/useSounds'
import { SkillTree }  from '@/components/skill-tree/skill-tree'
import { XPBar }      from '@/components/skill-tree/xp-bar'
import type { Skill, SkillStatus } from '@/lib/skills-data'
import { getLevelInfo } from '@/lib/skills-data'

interface ApiResponse {
  skills:    Skill[]
  statuses:  Record<string, SkillStatus>
  levelInfo: ReturnType<typeof getLevelInfo>
  prestige:  { ai: number; fullstack: number; devops: number }
}

// Floating XP gain or loss notification
function XPToast({ xp, onDone }: { xp: number; onDone: () => void }) {
  const isNegative = xp < 0
  return (
    <div
      className={`pointer-events-none fixed bottom-8 right-8 z-50 xp-tick text-lg font-bold ${
        isNegative ? 'text-rose-500 animate-bounce' : 'text-primary'
      }`}
      onAnimationEnd={onDone}
    >
      {isNegative ? '' : '+'}{xp} XP
    </div>
  )
}

// Custom canvas confetti celebration
function triggerConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.zIndex = '9999'
  canvas.style.pointerEvents = 'none'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ['#f59e0b', '#fbbf24', '#a855f7', '#3b82f6', '#10b981', '#ec4899']
  const particles: { x: number, y: number, vx: number, vy: number, r: number, color: string, angle: number, spin: number, gravity: number }[] = []

  for (let i = 0; i < 180; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 18,
      vy: -Math.random() * 22 - 12,
      r: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 12,
      gravity: 0.35,
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += p.gravity
      p.angle += p.spin

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.angle * Math.PI) / 180)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2)
      ctx.restore()

      if (p.y < canvas.height && p.x > 0 && p.x < canvas.width) {
        alive = true
      }
    }

    if (alive) {
      requestAnimationFrame(animate)
    } else {
      document.body.removeChild(canvas)
    }
  }

  animate()
}

export default function SkillTreePage() {
  const [data,        setData]        = useState<ApiResponse | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [xpToast,     setXpToast]     = useState<number | null>(null)
  const [totalXP,     setTotalXP]     = useState(0)
  const [achievement, setAchievement] = useState<{ type: 'skill' | 'ascension'; label: string; icon: string; xp: number; subLabel?: string } | null>(null)
  const { play } = useSounds()

  // Fetch initial state
  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d: ApiResponse) => {
        setData(d)
        setTotalXP(d.levelInfo.totalXP)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load skill tree.')
        setLoading(false)
      })
  }, [])

  // Helper to determine if a path category is eligible for ascension (Tier 2 or Tier 3)
  const getAscensionAvailablePaths = useCallback(() => {
    if (!data) return []
    const categories: ('ai' | 'fullstack' | 'devops')[] = ['ai', 'fullstack', 'devops']
    const results: { category: 'ai' | 'fullstack' | 'devops'; targetTier: number }[] = []

    for (const cat of categories) {
      const prestige = data.prestige?.[cat] ?? 0
      if (prestige >= 2) continue // Already reached final tier (Tier 3)

      const nextPrestige = prestige + 1
      const requiredSkills = data.skills.filter(
        (s) =>
          s.category === cat &&
          (nextPrestige === 1 ? s.tier !== 2 && s.tier !== 3 : s.tier === 2)
      )

      const allUnlocked = requiredSkills.every((s) => data.statuses[s.id] === 'unlocked')
      if (allUnlocked) {
        results.push({ category: cat, targetTier: nextPrestige })
      }
    }
    return results
  }, [data])

  // Handle path ascension trigger
  const handleAscend = useCallback(async (category: 'ai' | 'fullstack' | 'devops') => {
    if (!data) return
    try {
      const res = await fetch('/api/skills/prestige', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      })
      const json = await res.json()

      if (!res.ok) {
        play('error')
        console.error('Ascension failed:', json.error)
        alert(json.error || 'Failed to ascend path.')
        return
      }

      // Celebrate
      triggerConfetti()

      // Update state
      setTotalXP(json.totalXP)
      setXpToast(json.xpGained)

      const updatedPrestige = json.prestigeLevels
      const { computeStatuses, SKILLS } = await import('@/lib/skills-data')
      
      const unlockedIds = new Set(
        Object.entries(data.statuses)
          .filter(([, s]) => s === 'unlocked')
          .map(([id]) => id)
      )
      const recomputed = computeStatuses(SKILLS, unlockedIds, updatedPrestige)

      setData((prev) => prev ? {
        ...prev,
        prestige: updatedPrestige,
        statuses: recomputed
      } : prev)

      // Show Path Ascension achievement popup
      const pathName = category === 'ai' ? 'AI Engineer' : category === 'fullstack' ? 'Full Stack' : 'DevOps'
      const targetPrestige = updatedPrestige[category]
      const tierName = targetPrestige === 2 ? 'Tier 3 (Legendary)' : 'Tier 2 (Expert)'
      
      setAchievement({
        type: 'ascension',
        label: `${pathName} Ascended`,
        icon: targetPrestige === 2 ? '👑' : '🌟',
        xp: json.xpGained,
        subLabel: `Promoted to ${tierName}!`
      })
      setTimeout(() => {
        setAchievement(null)
      }, 6000)

    } catch (err) {
      play('error')
      console.error(err)
      alert('Error during ascension.')
    }
  }, [data, play])

  // Handle toggling (mark / unmark)
  const handleUnlock = useCallback(
    async (skillId: string) => {
      if (!data) return

      const isCurrentlyUnlocked = data.statuses[skillId] === 'unlocked'
      let nextUnlockedIds: Set<string>

      // Optimistic computation
      if (isCurrentlyUnlocked) {
        // Find descendants in unlocked tree that require this skill and lock them as well
        const toCheck = [skillId]
        const descendants = new Set<string>()
        const unlockedList = Object.entries(data.statuses)
          .filter(([, s]) => s === 'unlocked')
          .map(([id]) => id)

        while (toCheck.length > 0) {
          const current = toCheck.shift()!
          for (const s of data.skills) {
            if (unlockedList.includes(s.id) && s.requires.includes(current) && !descendants.has(s.id)) {
              descendants.add(s.id)
              toCheck.push(s.id)
            }
          }
        }
        const toRemove = [skillId, ...Array.from(descendants)]
        nextUnlockedIds = new Set(unlockedList.filter((id) => !toRemove.includes(id)))
      } else {
        const unlockedList = Object.entries(data.statuses)
          .filter(([, s]) => s === 'unlocked')
          .map(([id]) => id)
        nextUnlockedIds = new Set([...unlockedList, skillId])
      }

      let tierCompleted = false
      if (!isCurrentlyUnlocked) {
        const skillObj = data.skills.find((s) => s.id === skillId)
        if (skillObj) {
          const cat = skillObj.category
          const prestige = data.prestige?.[cat] ?? 0
          const nextPrestige = prestige + 1
          const requiredSkills = data.skills.filter(
            (s) => s.category === cat && (nextPrestige === 1 ? s.tier !== 2 && s.tier !== 3 : s.tier === 2)
          )
          tierCompleted = requiredSkills.every((s) => nextUnlockedIds.has(s.id))
        }
      }

      // Recompute all statuses optimistically
      const { computeStatuses, SKILLS } = await import('@/lib/skills-data')
      const recomputed = computeStatuses(SKILLS, nextUnlockedIds, data.prestige)
      setData((prev) => prev ? { ...prev, statuses: recomputed } : prev)

      // API call
      const res  = await fetch('/api/skills/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId }),
      })
      const json = await res.json()

      if (!res.ok) {
        play('error')
        // Revert optimistic update on failure
        setData((prev) => prev ? { ...prev, statuses: data.statuses } : prev)
        console.error('Toggle failed:', json.error)
        return
      }

      // Update XP and show toast
      setTotalXP(json.totalXP)
      setXpToast(json.xpGained)

      if (json.action === 'unlocked') {
        if (tierCompleted) {
          play('coin')
        } else {
          play('confirm')
        }
        const skillObj = data.skills.find((s) => s.id === skillId)
        if (skillObj) {
          setAchievement({
            type: 'skill',
            label: skillObj.label,
            icon: skillObj.icon,
            xp: skillObj.xpReward
          })
          // Auto-clear toast achievement after 4 seconds
          setTimeout(() => {
            setAchievement(null)
          }, 4000)
        }
      }
    },
    [data, play]
  )

  const getPrestigeLabel = (prestigeVal: number) => {
    if (prestigeVal === 2) return <span className="text-purple-400 font-bold ml-1">★ Tier 3 (Legendary)</span>
    if (prestigeVal === 1) return <span className="text-amber-400 font-bold ml-1">★ Tier 2 (Expert)</span>
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading skill tree…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-destructive">{error || 'Something went wrong.'}</p>
      </div>
    )
  }

  const unlockedCount = Object.values(data.statuses).filter((s) => s === 'unlocked').length
  const totalCount    = data.skills.length
  const ascensionAvailable = getAscensionAvailablePaths()

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div>
          <h1 className="text-xl font-bold">Skill Tree</h1>
          <p className="text-sm text-muted-foreground">
            {unlockedCount} / {totalCount} skills unlocked
          </p>
        </div>
        <XPBar totalXP={totalXP} />
      </div>

      {/* Ascension Banners */}
      {ascensionAvailable.map(({ category: path, targetTier }) => {
        const pathName = path === 'ai' ? 'AI Engineer' : path === 'fullstack' ? 'Full Stack' : 'DevOps'
        
        let bannerColor = ''
        let buttonStyle = ''
        let icon = '🌟'
        let description = ''

        if (targetTier === 3) {
          icon = '👑'
          bannerColor = 'from-fuchsia-950/40 via-purple-900/20 to-transparent border-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
          buttonStyle = 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
          description = 'Mastered all Tier 2 skills. Ascend now to unlock the Legendary Final Tier (+1000 XP).'
        } else {
          bannerColor = path === 'ai' 
            ? 'from-purple-950/40 via-purple-900/20 to-transparent border-purple-500'
            : path === 'fullstack'
            ? 'from-blue-950/40 via-blue-900/20 to-transparent border-blue-500'
            : 'from-emerald-950/40 via-emerald-900/20 to-transparent border-emerald-500'
          buttonStyle = 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
          description = 'Mastered all Tier 1 skills. Ascend now to earn +500 XP and unlock Tier 2 advanced nodes.'
        }

        return (
          <div 
            key={path}
            className={`mx-6 mt-4 p-4 rounded-xl border bg-gradient-to-r ${bannerColor} flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-500`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">{icon}</span>
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">
                  {pathName} Ascension to Tier {targetTier} Available!
                </h3>
                <p className="text-xs text-gray-400">
                  {description}
                </p>
              </div>
            </div>
            <button
              onClick={() => { play('snap'); handleAscend(path); }}
              className={`px-4 py-2 rounded-lg font-extrabold text-xs active:scale-95 transition-all cursor-pointer ${buttonStyle}`}
            >
              Ascend to Tier {targetTier}
            </button>
          </div>
        )
      })}

      {/* Path labels */}
      <div className="flex items-center gap-6 px-6 py-2 border-b shrink-0 text-xs font-medium mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          AI Engineer {getPrestigeLabel(data.prestige?.ai)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Full Stack {getPrestigeLabel(data.prestige?.fullstack)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          DevOps {getPrestigeLabel(data.prestige?.devops)}
        </span>
        <span className="ml-auto text-muted-foreground">
          Scroll or pinch to zoom · Click nodes to toggle (mark/unmark)
        </span>
      </div>

      {/* React Flow canvas */}
      <div className="flex-1 min-h-0">
        <SkillTree
          key={`${unlockedCount}-${JSON.stringify(data.prestige)}`} // Force remount on unlock or prestige change to reload nodes/edges
          skills={data.skills}
          statuses={data.statuses}
          onUnlock={handleUnlock}
        />
      </div>

      {/* Floating XP notification */}
      {xpToast !== null && (
        <XPToast xp={xpToast} onDone={() => setXpToast(null)} />
      )}

      {/* Achievement / Ascension Popup */}
      {achievement && (
        achievement.type === 'ascension' ? (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-2 border-yellow-400 rounded-2xl px-6 py-4 shadow-[0_0_45px_rgba(234,179,8,0.45)] animate-in zoom-in-95 fade-in duration-500 max-w-md w-[90%] md:w-auto">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(251,191,36,0.6)] shrink-0 animate-bounce animate-duration-1000">
              {achievement.icon}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-black tracking-widest text-yellow-400 uppercase animate-pulse">
                Path Ascension Unlocked
              </p>
              <h4 className="text-base font-black text-white truncate mt-0.5">
                {achievement.label}!
              </h4>
              <p className="text-xs text-purple-300 font-bold mt-0.5">
                {achievement.subLabel}
              </p>
              <p className="text-[11px] text-gray-400 font-semibold mt-1">
                +{achievement.xp} XP rewarded
              </p>
            </div>
            <button 
              onClick={() => { play('snap'); setAchievement(null); }}
              className="text-gray-400 hover:text-white text-sm p-1 cursor-pointer shrink-0 ml-2"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/90 border border-amber-500/50 rounded-2xl px-6 py-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-in slide-in-from-top-12 fade-in duration-500 max-w-sm w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-2xl shadow-inner shrink-0 animate-bounce">
              {achievement.icon}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                Achievement Unlocked
              </p>
              <h4 className="text-sm font-black text-white truncate mt-0.5">
                Mastered {achievement.label}!
              </h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                +{achievement.xp} XP rewarded
              </p>
            </div>
            <button 
              onClick={() => { play('snap'); setAchievement(null); }}
              className="text-gray-400 hover:text-white text-xs p-1 cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        )
      )}
    </div>
  )
}
