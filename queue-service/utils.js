const uuidv4 = require('uuid/v4')
const { promisify } = require('util')
const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')

const validateWithPromise = promisify(Joi.validate)

const processingQueue = ({ queue }) => `${queue}:processing`

const deleteProcessingTask = async ({ queue, item, redisClient }) => {
  const remove = await redisClient.lrem(
    processingQueue({ queue }),
    0,
    JSON.stringify(item),
  )
  const { taskId } = item
  const leaseRemove = await redisClient.del(taskId)
  return {
    remove,
    leaseRemove,
  }
}

const validate = async ({ value, schema, options = { abortEarly: false } }) =>
  validateWithPromise(value, schema, options)

const parseValidationErrorMessage = ({ error }) => {
  if (error.details && error.details.length) {
    return error.details.map(item => item.message).join(',')
  } else {
    return error.message
  }
}

const getItemFromTaskId = async ({
  redisClient,
  taskId,
  workerName,
  queue,
}) => {
  const leaseItem = await redisClient.get(taskId)
  if (!leaseItem) {
    throw createError({
      message: 'could not find existing lease',
    })
  }
  const { item, workerName: leaseWorkerName, queue: leaseQueue } = JSON.parse(
    leaseItem,
  )
  if (leaseWorkerName !== workerName) {
    throw createError({
      message: 'workerName does not match current worker lease',
    })
  }
  if (leaseQueue !== queue) {
    throw createError({
      message: 'queue does not match current worker lease',
    })
  }
  return JSON.parse(item)
}

const requeueTask = async ({
  redisClient,
  queue,
  item,
  decrementRetry = true,
}) =>
  await redisClient.lpush(
    queue,
    JSON.stringify({
      ...item,
      taskId: uuidv4(),
      retries: decrementRetry ? item.retries - 1 : item.retries,
    }),
  )

module.exports = {
  processingQueue,
  deleteProcessingTask,
  validate,
  parseValidationErrorMessage,
  getItemFromTaskId,
  requeueTask,
}
