import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster, Schema } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, get, remove } from 'firebase/database'
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
import { getStorage, ref as storageRe, uploadBytes, getDownloadURL } from 'firebase/storage'

import { AddForm } from '../../utils/formComponents'
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
  // {
  //   cid: 'avatar',
  //   name: 'avatar',
  //   label: 'Profile Picture',
  //   accepter: ImageUploader,
  //   action: '//jsonplaceholder.typicode.com/posts/',
  // },
  {
    cid: 'full_name-9',
    name: 'full_name',
    label: 'Full Name',
  },

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
    dataKey: 'id',
  },
  // {
  //   isAvatar: true,
  //   value: 'Avatar',
  //   width: 130,
  //   dataKey: 'avatar_url',
  // },
  {
    value: 'Full name',
    width: 100,
    dataKey: 'full_name',
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
  {
    isIdEditDelete: true,
    value: 'Edit or Delete',
    width: 70,
    dataKey: 'id',
  },
]

const ServiceProvider = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [verificationCode, setVerificationCode] = React.useState('')
  const [verificationId, setVerificationId] = React.useState('')
  const [user, setUser] = React.useState(null)
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
    avatar: null,
    avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    full_name: '',
    contact_no: '',
    add_1: '',
    add_2: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    country: '',
    gen_id: '',
    service_shedule_id: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // change 2
    get(child(dbRef, `user/service_provider`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //set id to service_provider_id
          const data = Object.keys(snapshot.val()).map((key) => ({
            ...snapshot.val()[key],
            //change here
            service_provider_id: key,
            id: key,
          }))
          setData(data)
        } else {
          setMessageval((prev) => ({
            ...prev,
            message: 'No data available',
            type: 'warning',
          }))

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
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
          },
        },
        auth,
      )
    }
    let appVerifier = window.recaptchaVerifier
    const phoneNumber = '+91' + formValue.contact_no
    signInWithPhoneNumber(auth, phoneNumber, appVerifier).then((confirmationResult) => {
      setVerificationId(confirmationResult.verificationId)
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      const verificationCode = window.prompt('Enter OTP')
      //verify code
      const credential = PhoneAuthProvider.credential(verificationId, String(verificationCode))
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user
          const uid = user.uid
          const db = getDatabase()
          if (formValue.avatar) {
            const file = formValue.avatar[0].blobFile
            const storage = getStorage()
            const storageRef = storageRe(storage, `/serviceProviderAvatars/${uid}`)
            uploadBytes(storageRef, file)
              .then((snapshot) => {
                getDownloadURL(storageRe(storage, snapshot.ref.fullPath)).then((downloadURL) => {
                  update(ref(db, 'user/service_provider/' + uid), {
                    avatar_url: downloadURL,
                  })
                })
              })
              .catch((e) => {
                setMessageval({ message: e.message, type: 'error' })
                toaster.push(message, 'topCenter')
              })
          }
          //chnage heres
          set(ref(db, 'user/service_provider/' + uid), {
            //change here
            service_provider_id: uid,
            ...formValue,
          }).then(() => {
            const nextData = Object.assign([], data)
            setData([...nextData, { id: uid, ...formValue }])
            handleClose()
            setMessageval({ message: 'User added successfully', type: 'success' })
            toaster.push(message, 'topCenter')
            setFormValue({
              avatar: null,
              avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
              full_name: '',
              contact_no: '',
              add_1: '',
              add_2: '',
              city: '',
              district: '',
              state: '',
              pincode: '',
              country: '',
              gen_id: '',
              service_shedule_id: '',
            })
          })
        })
        .catch((error) => {
          setMessageval({ message: error.message, type: 'error' })
          toaster.push(message, 'topCenter')
        })
    })
  }

  //change 3
  const handleUpdateFirebase = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()
    // changew only this
    update(ref(db, 'user/service_provider/' + id), {
      [key]: value,
    }).then(() => {
      setMessageval({ message: 'User updated successfully', type: 'success' })
      toaster.push(message, 'topCenter')
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'user/service_provider/' + id))
    setData(data.filter((item) => item.id !== id))
  }
  //change 5
  const model = Schema.Model({
    full_name: Schema.Types.StringType().isRequired('This field is required.'),
    contact_no: Schema.Types.StringType()
      .isRequired('This field is required.')
      .addRule((value) => {
        if (value) {
          const contact_no = value
          const isExist = data.find((item) => item.contact_no === contact_no)
          if (isExist) {
            return false
          }
          return true
        }
      }, 'PHone number already exists'),
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
      <div id="recaptcha-container"></div>
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
export default ServiceProvider
