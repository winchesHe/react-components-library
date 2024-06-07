import path from 'node:path'
import type { RspressPlugin } from '@rspress/shared'
import { remarkPropsTable } from './helpers/props-table'

export function pluginGenerateProps(): RspressPlugin {
  const componentPath = path.join(__dirname, 'helpers/Props.tsx')

  return {
    // 插件名称
    name: 'generate-props',
    markdown: {
      globalComponents: [componentPath],
      remarkPlugins: [remarkPropsTable],
    },
  }
}
