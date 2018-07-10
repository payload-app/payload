import React from 'react'
import { mutedWhite } from '../style/color'

const Panel = ({ TitleComponent, children }) => (
  <div style={{ display: 'flex' }}>
    <div
      style={{
        borderTop: `1px solid ${mutedWhite}`,
        borderLeft: `1px solid ${mutedWhite}`,
        borderBottom: `1px solid ${mutedWhite}`,
        width: 9,
        marginTop: '1.5em',
        marginRight: 8,
      }}
    />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex' }}>
        {TitleComponent}
        <div
          style={{
            flex: 1,
            borderTop: `1px solid ${mutedWhite}`,
            marginTop: '1.5em',
            marginLeft: 8,
          }}
        />
      </div>

      <div style={{ paddingTop: 10, paddingBottom: 20 }}>{children}</div>
    </div>
    <div
      style={{
        borderTop: `1px solid ${mutedWhite}`,
        borderRight: `1px solid ${mutedWhite}`,
        width: 9,
        height: 9,
        marginTop: '1.5em',
        marginRight: 8,
      }}
    />
  </div>
)

export default Panel
