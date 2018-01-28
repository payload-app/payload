const Joi = require('joi')
const { promisify } = require('util')
const { verify } = require('jsonwebtoken')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const jwtVerify = promisify(verify)
const secret = process.env.JWT_SECRET

const schema = Joi.object().keys({
  token: Joi.string().required(),
})

module.exports = async ({ token }) => {
  try {
    await validate({
      value: {
        token,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  return jwtVerify(token, secret)
}
