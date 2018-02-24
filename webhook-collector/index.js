const { json, send } = require('micro')
const { router, get, post } = require('microrouter')
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

const baseRunUrl = process.env.BASE_RUN_URL

const generateTargetUrl = ({ type, ownerType, owner, repo, branch, sha }) =>
  `${baseRunUrl}/type/${type}/ownertype/${ownerType}/owner/${owner}/repo/${repo}/branch/${branch}/sha/${sha}/`

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

const validateRepository = async ({ repository, app, token }) => {
  if (!repository.active) {
    throwHandledError({ message: 'repository is not active' })
  }
  if (!(repository.webhooks[app] && repository.webhooks[app] === token)) {
    throwHandledError({ message: 'repository app token does not match' })
  }
}

const getGithubAccessToken = async ({ repository }) => {
  let userId = repository.userId
  if (repository.ownerType === 'organization') {
    const organization = await organizationServiceClient.call(
      'getOrganization',
      {
        name: repository.owner,
        type: 'github',
      },
    )
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
  await validateRepository({
    repository: dbRepository,
    app: req.params.app,
    token: req.params.token,
  })
  const accessToken = await getGithubAccessToken({ repository: dbRepository })

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
  const { taskId } = await queueServiceClient.call('createTask', {
    queue: process.env.WORKER_QUEUE,
    task,
    retries: 0,
    lease: 60,
  })
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
  await validateRepository({
    repository: dbRepository,
    app: req.params.app,
    token: req.params.token,
  })
  const accessToken = await getGithubAccessToken({ repository: dbRepository })
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
  const { taskId } = await queueServiceClient.call('createTask', {
    queue: process.env.WORKER_QUEUE,
    task,
    retries: 0,
    lease: 60,
  })
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
  get('/webhook/healthz', healthHandler),
  post('/webhook/:app/:token', webhookHandler),
)
