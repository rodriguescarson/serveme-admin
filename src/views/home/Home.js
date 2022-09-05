/* eslint-disable prettier/prettier */
import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'
import { cilUser, cilBriefcase, cilCog, cilCasino, cilList } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { NavLink } from 'react-router-dom'
const Home = () => {
  return (
    <>
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>User Dashboard</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                <CIcon icon={cilUser} size="9xl" />
              </CCol>
              <CCardText>
                Add, Modify, Delete, View Users
                {/* <CListGroup>
                                    <CListGroupItem>
                                        <CNav>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Add</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Modify</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Delete</span>
                                                </CNavLink>
                                            </CNavItem>
                                        </CNav>
                                    </CListGroupItem>
                                </CListGroup> */}
              </CCardText>
              <NavLink to="/users">
                <CButton color="primary" size="sm">
                  <CIcon icon={cilUser} />
                  <span className="ml-2">Users</span>
                </CButton>
              </NavLink>
            </CCardBody>
            <CCardFooter>
              <small className="text-medium-emphasis">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
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
                <CIcon icon={cilCog} size="xxl" />
              </CCol>
              <CCardText>Add, Modify, Delete, View Spare Parts</CCardText>
              {/* <CListGroup>
                                    <CListGroupItem>
                                        <CNav>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Add</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Modify</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Delete</span>
                                                </CNavLink>
                                            </CNavItem>
                                        </CNav>
                                    </CListGroupItem>
                                </CListGroup> */}

              <NavLink to="/spareparts">
                <CButton color="primary" size="sm">
                  <CIcon icon={cilCog} />
                  <span className="ml-2">Spare Parts</span>
                </CButton>
              </NavLink>
            </CCardBody>
            <CCardFooter>
              <small className="text-medium-emphasis">Last updated 3 mins ago</small>
            </CCardFooter>
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
                <CIcon icon={cilBriefcase} size="9xl" />
              </CCol>
              <CCardText>
                Add, Modify, Delete, View Gensets
                {/* <CListGroup>
                                    <CListGroupItem>
                                        <CNav>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Add</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Modify</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Delete</span>
                                                </CNavLink>
                                            </CNavItem>
                                        </CNav>
                                    </CListGroupItem>
                                </CListGroup> */}
              </CCardText>
              <NavLink to="/gensets">
                <CButton color="primary" size="sm">
                  <CIcon icon={cilBriefcase} />
                  <span className="ml-2">Gensets</span>
                </CButton>
              </NavLink>
            </CCardBody>
            <CCardFooter>
              <small className="text-medium-emphasis">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>Service List</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                <CIcon icon={cilList} size="9xl" />
              </CCol>
              <CCardText>
                Add, Modify, Delete, View Service Lists
                {/* <CListGroup>
                                    <CListGroupItem>
                                        <CNav>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Add</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Modify</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Delete</span>
                                                </CNavLink>
                                            </CNavItem>
                                        </CNav>
                                    </CListGroupItem>
                                </CListGroup> */}
              </CCardText>
              <NavLink to="/servicelists">
                <CButton color="primary" size="sm">
                  <CIcon icon={cilList} />
                  <span className="ml-2"> Service List</span>
                </CButton>
              </NavLink>
            </CCardBody>
            <CCardFooter>
              <small className="text-medium-emphasis">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardBody>
              <CCardTitle>Engine Dashboard</CCardTitle>
              <CCol
                style={{ display: 'flex', margin: 'auto' }}
                xs={6}
                sm={4}
                md={3}
                xl={2}
                key={'cas'}
              >
                <CIcon icon={cilCasino} size="9xl" />
              </CCol>
              <CCardText>
                Add, Modify, Delete, View Engines
                {/* <CListGroup>
                                    <CListGroupItem>
                                        <CNav>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Add</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Modify</span>
                                                </CNavLink>
                                            </CNavItem>
                                            <CNavItem>
                                                <CNavLink href="#">
                                                    <CIcon icon={cilUser} size="lg" />
                                                    <span>Delete</span>
                                                </CNavLink>
                                            </CNavItem>
                                        </CNav>
                                    </CListGroupItem>
                                </CListGroup> */}
              </CCardText>
              <NavLink to="/engines">
                <CButton color="primary" size="sm">
                  <CIcon icon={cilUser} />
                  <span className="ml-2">Engines</span>
                </CButton>
              </NavLink>
            </CCardBody>
            <CCardFooter>
              <small className="text-medium-emphasis">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Home
