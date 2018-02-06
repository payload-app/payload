const Joi = require('joi')
const { deleteProcessingTask } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')
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
