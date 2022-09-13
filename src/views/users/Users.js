import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster, Schema } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, get, remove } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref as storageRe, uploadBytes, getDownloadURL } from 'firebase/storage'

import { AddForm, ImageUploader } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

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

//change down here
const formDataParameters = [
  {
    cid: 'avatar',
    name: 'avatar',
    label: 'Profile Picture',
    accepter: ImageUploader,
    action: '//jsonplaceholder.typicode.com/posts/',
  },
  {
    cid: 'full_name-9',
    name: 'full_name',
    label: 'Full Name',
  },
  {
    cid: 'email-9',
    name: 'email',
    label: 'Email',
    type: 'email',
  },
  { cid: 'password-9', name: 'password', label: 'Password', type: 'password' },

  { cid: 'contactNumber-9', name: 'contact_no', label: 'Contact Number', type: 'number' },

  { cid: 'add_1-9', name: 'add_l1', label: 'Address 1', type: 'text' },

  { cid: 'add_2-9', name: 'add_l2', label: 'Address 2', type: 'text' },

  { cid: 'pincode-9', name: 'pincode', label: 'Pincode', type: 'number' },
  {
    cid: 'state-10',
    name: 'state',
    label: 'State',
    data: selectDataState,
    accepter: SelectPicker,
  },
  {
    cid: 'district-10',
    name: 'district',
    label: 'District',
    data: selectDataDistrict,
    accepter: SelectPicker,
  },
  {
    cid: 'city-10',
    name: 'city',
    label: 'City',
    data: selectDataCity,
    accepter: SelectPicker,
  },
  {
    cid: 'country-10',
    name: 'country',
    label: 'Country',
    data: selectDataCountry,
    accepter: SelectPicker,
  },
]
const TableParams = [
  {
    isId: true,
    value: 'Id',
    width: 70,
    dataKey: 'id',
  },
  {
    isAvatar: true,
    value: 'Avatar',
    width: 130,
    dataKey: 'avatar_url',
  },
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

const Users = () => {
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

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // change 2
    get(child(dbRef, `users/customers`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(Object.values(snapshot.val()))
        } else {
          setMessageval({ message: 'No data available', type: 'error' })
          toaster.push(message, 'topCenter')
        }
      })
      .catch((error) => {
        setMessageval({ message: error.message, type: 'error' })
        toaster.push(message, 'topCenter')
      })
  }, [])
  // change 3
  const addDataToFirebase = () => {
    if (!formRef.current.check()) {
      setMessageval({ message: 'Please fill all the required fields', type: 'error' })
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
                update(ref(db, 'users/customers/' + uid), {
                  avatar_url: downloadURL,
                })
              })
            })
            .catch((e) => {
              setMessageval({ message: e.message, type: 'error' })
              toaster.push(message, 'topCenter')
            })
        }
        set(ref(db, 'users/customers/' + uid), {
          id: uid,
          ...formValue,
        }).then(() => {
          const nextData = Object.assign([], data)
          setData([...nextData, { id: uid, ...formValue }])
          handleClose()
          setMessageval({ message: 'User added successfully', type: 'success' })
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
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/email-already-in-use') {
          setMessageval({ message: 'Email already in use', type: 'error' })
          toaster.push(message, 'topCenter')
        } else if (errorCode === 'auth/invalid-email') {
          setMessageval({ message: 'Invalid email', type: 'error' })
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
    update(ref(db, 'users/customers/' + id), {
      [key]: value,
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'users/customers/' + id))
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
export default Users
