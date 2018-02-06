const RPCClient = require('@hharnisc/micro-rpc-client')
const parseCommandsAndFiles = require('./parseCommandsAndFiles')
const runScripts = require('./runScripts')
const calculateFileSizes = require('./calculateFileSizes')
const cloneRepo = require('./cloneRepo')
const cleanup = require('./cleanup')

const runServiceClient = new RPCClient({
  url: 'http://run-service:3000/rpc',
})

module.exports = async ({
  owner,
  repo,
  repoId,
  accessToken,
  sha,
  branch,
  logger,
  workingDirBase = '/tmp',
}) => {
  logger.info('Checking for existing run')
  let run
  try {
    run = await runServiceClient.call('getRun', {
      owner,
      repo,
      sha,
    })
  } catch (error) {}

  if (run && run.start && !run.stop) {
    const message = 'Another worker is processing this run'
    logger.info(message, { run })
    throw new Error(message)
  } else if (run) {
    return run.fileSizes
  }

  const { id } = await runServiceClient.call('createRun', {
    owner,
    repo,
    repoId,
    branch,
    sha,
  })
  logger.info('Run Starting', { id })
  await runServiceClient.call('startRun', {
    id,
  })

  let error
  let fileSizes
  try {
    await cloneRepo({
      owner,
      repo,
      sha,
      accessToken,
      logger,
    })
    const { scripts, files } = await parseCommandsAndFiles({
      sha,
      logger,
      workingDirBase,
    })

    console.log('scripts', scripts)
    console.log('files', files)

    await runScripts({ scripts, sha, logger, workingDirBase })
    fileSizes = await calculateFileSizes({ sha, files, logger, workingDirBase })
    await runServiceClient.call('stopRun', {
      id,
      fileSizes,
    })
    logger.info('Run Complete', { id })
  } catch (e) {
    error = e
    logger.info('Run Failed', { id, error: error.message })
    await runServiceClient.call('stopRun', {
      id,
      errorMessage: error.message,
    })
  }
  await cleanup({
    sha,
  })
  if (error) {
    throw error
  }
  return fileSizes
}
