import * as path from 'node:path'
import { pluginPreview } from '@rspress/plugin-preview'
import { defineConfig } from 'rspress/config'
import { pluginGenerateProps } from './plugins/generate-props'
import { launchEditorMiddleware } from './plugins/launch-editor'

export default defineConfig({
  root: path.join(__dirname, 'src'),
  title: 'libs-docs',
  description: 'Rspack-based Static Site Generator',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  markdown: {
    mdxRs: false,
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', mode: 'link', content: 'https://github.com/library/-client-libs' }],
  },
  plugins: [pluginPreview(), pluginGenerateProps()],
  globalStyles: path.join(__dirname, 'styles/index.css'),
  builderConfig: {
    server: {
      proxy: {
        '/__launch-editor': {
          target: 'http://localhost:8080',
          bypass: launchEditorMiddleware() as any,
        },
      },
    },
  },
})
