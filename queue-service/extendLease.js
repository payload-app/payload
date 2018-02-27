const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const {
  validate,
  parseValidationErrorMessage,
  getItemFromTaskId,
  processingTask,
} = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
  workerName: Joi.string().required(),
  taskId: Joi.string().required(),
})

module.exports = ({ redisClient }) => async ({ workerName, taskId, queue }) => {
  try {
    await validate({
      value: {
        queue,
        workerName,
        taskId,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  const item = await getItemFromTaskId({
    redisClient,
    taskId,
    workerName,
    queue,
  })

  await redisClient.setex(
    processingTask({ taskId, queue }),
    item.lease,
    JSON.stringify({ workerName, item: JSON.stringify(item), queue }),
  )
  return { status: 'OK' }
}
