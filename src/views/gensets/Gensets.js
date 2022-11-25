import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster, Schema } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, update, push, get, remove } from 'firebase/database'
import { AddForm } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

const formDataParameters = [
  {
    cgenset_id: 'altMake-10',
    name: 'alt_make',
    label: 'Alt Make',
  },
  {
    cgenset_id: 'gensetMake-10',
    name: 'engine_make',
    label: 'Engine Make',
  },
  {
    cgenset_id: 'controllerMode-10',
    name: 'kva',
    label: 'KVA',
  },
]

const TableParams = [
  {
    isgenset_id: true,
    value: 'genset_id',
    wgenset_idth: 170,
    dataKey: 'genset_id',
  },
  {
    value: 'Alternate Make',
    wgenset_idth: 200,
    dataKey: 'alt_make',
  },
  {
    value: 'Engine Make',
    wgenset_idth: 200,
    dataKey: 'engine_make',
  },
  {
    value: 'KVA',
    wgenset_idth: 200,
    dataKey: 'kva',
  },
]

const Gensets = () => {
  const [data, setData] = React.useState([])
  const [modalStatus, setmodalStatus] = React.useState(false)
  const handleCloseDeleteModal = () => setmodalStatus(false)
  const [deletegenset_id, setDeletegenset_id] = React.useState()
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [messageval, setMessageval] = React.useState({
    message: 'success',
    type: 'success',
  })
  const [formValue, setFormValue] = React.useState({
    //genset_genset_id: '',
    alt_make: '',
    engine_make: '',
    kva: '',
  })

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `machinery/genset`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.keys(snapshot.val()).map((key) => {
            return {
              ...snapshot.val()[key],
              //change here
              id: key,
            }
          })
          setData(data)
        } else {
          setMessageval((prev) => {
            return {
              ...prev,
              message: 'No data available',
              type: 'error',
            }
          })
          toaster.push(message, 'topCenter')
        }
      })
      .catch((error) => {
        setMessageval((prev) => {
          return {
            ...prev,
            message: error.message,
            type: 'error',
          }
        })
        toaster.push(message, 'topCenter')
      })
  }, [])

  const addDataToFirebase = () => {
    const db = getDatabase()
    const Ref = ref(db, 'machinery/genset')
    const newRef = push(Ref)
    set(newRef, {
      genset_id: newRef.key,
      ...formValue,
    })
    const nextData = data
    setData([...nextData, { genset_id: newRef.key, ...formValue }])
    setFormValue({
      //genset_genset_id: '',
      alt_make: '',
      engine_make: '',
      kva: '',
    })
    handleClose()
  }

  const handleUpdateFirebase = (genset_id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.genset_id === genset_id)[key] = value
    setData(nextData)
    const db = getDatabase()

    // changew only this
    update(ref(db, 'machinery/genset/' + genset_id), {
      [key]: value,
    }).then(() => {
      setMessageval((prev) => {
        return {
          ...prev,
          message: 'Updated Successfully',
          type: 'success',
        }
      })
      toaster.push(message, 'topCenter')
    })
  }
  //change 4
  const handleDeleteFirebase = (genset_id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'machinery/genset/' + genset_id))
    setData(data.filter((item) => item.genset_id !== genset_id))
  }

  //no changes down here
  const handleShowDeleteModal = (genset_id) => {
    setmodalStatus(true)
    setDeletegenset_id(genset_id)
  }

  // handle states for add
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  const handleEditState = (genset_id) => {
    const nextData = Object.assign([], data)
    const activeItem = nextData.find((item) => item.genset_id === genset_id)
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
        deleteId={deletegenset_id}
        TableParams={TableParams}
      />
    </>
  )
}
export default Gensets
