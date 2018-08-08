import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Select from './index'

const options = [
  { name: 'London', value: 'London' },
  { name: 'New York', value: 'New York' },
  { name: 'San Francisco', value: 'San Francisco' },
  { name: 'Tokyo', value: 'Tokyo' },
  {
    name: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch',
    value: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch',
  }, // http://www.fun-with-words.com/longest_place_names.html
]

storiesOf('Select', module)
  .add('default', () => (
    <Select options={options} onChange={action('on-change')} />
  ))
  .add('with value set', () => (
    <Select options={options} value={'Tokyo'} onChange={action('on-change')} />
  ))
