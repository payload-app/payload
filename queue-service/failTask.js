const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const {
  deleteProcessingTask,
  validate,
  parseValidationErrorMessage,
  getItemFromTaskId,
  requeueTask,
  deadLetterTask,
} = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
  workerName: Joi.string().required(),
  taskId: Joi.string().required(),
  errorMessage: Joi.string().required(),
  handled: Joi.boolean().required(),
})

module.exports = ({ redisClient }) => async ({
  queue,
  workerName,
  taskId,
  errorMessage,
  handled,
}) => {
  try {
    await validate({
      value: {
        queue,
        workerName,
        taskId,
        errorMessage,
        handled,
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

  let response = {
    requeued: false,
  }
  if (item.retries > 0) {
    const { taskId: newTaskId } = await requeueTask({
      redisClient,
      queue,
      item,
    })
    response = {
      ...response,
      newTaskId,
      requeued: true,
    }
  } else if (!handled) {
    await deadLetterTask({
      queue,
      item,
      errorMessage,
      redisClient,
    })
  }
  const { leaseRemove, remove } = await deleteProcessingTask({
    queue,
    redisClient,
    item,
  })
  return {
    ...response,
    removedLease: leaseRemove === 1,
    removedProcessing: remove === 1,
  }
}
