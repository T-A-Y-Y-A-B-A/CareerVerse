'use client'

import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'
import { useSounds } from "@/hooks/useSounds"

interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onFitScreen: () => void
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset, onFitScreen }: ZoomControlsProps) {
  const { play } = useSounds()
  return (
    <div className="flex items-center gap-1 p-1.5 rounded-xl bg-[#0a0a14]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
      <button
        onClick={() => { play('snap'); onZoomOut(); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="px-2 min-w-[52px] text-center">
        <span className="text-xs font-bold text-gray-300 tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <button
        onClick={() => { play('snap'); onZoomIn(); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-0.5" />

      <button
        onClick={() => { play('snap'); onReset(); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={() => { play('snap'); onFitScreen(); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="Fit to Screen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  )
}
