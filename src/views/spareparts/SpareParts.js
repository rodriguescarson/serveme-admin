//remains same
import React, { useEffect } from 'react'
import {
  IconButton,
  FlexboxGrid,
  Form,
  Schema,
  Button,
  Input,
  Modal,
  SelectPicker,
  Message,
  useToaster,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, get, remove } from 'firebase/database'
import { getAuth } from 'firebase/auth'
//cell imports
import {
  ActionCell,
  CheckCell,
  DeleteCell,
  EditableCell,
  ImageCell,
} from '../../utils/tableComponents'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref as storageRe, uploadBytes, getDownloadURL } from 'firebase/storage'
import ImageUploader from '../../utils/formComponents/ImageUploader'
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
  available: Schema.Types.StringType().isRequired('This field is required'),
  cost: Schema.Types.NumberType().isRequired('This field is required.'),
  description: Schema.Types.StringType(),
  model: Schema.Types.StringType().isRequired('This field is required.'),
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
  // message toast
  const [messageVal, setMessageVal] = React.useState({
    message: '',
    type: 'success',
  })
  ///change
  const [formValue, setFormValue] = React.useState({
    avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    avatar: null,
    image: '',
    available: '',
    cost: '',
    description: '',
    model: '',
  })

  //toast
  const toaster = useToaster()
  const message = (
    <Message showIcon type={messageVal.type} messageVal={messageVal.message}>
      {messageVal.message}
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

  // end of table functions

  // posting data to firebase
  // make changes
  const addDataToFirebase = (data) => {
    if (!formRef.current.check()) {
      setMessageVal({ message: 'Please fill all the required fields', type: 'error' })
      toaster.push(message, 'topCenter')
      return
    }

    // only add this
    // const db = getDatabase()
    // set(ref(db, 'users/customers/' + uid), { id: uid, ...formValue }).then(() => {
    //   console.log('Data saved!')
    //   handleClose()
    // })
    // only
    const db = getDatabase()
    set(ref(db, 'machinery/spares/' + uid), { id: uid, ...formValue }).then(() => {
      setMessageVal({ message: 'Spare added successfully', type: 'success' })
      toaster.push(message, 'topCenter')
      setFormValue({
        avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
        avatar: null,
        image: '',
        available: '',
        cost: '',
        description: '',
        model: '',
      })
      console.log('Data saved!')
      handleClose()
    })
    /*const auth = getAuth()
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
                  setFormValue({ ...formValue, avatar_url: downloadURL })
                  return downloadURL
                })
                .then((downloadURL) => {
                  set(ref(db, 'machinery/spares/' + uid), {
                    id: uid,
                    ...formValue,
                    avatar_url: downloadURL,
                  }).then(() => {
                    const nextData = getData()
                    setData([...nextData, { id: uid, ...formValue, avatar_url: downloadURL }])
                    handleClose()
                    setMessageVal({ message: 'User added successfully', type: 'success' })
                    toaster.push(message, 'topCenter')
                    setFormValue({
                      avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
                      avatar: null,
                      image: '',
                      available: '',
                      cost: '',
                      description: '',
                      model: '',
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
      })*/
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

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `machinery/spares`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(Object.values(snapshot.val()))
        } else {
          setMessageVal({ message: 'No data available', type: 'error' })
          toaster.push(message, 'topCenter')
        }
      })
      .catch((error) => {
        setMessageVal({ message: error.message, type: 'error' })
        toaster.push(message, 'topCenter')
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
    update(ref(db, 'machinery/spares/' + id), {
      [key]: value,
    })
  }

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
    const db = getDatabase()
    // changew only this
    remove(ref(db, 'machinery/spares/' + id))
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
              cid="image"
              name="image"
              label="Profile Picture"
              accepter={ImageUploader}
              action="//jsonplaceholder.typicode.com/posts/"
            />
            <TextField cid="available-9" name="available" label="Available"/>
            <TextField cid="cost-9" name="cost" label="Cost"/>
            {/* <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group> */}
            <TextField cid="description-9" name="description" label="Description" type="text" />
            <TextField cid="model-9" name="model" label="Model" type="number" />
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
          <ImageCell dataKey="image" />
        </Column>
        <Column width={200}>
          <HeaderCell>Available</HeaderCell>
          <EditableCell dataKey="available" onClick={handleEditState}/>
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Cost</HeaderCell>
          <EditableCell dataKey="cost" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Description</HeaderCell>
          <EditableCell dataKey="description" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Model</HeaderCell>
          <EditableCell dataKey="model" onChange={handleChange} />
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
          <Modal.Title>Delete Spare</Modal.Title>
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
