const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
  parseGithubTokenFromSession,
  cleanupExistingWebooks,
} = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  repo: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
  planType: Joi.string().required(),
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
  organizationServiceClient,
  billingServiceClient,
  webhookBaseUrl,
}) => async ({ owner, repo, type, planType }, { session }) => {
  try {
    await validate({
      value: {
        owner,
        repo,
        type,
        planType,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  try {
    let organization
    try {
      organization = await organizationServiceClient.call('getOrganization', {
        name: owner,
        type,
      })
    } catch (error) {
      if (!error.message.startsWith('Could not find organization with name')) {
        throw error
      }
    }

    let ownerId
    let ownerType
    if (organization) {
      ownerId = organization._id
      ownerType = 'organization'
    } else {
      ownerId = session.user._id
      ownerType = 'user'
    }

    const billingCustomer = await billingServiceClient.call('getCustomer', {
      ownerId,
      ownerType,
    })
    const now = new Date().getTime()
    if (
      billingCustomer &&
      !billingCustomer.paymentSourceSet &&
      new Date(billingCustomer.trialEnd).getTime() < now
    ) {
      throw createError({
        message: 'Trial has expired',
      })
    }

    const appName = 'payload'
    const accessToken = parseGithubTokenFromSession({ session })

    // ensure repo exists
    const repoData = await repoServiceClient.call('getRepo', {
      owner,
      repo,
      type,
    })

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

    // ensure a customer exists
    if (!billingCustomer.customerId) {
      await billingServiceClient.call('createCustomer', {
        ownerId,
        ownerType,
      })
    }

    // create a stripe subscription
    await billingServiceClient.call('createSubscription', {
      ownerId,
      ownerType,
      repoId: repoData._id,
      planType,
    })

    return await repoServiceClient.call('activateRepo', {
      owner,
      repo,
      type,
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
