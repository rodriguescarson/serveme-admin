//remains same
import React, { useEffect } from 'react'
import {
  IconButton,
  FlexboxGrid,
  Form,
  Schema,
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

// change form validation according to your needs
const model = Schema.Model({
  available: Schema.Types.StringType().isRequired('This field is required'),
  cost: Schema.Types.NumberType().isRequired('This field is required.'),
  description: Schema.Types.StringType(),
  model: Schema.Types.StringType().isRequired('This field is required.'),
})
// no changes
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />)
Textarea.displayName = 'Textarea'

const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = rowData.status === 'EDIT'
  return (
    <Cell {...props} className={editing ? 'table-content-editing' : ''}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={(event) => {
            onChange && onChange(rowData.id, dataKey, event.target.value)
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  )
}

const BaseCell = React.forwardRef((props, ref) => {
  const { children, rowData, ...rest } = props
  return (
    <Cell
      ref={ref}
      rowData={rowData}
      onDoubleClick={() => {
        console.log(rowData)
      }}
      {...rest}
    >
      {children}
    </Cell>
  )
})

BaseCell.displayName = 'BaseCell'

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => {
  return (
    <BaseCell {...props} style={{ padding: 0 }}>
      <div style={{ lineHeight: '46px' }}>
        <input
          type="checkbox"
          value={rowData[dataKey]}
          onChange={onChange}
          checked={checkedKeys.some((item) => item === rowData[dataKey])}
        />
      </div>
    </BaseCell>
  )
}

//edited
//edit 2
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

const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.id)
        }}
      >
        {rowData.status === 'EDIT' ? 'Save' : 'Edit'}
      </Button>
    </Cell>
  )
}

const DeleteCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.id)
        }}
      >
        {'Delete'}
      </Button>
    </Cell>
  )
}

const InputCell = memo(({ rowData, data, value, onChange, ...props }) => {
  function handleChange(event) {
    onChange(rowData.id, event.target.value)
  }

  return (
    <BaseCell {...props}>
      <input value={data[rowData.id]} onChange={handleChange} />
    </BaseCell>
  )
})

InputCell.displayName = 'InputCell'

// data.map((item) => {
//   return db
//     .collection('user')
//     .doc('one')
//     .set(item)
//     .then(() => {
//       console.log('Document successfully written!')
//     })
// })

const ImageCell = ({ rowData, dataKey, ...rest }) => (
  <Cell {...rest}>
    <img
      src={rowData[dataKey]}
      width="50"
      alt="avtar"
      style={{
        borderRadius: '50%',
        verticalAlign: 'middle',
        marginRight: '10px',
      }}
    />
  </Cell>
)

const SpareParts = () => {
  //table states
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])

  // useState for add user
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef()
  const [formValue, setFormValue] = React.useState({
    avatar_url: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    avatar: null,
    image: '',
    available: '',
    cost: '',
    description: '',
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

  // handle states for add
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
      partName: '',
      Eng_id: '',
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

  //change this - delete from firebase
  const handleDeleteState = (id) => {
    const db = getDatabase()
    remove(ref(db, 'machinery/spares/' + id))
    setData(data.filter((item) => item.id !== id))
  }

  return (
    <>
      {/* add new user button */}
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New Spare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid ref={formRef} model={model} onChange={setFormValue} formValue={formValue}>
            <TextField
              cid="image"
              name="image"
              label="Profile Picture"
              accepter={ImageUploader}
              action="//jsonplaceholder.typicode.com/posts/"
            />
            <TextField cid="available-9" name="available" label="Available" />
            <TextField cid="cost-9" name="cost" label="Cost" />
            {/* <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group> */}
            <TextField cid="description-9" name="description" label="Description" type="text" />
            <TextField cid="model-9" name="model" label="Model" type="number" />
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
      {/* end of add new user button */}
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

        <Column width={70} fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column width={130} fixed>
          <HeaderCell>Avatar</HeaderCell>
          <ImageCell dataKey="image" />
        </Column>
        <Column width={200}>
          <HeaderCell>Available</HeaderCell>
          <EditableCell dataKey="available" onClick={handleEditState} />
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
          <DeleteCell dataKey="id" onClick={handleShowDeleteModal} />
        </Column>
      </Table>
      {/* // no changes */}
      {/* Delete Modal */}
      <Modal open={deleteUserModal} onClose={handleCloseDeleteModal}>
        <Modal.Header>
          <Modal.Title>Delete Spare</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleDeleteState(deleteId)
              handleCloseDeleteModal()
            }}
            appearance="primary"
          >
            Confirm
          </Button>
          <Button onClick={handleCloseDeleteModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default SpareParts
