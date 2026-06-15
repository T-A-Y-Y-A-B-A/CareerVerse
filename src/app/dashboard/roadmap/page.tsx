import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, careerProfiles } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { CareerLadder } from '@/components/roadmap/career-ladder'
import { getLevelInfo } from '@/lib/skills-data'

export default async function RoadmapPage() {
  const { userId } = await auth()

  let userLevel = 1
  let totalXP = 0

  if (userId) {
    const [user] = await db
      .select({ xp: users.xp })
      .from(users)
      .where(eq(users.clerkId, userId))

    if (user) {
      totalXP = user.xp ?? 0
      userLevel = getLevelInfo(totalXP).level
    }
  }

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[600px] rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] bg-[#030308]/90 backdrop-blur-xl">
      {/* Floating header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8 pointer-events-none">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white via-purple-100 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              Career Roadmap
            </h1>
            <p className="text-purple-200/60 text-sm md:text-base mt-2 max-w-md font-medium">
              Your path to the top. Level up your skills and experience to unlock the next stage.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap takes up the full area, padded by the header */}
      <div className="w-full h-full pt-24 md:pt-28">
        <CareerLadder userLevel={userLevel} totalXP={totalXP} />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#030308] to-transparent pointer-events-none z-10" />
    </div>
  )
}
