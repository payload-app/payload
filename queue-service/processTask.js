const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const {
  validate,
  parseValidationErrorMessage,
  processingQueue,
  processingTask,
  pauseQueue,
} = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
  workerName: Joi.string().required(),
})

module.exports = ({ redisClient }) => async ({ queue, workerName }) => {
  try {
    await validate({
      value: {
        queue,
        workerName,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  // if the queue is paused return null
  if (await redisClient.get(pauseQueue({ queue }))) {
    return null
  }
  const item = await redisClient.rpoplpush(queue, processingQueue({ queue }))
  if (item) {
    const { lease, taskId, task } = JSON.parse(item)
    await redisClient.setex(
      processingTask({ queue, taskId }),
      lease,
      JSON.stringify({ workerName, item, queue }),
    )
    return { taskId, task, lease }
  }
  return null
}
