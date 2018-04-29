const { events, Job } = require('brigadier')

const echoedTasks = tasks => {
  const echoTasks = []
  tasks.forEach(task => {
    echoTasks.push(`echo "Doing Task: '${task}'"`)
    echoTasks.push(task)
  })
  return echoTasks
}

const yaml2jsonJob = async ({ baseDir, valuesFile }) => {
  // parse yaml file and return json
  const yaml2json = new Job(`yaml2json-${baseDir}`, 'simplealpine/yaml2json')
  yaml2json.tasks = [`cd /src/${baseDir}`, `yaml2json < ${valuesFile}`]
  const result = await yaml2json.run()
  return result.toString()
}

const dockerBuilderJob = async ({ event, payload, dockerImage, baseDir }) => {
  // build docker image
  const dockerBuilder = new Job(
    `docker-builder-${baseDir}`,
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

  return mergedEnvVars
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
    `helm-deployer-${baseDir}`,
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
}

const deploySessionService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'session-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
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
  })

const deployUserService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'user-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployRunService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'run-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
  })

const deployRepoService = async (event, payload) =>
  deployService({
    event,
    payload,
    baseDir: 'repo-service',
    valuesFile: 'values.yaml',
    chart: 'payload-service',
    namespace: 'payload',
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

const deployDevRedis = async ({ namespace }) => {
  const redisDeployer = new Job(`redis-deployer`, 'linkyard/docker-helm:2.8.2')
  redisDeployer.tasks = echoedTasks([
    'helm init --client-only',
    `helm upgrade --install redis stable/redis --namespace ${namespace} --set usePassword=false --debug --dry-run`,
    `helm upgrade --install redis stable/redis --namespace ${namespace} --set usePassword=false`,
  ])
  await redisDeployer.run()
}

const deployDevMongodb = async ({ namespace }) => {
  const redisDeployer = new Job(
    `mongodb-deployer`,
    'linkyard/docker-helm:2.8.2',
  )
  redisDeployer.tasks = echoedTasks([
    'helm init --client-only',
    `helm upgrade --install mongodb stable/mongodb --usePassword=false --namespace ${namespace} --debug --dry-run`,
    `helm upgrade --install mongodb stable/mongodb --usePassword=false --namespace ${namespace}`,
  ])
  await redisDeployer.run()
}

events.on('deploy-dev-mongodb', () => {
  deployDevMongodb({ namespace: 'payload' })
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

events.on('deploy-minikube-services', async (event, payload) => {
  // deploy istio
  await Promise.all([
    deployDevRedis({ namespace: 'payload' }),
    deployDevMongodb({ namespace: 'payload' }),
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
})
