export interface DictionaryEntry {
  word: string
  oldword: string
  strokes: string
  pinyin: string
  radicals: string
  explanation: string
}

export interface IdiomEntry {
  word: string
  pinyin: string
  explanation: string
}

export type IdiomIndex = Record<string, IdiomEntry[]>

export interface ReadingToken {
  char: string
  pinyin: string
  isHanzi: boolean
  index: number
}
