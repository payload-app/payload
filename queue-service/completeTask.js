const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { deleteProcessingTask } = require('./utils')
const {
  validate,
  parseValidationErrorMessage,
  getItemFromTaskId,
} = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
  workerName: Joi.string().required(),
  taskId: Joi.string().required(),
})

module.exports = ({ redisClient }) => async ({ queue, workerName, taskId }) => {
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
  const { leaseRemove, remove } = await deleteProcessingTask({
    queue,
    item,
    redisClient,
  })
  return {
    removedLease: leaseRemove === 1,
    removedProcessing: remove === 1,
  }
}
