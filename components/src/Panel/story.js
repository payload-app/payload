import React from 'react'
import { storiesOf } from '@storybook/react'
import Panel from './index'
import Text from '../Text'

storiesOf('Panel', module).add('default', () => (
  <Panel TitleComponent={<Text size={2.4}>Oh Hey</Text>}>
    <Text>Some Relevant Text Goes Here</Text>
  </Panel>
))
