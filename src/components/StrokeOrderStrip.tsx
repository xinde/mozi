import HanziWriter from 'hanzi-writer'
import { useEffect, useRef, useState } from 'react'

export function StrokeOrderStrip({ character }: { character: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return
    mountRef.current.innerHTML = ''
    setMissing(false)
    HanziWriter.loadCharacterData(character, {
      charDataLoader: (char, onComplete, onError) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
          .then((response) => response.ok ? response.json() : Promise.reject())
          .then(onComplete)
          .catch(() => onError?.('missing'))
      },
    }).then((data) => {
      if (!mountRef.current || !data) return
      const max = Math.min(data.strokes.length, 20)
      for (let i = 0; i < max; i += 1) {
        const cell = document.createElement('div')
        cell.className = 'stroke-cell'
        const number = document.createElement('span')
        number.textContent = String(i + 1)
        cell.appendChild(number)
        mountRef.current.appendChild(cell)
        const writer = HanziWriter.create(cell, character, {
          width: 64,
          height: 64,
          padding: 6,
          strokeColor: '#342b24',
          outlineColor: '#ded4c5',
          showCharacter: false,
          showOutline: true,
          charDataLoader: (_, done) => done({
            strokes: data.strokes.slice(0, i + 1),
            medians: data.medians.slice(0, i + 1),
            radStrokes: data.radStrokes?.filter((stroke) => stroke <= i) ?? [],
          }),
        })
        writer.showCharacter({ duration: 0 })
      }
    }).catch(() => setMissing(true))
  }, [character])

  return (
    <section className="order-section" aria-labelledby="order-title">
      <div className="section-heading"><div><span className="eyebrow">顺序</span><h2 id="order-title">逐笔书写</h2></div></div>
      {missing ? <p className="muted">联网后可载入逐笔字形。</p> : <div ref={mountRef} className="stroke-strip" aria-label={`${character}字逐笔顺序`} />}
    </section>
  )
}
