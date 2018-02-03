import React from 'react'
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Exo 2'],
  },
})

import { Header } from './'

export const Layout = ({ children }) => (
  <div style={{ fontFamily: '"Exo 2", sans-serif' }}>
    <Header />
    {children}
  </div>
)

export default Layout
