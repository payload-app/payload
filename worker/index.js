const util = require('util')
const winston = require('winston')
const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
const sleep = promisify(setTimeout)
const exec = util.promisify(require('child_process').exec)

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './worker.log',
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
})

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

const cloneRepo = async ({ accessToken, owner, repo, sha }) => {
  const { stdout, stderr } = await exec(
    `git clone https://${accessToken}@github.com/${owner}/${repo}.git /tmp/${sha}`,
  )
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
}

const getGithubAccessTokenFromTask = async ({ task }) => {
  logger.info('getting repos')
  const repo = await repoServiceClient.call('getRepo', {
    owner: task.owner,
    repo: task.repo,
  })
  let userId = repo.userId
  if (repo.ownerType === 'organization') {
    const organization = await organizationServiceClient.call(
      'getOrganization',
      {
        name: repo.owner,
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

const main = async () => {
  const queue = process.env.WORKER_QUEUE
  const workerName = process.env.WORKER_NAME
  logger.info(`Worker ${workerName} Checking Queue ${queue}`)

  const work = await queueServiceClient.call('processTask', {
    queue,
    workerName,
  })

  if (work) {
    const { task, taskId } = work
    logger.info(`Found Task: ${taskId}`)
    logger.info(JSON.stringify(task))
    const accessToken = await getGithubAccessTokenFromTask({ task })
    logger.info(
      `Cloning repo: https://github.com/${task.owner}/${task.repo}.git`,
    )
    await cloneRepo({
      accessToken,
      owner: task.owner,
      repo: task.repo,
      sha: task.base.sha,
    })
    logger.info(`Completed Cloning Repo`)
    const result = await queueServiceClient.call('completeTask', {
      queue,
      workerName,
      taskId,
    })
    logger.info(`Completed Task ${taskId} - ${JSON.stringify(result)}`)
  } else {
    logger.info(`No Task Found On Queue ${queue}`)
  }

  logger.info(`Sleeping 10 Seconds`)
  await sleep(10000)
}

try {
  main()
} catch (err) {
  logger.error(JSON.stringify(err))
}
