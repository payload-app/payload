import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Button from './'
import Text from '../Text'
import { IconGithub } from '../Icons'

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
  .add('withIcon', () => (
    <Button Icon={IconGithub}>Authenticate With Github</Button>
  ))
  .add('withIcon fontSize=2', () => (
    <Button Icon={IconGithub} fontSize={2}>
      Authenticate With Github
    </Button>
  ))
  .add('noStyle', () => (
    <Button noStyle={true} onClick={action('Button Click')}>
      <Text>I HAVE NO STYLE</Text>
    </Button>
  ))
  .add('fillContainer', () => (
    <Button Icon={IconGithub} fillContainer={true}>
      {"I'm HUGE"}
    </Button>
  ))
