import { throttle } from 'lodash'
import { useLayoutEffect, useState } from 'react'
import { useLatestCallback } from './useLatestCallback'

export function useObserverWidth(ref: React.RefObject<HTMLElement>, delay = 50) {
  const [elementWidth, setElementWidth] = useState(0)

  const trigger = useLatestCallback(
    throttle((ele: HTMLElement) => {
      setElementWidth(ele.offsetWidth)
    }, delay),
  )

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const observer
      = 'ResizeObserver' in window
        ? new ResizeObserver(() => {
          trigger(ref.current!)
        })
        : null

    observer?.observe(ref.current)

    // initial check
    trigger(ref.current)

    return () => {
      // disconnect
      observer?.disconnect()
    }
  }, [ref])

  return elementWidth
}
