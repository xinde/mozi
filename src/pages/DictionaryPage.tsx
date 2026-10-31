import { Search, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CharacterGlyph } from '../components/CharacterGlyph'
import { CharacterPopover } from '../components/CharacterPopover'
import { InlineHanziText } from '../components/InlineHanziText'
import { StrokeOrderStrip } from '../components/StrokeOrderStrip'
import { StrokeWriter } from '../components/StrokeWriter'
import { splitDefinitionsByReading } from '../lib/definitions'
import { getCharacterPinyin, getEntry, loadIdioms, sanitizeSingleHanzi, speak } from '../lib/dictionary'
import { getRadicalDisplay } from '../lib/radicals'
import type { DictionaryEntry, IdiomEntry } from '../types'

const examples = ['春', '学', '家', '爱', '山', '明']

function cleanExplanation(text: string) {
  return text
    .replace(/─+—?/g, '')
    .replace(/\n\s*\n+/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8)
}

export function DictionaryPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryChar = sanitizeSingleHanzi(params.get('q') ?? '') || '春'
  const [input, setInput] = useState(queryChar)
  const [entry, setEntry] = useState<DictionaryEntry>()
  const [idioms, setIdioms] = useState<IdiomEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string>()
  const [selectedReading, setSelectedReading] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getEntry(queryChar), loadIdioms()])
      .then(([nextEntry, idiomIndex]) => {
        if (!active) return
        setEntry(nextEntry)
        setIdioms(idiomIndex[queryChar] ?? [])
        setNotFound(!nextEntry)
        setLoading(false)
      })
    return () => { active = false }
  }, [queryChar])

  const readings = useMemo(() => {
    const value = getCharacterPinyin(queryChar, true)
    return Array.from(new Set(value.split(/\s+/).filter(Boolean)))
  }, [queryChar])
  const pronunciationDefinitions = useMemo(
    () => entry ? splitDefinitionsByReading(queryChar, entry.explanation, readings) : [],
    [entry, queryChar, readings],
  )
  const activeDefinition = pronunciationDefinitions.find((group) => group.reading === selectedReading) ?? pronunciationDefinitions[0]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const char = sanitizeSingleHanzi(input)
    if (!char) return
    navigate(`/dictionary?q=${encodeURIComponent(char)}`)
  }

  return (
    <div className="page dictionary-page">
      <section className="dictionary-intro dictionary-search-panel">
        <form className="character-search" onSubmit={submit}>
          <label className="sr-only" htmlFor="character-input">输入一个汉字</label>
          <Search aria-hidden="true" />
          <input id="character-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入一个汉字" inputMode="text" maxLength={8} />
          <button type="submit">查字</button>
        </form>
        <div className="quick-characters" aria-label="常用字快捷查询">
          <span>试一试</span>
          {examples.map((char) => <button key={char} onClick={() => navigate(`/dictionary?q=${char}`)}>{char}</button>)}
        </div>
      </section>

      {loading ? <div className="loading-state"><i /><span>正在翻字典…</span></div> : notFound ? (
        <section className="empty-state"><b>{queryChar}</b><h2>这册离线字典里还没有这个字</h2><p>你仍可查看拼音和笔顺，或换一个常用字试试。</p></section>
      ) : entry && (
        <>
          <section className="character-hero" aria-labelledby="character-title">
            <div className="hero-grid"><CharacterGlyph character={queryChar} /></div>
            <div className="character-summary">
              <span className="eyebrow">读音</span>
              <div className="reading-row">
                <h2 id="character-title">{entry.pinyin || readings.join('、')}</h2>
                <button className="sound-button" onClick={() => speak(queryChar)} aria-label={`朗读${queryChar}字`}><Volume2 aria-hidden="true" /></button>
              </div>
              <dl className="character-facts">
                <div><dt>部首</dt><dd>{getRadicalDisplay(entry.radicals)}</dd></div>
                <div><dt>笔画</dt><dd>{entry.strokes || '未知'} 画</dd></div>
                <div><dt>结构</dt><dd>{entry.structure || '结构未知'}</dd></div>
                {entry.oldword && entry.oldword !== queryChar && <div className="variant-fact"><dt>传统字形</dt><dd>{entry.oldword}</dd></div>}
              </dl>
              {readings.length > 1 && <div className="reading-chips" aria-label="选择读音">{readings.map((reading) => (
                <button className={(activeDefinition?.reading ?? readings[0]) === reading ? 'active' : ''} key={reading} onClick={() => setSelectedReading(reading)}>{reading}</button>
              ))}</div>}
            </div>
          </section>

          <div className="learning-grid">
            <StrokeWriter character={queryChar} />
            <StrokeOrderStrip character={queryChar} />
          </div>

          <section className="definition-section" aria-labelledby="definition-title">
            <div className="section-heading"><div><span className="eyebrow">字典 · 点字可查</span><h2 id="definition-title">{activeDefinition ? `${activeDefinition.reading} 的释义` : '基本释义'}</h2></div></div>
            {pronunciationDefinitions.length > 1 && <div className="definition-reading-tabs" aria-label="切换释义读音">{pronunciationDefinitions.map((group) => (
              <button className={activeDefinition?.reading === group.reading ? 'active' : ''} key={group.reading} onClick={() => setSelectedReading(group.reading)}>{group.reading}</button>
            ))}</div>}
            <div className="definition-copy">{(activeDefinition?.lines ?? cleanExplanation(entry.explanation)).map((line, index) => <p key={`${line}-${index}`}><InlineHanziText text={line} onSelect={setSelectedCharacter} /></p>)}</div>
          </section>

          <section className="idiom-section" aria-labelledby="idiom-title">
            <div className="section-heading"><div><span className="eyebrow">用法</span><h2 id="idiom-title">含“{queryChar}”的成语</h2></div><span className="section-count">{idioms.length} 条</span></div>
            {idioms.length ? <div className="idiom-list">{idioms.map((idiom) => (
              <details key={idiom.word}><summary><span><b>{idiom.word}</b><small>{idiom.pinyin}</small></span><i aria-hidden="true">＋</i></summary><p>{idiom.explanation}</p></details>
            ))}</div> : <p className="muted">暂未收录相关成语。</p>}
          </section>
        </>
      )}
      {selectedCharacter && <CharacterPopover character={selectedCharacter} onClose={() => setSelectedCharacter(undefined)} />}
    </div>
  )
}
