/* eslint-disable prettier/prettier */
import React from 'react'
import { CButton, CCard, CCardBody, CCardText, CCardTitle, CCol, CRow } from '@coreui/react'
import { cilUser, cilCog, cilCasino, cilList } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { NavLink } from 'react-router-dom'
const Home = () => {
  return (
    <>
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>Spare Dashboard</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                {/* increase size of CIcon */}
                <CIcon
                  icon={cilCog}
                  customClassName="c-icon-xl"
                  style={{ margin: 'auto', marginBlock: 60 }}
                />
              </CCol>
              <NavLink
                to="/spareparts"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CButton
                  color="primary"
                  style={{
                    width: '100%',
                  }}
                >
                  <CIcon icon={cilCog} />
                  <span className="ml-2">Spare Parts</span>
                </CButton>
              </NavLink>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>Service Schedule</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                <CIcon
                  icon={cilList}
                  customClassName="c-icon-xl"
                  style={{ margin: 'auto', marginBlock: 60 }}
                />
              </CCol>
              <CCardText></CCardText>
              <NavLink
                to="/serviceschedule"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CButton
                  color="primary"
                  style={{
                    width: '100%',
                  }}
                >
                  <CIcon icon={cilList} />
                  <span className="ml-2"> Service Schedule</span>
                </CButton>
              </NavLink>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>Genset Dashboard</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                <CIcon
                  icon={cilCasino}
                  customClassName="c-icon-xl"
                  style={{ margin: 'auto', marginBlock: 60 }}
                />
              </CCol>
              <CCardText></CCardText>
              {/* center NavLink */}
              <NavLink
                to="/Gensets"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CButton
                  color="primary"
                  style={{
                    width: '100%',
                  }}
                >
                  <CIcon icon={cilUser} />
                  <span className="ml-2">Gensets</span>
                </CButton>
              </NavLink>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>Services</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                <CIcon
                  icon={cilCasino}
                  customClassName="c-icon-xl"
                  style={{ margin: 'auto', marginBlock: 60 }}
                />
              </CCol>
              <CCardText></CCardText>
              {/* center NavLink */}
              <NavLink
                to="/services"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CButton
                  color="primary"
                  style={{
                    width: '100%',
                  }}
                >
                  <CIcon icon={cilUser} />
                  <span className="ml-2">Services</span>
                </CButton>
              </NavLink>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Home
