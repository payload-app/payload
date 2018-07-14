import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import { invertedText } from '../style/color'
import InvertedPanel from './index'

storiesOf('InvertedPanel', module).add('default', () => (
  <InvertedPanel>
    <Text color={invertedText}>This is an inverted panel</Text>
  </InvertedPanel>
))
