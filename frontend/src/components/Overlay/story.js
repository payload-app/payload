import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Overlay from './index'
import Image from '../Image'

storiesOf('Overlay', module)
  .add('default', () => (
    <div style={{ textAlign: 'center' }}>
      <Image src={'http://via.placeholder.com/350x350'} />
      <Overlay onClick={action('overlay click')} />
    </div>
  ))
  .add('opacity=0', () => (
    <div style={{ textAlign: 'center' }}>
      <Image src={'http://via.placeholder.com/350x350'} />
      <Overlay onClick={action('overlay click')} opacity={0} />
    </div>
  ))
  .add('backgroundColor=red', () => (
    <div style={{ textAlign: 'center' }}>
      <Image src={'http://via.placeholder.com/350x350'} />
      <Overlay
        onClick={action('overlay click')}
        background={'red'}
        opacity={0.8}
      />
    </div>
  ))
