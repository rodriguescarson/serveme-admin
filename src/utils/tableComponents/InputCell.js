import React, { memo } from 'react'
import { BaseCell } from './BaseCell'
export const InputCell = memo(({ rowData, data, value, onChange, ...props }) => {
  function handleChange(event) {
    onChange(rowData.id, event.target.value)
  }

  return (
    <BaseCell {...props}>
      <input value={data[rowData.id]} onChange={handleChange} />
    </BaseCell>
  )
})

InputCell.displayName = 'InputCell'
