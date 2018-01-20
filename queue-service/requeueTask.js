const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { deleteProcessingTask } = require('./utils')
const {
  validate,
  parseValidationErrorMessage,
  getItemFromTaskId,
  requeueTask,
} = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
  workerName: Joi.string().required(),
  taskId: Joi.string().required(),
})

module.exports = ({ redisClient }) => async ({ queue, workerName, taskId }) => {
  try {
    const validation = await validate({
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
  const { taskId: newTaskId } = await requeueTask({
    redisClient,
    queue,
    item,
    decrementRetry: false,
  })
  const { leaseRemove, remove } = await deleteProcessingTask({
    queue,
    item,
    redisClient,
  })
  return {
    newTaskId,
    requeued: true,
    removedLease: leaseRemove === 1,
    removedProcessing: remove === 1,
  }
}
