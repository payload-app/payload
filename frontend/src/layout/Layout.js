import React from 'react'

import { Header } from './'

export const Layout = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
)

export default Layout
