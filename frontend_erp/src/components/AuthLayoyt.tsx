import React from 'react'

const AuthLayoyt = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      <div className="auth-layout">
        {children}
      </div>
    </div>
  )
}

export default AuthLayoyt