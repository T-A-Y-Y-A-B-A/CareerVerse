import { useRef, useCallback } from 'react'

export type SoundType = 'snap' | 'coin' | 'confirm' | 'error'

export function useSounds(volume = 0.6) {
  const acRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback((): AudioContext => {
    if (!acRef.current) {
      acRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
    }
    // Resume if suspended (browser autoplay policy)
    if (acRef.current.state === 'suspended') {
      acRef.current.resume()
    }
    return acRef.current
  }, [])

  const play = useCallback(
    (type: SoundType) => {
      const ac = getCtx()
      const now = ac.currentTime

      switch (type) {
        // ── Snap ─────────────────────────────────────────────
        // Use for: quick button clicks, toggling a filter, tab switch
        case 'snap': {
          const length = Math.floor(ac.sampleRate * 0.025)
          const buf = ac.createBuffer(1, length, ac.sampleRate)
          const data = buf.getChannelData(0)
          for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 10)
          }
          const g = ac.createGain()
          g.gain.setValueAtTime(volume, now)
          g.connect(ac.destination)
          const src = ac.createBufferSource()
          src.buffer = buf
          src.connect(g)
          src.start(now)
          break
        }

        // ── Coin ─────────────────────────────────────────────
        // Use for: XP earned, badge unlocked, streak reward
        case 'coin': {
          const freqs = [1046, 1318, 1568, 2093]
          freqs.forEach((freq, i) => {
            const osc = ac.createOscillator()
            const g = ac.createGain()
            const t = now + i * 0.04
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, t)
            g.gain.setValueAtTime(volume * 0.35, t)
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
            osc.connect(g)
            g.connect(ac.destination)
            osc.start(t)
            osc.stop(t + 0.18)
          })
          break
        }

        // ── Confirm ───────────────────────────────────────────
        // Use for: job applied, profile saved, form submitted
        case 'confirm': {
          const freqs = [523, 659, 784]
          freqs.forEach((freq, i) => {
            const osc = ac.createOscillator()
            const g = ac.createGain()
            const t = now + i * 0.07
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, t)
            g.gain.setValueAtTime(volume * 0.4, t)
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
            osc.connect(g)
            g.connect(ac.destination)
            osc.start(t)
            osc.stop(t + 0.15)
          })
          break
        }

        // ── Error ─────────────────────────────────────────────
        // Use for: form validation fail, missing required field
        case 'error': {
          const freqs = [200, 150]
          freqs.forEach((freq, i) => {
            const osc = ac.createOscillator()
            const g = ac.createGain()
            const t = now + i * 0.1
            osc.type = 'square'
            osc.frequency.setValueAtTime(freq, t)
            g.gain.setValueAtTime(volume * 0.3, t)
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
            osc.connect(g)
            g.connect(ac.destination)
            osc.start(t)
            osc.stop(t + 0.12)
          })
          break
        }
      }
    },
    [getCtx, volume]
  )

  return { play }
}
