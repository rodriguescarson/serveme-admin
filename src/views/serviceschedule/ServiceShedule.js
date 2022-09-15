import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, push, update, get, remove } from 'firebase/database'
import { AddForm } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'

const ServiceSchedule = () => {
  const [data, setData] = React.useState([])
  const [modalStatus, setmodalStatus] = React.useState(false)
  const handleCloseDeleteModal = () => setmodalStatus(false)
  const [deleteId, setDeleteId] = React.useState()
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [spData, setSpData] = React.useState([{ label: '', value: '' }])
  const [sparesData, setSparesData] = React.useState([{ label: '', value: '' }])
  const [messageval, setMessageval] = React.useState({
    message: 'success',
    type: 'success',
  })
  const [formValue, setFormValue] = React.useState({
    Type: '',
    Cost: '',
  })

  const selectDataType = ['pending', 'accepted', 'rejected'].map((item) => ({
    label: item,
    value: item,
  }))

  const formDataParameters = [
    {
      cid: 'type-9',
      name: 'type',
      label: 'Type',
      data: selectDataType,
      accepter: SelectPicker,
    },
    {
      cid: 'cost-9',
      name: 'cost',
      label: 'Cost',
    },
  ]

  const TableParams = [
    {
      isId: true,
      value: 'Id',
      width: 100,
      dataKey: 'ss_id',
    },
    {
      value: 'Requirement Date',
      width: 200,
      dataKey: 'req_date',
    },
    {
      value: 'Cost',
      width: 200,
      dataKey: 'cost',
    },
    {
      isDropDown: true,
      value: 'Service Status',
      width: 200,
      dataKey: 'service_status',
      data: selectDataType,
    },
    {
      value: 'Customer Id',
      width: 200,
      dataKey: 'u_customer_id',
    },
    {
      value: 'Genset_Id',
      width: 200,
      dataKey: 'ged_id',
    },
    {
      isDropDown: true,
      showPopover: true,
      value: 'Service Provider Id',
      width: 200,
      dataKey: 'sp_id',
      data: spData,
    },
    {
      isDropDown: true,
      showPopover: true,
      value: 'Spare Part Id',
      width: 200,
      dataKey: 'spares_id',
      data: sparesData,
    },
  ]

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `service_schedule`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.keys(snapshot.val()).map((key) => ({
            ...snapshot.val()[key],
            //change here
            ss_id: key,
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
        setMessageval((prev) => ({
          ...prev,
          message: error.message,
          type: 'error',
        }))
        toaster.push(message, 'topCenter')
      })
    get(child(dbRef, `user/service_provider/`)).then((snapshot) => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val()).map((key) => {
          setSpData([...spData, { label: key, value: key, ...snapshot.val()[key] }])
        })
      }
    })
    get(child(dbRef, `machinery/spares/`)).then((snapshot) => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val()).map((key) => {
          setSparesData([...sparesData, { label: key, value: key, ...snapshot.val()[key] }])
        })
      }
    })
  }, [])

  const addDataToFirebase = () => {
    const db = getDatabase()
    const Ref = ref(db, 'service_schedule')
    const newRef = push(Ref)
    set(newRef, {
      id: newRef.key,
      ...formValue,
    })
    const nextData = data
    setData([...nextData, { id: newRef.key, ...formValue }])
    setFormValue({
      Type: '',
      Cost: '',
    })
    setMessageval((prev) => ({
      ...prev,
      message: 'Data added successfully',
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
    update(ref(db, 'service_schedule/' + id), {
      [key]: value,
    }).then(() => {
      setMessageval((prev) => ({
        ...prev,
        message: 'Data updated successfully',
        type: 'success',
      }))
      toaster.push(message, 'topCenter')
    })
  }
  //change 4
  const handleDeleteFirebase = (id) => {
    const db = getDatabase()
    // change only this
    remove(ref(db, 'service_schedule/' + id))
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
export default ServiceSchedule
