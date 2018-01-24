const { promisify } = require('util')
const { MongoClient } = require('mongodb')

const promisifiedMongoClient = promisify(MongoClient)

const initUserCollection = async ({ dbClient }) => {
  console.log('Init User Collection...')
  await dbClient.createCollection('users')
  // emails must be unique within a type
  await dbClient
    .collection('users')
    .createIndex({ email: 1, type: 1 }, { unique: 1 })
  console.log('Init User Collection...Done')
}

const initDB = async () => {
  console.log('Connecting to Client...')
  const mongoClient = await promisifiedMongoClient.connect(
    process.env.MONGO_URL,
  )
  const dbClient = mongoClient.db(process.env.MONGO_DB)
  console.log('Connecting to Client...Done')
  await initUserCollection({ dbClient })
  mongoClient.close()
}

initDB()