import { isHanzi } from '../lib/dictionary'

interface InlineHanziTextProps {
  text: string
  onSelect: (character: string) => void
}

export function InlineHanziText({ text, onSelect }: InlineHanziTextProps) {
  return (
    <>
      {Array.from(text).map((character, index) => isHanzi(character) ? (
        <button
          className="inline-hanzi"
          key={`${character}-${index}`}
          onClick={() => onSelect(character)}
          aria-label={`查看${character}字`}
        >
          {character}
        </button>
      ) : <span key={`${character}-${index}`}>{character}</span>)}
    </>
  )
}
