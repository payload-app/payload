const Joi = require('joi')
const { deleteProcessingTask } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')
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

  let response = {
    requeued: false,
  }
  if (item.retries > 0) {
    await redisClient.lpush(
      queue,
      JSON.stringify({
        ...item,
        retries: item.retries - 1,
      }),
    )
    response = {
      ...response,
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
