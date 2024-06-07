import { useRef } from 'react'
import { Tooltip } from './Tooltip'

export interface PropsOptions {
  src: string
  hideJumpButton: boolean
  hideCopyButton: boolean
  component: string
}

function copy(valueToCopy: string) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(valueToCopy)
  }
}

export function Props(props: PropsOptions) {
  const { src, hideJumpButton = false, hideCopyButton = false } = props
  const textRef = useRef<HTMLAnchorElement>(null)

  const handleClick = () => {
    // window.open(`${DOCS}/${src}`);
    fetch(`/__open-in-editor?file=${src}`).then(
      () => console.log(`%c🚀 ~ launch ~ file: ${src}`, 'color: cyan'),
      () => console.error(`Unable to open: ${src}`),
    )
  }

  const handleCopyClick = () => {
    copy(src)
  }

  return (
    <>
      {hideJumpButton && hideCopyButton
        ? null
        : (
          <div style={{ display: 'flex', gap: '20px' }}>
            {!hideJumpButton && (
              <button className="btn-color-box btn-back cursor-pointer" onClick={handleClick}>
                <a>跳转到源码</a>
              </button>
            )}
            {!hideCopyButton && (
              <Tooltip content="复制成功">
                <button className="btn-color-box btn-back cursor-pointer" onClick={handleCopyClick}>
                  <a ref={textRef}>复制文件路径</a>
                </button>
              </Tooltip>
            )}
          </div>
          )}
    </>
  )
}

export default Props
