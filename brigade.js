const { events, Job } = require('brigadier')

const JOB_ID_LENGTH = 26

const formatJobName = ({ name, maxLength = 63 }) =>
  name.substr(0, maxLength - JOB_ID_LENGTH - 1)

const echoedTasks = tasks => {
  const echoTasks = []
  tasks.forEach(task => {
    echoTasks.push(`echo "Doing Task: '${task}'"`)
    echoTasks.push(task)
  })
  return echoTasks
}

let id = 0
const generateGithubStatusId = () => id++

const githubStatusJob = async ({ event, project, state, status, context }) => {
  const githubStatus = new Job(
    `set-github-build-status-${generateGithubStatusId()}`,
    'technosophos/github-notify:latest',
  )
  githubStatus.env = {
    GH_REPO: project.repo.name,
    GH_STATE: state,
    GH_DESCRIPTION: status,
    GH_CONTEXT: context ? `Brigade - ${context}` : 'Brigade',
    GH_TOKEN: project.repo.token,
    GH_COMMIT: event.revision.commit,
  }
  githubStatus.useSource = false
  await githubStatus.run()
}

const yaml2jsonJob = async ({ baseDir, valuesFile }) => {
  // parse yaml file and return json
  const yaml2json = new Job(
    formatJobName({ name: `yaml2json-${baseDir}` }),
    'simplealpine/yaml2json',
  )
  yaml2json.tasks = [`cd /src/${baseDir}`, `yaml2json < ${valuesFile}`]
  const result = await yaml2json.run()
  return result.toString()
}

const generateMongodbEnvVars = ({ payload }) => [
  {
    name: 'MONGODB_USERNAME',
    value: payload.secrets.MONGODB_USERNAME,
  },
  {
    name: 'MONGODB_PASSWORD',
    value: payload.secrets.MONGODB_PASSWORD,
  },
  {
    name: 'MONGODB_DATABASE',
    value: payload.secrets.MONGODB_DATABASE,
  },
  {
    name: 'MONGODB_URL',
    value: payload.secrets.MONGODB_URL,
  },
]

const dockerBuilderJob = async ({ event, payload, dockerImage, baseDir }) => {
  // build docker image
  const dockerBuilder = new Job(
    formatJobName({ name: `docker-builder-${baseDir}` }),
    'docker:stable-dind',
  )
  dockerBuilder.privileged = true
  dockerBuilder.env = {
    DOCKER_DRIVER: payload.secrets.DOCKER_DRIVER || 'overlay',
  }
  dockerBuilder.tasks = echoedTasks([
    'dockerd-entrypoint.sh &',
    'sleep 20',
    `cd /src/${baseDir}`,
    `docker login -u ${payload.secrets.DOCKER_USER} -p '${
      payload.secrets.DOCKER_PASS
    }' ${payload.secrets.DOCKER_REGISTRY}`,
    `docker build -t ${dockerImage}:${event.revision.commit} .`,
    `docker push ${dockerImage}:${event.revision.commit}`,
  ])
  await dockerBuilder.run()
}

const generateHelmEnvVars = ({ existingEnvVars = [], envVars = [] }) => {
  const used = new Set()
  // merge the env vars in the value.yaml and custom defined -- custom defined win if there is an overlap
  const mergedEnvVars = [...envVars, ...existingEnvVars].filter(item => {
    if (used.has(item.name)) {
      return false
    }
    used.add(item.name)
    return true
  })

  // NOTE: this only merges items with a name and a value
  return mergedEnvVars
    .filter(item => item.name && item.value)
    .map(
      (item, i) =>
        `--set-string env[${i}].name=${item.name},env[${i}].value=${
          item.value
        }`,
    )
    .join(' ')
}

const helmDeployerJob = async ({
  event,
  baseDir,
  valuesFile,
  name,
  chart,
  namespace,
  envVars,
  values,
}) => {
  // do helm deploy
  const helmDeployer = new Job(
    formatJobName({ name: `helm-deployer-${baseDir}` }),
    'linkyard/docker-helm:latest', // TODO: change to 2.9.0 when it gets published
  )
  helmDeployer.tasks = echoedTasks([
    `cd /src/${baseDir}`,
    'helm init --client-only',
    `helm upgrade --install ${name} ../charts/${chart} --namespace ${namespace} --values ${valuesFile} --set image.tag=${
      event.revision.commit
    } ${generateHelmEnvVars({
      existingEnvVars: values.env,
      envVars,
    })} --debug --dry-run`,
    `helm upgrade --install ${name} ../charts/${chart} --namespace ${namespace} --values ${valuesFile} --set image.tag=${
      event.revision.commit
    } ${generateHelmEnvVars({ existingEnvVars: values.env, envVars })}`,
  ])
  await helmDeployer.run()
}

