import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import Popover from './index'

const DemoPopover = ({ children }) => (
  <div
    style={{
      padding: '4rem',
      color: 'white',
      background: 'orange',
      fontSize: '3rem',
    }}
  >
    {children}
  </div>
)

const PopoverContainer = ({ children }) => (
  <div
    style={{
      position: 'relative',
      margin: '20rem 20rem',
      display: 'inline-block',
    }}
  >
    {children}
  </div>
)

storiesOf('Popover', module)
  .add('default', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=left', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'left'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=leftUp', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'leftUp'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=leftDown', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'leftDown'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=right', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'right'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=rightUp', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'rightUp'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=rightDown', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'rightDown'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=above', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'above'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=aboveRight', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'aboveRight'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=aboveLeft', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'aboveLeft'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=below', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'below'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=belowRight', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'belowRight'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('anchor=belowLeft', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover anchor={'belowLeft'}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
  .add('hidden', () => (
    <PopoverContainer>
      <Text weight={600}>An Anchor Point</Text>
      <Popover hidden={true}>
        <DemoPopover>Popover</DemoPopover>
      </Popover>
    </PopoverContainer>
  ))
