import { connect } from 'react-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import { selector, actions } from './reducer'
import { selector as sidebarSelector } from '../Sidebar'
import { selector as billingSelector } from '../Billing'
import BillingList from './components/BillingList'

export default connect(
  state => ({
    billingCustomers: state[selector].customers,
    repoOwners: state[sidebarSelector].repoOwners,
    repos: state[selector].repos,
    loading: state[selector].loadingAllRepos,
    selectedBillingCustomer: state[selector].selectedBillingCustomer,
    showPaymentOverlay: state[selector].showPaymentOverlay,
    stripePublicKey: state[billingSelector].stripePublicKey,
  }),
  dispatch => ({
    onSetPaymentSourceClick: ({ billingCustomer: { _id: id } }) => {
      dispatch(actions.selectBillingCustomer({ id }))
      dispatch(actions.togglePaymentOverlay({ visible: true }))
    },
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
    onDeactivateClick: ({
      billingCustomer: { ownerId, ownerType },
      subscription: { repoId },
    }) =>
      dispatch(
        dataFetchActions.fetch({
          name: 'deactivateRepo',
          args: {
            ownerId,
            ownerType,
            repoId,
          },
        }),
      ),
  }),
)(BillingList)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
