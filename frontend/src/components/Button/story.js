import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Button from './index'

storiesOf('Button', module)
  .add('default', () => (
    <Button onClick={action('Button Click')}>Activate?</Button>
  ))
  .add('disabled', () => (
    <Button onClick={action('Button Click')} disabled={true}>
      Activating...
    </Button>
  ))
  .add('fontSize=2', () => (
    <Button fontSize={2} onClick={action('Button Click')}>
      Activate?
    </Button>
  ))
