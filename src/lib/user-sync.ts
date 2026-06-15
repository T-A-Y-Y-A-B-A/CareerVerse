import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function syncUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  // Check if user exists in our database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (existingUser) {
    return existingUser;
  }

  // If not, create them
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

  if (!primaryEmail) {
    return null;
  }

  const [newUser] = await db.insert(users).values({
    clerkId: userId,
    email: primaryEmail,
    firstName: user.firstName,
    lastName: user.lastName,
    careerLevel: 1,
    xp: 0,
  }).returning();

  return newUser;
}
