import React, { memo, useContext } from 'react'
import { cn } from '../../../helper/index.ts'
import type { CalendarDate, CalendarDayInfo } from './base/types'
import { HOVER_ITEM_CLASS, daysEqual, getDayState } from './base/utils'
import type { BaseCalendarProps } from './Calendar'
import { CalendarContext } from './CalendarContext'
import { CalendarDay } from './CalendarDay'

export interface CalendarDayItemProps extends Omit<BaseCalendarProps, 'onHover'> {
  day: CalendarDayInfo
  dayList: CalendarDate[]
  dayKey?: string
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  disabled?: boolean
  CalendarRef?: React.RefObject<HTMLDivElement>
  prevDay: CalendarDayInfo
  nextDay: CalendarDayInfo
  resetCalendarValue: () => unknown
  onHover: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, day: CalendarDayInfo) => unknown
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, day: CalendarDayInfo) => unknown
}

export const CalendarDayItem = memo((props: CalendarDayItemProps) => {
  const { day, nextDay } = props
  const { hoverRangeValue, calendarValue, mode } = useContext(CalendarContext)

  const { isAvailable, isDisabled, isEnd, isRange, isStart } = getDayState(day, hoverRangeValue)

  // selected:  可用、并且在 calendarValue 中
  const isSelected
    = isAvailable
    && calendarValue.find((d) => {
      return daysEqual(d, day)
    })

  if (mode !== 'range') {
    return (
      <CalendarDay
        {...props}
        className={cn(
          props.className,
          'disabled:bg-opacity-0 disabled:border-opacity-0 disabled:text-[#B4B4B4]',
          isSelected ? 'text-[#202020] border-[1px] border-[#F96B18] bg-[#FFF7F0]' : null,
        )}
        disabled={isDisabled}
      />
    )
  }

  const {
    isEnd: isNextEnd,
  } = getDayState(nextDay, hoverRangeValue)
  const isNextRenderRange = isRange
  const isPrevRenderRange = isRange

  return (
    <CalendarDay
      {...props}
      className={cn(
        props.className,
        'disabled:bg-opacity-0 disabled:border-opacity-0 disabled:text-[#B4B4B4]',
        isSelected || (calendarValue.length && (isStart || isEnd)) ? HOVER_ITEM_CLASS : null, // 当什么日期都没选中时，用默认的hover样式
      )}
      rangeClassName={cn(
        isRange ? 'text-white bg-[#F96B18]' : null,
        isNextRenderRange || (isNextEnd && isAvailable && (isRange || isStart)) ? 'date-picker-range-next' : null,
        isPrevRenderRange ? 'date-picker-range-prev' : null,
      )}
      disabled={isDisabled}
    />
  )
})

CalendarDayItem.displayName = 'CalendarDayItem'
