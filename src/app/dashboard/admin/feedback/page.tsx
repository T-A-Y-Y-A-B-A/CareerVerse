import { getAllFeedbackAdmin } from '@/app/actions/feedback'
import { Star, User, MessageSquare, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminFeedbackPage() {
  const feedbacks = await getAllFeedbackAdmin()

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback Responses</h1>
        <p className="text-muted-foreground mt-2">View all user feedback and ratings below.</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
          <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No feedback yet</h2>
          <p className="text-muted-foreground">When users submit feedback, it will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {fb.firstName} {fb.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{fb.email}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= fb.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                  <Calendar className="w-4 h-4" />
                  {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Unknown Date'}
                </div>
              </div>

              {fb.comment && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-foreground/90 whitespace-pre-wrap">{fb.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
