import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, push, update, get, remove } from 'firebase/database'
import { AddForm, ImageUploader } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

const formDataParameters = [
  {
    cid: 'uploader',
    name: 'uploader',
    label: 'Genset Img',
    accepter: ImageUploader,
  },
  {
    cid: 'GensetName-9',
    name: 'GensetName',
    label: 'Genset Name',
  },
]

const TableParams = [
  {
    isId: true,
    value: 'Id',
    width: 100,
    dataKey: 'id',
  },
  {
    isAvatar: true,
    value: 'Genset Img',
    width: 130,
    dataKey: 'avatar',
  },
  {
    value: 'Genset Name',
    width: 220,
    dataKey: 'GensetName',
  },
]

const Gensets = () => {
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
  const [formValue, setFormValue] = React.useState({
    GensetName: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `machinery/genset`))
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

  const addDataToFirebase = () => {
    const db = getDatabase()
    const Ref = ref(db, 'machinery/genset')
    const newRef = push(Ref)
    set(newRef, {
      id: newRef.key,
      ...formValue,
    })
    const nextData = data
    setData([...nextData, { id: newRef.key, ...formValue }])
    setFormValue({
      GensetName: '',
    })
    setMessageval({ message: 'Genset added successfully', type: 'success' })
    toaster.push(message, 'topCenter')
    handleClose()
  }

  const handleUpdateFirebase = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()

    // changew only this
    update(ref(db, 'machinery/genset/' + id), {
      [key]: value,
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'machinery/genset/' + id))
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
export default Gensets
