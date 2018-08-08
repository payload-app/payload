import React from 'react'
import ListItem from '../ListItem'

const style = {
  margin: 0,
  padding: 0,
  listStyleType: 'none',
}

export default ({ items }) => (
  <ul style={style}>
    {items.map((item, i) => (
      <ListItem key={item.id ? item.id : i}>
        {item.component ? item.component : item}
      </ListItem>
    ))}
  </ul>
)
