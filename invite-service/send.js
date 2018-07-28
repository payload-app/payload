const { promisify } = require('util')
const Joi = require('joi')
const { sign } = require('jsonwebtoken')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const jwtSign = promisify(sign)
const secret = process.env.JWT_SECRET

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  invitedByUserId: Joi.string().required(),
})

module.exports = ({ collectionClient, userServiceClient }) => async ({
  email,
  invitedByUserId,
}) => {
  try {
    await validate({
      value: {
        email,
        invitedByUserId,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const result = await collectionClient.findOne({
      email,
    })
    if (!result) {
      throw new Error(`Could not find user with email: ${email}`)
    }
    const { userId } = result
    if (userId) {
      throw new Error(
        `The user ${userId} has already accepted an invite for ${email}`,
      )
    }
    const invitedByUser = await userServiceClient.call('getUser', {
      id: invitedByUserId,
    })
    if (!invitedByUser) {
      throw new Error(`Could not user who send the invite: ${invitedByUserId}`)
    }
    const inviteToken = await jwtSign(
      {
        email,
      },
      secret,
      {
        expiresIn: '30 days',
      },
    )
    // TODO: send email
    collectionClient.updateOne(
      { email },
      {
        $set: {
          invitedAt: new Date(),
          inviteToken,
          invitedByUserId,
        },
      },
    )
    return 'OK'
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
