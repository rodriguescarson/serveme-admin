import React from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import {
  ActionCell,
  CheckCell,
  DeleteCell,
  EditableCell,
  ImageCell,
} from '../../utils/tableComponents'
function UserTable({
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
}) {
  const TableParams = [
    {
      value: 'Full name',
      width: 100,
      dataKey: 'full_name',
    },
    {
      value: 'Email',
      width: 200,
      dataKey: 'email',
    },
    {
      value: 'Contact Number',
      width: 200,
      dataKey: 'contact_no',
    },
    {
      value: 'Address 1',
      width: 200,
      dataKey: 'add_l1',
    },
    {
      value: 'Address 2',
      width: 200,
      dataKey: 'add_l2',
    },
    {
      value: 'Pincode',
      width: 200,
      dataKey: 'pincode',
    },
    {
      value: 'District',
      width: 200,
      dataKey: 'district',
    },
    {
      value: 'City',
      width: 200,
      dataKey: 'city',
    },
    {
      value: 'State',
      width: 200,
      dataKey: 'state',
    },
    {
      value: 'Country',
      width: 200,
      dataKey: 'country',
    },
  ]
  return (
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
      <Column width={130} fixed>
        <HeaderCell>Avatar</HeaderCell>
        <ImageCell dataKey="avatar_url" />
      </Column>

      <Column width={100} sortable onChange={handleChange}>
        <HeaderCell>Full Name</HeaderCell>
        <EditableCell dataKey="full_name" onChange={handleChange} />
      </Column>
      <Column width={200} sortable onChange={handleChange}>
        <HeaderCell>Email</HeaderCell>
        <EditableCell dataKey="email" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>contactNumber</HeaderCell>
        <EditableCell dataKey="contact_no" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>Address 1</HeaderCell>
        <EditableCell dataKey="add_l1" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>Address 2</HeaderCell>
        <EditableCell dataKey="add_l2" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>Pincode</HeaderCell>
        <EditableCell dataKey="pincode" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>District</HeaderCell>
        <EditableCell dataKey="district" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>City</HeaderCell>
        <EditableCell dataKey="city" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>State</HeaderCell>
        <EditableCell dataKey="state" onChange={handleChange} />
      </Column>
      <Column width={200} sortable>
        <HeaderCell>Country</HeaderCell>
        <EditableCell dataKey="country" onChange={handleChange} />
      </Column>

      <Column width={200}>
        <HeaderCell>Edit</HeaderCell>
        <ActionCell dataKey="id" onClick={handleEditState} />
      </Column>
      <Column width={200}>
        <HeaderCell>Delete</HeaderCell>
        <DeleteCell dataKey="id" onClick={handleShowDeleteModal} />
      </Column>
    </Table>
  )
}

export default UserTable
