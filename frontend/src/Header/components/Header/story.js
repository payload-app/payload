import React from 'react'
import { storiesOf } from '@storybook/react'
import Header from './index'

storiesOf('Header', module)
  .add('default', () => <Header title={'Title'} subtitle={'Subtitle'} />)
  .add('other text', () => (
    <Header title={'Mission Dashboard'} subtitle={'Authenticating...'} />
  ))
  .add('title warning', () => (
    <Header
      title={'Source Code'}
      warning={'Located'}
      subtitle={'Unpacking JAR Files...'}
    />
  ))
  .add('no subtitle', () => <Header title={'No Subtitle'} />)
