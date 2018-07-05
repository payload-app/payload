import React from 'react'
import { storiesOf } from '@storybook/react'
import SubscriptionList from './'
import subscriptions from './sampleData'
import repos from '../sampleRepoData'

storiesOf('SubscriptionList', module).add('default', () => (
  <SubscriptionList subscriptions={subscriptions} repos={repos} />
))
