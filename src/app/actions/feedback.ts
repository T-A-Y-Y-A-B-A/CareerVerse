'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, userFeedback } from '@/lib/schema'
import { eq, desc, and, isNotNull, gte } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function submitFeedback(rating: number, comment: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'You must be logged in to submit feedback.' }
    }

    // Get the internal database user ID
    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      columns: { id: true },
    })

    if (!dbUser) {
      return { success: false, error: 'User profile not found in database.' }
    }

    // Insert feedback
    await db.insert(userFeedback).values({
      userId: dbUser.id,
      rating,
      comment,
    })

    revalidatePath('/') // Revalidate if needed, though mostly a fire-and-forget action
    return { success: true }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Failed to submit feedback. Please try again.' }
  }
}

export async function getPublicFeedback() {
  try {
    const records = await db
      .select({
        id: userFeedback.id,
        rating: userFeedback.rating,
        comment: userFeedback.comment,
        createdAt: userFeedback.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        careerLevel: users.careerLevel,
      })
      .from(userFeedback)
      .leftJoin(users, eq(userFeedback.userId, users.id))
      .where(and(gte(userFeedback.rating, 4), isNotNull(userFeedback.comment)))
      .orderBy(desc(userFeedback.createdAt))
      .limit(9)

    return records
  } catch (error) {
    console.error('Error fetching public feedback:', error)
    return []
  }
}

export async function getAllFeedbackAdmin() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const records = await db
      .select({
        id: userFeedback.id,
        rating: userFeedback.rating,
        comment: userFeedback.comment,
        createdAt: userFeedback.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        careerLevel: users.careerLevel,
      })
      .from(userFeedback)
      .leftJoin(users, eq(userFeedback.userId, users.id))
      .orderBy(desc(userFeedback.createdAt))

    return records
  } catch (error) {
    console.error('Error fetching admin feedback:', error)
    return []
  }
}
