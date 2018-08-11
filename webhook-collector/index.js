const { json, send } = require('micro')
const { router, get, post } = require('microrouter')
const { default: verifyGithubWebhook } = require('verify-github-webhook')
const RPCClient = require('@hharnisc/micro-rpc-client')

const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})

const organizationServiceClient = new RPCClient({
  url: 'http://organization-service:3000/rpc',
})

const userServiceClient = new RPCClient({
  url: 'http://user-service:3000/rpc',
})

const repoServiceClient = new RPCClient({
  url: 'http://repo-service:3000/rpc',
})

const statusBroadcasterClient = new RPCClient({
  url: 'http://status-broadcaster:3000/rpc',
})

const billingServiceClient = new RPCClient({
  url: 'http://billing-service:3000/rpc',
})

const appRootUrl = `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}`

const generateTargetUrl = ({ type, ownerType, owner, repo, branch, sha }) =>
  `${appRootUrl}/type/${type}/ownertype/${ownerType}/owner/${owner}/repo/${repo}/branch/${branch}/sha/${sha}/`

const generateTargetBillingUrl = ({ type, ownerType, owner }) =>
  `${appRootUrl}/type/${type}/ownertype/${ownerType}/owner/${owner}/settings/billing/`

const broadcastStart = async ({
  accessToken,
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
}) =>
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'pending',
    description: 'Waiting For Available Worker...',
    context: 'Payload',
    targetUrl: generateTargetUrl({
      type,
      ownerType,
      owner,
      repo,
      branch,
      sha,
    }),
  })

const broadcastRepoBillingInactive = async ({
  accessToken,
  type,
  ownerType,
  owner,
  repo,
  sha,
}) =>
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'error',
    description: 'Repository Is Not Active, Check Billing Settings',
    context: 'Payload',
    targetUrl: generateTargetBillingUrl({
      type,
      ownerType,
      owner,
    }),
  })

const getRepository = async ({ owner, repo }) =>
  await repoServiceClient.call('getRepo', {
    owner,
    repo,
  })

const throwHandledError = ({ message }) => {
  const error = new Error(message)
  error.handled = true
  throw error
}

const validateRepository = async ({
  payload,
  signature,
  repository,
  app,
  organization,
  accessToken,
  branch,
  sha,
}) => {
  if (!repository.active) {
    throwHandledError({ message: 'repository is not active' })
  }
  if (
    !(
      repository.webhooks[app] &&
      verifyGithubWebhook(
        signature,
        JSON.stringify(payload),
        repository.webhooks[app],
      )
    )
  ) {
    throwHandledError({ message: 'repository app token does not match' })
  }

  const repoBillingIsActive = await billingServiceClient.call('repoIsActive', {
    ownerId:
      repository.ownerType === 'organization'
        ? organization._id
        : repository.userId,
    ownerType: repository.ownerType,
    repoId: repository._id,
  })
  if (!repoBillingIsActive) {
    await broadcastRepoBillingInactive({
      accessToken,
      type: 'github',
      ownerType: repository.ownerType,
      owner: repository.owner,
      repo: repository.repo,
      branch,
      sha,
    })
    throwHandledError({
      message: `Repository Is Not Active, Check Billing Settings: ${generateTargetBillingUrl(
        {
          type: 'github',
          ownerType: repository.ownerType,
          owner: repository.owner,
        },
      )}`,
    })
  }
}

const getGithubAccessToken = async ({ repository, organization }) => {
  let userId = repository.userId
  if (repository.ownerType === 'organization') {
    // choose a random id to grab an access token from
    userId =
      organization.userIds[
        Math.floor(Math.random() * organization.userIds.length)
      ]
  }
  const user = await userServiceClient.call('getUser', {
    id: userId,
  })
  return user.accounts.github.accessToken
}

const createTask = async ({ task }) =>
  await queueServiceClient.call('createTask', {
    queue: process.env.WORKER_QUEUE,
    task: {
      ...task,
      maxLease: process.env.MAX_LEASE_SECONDS,
    },
    retries: process.env.RETRIES,
    lease: process.env.LEASE_SECONDS,
  })

