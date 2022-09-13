/* eslint-disable prettier/prettier */
import React, { memo, useEffect } from 'react'
import {
  IconButton,
  FlexboxGrid,
  Form,
  Button,
  Input,
  Modal,
  SelectPicker,
  Message,
  useToaster,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import { getDatabase, ref, push, set, child, update, get, remove } from 'firebase/database'
import {
  ActionCell,
  CheckCell,
  DeleteCell,
  EditableCell,
  ImageCell,
} from '../../utils/tableComponents'
import ImageUploader from '../../utils/formComponents/ImageUploader'

const selectDataAvailable = ['In Stock', 'Out Of Stock'].map((item) => ({
  label: item,
  value: item,
}))

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />)
Textarea.displayName = 'Textarea'
// const NameCell = ({ rowData, dataKey, ...props }) => {
//   const Overlay = React.forwardRef(({ style, onClose, ...rest }, ref) => {
//     const styles = {
//       ...style,
//       shadows: '0px 0px 10px rgba(0, 0, 0, 0.5)',
//       color: '#000',
//       background: '#fff',
//       width: 200,
//       opacity: 1,
//       padding: 10,
//       borderRadius: 4,
//       boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
//       position: 'absolute',
//       zIndex: 1,
//       transform: 'translate(0, -20px)',
//     }

//     return (
//       <div {...rest} style={styles} ref={ref}>
//         <p>
//           <b>Name:</b> {`${rowData.firstName} ${rowData.lastName}`}{' '}
//         </p>
//         <p
//           style={{
//             display: 'flex',
//             flexWrap: 'wrap',
//           }}
//         >
//           <b>District:</b> {rowData.district}{' '}
//         </p>
//         <p>
//           <b>City:</b> {rowData.city}{' '}
//         </p>
//         <p>
//           <b>State:</b> {rowData.state}{' '}
//         </p>
//         <p>
//           <b>Country:</b> {rowData.country}{' '}
//         </p>
//       </div>
//     )
//   })
//   Overlay.displayName = 'Overlay'
//   const speaker = (props, ref) => {
//     const { className, top, onClose } = props
//     return (
//       <Overlay
//         title="Description"
//         style={{ top }}
//         onClose={onClose}
//         className={className}
//         ref={ref}
//         visible
//       />
//     )
//   }

//   return (
//     <BaseCell rowData={rowData} {...props}>
//       <Whisper trigger="click" placement="auto" speaker={speaker} enterable>
//         <Button
//           style={{
//             background: '#fff',
//             color: 'blue',
//             border: '0px solid #000',
//             lineHeight: '50px',
//             textAlign: 'center',
//             verticalAlign: 'middle',
//             marginRight: '10px',
//           }}
//         >
//           {rowData[dataKey].toLocaleString()}
//         </Button>
//       </Whisper>
//     </BaseCell>
//   )
// }
// data.map((item) => {
//   return db
//     .collection('user')
//     .doc('one')
//     .set(item)
//     .then(() => {
//       console.log('Document successfully written!')
//     })
// })

