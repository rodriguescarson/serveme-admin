import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster, Schema } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, get, remove } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref as storageRe, uploadBytes, getDownloadURL } from 'firebase/storage'

import { AddForm, ImageUploader } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

const formDataParameters = [
  {
    cid: 'avatar',
    name: 'avatar',
    label: 'Profile Picture',
    accepter: ImageUploader,
    action: '//jsonplaceholder.typicode.com/posts/',
  },
  {
    cid: 'email-9',
    name: 'email',
    label: 'Email',
    type: 'email',
  },
  { cid: 'password-9', name: 'password', label: 'Password', type: 'password' },
  { cid: 'username-9', name: 'username', label: 'Username', type: 'text' },
]
const TableParams = [
  {
    isId: true,
    value: 'Id',
    width: 70,
    dataKey: 'a_id',
  },
  {
    isAvatar: true,
    value: 'Avatar',
    width: 130,
    dataKey: 'avatar_url',
  },
  {
    value: 'Email',
    width: 200,
    dataKey: 'email',
  },
  {
    value: 'Password',
    width: 200,
    dataKey: 'password',
  },
  {
    value: 'Username',
    width: 200,
    dataKey: 'username',
  },
]

const Admin = () => {
  const [data, setData] = React.useState([])
  const [modalStatus, setmodalStatus] = React.useState(false)
  const handleCloseDeleteModal = () => setmodalStatus(false)
  const [deleteId, setDeleteId] = React.useState()
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [messageval, setMessageval] = React.useState({
    message: '',
    type: 'success',
  })
  ///change 1
  const [formValue, setFormValue] = React.useState({
    avatar: null,
    email: '',
    password: '',
    username: '',
    avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // change 2
    get(child(dbRef, `user/admin`))
      .then((snapshot) => {
        const data = Object.keys(snapshot.val()).map((key) => ({
          ...snapshot.val()[key],
          //change here
          a_id: key,
          id: key,
        }))
        setData(data)
      })
      .catch((error) => {
        setMessageval((prev) => ({ ...prev, message: error.message, type: 'error' }))
        toaster.push(message, 'topCenter')
      })
  }, [])
  // change 3
  const addDataToFirebase = () => {
    if (!formRef.current.check()) {
      setMessageval((prev) => ({ ...prev, message: 'Please fill all the fields', type: 'error' }))
      toaster.push(message, 'topCenter')
      return
    }
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
      .then((userCredential) => {
        const user = userCredential.user
        const uid = user.uid
        const db = getDatabase()
        if (formValue.avatar) {
          const file = formValue.avatar[0].blobFile
          const storage = getStorage()
          const storageRef = storageRe(storage, `/userAvatars/${uid}`)
          uploadBytes(storageRef, file)
            .then((snapshot) => {
              getDownloadURL(storageRe(storage, snapshot.ref.fullPath)).then((downloadURL) => {
                update(ref(db, 'user/admin/' + uid), {
                  avatar_url: downloadURL,
                })
              })
            })
            .catch((e) => {
              setMessageval((prev) => ({ ...prev, message: e.message, type: 'error' }))
              toaster.push(message, 'topCenter')
            })
        }
        set(ref(db, 'user/admin/' + uid), {
          a_id: uid,
          ...formValue,
        }).then(() => {
          const nextData = Object.assign([], data)
          setData([...nextData, { id: uid, ...formValue }])
          handleClose()
          setMessageval((prev) => ({
            ...prev,
            message: 'Data added successfully',
            type: 'success',
          }))
          toaster.push(message, 'topCenter')
          setFormValue({
            avatar: null,
            contact_no: '',
            password: '',
            username: '',
            avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
          })
        })
      })
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/email-already-in-use') {
          setMessageval((prev) => ({
            ...prev,
            message: 'The email address is already in use by another account.',
            type: 'error',
          }))
          toaster.push(message, 'topCenter')
        } else if (errorCode === 'auth/invalid-email') {
          setMessageval((prev) => ({
            ...prev,
            message: 'Invalid Email.',
            type: 'error',
          }))
          toaster.push(message, 'topCenter')
        }
      })
  }

  //change 3
  const handleUpdateFirebase = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()
    // changew only this
    update(ref(db, 'user/admin/' + id), {
      [key]: value,
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'user/admin/' + id))
    setData(data.filter((item) => item.id !== id))
  }
  //change 5
  const model = Schema.Model({
    full_name: Schema.Types.StringType().isRequired('This field is required.'),
    email: Schema.Types.StringType()
      .isEmail('Please enter a valid email address.')
      .addRule((value) => {
        if (value) {
          const email = value.toLowerCase()
          const isExist = data.find((item) => item.email.toLowerCase() === email)
          if (isExist) {
            return false
          }
          return true
        }
      }, 'Email already exists'),
    contact_no: Schema.Types.StringType().isRequired('This field is required.'),
    password: Schema.Types.StringType()
      .isRequired('This field is required.')
      .minLength(6)
      .maxLength(100),
  })

  //no changes down here
  const handleShowDeleteModal = (id) => {
    setmodalStatus(true)
    setDeleteId(id)
  }

  // handle states for add
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  const handleEditState = (id) => {
    const nextData = Object.assign([], data)
    const activeItem = nextData.find((item) => item.id === id)
    activeItem.status = activeItem.status ? null : 'EDIT'
    setData(nextData)
  }

  const toaster = useToaster()
  const message = (
    <Message showIcon type={messageval.type}>
      {messageval.message}
    </Message>
  )
  return (
    <>
      <AddForm
        open={open}
        handleClose={handleClose}
        formRef={formRef}
        setFormValue={setFormValue}
        formValue={formValue}
        SelectPicker={SelectPicker}
        addDataToFirebase={addDataToFirebase}
        data={data}
        handleOpen={handleOpen}
        formDataParameters={formDataParameters}
        model={model}
      />
      <DisplayTable
        handleUpdateFirebase={handleUpdateFirebase}
        handleEditState={handleEditState}
        handleShowDeleteModal={handleShowDeleteModal}
        data={data}
        modalStatus={modalStatus}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteFirebase={handleDeleteFirebase}
        deleteId={deleteId}
        TableParams={TableParams}
      />
    </>
  )
}
export default Admin
