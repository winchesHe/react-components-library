import dayjs from 'dayjs'
import type { RangeValue } from '../CalendarContext'
import type { CalendarDate, CalendarDayInfo, DisabledDate, StringifyDateParams } from './types'

export const HOVER_ITEM_CLASS = 'text-[#202020] border-[1px] border-[#F96B18] bg-[#FFF7F0] z-10'

export const emptyCalendarDay: CalendarDayInfo = {
  year: -1,
  month: -1,
  weekOfMonth: -1,
  day: -1,
  dayOfWeek: -1,
  relative: 'past',
  disabled: false,
}

export const ITEM_WIDTH = 44

export function daysEqual(
  a: CalendarDayInfo = {} as CalendarDayInfo,
  b: CalendarDayInfo = {} as CalendarDayInfo,
): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

export function orderDays(calendarDayList: CalendarDayInfo[]): CalendarDayInfo[] {
  return calendarDayList.sort((a, b) => (daysIsBefore(a, b) ? -1 : 1))
}

export function daysIsAfter(
  current: CalendarDayInfo = {} as CalendarDayInfo,
  target: CalendarDayInfo = {} as CalendarDayInfo,
): boolean {
  return calendarDayInfoToDayjs(current).isAfter(`${target.year}-${target.month + 1}-${target.day}`)
}

export function daysIsBefore(
  current: CalendarDayInfo = {} as CalendarDayInfo,
  target: CalendarDayInfo = {} as CalendarDayInfo,
): boolean {
  return calendarDayInfoToDayjs(current).isBefore(`${target.year}-${target.month + 1}-${target.day}`)
}

export function isEmptyCalendarDay(cal: CalendarDayInfo): boolean {
  return daysEqual(cal, emptyCalendarDay)
}

export function stringifyDate({ year, month, day, split = '-', prefixZero = true }: StringifyDateParams) {
  const realMonth = month + 1
  const yearStr = `${year}`
  const monthStr = prefixZero && realMonth < 10 ? `0${realMonth}` : `${realMonth}`
  const dayStr = day ? (prefixZero && day < 10 ? `0${day}` : `${day}`) : ''
  return [yearStr, monthStr, dayStr].filter(str => str.length).join(split)
}

export function stringifyCalendarDay(originDay: CalendarDayInfo, split = '-', prefixZero = true) {
  if (!originDay) {
    return ''
  }
  const { year, month, day } = originDay
  return stringifyDate({
    year,
    month,
    day,
    split,
    prefixZero,
  })
}

export function parseDate(str: string = '', split = '-') {
  const [year, month, day] = str.split(split).map(item => Number(item))
  return {
    year,
    month,
    day,
  }
}

/**
 * 填充 index 位置的值
 */
export function fillIndex<T extends any[]>(origin: T, index: number, value: T[number]): T {
  const clone = [...origin] as T
  clone[index] = value

  return clone
}

/**
 * 判断当前值是否在范围内
 */
export function isInRange(current: CalendarDayInfo, hoverRangeValue: RangeValue) {
  const [start, end] = hoverRangeValue

  if (!start || !end || !current) {
    return false
  }

  return daysIsAfter(current, start) && daysIsAfter(end, current)
}

export function isInStart(current: CalendarDayInfo, hoverRangeValue: RangeValue) {
  const [start] = hoverRangeValue

  if (!start || !current) {
    return false
  }

  return daysEqual(current, start)
}

export function isInEnd(current: CalendarDayInfo, hoverRangeValue: RangeValue) {
  const [, end] = hoverRangeValue

  if (!end || !current) {
    return false
  }

  return daysEqual(current, end)
}

export function calendarDayInfoToDayjs(dayInfo: CalendarDayInfo) {
  return dayjs(`${dayInfo.year}-${dayInfo.month + 1}-${dayInfo.day}`)
}

/**
 * @private
 */
export function getDayState(current: CalendarDayInfo, hoverRangeValue: RangeValue) {
  const isRange = isInRange(current, hoverRangeValue)
  const isStart = isInStart(current, hoverRangeValue)
  const isEnd = isInEnd(current, hoverRangeValue)

  const isPast = current.relative === 'past'
  const isNow = current.relative === 'now'

  // disabled:  过去的时间
  const isAvailable = !isPast
  const isDisabled = current.disabled

  return {
    isRange,
    isStart,
    isEnd,
    isPast,
    isNow,
    isDisabled,
    isAvailable,
  }
}

