import type { CalendarProps, Mode } from './Calendar'
import { Calendar as CalendarInner } from './Calendar'
import { CalendarDay } from './CalendarDay'
import { CalendarDayItem } from './CalendarDayItem'

export * from './base/data'
export * from './base/types'
export * from './base/utils'
export * from './CalendarDayItem'
export * from './CalendarDay'
export * from './CalendarContext'
export * from './Calendar'

type CalendarPropsWithRef<M extends Mode = Mode> = CalendarProps<M> & React.RefAttributes<HTMLDivElement>
type ExtractCalendar<T extends CalendarPropsWithRef, M extends Mode = Mode> = T extends any
  ? CalendarPropsWithRef<M>
  : never

export const Calendar = CalendarInner as unknown as (<T extends CalendarPropsWithRef = CalendarPropsWithRef>(
  props: T extends { mode: infer M extends Mode } ? ExtractCalendar<T, M> : T,
) => JSX.Element) & {
  DayItem: typeof CalendarDayItem
  Day: typeof CalendarDay
  displayName: string
}

Calendar.DayItem = CalendarDayItem
Calendar.Day = CalendarDay
