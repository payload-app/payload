import React from 'react'
import SidebarItem from '../SidebarItem'
import UserMenuItem from '../../../UserMenuItem'

export default ({ items, onChange, value }) => {
  const handleSelect = ({ item }) => () => {
    if (JSON.stringify(item) !== JSON.stringify(value)) {
      onChange({ item })
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        {items.map(item => (
          <div key={item.key} style={{ cursor: 'pointer' }}>
            <SidebarItem
              active={JSON.stringify(item) === JSON.stringify(value)}
              onClick={handleSelect({ item })}
            >
              {item.display}
            </SidebarItem>
          </div>
        ))}
      </div>
      <UserMenuItem />
    </div>
  )
}
