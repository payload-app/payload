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
    showActivateConfirm: state[selector].showActivateConfirm,
    activateConfirmDetails: state[selector].activateConfirmDetails,
    stripePublicKey: state[billingSelector].stripePublicKey,
  }),
  dispatch => ({
    onActivateClick: ({ repo }) =>
      dispatch(
        actions.toggleActivateConfirm({
          visible: true,
          repoName: repo.repo,
          repoOwnerName: repo.owner,
          repoType: repo.type,
          currency: 'usd', // TODO: we'll want a way to select this at some point
          amount: 2000, // TODO: we'll want a way to select this at some point
        }),
      ),
    onActivateConfirmClick: ({ repoOwnerName, repoName, repoType }) => {
      dispatch(
        dataFetchActions.fetch({
          name: 'activateRepo',
          args: {
            owner: repoOwnerName,
            repo: repoName,
            type: repoType,
            planType: 'basic_20_usd', // TODO: we'll want a way to select this at some point
          },
        }),
      )
      dispatch(actions.toggleActivateConfirm({ visible: false }))
    },
    onActivateCancelClick: () =>
      dispatch(actions.toggleActivateConfirm({ visible: false })),
    onActivateConfirmDialogOverlayClick: () =>
      dispatch(actions.toggleActivateConfirm({ visible: false })),
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
    onBillingSubmit: ({ ownerId, ownerType, paymentSource, lastFour }) =>
      dispatch(
        dataFetchActions.fetch({
          name: 'setPaymentSource',
          args: {
            ownerId,
            ownerType,
            paymentSource,
            lastFour,
          },
        }),
      ),
  }),
)(RepoList)

export { default as middleware } from './middleware'
export { default as reducer, selector, actionTypes, actions } from './reducer'
