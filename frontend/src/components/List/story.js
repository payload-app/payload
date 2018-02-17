/* eslint */
import React from 'react'
import { storiesOf } from '@storybook/react'
import List from './index'
import Text from '../Text'

storiesOf('List', module).add('default', () => (
  <List
    items={[
      <Text key={1}>{'Apple'}</Text>,
      <Text key={2}>{'Orange'}</Text>,
      <Text key={3}>{'Banana'}</Text>,
    ]}
  />
))
