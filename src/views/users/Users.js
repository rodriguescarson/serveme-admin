//remains same
import React, { useEffect } from 'react'
import { IconButton, FlexboxGrid, SelectPicker, Message, useToaster } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, get, remove } from 'firebase/database'
import { getAuth } from 'firebase/auth'
//cell imports
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref as storageRe, uploadBytes, getDownloadURL } from 'firebase/storage'
import UserAddForm from './UserAddForm'
import DeleteUsersModal from './DeleteUsersModal'
import UserTable from './UserTable'
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
  // message toast
  const [messageVal, setMessageVal] = React.useState({
    message: '',
    type: 'success',
  })
  ///change
  const [formValue, setFormValue] = React.useState({
    avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    avatar: null,
    full_name: '',
    email: '',
    contact_no: '',
    password: '',
    add_l1: '',
    add_l2: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    district: '',
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
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
      .then((userCredential) => {
        const user = userCredential.user
        const uid = user.uid
        const db = getDatabase()
        if (formValue.avatar) {
          console.log('blobFile')
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
                  set(ref(db, 'users/customers/' + uid), {
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
                      avatar: null,
                      full_name: '',
                      email: '',
                      contact_no: '',
                      password: '',
                      add_l1: '',
                      add_l2: '',
                      state: '',
                      city: '',
                      country: '',
                      pincode: '',
                      district: '',
                      avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
                    })
                  })
                })
            })
            .catch((e) => {
              console.log(e)
              setMessageVal({ message: e.message, type: 'error' })
              toaster.push(message, 'topCenter')
            })
        } else {
          console.log('no file')
          set(ref(db, 'users/customers/' + uid), { id: uid, ...formValue }).then(() => {
            const nextData = getData()
            setData([...nextData, { id: uid, ...formValue }])
            handleClose()
            setMessageVal({ message: 'User added successfully', type: 'success' })
            toaster.push(message, 'topCenter')
            setFormValue({
              avatar: null,
              full_name: '',
              email: '',
              contact_no: '',
              password: '',
              add_l1: '',
              add_l2: '',
              state: '',
              city: '',
              country: '',
              pincode: '',
              district: '',
              avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
            })
          })
        }
      })
      .catch((error) => {
        console.log(error)
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

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `users/customers`))
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
    update(ref(db, 'users/customers/' + id), {
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
    remove(ref(db, 'users/customers/' + id))
    setData(data.filter((item) => item.id !== id))
  }

  return (
    <>
      {/* add new user button */}
      <UserAddForm
        open={open}
        handleClose={handleClose}
        formRef={formRef}
        setFormValue={setFormValue}
        formValue={formValue}
        SelectPicker={SelectPicker}
        addDataToFirebase={addDataToFirebase}
        data={data}
      />
      <FlexboxGrid justify="end" style={{ marginBottom: 10 }}>
        <FlexboxGrid.Item colspan={2}>
          <IconButton icon={<PlusIcon />} color="red" appearance="primary" onClick={handleOpen}>
            Add
          </IconButton>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {/* end of add new user button */}
      {/* table */}
      <UserTable
        getData={getData}
        sortColumn={sortColumn}
        sortType={sortType}
        handleSortColumn={handleSortColumn}
        loading={loading}
        handleCheckAll={handleCheckAll}
        checkedKeys={checkedKeys}
        handleCheck={handleCheck}
        handleChange={handleChange}
        handleEditState={handleEditState}
        handleShowDeleteModal={handleShowDeleteModal}
        data={data}
      />
      {/* // no changes */}
      {/* Delete Modal */}
      <DeleteUsersModal
        deleteUserModal={deleteUserModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteState={handleDeleteState}
        deleteId={deleteId}
      />
    </>
  )
}
export default Users
