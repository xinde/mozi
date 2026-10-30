import HanziWriter from 'hanzi-writer'
import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function QuickStrokeCharacter({ character }: { character: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return
    mountRef.current.innerHTML = ''
    const writer = HanziWriter.create(mountRef.current, character, {
      width: 76,
      height: 76,
      padding: 7,
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 80,
      strokeColor: '#342b24',
      outlineColor: '#d9cebc',
      showOutline: true,
      showCharacter: true,
      charDataLoader: (char, onComplete, onError) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
          .then((response) => response.ok ? response.json() : Promise.reject())
          .then(onComplete)
          .catch(() => onError?.('笔顺数据暂不可用'))
      },
    })
    writerRef.current = writer
    return () => { writer.pauseAnimation(); writerRef.current = null }
  }, [character])

  const play = () => {
    const writer = writerRef.current
    if (!writer || playing) return
    setPlaying(true)
    writer.hideCharacter({ duration: 0 }).then(() => {
      writer.animateCharacter({ onComplete: () => setPlaying(false) })
    })
  }

  return (
    <button className="mini-tian quick-stroke" onClick={play} aria-label={`快速演示${character}字笔顺`}>
      <span ref={mountRef} className="quick-stroke-canvas" />
      <i className={playing ? 'playing' : ''}><Play aria-hidden="true" /></i>
    </button>
  )
}
