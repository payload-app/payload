const { promisify } = require('util')
const Joi = require('joi')
const { verify } = require('jsonwebtoken')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const jwtVerify = promisify(verify)
const secret = process.env.JWT_SECRET

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  userId: Joi.string().required(),
  inviteToken: Joi.string().required(),
})

module.exports = ({ collectionClient, userServiceClient }) => async ({
  email,
  userId,
  inviteToken,
}) => {
  try {
    await validate({
      value: {
        email,
        userId,
        inviteToken,
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
    const { userId: inviteUserId } = result
    if (inviteUserId) {
      throw new Error(
        `The user ${inviteUserId} has already accepted an invite for ${email}`,
      )
    }
    const user = await userServiceClient.call('getUser', {
      id: userId,
    })
    if (!user) {
      throw new Error(`Could not find user to accept the invite: ${userId}`)
    }
    const { email: verifyEmail } = await jwtVerify(inviteToken, secret)
    if (email !== verifyEmail) {
      throw new Error(
        `inviteToken email ${verifyEmail} does not match input email ${ema}`,
      )
    }
    await collectionClient.updateOne(
      { email },
      {
        $set: {
          userId,
          claimedAt: new Date(),
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
