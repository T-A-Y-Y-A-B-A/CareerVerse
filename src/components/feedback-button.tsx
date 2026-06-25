'use client'

import * as React from 'react'
import { useState } from 'react'
import { MessageSquarePlus, Star, X, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/app/actions/feedback'

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    setError('')

    const result = await submitFeedback(rating, comment)

    if (result.success) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsSuccess(false)
        setRating(0)
        setComment('')
      }, 3000)
    } else {
      setError(result.error || 'Something went wrong')
    }
    
    setIsSubmitting(false)
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 p-0 flex items-center justify-center animate-bounce-small"
        >
          <MessageSquarePlus className="h-6 w-6 text-white" />
          <span className="sr-only">Provide Feedback</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h2 className="text-lg font-semibold tracking-tight">Feedback & Rating</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-500 mb-1">Thank You!</h3>
                    <p className="text-muted-foreground text-sm">Your feedback helps us improve.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Rating Stars */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      How would you rate your experience? <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => {
                            setRating(star)
                            setError('')
                          }}
                          className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Additional Comments (Optional)
                    </label>
                    <Textarea
                      placeholder="Tell us what you love or what we could do better..."
                      className="resize-none h-24"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
