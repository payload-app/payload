import React from 'react'
import Color from 'color'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import { text, background, red } from './color'

const ColorPanel = ({ color }) => (
  <div
    style={{
      background: color,
      height: '10rem',
      maxWidth: '10rem',
      flex: 1,
    }}
  >
    <Text color={Color(color).isDark() ? text : background}>{color}</Text>
  </div>
)

storiesOf('color', module).add('colors', () => (
  <div style={{ display: 'flex' }}>
    <ColorPanel color={text} />
    <ColorPanel color={background} />
    <ColorPanel color={red} />
  </div>
))
