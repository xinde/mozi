import HanziWriter, { type CharacterJson } from 'hanzi-writer'
import { useEffect, useRef, useState } from 'react'

const DATA_URL = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0'

function createWriter(cell: HTMLElement, character: string, data: CharacterJson, strokeColor: string) {
  return HanziWriter.create(cell, character, {
    width: 64,
    height: 64,
    padding: 6,
    strokeColor,
    outlineColor: '#ded4c5',
    showCharacter: false,
    showOutline: false,
    charDataLoader: (_, done) => done(data),
  })
}

export function StrokeOrderStrip({ character }: { character: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    mount.innerHTML = ''
    setMissing(false)
    HanziWriter.loadCharacterData(character, {
      charDataLoader: (char, onComplete, onError) => {
        fetch(`${DATA_URL}/${encodeURIComponent(char)}.json`)
          .then((response) => response.ok ? response.json() : Promise.reject())
          .then(onComplete)
          .catch(() => onError?.('missing'))
      },
    }).then((data) => {
      if (!mountRef.current || mountRef.current !== mount || !data || mount.childElementCount > 0) return
      const max = Math.min(data.strokes.length, 20)
      for (let i = 0; i < max; i += 1) {
        const cell = document.createElement('div')
        cell.className = 'stroke-cell mi-grid'
        const number = document.createElement('span')
        number.textContent = String(i + 1)
        cell.appendChild(number)
        const previousLayer = document.createElement('div')
        previousLayer.className = 'stroke-layer stroke-previous'
        const currentLayer = document.createElement('div')
        currentLayer.className = 'stroke-layer stroke-current'
        cell.append(previousLayer, currentLayer)
        mountRef.current.appendChild(cell)

        if (i > 0) {
          const previous = createWriter(previousLayer, character, {
            strokes: data.strokes.slice(0, i),
            medians: data.medians.slice(0, i),
            radStrokes: data.radStrokes?.filter((stroke) => stroke < i) ?? [],
          }, '#342b24')
          previous.showCharacter({ duration: 0 })
        }
        const current = createWriter(currentLayer, character, {
          strokes: [data.strokes[i]],
          medians: [data.medians[i]],
          radStrokes: [],
        }, '#b33b2e')
        current.showCharacter({ duration: 0 })
      }
    }).catch(() => {
      if (mountRef.current === mount) setMissing(true)
    })
    return () => { mount.innerHTML = '' }
  }, [character])

  return (
    <section className="order-section" aria-labelledby="order-title">
      <div className="section-heading">
        <div><span className="eyebrow">顺序 · 红色为当前笔</span><h2 id="order-title">逐笔书写</h2></div>
      </div>
      {missing ? <p className="muted">联网后可载入逐笔字形。</p> : <div ref={mountRef} className="stroke-strip" aria-label={`${character}字逐笔顺序，红色表示当前新增笔画`} />}
    </section>
  )
}
