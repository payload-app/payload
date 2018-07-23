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

const cleanupExistingWebooks = async ({
  githubServiceClient,
  webhookBaseUrl,
  appName,
  owner,
  repo,
  accessToken,
}) => {
  const pages = await githubServiceClient.call('allPagesGithubRequest', {
    path: `/repos/${owner}/${repo}/hooks`,
    method: 'get',
    accessToken,
  })
  pages.forEach(page => {
    if (page.status !== 200) {
      throw createError({ message: 'there was an error fetching webhooks' })
    }
  })

  const webhooksToClean = pages.reduce((webhooksToClean, page) => {
    const newWebhooksToClean = page.data
      .map(webhook => ({
        id: webhook.id,
        url: webhook.config.url,
      }))
      .filter(
        webhook =>
          webhook.url &&
          webhook.url.startsWith(`${webhookBaseUrl}/${appName}/`),
      )
    return [...webhooksToClean, ...newWebhooksToClean]
  }, [])

  for (let webhook of webhooksToClean) {
    const { status } = await githubServiceClient.call('githubRequest', {
      path: `/repos/${owner}/${repo}/hooks/${webhook.id}`,
      method: 'delete',
      accessToken,
    })
    if (status !== 204) {
      throw createError({
        message: 'Could not clean webhook',
      })
    }
  }
}

module.exports = {
  parseGithubTokenFromSession,
  validate,
  parseValidationErrorMessage,
  parseGithubUsernameFromSession,
  getUserFromSession,
  cleanupExistingWebooks,
}
