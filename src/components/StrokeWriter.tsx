import HanziWriter from 'hanzi-writer'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface StrokeWriterProps {
  character: string
  size?: number
}

export function StrokeWriter({ character, size = 220 }: StrokeWriterProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return
    mountRef.current.innerHTML = ''
    setError(false)
    const writer = HanziWriter.create(mountRef.current, character, {
      width: size,
      height: size,
      padding: 12,
      strokeAnimationSpeed: speed === 'fast' ? 2.2 : 1.15,
      delayBetweenStrokes: speed === 'fast' ? 90 : 260,
      strokeColor: '#342b24',
      radicalColor: '#b33b2e',
      outlineColor: '#d9cebc',
      drawingColor: '#b33b2e',
      showOutline: true,
      showCharacter: true,
      charDataLoader: (char, onComplete, onError) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
          .then((response) => {
            if (!response.ok) throw new Error('stroke data missing')
            return response.json()
          })
          .then(onComplete)
          .catch(() => {
            setError(true)
            onError?.('笔顺数据暂不可用')
          })
      },
    })
    writerRef.current = writer
    return () => {
      writer.pauseAnimation()
      writerRef.current = null
    }
  }, [character, size, speed])

  const animate = () => {
    const writer = writerRef.current
    if (!writer) return
    setPlaying(true)
    if (paused) {
      setPaused(false)
      writer.resumeAnimation()
      return
    }
    writer.animateCharacter({ onComplete: () => { setPlaying(false); setPaused(false) } })
  }

  const pause = () => {
    writerRef.current?.pauseAnimation()
    setPlaying(false)
    setPaused(true)
  }

  const reset = () => {
    writerRef.current?.pauseAnimation()
    writerRef.current?.hideCharacter({ duration: 0 })
    writerRef.current?.showCharacter({ duration: 300 })
    setPlaying(false)
    setPaused(false)
  }

  return (
    <section className="stroke-section" aria-labelledby="stroke-title">
      <div className="section-heading">
        <div><span className="eyebrow">字形</span><h2 id="stroke-title">笔顺演示</h2></div>
        <button className="speed-toggle" onClick={() => setSpeed(speed === 'fast' ? 'normal' : 'fast')} aria-label={`当前${speed === 'fast' ? '快速' : '正常'}速度，点击切换`}>
          {speed === 'fast' ? '快速 2×' : '正常 1×'}
        </button>
      </div>
      <div className="writer-stage">
        <div className="tian-grid" aria-hidden="true" />
        <div ref={mountRef} className="writer-canvas" aria-label={`${character}字笔顺动画`} />
        {error && <div className="writer-error">首次播放需要联网载入这个字的笔顺</div>}
      </div>
      <div className="stroke-controls">
        <button className="primary-button" onClick={playing ? pause : animate} disabled={error}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {playing ? '暂停' : paused ? '继续演示' : '演示笔顺'}
        </button>
        <button className="reset-button" onClick={reset} aria-label="重置笔顺">
          <RotateCcw aria-hidden="true" /> 重置
        </button>
      </div>
    </section>
  )
}
