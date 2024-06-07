import { tv } from 'tailwind-variants'
import type { SlotsToClasses } from '../../../helper'
import { FLEX_ITEM_CENTER } from '../../../helper'

export const CalendarStyle = tv({
  slots: {
    base: [''],
    header: ['flex-between-center', 'flex-wrap'],
    headerItem: [
      FLEX_ITEM_CENTER,
      'min-h-min h-[24px]',
      'rounded-full',
      'text-content',
      'border-solid border-[1px] border-gray-300',
      'disabled:text-[rgba(31,41,55,0.2)]',
      'flex items-center justify-center',
    ],
    content: ['transition-all duration-200 ease-in-out'],
    contentHeader: [
      'flex-between-center relative',
      'text-text-secondary text-[12px] leading-[16px]',
      'mt-[21px]',
      'child:text-center child:w-[44px]',
      'uppercase',
    ],
    contentCalendar: ['space-y-[12px] mt-[20px]', 'overflow-hidden'],
  },
})

export type CalendarClassNames = SlotsToClasses<keyof ReturnType<typeof CalendarStyle>>
