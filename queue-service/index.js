const Redis = require('ioredis')
const uuidv4 = require('uuid/v4')
const {
  rpc,
  method,
  createError,
} = require('@hharnisc/micro-rpc')
const {
  router,
  get,
  post,
} = require('microrouter')
const { send } = require('micro');

const redis = new Redis({
  host: 'redis',
  port: 6379
})

const processingQueue = ({
  queue
}) =>
  `${queue}:processing`


const deleteProcessingTask = async ({
  queue,
  item,
}) => {
  const remove = await redis.lrem(processingQueue({ queue }), 0, JSON.stringify(item))
  const { taskId } = item
  const leaseRemove = await redis.del(taskId)
  return {
    remove,
    leaseRemove,
  };
};

// TODO: split these into files
// TODO: check worker name at each stage
// TODO: need utils for checking worker names etc...
// TODO: garbage collection endpoint
const rpcHandler = rpc(
  method('createTask', async ({
    queue,
    task,
    retries=0,
    lease=60, // seconds
  }) => {
    if (!queue) {
      throw createError({
        message: 'please provide a queue',
      })
    }
    if (!task) {
      throw createError({
        message: 'please provide a task',
      })
    }
    await redis.lpush(queue, JSON.stringify({
      taskId: uuidv4(),
      task,
      retries,
      lease,
    }))
    return { status: 'OK' }
  }),
  method('processTask', async ({
    queue,
    workerName,
  }) => {
    if (!workerName) {
      throw createError({
        message: 'please provide a workerName',
      })
    }
    if (!queue) {
      throw createError({
        message: 'please provide a queue',
      })
    }
    const item = await redis.rpoplpush(
      queue,
      processingQueue({ queue })
    )
    if (item) {
      const {
        lease,
        taskId,
      } = JSON.parse(item)
      await redis.setex(taskId, lease, workerName)
    }
    return JSON.parse(item)
  }),
  method('extendLease', async ({
    item,
    workerName,
  }) => {
    if (!item) {
      throw createError({
        message: 'please provide an item',
      })
    }
    if (!workerName) {
      throw createError({
        message: 'please provide a workerName',
      })
    }
    const { taskId, lease } = item
    const leaseWorkerName = await redis.get(taskId)
    if (!leaseWorkerName) {
      throw createError({
        message: 'could not find existing lease',
      })
    }
    if (leaseWorkerName !== workerName) {
      throw createError({
        message: 'workerName does not match current worker lease',
      })
    }
    await redis.setex(taskId, lease, workerName)
    return { status: 'OK' }
  }),
  method('failTask', async ({
    queue,
    item,
  }) => {
    if (!queue) {
      throw createError({
        message: 'please provide a queue',
      })
    }
    if (!item) {
      throw createError({
        message: 'please provide an item',
      })
    }
    const { taskId, retries } = item
    const leaseWorkerName = await redis.get(taskId)
    if (!leaseWorkerName) {
      throw createError({
        message: 'could not find existing lease',
      })
    }
    if (retries > 0) {
      await redis.lpush(queue, JSON.stringify({
        ...item,
        retries: retries - 1,
      }))
    }
    await deleteProcessingTask({
      queue,
      item,
    })
    return { status: 'OK' }
  }),
  method('completeTask', async ({
    queue,
    item,
  }) => {
    if (!item) {
      throw createError({
        message: 'please provide an item',
      })
    }
    if (!queue) {
      throw createError({
        message: 'please provide a queue',
      })
    }
    const { taskId } = item
    const leaseWorkerName = await redis.get(taskId)
    if (!leaseWorkerName) {
      throw createError({
        message: 'could not find existing lease',
      })
    }
    await deleteProcessingTask({
      queue,
      item,
    })
    return { status: 'OK' }
  }),
)

const healthHandler = async (req, res) => {
  try {
    await redis.ping()
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: 'cannot reach redis',
    })
  }
}

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
