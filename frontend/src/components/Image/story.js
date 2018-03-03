import React from 'react'
import { storiesOf } from '@storybook/react'
import Image from './index'

storiesOf('Image', module)
  .add('default', () => <Image src={'http://via.placeholder.com/350x350'} />)
  .add('circle', () => (
    <Image circle={true} src={'http://via.placeholder.com/350x350'} />
  ))
  .add('height = 10rem, width = 10rem', () => (
    <Image
      height={'10rem'}
      width={'10rem'}
      src={'http://via.placeholder.com/350x350'}
    />
  ))
