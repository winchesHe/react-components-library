import React, { forwardRef, memo } from 'react'

export interface TestProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Test = memo(
  forwardRef<HTMLDivElement, TestProps>((props, forwardedRef) => {
    return (
      <div ref={forwardedRef}>
        <h1 className="w-[200px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, non dolores consequatur nesciunt ab vitae
          tempora quisquam rem. Veniam ratione aliquam placeat magni sed harum earum consectetur quos totam veritatis.
        </h1>
      </div>
    )
  }),
)

Test.displayName = 'Test'

export default Test
