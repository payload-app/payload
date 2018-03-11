import React from 'react'
import RepoSelectorItem from '../RepoSelectorItem'

export default ({ repoOwners, onChange, value }) => {
  const handleSelect = value => () => onChange({ value })
  return (
    <div>
      {repoOwners.map(owner => (
        <div key={owner.id} style={{ cursor: 'pointer' }}>
          <RepoSelectorItem
            name={owner.name}
            active={JSON.stringify(owner) === JSON.stringify(value)}
            onClick={handleSelect(owner)}
          />
        </div>
      ))}
    </div>
  )
}
