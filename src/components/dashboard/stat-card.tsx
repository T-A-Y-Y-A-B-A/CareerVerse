'use client'

import Link from 'next/link'

interface StatCardProps {
  label:      string
  value:      string | number
  sublabel?:  string
  icon?:      string | React.ReactNode
  emptyHint?: string
  isEmpty?:   boolean
  href?:      string
}

export function StatCard({ label, value, sublabel, icon, emptyHint, isEmpty, href }: StatCardProps) {
  const content = (
    <div className="rounded-xl border border-border bg-background p-4 space-y-1.5 h-full hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.1)]">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      {isEmpty ? (
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground italic">Not started yet</p>
          {emptyHint && <p className="text-xs text-muted-foreground/70">{emptyHint}</p>}
        </div>
      ) : (
        <div>
          <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
          {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
        </div>
      )}
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
