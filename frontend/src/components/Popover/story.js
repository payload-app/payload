import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
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

storiesOf('Popover', module)
  .add('default', () => (
    <Popover onOverlayClick={action('overlay-click')}>
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('transparent Overlay', () => (
    <Popover onOverlayClick={action('overlay-click')} transparentOverlay>
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('left = 10rem', () => (
    <Popover onOverlayClick={action('overlay-click')} left={'10rem'}>
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('top = 10rem', () => (
    <Popover onOverlayClick={action('overlay-click')} top={'10rem'}>
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('top = 10rem left = 10rem', () => (
    <Popover
      onOverlayClick={action('overlay-click')}
      top={'10rem'}
      left={'10rem'}
    >
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('right = 10rem', () => (
    <Popover onOverlayClick={action('overlay-click')} right={'10rem'}>
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('bottom = 10rem', () => (
    <Popover onOverlayClick={action('overlay-click')} bottom={'10rem'}>
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
  .add('bottom = 10rem right = 10rem', () => (
    <Popover
      onOverlayClick={action('overlay-click')}
      bottom={'10rem'}
      right={'10rem'}
    >
      <DemoPopover>Popover</DemoPopover>
    </Popover>
  ))
