import React from 'react'
import { storiesOf } from '@storybook/react'
import ListItem from './index'
import Text from '../Text'

storiesOf('ListItem', module).add('default', () => (
  <ListItem>
    <Text>Bananas</Text>
  </ListItem>
))
