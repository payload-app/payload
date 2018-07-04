import React, { Fragment } from 'react'
import { Text } from '../../../components'

const SubscriptionListItem = ({ subscription, repos }) => (
  <Fragment>
    <Text>{JSON.stringify(subscription)}</Text>
    <Text>{JSON.stringify(repos)}</Text>
  </Fragment>
)

export default SubscriptionListItem
