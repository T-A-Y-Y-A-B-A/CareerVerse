import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { syncUser } from "@/lib/user-sync";
import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { XPBar } from '@/components/skill-tree/xp-bar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { userId } = await auth()
  const [dbUser] = userId
    ? await db.select({ xp: users.xp }).from(users).where(eq(users.clerkId, userId))
    : [{ xp: 0 }]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] relative z-20">
          <SidebarTrigger />
          <div className="w-full flex-1 flex justify-between items-center">
            <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
            <XPBar totalXP={dbUser?.xp ?? 0} />
          </div>
        </header>
        <main 
          className="flex-1 overflow-auto bg-cover bg-center bg-fixed relative animate-in fade-in duration-1000"
        >
          {/* Background images for light/dark modes */}
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed hidden dark:block" style={{ backgroundImage: "url('/homepage.png?v=2')" }} />
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed dark:hidden" style={{ backgroundImage: "url('/homepage_light.png?v=2')" }} />
          
          {/* Overlays for readability */}
          <div className="absolute inset-0 bg-[#0a0a14]/85 z-0 pointer-events-none hidden dark:block" />
          <div className="absolute inset-0 bg-white/85 z-0 pointer-events-none dark:hidden" />
          <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
