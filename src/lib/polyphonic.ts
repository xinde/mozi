export interface PolyphonicGroup {
  reading: string
  lines: string[]
}

type PolyphonicIndex = Record<string, PolyphonicGroup[]>

let indexPromise: Promise<PolyphonicIndex> | undefined

export async function loadPolyphonicIndex() {
  indexPromise ??= fetch(`${import.meta.env.BASE_URL}data/polyphonic.json`).then(async (response) => {
    if (!response.ok) throw new Error('多音字义项数据加载失败')
    return await response.json() as PolyphonicIndex
  })
  return indexPromise
}
