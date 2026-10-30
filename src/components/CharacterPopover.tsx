import { ArrowRight, Volume2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacterPinyin, getEntry, speak } from '../lib/dictionary'
import type { DictionaryEntry } from '../types'
import { QuickStrokeCharacter } from './QuickStrokeCharacter'

interface CharacterPopoverProps {
  character: string
  onClose: () => void
}

export function CharacterPopover({ character, onClose }: CharacterPopoverProps) {
  const navigate = useNavigate()
  const [entry, setEntry] = useState<DictionaryEntry>()

  useEffect(() => {
    getEntry(character).then(setEntry)
  }, [character])

  return (
    <div className="popover-layer" role="presentation" onClick={onClose}>
      <aside className="character-popover" role="dialog" aria-modal="true" aria-label={`${character}字卡`} onClick={(event) => event.stopPropagation()}>
        <button className="popover-close" onClick={onClose} aria-label="关闭字卡"><X aria-hidden="true" /></button>
        <div className="popover-top">
          <QuickStrokeCharacter character={character} />
          <div><span className="eyebrow">生字卡 · 点字看笔顺</span><h2>{entry?.pinyin || getCharacterPinyin(character)}</h2><p>{entry ? `${entry.radicals || '未知'}部 · ${entry.strokes || '未知'}画 · ${entry.structure || '结构未知'}` : '常用汉字'}</p></div>
          <button className="sound-button" onClick={() => speak(character)} aria-label={`朗读${character}字`}><Volume2 aria-hidden="true" /></button>
        </div>
        <p className="popover-definition">{entry?.explanation?.split('\n').find(Boolean)?.slice(0, 88) || '离线字典暂未收录释义，可查看完整页面学习读音与笔顺。'}</p>
        <button className="primary-button popover-action" onClick={() => navigate(`/dictionary?q=${encodeURIComponent(character)}`)}>
          查看完整字典 <ArrowRight aria-hidden="true" />
        </button>
      </aside>
    </div>
  )
}
