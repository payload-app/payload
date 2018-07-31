import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from 'react-redux'
import PageInvited from './index'
import { selector } from '../../../Header'

storiesOf('PageInvited', module)
  .addDecorator(getStory => {
    const store = {
      getState: () => ({
        [selector]: {
          title: 'Invite Request Received',
          subtitle: "You're on the invite queue...",
          loading: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    }
    return <Provider store={store}>{getStory()}</Provider>
  })
  .add('default', () => <PageInvited invitesBefore={192} invitesAfter={3212} />)
