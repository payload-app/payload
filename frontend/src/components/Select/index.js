import React from 'react'

export default ({ options, onChange }) => (
  <select onChange={onChange}>
    {options.map(option => (
      <option key={option.value.toString()}>{option.name}</option>
    ))}
  </select>
)
