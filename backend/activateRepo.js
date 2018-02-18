const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
  parseGithubTokenFromSession,
} = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  repo: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

const generateWebhookToken = async ({
  repoServiceClient,
  appName,
  owner,
  repo,
  type,
}) => {
  const {
    webhooks: { [appName]: webhookToken },
  } = await repoServiceClient.call('generateWebhookToken', {
    owner,
    repo,
    type,
    webhook: appName,
  })
  return { webhookToken }
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
      .filter(webhook =>
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

const createWebhook = async ({
  githubServiceClient,
  webhookBaseUrl,
  appName,
  owner,
  repo,
  accessToken,
  webhookToken,
}) => {
  const { status } = await githubServiceClient.call('githubRequest', {
    path: `/repos/${owner}/${repo}/hooks`,
    method: 'post',
    data: {
      name: 'web',
      config: {
        url: `${webhookBaseUrl}/${appName}/${webhookToken}`,
        content_type: 'json',
      },
      events: ['push', 'pull_request'],
    },
    accessToken,
  })
  if (status !== 201) {
    throw createError({
      message: 'could update repo webhook',
    })
  }
}

module.exports = ({
  repoServiceClient,
  githubServiceClient,
  webhookBaseUrl,
}) => async ({ owner, repo, type }, { session }) => {
  try {
    await validate({
      value: {
        owner,
        repo,
        type,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  const appName = 'payload'
  const accessToken = parseGithubTokenFromSession({ session })
  await cleanupExistingWebooks({
    githubServiceClient,
    appName,
    owner,
    repo,
    webhookBaseUrl,
    accessToken,
  })
  const { webhookToken } = await generateWebhookToken({
    repoServiceClient,
    appName,
    owner,
    repo,
    type,
  })

  await createWebhook({
    githubServiceClient,
    webhookBaseUrl,
    appName,
    owner,
    repo,
    accessToken,
    webhookToken,
  })
  return await repoServiceClient.call('activateRepo', {
    owner,
    repo,
    type,
  })
}
