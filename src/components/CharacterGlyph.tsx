import HanziWriter from 'hanzi-writer'
import { useEffect, useRef } from 'react'

interface CharacterGlyphProps {
  character: string
  size?: number
}

export function CharacterGlyph({ character, size = 190 }: CharacterGlyphProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    mount.innerHTML = ''
    const fallback = document.createElement('span')
    fallback.className = 'hero-glyph-fallback'
    fallback.textContent = character
    mount.appendChild(fallback)
    const writer = HanziWriter.create(mount, character, {
      width: size,
      height: size,
      padding: 10,
      strokeColor: '#342b24',
      showOutline: false,
      showCharacter: true,
      charDataLoader: (char, onComplete, onError) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
          .then((response) => response.ok ? response.json() : Promise.reject())
          .then((data) => { fallback.remove(); onComplete(data) })
          .catch(() => onError?.('字形数据暂不可用'))
      },
    })
    return () => { writer.pauseAnimation(); mount.innerHTML = '' }
  }, [character, size])

  return <div ref={mountRef} className="hero-glyph" aria-label={`${character}字标准字形`} />
}
