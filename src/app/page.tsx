"use client"

import Link from "next/link";
import { useSounds } from "@/hooks/useSounds";
import Image from "next/image";
import logoImg from "../../public/abc.png";
import logoLightImg from "../../public/abc_light.png";
import { Button } from "@/components/ui/button";
import {
  Target,
  Network,
  ChevronRight,
  Sword,
  BookOpen,
  Map,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Terminal,
  Cpu,
  Globe,
  Sparkles,
  Gamepad2,
  Zap
} from "lucide-react";
import { WallOfLove } from "@/components/wall-of-love";

export default function Home() {
  const { play } = useSounds();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      {/* BACKGROUND IMAGE from User Request */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/homepage.png"
          alt="CareerVerse Background"
          fill
          className="object-cover object-top opacity-50 hidden dark:block"
          priority
          unoptimized
        />
        <Image
          src="/homepage_light.png"
          alt="CareerVerse Background Light"
          fill
          className="object-cover object-top opacity-50 dark:hidden"
          priority
          unoptimized
        />
        {/* Gradient overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      </div>

      {/* Header */}
      <header className="flex h-20 items-center justify-between px-6 lg:px-12 z-20 border-b border-border bg-background/40 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
          <Image src={logoLightImg} alt="CareerVerse Logo" width={40} height={40} className="rounded-md object-contain w-10 h-auto dark:hidden" />
          <Image src={logoImg} alt="CareerVerse Logo" width={40} height={40} className="rounded-md object-contain w-10 h-auto hidden dark:block" />
          CareerVerse
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/sign-in" onClick={() => play('snap')}>
            <Button variant="ghost" className="text-foreground hover:text-foreground/80 hover:bg-foreground/10">Log in</Button>
          </Link>
          <Link href="/sign-up" onClick={() => play('snap')}>
            <Button className="bg-purple-600 text-foreground hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              Start Your Journey
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col z-10 relative">
        {/* Section 1: Hero Section */}
        <section className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 py-20 gap-12 max-w-7xl mx-auto w-full">
          {/* Left Side */}
          <div className="flex-1 flex flex-col items-start text-left">

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 leading-tight">
              Your Career is Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Ultimate Character.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              Level up your skills, unlock new career paths, and let your AI Career Twin guide every next move.
            </p>

            <ul className="space-y-3 mb-10 text-muted-foreground animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <li className="flex items-center gap-3 font-medium text-foreground"><Zap className="text-purple-400 h-5 w-5" /> Upload your CV and instantly generate:</li>
              <li className="flex items-center gap-3 pl-8"><ChevronRight className="text-pink-500 h-4 w-4" /> Your AI Career Twin</li>
              <li className="flex items-center gap-3 pl-8"><ChevronRight className="text-pink-500 h-4 w-4" /> Personalized Skill Tree</li>
              <li className="flex items-center gap-3 pl-8"><ChevronRight className="text-pink-500 h-4 w-4" /> Career XP System</li>
              <li className="flex items-center gap-3 pl-8"><ChevronRight className="text-pink-500 h-4 w-4" /> Next Milestone Roadmap</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
              <Link href="/sign-up" onClick={() => play('snap')}>
                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-purple-600 hover:bg-purple-500 text-foreground shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] transition-all rounded-xl border border-purple-400/50">
                  <Sword className="mr-2 h-5 w-5" /> Create My Character
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border bg-foreground/5 text-foreground hover:bg-foreground/10 backdrop-blur-md rounded-xl" onClick={() => play('snap')}>
                <Play className="mr-2 h-5 w-5 fill-foreground dark:fill-white" /> Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Side - Main Showpiece */}
          <div className="flex-1 w-full max-w-md animate-in fade-in zoom-in duration-1000 delay-500 hidden md:block">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-8 bg-background backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col gap-6 transform transition-all duration-500 hover:scale-[1.02]">

                {/* Header */}
                <div className="text-center pb-4 border-b border-border">
                  <div className="text-purple-400 font-mono text-sm mb-1 tracking-widest">LEVEL 12</div>
                  <h3 className="text-2xl font-bold text-foreground tracking-wide">PRODUCT ENGINEER</h3>
                </div>

                {/* XP Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">XP Progress</span>
                    <span className="text-purple-400 font-bold">82%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 w-[82%] relative">
                      <div className="absolute inset-0 bg-foreground/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <div className="text-sm text-muted-foreground font-medium mb-3">Strengths</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">+ Python</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">+ ML</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">+ Leadership</span>
                  </div>
                </div>

                {/* Current Quest & Next Unlock */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current Quest</div>
                    <div className="text-sm text-foreground font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-pink-400" /> System Design
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Next Unlock</div>
                    <div className="text-sm text-purple-300 font-bold flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Senior AI Eng.
                    </div>
                  </div>
                </div>

                {/* Reward */}
                <div className="mt-2 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-purple-300/70 uppercase tracking-widest mb-1">Reward</div>
                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    +18% Salary Potential
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Transformation */}
        <section className="py-24 px-6 relative border-t border-border bg-background backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-16">The Transformation</h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
              {/* Before */}
              <div className="flex-1 w-full max-w-sm p-8 bg-card border border-border rounded-2xl text-left grayscale opacity-70">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-muted rounded-lg"><BookOpen className="h-6 w-6 text-muted-foreground" /></div>
                  <h3 className="text-xl font-bold text-muted-foreground">Traditional Resume</h3>
                </div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-gray-500" /> Random skills listed</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-gray-500" /> No clear direction</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-gray-500" /> Blind job hopping</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-gray-500" /> Guessing the next step</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex flex-col items-center justify-center text-purple-500 animate-pulse">
                <ArrowRight className="h-12 w-12" />
              </div>
              <div className="md:hidden flex items-center justify-center text-purple-500 animate-pulse my-4">
                <ArrowRight className="h-10 w-10 rotate-90" />
              </div>

              {/* After */}
              <div className="flex-1 w-full max-w-sm p-8 bg-purple-900/20 border border-purple-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.15)]">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Gamepad2 className="w-32 h-32 text-purple-500" /></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.3)]"><BrainCircuit className="h-6 w-6 text-purple-400" /></div>
                  <h3 className="text-xl font-bold text-foreground">Career Character</h3>
                </div>
                <ul className="space-y-4 text-muted-foreground relative z-10">
                  <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]" /> AI Career Twin</li>
                  <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_5px_#ec4899]" /> Dynamic Skill Tree</li>
                  <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]" /> XP Progress Tracking</li>
                  <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_5px_#ec4899]" /> Interactive Career Quests</li>
                  <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]" /> Milestone Unlocks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Skill Tree */}
        <section className="py-24 px-6 relative border-t border-border bg-gradient-to-b from-background/40 to-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Interactive Skill Tree</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Visualize your future. Map out exactly what skills you need to reach your ultimate career goals.</p>
            </div>

            {/* Tree Visualization Simulation */}
            <div className="relative py-12 flex flex-col items-center max-w-3xl mx-auto">
              {/* CTO Node */}
              <div className="group relative z-10">
                <div className="w-20 h-20 bg-background border-2 border-border rounded-full flex items-center justify-center cursor-pointer transition-all hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                  <Globe className="h-8 w-8 text-muted-foreground group-hover:text-pink-400 transition-colors" />
                </div>
                <div className="absolute top-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-muted-foreground group-hover:text-pink-400 font-bold transition-colors">CTO</div>

                {/* Hover Card */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 p-4 bg-background border border-pink-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-4 group-hover:translate-y-0 z-20 shadow-2xl backdrop-blur-xl">
                  <div className="text-pink-400 font-bold mb-1">Chief Technology Officer</div>
                  <div className="text-green-400 text-sm mb-3">Est. $250k - $400k</div>
                  <div className="text-xs text-muted-foreground mb-2 uppercase">Required Mastery</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-1 bg-foreground/10 rounded">Org Leadership</span>
                    <span className="text-[10px] px-2 py-1 bg-foreground/10 rounded">Tech Strategy</span>
                    <span className="text-[10px] px-2 py-1 bg-foreground/10 rounded">Fundraising</span>
                  </div>
                </div>
              </div>

              {/* Line */}
              <div className="w-1 h-16 bg-gradient-to-b from-gray-800 to-purple-900/50 my-2"></div>

              {/* Staff Engineer Node */}
              <div className="group relative z-10 ml-32">
                <div className="w-16 h-16 bg-background border-2 border-border rounded-full flex items-center justify-center cursor-pointer transition-all hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  <Cpu className="h-6 w-6 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-muted-foreground group-hover:text-purple-400 font-bold transition-colors">Staff Engineer</div>

                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 w-64 p-4 bg-background border border-purple-500/50 rounded-xl opacity-0 hidden md:block group-hover:opacity-100 transition-all pointer-events-none transform -translate-x-4 group-hover:translate-x-0 z-20 shadow-2xl backdrop-blur-xl">
                  <div className="text-purple-400 font-bold mb-1">Staff Engineer</div>
                  <div className="text-green-400 text-sm mb-3">Est. $180k - $250k</div>
                  <div className="text-xs text-muted-foreground mb-2 uppercase">Required Mastery</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-1 bg-foreground/10 rounded">System Arch</span>
                    <span className="text-[10px] px-2 py-1 bg-foreground/10 rounded">Mentorship</span>
                    <span className="text-[10px] px-2 py-1 bg-foreground/10 rounded">Cross-team impact</span>
                  </div>
                </div>
              </div>

              {/* Line */}
              <div className="w-1 h-16 bg-gradient-to-b from-gray-800 to-blue-900/50 my-2 -ml-16 transform -rotate-12"></div>

              {/* Senior Engineer Node */}
              <div className="group relative z-10 -ml-16">
                <div className="w-16 h-16 bg-background border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                  <Terminal className="h-6 w-6 text-blue-400" />
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-blue-400 font-bold">Senior Engineer</div>

                <div className="absolute top-1/2 -translate-y-1/2 right-full mr-4 w-64 p-4 bg-background border border-blue-500/50 rounded-xl opacity-0 hidden md:block group-hover:opacity-100 transition-all pointer-events-none transform translate-x-4 group-hover:-translate-x-0 z-20 shadow-2xl backdrop-blur-xl">
                  <div className="text-blue-400 font-bold mb-1">Senior Engineer</div>
                  <div className="text-green-400 text-sm mb-3">Est. $130k - $180k</div>
                  <div className="text-xs text-muted-foreground mb-2 uppercase">Next Steps to Unlock</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-200">System Design</span>
                    <span className="text-[10px] px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-200">CI/CD Mastery</span>
                  </div>
                </div>
              </div>

              {/* Line */}
              <div className="w-1 h-16 bg-blue-500/50 my-2 ml-16 transform rotate-12"></div>

              {/* Current Node */}
              <div className="group relative z-10">
                <div className="w-16 h-16 bg-blue-600 border-2 border-blue-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                  <div className="text-foreground font-bold text-lg">YOU</div>
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-foreground font-bold">Engineer (Level 12)</div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: AI Career Twin */}
        <section className="py-24 px-6 relative border-t border-border bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Meet Your AI Career Twin</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Your twin simulates thousands of career paths to find your fastest route to promotion.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
              {/* You Card */}
              <div className="flex-1 w-full max-w-md p-8 bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">Current Stats</h3>
                  <span className="bg-muted px-3 py-1 rounded-full text-sm font-mono text-muted-foreground">Level 12</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Current Skills</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md">Python</span>
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md">SQL</span>
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md">Machine Learning</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Trajectory</div>
                    <div className="text-foreground">Mid-Level Engineer (Stagnant)</div>
                  </div>
                </div>
              </div>

              {/* VS or Arrow */}
              <div className="hidden lg:flex shrink-0 px-4 text-purple-500 font-bold text-2xl italic opacity-50">VS</div>

              {/* AI Twin Card */}
              <div className="flex-1 w-full max-w-md p-8 bg-gradient-to-b from-purple-900/30 to-background border border-purple-500/40 rounded-2xl relative shadow-[0_0_40px_rgba(147,51,234,0.15)]">
                <div className="absolute top-0 right-0 p-4"><Sparkles className="w-6 h-6 text-purple-400 animate-pulse" /></div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI Twin Prediction</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-purple-300/70 mb-2">If you learn:</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-sm rounded-md border border-purple-500/30">System Design</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-sm rounded-md border border-purple-500/30">MLOps</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-sm rounded-md border border-purple-500/30">Cloud Arch</span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/20">
                    <div className="text-sm text-muted-foreground mb-1">Within 6 months:</div>
                    <div className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-green-400" /> Unlock Senior AI Engineer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Career Quest Board */}
        <section className="py-24 px-6 relative border-t border-border bg-background backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-4">
                <Map className="w-10 h-10 text-orange-500 hidden md:block" /> Career Quest Board
              </h2>
              <p className="text-muted-foreground text-lg">Turn boring tasks into engaging quests with real XP rewards.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-2 shadow-xl">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-bold text-foreground uppercase tracking-wider">Today&apos;s Quests</h3>
                <span className="text-sm text-muted-foreground hidden sm:block">Refreshes in 12:45:00</span>
              </div>
              <div className="p-4 space-y-3">
                {/* Quest 1 */}
                <div className="flex items-center justify-between p-4 bg-muted hover:bg-muted rounded-xl border border-transparent hover:border-purple-500/30 transition-all cursor-pointer group" onClick={() => play('snap')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform hidden sm:flex">
                      <Terminal className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold group-hover:text-purple-300 transition-colors">Complete Docker Fundamentals</div>
                      <div className="text-xs text-muted-foreground">Video course module 4/10</div>
                    </div>
                  </div>
                  <div className="text-pink-400 font-bold font-mono bg-pink-500/10 px-3 py-1 rounded-full">+250 XP</div>
                </div>

                {/* Quest 2 */}
                <div className="flex items-center justify-between p-4 bg-muted hover:bg-muted rounded-xl border border-transparent hover:border-orange-500/30 transition-all cursor-pointer group" onClick={() => play('snap')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 group-hover:scale-110 transition-transform hidden sm:flex">
                      <Cpu className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold group-hover:text-orange-300 transition-colors">Build ML Classification API</div>
                      <div className="text-xs text-muted-foreground">Portfolio Project Milestone</div>
                    </div>
                  </div>
                  <div className="text-orange-400 font-bold font-mono bg-orange-500/10 px-3 py-1 rounded-full">+500 XP</div>
                </div>

                {/* Quest 3 */}
                <div className="flex items-center justify-between p-4 bg-muted hover:bg-muted rounded-xl border border-transparent hover:border-blue-500/30 transition-all cursor-pointer group" onClick={() => play('snap')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform hidden sm:flex">
                      <Network className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold group-hover:text-blue-300 transition-colors">Update LinkedIn Portfolio</div>
                      <div className="text-xs text-muted-foreground">Networking Task</div>
                    </div>
                  </div>
                  <div className="text-blue-400 font-bold font-mono bg-blue-500/10 px-3 py-1 rounded-full">+150 XP</div>
                </div>

                {/* Quest 4 */}
                <div className="flex items-center justify-between p-4 bg-muted hover:bg-muted rounded-xl border border-transparent hover:border-green-500/30 transition-all cursor-pointer group" onClick={() => play('snap')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform hidden sm:flex">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold group-hover:text-green-300 transition-colors">Mock Interview Challenge</div>
                      <div className="text-xs text-muted-foreground">System Design Prep</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold font-mono bg-green-500/10 px-3 py-1 rounded-full">+300 XP</div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Success Metrics */}
        <section className="py-24 px-6 relative border-t border-border bg-gradient-to-t from-background to-background/40">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border text-center group hover:border-purple-500/50 transition-colors">
                <Unlock className="w-8 h-8 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-bold text-foreground mb-2 font-mono">14,203</div>
                <div className="text-muted-foreground text-sm uppercase tracking-widest">Skills Unlocked</div>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border text-center group hover:border-pink-500/50 transition-colors">
                <Target className="w-8 h-8 text-pink-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-bold text-foreground mb-2 font-mono">8,492</div>
                <div className="text-muted-foreground text-sm uppercase tracking-widest">Goals Achieved</div>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border text-center group hover:border-yellow-500/50 transition-colors">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-bold text-foreground mb-2 font-mono">2.4M</div>
                <div className="text-muted-foreground text-sm uppercase tracking-widest">XP Earned</div>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border text-center group hover:border-green-500/50 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-bold text-foreground mb-2 font-mono">3,150</div>
                <div className="text-muted-foreground text-sm uppercase tracking-widest">Promotions Predicted</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6.5: Wall of Love */}
        <WallOfLove />

        {/* Section 7: Final CTA */}
        <section className="py-32 px-6 relative border-t border-border overflow-hidden">
          {/* Deep dark glowing background */}
          <div className="absolute inset-0 bg-background"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="w-48 h-48 mb-8 flex-shrink-0 relative">
              <Image src={logoLightImg} alt="CareerVerse" fill className="object-contain dark:hidden" />
              <Image src={logoImg} alt="CareerVerse" fill className="object-contain hidden dark:block" />
            </div>

            <h2 className="text-5xl lg:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
              Stop Grinding <span className="text-muted-foreground line-through">Blindly.</span>
            </h2>
            <p className="text-2xl text-foreground dark:text-purple-200 mb-12 max-w-2xl font-light">
              Build your Career Character. Unlock your next professional milestone with your AI Career Twin.
            </p>

            <Link href="/sign-up" onClick={() => play('snap')}>
              <Button size="lg" className="h-16 px-10 text-xl font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all rounded-full hover:scale-105">
                Create My Character
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-border text-muted-foreground bg-background z-10 relative">
        <p>© 2026 CareerVerse. The ultimate career progression game.</p>
      </footer>
    </div>
  );
}
