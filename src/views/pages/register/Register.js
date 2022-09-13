import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../../../firebase'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { db } from '../../../firebase'
import { Modal, Button, ButtonToolbar, Placeholder } from 'rsuite'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'

const Register = () => {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const handleOpen = (e) => {
    setOpen(true)
    if (typeof e === 'string') {
      setMessage(e)
    } else {
      setMessage(JSON.stringify(e.code).slice(1, -1))
    }
  }
  const handleClose = () => setOpen(false)

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //const [repeatPassword, setRepeatPassword] = useState('')
  const [username, setUserName] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault()
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            // Email verification sent!
            const db = getDatabase()
            set(ref(db, 'user/admin/' + userCredential.user.uid), {
              username,
              email,
              password,
            })

            handleOpen('Email verification sent!')
            navigate('/')
          })
          .catch((error) => {
            handleOpen(error)
          })
      })
      .catch((error) => {
        handleOpen(error)
      })
  }
  // auth
  //   .createUserWithEmailAndPassword(email, password)
  //   .then(() => {
  //     auth.currentUser
  //       .sendEmailVerification()
  //       .then(() => {
  //         db.collection('serveme-admin')
  //           .doc(auth.currentUser.uid)
  //           .set({
  //             email,
  //             password,
  //             username,
  //           })
  //           .then(() => {
  //             console.log('Document successfully written!')
  //           })
  //         handleOpen('Please check your email for verification')
  //         navigate('/')
  //       })
  //       .catch((err) => handleOpen(err))
  //   })
  //   .catch((err) => {
  //     handleOpen(err)
  //   })
  // }
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Plesae note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CCardBody>
            <p className="text-medium-emphasis">{message}</p>
          </CCardBody>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <h1>Register</h1>
                    <p className="text-medium-emphasis">Create your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {/* <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </CInputGroup> */}
                    <CRow>
                      <CCol xs={6}></CCol>
                      <CCol xs={6} className="text-right d-flex justify-content-end">
                        <Link to="/login">
                          <p className="text-medium-emphasis">Already have an account?</p>
                        </Link>
                      </CCol>
                    </CRow>
                    <div className="d-grid">
                      <CButton color="primary" onClick={handleSubmit}>
                        Create Account
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
