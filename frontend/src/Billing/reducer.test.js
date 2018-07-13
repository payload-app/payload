import deepFreeze from 'deep-freeze'
import reducer from './reducer'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

describe('reducer', () => {
  it('should set inital state', () => {
    const stateBefore = undefined
    const action = {
      type: 'INIT',
    }
    const stateAfter = {
      stripePublicKey: null,
      customers: [],
      repos: [],
      loadingAllRepos: true,
    }
    expect(reducer(stateBefore, deepFreeze(action))).toEqual(stateAfter)
  })

  describe('getRepos', () => {
    it('should handle FETCH_START', () => {
      const stateBefore = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getRepos_${dataFetchActionTypes.FETCH_START}`,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_SUCCESS', () => {
      const fakeResult = [{ id: 1 }, { id: 2 }]
      const stateBefore = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getRepos_${dataFetchActionTypes.FETCH_SUCCESS}`,
        result: fakeResult,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [],
        repos: fakeResult,
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })
  })

  describe('getStripePublicKey', () => {
    it('should handle FETCH_SUCCESS', () => {
      const fakeResult = 'some_stripe_token'
      const stateBefore = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getStripePublicKey_${dataFetchActionTypes.FETCH_SUCCESS}`,
        result: fakeResult,
      }
      const stateAfter = {
        stripePublicKey: fakeResult,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })
  })

  describe('getBillingCustomer', () => {
    it('should handle FETCH_START', () => {
      const fakeArgs = {
        ownerId: 'some_owner_id',
        ownerType: 'organization',
      }
      const stateBefore = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomer_${dataFetchActionTypes.FETCH_START}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: true,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_START with existing customers', () => {
      const fakeArgs = {
        ownerId: '5b1ff3146751a90024e3d523',
        ownerType: 'organization',
      }
      const fakeCustomers = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: fakeCustomers,
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomer_${dataFetchActionTypes.FETCH_START}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeCustomers.map(customer => {
          if (customer.ownerId === fakeArgs.ownerId) {
            return {
              ...customer,
              loading: true,
            }
          }
          return customer
        }),
        repos: [],
        loadingAllRepos: false,
      }
      const result = reducer(deepFreeze(stateBefore), deepFreeze(action))
      // sort the customers for easier equality comparison
      result.customers.sort((a, b) => {
        return a.ownerId.localeCompare(b.ownerId)
      })
      expect(result).toEqual(stateAfter)
    })

    it('should handle FETCH_SUCCESS', () => {
      const fakeArgs = {
        ownerId: 'some_owner_id',
        ownerType: 'organization',
      }
      const stateBefore = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: true,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomer_${dataFetchActionTypes.FETCH_SUCCESS}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: false,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_SUCCESS with existing customers', () => {
      const fakeArgs = {
        ownerId: '5b1ff3146751a90024e3d523',
        ownerType: 'organization',
      }
      const fakeCustomers = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          loading: true,
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: fakeCustomers,
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomer_${dataFetchActionTypes.FETCH_SUCCESS}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeCustomers.map(customer => {
          if (customer.ownerId === fakeArgs.ownerId) {
            return {
              ...customer,
              loading: false,
            }
          }
          return customer
        }),
        repos: [],
        loadingAllRepos: false,
      }
      const result = reducer(deepFreeze(stateBefore), deepFreeze(action))
      // sort the customers for easier equality comparison
      result.customers.sort((a, b) => {
        return a.ownerId.localeCompare(b.ownerId)
      })
      expect(result).toEqual(stateAfter)
    })
  })

  describe('getBillingCustomers', () => {
    it('should handle FETCH_START', () => {
      const stateBefore = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomers_${dataFetchActionTypes.FETCH_START}`,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: true,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_START with existing customers', () => {
      const fakeCustomers = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: fakeCustomers,
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomers_${dataFetchActionTypes.FETCH_START}`,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeCustomers.map(customer => ({
          ...customer,
          loading: true,
        })),
        repos: [],
        loadingAllRepos: true,
      }
      const result = reducer(deepFreeze(stateBefore), deepFreeze(action))
      // sort the customers for easier equality comparison
      result.customers.sort((a, b) => {
        return a.ownerId.localeCompare(b.ownerId)
      })
      expect(result).toEqual(stateAfter)
    })

    it('should handle FETCH_SUCCESS', () => {
      const fakeResult = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: [],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomers_${dataFetchActionTypes.FETCH_SUCCESS}`,
        result: fakeResult,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeResult.map(item => ({
          ...item,
          loading: false,
        })),
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_SUCCESS with existing customers', () => {
      const fakeResult = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: fakeResult.map(item => ({
          ...item,
          loading: true,
        })),
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `getBillingCustomers_${dataFetchActionTypes.FETCH_SUCCESS}`,
        result: fakeResult,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeResult.map(item => ({
          ...item,
          loading: false,
        })),
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })
  })
  describe('deactivateRepo', () => {
    it('should handle FETCH_START', () => {
      const fakeArgs = {
        ownerId: 'some_owner_id',
        ownerType: 'organization',
      }
      const stateBefore = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: false,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `deactivateRepo_${dataFetchActionTypes.FETCH_START}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: true,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_START with existing customers', () => {
      const fakeArgs = {
        ownerId: '5b1ff3146751a90024e3d523',
        ownerType: 'organization',
      }
      const fakeCustomers = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: fakeCustomers,
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `deactivateRepo_${dataFetchActionTypes.FETCH_START}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeCustomers.map(customer => {
          if (customer.ownerId === fakeArgs.ownerId) {
            return {
              ...customer,
              loading: true,
            }
          }
          return customer
        }),
        repos: [],
        loadingAllRepos: false,
      }
      const result = reducer(deepFreeze(stateBefore), deepFreeze(action))
      // sort the customers for easier equality comparison
      result.customers.sort((a, b) => {
        return a.ownerId.localeCompare(b.ownerId)
      })
      expect(result).toEqual(stateAfter)
    })

    it('should handle FETCH_SUCCESS', () => {
      const fakeArgs = {
        ownerId: 'some_owner_id',
        ownerType: 'organization',
      }
      const stateBefore = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: true,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `deactivateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: [
          {
            ...fakeArgs,
            loading: false,
          },
        ],
        repos: [],
        loadingAllRepos: false,
      }
      expect(reducer(deepFreeze(stateBefore), deepFreeze(action))).toEqual(
        stateAfter,
      )
    })

    it('should handle FETCH_SUCCESS with existing customers', () => {
      const fakeArgs = {
        ownerId: '5b1ff3146751a90024e3d523',
        ownerType: 'organization',
      }
      const fakeCustomers = [
        {
          ownerId: '5b1ff3146751a90024e3d523',
          ownerType: 'organization',
          loading: true,
          _id: '5b350ee5021b3900420c6eb0',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
        {
          ownerId: '5b1ff3146751a90024e3d524',
          ownerType: 'organization',
          loading: false,
          _id: '5b350ee5021b3900420c6eb1',
          userId: '5b1ff311e6cdc50025d3d13d',
          trialEnd: '2018-07-12T16:37:57.752Z',
          paymentSourceSet: false,
          subscriptions: [],
        },
      ]
      const stateBefore = {
        stripePublicKey: null,
        customers: fakeCustomers,
        repos: [],
        loadingAllRepos: false,
      }
      const action = {
        type: `deactivateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`,
        args: fakeArgs,
      }
      const stateAfter = {
        stripePublicKey: null,
        customers: fakeCustomers.map(customer => {
          if (customer.ownerId === fakeArgs.ownerId) {
            return {
              ...customer,
              loading: false,
            }
          }
          return customer
        }),
        repos: [],
        loadingAllRepos: false,
      }
      const result = reducer(deepFreeze(stateBefore), deepFreeze(action))
      // sort the customers for easier equality comparison
      result.customers.sort((a, b) => {
        return a.ownerId.localeCompare(b.ownerId)
      })
      expect(result).toEqual(stateAfter)
    })
  })
})
