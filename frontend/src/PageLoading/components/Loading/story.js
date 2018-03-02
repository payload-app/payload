import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from 'react-redux'
import Loading from './index'
import { selector } from '../../../Header'

storiesOf('Loading', module)
  .addDecorator(getStory => {
    const store = {
      getState: () => ({
        [selector]: {
          title: 'Loading',
          subtitle: 'Doing Loading Things...',
          warning: ':D :D :D',
          loading: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    }
    return <Provider store={store}>{getStory()}</Provider>
  })
  .add('default', () => <Loading />)
