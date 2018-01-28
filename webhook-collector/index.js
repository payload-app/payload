const { json } = require('micro')
const { router, get, post } = require('microrouter')
const RPCClient = require('@hharnisc/micro-rpc-client')

const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})

const healthHandler = () => ({
  status: 'OK',
})

const enqueuePullRequest = async ({ payload }) => {
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
  const task = {
    owner,
    repo,
    base,
    head,
    ownerType,
    type: 'github',
  }
  const { taskId } = await queueServiceClient.call('createTask', {
    queue: process.env.WORKER_QUEUE,
    task,
    retries: 0,
    lease: 60,
  })
  console.log(`Enqueued task with id: ${taskId}`)
}

const webhookHandler = async req => {
  const event = req.headers['x-github-event']
  const payload = await json(req)
  if (event === 'pull_request') {
    await enqueuePullRequest({ payload })
  }
  return 'OK'
}

module.exports = router(
  get('/webhook/healthz', healthHandler),
  post('/webhook', webhookHandler),
)
