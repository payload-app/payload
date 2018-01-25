const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  avatar: Joi.string().required(),
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  accessToken: Joi.string().required(),
  email: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

module.exports = ({ collectionClient }) => async ({
  avatar,
  username,
  firstName,
  lastName,
  accessToken,
  email,
  type = 'github',
}) => {
  try {
    await validate({
      value: {
        avatar,
        username,
        firstName,
        lastName,
        accessToken,
        email,
        type,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const { insertedId } = await collectionClient.insertOne({
      email,
      accounts: {
        [type]: {
          avatar,
          username,
          firstName,
          lastName,
          accessToken,
        },
      },
    })
    return {
      id: insertedId,
    }
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
