import React from 'react'
import { Link } from '../../../components'
import SidebarItem from '../SidebarItem'
import UserMenuItem from '../../../UserMenuItem'

const BackButton = ({ onBackClick }) => (
  <div
    style={{
      height: '4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Link noStyle={true} onClick={onBackClick}>
      « Back
    </Link>
  </div>
)

const handleSelect = ({ onChange, item, value, index, layer }) => {
  if (JSON.stringify(item) !== JSON.stringify(value)) {
    onChange({ index, layer, item })
  }
}

export default ({
  items,
  showBackButton,
  onBackClick,
  onChange,
  value,
  layer,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    {showBackButton ? <BackButton onBackClick={onBackClick} /> : null}
    <div style={{ flexGrow: 1 }}>
      {items.map((item, index) => (
        <div key={item.key} style={{ cursor: 'pointer' }}>
          <SidebarItem
            active={JSON.stringify(item) === JSON.stringify(value)}
            onClick={() =>
              handleSelect({ onChange, item, value, layer, index })
            }
          >
            {item.display}
          </SidebarItem>
        </div>
      ))}
    </div>
    <UserMenuItem />
  </div>
)
