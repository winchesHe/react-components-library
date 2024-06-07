import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'tailwind-variants'

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
}

export function cn(...args: classNames.ArgumentArray | ClassValue[]) {
  return twMerge(classNames(...(args as classNames.ArgumentArray)))
}

export const FLEX_ITEM_CENTER = 'flex items-center'
