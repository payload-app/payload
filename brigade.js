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

const helmDeployerJob = async ({
  event,
  baseDir,
  valuesFile,
  name,
  chart,
  namespace,
}) => {
  // do helm deploy
  const helmDeployer = new Job(
    `helm-deployer-${baseDir}`,
    'linkyard/docker-helm:2.8.2',
  )
  helmDeployer.tasks = echoedTasks([
    `cd /src/${baseDir}`,
    'helm init --client-only',
    `helm upgrade --install ${name} ../charts/${chart} --namespace ${namespace} --values ${valuesFile} --set image.tag=${
      event.revision.commit
    } --debug --dry-run`,
    `helm upgrade --install ${name} ../charts/${chart} --namespace ${namespace} --values ${valuesFile} --set image.tag=${
      event.revision.commit
    }`,
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

events.on('deploy-session-service', deploySessionService)
// TODO: need to do a redis deployment
events.on('deploy-queue-service', deployQueueService)
// TODO: need to do a redis deployment
events.on('deploy-random-state-service', deployRandomStateService)
events.on('deploy-github-service', deployGithubService)
// TODO: need to do a mongodb deployment
events.on('deploy-organization-service', deployOrganizationService)
// TODO: need to do a mongodb deployment
events.on('deploy-user-service', deployUserService)
// TODO: need to do a mongodb deployment
events.on('deploy-run-service', deployRunService)
// TODO: need to do a mongodb deployment
events.on('deploy-repo-service', deployRepoService)
events.on('deploy-init-db-job', deployInitDbJob)
events.on('deploy-status-broadcaster-service', deployStatusBroadcasterService)
events.on('deploy-backend-service', deployBackendService)
events.on('deploy-frontend-service', deployFrontendService)

events.on('deploy-minikube-services', async (event, payload) => {
  // deploy istio
  // deploy local redis
  // deploy local mongodb
  // ... then

  // have no dependencies
  await Promise.all([
    deployRandomStateService(event, payload),
    deploySessionService(event, payload),
    deployStatusBroadcasterService(event, payload),
    deployInitDbJob(event, payload),
  ])

  await Promise.all([
    // TODO: need to do a redis deployment
    deployQueueService(event, payload),
    // TODO: need to do a redis deployment
    deployGithubService(event, payload),
  ])

  await Promise.all([
    // TODO: need to do a mongodb deployment
    deployOrganizationService(event, payload),
    // TODO: need to do a mongodb deployment
    deployUserService(event, payload),
    // TODO: need to do a mongodb deployment
    deployRunService(event, payload),
    // TODO: need to do a mongodb deployment
    deployRepoService(event, payload),
  ])

  await deployBackendService(event, payload)
  await deployFrontendService(event, payload)
})
