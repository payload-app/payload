const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const {
  validate,
  parseValidationErrorMessage,
  processingQueue,
  requeueTask,
  deleteProcessingTask,
  processingTask,
} = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
})

const cleanBatch = async ({
  redisClient,
  queue,
  startIdx,
  batchSize,
  cleanedTaskIds = [],
}) => {
  const items = await redisClient
    .lrange(processingQueue({ queue }), startIdx, startIdx + batchSize)
    .map(item => JSON.parse(item))
  if (items.length) {
    const leases = await redisClient.mget(
      items.map(item =>
        processingTask({
          taskId: item.taskId,
          queue,
        }),
      ),
    )
    await Promise.all(
      leases.map(async (lease, idx) => {
        if (!lease) {
          const item = items[idx]
          await requeueTask({
            redisClient,
            queue,
            item,
            decrementRetry: false,
          })
          await deleteProcessingTask({
            redisClient,
            queue,
            item,
          })
          cleanedTaskIds.push(item.taskId)
        }
      }),
    )
    return await cleanBatch({
      redisClient,
      queue,
      startIdx: startIdx + batchSize,
      batchSize,
      cleanedTaskIds,
    })
  }
  return cleanedTaskIds
}

module.exports = ({ redisClient }) => async ({ queue }) => {
  try {
    await validate({
      value: {
        queue,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  return {
    cleanedTaskIds: await cleanBatch({
      redisClient,
      queue,
      startIdx: 0,
      batchSize: 10,
    }),
  }
}
