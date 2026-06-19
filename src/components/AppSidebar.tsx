"use client";

import { useSounds } from "@/hooks/useSounds";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Network,
  FileText,
  Map,
  MessageSquare,
  Building2,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Image from "next/image";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Career Twin", url: "/dashboard/career-twin", icon: UserRound },
  { title: "Skill Tree", url: "/dashboard/skill-tree", icon: Network },
  { title: "Resume Analyzer", url: "/dashboard/resume", icon: FileText },
  { title: "Learning Roadmap", url: "/dashboard/roadmap", icon: Map },
  { title: "Interview Simulator", url: "/dashboard/interview", icon: MessageSquare },
  { title: "Internship Predictor", url: "/dashboard/internship-predictor", icon: Building2 },
  { title: "Career Simulator", url: "/dashboard/simulator", icon: TrendingUp },
];

import logoImg from '../../public/abc.png';

export function AppSidebar() {
  const pathname = usePathname();
  const { play } = useSounds();

  return (
    <Sidebar collapsible="icon" className="bg-sidebar/95 backdrop-blur-md border-r border-border">
      <SidebarHeader className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex w-full items-center gap-4">
          <Image
            src={logoImg}
            alt="CareerVerse Logo"
            width={52}
            height={52}
            className="rounded-md object-contain"
          />
          <span className="group-data-[collapsible=icon]:hidden font-bold text-[18px] text-white">
            CareerVerse
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => play('snap')}
                      render={<Link href={item.url} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 flex flex-row items-center gap-3">
        <UserButton />
        <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
          <span className="text-sm font-medium leading-none">Your Profile</span>
          <span className="text-xs text-muted-foreground truncate">Manage account</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
