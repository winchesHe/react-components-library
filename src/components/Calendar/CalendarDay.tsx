import { memo, useContext, useState } from 'react'
import { cn, isMobile } from '../../../helper/index.ts'
import { getDayState } from './base/utils'
import { CalendarContext } from './CalendarContext'
import type { CalendarDayItemProps } from './CalendarDayItem'

export interface CalendarDayProps extends CalendarDayItemProps {
  rangeClassName?: string
}

export const CalendarDay = memo<CalendarDayProps>((props) => {
  const { day, dayKey, disabled, className, rangeClassName, onHover, onClick } = props

  const { hoverRangeValue } = useContext(CalendarContext)
  const { isRange } = getDayState(day, hoverRangeValue)

  const [isHover, setIsHover] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick(event, day)
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onHover(event, day)
    // mobile 不设置 hover 状态
    !isMobile() && setIsHover(true)
  }

  return (
    <div className={cn('relative', rangeClassName)}>
      <button
        data-day-key={dayKey}
        key={dayKey}
        className={cn(
          'flex relative w-[44px] h-[44px] flex-col justify-center items-center rounded-full',
          className,
          isHover && !isRange && 'bg-[#FFF7F0] text-\[\#202020\]',
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHover(false)}
        disabled={disabled}
      >
        <span className="relative z-10">{day?.day}</span>
      </button>
    </div>
  )
})

CalendarDay.displayName = 'CalendarDay'
