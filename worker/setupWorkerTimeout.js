const { broadcastRunError } = require('./broadcast')
const cleanup = require('./cleanup')

module.exports = ({
  taskId,
  maxLease,
  queue,
  workerName,
  logger,
  runId,
  accessToken,
  owner,
  repo,
  branch,
  sha,
  ownerType,
  type,
  workingDirBase,
  queueServiceClient,
  runServiceClient,
}) => {
  const timeoutId = setTimeout(async () => {
    const errorMessage = `Worker lease expired after ${maxLease} seconds`
    logger.error({ message: errorMessage })
    try {
      await queueServiceClient.call('failTask', {
        queue,
        workerName,
        taskId,
        handled: true,
        errorMessage,
      })
      await runServiceClient.call('stopRun', {
        id: runId,
        errorMessage,
      })
      await broadcastRunError({
        accessToken,
        owner,
        repo,
        branch,
        sha,
        ownerType,
        type,
        errorMessage,
      })
      await cleanup({
        sha,
        workingDirBase,
        logger,
      })
    } catch (error) {
      logger.error({
        message: 'Uncaught Error In setupWorkerTimeout',
        data: {
          stack: error.stack,
          error: error.message,
        },
      })
    }
    process.exit(1)
  }, maxLease * 1000)

  return () => clearTimeout(timeoutId)
}