const enqueuePullRequest = async ({ req, payload }) => {
  const action = payload.action
  // ignore actions that aren't PR synchronize or opened
  if (!['opened', 'synchronize'].includes(action)) {
    return
  }
  const repository = payload.repository
  const owner = repository.owner.login
  const ownerType = repository.owner.type.toLowerCase()
  const repo = repository.name

  const pullRequest = payload.pull_request
  const base = {
    sha: pullRequest.base.sha,
    branch: pullRequest.base.ref,
  }
  const head = {
    sha: pullRequest.head.sha,
    branch: pullRequest.head.ref,
  }

  const dbRepository = await getRepository({ owner, repo })
  let dbOrganization
  if (dbRepository.ownerType === 'organization') {
    dbOrganization = await organizationServiceClient.call('getOrganization', {
      name: dbRepository.owner,
      type: 'github',
    })
  }
  const accessToken = await getGithubAccessToken({
    repository: dbRepository,
    organization: dbOrganization,
  })
  await validateRepository({
    payload,
    signature: req.headers['x-hub-signature'],
    repository: dbRepository,
    app: req.params.app,
    organization: dbOrganization,
    accessToken,
    branch: head.branch,
    sha: head.sha,
  })

  const task = {
    owner,
    repo,
    repoId: dbRepository._id,
    base,
    head,
    ownerType,
    accessToken,
    taskType: 'pullRequest',
    type: 'github',
  }
  const { taskId } = await createTask({ task })
  try {
    await broadcastStart({
      accessToken,
      type: 'github',
      ownerType,
      owner,
      repo,
      branch: head.branch,
      sha: head.sha,
    })
  } catch (err) {
    console.log('err', err)
    throw err
  }

  console.log(`Enqueued task with id: ${taskId}`)
}

const enqueuePush = async ({ req, payload }) => {
  const defaultBranch = payload.repository['default_branch']
  // ignore pushes on non default branches
  if (payload.ref !== `refs/heads/${defaultBranch}`) {
    return
  }
  const repository = payload.repository
  const owner = repository.owner.login
  const ownerType = repository.owner.type.toLowerCase()
  const repo = repository.name

  const base = {
    sha: payload.before,
    branch: defaultBranch,
  }
  const head = {
    sha: payload.after,
    branch: defaultBranch,
  }

  const dbRepository = await getRepository({ owner, repo })
  let dbOrganization
  if (dbRepository.ownerType === 'organization') {
    dbOrganization = await organizationServiceClient.call('getOrganization', {
      name: dbRepository.owner,
      type: 'github',
    })
  }
  const accessToken = await getGithubAccessToken({
    repository: dbRepository,
    organization: dbOrganization,
  })
  await validateRepository({
    payload,
    signature: req.headers['x-hub-signature'],
    repository: dbRepository,
    app: req.params.app,
    organization: dbOrganization,
    accessToken,
    branch: head.branch,
    sha: head.sha,
  })

  const task = {
    owner,
    repo,
    repoId: dbRepository._id,
    base,
    head,
    ownerType,
    accessToken,
    taskType: 'push',
    type: 'github',
  }
  const { taskId } = await createTask({ task })
  await broadcastStart({
    accessToken,
    type: 'github',
    ownerType,
    owner,
    repo,
    branch: head.branch,
    sha: head.sha,
  })
  console.log(`Enqueued task with id: ${taskId}`)
}

const webhookHandler = async (req, res) => {
  try {
    const event = req.headers['x-github-event']
    const payload = await json(req)
    if (event === 'pull_request') {
      await enqueuePullRequest({ req, payload })
    } else if (event === 'push') {
      await enqueuePush({ req, payload })
    }
    return 'OK'
  } catch (error) {
    if (error.handled) {
      send(res, 400, error.message)
    } else {
      throw error
    }
  }
}

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/', healthHandler),
  get('/healthz', healthHandler),
  post('/webhook/:app', webhookHandler),
)
