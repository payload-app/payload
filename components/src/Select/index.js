import React from 'react'

export default ({ options, value, onChange }) => (
  <select onChange={onChange} value={value}>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.name}
      </option>
    ))}
  </select>
)
