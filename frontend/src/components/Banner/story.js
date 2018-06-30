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
  .add('w/ actionLink', () => (
    <Banner
      actionLink={{
        text: 'Do Something About It',
        href: '#',
        onClick: e => {
          e.preventDefault()
          action('actionLinkClick')(e)
        },
      }}
    >
      Something is about to happen that you should know about
    </Banner>
  ))
  .add('type=warning, w/ actionLink', () => (
    <Banner
      type={'warning'}
      actionLink={{
        text: 'Do Something About It',
        href: '#',
        onClick: e => {
          e.preventDefault()
          action('actionLinkClick')(e)
        },
      }}
    >
      Something is about to happen that you should know about
    </Banner>
  ))

  .add('type=error, w/ actionLink', () => (
    <Banner
      type={'error'}
      actionLink={{
        text: 'Do Something About It',
        href: '#',
        onClick: e => {
          e.preventDefault()
          action('actionLinkClick')(e)
        },
      }}
    >
      Something is about to happen that you should know about
    </Banner>
  ))
