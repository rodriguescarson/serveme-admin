import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster, Schema } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, push, get, remove } from 'firebase/database'
import { AddForm } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

const selectDataEnginemodel = ['abc', 'def', 'efg'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataAltmake = ['hij', 'klm'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataEnginemake = ['mno', 'pqr'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataControllermode = ['stu', 'vwxyz'].map((item) => ({
  label: item,
  value: item,
}))

const formDataParameters = [
  {
    cid: 'engineModel-10',
    name: 'engineModel',
    label: 'Engine Model',
    data: selectDataEnginemodel,
    accepter: SelectPicker,
  },
  {
    cid: 'altMake-10',
    name: 'altMake',
    label: 'Alt Make',
    data: selectDataAltmake,
    accepter: SelectPicker,
  },
  {
    cid: 'engineMake-10',
    name: 'engineMake',
    label: 'Enginemake',
    data: selectDataEnginemake,
    accepter: SelectPicker,
  },
  {
    cid: 'controllerMode-10',
    name: 'controllerMode',
    label: 'Controllermode',
    data: selectDataControllermode,
    accepter: SelectPicker,
  },
]

const TableParams = [
  {
    isId: true,
    value: 'Id',
    width: 170,
    dataKey: 'id',
  },
  {
    value: 'Engine Model',
    width: 200,
    dataKey: 'engineModel',
  },
  {
    value: 'AltMake',
    width: 200,
    dataKey: 'altMake',
  },
  {
    value: 'Engine Make',
    width: 200,
    dataKey: 'engineMake',
  },
  {
    value: 'Controller Mode',
    width: 200,
    dataKey: 'controllerMode',
  },
]

const Engines = () => {
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
    engineModel: '',
    altMake: '',
    engineMake: '',
    controllerMode: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `machinery/engines`))
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
    const Ref = ref(db, 'machinery/engines')
    const newRef = push(Ref)
    set(newRef, {
      id: newRef.key,
      ...formValue,
    })
    const nextData = data
    setData([...nextData, { id: newRef.key, ...formValue }])
    setFormValue({
      engineModel: '',
      altMake: '',
      engineMake: '',
      controllerMode: '',
    })
    handleClose()
  }

  const handleUpdateFirebase = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()

    // changew only this
    update(ref(db, 'machinery/engines/' + id), {
      [key]: value,
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'machinery/engines/' + id))
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
export default Engines
