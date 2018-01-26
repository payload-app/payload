const Joi = require('joi')
const { promisify } = require('util')
const { sign } = require('jsonwebtoken')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const jwtSign = promisify(sign)
const secret = process.env.JWT_SECRET

const schema = Joi.object().keys({
  userId: Joi.string().required(),
})

module.exports = async ({ userId }) => {
  try {
    await validate({
      value: {
        userId,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  return jwtSign(
    {
      userId,
    },
    secret,
    {
      expiresIn: '30 days',
    },
  )
}
