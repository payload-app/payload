const { promisify } = require('util')
const Joi = require('joi')

const validateWithPromise = promisify(Joi.validate)

const validate = async ({ value, schema, options = { abortEarly: false } }) =>
  validateWithPromise(value, schema, options)

const parseValidationErrorMessage = ({ error }) => {
  if (error.details && error.details.length) {
    return error.details.map(item => item.message).join(',')
  } else {
    return error.message
  }
}

const parseGithubTokenFromSession = ({ session }) => {
  if (session) {
    return session.user.accounts.github.accessToken
  }
}

module.exports = {
  parseGithubTokenFromSession,
  validate,
  parseValidationErrorMessage,
}
