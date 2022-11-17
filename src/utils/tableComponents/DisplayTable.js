import React from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import {
  ActionCell,
  DeleteCell,
  EditableCell,
  ImageCell,
  DeleteModal,
} from '../../utils/tableComponents'
import DropDownCell from './DropDownCell'
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
  wordWrapToggle,
}) {
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
        wordWrap={wordWrapToggle ? 'break-word' : false}
      >
        {TableParams.map((item, i) => {
          if (item.isId) {
            return (
              <Column key={i} width={item.width} sortable resizable>
                <HeaderCell>{item.value}</HeaderCell>
                <Cell dataKey={item.dataKey} />
              </Column>
            )
          }
          if (item.isAvatar) {
            return (
              <Column key={i} width={item.width} resizable>
                <HeaderCell>{item.value}</HeaderCell>
                <ImageCell dataKey="avatar_url" />
              </Column>
            )
          }
          if (item.isDropDown) {
            return (
              <Column key={i} width={item.width} resizable>
                <HeaderCell>{item.value}</HeaderCell>
                <DropDownCell
                  dataKey={item.dataKey}
                  onChange={handleUpdateFirebase}
                  data={item.data}
                  showPopover={item.showPopover}
                />
              </Column>
            )
          }
          return (
            <Column key={i} resizable sortable onChange={handleUpdateFirebase}>
              <HeaderCell>{item.value}</HeaderCell>
              <EditableCell dataKey={item.dataKey} onChange={handleUpdateFirebase} />
            </Column>
          )
        })}
        <Column>
          <HeaderCell>Edit</HeaderCell>
          <ActionCell dataKey="id" onClick={handleEditState} />
        </Column>
        <Column>
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
