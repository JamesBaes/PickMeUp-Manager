import React from 'react'

const Layout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className="flex-1">
      {children}
    </div>
  )
}

export default Layout