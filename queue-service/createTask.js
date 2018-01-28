const Joi = require('joi')
const uuidv4 = require('uuid/v4')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
  task: Joi.alternatives()
    .try(Joi.object(), Joi.string())
    .required(),
  retries: Joi.number()
    .min(0)
    .max(10),
  lease: Joi.number()
    .min(60)
    .max(6000),
})

module.exports = ({ redisClient }) => async ({
  queue,
  task,
  retries = 0,
  lease = 60, // seconds
}) => {
  try {
    await validate({
      value: {
        queue,
        task,
        retries,
        lease,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  const taskId = uuidv4()
  await redisClient.lpush(
    queue,
    JSON.stringify({
      taskId,
      task,
      retries,
      lease,
    }),
  )
  return { taskId }
}
