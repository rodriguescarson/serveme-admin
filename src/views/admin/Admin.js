/* eslint-disable prettier/prettier */
import React, { memo, useEffect } from 'react'
import {
  IconButton,
  ButtonToolbar,
  ButtonGroup,
  FlexboxGrid,
  Form,
  Button,
  Input,
  Modal,
  SelectPicker,
  Uploader,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import { faker } from '@faker-js/faker'
import { db } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

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

//change this
function createRows() {
  const rows = []

  for (let i = 0; i < 50; i++) {
    const admin = {
      a_id: i,
      userName: faker.name.userName(),
      password: faker.password.password(),
      email: faker.internet.exampleEmail()
    }
    rows.push(admin)
  }

  // const users = await db
  //   .collection('user')
  //   .get()
  //   .then((querySnapshot) => {
  //     querySnapshot.docs.map((doc) => {
  //       rows.push(doc.data())
  //       return doc.data()
  //     })
  //   })
  // console.log('LOG 2', users)
  // console.log(rows)
  return rows
}

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

const Admin = () => {
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState(createRows())
  // useState for add user
  const [open, setOpen] = React.useState(false)
  const [formValue, setFormValue] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    'add-1': '',
    'add-2': '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    district: '',
  })

  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

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
  //change this
  const handleChange = (a_id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.a_id === a_id)[key] = value
    setData(nextData)
  }
  const handleEditState = (id) => {
    const nextData = Object.assign([], data)
    const activeItem = nextData.find((item) => item.id === id)
    activeItem.status = activeItem.status ? null : 'EDIT'
    setData(nextData)
  }

  //change this
  const handleDeleteState = (a_id) => {
    setData(data.filter((item) => item.a_id !== a_id))
  }
  return (
    <>
      {/* add new user button */}
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormValue} formValue={formValue}>
            <Form.Group controlId="uploader">
              <Form.ControlLabel>Profile Picture:</Form.ControlLabel>
              <Form.Control name="uploader" accepter={Uploader} action="#" />
            </Form.Group>
            <Form.Group controlId="firstName-9">
              <Form.ControlLabel>First Name</Form.ControlLabel>
              <Form.Control name="firstName" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="lastName-9">
              <Form.ControlLabel>Last Name</Form.ControlLabel>
              <Form.Control name="lastName" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="email-9">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="contactNumber-9">
              <Form.ControlLabel>contactNumber</Form.ControlLabel>
              <Form.Control name="contactNumber" type="number" />
            </Form.Group>
            {/* <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group> */}
            <Form.Group controlId="add-1-9">
              <Form.ControlLabel>Address 1</Form.ControlLabel>
              <Form.Control name="add-1" type="text" />
            </Form.Group>
            <Form.Group controlId="add-2-9">
              <Form.ControlLabel>Address 2</Form.ControlLabel>
              <Form.Control name="add-2" type="text" />
            </Form.Group>
            <Form.Group controlId="pincode-9">
              <Form.ControlLabel>Pincode</Form.ControlLabel>
              <Form.Control name="pincode" type="number" />
            </Form.Group>
            <Form.Group controlId="state-10">
              <Form.ControlLabel>State</Form.ControlLabel>
              <Form.Control name="state" data={selectDataState} accepter={SelectPicker} />
            </Form.Group>
            <Form.Group controlId="district-10">
              <Form.ControlLabel>District</Form.ControlLabel>
              <Form.Control name="district" data={selectDataDistrict} accepter={SelectPicker} />
            </Form.Group>
            <Form.Group controlId="city-10">
              <Form.ControlLabel>City</Form.ControlLabel>
              <Form.Control name="city" data={selectDataCity} accepter={SelectPicker} />
            </Form.Group>
            <Form.Group controlId="country-10">
              <Form.ControlLabel>Country</Form.ControlLabel>
              <Form.Control name="country" data={selectDataCountry} accepter={SelectPicker} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
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
        onRowClick={(data) => {
          console.log(data)
        }}
        affixHorizontalScrollbar
      >
        <Column width={50} align="center" sortable>
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
        <Column width={130} fixed>
          <HeaderCell>Avatar</HeaderCell>
          <ImageCell dataKey="avatar" />
        </Column>
        <Column width={100} sortable>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Email</HeaderCell>
          <EditableCell dataKey="email" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>contactNumber</HeaderCell>
          <EditableCell dataKey="contactNumber" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Address 1</HeaderCell>
          <EditableCell dataKey="add_1" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Address 2</HeaderCell>
          <EditableCell dataKey="add_2" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Pincode</HeaderCell>
          <EditableCell dataKey="pincode" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>District</HeaderCell>
          <EditableCell dataKey="district" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>City</HeaderCell>
          <EditableCell dataKey="city" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>State</HeaderCell>
          <EditableCell dataKey="state" onChange={handleChange} />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Country</HeaderCell>
          <EditableCell dataKey="country" onChange={handleChange} />
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
export default Admin
