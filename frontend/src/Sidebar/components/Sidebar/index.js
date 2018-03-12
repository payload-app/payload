import React from 'react'
import { Link } from '../../../components'
import SidebarItem from '../SidebarItem'
import UserMenuItem from '../../../UserMenuItem'

const BackButton = ({ backUrl, onBackClick }) => {
  return (
    <div
      style={{
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {backUrl ? (
        <Link
          noStyle={true}
          onClick={e => onBackClick({ event: e, url: backUrl })}
        >
          « Back
        </Link>
      ) : null}
    </div>
  )
  return null
}

const handleSelect = ({ onChange, item, value }) => {
  if (JSON.stringify(item) !== JSON.stringify(value)) {
    onChange({ item })
  }
}

export default ({ items, backUrl, onBackClick, onChange, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <BackButton backUrl={backUrl} onBackClick={onBackClick} />
    <div style={{ flexGrow: 1 }}>
      {items.map(item => (
        <div key={item.key} style={{ cursor: 'pointer' }}>
          <SidebarItem
            active={JSON.stringify(item) === JSON.stringify(value)}
            onClick={() => handleSelect({ onChange, item, value })}
          >
            {item.display}
          </SidebarItem>
        </div>
      ))}
    </div>
    <UserMenuItem />
  </div>
)
