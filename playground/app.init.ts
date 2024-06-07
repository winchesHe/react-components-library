import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { getMatchImport } from './helpers/match'

const app = 'src/App.tsx'
const example = 'app.example.tsx'
const root = resolve(fileURLToPath(import.meta.url), '../..')

const demos = fg.sync('src/components/**/demo/*.tsx', { onlyFiles: true, absolute: true, cwd: root })

// init app
if (!existsSync(app)) {
  writeFileSync(app, readFileSync(example))
}

// init demo
for (const demo of demos) {
  let demoContent = readFileSync(demo, 'utf-8')
  const result = getMatchImport(demoContent)
  const componentDir = demo.match(/\/([\w-]+)\/demo/)?.[1]
  const demoName = basename(demo, '.tsx')
  const valueList = []

  for (const [, value] of result) {
    if (value.startsWith('..')) {
      valueList.push([value, value.split('/').slice(-1)[0]])
    }
  }

  for (const [value, name] of valueList) {
    demoContent = demoContent.replace(value, `components/${componentDir}/${name.replace(/\.tsx/g, '')}.tsx`)
  }

  const destDir = `src/${componentDir}`

  mkdirSync(destDir, { recursive: true })
  writeFileSync(`${destDir}/${demoName}.tsx`, demoContent)
}
