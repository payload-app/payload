import React from 'react'
import { storiesOf } from '@storybook/react'
import HR from './'
import { brightRed } from '../style/color'

storiesOf('HR', module)
  .add('default', () => <HR />)
  .add('color=brightRed', () => <HR color={brightRed} />)
