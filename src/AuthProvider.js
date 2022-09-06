import React, { useEffect, useState } from 'react'
import { auth } from './firebase'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    })
  }, [])

  if (pending) {
    return (
      <div style={{ textAlign: 'center', marginTop: '10%' }}>
        <h1 className="text-white">Wait...</h1>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
