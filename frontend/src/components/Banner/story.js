import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Banner from './index'

storiesOf('Banner', module)
  .add('default', () => (
    <Banner>Something is about to happen that you should know about</Banner>
  ))
  .add('type=warning', () => (
    <Banner type={'warning'}>
      Something is about to happen that you should know about
    </Banner>
  ))
  .add('type=error', () => (
    <Banner type={'error'}>
      Something is about to happen that you should know about
    </Banner>
  ))
  .add('w/ actionButton', () => (
    <Banner
      actionButton={{
        text: 'Do Something About It',
        onClick: e => {
          e.preventDefault()
          action('actionButtonClick')(e)
        },
      }}
    >
      Something is about to happen that you should know about
    </Banner>
  ))
  .add('type=warning, w/ actionButton', () => (
    <Banner
      type={'warning'}
      actionButton={{
        text: 'Do Something About It',
        onClick: e => {
          e.preventDefault()
          action('actionButtonClick')(e)
        },
      }}
    >
      Something is about to happen that you should know about
    </Banner>
  ))

  .add('type=error, w/ actionButton', () => (
    <Banner
      type={'error'}
      actionButton={{
        text: 'Do Something About It',
        onClick: e => {
          e.preventDefault()
          action('actionButtonClick')(e)
        },
      }}
    >
      Something is about to happen that you should know about
    </Banner>
  ))
