import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Link from './index'

storiesOf('Link', module)
  .add('default', () => (
    <Link onClick={action('Link Click')}>{'https://google.com'}</Link>
  ))
  .add('size = 2', () => <Link size={2}>Huge</Link>)
  .add('size = 0.5', () => <Link size={0.5}>Tiny</Link>)
  .add('color = red', () => <Link color={'red'}>red</Link>)
  .add('color = #ccc', () => <Link color={'#ccc'}>#ccc</Link>)
  .add('capitalize = true', () => (
    <Link capitalize={true}>converted to uppercase</Link>
  ))
  .add('weight = 600', () => <Link weight={600}>Bold</Link>)
  .add('antialiased = false', () => (
    <Link antialiased={false}>antialiased = false</Link>
  ))
