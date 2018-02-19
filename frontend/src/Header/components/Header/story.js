import React from 'react'
import { storiesOf } from '@storybook/react'
import Header from './index'

storiesOf('Header', module)
  .add('default', () => (
    <Header title={'Title'} subtitle={'Subtitle'} mounted={true} />
  ))
  .add('other text', () => (
    <Header
      title={'Mission Dashboard'}
      subtitle={'Authenticating...'}
      mounted={true}
    />
  ))
  .add('title warning', () => (
    <Header
      title={'Source Code'}
      warning={'Located'}
      subtitle={'Unpacking JAR Files...'}
      mounted={true}
    />
  ))
  .add('no subtitle', () => <Header title={'No Subtitle'} mounted={true} />)
