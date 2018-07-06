const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ repoServiceClient }) => async ({ ids }) => {
  try {
    return await repoServiceClient.call('getRepos', { ids })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