const deployService = async ({
  event,
  payload,
  baseDir,
  valuesFile,
  chart,
  namespace,
  envVars,
}) => {
  try {
    await githubStatusJob({
      event,
      project: payload,
      state: 'pending',
      status: 'Deploy In Progress...',
      context: 'baseDir',
    })
    const values = await yaml2jsonJob({
      baseDir,
      valuesFile,
    })
    const { name, image: { repository: dockerImage } } = values

    await dockerBuilderJob({
      event,
      payload,
      dockerImage,
      baseDir,
    })

    await helmDeployerJob({
      event,
      baseDir,
      valuesFile,
      name,
      chart,
      namespace,
      envVars,
      values,
    })
    await githubStatusJob({
      event,
      project: payload,
      state: 'success',
      status: 'Deploy Complete',
      context: 'baseDir',
    })
  } catch (error) {
    await githubStatusJob({
      event,
      project: payload,
      state: 'failure',
      status: 'Deploy Failed',
      context: 'baseDir',
    })
    throw error
  }
}

const deploySessionService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'session-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [
      {
        name: 'JWT_SECRET',
        value: payload.secrets.JWT_SECRET,
      },
    ],
  })

const deployQueueService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'queue-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployRandomStateService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'random-state-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployGithubService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'github-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployOrganizationService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'organization-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [...generateMongodbEnvVars({ payload })],
  })

const deployUserService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'user-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [...generateMongodbEnvVars({ payload })],
  })

const deployRunService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'run-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [...generateMongodbEnvVars({ payload })],
  })

const deployRepoService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'repo-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [...generateMongodbEnvVars({ payload })],
  })

const deployInitDbJob = async (event, payload) => {
  try {
    await deployService({
      event,
      payload,
      baseDir: 'init-db',
      valuesFile: 'values.yaml',
      chart: 'payload-job',
      namespace: 'payload',
      envVars: [...generateMongodbEnvVars({ payload })],
    })
  } catch (err) {
    console.log(
      'There was an error deploying the init DB Job, **this will fail if the initialization has already been applied**',
    )
    console.log(err.message)
  }
}

const deployStatusBroadcasterService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'status-broadcaster',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployBackendService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'backend',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [
      {
        name: 'WEBHOOK_BASE_URL',
        value: payload.secrets.WEBHOOK_BASE_URL,
      },
    ],
  })

const deployFrontendService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'frontend',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployGithubAuthService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'github-auth',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [
      {
        name: 'GH_CLIENT_ID',
        value: payload.secrets.GH_CLIENT_ID,
      },
      {
        name: 'GH_CLIENT_SECRET',
        value: payload.secrets.GH_CLIENT_SECRET,
      },
      {
        name: 'REDIRECT_URL',
        value: payload.secrets.REDIRECT_URL,
      },
    ],
  })

const deployWorker = async (event, payload) => {
  deployService({
    event,
    payload,
    baseDir: 'worker',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [
      {
        name: 'BASE_RUN_URL',
        value: payload.secrets.REDIRECT_URL,
      },
      {
        name: 'WORKER_QUEUE',
        value: payload.secrets.WORKER_QUEUE,
      },
    ],
  })
}

const deployQueueGarbageCollector = async (event, payload) => {
  deployService({
    event,
    payload,
    baseDir: 'queue-garbage-collector',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [
      {
        name: 'WORKER_QUEUE',
        value: payload.secrets.WORKER_QUEUE,
      },
    ],
  })
}

const deployWebhookCollectorService = async (event, payload) => {
  deployService({
    event,
    payload,
    baseDir: 'webhook-collector',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
    envVars: [
      {
        name: 'BASE_RUN_URL',
        value: payload.secrets.REDIRECT_URL,
      },
      {
        name: 'WORKER_QUEUE',
        value: payload.secrets.WORKER_QUEUE,
      },
    ],
  })
}

const deployDevRedis = async ({ namespace }) => {
  const redisDeployer = new Job(`redis-deployer`, 'linkyard/docker-helm:2.8.2')
  redisDeployer.tasks = echoedTasks([
    'helm init --client-only',
    `helm upgrade --install redis stable/redis --namespace ${namespace} --set usePassword=false --debug --dry-run`,
    `helm upgrade --install redis stable/redis --namespace ${namespace} --set usePassword=false`,
  ])
  await redisDeployer.run()
}

const deployDevMongodb = async ({ payload, namespace }) => {
  const mongodbDeployer = new Job(
    `mongodb-deployer`,
    'linkyard/docker-helm:latest',
  )
  mongodbDeployer.tasks = echoedTasks([
    'helm init --client-only',
    `helm upgrade --install mongodb stable/mongodb --set mongodbRootPassword=${
      payload.secrets.MONGODB_ROOT_PASSWORD
    },mongodbUsername=${payload.secrets.MONGODB_USERNAME},mongodbPassword=${
      payload.secrets.MONGODB_PASSWORD
    },mongodbDatabase=${
      payload.secrets.MONGODB_DATABASE
    } --namespace ${namespace} --debug --dry-run`,
    `helm upgrade --install mongodb stable/mongodb --set mongodbRootPassword=${
      payload.secrets.MONGODB_ROOT_PASSWORD
    },mongodbUsername=${payload.secrets.MONGODB_USERNAME},mongodbPassword=${
      payload.secrets.MONGODB_PASSWORD
    },mongodbDatabase=${
      payload.secrets.MONGODB_DATABASE
    } --namespace ${namespace}`,
  ])
  await mongodbDeployer.run()
}

