import React from 'react'
import { Select } from '../../../components'

export default ({ repoOwners, onChange, value }) => (
  <Select
    onChange={e => onChange({ value: JSON.parse(e.target.value) })}
    value={JSON.stringify(value)}
    options={repoOwners.map(owner => ({
      name: owner.name,
      value: JSON.stringify({
        name: owner.name,
        type: owner.type,
        ownerType: owner.ownerType,
        id: owner.id,
      }),
    }))}
  />
)
