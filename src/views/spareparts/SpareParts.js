import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster } from 'rsuite'

import { getDatabase, ref, set, child, push, update, get, remove } from 'firebase/database'
import { AddForm } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

const selectDataAvailable = ['In Stock', 'Out Of Stock'].map((item) => ({
  label: item,
  value: item,
}))

const formDataParameters = [
  // {
  //   cid: 'image-10',
  //   name: 'image',
  //   label: 'Image',
  //   data: selectDataAvailable,
  //   accepter: ImageUploader,
  //   action: '//jsonplaceholder.typicode.com/posts/',
  // },
  {
    cid: 'available-10',
    name: 'available',
    label: 'Available',
    data: selectDataAvailable,
    accepter: SelectPicker,
  },
  {
    cid: 'cost-10',
    name: 'cost',
    label: 'Cost',
  },
  {
    cid: 'description-10',
    name: 'description',
    label: 'Description',
  },
  {
    cid: 'model-10',
    name: 'model',
    label: 'Model',
  },
]

const TableParams = [
  {
    isId: true,
    value: 'Id',
    width: 100,
    dataKey: 'id',
  },
  // {
  //   isAvatar: true,
  //   value: 'Image',
  //   width: 200,
  //   dataKey: 'image',
  // },
  {
    value: 'Available',
    width: 220,
    dataKey: 'available',
  },
  {
    value: 'Cost',
    width: 200,
    dataKey: 'cost',
  },
  {
    value: 'Description',
    width: 200,
    dataKey: 'description',
  },
  {
    value: 'Model',
    width: 200,
    dataKey: 'model',
  },
]

const SpareParts = () => {
  const [data, setData] = React.useState([])
  const [modalStatus, setmodalStatus] = React.useState(false)
  const handleCloseDeleteModal = () => setmodalStatus(false)
  const [deleteId, setDeleteId] = React.useState()
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [messageval, setMessageval] = React.useState({
    message: 'Success',
    type: 'success',
  })
  const [formValue, setFormValue] = React.useState({
    available: '',
    cost: '',
    description: '',
    image: '',
    model: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `machinery/spares`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(Object.values(snapshot.val()))
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
        setMessageval((prev) => ({
          ...prev,
          message: error.message,
          type: 'error',
        }))
        toaster.push(message, 'topCenter')
      })
  }, [])

  const addDataToFirebase = () => {
    const db = getDatabase()
    const Ref = ref(db, 'machinery/spares')
    const newRef = push(Ref)
    formValue.cost = '₹' + formValue.cost
    set(newRef, {
      id: newRef.key,
      ...formValue,
    })
    const nextData = data
    setData([...nextData, { id: newRef.key, ...formValue }])
    setFormValue({
      GensetName: '',
    })
    setMessageval((prev) => ({
      ...prev,
      message: 'Data Added Successfully',
      type: 'success',
    }))
    toaster.push(message, 'topCenter')
    handleClose()
  }

  const handleUpdateFirebase = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()

    // changew only this
    update(ref(db, 'machinery/spares/' + id), {
      [key]: value,
    }).then(() => {
      // setMessageval((prev) => ({
      //   ...prev,
      //   message: 'Data Updated Successfully',
      //   type: 'success',
      // }))
      // toaster.push(message, 'topCenter')
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'machinery/spares/' + id))
    setData(data.filter((item) => item.id !== id))
  }

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
export default SpareParts
