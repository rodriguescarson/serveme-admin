import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster, Schema } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, get, remove } from 'firebase/database'
import { AddForm } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

//change down here
const formDataParameters = [
  {
    cid: 'answer-9',
    name: 'answer',
    label: 'Answer',
  },
  {
    cid: 'question-9',
    name: 'question',
    label: 'Question',
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
    value: 'Question',
    width: 100,
    dataKey: 'question',
  },
  {
    value: 'Answer',
    width: 100,
    dataKey: 'answer',
  },
]

const Faq = () => {
  const [data, setData] = React.useState([])
  const [modalStatus, setmodalStatus] = React.useState(false)
  const handleCloseDeleteModal = () => setmodalStatus(false)
  const [deleteId, setDeleteId] = React.useState()
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [lenData, setLenData] = React.useState(0)
  const [messageval, setMessageval] = React.useState({
    message: '',
    type: 'success',
  })
  ///change 1
  const [formValue, setFormValue] = React.useState({
    answer: '',
    question: '',
    number: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // change 2
    get(child(dbRef, `FAQ/data`))
      .then((snapshot) => {
        const data = Object.keys(snapshot.val()).map((key) => ({
          ...snapshot.val()[key],
          //change here
          number: key,
          id: key,
        }))
        setData(data)
        setLenData(data.length)
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
    const db = getDatabase()
    const uid = lenData + 1
    set(ref(db, 'FAQ/data/' + uid), {
      number: uid,
      ...formValue,
    }).then(() => {
      const nextData = Object.assign([], data)
      setData([...nextData, { id: uid, ...formValue }])
      handleClose()
      setMessageval({ message: 'Faq added successfully', type: 'success' })
      toaster.push(message, 'topCenter')
      setFormValue({
        answer: '',
        question: '',
        number: '',
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
    update(ref(db, 'FAQ/data/' + id), {
      [key]: value,
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'FAQ/data/' + id))
    setData(data.filter((item) => item.id !== id))
  }
  //change 5
  const model = Schema.Model({
    answer: Schema.Types.StringType().isRequired('This field is required.'),
    question: Schema.Types.StringType().isRequired('This field is required.'),
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
export default Faq
