import { MessageSquare, Hammer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function InterviewSimulatorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
        <MessageSquare className="w-10 h-10 text-pink-400 relative z-10" />
        <Hammer className="w-5 h-5 text-muted-foreground absolute bottom-2 right-2 animate-pulse" />
      </div>
      
      <h1 className="text-3xl font-bold text-foreground mb-3">
        Interview Simulator
      </h1>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
        We're currently building the AI Interview Simulator. Soon, you'll be able to practice mock interviews, get real-time feedback, and perfect your pitch.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground mb-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
        </span>
        In Development
      </div>
      
      <div>
        <Link href="/dashboard">
          <Button variant="outline" className="border-pink-500/30 hover:border-pink-500/60 hover:bg-pink-500/10 text-foreground transition-all duration-300">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
