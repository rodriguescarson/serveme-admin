import React, { useState, useEffect, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { AuthProvider } from './AuthProvider'
import { auth } from './firebase'
import 'rsuite/dist/rsuite.min.css'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
      }
    })
  }, [])
  return (
    <>
      {isLoggedIn ? (
        <HashRouter>
          <Suspense fallback={loading}>
            <AuthProvider>
              <Routes>
                <Route exact path="/404" name="Page 404" element={<Page404 />} />
                <Route exact path="/500" name="Page 500" element={<Page500 />} />
                <Route path="*" name="Home" element={<DefaultLayout />} />
              </Routes>
            </AuthProvider>
          </Suspense>
        </HashRouter>
      ) : (
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/" name="Login Page" element={<Login />} />
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
            </Routes>
          </Suspense>
        </HashRouter>
      )}
    </>
  )
}
export default App
