'use client'

import { useEffect, useState } from 'react'
import { Star, MessageSquareQuote } from 'lucide-react'
import { getPublicFeedback } from '@/app/actions/feedback'

type FeedbackType = {
  id: number;
  rating: number;
  comment: string | null;
  firstName: string | null;
  lastName: string | null;
  careerLevel: number | null;
}

export function WallOfLove() {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicFeedback().then((data) => {
      setFeedbacks(data as FeedbackType[])
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  if (loading || feedbacks.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-6 relative border-t border-border bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Wall of Love</h2>
          <p className="text-xl text-muted-foreground">Don't just take our word for it. Hear from our players.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <MessageSquareQuote className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              
              <p className="text-foreground/90 italic mb-6 relative z-10">
                "{fb.comment}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {fb.firstName?.[0] || 'A'}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {fb.firstName ? `${fb.firstName} ${fb.lastName || ''}` : 'Anonymous Explorer'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Level {fb.careerLevel || 1} User
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
