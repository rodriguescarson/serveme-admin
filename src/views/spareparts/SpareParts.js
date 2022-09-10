//remains same
import React, { memo, useEffect, useState } from 'react'
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
import { getStorage, ref as storageRe, uploadBytes } from 'firebase/storage'

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
    partName: Schema.Types.StringType().isRequired('This field is required.'),
    Eng_id: Schema.Types.NumberType().isRequired('This field is required.'),
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

const SpareParts = () => {
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
    avatar: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    partName: '',
    Eng_id: '',
  })
  const toaster = useToaster()
  const message = (
    <Message showIcon type="success">
      Spare Part Added Successfully
    </Message>
  )
  useEffect(() => {
    if (formValue.avatar[0].blobFile) {
      const file = formValue.avatar[0].blobFile
      const storage = getStorage()
      const storageRef = storageRe(storage, `/userAvatars/${file.name}`)
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log('Uploaded a blob or file!', snapshot.ref.fullPath)
          console.log('url', snapshot.ref.name)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [formValue])

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
    const db = getDatabase()
    set(ref(db, 'spareparts/spare/' + uid), { id: uid, ...formValue }).then(() => {
    console.log('Data saved!')
    handleClose()
    })
    // only
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
      .then((userCredential) => {
        const user = userCredential.user
        const uid = user.uid
        const db = getDatabase()

        if (formValue.avatar[0].blobFile) {
          const file = formValue.avatar[0].blobFile
          const storage = getStorage()
          const storageRef = storageRe(storage, `/userAvatars/${uid}`)
          uploadBytes(storageRef, file)
            .then((snapshot) => {
              getDownloadURL(storageRe(storage, snapshot.ref.fullPath))
                .then((downloadURL) => {
                  setFormValue({ ...formValue, avatarUrl: downloadURL })
                  return downloadURL
                })
                .then((downloadURL) => {
                  set(ref(db, 'spareparts/spare/' + uid), {
                    id: uid,
                    ...formValue,
                    avatarUrl: downloadURL,
                  }).then(() => {
                    const nextData = getData()
                    setData([...nextData, { id: uid, ...formValue, avatarUrl: downloadURL }])
                    handleClose()
                    setMessageVal({ message: 'Spare added successfully', type: 'success' })
                    toaster.push(message, 'topCenter')
                    setFormValue({
                      avatar: null,
                      partName:'',
                      Eng_id:'',
                      avatarUrl: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
                    })
                  })
                })
            })
            .catch((e) => {
              setMessageVal({ message: e.message, type: 'error' })
              toaster.push(message, 'topCenter')
            })
        }
      })
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/email-already-in-use') {
          setMessageVal({ message: 'Email already in use', type: 'error' })
          toaster.push(message, 'topCenter')
        } else if (errorCode === 'auth/invalid-email') {
          setMessageVal({ message: 'Invalid email', type: 'error' })
          toaster.push(message, 'topCenter')
        }
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
    get(child(dbRef, `spareparts/spare`))
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
    update(ref(db, 'spareparts/spare/' + id), {
      [key]: value,
    })
  }
  //change this - delete from firebase
  const handleDeleteState = (id) => {
    // delete data[id]
    //
    const db = getDatabase()
    // changew only this
    remove(ref(db, 'spareparts/spare/' + id))
    setData(data.filter((item) => item.id !== id))
  }

  return (
    <>
      {/* add new user button */}
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New Spare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid ref={formRef} model={model} onChange={setFormValue} formValue={formValue}>
            <TextField
              cid="avatar"
              name="avatar"
              label="Part Picture"
              accepter={Uploader}
              // action=""
            />
            <TextField cid="partName-9" name="partName" label="part Name" />
            <TextField cid="Eng_id-9" name="Eng_id" label="Engine Id" />
            {/* <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group> */}
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
          <ImageCell dataKey="avatar" />
        </Column>
        <Column width={100} sortable>
          <HeaderCell>Part Name</HeaderCell>
          <EditableCell dataKey="partName" />
        </Column>
        <Column width={100} sortable>
          <HeaderCell>Engine ID</HeaderCell>
          <EditableCell dataKey="Eng_id" />
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
export default SpareParts
