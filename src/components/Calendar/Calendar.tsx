import type {
  ComponentType,
  HTMLAttributes,
} from 'react'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn, useObserverWidth } from '../../../helper/index.ts'
import type { CalendarDate, CalendarDayInfo, DisabledDate } from './base/types'
import type {
  CalendarWeek,
} from './base/utils'
import {
  ITEM_WIDTH,
  daysEqual,
  fillIndex,
  filterDateList,
  generateCalendarWeeks,
  getCalendarWeeks,
  getDateDetails,
  getNextDate,
  getPrevDate,
  orderDays,
  stringifyCalendarDay,
  transformDayInfoToDate,
} from './base/utils'
import type { CalendarClassNames } from './Calendar.style'
import { CalendarStyle } from './Calendar.style'
import type { RangeValue } from './CalendarContext.ts'
import { ActiveIndex, CalendarContext } from './CalendarContext.ts'
import { CalendarDay } from './CalendarDay.tsx'
import type { CalendarDayItemProps } from './CalendarDayItem.tsx'
import { CalendarDayItem } from './CalendarDayItem.tsx'
import { monthNames, weekDayNames } from './base/data.ts'

export interface OnDayHoverData {
  day: CalendarDate
  activeIndex: number
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
}

export type RangeDayList = [CalendarDate, CalendarDate]
export type MultipleDayList = CalendarDate[]

type ExtractDayChange<M extends Mode = Mode> = M extends 'single' ? CalendarDate : CalendarDate[]

