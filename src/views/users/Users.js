//remains same
import React, { memo, useEffect } from 'react'
import {
  IconButton,
  ButtonToolbar,
  ButtonGroup,
  FlexboxGrid,
  Form,
  Schema,
  Button,
  Input,
  Modal,
  SelectPicker,
  Uploader,
  Message,
  useToaster,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import { faker } from '@faker-js/faker'
import { getDatabase, ref, set, child, push, update, get, remove } from 'firebase/database'
import { getAuth } from 'firebase/auth'
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
import { auth, createUserWithEmailAndPassword } from 'firebase/auth'

// change according to your needs
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

// change form validation according to your needs
const model = Schema.Model({
  firstName: Schema.Types.StringType().isRequired('This field is required.'),
  lastName: Schema.Types.StringType().isRequired('This field is required.'),
  email: Schema.Types.StringType().isEmail('Please enter a valid email address.'),
  contactNumber: Schema.Types.StringType().isRequired('This field is required.'),
  password: Schema.Types.StringType().isRequired('This field is required.').maxLength(6),
})
// no changes
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />)
Textarea.displayName = 'Textarea'

const TextField = ({ cid, name, label, accepter, ...rest }) => (
  <Form.Group controlId={cid}>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control name={name} accepter={accepter} {...rest} />
  </Form.Group>
)

const Users = () => {
  //table states
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  //delete states
  const [deleteUserModal, setDeleteUserModal] = React.useState(false)
  const handleCloseDeleteModal = () => setDeleteUserModal(false)
  const [deleteId, setDeleteId] = React.useState()
  // add states
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  ///change
  const [formValue, setFormValue] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    'add-1': '',
    'add-2': '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    district: '',
  })
  const toaster = useToaster()
  const message = (
    <Message showIcon type="success">
      User Added Successfully
    </Message>
  )
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

  const handleEditState = (id) => {
    const nextData = Object.assign([], data)
    const activeItem = nextData.find((item) => item.id === id)
    activeItem.status = activeItem.status ? null : 'EDIT'
    setData(nextData)
  }
  // end of table functions

  // posting data to firebase
  // make changes
  const addDataToFirebase = (data) => {
    if (!formRef.current.check()) {
      console.error('Form Error')
      return
    }
    // only add this
    // const db = getDatabase()
    // set(ref(db, 'users/customers/' + uid), { id: uid, ...formValue }).then(() => {
    //   console.log('Data saved!')
    //   handleClose()
    // })
    // only
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
      .then((userCredential) => {
        const user = userCredential.user
        const uid = user.uid
        const db = getDatabase()
        set(ref(db, 'users/customers/' + uid), { id: uid, ...formValue }).then(() => {
          console.log('Data saved!')
          const nextData = getData()
          setData([...nextData, { id: uid, ...formValue }])
          handleClose()
          toaster.push(message, 'topCenter')
          setFormValue({
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            password: '',
            'add-1': '',
            'add-2': '',
            state: '',
            city: '',
            country: '',
            pincode: '',
            district: '',
          })
        })
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

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
  // ;(() => {
  //   const rows = []
  //   for (let i = 0; i < 100; i++) {
  //     const user = {
  //       id: i,
  //       avatar: faker.image.avatar(),
  //       firstName: faker.name.firstName(),
  //       lastName: faker.name.lastName(),
  //       email: faker.internet.exampleEmail(),
  //       contactNumber: faker.phone.number(),
  //       add_1: faker.address.streetAddress(),
  //       add_2: faker.address.secondaryAddress(),
  //       pincode: faker.address.zipCode(),
  //       district: faker.address.city(),
  //       city: faker.address.city(),
  //       state: faker.address.state(),
  //       country: faker.address.country(),
  //       sentence: faker.lorem.sentence(),
  //     }
  //     rows.push(user)
  //   }
  //   const db = getDatabase()
  //   set(ref(db, 'users/customers/'), rows)
  // })()
  ///
  //
  //make changes - retirve data from firebase

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `users/customers`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(Object.values(snapshot.val()))
        } else {
          console.log('No data available')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  //change this - update data in firebase
  const handleChange = (id, key, value) => {
    // db.collection('user')
    //   .doc(id)
    //   .update({ [key]: value })
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()
    // changew only this
    update(ref(db, 'users/customers/' + id), {
      [key]: value,
    })
  }
  //change this - delete from firebase
  const handleDeleteState = (id) => {
    // delete data[id]
    //
    const db = getDatabase()
    // changew only this
    remove(ref(db, 'users/customers/' + id))
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
          <Form fluid ref={formRef} model={model} onChange={setFormValue} formValue={formValue}>
            <TextField
              cid="uploader"
              name="uploader"
              label="Profile Picture"
              accepter={Uploader}
              action="#"
            />
            <TextField cid="firstName-9" name="firstName" label="First Name" />
            <TextField cid="firstName-9" name="lastName" label="Last Name" />
            <TextField cid="email-9" name="email" label="Email" type="email" />
            <TextField cid="password-9" name="password" label="Password" type="password" />
            <TextField
              cid="contactNumber-9"
              name="contactNumber"
              label="Contact Number"
              type="number"
            />
            {/* <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group> */}
            <TextField cid="add-1-9" name="add-1" label="Address 1" type="text" />
            <TextField cid="add-2-9" name="add-2" label="Address 2" type="text" />
            <TextField cid="pincode-9" name="pincode" label="Pincode" type="number" />
            <TextField
              cid="state-10"
              name="state"
              label="State"
              data={selectDataState}
              accepter={SelectPicker}
            />
            <TextField
              cid="district-10"
              name="district"
              label="District"
              data={selectDataDistrict}
              accepter={SelectPicker}
            />
            <TextField
              cid="city-10"
              name="city"
              label="City"
              data={selectDataCity}
              accepter={SelectPicker}
            />
            <TextField
              cid="country-10"
              name="country"
              label="Country"
              data={selectDataCountry}
              accepter={SelectPicker}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addDataToFirebase} appearance="primary" type="submit">
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
      {/* // no changes */}
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
