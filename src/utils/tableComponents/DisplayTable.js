import React from 'react'
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
  getData,
  sortColumn,
  sortType,
  handleSortColumn,
  loading,
  handleCheckAll,
  checkedKeys,
  handleCheck,
  handleChange,
  handleEditState,
  handleShowDeleteModal,
  data,
  TableParams,
  modalStatus,
  handleCloseDeleteModal,
  handleDeleteState,
  deleteId,
}) {
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
        <Column width={50} align="center" sortable fixed>
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: '40px' }}>
              <input
                type="checkbox"
                onChange={handleCheckAll}
                checked={checkedKeys.length === data.length}
              />
            </div>
          </HeaderCell>
          <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
        </Column>

        <Column width={70} fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        {TableParams.map((item, i) => {
          return !item.isAvatar ? (
            <Column key={i} width={item.width} sortable onChange={handleChange}>
              <HeaderCell>{item.value}</HeaderCell>
              <EditableCell dataKey={item.dataKey} onChange={handleChange} />
            </Column>
          ) : (
            <Column width={item.width} fixed>
              <HeaderCell>{item.value}</HeaderCell>
              <ImageCell dataKey="avatar_url" />
            </Column>
          )
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
        handleDeleteState={handleDeleteState}
        deleteId={deleteId}
      />
    </>
  )
}

export default DisplayTable
