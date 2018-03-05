import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Provider } from 'react-redux'
import { selector } from '../../../Header'
import Settings from './'

storiesOf('Settings', module)
  .addDecorator(getStory => {
    const store = {
      getState: () => ({
        [selector]: {
          title: 'Settings',
          subtitle: 'Configuring User Telemetry',
          loading: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    }
    return <Provider store={store}>{getStory()}</Provider>
  })
  .add('default', () => (
    <Settings
      onResyncOrgsClick={action('Resync Orgs Click')}
      onResyncReposClick={action('Resync Repos Click')}
    />
  ))
  .add('loading', () => (
    <Settings
      onResyncOrgsClick={action('Resync Orgs Click')}
      organizationsLoading={true}
      onResyncReposClick={action('Resync Repos Click')}
      repositoriesLoading={true}
    />
  ))
