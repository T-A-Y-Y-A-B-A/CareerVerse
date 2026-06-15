'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { CAREER_STAGES, getStageStatuses } from '@/lib/career-ladder-data'
import { CareerNode } from './career-node'
import { ZoomControls } from './zoom-controls'
import { RoadmapStats } from './roadmap-stats'

interface Props {
  userLevel: number
  totalXP: number
}

const MIN_ZOOM = 0.4
const MAX_ZOOM = 1.6
const ZOOM_STEP = 0.15

export function CareerLadder({ userLevel, totalXP }: Props) {
  const statuses = getStageStatuses(userLevel)

  // ── Zoom / Pan state ────────────────────────────────────────────────────
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // ── Responsive detection ────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Fit-to-screen calculation ───────────────────────────────────────────
  const fitToScreen = useCallback(() => {
    if (!viewportRef.current || !canvasRef.current || isMobile) return

    const vp = viewportRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    // Measure natural size at zoom=1
    const contentWidth = canvas.scrollWidth
    const contentHeight = canvas.scrollHeight

    const hPadding = 60
    const vPadding = 60
    const scaleX = (vp.width - hPadding) / contentWidth
    const scaleY = (vp.height - vPadding) / contentHeight
    const optimalZoom = Math.min(scaleX, scaleY, 1.1)
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, optimalZoom))

    setZoom(clampedZoom)
    setPan({ x: 0, y: 0 })
  }, [isMobile])

  // ── Auto-fit on mount and resize ────────────────────────────────────────
  useEffect(() => {
    // Small delay so DOM has rendered
    const timer = setTimeout(fitToScreen, 100)
    const handleResize = () => {
      clearTimeout(timer)
      setTimeout(fitToScreen, 200)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [fitToScreen])

  // ── Zoom handlers ───────────────────────────────────────────────────────
  const handleZoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))
  const handleZoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // ── Mouse wheel zoom (centered) ────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom(z => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)))
  }, [])

  // ── Pan handlers ────────────────────────────────────────────────────────
  const onPanStart = useCallback((e: React.MouseEvent) => {
    // Only pan with middle mouse or when holding space (via native browser behavior)
    if (e.button !== 0) return
    setIsPanning(true)
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
  }, [pan])

  const onPanMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    // Boundary: limit pan to ±400px
    const maxPan = 400
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, panStart.current.panX + dx)),
      y: Math.max(-maxPan, Math.min(maxPan, panStart.current.panY + dy)),
    })
  }, [isPanning])

  const onPanEnd = useCallback(() => setIsPanning(false), [])

  // ── Mobile: simple vertical timeline (no zoom/pan) ──────────────────────
  if (isMobile) {
    return (
      <div className="w-full h-full overflow-y-auto px-4 py-6">
        {/* Stats card at top on mobile */}
        <div className="mb-6">
          <RoadmapStats userLevel={userLevel} totalXP={totalXP} />
        </div>

        {/* Vertical timeline */}
        <div className="relative flex flex-col items-center gap-0">
          {CAREER_STAGES.map((stage, i) => (
            <div key={stage.id} className="relative flex flex-col items-center">
              {/* Connector line (except before first) */}
              {i > 0 && (
                <div
                  className={`w-0.5 h-8 transition-all duration-700 ${
                    statuses[stage.id] === 'completed' || statuses[stage.id] === 'current'
                      ? 'bg-gradient-to-b from-purple-500 to-purple-500/50'
                      : 'bg-white/[0.08]'
                  }`}
                />
              )}
              <CareerNode stage={stage} status={statuses[stage.id]} index={i} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Desktop: horizontal progression with zoom/pan ───────────────────────
  return (
    <div className="w-full h-full flex">
      {/* Left: Stats sidebar */}
      <div className="hidden lg:flex w-[260px] flex-shrink-0 border-r border-white/[0.06] p-5 overflow-y-auto">
        <RoadmapStats userLevel={userLevel} totalXP={totalXP} />
      </div>

      {/* Right: Roadmap viewport */}
      <div className="flex-1 relative overflow-hidden">
        {/* Viewport */}
        <div
          ref={viewportRef}
          className={`w-full h-full overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={onPanStart}
          onMouseMove={onPanMove}
          onMouseUp={onPanEnd}
          onMouseLeave={onPanEnd}
          onWheel={handleWheel}
        >
          {/* Transformable canvas */}
          <div
            ref={canvasRef}
            className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Horizontal node layout */}
            <div className="flex items-start gap-0 px-8">
              {CAREER_STAGES.map((stage, i) => (
                <div key={stage.id} className="flex items-start">
                  {/* Node */}
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 120}ms` }}>
                    <CareerNode stage={stage} status={statuses[stage.id]} index={i} />
                  </div>

                  {/* Connector line between nodes (except last) */}
                  {i < CAREER_STAGES.length - 1 && (
                    <div className="flex flex-col items-center justify-center self-start pt-[7px] mx-[-2px]">
                      <div className="h-[4px] w-12 lg:w-16 xl:w-20 relative overflow-hidden rounded-full">
                        {/* Background track */}
                        <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
                        {/* Active fill */}
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                            statuses[CAREER_STAGES[i + 1].id] === 'completed' ||
                            statuses[CAREER_STAGES[i + 1].id] === 'current'
                              ? 'w-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] roadmap-glow-line'
                              : 'w-0 bg-white/10'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating zoom controls */}
        <div className="absolute bottom-4 right-4 z-20">
          <ZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onFitScreen={fitToScreen}
          />
        </div>

        {/* Subtle dot background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>
    </div>
  )
}
