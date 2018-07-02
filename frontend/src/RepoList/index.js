import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import RepoList from './components/RepoList'
import { selector, actions } from './reducer'
import { generateRunRoute } from '../Routing'
import { selector as billingSelector } from '../Billing'
import { selector as sidebarSelector } from '../Sidebar'

const selectedBillingCustomer = ({ state }) => {
  const owner =
    state[sidebarSelector].repoOwners[state[sidebarSelector].selection]
  if (!owner) {
    return
  }
  return state[billingSelector].customers.find(
    customer =>
      customer.ownerId === owner.id && customer.ownerType === owner.ownerType,
  )
}

export default connect(
  state => ({
    repos: state[selector].repos,
    billingCustomer: selectedBillingCustomer({ state }),
    showPaymentOverlay: state[selector].showPaymentOverlay,
    stripePublicKey: state[billingSelector].stripePublicKey,
  }),
  dispatch => ({
    onActivateClick: ({ repo }) =>
      dispatch(
        dataFetchActions.fetch({
          name: 'activateRepo',
          args: {
            owner: repo.owner,
            repo: repo.repo,
            type: repo.type,
            planType: 'basic_20_usd', // TODO: we'll want a way to select this at some point
          },
        }),
      ),
    onRunClick: ({ repo }) =>
      dispatch(
        push(
          generateRunRoute({
            type: repo.type,
            ownerType: repo.ownerType,
            owner: repo.owner,
            repo: repo.repo,
            branch: repo.lastDefaultRun.branch,
            sha: repo.lastDefaultRun.sha,
          }),
        ),
      ),
    onBillingActionClick: () =>
      dispatch(actions.togglePaymentOverlay({ visible: true })),
    onPaymentOverlayClick: () =>
      dispatch(actions.togglePaymentOverlay({ visible: false })),
    onBillingCancelClick: () =>
      dispatch(actions.togglePaymentOverlay({ visible: false })),
    onBillingSubmit: ({ ownerId, ownerType, paymentSource }) =>
      dispatch(
        dataFetchActions.fetch({
          name: 'setPaymentSource',
          args: {
            ownerId,
            ownerType,
            paymentSource,
          },
        }),
      ),
  }),
)(RepoList)

export { default as middleware } from './middleware'
export { default as reducer, selector, actionTypes, actions } from './reducer'
