import React from 'react'
import { storiesOf } from '@storybook/react'
import Banner from './index'
import Text from '../Text'

storiesOf('Banner', module).add('default', () => (
  <Banner>
    <Text>Something is about to happen that you should know about</Text>
  </Banner>
))
