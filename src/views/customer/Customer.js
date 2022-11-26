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

const formDataParameters = [
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

  { cid: 'add_1-9', name: 'add_1', label: 'Address 1', type: 'text' },

  { cid: 'add_2-9', name: 'add_2', label: 'Address 2', type: 'text' },

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
    dataKey: 'customer_id',
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
    dataKey: 'add_1',
  },
  {
    value: 'Address 2',
    width: 200,
    dataKey: 'add_2',
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

const Customer = () => {
  const [data, setData] = React.useState([])
  const [modalStatus, setmodalStatus] = React.useState(false)
  const handleCloseDeleteModal = () => setmodalStatus(false)
  const [deleteId, setDeleteId] = React.useState()
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [messageval, setMessageval] = React.useState({
    message: 'success',
    type: 'success',
  })
  ///change 1
  const [formValue, setFormValue] = React.useState({
    full_name: '',
    email: '',
    contact_no: '',
    password: '',
    add_1: '',
    add_2: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    district: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // change 2
    get(child(dbRef, `user/customer`))
      .then((snapshot) => {
        const data = Object.keys(snapshot.val()).map((key) => ({
          ...snapshot.val()[key],
          //change here
          customer_id: key,
          id: key,
        }))
        setData(data)
      })
      .catch((error) => {
        setMessageval((prev) => ({
          ...prev,
          message: error.message,
          type: 'error',
        }))
        toaster.push(message, 'topCenter')
      })
  }, [])
  // change 3
  const addDataToFirebase = () => {
    if (!formRef.current.check()) {
      setMessageval((prev) => ({
        ...prev,
        message: 'Please fill all the fields',
        type: 'error',
      }))
      toaster.push(message, 'topCenter')
      return
    }
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
      .then((userCredential) => {
        const user = userCredential.user
        const uid = user.uid
        const db = getDatabase()

        set(ref(db, 'user/customer/' + uid), {
          customer_id: uid,
          ...formValue,
        }).then(() => {
          const nextData = Object.assign([], data)
          setData([...nextData, { id: uid, customer_id: uid, ...formValue }])
          handleClose()
          setMessageval((prev) => ({
            ...prev,
            message: 'Data added successfully',
            type: 'success',
          }))
          toaster.push(message, 'topCenter')
          setFormValue({
            full_name: '',
            email: '',
            contact_no: '',
            password: '',
            add_1: '',
            add_2: '',
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
        if (errorCode === 'auth/email-already-in-use') {
          setMessageval((prev) => ({
            ...prev,
            message: 'Email already in use',
            type: 'error',
          }))
          toaster.push(message, 'topCenter')
        } else if (errorCode === 'auth/invalid-email') {
          setMessageval((prev) => ({
            ...prev,
            message: 'Invalid email',
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
    update(ref(db, 'user/customer/' + id), {
      [key]: value,
    }).then(() => {
      // setMessageval((prev) => ({
      //   ...prev,
      //   message: 'Data updated successfully',
      //   type: 'success',
      // }))
      // toaster.push(message, 'topCenter')
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'user/customer/' + id))
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
    contact_no: Schema.Types.StringType()
      .isRequired('This field is required.')
      .addRule((value) => {
        if (value) {
          const isExist = data.find((item) => item.contact_no === value)
          if (isExist) {
            return false
          }
          return true
        }
      }, 'Contact number already exists'),
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
export default Customer
