import React, { useEffect } from 'react'
import { SelectPicker, Message, useToaster } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, set, child, push, update, get, remove } from 'firebase/database'
import { AddForm } from '../../utils/formComponents'
import DisplayTable from '../../utils/tableComponents/DisplayTable'
import { setDate } from 'rsuite/esm/utils/dateUtils'

const Services = () => {
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
      cid: 'cost-9',
      name: 'cost',
      label: 'Cost',
    },
    {
      cid: 'Requirement Date',
      name: 'req_data',
      label: 'Requirement Date',
    },
    {
      cid: 'Service Status',
      name: 'service_status',
      label: 'Service Status',
      data: selectDataType,
      accepter: SelectPicker,
    },
    {
      cid: 'u_customer_id',
      name: 'u_customer_id',
      label: 'Customer ID',
    },
    {
      cid: 'gen_id',
      name: 'gen_id',
      label: 'GEN ID',
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
      width: 100,
      dataKey: 'u_customer_id',
    },
    {
      value: 'Customer Name',
      width: 100,
      dataKey: 'u_customer_name',
    },
    {
      value: 'Genset_Id',
      width: 200,
      dataKey: 'gen_id',
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
  const [tempName, setTempName] = React.useState('')
  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `service_schedule`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.keys(snapshot.val()).map((key) => {
            return {
              ...snapshot.val()[key],
              //change here
              ss_id: key,
              id: key,
              u_customer_name: tempName,
            }
          })
          setData(data)
          data.map((key) => {
            const dbRef = ref(getDatabase())
            get(child(dbRef, `user/customer/${key.u_customer_id}`))
              .then((snapshot1) => {
                if (snapshot1.exists()) {
                  console.log(snapshot1.val())
                  setData((prev) => {
                    return prev.map((item) => {
                      console.log(item.u_customer_id, key.u_customer_id)
                      if (item.u_customer_id === key.u_customer_id) {
                        return {
                          ...item,
                          u_customer_name: snapshot1.val().full_name,
                        }
                      }
                      return item
                    })
                  })
                }
              })
              .then(console.log(data))
              .catch((error) => {
                console.error(error)
              })
          })
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
          setSpData((prev) => [
            ...prev,
            { label: snapshot.val()[key].full_name, value: key, ...snapshot.val()[key] },
          ])
          // setSpData([...spData, { label: key, value: key, ...snapshot.val()[key] }])
        })
      }
    })
    get(child(dbRef, `machinery/spares/`)).then((snapshot) => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val()).map((key) => {
          setSparesData((prev) => [...prev, { label: key, value: key, ...snapshot.val()[key] }])
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
    // update ss_id list in service_provider
    if (key === 'sp_id') {
      const db = getDatabase()
      const Ref = ref(db, 'user/service_provider/' + value)
      const prevVal = get(Ref)

      prevVal.then((snapshot) => {
        if (snapshot.exists()) {
          const prevData = snapshot.val()
          const nextData = Object.assign([], prevData.ss_id)
          nextData.push(id)
          update(ref(db, 'user/service_provider/' + value), {
            ss_id: nextData,
          }).then(() => {
            setMessageval((prev) => ({
              ...prev,
              message: 'Data updated successfully',
              type: 'success',
            }))
            toaster.push(message, 'topCenter')
          })
        }
      })
    }
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
export default Services
