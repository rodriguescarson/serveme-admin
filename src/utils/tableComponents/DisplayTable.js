import React, { useState } from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import {
  ActionCell,
  CheckCell,
  DeleteCell,
  EditableCell,
  ImageCell,
  DeleteModal,
} from '../../utils/tableComponents'
function DisplayTable({
  handleUpdateFirebase,
  handleEditState,
  handleShowDeleteModal,
  data,
  TableParams,
  modalStatus,
  handleCloseDeleteModal,
  handleDeleteFirebase,
  deleteId,
}) {
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return data
  }
  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSortColumn(sortColumn)
      setSortType(sortType)
    }, 500)
  }

  const handleCheckAll = React.useCallback((event) => {
    const checked = event.target.checked
    const keys = checked ? data.map((item) => item.id) : []
    setCheckedKeys(keys)
  }, [])

  const handleCheck = React.useCallback(
    (event) => {
      const checked = event.target.checked
      const value = +event.target.value
      const keys = checked ? [...checkedKeys, value] : checkedKeys.filter((item) => item !== value)

      setCheckedKeys(keys)
    },
    [checkedKeys],
  )
  return (
    <>
      <Table
        virtualized
        height={600}
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        headerHeight={50}
        bordered
        cellBordered
        affixHorizontalScrollbar
      >
        {TableParams.map((item, i) => {
          if (!item.isId) {
            return !item.isAvatar ? (
              <Column key={i} width={item.width} sortable onChange={handleUpdateFirebase}>
                <HeaderCell>{item.value}</HeaderCell>
                <EditableCell dataKey={item.dataKey} onChange={handleUpdateFirebase} />
              </Column>
            ) : (
              <Column key={i} width={item.width} fixed>
                <HeaderCell>{item.value}</HeaderCell>
                <ImageCell dataKey="avatar_url" />
              </Column>
            )
          } else {
            return (
              <Column key={i} width={item.width} fixed sortable>
                <HeaderCell>{item.value}</HeaderCell>
                <Cell dataKey={item.dataKey} />
              </Column>
            )
          }
        })}
        <Column width={200}>
          <HeaderCell>Edit</HeaderCell>
          <ActionCell dataKey="id" onClick={handleEditState} />
        </Column>
        <Column width={200}>
          <HeaderCell>Delete</HeaderCell>
          <DeleteCell dataKey="id" onClick={handleShowDeleteModal} />
        </Column>
      </Table>
      <DeleteModal
        modalStatus={modalStatus}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteState={handleDeleteFirebase}
        deleteId={deleteId}
      />
    </>
  )
}

export default DisplayTable