const SpareParts = () => {
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [deleteUserModal, setDeleteUserModal] = React.useState(false)
  const handleCloseDeleteModal = () => setDeleteUserModal(false)
  const [deleteId, setDeleteId] = React.useState()
  const handleShowDeleteModal = (id) => {
    setDeleteUserModal(true)
    setDeleteId(id)
  }
  // useState for add user
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [formValue, setFormValue] = React.useState({
    available: '',
    cost: '',
    description: '',
    image: '',
    model: '',
  })

  // message toast
  const [messageVal, setMessageVal] = React.useState({
    message: '',
    type: 'success',
  })

  //toast
  const toaster = useToaster()
  const message = (
    <Message showIcon type={messageVal.type} messageVal={messageVal.message}>
      {messageVal.message}
    </Message>
  )

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
    const dbRef = ref(getDatabase())
    // changew only this
    get(child(dbRef, `machinery/spares`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(Object.values(snapshot.val()))
        } else {
          setMessageVal({ message: 'No data available', type: 'error' })
          toaster.push(message, 'topCenter')
        }
      })
      .catch((error) => {
        setMessageVal({ message: error.message, type: 'error' })
        toaster.push(message, 'topCenter')
      })
  }, [])

  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return data
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSortColumn(sortColumn)
      setSortType(sortType)
    }, 500)
  }

  const handleCheckAll = React.useCallback((event) => {
    const checked = event.target.checked
    const keys = checked ? data.map((item) => item.id) : []
    setCheckedKeys(keys)
  }, [])

  const handleCheck = React.useCallback(
    (event) => {
      const checked = event.target.checked
      const value = +event.target.value
      const keys = checked ? [...checkedKeys, value] : checkedKeys.filter((item) => item !== value)

      setCheckedKeys(keys)
    },
    [checkedKeys],
  )

  const addDataToFirebase = (data) => {
    const db = getDatabase()
    const Ref = ref(db, 'machinery/spares')
    const newRef = push(Ref)
    set(newRef, {
      id: newRef.key,
      ...formValue,
    })
    const nextData = getData()
    setData([...nextData, { id: newRef.key, ...formValue }])
    setFormValue({
      engineModel: '',
      altMake: '',
      engineMake: '',
      controllerMode: '',
    })
    handleClose()
  }

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
    const db = getDatabase()
    update(ref(db, 'machinery/spares/' + id), {
      [key]: value,
    })
  }

  const handleEditState = (id) => {
    const nextData = Object.assign([], data)
    const activeItem = nextData.find((item) => item.id === id)
    activeItem.status = activeItem.status ? null : 'EDIT'
    setData(nextData)
  }

  const handleDeleteState = (id) => {
    const db = getDatabase()
    remove(ref(db, 'machinery/spares/' + id))
    setData(data.filter((item) => item.id !== id))
  }

  return (
    <>
      {/* add new Spare button */}
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New Spare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue}>
            <Form.Group>
              <Form.ControlLabel>Image</Form.ControlLabel>
              <Form.Control
                name="image"
                data={selectDataAvailable}
                accepter={ImageUploader}
                action="//jsonplaceholder.typicode.com/posts/"
              />
            </Form.Group>
            <Form.Group controlId="available-10">
              <Form.ControlLabel>Available</Form.ControlLabel>
              <Form.Control
                name="available"
                data={selectDataAvailable}
                accepter={SelectPicker}
              />
            </Form.Group>
            <Form.Group controlId="cost-10">
              <Form.ControlLabel>Cost</Form.ControlLabel>
              <Form.Control name="cost"/>
            </Form.Group>
            <Form.Group controlId="description-10">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control name="description"/>
            </Form.Group>
            <Form.Group controlId="model-10">
              <Form.ControlLabel>Model</Form.ControlLabel>
              <Form.Control
                name="model"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addDataToFirebase} appearance="primary">
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <FlexboxGrid justify="end" style={{ marginBottom: 10 }}>
        <FlexboxGrid.Item colspan={2}>
          <IconButton icon={<PlusIcon />} color="red" appearance="primary" onClick={handleOpen}>
            Add
          </IconButton>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {/* end of add new engine button */}
      {/* table */}
      <Table
        virtualized
        height={600}
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        headerHeight={50}
        bordered
        cellBordered
        onRowClick={(data) => {
          console.log(data)
        }}
        affixHorizontalScrollbar
      >
        <Column width={50} align="center" sortable fixed>
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: '40px' }}>
              <input
                type="checkbox"
                onChange={handleCheckAll}
                checked={checkedKeys.length === data.length}
              />
            </div>
          </HeaderCell>
          <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
        </Column>

        <Column width={70} align="center" fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Image</HeaderCell>
          <EditableCell dataKey="image" onChange={handleChange} />
        </Column>

        <Column width={200} sortable>
          <HeaderCell>Available</HeaderCell>
          <EditableCell dataKey="available" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Cost</HeaderCell>
          <EditableCell dataKey="cost" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Description</HeaderCell>
          <EditableCell dataKey="description" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Model</HeaderCell>
          <EditableCell dataKey="model" onChange={handleChange} />
        </Column>

        <Column width={200}>
          <HeaderCell>Edit</HeaderCell>
          <ActionCell dataKey="id" onClick={handleEditState} />
        </Column>
        <Column width={200}>
          <HeaderCell>Delete</HeaderCell>
          <DeleteCell dataKey="id" onClick={handleDeleteState} />
        </Column>
      </Table>
    </>
  )
}
export default SpareParts
