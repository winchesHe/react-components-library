export type CalendarDate = Date

export interface CalendarDayInfo {
  year: number
  month: number
  weekOfMonth: number
  day: number
  dayOfWeek: number
  relative: string
  disabled: boolean
}

export type CurrentDay = Omit<CalendarDayInfo, 'disabled'>

export interface CalendarDays {
  calendarWeeks: Date[][]
  today?: Date
}

export interface StringifyDateParams {
  year: number
  month: number
  day?: number
  split?: string
  prefixZero?: boolean
}

export type DisabledDate = (day: CalendarDate) => boolean
