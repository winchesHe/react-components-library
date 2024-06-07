import { useRef } from 'react'

export type LatestCallback<F extends (...args: any[]) => any> = F & {
  fn: F
}

export function useLatestCallback<F extends (...args: any[]) => any>(fn: F): LatestCallback<F> {
  const cb = useRef<LatestCallback<F>>()
  if ('fn' in fn) {
    return fn as any
  }
  if (!cb.current) {
    cb.current = Object.assign<any, any>((...args: any[]) => cb.current!.fn(...args), { fn })
  }
  else if (cb.current.fn !== fn) {
    cb.current.fn = fn
  }
  return cb.current!
}
