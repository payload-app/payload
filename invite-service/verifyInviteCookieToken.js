const { promisify } = require('util')
const Joi = require('joi')
const { verify } = require('jsonwebtoken')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const jwtVerify = promisify(verify)
const secret = process.env.JWT_SECRET

const schema = Joi.object().keys({
  inviteCookieToken: Joi.string().required(),
})

module.exports = ({ collectionClient }) => async ({ inviteCookieToken }) => {
  try {
    await validate({
      value: {
        inviteCookieToken,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const { email } = await jwtVerify(inviteCookieToken, secret)
    // ensure there is an invite created with the email
    const result = await collectionClient.findOne({
      email,
    })
    if (!result) {
      throw new Error(`Invalid inviteCookieToken`)
    }
    return {
      email,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
