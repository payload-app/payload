const { MongoClient } = require('mongodb')

const initUserCollection = async ({ dbClient }) => {
  console.log('Init User Collection...')
  await dbClient.createCollection('users')
  // emails must be unique within a type
  await dbClient.collection('users').createIndex({ email: 1 }, { unique: 1 })
  console.log('Init User Collection...Done')
}

const initOrganizationCollection = async ({ dbClient }) => {
  console.log('Init Organization Collection...')
  await dbClient.createCollection('organizations')
  await dbClient
    .collection('organizations')
    .createIndex({ name: 1, type: 1 }, { unique: 1 })
  console.log('Init Organization Collection...Done')
}

const initRepositoriesCollection = async ({ dbClient }) => {
  console.log('Init Repositories Collection...')
  await dbClient.createCollection('repositories')
  await dbClient
    .collection('repositories')
    .createIndex({ owner: 1, repo: 1, type: 1 }, { unique: 1 })
  await dbClient.collection('repositories').createIndex({ userId: 1 })
  await dbClient.collection('repositories').createIndex({ userId: 1 })
  await dbClient
    .collection('repositories')
    .createIndex({ owner: 1, ownerType: 1, active: 1 })
  console.log('Init Repositories Collection...Done')
}

const initRunsCollection = async ({ dbClient }) => {
  console.log('Init Runs Collection...')
  await dbClient.createCollection('runs')
  await dbClient
    .collection('runs')
    .createIndex({ owner: 1, repo: 1, type: 1, sha: 1 }, { unique: 1 })
  await dbClient
    .collection('runs')
    .createIndex({ owner: 1, repo: 1, branch: 1, type: 1, created: -1 })
  console.log('Init Runs Collection...Done')
}

const initBillingCollection = async ({ dbClient }) => {
  console.log('Init Billing Collection...')
  await dbClient.createCollection('billing')
  await dbClient
    .collection('billing')
    .createIndex({ ownerId: 1, ownerType: 1 }, { unique: 1 })
  await dbClient.collection('billing').createIndex({ userId: 1 })
  await dbClient.collection('billing').createIndex({ trialEnd: 1 })
  console.log('Init Billing Collection...Done')
}

const initInvitesCollection = async ({ dbClient }) => {
  console.log('Init Invites Collection...')
  await dbClient.createCollection('invites')
  await dbClient.collection('invites').createIndex({ email: 1 }, { unique: 1 })
  await dbClient.collection('invites').createIndex({ createdAt: 1 })
  await dbClient.collection('invites').createIndex({ userId: 1 }, { unique: 1 })
  await dbClient.collection('invites').createIndex({ invitedByUserId: 1 })
  console.log('Init Invites Collection...Done')
}

const initDB = async () => {
  const mongoClient = await MongoClient.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`,
    {
      useNewUrlParser: true,
    },
  )
  const dbClient = mongoClient.db(process.env.MONGODB_DATABASE)
  console.log('Connecting to Client...Done')
  await initUserCollection({ dbClient })
  await initOrganizationCollection({ dbClient })
  await initRepositoriesCollection({ dbClient })
  await initRunsCollection({ dbClient })
  await initBillingCollection({ dbClient })
  await initInvitesCollection({ dbClient })
  mongoClient.close()
}

try {
  initDB()
} catch (error) {
  console.error(error)
}
