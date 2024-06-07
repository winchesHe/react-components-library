import { existsSync } from 'node:fs'
import * as docgen from 'react-docgen-typescript'
import { visit } from 'unist-util-visit'
import { resolver } from '../helpers/path'
import type { PropsOptions } from './Props'

const options: docgen.ParserOptions = {
  savePropValueAsString: false,
  propFilter: {
    skipPropsWithoutDoc: false,
  },
}

interface NodeAttributes {
  name: keyof PropsOptions
  value: string
}

export function remarkPropsTable() {
  return (tree) => {
    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (node.name === 'Props') {
        const src = node.attributes.find((attr: NodeAttributes) => attr.name === 'src')?.value

        if (!src) {
          return
        }

        const component = node.attributes.find((attr: NodeAttributes) => attr.name === 'component')?.value

        const codeSrc = resolver(src)

        if (existsSync(codeSrc)) {
          const componentsMetaJson = component
            ? docgen
              .parse(codeSrc, options)
              .find(c =>
                c.displayName.toLocaleLowerCase().includes(component.replace('.mdx', '').toLocaleLowerCase()),
              )
            : docgen.parse(codeSrc, options)[0]

          if (componentsMetaJson) {
            const isOverLength = Object.keys(componentsMetaJson.props).length >= 20

            const markdown = generateTable(componentsMetaJson, isOverLength)

            if (markdown) {
              parent.children.push(markdown)
            }
          }
        }
      }
    })
  }
}

interface Prop {
  defaultValue: unknown
  description: string
  name: string
  required: boolean
  type: {
    name: string
  }
}

interface ComponentMetadata {
  displayName: string
  props: Record<string, Prop>
}

const baseHTMLAttributesRegex = /aria-*|data-*|tabIndex|role/
const attributesRegex
  = /^on[A-Z]|dir|draggable|hidden|id|lang|nonce|slot|spellCheck|style|title|translate|autoCapitalize|autoCorrect|autoSave|itemProp|itemScope|itemType|itemID|itemRef|itemGroup|itemValue|about|inlist|content|prefix|property|rel|resource|vocab|rev|typeof|color|results|security|unselectable|is|inputMode|dangerouslySetInnerHTML|defaultChecked|defaultValue|suppressContentEditableWarning|suppressHydrationWarning|accessKey|contextMenu|autoFocus|radioGroup/

function generateTable(metadata: ComponentMetadata, isOverLength: boolean) {
  const table = {
    type: 'table',
    align: ['left', 'center', 'center', 'center'],
    children: [
      {
        type: 'tableRow',
        children: [
          { type: 'tableCell', children: [{ type: 'text', value: 'Property' }] },
          { type: 'tableCell', children: [{ type: 'text', value: 'Type' }] },
          { type: 'tableCell', children: [{ type: 'text', value: 'Required' }] },
          { type: 'tableCell', children: [{ type: 'text', value: 'Description' }] },
        ],
      },
      ...Object.entries(metadata.props)
        .map(([propName, prop]) => {
          if (isOverLength) {
            // 过滤掉没有描述的 HTML 属性，和基础的HTML属性
            if ((!prop.description && attributesRegex.test(prop.name)) || baseHTMLAttributesRegex.test(prop.name)) {
              return null
            }
          }

          return {
            type: 'tableRow',
            children: [
              { type: 'tableCell', children: [{ type: 'strong', children: [{ type: 'text', value: propName }] }] },
              { type: 'tableCell', children: [{ type: 'inlineCode', value: prop.type.name }] },
              { type: 'tableCell', children: [{ type: 'inlineCode', value: prop.required ? 'Yes' : 'No' }] },
              { type: 'tableCell', children: [{ type: 'text', value: prop.description.replace(/@/g, '') || '-' }] },
            ],
          }
        })
        .filter(Boolean),
    ],
  }

  return table
}
