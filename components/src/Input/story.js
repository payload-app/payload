import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Input from './index'

storiesOf('Input', module)
  .add('default', () => (
    <Input value={'some input'} onChange={action('Input Change')} />
  ))
  .add('huge', () => (
    <Input
      fontSize={3}
      value={'some input'}
      onChange={action('Input Change')}
    />
  ))
  .add('small', () => (
    <Input
      fontSize={1}
      value={'some input'}
      onChange={action('Input Change')}
    />
  ))
  .add('background=red', () => (
    <Input
      background={'red'}
      value={'some input'}
      onChange={action('Input Change')}
    />
  ))
  .add('color=red', () => (
    <Input
      color={'red'}
      value={'some input'}
      onChange={action('Input Change')}
    />
  ))
  .add('fillContainer=false', () => (
    <Input
      fillContainer={false}
      value={'some input'}
      onChange={action('Input Change')}
    />
  ))
  .add('placeholder', () => (
    <Input
      placeholder={'holding this place...'}
      onChange={action('Input Change')}
    />
  ))
  .add('disabled', () => (
    <Input
      value={'this is disabled'}
      disabled={true}
      onChange={action('Input Change')}
    />
  ))
  .add('focused', () => (
    <Input
      value={'this is focused'}
      focused={true}
      onChange={action('Input Change')}
      onFocus={action('Input Focus')}
      onBlur={action('Input Blur')}
    />
  ))
  .add('required', () => (
    <Input
      value={'this is required'}
      required={true}
      onChange={action('Input Change')}
    />
  ))