export interface BaseCalendarProps<M extends Mode = Mode> {
  /**
   * The day hover event.
   * @param day
   * @param activeIndex
   * @param event
   */
  onDayHover?: (hoverData: OnDayHoverData) => unknown
  /**
   * The day value change event.
   * @param day
   * @param dayList
   */
  onDayChange?: (day: ExtractDayChange<M>) => unknown
  /**
   * The day click event.
   * @param day
   * @param event
   */
  onDayClick?: (day: CalendarDate, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
  /**
   * The disabled date function.
   */
  disabledDate?: DisabledDate
}

export type Mode = 'single' | 'range' | 'multiple'

export interface CalendarProps<M extends Mode = Mode> extends BaseCalendarProps<M> {
  className?: string
  classNames?: CalendarClassNames
  /**
   * The mode of the date picker.
   * @default 'single'
   */
  mode?: M
  /**
   * The Calendar Values.
   * @default [currentDay]
   */
  value?: M extends 'single' ? CalendarDate : M extends 'range' ? RangeDayList : MultipleDayList
  /**
   * The today text of the date picker.
   * @default 'Today'
   */
  todayText?: string
  /**
   * Research range month, used to determine the range of available months, if current month all disabled.
   * @default 6
   */
  researchRangeMonth?: number
  /**
   * The item component of the date picker.
   * @default CalendarDayItem
   */
  item?: ComponentType<CalendarDayItemProps>
  /**
   * The transition component of the date picker header text.
   */
  transitionText?: React.MemoExoticComponent<any> | React.ForwardRefExoticComponent<any> | ComponentType<any>
  /**
   * The transition component of the date picker content.
   */
  transitionSection?: React.MemoExoticComponent<any> | React.ForwardRefExoticComponent<any> | ComponentType<any>
}

export const Calendar = memo(
  forwardRef<HTMLDivElement, CalendarProps>((props, forwardedRef) => {
    const {
      className,
      classNames,
      researchRangeMonth = 6,
      onDayChange,
      onDayHover,
      onDayClick,
      disabledDate,
      value,
      mode = 'single',
      todayText = 'Today',
      transitionText: TransitionText,
      transitionSection: TransitionSection,
      item: Item = CalendarDayItem,
      ...CalendarProps
    } = props

    const CalendarRef = useRef<HTMLDivElement>(null)

    const elementWidth = useObserverWidth(CalendarRef)

    const today = getDateDetails(new Date(), disabledDate)
    const [currentMonth, setCurrentMonth] = useState(today.month)
    const [currentYear, setCurrentYear] = useState(today.year)

    const [hoverRangeValue, setHoverRangeValue] = useState<RangeValue>([])
    const [activeIndex, setActiveIndex] = useState(ActiveIndex.START)
    const [isRange, setIsRange] = useState(false)

    const transformDayList = useMemo(() => {
      const filterValue = [value].flat().filter(Boolean)
      if (!value || (Array.isArray(value) && !value.length)) {
        return []
      }
      if (mode === 'single') {
        return [value]
      }
      else if (mode === 'range') {
        // 当 rangeValue 两个都相同时只留一个
        return filterDateList(filterValue as RangeDayList)
      }
      return filterValue
    }, [mode, value]) as MultipleDayList

    const [calendarValue, setCalendarValue] = useState<RangeValue>([])

    const title = `${monthNames[currentMonth]} ${currentYear}`

    const defaultCalendarWeeks = useMemo(
      () => generateCalendarWeeks(currentYear, currentMonth, disabledDate),
      [currentYear, currentMonth],
    )
    const [calendarWeeks, setCalendarWeeks] = useState(defaultCalendarWeeks)
    const calendarHeight = calendarWeeks.length * ITEM_WIDTH + (calendarWeeks.length - 1) * 12

    const slots = useMemo(() => CalendarStyle(), [])

    const setCalendarTime = (currentYear: number, currentMonth: number, weeks: CalendarWeek) => {
      setCalendarWeeks(weeks)
      setCurrentYear(currentYear)
      setCurrentMonth(currentMonth)
    }

    const resetCalendarValue = (day?: CalendarDayInfo) => {
      const value = day ? [day] : []
      setHoverRangeValue(value)
      setCalendarValue(value)
      setActiveIndex(ActiveIndex.END)
      setIsRange(false)
    }

    const onHover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: CalendarDayInfo) => {
      onDayHover?.({ day: transformDayInfoToDate(value), activeIndex, event })

      if (isRange || mode !== 'range') {
        return
      }
      // 排序后支持前后选择
      setHoverRangeValue(orderDays(value ? fillIndex(calendarValue, activeIndex, value) : []))
    }

    const handleSingleClick = useCallback(
      (day: CalendarDayInfo) => {
        const date = transformDayInfoToDate(day)
        if (daysEqual(day, calendarValue[0])) {
          // if the day is the same as the current day, equal cancel the selection.
          setCalendarValue([])
          onDayChange?.(mode === 'single' ? date : [date])
          return
        }
        setCalendarValue([day])
        onDayChange?.(mode === 'single' ? date : [date])
      },
      [calendarValue],
    )

    const handleRangeClick = useCallback(
      (day: CalendarDayInfo) => {
        if (daysEqual(day, calendarValue[0])) {
          // if the day is the same as the current day, equal cancel the selection.
          resetCalendarValue(day)
          onDayChange?.([transformDayInfoToDate(day)])
          return
        }
        else if (calendarValue.length === 2) {
          // if the day is before the current day or start new range then reset the selection.
          resetCalendarValue(day)
          onDayChange?.([transformDayInfoToDate(day)])
          return
        }

        setActiveIndex(activeIndex === ActiveIndex.START ? ActiveIndex.END : ActiveIndex.START)
        setIsRange(activeIndex !== ActiveIndex.START)

        const newCalendarValue = fillIndex(calendarValue, activeIndex, day)
        const orderedCalendarValue = orderDays(newCalendarValue)
        setCalendarValue(orderedCalendarValue)
        onDayChange?.(orderedCalendarValue.map(transformDayInfoToDate))
      },
      [calendarValue, activeIndex],
    )

    const handleMultipleClick = useCallback(
      (day: CalendarDayInfo) => {
        const equalDayIndex = calendarValue.findIndex(d => daysEqual(d, day))
        if (equalDayIndex !== -1) {
          // if the day is the same as the current day, equal cancel the selection.
          const newCalendarValue = [...calendarValue]
          newCalendarValue.splice(equalDayIndex, 1)

          setCalendarValue(newCalendarValue)
          onDayChange?.(newCalendarValue.map(transformDayInfoToDate))
          return
        }

        const sortCalendarValue = orderDays([...calendarValue, day])
        setCalendarValue(sortCalendarValue)
        onDayChange?.(sortCalendarValue.map(transformDayInfoToDate))
      },
      [calendarValue],
    )

    const modeHandleMap: Record<Mode, typeof handleSingleClick | typeof handleRangeClick | typeof handleMultipleClick>
      = {
        single: handleSingleClick,
        range: handleRangeClick,
        multiple: handleMultipleClick,
      }

    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, day: CalendarDayInfo) => {
      onDayClick?.(transformDayInfoToDate(day), event)

      modeHandleMap[mode](day)
    }

    const setToday = () => {
      if (today && !today.disabled) {
        const date = transformDayInfoToDate(today)
        resetCalendarValue(today)
        onDayChange?.(mode === 'single' ? date : [date])

        if (today.month !== currentMonth) {
          const weeks = generateCalendarWeeks(today.year, today.month, disabledDate)
          setCalendarTime(today.year, today.month, weeks)
        }
      }
      else {
        console.warn('Today is not available')
      }
    }

    const onNext = () => {
      const { nextMonth, nextYear } = getNextDate(currentYear, currentMonth)

      setCalendarTime(nextYear, nextMonth, generateCalendarWeeks(nextYear, nextMonth, disabledDate))
    }

    const onPrev = () => {
      const { prevMonth, prevYear } = getPrevDate(currentYear, currentMonth)

      setCalendarTime(prevYear, prevMonth, generateCalendarWeeks(prevYear, prevMonth, disabledDate))
    }

    // 当鼠标离开时，如果是 range 模式，且不是 range 状态，且只有一个值时，重置 hoverRangeValue
    const handleCalendarLeave = () => {
      if (mode === 'range' && !isRange && calendarValue.length === 1) {
        setHoverRangeValue(calendarValue)
      }
    }

    useEffect(() => {
      if (transformDayList.length) {
        const transformDateList = orderDays(transformDayList.map(d => getDateDetails(d)))

        setCalendarValue(transformDateList)

        // 初始化选中的日期
        if (mode === 'range') {
          setActiveIndex(transformDateList.length === 2 ? ActiveIndex.START : ActiveIndex.END)
          setIsRange(transformDateList.length === 2)
          setHoverRangeValue(transformDateList)
        }
      }
    }, [transformDayList])

    useEffect(() => {
      if (mode === 'range' && elementWidth) {
        const space = Math.floor((elementWidth - ITEM_WIDTH * 7) / 6)
        const rangeItemWidth = space + ITEM_WIDTH
        const prevTranslateX = Math.floor(space + ITEM_WIDTH / 2)
        const nextTranslateX = Math.floor(ITEM_WIDTH / 2)
        document.documentElement.style.setProperty('--date-picker-range-item-width', `${rangeItemWidth}px`)
        document.documentElement.style.setProperty('--date-picker-range-item-prev-translate-x', `-${prevTranslateX}px`)
        document.documentElement.style.setProperty('--date-picker-range-item-next-translate-x', `${nextTranslateX}px`)
      }
    }, [elementWidth, mode])

    useEffect(() => {
      const {
        currentMonth: nextMonth,
        currentYear: nextYear,
        weeks: nextWeeks,
      } = getCalendarWeeks({ currentYear, currentMonth, disabledDate, researchRangeMonth })

      setCalendarTime(nextYear, nextMonth, nextWeeks)
    }, [researchRangeMonth])

    // eslint-disable-next-line react/no-unstable-context-value
    const provideValue = {
      mode,
      hoverRangeValue,
      activeIndex,
      calendarValue,
      isRange,
      onHover,
      setActiveIndex,
      setCalendarValue,
      setIsRange,
      setHoverRangeValue,
    }

    const CalendarContent = (
      <>
        <div
          data-slot="date-picker-content-header"
          className={slots.contentHeader({ className: classNames?.contentHeader })}
        >
          {weekDayNames.map(day => (
            <span key={day}>{day[0]}</span>
          ))}
        </div>
        <div
          data-slot="date-picker-content-calendar"
          className={slots.contentCalendar({ className: classNames?.contentCalendar })}
          style={{ height: `${calendarHeight}px` }}
        >
          {calendarWeeks.map((week, weekIndex) => {
            return (
              <div className={cn('flex-between-center child:text-center')} key={weekIndex}>
                {week.map((day, index) => {
                  const dayKey = day ? stringifyCalendarDay(day) : `${weekIndex}-${index}`
                  return day
                    ? (
                      <Item
                        key={dayKey}
                        day={day}
                        nextDay={(week[index + 1] || {}) as CalendarDayInfo}
                        prevDay={(week[index - 1] || {}) as CalendarDayInfo}
                        dayList={transformDayList}
                        dayKey={dayKey}
                        resetCalendarValue={resetCalendarValue}
                        onHover={onHover}
                        onClick={onClick}
                      />
                      )
                    : (
                      <span key={index} className="w-[44px] h-[44px]"></span>
                      )
                })}
              </div>
            )
          })}
        </div>
      </>
    )

    return (
      <CalendarContext.Provider value={provideValue}>
        <div
          {...CalendarProps}
          ref={forwardedRef}
          data-slot="date-picker-base"
          className={slots.base({ className: cn(classNames?.base, className) })}
          onMouseLeave={handleCalendarLeave}
        >
          <div data-slot="date-picker-header" className={slots.header({ className: classNames?.header })}>
            <div className="min-w-[180px]">
              {title}
            </div>
            <div className="flex-center space-x-[8px]">
              <button
                type="button"
                data-slot="date-picker-header-item-prev"
                className={slots.headerItem({ className: cn('w-[24px]', classNames?.headerItem) })}
                onClick={onPrev}
              >
                {'<'}
              </button>
              <button
                type="button"
                data-slot="date-picker-header-item-next"
                className={slots.headerItem({ className: cn('w-[24px]', classNames?.headerItem) })}
                onClick={onNext}
              >
                {'>'}
              </button>
              <button
                type="button"
                data-slot="date-picker-header-item-today"
                className={slots.headerItem({
                  className: cn(classNames?.headerItem, 'px-[12px]'),
                })}
                disabled={today.disabled}
                onClick={setToday}
              >
                {todayText}
              </button>
            </div>
          </div>

          <div
            ref={CalendarRef}
            data-slot="date-picker-content"
            className={slots.content({ className: classNames?.content })}
            style={{ height: `${calendarHeight + 36}px` }}
          >
            {CalendarContent}
          </div>
        </div>
      </CalendarContext.Provider>
    )
  }),
)

Calendar.displayName = 'Calendar'
