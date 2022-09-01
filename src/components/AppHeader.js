import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCardText,
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
// import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
          <CCardText>
            <strong>ServeMe</strong>
          </CCardText>
        </CHeaderBrand>
        <CHeaderNav></CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  )
}

export default AppHeader
