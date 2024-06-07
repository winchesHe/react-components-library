/* eslint-disable regexp/no-super-linear-backtracking */
export function getMatchImport(str: string) {
  const importRegexAll = /import \{?\s*([\s\S]+?)\s*\}? from ['"](.+)['"]/g

  const matchAll = str.match(importRegexAll) ?? []
  const result: string[][] = []

  for (const item of matchAll) result.push(matchImport(item))

  return result.length ? result : []

  function matchImport(itemImport: string) {
    const importRegex = /import \{?\s*([\s\S]+?)\s*\}? from ['"](.+)['"]/
    const match = itemImport.match(importRegex) ?? []
    return [match[1] ?? '', match[2] ?? '']
  }
}
