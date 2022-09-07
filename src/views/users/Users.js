import React, { memo, useEffect } from 'react'
import {
  IconButton,
  ButtonToolbar,
  ButtonGroup,
  FlexboxGrid,
  Form,
  Button,
  Input,
  Modal,
  SelectPicker,
  Uploader,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import { faker } from '@faker-js/faker'
import { db } from '../../firebase'

//cell imports
import {
  ActionCell,
  BaseCell,
  CheckCell,
  DeleteCell,
  EditableCell,
  ImageCell,
  InputCell,
} from '../../utils/tableComponents'

const selectDataState = ['Goa', 'Karnataka', 'Maharshtra'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataDistrict = ['South-Goa', 'North-Goa'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataCity = ['Panjim', 'Margao'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataCountry = ['India', 'USA'].map((item) => ({
  label: item,
  value: item,
}))

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />)
Textarea.displayName = 'Textarea'

const Users = () => {
  //table states
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState(createRows())
  //delete states
  const [deleteUserModal, setDeleteUserModal] = React.useState(false)
  const handleCloseDeleteModal = () => setDeleteUserModal(false)
  const [deleteId, setDeleteId] = React.useState()
  // add states
  const [open, setOpen] = React.useState(false)
  const [formValue, setFormValue] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    'add-1': '',
    'add-2': '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    district: '',
  })

  // table functions
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
  // end of table functions

  // posting data to firebase
  useEffect(() => {
    if (formValue.firstName !== '') {
      db.collection('serveme-users')
        .doc()
        .set(formValue)
        .then(() => {
          console.log('Document successfully written!')
        })
    }
  }, [formValue])

  // setting states for delete
  const handleShowDeleteModal = (id) => {
    setDeleteUserModal(true)
    setDeleteId(id)
  }

  // handle states for add
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  // retrieving data from firebase
  async function createRows() {
    // const rows = []
    // for (let i = 0; i < 100; i++) {
    //   rows.push({
    //     id: i,
    //     name: faker.name.firstName(),
    //     email: faker.internet.email(),
    //     phone: faker.phone.number(),
    //     state: faker.address.state(),
    //     district: faker.address.city(),
    //     city: faker.address.city(),
    //     country: faker.address.country(),
    //     status: 'VIEW',
    //   })
    // }
    // return rows
    const docsArr = (db, collectionName) => {
      return db
        .collection(collectionName)
        .get()
        .then((snapshot) =>
          snapshot.docs.map((x) => {
            // id is the document id
            console.log(x.id)
            return { id: x.id, ...x.data() }
          }),
        )
    }
    ;(async () => {
      const arr = await docsArr(db, 'user')
      setData(arr)
    })()
  }

  //change this - update data in firebase
  const handleChange = (id, key, value) => {
    db.collection('user')
      .doc(id)
      .update({ [key]: value })
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
  }

  //change this - edit data from firebase
  const handleEditState = (id) => {
    const nextData = Object.assign([], data)
    const activeItem = nextData.find((item) => item.id === id)
    activeItem.status = activeItem.status ? null : 'EDIT'
    setData(nextData)
  }
  //change this - delete from firebase
  const handleDeleteState = (id) => {
    // delete data[id]
    //
    console.log(id)
    setData(data.filter((item) => item.id !== id))
  }
  return (
    <>
      {/* add new user button */}
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormValue} formValue={formValue}>
            <Form.Group controlId="uploader">
              <Form.ControlLabel>Profile Picture:</Form.ControlLabel>
              <Form.Control name="uploader" accepter={Uploader} action="#" />
            </Form.Group>
            <Form.Group controlId="firstName-9">
              <Form.ControlLabel>First Name</Form.ControlLabel>
              <Form.Control name="firstName" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="lastName-9">
              <Form.ControlLabel>Last Name</Form.ControlLabel>
              <Form.Control name="lastName" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="email-9">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="contactNumber-9">
              <Form.ControlLabel>contactNumber</Form.ControlLabel>
              <Form.Control name="contactNumber" type="number" />
            </Form.Group>
            {/* <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group> */}
            <Form.Group controlId="add-1-9">
              <Form.ControlLabel>Address 1</Form.ControlLabel>
              <Form.Control name="add-1" type="text" />
            </Form.Group>
            <Form.Group controlId="add-2-9">
              <Form.ControlLabel>Address 2</Form.ControlLabel>
              <Form.Control name="add-2" type="text" />
            </Form.Group>
            <Form.Group controlId="pincode-9">
              <Form.ControlLabel>Pincode</Form.ControlLabel>
              <Form.Control name="pincode" type="number" />
            </Form.Group>
            <Form.Group controlId="state-10">
              <Form.ControlLabel>State</Form.ControlLabel>
              <Form.Control name="state" data={selectDataState} accepter={SelectPicker} />
            </Form.Group>
            <Form.Group controlId="district-10">
              <Form.ControlLabel>District</Form.ControlLabel>
              <Form.Control name="district" data={selectDataDistrict} accepter={SelectPicker} />
            </Form.Group>
            <Form.Group controlId="city-10">
              <Form.ControlLabel>City</Form.ControlLabel>
              <Form.Control name="city" data={selectDataCity} accepter={SelectPicker} />
            </Form.Group>
            <Form.Group controlId="country-10">
              <Form.ControlLabel>Country</Form.ControlLabel>
              <Form.Control name="country" data={selectDataCountry} accepter={SelectPicker} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <FlexboxGrid justify="end" style={{ marginBottom: 10 }}>
        <FlexboxGrid.Item colspan={2}>
          <IconButton icon={<PlusIcon />} color="red" appearance="primary" onClick={handleOpen}>
            Add
          </IconButton>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {/* end of add new user button */}
      {/* table */}
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
        onRowClick={(data) => {
          console.log(data)
        }}
        affixHorizontalScrollbar
      >
        <Column width={50} align="center" sortable>
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

        <Column width={70} align="center" fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column width={130} fixed>
          <HeaderCell>Avatar</HeaderCell>
          <ImageCell dataKey="avatar" />
        </Column>
        <Column width={100} sortable>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Email</HeaderCell>
          <EditableCell dataKey="email" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>contactNumber</HeaderCell>
          <EditableCell dataKey="contactNumber" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Address 1</HeaderCell>
          <EditableCell dataKey="add_1" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Address 2</HeaderCell>
          <EditableCell dataKey="add_2" onChange={handleChange} />
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

      {/* Delete Modal */}
      <Modal open={deleteUserModal} onClose={handleCloseDeleteModal}>
        <Modal.Header>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleDeleteState(deleteId)
              handleCloseDeleteModal()
            }}
            appearance="primary"
          >
            Confirm
          </Button>
          <Button onClick={handleCloseDeleteModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default Users
