/* eslint-disable prettier/prettier */
import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle } from '@coreui/react'
import React from 'react'

function AboutUs() {
  return (
    <div>
      <CCard>
        <CCardHeader>About Us</CCardHeader>
        <CCardBody>
          <CCardTitle>Serve Me</CCardTitle>
          <CCardText>
            We are a team of dedicated engineers and designers who are passionate about creating the
            best user experience for our customers.
          </CCardText>
        </CCardBody>
      </CCard>
    </div>
  )
}
export default AboutUs
