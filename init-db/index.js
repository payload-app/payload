const { promisify } = require('util')
const { MongoClient } = require('mongodb')

const promisifiedMongoClient = promisify(MongoClient)

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
  console.log('Init Repositories Collection...Done')
}

const initRunsCollection = async ({ dbClient }) => {
  console.log('Init Runs Collection...')
  await dbClient.createCollection('runs')
  console.log('Init Runs Collection...Done')
}

const initDB = async () => {
  console.log('Connecting to Client...')
  const mongoClient = await promisifiedMongoClient.connect(
    process.env.MONGO_URL,
  )
  const dbClient = mongoClient.db(process.env.MONGO_DB)
  console.log('Connecting to Client...Done')
  await initUserCollection({ dbClient })
  await initOrganizationCollection({ dbClient })
  await initRepositoriesCollection({ dbClient })
  await initRunsCollection({ dbClient })
  mongoClient.close()
}

initDB()
