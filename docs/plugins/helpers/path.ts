import { resolve } from 'node:path'

export const ROOT = resolve(__dirname, '../../..')
export const resolver = (path: string) => resolve(ROOT, path)
