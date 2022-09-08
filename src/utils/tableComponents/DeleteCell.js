import React from 'react'
import { Cell } from 'rsuite-table'
import { Button } from 'rsuite'
export const DeleteCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.id)
        }}
      >
        {'Delete'}
      </Button>
    </Cell>
  )
}
