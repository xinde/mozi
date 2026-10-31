import { BookOpen, ChevronLeft, Eraser, MousePointer2, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CharacterPopover } from '../components/CharacterPopover'
import { annotateText } from '../lib/dictionary'

const samples = [
  { title: '静夜思', text: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。' },
  { title: '村居', text: '草长莺飞二月天，拂堤杨柳醉春烟。\n儿童散学归来早，忙趁东风放纸鸢。' },
  { title: '小池', text: '泉眼无声惜细流，树阴照水爱晴柔。\n小荷才露尖尖角，早有蜻蜓立上头。' },
]

export function ReaderPage() {
  const [text, setText] = useState(samples[0].text)
  const [readingText, setReadingText] = useState(samples[0].text)
  const [reading, setReading] = useState(false)
  const [selected, setSelected] = useState<string>()
  const [showPinyin, setShowPinyin] = useState(true)
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium')

  const tokens = useMemo(() => annotateText(readingText), [readingText])
  const hanziCount = useMemo(() => tokens.filter((token) => token.isHanzi).length, [tokens])

  const startReading = () => {
    if (!text.trim()) return
    setReadingText(text.trim())
    setReading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (reading) {
    return (
      <div className="page reading-page">
        <header className="reading-toolbar">
          <button className="back-button" onClick={() => setReading(false)}><ChevronLeft aria-hidden="true" />编辑文章</button>
          <div><b>注音阅读</b><small>{hanziCount} 个汉字</small></div>
          <button className={`pinyin-switch ${showPinyin ? 'on' : ''}`} onClick={() => setShowPinyin(!showPinyin)} aria-pressed={showPinyin}>拼音</button>
        </header>
        <div className="reader-settings" aria-label="阅读设置">
          <span>正文字号</span>
          <div>{([['small', '小'], ['medium', '中'], ['large', '大']] as const).map(([size, label]) => <button className={textSize === size ? 'active' : ''} key={size} onClick={() => setTextSize(size)} aria-pressed={textSize === size}>{label}</button>)}</div>
        </div>
        <article className={`annotated-article text-${textSize} ${showPinyin ? '' : 'hide-pinyin'}`} lang="zh-CN">
          <header className="article-header">
            <div className="article-seal" aria-hidden="true">读</div>
            <div><span className="eyebrow">我的注音读本</span><h1>慢慢读，遇见生字就点一下</h1></div>
          </header>
          <div className="reading-guide"><MousePointer2 aria-hidden="true" /><span>每个汉字都可以点按，查看读音、结构和笔顺</span></div>
          <div className="article-rule" aria-hidden="true"><span>墨字</span></div>
          <p className="article-copy">
            {tokens.map((token) => token.char === '\n' ? <span className="paragraph-break" key={token.index} /> : token.isHanzi ? (
              <button className="annotated-char" key={token.index} onClick={() => setSelected(token.char)} aria-label={`${token.char}，${token.pinyin}，点按查看生字卡`}>
                <ruby>{token.char}<rt>{token.pinyin}</rt></ruby>
              </button>
            ) : <span className="punctuation" key={token.index}>{token.char}</span>)}
          </p>
          <footer><span>读完一遍，再关掉拼音试试看</span><i /></footer>
        </article>
        {selected && <CharacterPopover character={selected} onClose={() => setSelected(undefined)} />}
      </div>
    )
  }

  return (
    <div className="page reader-page">
      <section className="reader-intro">
        <span className="eyebrow">短文注音</span>
        <h1>把一篇文章，变成识字课</h1>
        <p>粘贴短文，自动标注拼音。阅读时点一下生字，就能查看读音、部首和笔顺。</p>
      </section>

      <section className="editor-sheet" aria-labelledby="editor-title">
        <div className="section-heading">
          <div><span className="eyebrow">文章</span><h2 id="editor-title">输入或粘贴短文</h2></div>
          <button className="clear-button" onClick={() => setText('')}><Eraser aria-hidden="true" />清空</button>
        </div>
        <label className="sr-only" htmlFor="article-input">短文内容</label>
        <textarea id="article-input" value={text} onChange={(event) => setText(event.target.value.slice(0, 800))} placeholder="在这里粘贴一篇短文……" rows={10} />
        <div className="editor-meta"><span>{Array.from(text).length} / 800 字</span><span>支持中文标点和换行</span></div>
        <button className="primary-button annotate-button" onClick={startReading} disabled={!text.trim()}><Sparkles aria-hidden="true" />生成注音文章</button>
      </section>

      <section className="sample-section" aria-labelledby="sample-title">
        <div className="section-heading"><div><span className="eyebrow">范文</span><h2 id="sample-title">先读一首小诗</h2></div></div>
        <div className="sample-list">{samples.map((sample, index) => (
          <button key={sample.title} onClick={() => setText(sample.text)}>
            <span className="sample-number">0{index + 1}</span><span><b>{sample.title}</b><small>{sample.text.split('\n')[0]}</small></span><BookOpen aria-hidden="true" />
          </button>
        ))}</div>
      </section>
    </div>
  )
}
