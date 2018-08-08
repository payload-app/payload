import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import Button from '../Button'
import PopoverContainer from './'

const MyPopover = ({ onHidePopover }) => (
  <div
    style={{
      background: 'red',
    }}
  >
    <Button onClick={onHidePopover} noStyle={true}>
      <Text>Some Popover Text</Text>
    </Button>
  </div>
)
const MyAnchor = ({ onShowPopover }) => (
  <Button onClick={onShowPopover} noStyle={true}>
    <Text>Some Anchor Text</Text>
  </Button>
)

storiesOf('PopoverContainer', module)
  .add('default', () => (
    <div style={{ display: 'inline-block', margin: '10rem' }}>
      <PopoverContainer
        PopoverComponent={MyPopover}
        AnchorComponent={MyAnchor}
      />
    </div>
  ))
  .add('popoverAnchor=leftDown', () => (
    <div style={{ display: 'inline-block', margin: '10rem' }}>
      <PopoverContainer
        PopoverComponent={MyPopover}
        AnchorComponent={MyAnchor}
        popoverAnchor={'leftDown'}
      />
    </div>
  ))