events.on('deploy-dev-mongodb', (event, payload) => {
  deployDevMongodb({ namespace: 'payload', event, payload })
})
events.on('deploy-dev-redis', () => {
  deployDevRedis({ namespace: 'payload' })
})
events.on('deploy-session-service', deploySessionService)
events.on('deploy-queue-service', deployQueueService)
events.on('deploy-random-state-service', deployRandomStateService)
events.on('deploy-github-service', deployGithubService)
events.on('deploy-organization-service', deployOrganizationService)
events.on('deploy-user-service', deployUserService)
events.on('deploy-run-service', deployRunService)
events.on('deploy-repo-service', deployRepoService)
events.on('deploy-init-db-job', deployInitDbJob)
events.on('deploy-status-broadcaster-service', deployStatusBroadcasterService)
events.on('deploy-backend-service', deployBackendService)
events.on('deploy-frontend-service', deployFrontendService)
events.on('deploy-github-auth-service', deployGithubAuthService)
events.on('deploy-worker', deployWorker)
events.on('deploy-queue-garbage-collector', deployQueueGarbageCollector)
events.on('deploy-webhook-collector-service', deployWebhookCollectorService)

events.on('deploy-minikube-services', async (event, payload) => {
  await Promise.all([
    deployDevRedis({ namespace: 'payload' }),
    deployDevMongodb({ namespace: 'payload', event, payload }),
  ])
  // ... then

  // have no dependencies
  await Promise.all([
    deployRandomStateService(event, payload),
    deploySessionService(event, payload),
    deployStatusBroadcasterService(event, payload),
    deployInitDbJob(event, payload),
  ])

  await Promise.all([
    deployQueueService(event, payload),
    deployGithubService(event, payload),
  ])

  await Promise.all([
    deployOrganizationService(event, payload),
    deployUserService(event, payload),
    deployRunService(event, payload),
    deployRepoService(event, payload),
  ])

  await Promise.all([
    deployBackendService(event, payload),
    deployFrontendService(event, payload),
    deployGithubAuthService(event, payload),
  ])

  await Promise.all([
    deployWorker(event, payload),
    deployQueueGarbageCollector(event, payload),
    deployWebhookCollectorService(event, payload),
  ])
})

const validPath = /.+?(?=\/)/
const ignoredPaths = ['api-types', 'charts', 'proxy']

const calculateDiffs = ({ event }) => {
  const eventPayload = JSON.parse(event.payload)
  const diffs = new Set()
  const updateDiffs = filePath => {
    const result = validPath.exec(filePath)
    if (result && !ignoredPaths.includes(result[0])) {
      diffs.add(result[0])
    }
  }
  eventPayload.commits.forEach(commit => {
    commit.added.forEach(updateDiffs)
    commit.removed.forEach(updateDiffs)
    commit.modified.forEach(updateDiffs)
  })
  return Array.from(diffs)
}

events.on('update-production-services', async (event, project) => {
  console.log(
    `Calculated Deployments From Diff: ${JSON.stringify(
      calculateDiffs({ event }),
      null,
      2,
    )}`,
  )
  calculateDiffs({ event }).forEach(diffPath => {
    switch (diffPath) {
      case 'session-service':
        events.emit('deploy-session-service', event, project)
        break
      case 'queue-service':
        events.emit('deploy-queue-service', event, project)
        break
      case 'random-state-service':
        events.emit('deploy-random-state-service', event, project)
        break
      case 'github-service':
        events.emit('deploy-github-service', event, project)
        break
      case 'organization-service':
        events.emit('deploy-organization-service', event, project)
        break
      case 'user-service':
        events.emit('deploy-user-service', event, project)
        break
      case 'run-service':
        events.emit('deploy-run-service', event, project)
        break
      case 'repo-service':
        events.emit('deploy-repo-service', event, project)
        break
      case 'init-db':
        events.emit('deploy-init-db-job', event, project)
        break
      case 'status-broadcaster':
        events.emit('deploy-status-broadcaster-service', event, project)
        break
      case 'backend':
        events.emit('deploy-backend-service', event, project)
        break
      case 'frontend':
        events.emit('deploy-frontend-service', event, project)
        break
      case 'github-auth':
        events.emit('deploy-github-auth-service', event, project)
        break
      case 'worker':
        events.emit('deploy-worker', event, project)
        break
      case 'queue-garbage-collector':
        events.emit('deploy-queue-garbage-collector', event, project)
        break
      case 'webhook-collector':
        events.emit('deploy-webhook-collector-service', event, project)
        break
      default:
        console.log(`unknown change path: ${diffPath}`)
        break
    }
  })
})

events.on('push', async (event, project) => {
  // if (event.revision.ref === 'refs/heads/master') {
  events.emit('update-production-services', event, project)
  // }
})
