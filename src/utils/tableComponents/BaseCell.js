import React from 'react'
import { Cell } from 'rsuite-table'
export const BaseCell = React.forwardRef((props, ref) => {
  const { children, rowData, ...rest } = props
  return (
    <Cell
      ref={ref}
      rowData={rowData}
      onDoubleClick={() => {
        console.log(rowData)
      }}
      {...rest}
    >
      {children}
    </Cell>
  )
})
BaseCell.displayName = 'BaseCell'
