const { promisify } = require('util')
const Joi = require('joi')
const ObjectPathImmutable = require('object-path-immutable')
const ObjectPath = require('object-path')

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

const parseGithubUsernameFromSession = ({ session }) => {
  if (session) {
    return session.user.accounts.github.username
  }
}

const getUserFromSession = ({ session }) => {
  if (session) {
    if (ObjectPath.has(session.user, 'accounts.github.accessToken')) {
      return ObjectPathImmutable.del(
        session.user,
        'accounts.github.accessToken',
      )
    }
  }
}

module.exports = {
  parseGithubTokenFromSession,
  validate,
  parseValidationErrorMessage,
  parseGithubUsernameFromSession,
  getUserFromSession,
}
