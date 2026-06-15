'use client'

import { useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSounds } from "@/hooks/useSounds"

type Status = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  onProfileReceived: (profile: unknown) => void
}

export function CvUploader({ onProfileReceived }: Props) {
  const { play } = useSounds()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      setError('Please upload a PDF or .txt file.')
      return
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.')
      return
    }

    setFileName(file.name)
    setStatus('loading')
    setError('')

    const formData = new FormData()
    formData.append('cv', file)

    try {
      const res = await fetch('/api/career-twin', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setStatus('success')
      onProfileReceived(data.profile)
    } catch (err) {
      play('error')
      setError((err as Error).message)
      setStatus('error')
    }
  }, [onProfileReceived, play])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-10 md:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden",
        "backdrop-blur-[14px]",
        isDragging 
          ? "border-primary bg-[#0a0a14]/70 scale-[1.01] shadow-[0_0_40px_rgba(168,85,247,0.3)]" 
          : "border-white/12 bg-[#0a0a14]/55 hover:border-primary/50 hover:bg-[#0a0a14]/65 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      {status === 'loading' ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          {/* Spinner */}
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin shadow-lg" />
          <p className="text-white font-semibold text-lg tracking-tight">
            Analyzing <span className="text-primary font-bold">{fileName}</span>...
          </p>
          <p className="text-sm text-gray-300 font-medium max-w-sm">
            AI is building your Career Twin. This takes ~15 seconds.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          {/* Upload icon with subtle styling */}
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-xl font-bold text-white tracking-tight drop-shadow-md">
              Upload your CV
            </p>
            <p className="text-sm text-gray-200 font-semibold drop-shadow-sm max-w-md mx-auto leading-relaxed">
              Drag & drop or click to browse — PDF or .txt, max 5MB
            </p>
          </div>

          <label
            htmlFor="cv-input"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 transition-all px-6 py-2 rounded-lg font-medium shadow-sm hover:scale-[1.02]'
            )}
          >
            Choose file
          </label>
          <input
            id="cv-input"
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={onInputChange}
          />

          {error && (
            <p className="text-sm text-red-200 bg-red-950/70 border border-red-500/30 px-4 py-2.5 rounded-lg font-semibold shadow-lg backdrop-blur-sm">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
