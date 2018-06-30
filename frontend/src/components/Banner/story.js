import React from 'react'
import { storiesOf } from '@storybook/react'
import Banner from './index'

storiesOf('Banner', module)
  .add('default', () => (
    <Banner>Something is about to happen that you should know about</Banner>
  ))
  .add('type=error', () => (
    <Banner type={'error'}>
      Something is about to happen that you should know about
    </Banner>
  ))
