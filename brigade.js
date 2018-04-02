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
  const yaml2json = new Job('yaml2json', 'simplealpine/yaml2json')
  yaml2json.tasks = [`cd /src/${baseDir}`, `yaml2json < ${valuesFile}`]
  const result = await yaml2json.run()
  return result.toString()
}

const dockerBuilderJob = async ({ event, payload, dockerImage, baseDir }) => {
  // build docker image
  const dockerBuilder = new Job('docker-builder', 'docker:stable-dind')
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
  const helmDeployer = new Job('helm-deployer', 'linkyard/docker-helm:2.8.2')
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

events.on(
  'deploy-session-service',
  async (event, payload) =>
    await deployService({
      event,
      payload,
      baseDir: 'session-service',
      valuesFile: 'values.yaml',
      chart: 'payload-service',
      namespace: 'payload',
    }),
)

// TODO: need to do a redis deployment
events.on(
  'deploy-queue-service',
  async (event, payload) =>
    await deployService({
      event,
      payload,
      baseDir: 'queue-service',
      valuesFile: 'values.yaml',
      chart: 'payload-service',
      namespace: 'payload',
    }),
)

// TODO: need to do a redis deployment
events.on(
  'deploy-random-state-service',
  async (event, payload) =>
    await deployService({
      event,
      payload,
      baseDir: 'random-state-service',
      valuesFile: 'values.yaml',
      chart: 'payload-service',
      namespace: 'payload',
    }),
)

events.on(
  'deploy-github-service',
  async (event, payload) =>
    await deployService({
      event,
      payload,
      baseDir: 'github-service',
      valuesFile: 'values.yaml',
      chart: 'payload-service',
      namespace: 'payload',
    }),
)

// TODO: need to do a mongodb deployment
events.on(
  'deploy-organization-service',
  async (event, payload) =>
    await deployService({
      event,
      payload,
      baseDir: 'organization-service',
      valuesFile: 'values.yaml',
      chart: 'payload-service',
      namespace: 'payload',
    }),
)

events.on(
  'deploy-init-db',
  async (event, payload) =>
    await deployService({
      event,
      payload,
      baseDir: 'init-db',
      valuesFile: 'values.yaml',
      chart: 'payload-job',
      namespace: 'payload',
    }),
)
