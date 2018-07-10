import React from 'react'
import { storiesOf } from '@storybook/react'
import Pulse from './index'
import Text from '../Text'

storiesOf('Pulse', module)
  .add('default', () => (
    <Pulse>
      <Text color={'#fff'} capitalize>
        Warning
      </Text>
    </Pulse>
  ))
  .add('backgroundColor = yellow', () => (
    <Pulse backgroundColor={'yellow'}>
      <Text color={'#fff'} capitalize>
        Warning
      </Text>
    </Pulse>
  ))
  .add('display=block', () => (
    <Pulse backgroundColor={'yellow'} display={'block'}>
      <Text color={'#fff'} capitalize>
        Warning
      </Text>
    </Pulse>
  ))
