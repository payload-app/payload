import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from './index'

storiesOf('Text', module)
  .add('default', () => <Text>default</Text>)
  .add('size = 2', () => <Text size={2}>Huge</Text>)
  .add('size = 0.5', () => <Text size={0.5}>Tiny</Text>)
  .add('color = red', () => <Text color={'red'}>red</Text>)
  .add('color = #ccc', () => <Text color={'#ccc'}>#ccc</Text>)
  .add('capitalize = true', () => (
    <Text capitalize={true}>converted to uppercase</Text>
  ))
  .add('weight = 600', () => <Text weight={600}>Bold</Text>)
  .add('antialiased = false', () => (
    <Text antialiased={false}>antialiased = false</Text>
  ))
