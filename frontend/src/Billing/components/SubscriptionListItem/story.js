import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import SubscriptionListItem from './'
import subscription from './sampleData'
import repos from '../sampleRepoData'

storiesOf('SubscriptionListItem', module).add('default', () => (
  <SubscriptionListItem
    subscription={subscription}
    repos={repos}
    onDeactivateClick={action('onDeactivateClick')}
  />
))
