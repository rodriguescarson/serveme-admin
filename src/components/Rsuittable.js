import React, { memo } from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import { faker } from '@faker-js/faker'
import Whisper from 'rsuite/Whisper'
import Popover from 'rsuite/Popover'

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

const NameCell = ({ rowData, dataKey, ...props }) => {
  const speaker = (
    <Popover title="Description">
      <p>
        <b>Name:</b> {`${rowData.firstName} ${rowData.lastName}`}{' '}
      </p>
      <p>
        <b>Email:</b> {rowData.email}{' '}
      </p>
      <p>
        <b>Company:</b> {rowData.companyName}{' '}
      </p>
      <p>
        <b>Sentence:</b> {rowData.sentence}{' '}
      </p>
    </Popover>
  )

  return (
    <BaseCell rowData={rowData} {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a>{rowData[dataKey].toLocaleString()}</a>
      </Whisper>
    </BaseCell>
  )
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
  function handleAction() {
    alert(`id:${rowData[dataKey]}`)
    console.log(rowData, dataKey)
  }

  return (
    <BaseCell {...props}>
      <a onClick={handleAction}> Edit </a>|<a onClick={handleAction}> Remove </a>
    </BaseCell>
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

function createRows() {
  const now = Date.now()
  const rows = []

  for (let i = 0; i < 1000; i++) {
    rows.push({
      id: i,
      title: `Task #${i + 1}`,
      companyName: faker.company.name(),
      area: faker.name.jobArea(),
      country: faker.address.country(),
      contact: faker.internet.exampleEmail(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      progress: Math.random() * 100,
      startTimestamp: now - Math.round(Math.random() * 1e10),
      endTimestamp: now + Math.round(Math.random() * 1e10),
      budget: 500 + Math.random() * 10500,
      transaction: faker.finance.transactionType(),
      account: faker.finance.iban(),
      version: faker.system.semver(),
      available: Math.random() > 0.5,
      avatar: faker.image.avatar(),
      age: Math.round(Math.random() * 100),
      sentence: faker.lorem.sentence(),
    })
  }

  return rows
}

const data = createRows()

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

const Resuittable = () => {
  const [checkedKeys, setCheckedKeys] = React.useState([])
  const [sortColumn, setSortColumn] = React.useState()
  const [sortType, setSortType] = React.useState()
  const [loading, setLoading] = React.useState(false)
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

  return (
    <>
      <Table
        virtualized
        height={420}
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        headerHeight={50}
        onRowClick={(data) => {
          console.log(data)
        }}
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
        <Column width={100} resizable>
          <HeaderCell>Avartar</HeaderCell>
          <ImageCell dataKey="avatar" />
        </Column>
        <Column width={70} align="center" fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column width={160}>
          <HeaderCell>Company</HeaderCell>
          <NameCell dataKey="companyName" />
        </Column>
        <Column width={130} fixed sortable>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Gender</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Age</HeaderCell>
          <Cell dataKey="age" />
        </Column>
        <Column width={100} sortable resizable>
          <HeaderCell>Email</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return <a href={`mailto:${rowData.email}`}>{rowData.email}</a>
            }}
          </Cell>
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={200}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell dataKey="id" />
        </Column>
      </Table>
    </>
  )
}
export default Resuittable
