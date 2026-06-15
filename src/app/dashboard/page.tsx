import { syncUser } from "@/lib/user-sync";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  UserRound, Network, FileText, Map, MessageSquare, Building2, TrendingUp,
  CheckCircle, BellRing, Sparkles, Target, Zap, Shield, Play
} from "lucide-react";
import { getLevelInfo } from "@/lib/skills-data";

export default async function DashboardPage() {
  const user = await syncUser();
  if (!user) {
    redirect('/sign-in');
  }

  const xp = user.xp ?? 0;
  const { level: careerLevel, currentXP: currentXpProgress, xpForNext: targetXp } = getLevelInfo(xp);

  // Level info
  let levelDesc = 'Junior Engineer';
  if (careerLevel >= 28) levelDesc = 'CTO';
  else if (careerLevel >= 21) levelDesc = 'Staff Engineer';
  else if (careerLevel >= 14) levelDesc = 'Senior Engineer';
  else if (careerLevel >= 7) levelDesc = 'Engineer';

  const progressPercent = Math.min(100, Math.max(0, (currentXpProgress / targetXp) * 100));
  const xpToNextLevel = targetXp - currentXpProgress;

  const features = [
    { title: "Career Twin", desc: "AI-powered career profile & skills assessment.", url: "/dashboard/career-twin", icon: UserRound, color: "text-purple-400" },
    { title: "Skill Tree", desc: "Unlock and track your technical competencies.", url: "/dashboard/skill-tree", icon: Network, color: "text-blue-400" },
    { title: "Resume Analyzer", desc: "Get an ATS score and actionable feedback.", url: "/dashboard/resume", icon: FileText, color: "text-emerald-400" },
    { title: "Learning Roadmap", desc: "Step-by-step guides tailored for you.", url: "/dashboard/roadmap", icon: Map, color: "text-orange-400" },
    { title: "Interview Simulator", desc: "Practice mock interviews with AI.", url: "/dashboard/interview", icon: MessageSquare, color: "text-pink-400" },
    { title: "Internship Predictor", desc: "Estimate your chances for top roles.", url: "/dashboard/internships", icon: Building2, color: "text-indigo-400" },
    { title: "Career Simulator", desc: "Simulate different career outcomes.", url: "/dashboard/simulator", icon: TrendingUp, color: "text-rose-400" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      
      {/* Top Header & XP Widget */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            Welcome back, {user.firstName || 'Adventurer'} <Sparkles className="w-6 h-6 text-purple-400" />
          </h1>
          <p className="text-gray-400 mt-1 font-medium">Your career dashboard and progression hub.</p>
        </div>

        {/* Animated XP Progress Widget */}
        <div className="w-full lg:w-96 bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-3 group hover:border-purple-500/50 transition-all duration-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1">Current Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">Lvl {careerLevel}</span>
                <span className="text-sm text-gray-400 font-medium">{levelDesc}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">{currentXpProgress}</span>
              <span className="text-sm text-gray-500 font-medium"> / {targetXp} XP</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500 animate-progress"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 font-medium">
            <span className="text-pink-400 font-bold">{xpToNextLevel} XP</span> until Level {careerLevel + 1}
          </p>
        </div>
      </div>

      {/* Continue Your Journey */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-emerald-400" /> Continue Your Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-black/50 transition-colors">
            <p className="text-sm text-gray-400 font-medium">Resume Analysis</p>
            <p className="text-xl font-bold text-white mt-1">80% Complete</p>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-black/50 transition-colors">
            <p className="text-sm text-gray-400 font-medium">Skill Tree</p>
            <p className="text-xl font-bold text-white mt-1">3 Nodes Unlocked</p>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-black/50 transition-colors">
            <p className="text-sm text-gray-400 font-medium">Interview Simulator</p>
            <p className="text-xl font-bold text-white mt-1">Last Score 82%</p>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-black/50 transition-colors">
            <p className="text-sm text-gray-400 font-medium">Learning Roadmap</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">Next Topic Available</p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Grid */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" /> Core Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link href={f.url} key={i}>
              <div className="group relative bg-black/40 border border-white/10 rounded-2xl p-5 hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <f.icon className="w-20 h-20" />
                </div>
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RPG Elements: Daily Quests & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Quests */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-orange-400 to-pink-500 h-full"></div>
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" /> Daily Quests
          </h2>
          <div className="space-y-3">
            {[
              { text: "Upload your latest CV", xp: "+50 XP", done: false },
              { text: "Complete one interview simulation", xp: "+40 XP", done: false },
              { text: "Analyze your resume", xp: "+30 XP", done: true },
              { text: "Learn one roadmap topic", xp: "+20 XP", done: false },
            ].map((q, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${q.done ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-white/5 border-white/5'} transition-colors`}>
                <div className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${q.done ? 'text-emerald-500' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${q.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{q.text}</span>
                </div>
                <span className={`text-xs font-bold ${q.done ? 'text-emerald-400 bg-emerald-500/10' : 'text-orange-400 bg-orange-500/10'} px-2.5 py-1 rounded-md`}>
                  {q.xp}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-sm text-gray-400 font-medium">Daily Reward Pool:</span>
            <span className="text-sm font-bold text-white">140 XP</span>
          </div>
        </div>

        {/* Reminders to Gain XP */}
        <div className="bg-gradient-to-br from-[#1a1025]/80 to-black/60 border border-purple-500/30 rounded-2xl p-6 relative animate-pulse-glow shadow-xl shadow-purple-900/20">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-purple-400" /> Reminders to Gain XP
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start bg-black/40 p-4 rounded-xl border border-purple-500/10 hover:bg-black/60 transition-colors">
              <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Level Up Imminent</p>
                <p className="text-xs text-gray-300 mt-1.5 font-medium leading-relaxed">
                  You are <span className="text-pink-400 font-bold">{xpToNextLevel} XP</span> away from Level {careerLevel + 1}. Complete 2 more quests today to rank up!
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start bg-black/40 p-4 rounded-xl border border-purple-500/10 hover:bg-black/60 transition-colors">
              <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Resume Check</p>
                <p className="text-xs text-gray-300 mt-1.5 font-medium leading-relaxed">
                  Your resume hasn't been analyzed this week. Upload a new version for +50 XP.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start bg-black/40 p-4 rounded-xl border border-purple-500/10 hover:bg-black/60 transition-colors">
              <Network className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Skill Tree Bonus</p>
                <p className="text-xs text-gray-300 mt-1.5 font-medium leading-relaxed">
                  Unlock your next skill node to gain a temporary 20% XP boost!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
