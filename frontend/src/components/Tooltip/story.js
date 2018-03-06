import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import Tooltip from './'

storiesOf('Tooltip', module)
  .add('default', () => (
    <Tooltip>
      <Text weight={400}>What is a Tooltip?</Text>
    </Tooltip>
  ))
  .add('width = 20rem', () => (
    <Tooltip width={'20rem'}>
      <Text weight={400}>What is a Tooltip?</Text>
    </Tooltip>
  ))
