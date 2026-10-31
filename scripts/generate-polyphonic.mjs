import fs from 'node:fs'
import { convert, pinyin } from 'pinyin-pro'

const dictionaryPath = new URL('../public/data/dictionary.json', import.meta.url)
const outputPath = new URL('../public/data/polyphonic.json', import.meta.url)
const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'))

const stripTone = (value) => convert(value.replace(/ɡ/g, 'g'), { format: 'toneNone' })
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const cleanLines = (text) => text.replace(/─+—?/g, '').split(/\n+/).map((line) => line.trim()).filter(Boolean)
const index = {}

for (const entry of dictionary) {
  const readings = [...new Set(pinyin(entry.word, { multiple: true }).split(/\s+/).filter(Boolean))]
  if (readings.length < 2) continue
  const candidates = readings.map((reading) => ({ reading, plain: stripTone(reading) })).sort((a, b) => b.plain.length - a.plain.length)
  const groups = new Map()
  let current = ''

  for (const line of cleanLines(entry.explanation)) {
    if (line.startsWith(entry.word)) {
      const prefix = stripTone(line.slice(entry.word.length, entry.word.length + 20))
      const matched = candidates.find(({ plain }) => prefix.includes(plain))
      if (matched) current = matched.reading
    }
    if (current) {
      const lines = groups.get(current) ?? []
      lines.push(line)
      groups.set(current, lines)
    }
  }

  if (groups.size < 2) continue
  index[entry.word] = readings
    .filter((reading) => groups.has(reading))
    .map((reading) => ({ reading, lines: groups.get(reading).slice(0, 12) }))
}

fs.writeFileSync(outputPath, JSON.stringify(index))
console.log(`generated ${Object.keys(index).length} polyphonic entries`)
