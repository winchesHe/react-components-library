import type { IncomingMessage } from 'node:http'
import * as path from 'node:path'
import url from 'node:url'
import launch from 'launch-editor'
import { ROOT } from './helpers/path'

export function launchEditorMiddleware() {
  return (req: IncomingMessage) => {
    if (req.url.includes('/__open-in-editor')) {
      // eslint-disable-next-line node/no-deprecated-api
      const { file } = url.parse(req.url, true).query || {}
      if (!file) {
        console.error(`launch-editor-middleware: required query param "file" is missing.`)
      }
      else {
        console.log('\x1B[96m%s\x1B[0m', `🚀 ~ launch ~ file: ${file}`)

        launch(path.resolve(ROOT, file as string), 'code', () => {
          console.error(`Unable to open ${file}`)
        })
      }
    }
  }
}