export function setDocumentStyle(key: string, value: string) {
  document.documentElement.style.setProperty(key, value)
}

export function getTimeInfo(time: CalendarDate) {
  const currentMonth = time.getMonth()
  const currentYear = time.getFullYear()

  return {
    year: currentYear,
    month: currentMonth,
  }
}

export type CalendarWeek = (CalendarDayInfo | null)[][]

/**
 * 按周排列生成日历
 * @example generateCalendarWeeks(2021, 1)
 * [
 *  [null, null, 1, 2, 3, 4, 5],
 *  [6, 7, 8, 9, 10, 11, 12],
 *  [13, 14, 15, 16, 17, 18, 19],
 *  [20, 21, 22, 23, 24, 25, 26],
 *  [27, 28, 29, 30, 31, null, null]
 * ]
 */
export function generateCalendarWeeks(year: number, month: number, disabledDate?: DisabledDate): CalendarWeek {
  const weeks = []
  const currentDate = new Date()
  const firstDateOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = firstDateOfMonth.getDay()
  const weekOfMonthLength = 35 - daysInMonth < firstDayOfMonth ? 6 : 5

  for (let weekOfMonth = 0; weekOfMonth < weekOfMonthLength; weekOfMonth++) {
    const week = []

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const day = weekOfMonth * 7 + dayOfWeek + 1 - firstDayOfMonth

      if (day > daysInMonth || day < 1) {
        week.push(null)
      }
      else {
        const relative = day === currentDate.getDate() ? 'now' : 'future'
        const currentDay = {
          year,
          month,
          weekOfMonth,
          day,
          dayOfWeek,
          relative,
        }
        const currentDayDate = new Date(year, month, day)
        const disabled = disabledDate?.(currentDayDate) || false
        week.push({
          ...currentDay,
          disabled,
        })
      }
    }

    weeks.push(week)
  }

  return weeks
}

export function getDateDetails(date: Date, disabledDate?: DisabledDate) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const dayOfWeek = date.getDay()

  // 计算月份中的周数
  const firstDayOfMonth = new Date(year, month, 1)
  const weekOfMonth = Math.ceil((day - 1 + firstDayOfMonth.getDay()) / 7)

  // 计算相对时间
  const now = new Date().getDate()
  let relative
  if (day < now) {
    relative = 'past'
  }
  else if (day > now) {
    relative = 'future'
  }
  else {
    relative = 'now'
  }

  const currentDay = {
    year,
    month,
    weekOfMonth,
    day,
    dayOfWeek,
    relative,
  }
  const currentDayDate = new Date(year, month, day)
  const disabled = disabledDate?.(currentDayDate) || false

  return {
    ...currentDay,
    disabled,
  }
}

export function getNextDate(currentYear: number, currentMonth: number) {
  if (currentMonth === 11) {
    return {
      nextMonth: 0,
      nextYear: currentYear + 1,
    }
  }

  return {
    nextMonth: currentMonth + 1,
    nextYear: currentYear,
  }
}

export function getPrevDate(currentYear: number, currentMonth: number) {
  if (currentMonth === 0) {
    return {
      prevMonth: 11,
      prevYear: currentYear - 1,
    }
  }

  return {
    prevMonth: currentMonth - 1,
    prevYear: currentYear,
  }
}

export function transformDayInfoToDate(day: CalendarDayInfo) {
  return new Date(day.year, day.month, day.day)
}

/**
 * 去除重复日期列表
 */
export function filterDateList(dateList: CalendarDate[]) {
  return [...new Set(dateList.map(d => d.getTime()))].map(d => new Date(d))
}

/**
 * 获取日历周列表，用于初始化
 */
export function getCalendarWeeks({
  researchRangeMonth,
  currentYear,
  currentMonth,
  disabledDate,
}: {
  currentYear: number
  currentMonth: number
  disabledDate?: DisabledDate
  researchRangeMonth: number
}) {
  let weeks = generateCalendarWeeks(currentYear, currentMonth, disabledDate)

  while (weeks.every(week => week.filter(Boolean).every(day => day?.disabled)) && researchRangeMonth-- > 0) {
    const { nextMonth, nextYear } = getNextDate(currentYear, currentMonth)
    weeks = generateCalendarWeeks(nextYear, nextMonth, disabledDate)
    currentMonth = nextMonth
    currentYear = nextYear
  }

  return {
    weeks,
    currentYear,
    currentMonth,
  }
}
