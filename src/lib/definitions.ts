import { convert } from 'pinyin-pro'

export interface PronunciationDefinition {
  reading: string
  label: string
  lines: string[]
}

function normalizeReading(value: string) {
  return convert(value.toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü').replace(/ɡ/g, 'g'), { format: 'numToSymbol' })
}

function plainReading(value: string) {
  return convert(normalizeReading(value), { format: 'toneNone' })
}

function stripTone(value: string) {
  return plainReading(value.normalize('NFC')).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function splitDefinitionsByReading(character: string, explanation: string, readings: string[]): PronunciationDefinition[] {
  const lines = explanation
    .replace(/─+—?/g, '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
  const candidates = readings.map((reading) => ({ reading, plain: stripTone(reading) })).sort((a, b) => b.plain.length - a.plain.length)

  const groups = new Map<string, string[]>()
  let current = ''
  for (const line of lines) {
    if (line.startsWith(character)) {
      const prefix = stripTone(line.slice(character.length, character.length + 16).toLowerCase().replace(/ɡ/g, 'g'))
      const matched = candidates.find(({ plain }) => prefix.includes(plain))
      if (matched) current = matched.reading
    }
    if (current) {
      const group = groups.get(current) ?? []
      group.push(line)
      groups.set(current, group)
    }
  }

  if (groups.size < 2 && readings.length > 1) {
    const sections = explanation.split(new RegExp(`(?=${character}[^\\n]{0,12}?(?:${candidates.map(({ plain }) => plain).join('|')}))`, 'gi')).map((section) => section.trim()).filter(Boolean)
    for (const section of sections) {
      const prefix = section.slice(character.length, character.length + 16).toLowerCase().replace(/ɡ/g, 'g')
      const matched = candidates.find(({ plain }) => prefix.includes(plain))
      if (matched) groups.set(matched.reading, section.split(/\n+/).map((line) => line.trim()).filter(Boolean))
    }
  }
  if (groups.size < 2) return []
  return readings
    .filter((reading) => groups.has(reading))
    .map((reading) => ({ reading, label: reading, lines: groups.get(reading)!.slice(0, 8) }))
}
