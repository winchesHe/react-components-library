import React, { forwardRef, memo, useEffect, useState } from 'react'

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  content: string
  value?: boolean
  onChange?: (value: boolean) => void
}

export const Tooltip = memo(
  forwardRef<HTMLDivElement, TooltipProps>((props, forwardedRef) => {
    const { value = false, content, children, onChange } = props
    let timer = null
    const [open, setOpen] = useState(value)

    const handleClick = () => {
      if (timer) {
        return
      }

      if ('value' in props) {
        onChange?.(!open)
        return
      }

      setOpen(!open)
      onChange?.(!open)
    }

    useEffect(() => {
      if (open) {
        timer = setTimeout(() => {
          setOpen(false)
        }, 1000)

        return () => {
          clearTimeout(timer)
        }
      }
    }, [open])

    if (!open) {
      return <div onClick={handleClick}>{children}</div>
    }

    return (
      <div ref={forwardedRef} className="tooltip tooltip-open" data-tip={content} onClick={handleClick}>
        {children}
      </div>
    )
  }),
)

Tooltip.displayName = 'Tooltip'
