import React from 'react'
import { storiesOf } from '@storybook/react'
import SubscriptionListItem from './'
import subscription from './sampleData'
import repos from '../sampleRepoData'

storiesOf('SubscriptionListItem', module).add('default', () => (
  <SubscriptionListItem subscription={subscription} repos={repos} />
))
