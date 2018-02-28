import React from 'react'
import { storiesOf } from '@storybook/react'
import Icon from './index'
import { red } from '../style/color'

storiesOf('Icon', module)
  .add('default', () => (
    <Icon>
      <circle cx="8" cy="8" r="8" />
    </Icon>
  ))
  .add('red', () => (
    <Icon color={red}>
      <circle cx="8" cy="8" r="8" />
    </Icon>
  ))
  .add('height = 3 width = 3', () => (
    <Icon height={3} width={3}>
      <circle cx="8" cy="8" r="8" />
    </Icon>
  ))
