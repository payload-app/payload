import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import SidebarItem from './'

storiesOf('SidebarItem', module)
  .add('default', () => <SidebarItem>TestBigOrg</SidebarItem>)
  .add('onClick fire action', () => (
    <SidebarItem onClick={action('on-click')}>TestBigOrg</SidebarItem>
  ))
  .add('active = true', () => (
    <SidebarItem active={true}>TestBigOrg</SidebarItem>
  ))
