require('dotenv').config()
const stripe = require('stripe')
const { router, get, post } = require('microrouter')
const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const startTrial = require('./startTrial')
const createCustomer = require('./createCustomer')
const createSubscription = require('./createSubscription')
const cancelSubscription = require('./cancelSubscription')
const setPaymentSource = require('./setPaymentSource')
const repoIsActive = require('./repoIsActive')
const getCustomer = require('./getCustomer')
const getCustomers = require('./getCustomers')
const listPlans = require('./listPlans')

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const init = async handler => {
  const client = await MongoClient.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`,
    {
      useNewUrlParser: true,
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
    .collection('billing')
  const organizationServiceClient = new RPCClient({
    url: 'http://organization-service:3000/rpc',
  })
  const userServiceClient = new RPCClient({
    url: 'http://user-service:3000/rpc',
  })
  const repoServiceClient = new RPCClient({
    url: 'http://repo-service:3000/rpc',
  })
  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)
  return handler({
    collectionClient,
    stripeClient,
    organizationServiceClient,
    userServiceClient,
    repoServiceClient,
  })
}

const rpcHandler = ({
  collectionClient,
  stripeClient,
  organizationServiceClient,
  userServiceClient,
  repoServiceClient,
}) =>
  rpc(
    method(
      'startTrial',
      startTrial({
        collectionClient,
        organizationServiceClient,
        userServiceClient,
      }),
    ),
    method(
      'createCustomer',
      createCustomer({
        collectionClient,
        stripeClient,
        userServiceClient,
        organizationServiceClient,
      }),
    ),
    method(
      'createSubscription',
      createSubscription({
        collectionClient,
        stripeClient,
        repoServiceClient,
      }),
    ),
    method(
      'cancelSubscription',
      cancelSubscription({
        collectionClient,
        stripeClient,
      }),
    ),
    method(
      'setPaymentSource',
      setPaymentSource({
        collectionClient,
        stripeClient,
      }),
    ),
    method(
      'repoIsActive',
      repoIsActive({
        collectionClient,
      }),
    ),
    method(
      'getCustomer',
      getCustomer({
        collectionClient,
      }),
    ),
    method(
      'getCustomers',
      getCustomers({
        collectionClient,
      }),
    ),
    method(
      'listPlans',
      listPlans({
        stripeClient,
      }),
    ),
    method('getStripePublicKey', () => stripePublicKey),
  )

const healthHandler = () => 'OK'

module.exports = init(
  ({
    collectionClient,
    stripeClient,
    organizationServiceClient,
    userServiceClient,
    repoServiceClient,
  }) =>
    router(
      get('/healthz', healthHandler),
      post(
        '/rpc',
        rpcHandler({
          collectionClient,
          stripeClient,
          organizationServiceClient,
          userServiceClient,
          repoServiceClient,
        }),
      ),
    ),
)
