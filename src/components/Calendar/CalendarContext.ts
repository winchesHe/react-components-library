import { createContext } from 'react'
import type { CalendarDayInfo } from './base/types'
import type { Mode } from './Calendar'

export type RangeValue = CalendarDayInfo[]

export const enum ActiveIndex {
  START = 0,
  END = 1,
}

interface CalendarContextType {
  hoverRangeValue: RangeValue
  activeIndex: ActiveIndex
  calendarValue: RangeValue
  isRange: boolean
  mode: Mode
  setCalendarValue: (value: RangeValue) => void
  setActiveIndex: (index: ActiveIndex) => void
  setIsRange: (value: boolean) => void
  setHoverRangeValue: (value: RangeValue) => void
}

export const CalendarContext = createContext<CalendarContextType>({} as CalendarContextType)
