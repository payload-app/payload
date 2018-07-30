const { promisify } = require('util')
const Joi = require('joi')
const { sign } = require('jsonwebtoken')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const jwtSign = promisify(sign)
const secret = process.env.JWT_SECRET

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
})

module.exports = ({ collectionClient }) => async ({ email }) => {
  try {
    await validate({
      value: {
        email,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    // ensure there is an invite created with the email
    const result = await collectionClient.findOne({
      email,
    })
    if (!result) {
      throw new Error(`Could not find user with email: ${email}`)
    }
    const inviteCookieToken = await jwtSign(
      {
        email,
      },
      secret,
      {
        expiresIn: '30 days',
      },
    )
    return {
      inviteCookieToken,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
