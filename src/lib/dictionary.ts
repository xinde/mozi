import { pinyin } from 'pinyin-pro'
import type { DictionaryEntry, IdiomIndex, ReadingToken } from '../types'

let dictionaryPromise: Promise<DictionaryEntry[]> | undefined
let idiomsPromise: Promise<IdiomIndex> | undefined
let entryMap: Map<string, DictionaryEntry> | undefined

export const isHanzi = (char: string) => /\p{Script=Han}/u.test(char)

export async function loadDictionary() {
  dictionaryPromise ??= fetch(`${import.meta.env.BASE_URL}data/dictionary.json`).then(async (response) => {
    if (!response.ok) throw new Error('字典数据加载失败')
    const entries = (await response.json()) as DictionaryEntry[]
    entryMap = new Map(entries.map((entry) => [entry.word, entry]))
    return entries
  })
  return dictionaryPromise
}

export async function loadIdioms() {
  idiomsPromise ??= fetch(`${import.meta.env.BASE_URL}data/idioms.json`).then(async (response) => {
    if (!response.ok) throw new Error('成语数据加载失败')
    return (await response.json()) as IdiomIndex
  })
  return idiomsPromise
}

export async function getEntry(char: string) {
  await loadDictionary()
  return entryMap?.get(char)
}

export function getCharacterPinyin(char: string, multiple = true) {
  return pinyin(char, { multiple, type: 'string' })
}

export function annotateText(text: string): ReadingToken[] {
  const chars = Array.from(text)
  const details = pinyin(text, { type: 'all', toneSandhi: true })
  return chars.map((char, index) => ({
    char,
    index,
    isHanzi: isHanzi(char),
    pinyin: details[index]?.isZh ? details[index].pinyin : '',
  }))
}

export function sanitizeSingleHanzi(value: string) {
  return Array.from(value).find(isHanzi) ?? ''
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.72
  window.speechSynthesis.speak(utterance)
  return true
}
