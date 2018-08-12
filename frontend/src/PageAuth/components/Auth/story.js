import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from 'react-redux'
import Auth from './index'
import { selector } from '../../../Header'

storiesOf('Auth', module)
  .addDecorator(getStory => {
    const store = {
      getState: () => ({
        [selector]: {
          title: 'Authentication',
          subtitle: 'Locating Source Code...',
          warning: 'Required',
          loading: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    }
    return <Provider store={store}>{getStory()}</Provider>
  })
  .add('default', () => <Auth />)
  .add('default error', () => <Auth errorCode={'1000'} />)
  .add('failed to auth error', () => <Auth errorCode={'1001'} />)
  .add('failed to reach github error', () => <Auth errorCode={'1002'} />)
