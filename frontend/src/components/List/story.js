import React from 'react'
import { storiesOf } from '@storybook/react'
import List from './index'

storiesOf('List', module).add('default', () => (
  <List items={['Apple', 'Orange', 'Banana']} />
))
