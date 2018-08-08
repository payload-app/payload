import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import { invertedText } from '../style/color'
import InvertedPanel from './index'

storiesOf('InvertedPanel', module)
  .add('default', () => (
    <InvertedPanel>
      <Text color={invertedText}>This is an inverted panel</Text>
    </InvertedPanel>
  ))
  .add('padding = 3', () => (
    <InvertedPanel padding={3}>
      <Text color={invertedText}>This is an inverted panel</Text>
    </InvertedPanel>
  ))
  .add('width = 60', () => (
    <InvertedPanel width={60}>
      <Text color={invertedText}>This is an inverted panel</Text>
    </InvertedPanel>
  ))
  .add('maxWidth = 60', () => (
    <InvertedPanel maxWidth={60}>
      <Text color={invertedText}>
        This is an inverted panel with a max width of 60
      </Text>
    </InvertedPanel>
  ))
